'use client';
import { Table, TableColumnsType, Skeleton } from 'antd';
import React, { useEffect, useRef } from 'react';
import { Typography, Divider } from 'antd';
import { useImmerReducer } from 'use-immer';
import { CloseOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useSWRFetcher } from '@/utils/useSwrFetcher';

const { Title } = Typography;

export default function Index({ session }: any) {
  const [state, dispatch] = useImmerReducer(stateReducer, initialState);
  const { data: dataChat, error, isLoading, mutate } = useSWRFetcher<any>({
    key: ['api/chat/all'],
    session,
    axiosOptions: {
      params: {
        page: state.filters.page,
        limit: state.filters.limit
      }
    }
  });

  const chatContentRef: any = useRef(null);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTo({
        top: chatContentRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [state.chatContent]);

  // const [selectedRowKey, setSelectedRowKey] = useState<null | React.Key>(null);

  interface DataType {
    key: React.Key;
    user: string;
    message: string;
    date: string;
  }

  const columns: TableColumnsType<DataType> = [
    {
      title: 'No',
      dataIndex: 'key',
      key: 'key',
      width: '20px',
      render: () => (
        <div className="bg-primary bg-opacity-10 rounded-full px-3 py-2">
          <UserOutlined />
        </div>
      ),
    },
    {
      title: 'User',
      dataIndex: ['user', 'name'],
      key: 'user',
      render: (text, record: any, index) => {
        const [email, name] = [record?.user?.email, record?.user?.name];
        return (
          <div>
            <div className="flex flex-col">
              <p className="font-bold">{name}</p>
              <p className="text-xs">{email}</p>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Last Message',
      dataIndex: 'message',
      key: 'message',
      render: (record) => {
        const lastMessage = record?.[record.length - 1]; //sender, text

        return (
          <div>
            <div className="flex gap-2">
              <p className="font-semibold text-md">{lastMessage?.sender}:</p>
              <p>{lastMessage?.text}</p>
            </div>
            <div className="text-xs text-gray-500">
              {moment(lastMessage?.timestamp).format('MMMM D, YYYY h:mm A')}
            </div>
          </div>
        );
      },
    },
  ];

  const data = dataChat?.data?.results ?? [];

  return (
    <div>
      <Title level={4}>History Chat</Title>
      <Divider />
      <div className="flex h-max gap-4" style={{ minHeight: '78vh' }}>
        <div className="w-2/3 rounded-full">
          {isLoading ? (
            <Skeleton loading={isLoading} active={true} />
          ) : (
            <Table
              showHeader={false}
              columns={columns}
              dataSource={data}
              rowClassName={(record: any) =>
                (record.uuid === state.selectedRowKey ? 'bg-primary' : '') +
                '!cursor-pointer !rounded'
              }
              onRow={(record, index) => {
                return {
                  onClick: () => {
                    dispatch({
                      type: 'set record',
                      payload: {
                        showChat: true,
                        selectedRowKey: record.uuid,
                        chatContent: record,
                      },
                    });
                  },
                };
              }}
              pagination={{
                current: state.filters.page,
                pageSize: state.filters.limit,
                total: dataChat?.data?.totalDocs,
                onChange: (page, pageSize) => {
                  dispatch({
                    type: 'set filters',
                    payload: {
                      limit: pageSize,
                      page,
                    },
                  });
                },
              }}
            />
          )}
        </div>

        {state.showChat ? (
          <div className="w-1/3 bg-white rounded">
            <div className="bg-primary text-red flex justify-between p-2">
              <div>
                <h4 className="text-white font-bold text-lg">
                  {state.chatContent?.user?.name}
                </h4>
              </div>
              <CloseOutlined
                style={{ color: 'white' }}
                onClick={() => dispatch({ type: 'set show chat' })}
              />
            </div>
            <div className="p-4">
              <div
                ref={chatContentRef}
                className="flex flex-col flex-grow overflow-auto"
                style={{ height: '525px' }}
              >
                {state.chatContent.message.length &&
                  state.chatContent.message.map((data: any, index: number) =>
                    data.sender === 'vhiobot' ? (
                      <>
                        <div
                          key={index}
                          className="flex w-full mt-2 space-x-3 max-w-xs"
                        >
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                          <div>
                            <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                              <p className="text-sm">{data.text}</p>
                            </div>
                            <span className="text-xs text-gray-500 leading-none">
                              {moment(data.timestamp).format('h:mm A')}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          key={index}
                          className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end"
                        >
                          <div>
                            <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                              <p className="text-sm">
                                {typeof data.text === 'object'
                                  ? data.text.message
                                  : data.text}
                              </p>
                            </div>
                            <span className="text-xs text-gray-500 leading-none">
                              {moment(data.timestamp).format('h:mm A')}
                            </span>
                          </div>
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                        </div>
                      </>
                    ),
                  )}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-1/3 relative" style={{ height: '600px' }}>
            <div className="bg-primary blur-sm text-red flex justify-between p-6"></div>
            <div className="bg-white blur-sm" style={{ height: '575px' }}></div>
            <div
              className="flex mx-auto items-center absolute top-10 left-24"
              style={{ height: '500px' }}
            >
              <p className="text-lg text-center w-full text-gray-400">
                Click a chat from the list
                <br />
                to show detailed chat history
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface initialStateType {
  selectedRowKey: null | React.Key;
  showChat: boolean;
  chatContent: Record<string, any>;
  filters: Record<string, any>;
}

const initialState: initialStateType = {
  selectedRowKey: null,
  showChat: false,
  chatContent: {},
  filters: {
    page: 1,
    limit: 10,
  },
};

function stateReducer(draft: any, action: any) {
  switch (action.type) {
    case 'set record':
      draft.selectedRowKey = action.payload.selectedRowKey;
      draft.showChat = action.payload.showChat;
      draft.chatContent = action.payload.chatContent;
      break;
    case 'set filters':
      draft.filters = { ...draft.filters, ...action.payload };
      break;
    case 'set show chat':
      draft.showChat = !draft.showChat;
      break;
  }
}
