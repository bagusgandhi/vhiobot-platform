'use client';
import React, { useEffect, useMemo } from 'react';
import { Typography, Divider, Card, DatePicker, Tooltip, Select } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
const { Title } = Typography;
import io, { Socket } from 'socket.io-client';
import { useImmerReducer } from 'use-immer';
import moment from 'moment';
import { useSWRMutationFetcher } from '@/utils/useSweFetcherMutation';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

export default function Index() {
  const [state, dispatch] = useImmerReducer(stateReducer, initialState);
  const optionsPeriod = [
    { value: 'daily', label: 'Daily' },
    { value: 'monthly', label: 'Monthly' },
  ];

  const picketMap: any = {
    daily: undefined,
    monthly: 'month',
  };

  const { trigger: getAnalytics, isMutating: isLoading } =
    useSWRMutationFetcher({
      key: [`api/analytics`],
      axiosOptions: {
        method: 'GET',
        url: `api/analytics`,
      },
    });

  const handlerGetAnalytics = async (params: any) => {
    const { data }: any = await getAnalytics(params);

    const activeUserData = data?.data.map((item: any) => ({
      x: item.created_at,
      y: item.activeUser,
    }));

    const conversationData = data?.data.map((item: any) => ({
      x: item.created_at,
      y: item.conversation,
    }));

    const seriesData = [
      {
        name: 'Active User',
        data: activeUserData,
      },
      {
        name: 'Conversation',
        data: conversationData,
      },
    ];

    const totalActiveUsers = data?.data.reduce(
      (acc: number, cur: any) => acc + cur.activeUser,
      0,
    );
    const totalConversations = data?.data.reduce(
      (acc: number, cur: any) => acc + cur.conversation,
      0,
    );

    dispatch({
      type: 'set totalUserDaily',
      payload: totalActiveUsers,
    });

    dispatch({
      type: 'set totalConversation',
      payload: totalConversations,
    });

    dispatch({
      type: 'set series',
      payload: seriesData,
    });
  };

  const options: any = useMemo(
    () => ({
      chart: {
        id: 'realtime',
        foreColor: '#fff',
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000,
          },
        },
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: ['#FF0080', '#00f7ff'],
      stroke: {
        curve: 'stepline',
      },
      xaxis: {
        type: 'datetime',
        tickAmount: 10,
        labels: {
          datetimeUTC: false, // Display dates in local time
          formatter: function (value: number) {
            console.log('options', state.dateStart);
            return moment(value).format('HH:mm:ss');
          },
        },
      },
      yaxis: {
        stepSize: 1,
        floating: false,
        min: 0,
      },
      tooltip: {
        x: {
          formatter: function (value: number) {
            return moment(value).format('YYYY-MM-DD HH:mm:ss');
          },
        },
      },
      markers: {
        size: 0,
      },
    }),
    [state.dateStart],
  ); // Empty dependency array means this will only run once

  useEffect(() => {
    const conn = io(process.env.NEXT_PUBLIC_SOCKET_URL!);
    // init socket conn
    dispatch({
      type: 'set socketConn',
      payload: conn,
    });

    return () => {
      if (conn) {
        conn.disconnect();
      }
    };
  }, []);

  const handleActiveUser = (msg: any) => {
    dispatch({
      type: 'push series',
      payload: msg[0],
    });

    dispatch({
      type: 'set totalUserDaily',
      payload: msg[1] ?? 0,
    });

    dispatch({
      type: 'set totalConversation',
      payload: msg[2] ?? 0,
    });
  };

  useEffect(() => {
    if (state.socketConn) {
      state.socketConn.on('activeUser', handleActiveUser);
    }

    return () => {
      if (state.socketConn) {
        state.socketConn.off('activeUser');
        state.socketConn.disconnect();
      }
    };
  }, [state.socketConn]);

  return (
    <div>
      <Title level={4}>Dashboard</Title>
      <Divider />
      <div className="flex gap-6">
        <div className="w-2/3">
          <Card style={{ background: '#4942E4' }}>
            <div className="flex justify-between">
              <p className="font-semibold text-white">
                {state.dateStart
                  ? `Graph Data from ${state.dateStart} to ${state.dateEnd}`
                  : 'Realtime Active User'}
              </p>
              <div className="flex gap-4">
                <Select
                  options={optionsPeriod}
                  style={{ width: 100 }}
                  defaultValue={state.selectedPeriod}
                  onChange={(value) => {
                    dispatch({
                      type: 'set selectedPeriod',
                      payload: value,
                    });
                  }}
                />
                <DatePicker.RangePicker
                  picker={picketMap[state.selectedPeriod]}
                  onCalendarChange={(value: any) => {
                    if (value && value[0]) {
                      dispatch({
                        type: 'set stardateChecked',
                        payload: value[0].format('YYYY-MM-DD'),
                      });
                    } else {
                      dispatch({
                        type: 'set stardateChecked',
                        payload: undefined,
                      });
                    }
                  }}
                  disabledDate={(current) => {
                    if (
                      state.stardateChecked &&
                      state.selectedPeriod === 'daily'
                    ) {
                      // Disable dates more than 60 days before the start date
                      const isBeforeLimit =
                        current &&
                        current <
                          moment(state.stardateChecked)
                            .subtract(60, 'days')
                            .startOf('day');
                      // Disable dates after today
                      const isAfterToday =
                        current && current > moment().endOf('day');
                      return isBeforeLimit || isAfterToday;
                    }

                    return current && current > moment().endOf('day');
                  }}
                  onChange={async (value: any[]) => {
                    if (value) {
                      console.log(value[0].format('YYYY-MM-DD'));
                      console.log(value[1].format('YYYY-MM-DD'));

                      dispatch({
                        type: 'set dateStart',
                        payload: value[0].format('YYYY-MM-DD'),
                      });

                      dispatch({
                        type: 'set dateEnd',
                        payload: value[1].format('YYYY-MM-DD'),
                      });

                      state.socketConn?.off('activeUser');

                      const params: any = {
                        params: {
                          dateStart:
                            state.selectedPeriod === 'monthly'
                              ? value[0].startOf('month').format('YYYY-MM-DD')
                              : value[0].format('YYYY-MM-DD'),
                          dateEnd:
                            state.selectedPeriod === 'monthly'
                              ? value[1].endOf('month').format('YYYY-MM-DD')
                              : value[1].format('YYYY-MM-DD'),
                          period: state.selectedPeriod,
                        },
                      };
                      await handlerGetAnalytics(params);
                    } else {
                      // if(state.socketConn){
                      state.socketConn?.on('activeUser', handleActiveUser);

                      dispatch({
                        type: 'set totalUserDaily',
                        payload: 0,
                      });

                      dispatch({
                        type: 'set totalConversation',
                        payload: 0,
                      });

                      dispatch({
                        type: 'set dateStart',
                        payload: undefined,
                      });

                      dispatch({
                        type: 'set dateEnd',
                        payload: undefined,
                      });

                      dispatch({
                        type: 'set series',
                        payload: [
                          {
                            name: 'Active User',
                            data: [],
                          },
                        ],
                      });
                    }
                    // }
                  }}
                />
              </div>
            </div>
            <ReactApexChart
              options={options}
              series={state.series}
              type="line"
              width={'100%'}
              height={400}
            />
          </Card>
        </div>
        <div className="flex flex-col gap-6 w-1/3">
          <Card style={{ background: '#fff' }}>
            <div className="flex gap-2">
              <p className="font-semibold">Total User Chat {state.dateStart ? '' : 'Today'}</p>
              <Tooltip
                placement="top"
                title={'This is total user chat'}
                arrow={true}
              >
                <InfoCircleOutlined />
              </Tooltip>
            </div>
            <h3 className="text-3xl text-center py-4 font-semibold">
              {state.totalUserDaily.toString()}
            </h3>
          </Card>
          <Card style={{ background: '#fff' }}>
            <div className="flex gap-2">
              <p className="font-semibold">Total Conversation {state.dateStart ? '' : 'Today'}</p>
              <Tooltip
                placement="top"
                title={
                  'This is total message that bot has been deliver to user'
                }
                arrow={true}
              >
                <InfoCircleOutlined />
              </Tooltip>
            </div>
            <h3 className="text-3xl text-center py-4 font-semibold">
              {state.totalConversation.toString()}
            </h3>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface initialStateType {
  series: any;
  totalUserDaily: Number;
  totalConversation: Number;
  socketConn: Socket | null;
  socketRunning: boolean;
  stardateChecked: any;
  selectedPeriod: string;
  dateStart?: any;
  dateEnd?: any;
}

const initialState: initialStateType = {
  series: [
    {
      name: 'Active User',
      data: [],
    },
  ],
  totalUserDaily: 0,
  totalConversation: 0,
  socketConn: null,
  socketRunning: true,
  stardateChecked: undefined,
  selectedPeriod: 'daily',
  dateStart: undefined,
  dateEnd: undefined,
};

function stateReducer(draft: any, action: any) {
  switch (action.type) {
    case 'set series':
      draft.series = action.payload;
      break;
    case 'push series':
      const newDataPoint = action.payload;
      if (draft.series[0].data.length >= 10) {
        draft.series[0].data.shift();
      }
      draft.series[0].data.push(newDataPoint);
      break;
    case 'set socketConn':
      draft.socketConn = action.payload;
      break;
    case 'set totalUserDaily':
      draft.totalUserDaily = action.payload;
      break;
    case 'set totalConversation':
      draft.totalConversation = action.payload;
      break;
    case 'set socketRunning':
      draft.socketRunning = action.payload;
      break;
    case 'set stardateChecked':
      draft.stardateChecked = action.payload;
      break;
    case 'set selectedPeriod':
      draft.selectedPeriod = action.payload;
      break;
    case 'set dateStart':
      draft.dateStart = action.payload;
      break;
    case 'set dateEnd':
      draft.dateEnd = action.payload;
      break;
  }
}
