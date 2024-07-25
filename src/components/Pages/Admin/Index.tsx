'use client';
import React, { useEffect, useMemo } from 'react';
import {
  Typography,
  Divider,
  Card,
  DatePicker,
  Tooltip,
  Select,
  Spin,
  Skeleton,
} from 'antd';
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

    const seriesData = [activeUserData, conversationData];

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

  const optionsSeries: any = {
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
      enabled: false,
    },
    markers: {
      size: 0,
    },
  }; // Empty dependency array means this will only run once

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
      type: 'push seriesActiveUser',
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
      dispatch({
        type: 'set loading',
        payload: false,
      });
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
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3  w-full">
          <Spin spinning={state.loading || isLoading}>
            <Card style={{ background: '#4942E4', height: 500 }}>
              <div className="flex flex-col lg:flex-row gap-4 lg:justify-between">
                <p className="font-semibold text-white">
                  {state.dateStart
                    ? `Graph Data from ${state.selectedPeriod === 'monthly' ? moment(state.dateStart).format('MMMM YYYY') : state.dateStart} to ${state.selectedPeriod === 'monthly' ? moment(state.dateEnd).format('MMMM YYYY') : state.dateEnd}`
                    : 'Realtime Active User'}
                </p>
                <div className="flex flex-col lg:flex-row gap-4">
                  <Select
                    options={optionsPeriod}
                    defaultValue={state.selectedPeriod}
                    onChange={(value) => {
                      dispatch({
                        type: 'set selectedPeriod',
                        payload: value,
                      });
                    }}
                  />
                  <DatePicker.RangePicker
                    placement="topRight"
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
                        dispatch({
                          type: 'set dateStart',
                          payload: state.selectedPeriod === 'mothly' ? value[0].startOf('month').format('YYYY-MM-DD') : value[0].format('YYYY-MM-DD'),
                        });

                        dispatch({
                          type: 'set dateEnd',
                          payload: state.selectedPeriod === 'mothly' ? value[1].startOf('month').format('YYYY-MM-DD') :value[1].format('YYYY-MM-DD'),
                        });

                        state.socketConn?.off('activeUser');
                        state.socketConn?.disconnect();

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
                        dispatch({
                          type: 'set loading',
                          payload: true,
                        });
                        state.socketConn?.connect();
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
                          type: 'reset seriesActiveUser',
                        });

                        dispatch({
                          type: 'set loading',
                          payload: false,
                        });
                      }
                      // }
                    }}
                  />
                </div>
              </div>
              {state.dateStart ? (
                <ReactApexChart
                  options={{
                    ...optionsSeries,
                    ...{
                      yaxis: {
                        floating: false,
                        min: 0,
                      },
                      xaxis: {
                        type: 'datetime',
                        labels: {
                          datetimeUTC: false, // Display dates in local time
                          formatter: function (value: number) {
                            return moment(value).format('YYYY-MM-DD');
                          },
                        },
                      },
                      tooltip: {
                        enabled: true,
                        x: {
                          formatter: function (value: number) {
                            return moment(value).format('YYYY-MM-DD');
                          },
                        },
                      },
                    },
                  }}
                  series={[
                    {
                      name: 'Active User',
                      data: [...state.seriesActiveUser],
                    },
                    {
                      name: 'Conversation',
                      data: [...state.seriesConversation],
                    },
                  ]}
                  type="line"
                  width={'100%'}
                  height={400}
                />
              ) : (
                <ReactApexChart
                  options={optionsSeries}
                  series={[
                    {
                      name: 'Active User',
                      data: [...state.seriesActiveUser],
                    },
                  ]}
                  type="line"
                  width={'100%'}
                  height={400}
                />
              )}
            </Card>
          </Spin>
        </div>
        <div className="flex-col gap-6 lg:w-1/3 w-full">
          <Card style={{ background: '#fff' }}>
            <Skeleton active loading={state.loading || isLoading}>
              <div className="flex gap-2">
                <p className="font-semibold">
                  Total User Chat {state.dateStart ? '' : 'Today'}
                </p>
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
            </Skeleton>
          </Card>
          <Card style={{ background: '#fff' }}>
            <Skeleton active loading={state.loading || isLoading}>
              <div className="flex gap-2">
                <p className="font-semibold">
                  Total Conversation {state.dateStart ? '' : 'Today'}
                </p>
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
            </Skeleton>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface initialStateType {
  seriesActiveUser: any;
  seriesConversation: any;
  totalUserDaily: Number;
  totalConversation: Number;
  socketConn: Socket | null;
  socketRunning: boolean;
  stardateChecked: any;
  selectedPeriod: string;
  dateStart?: any;
  dateEnd?: any;
  loading: boolean;
}

const initialState: initialStateType = {
  seriesActiveUser: [],
  seriesConversation: [],
  totalUserDaily: 0,
  totalConversation: 0,
  socketConn: null,
  socketRunning: true,
  stardateChecked: undefined,
  selectedPeriod: 'daily',
  dateStart: undefined,
  dateEnd: undefined,
  loading: true,
};

function stateReducer(draft: any, action: any) {
  switch (action.type) {
    case 'set series':
      draft.seriesActiveUser = action.payload[0];
      draft.seriesConversation = action.payload[1];
      break;
    case 'reset seriesActiveUser':
      draft.seriesActiveUser = [];
      break;
    case 'push seriesActiveUser':
      const newDataPoint = action.payload;
      if (draft.seriesActiveUser.length >= 10) {
        draft.seriesActiveUser.shift();
      }
      draft.seriesActiveUser.push(newDataPoint);
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
    case 'set loading':
      draft.loading = action.payload;
      break;
  }
}
