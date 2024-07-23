'use client';
import React from 'react';
import {
  Typography,
  Divider,
  TableColumnsType,
  Table,
  Skeleton,
  Popconfirm,
  notification,
  Button,
} from 'antd';
import Link from 'next/link';
const { Title } = Typography;
import moment from 'moment';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import ButtonSmall from '@/components/Button/ButtonSmall';
import { useSWRFetcher } from '@/utils/useSwrFetcher';
import { useImmerReducer } from 'use-immer';
import { useSWRMutationFetcher } from '@/utils/useSweFetcherMutation';

export default function Index({ session }: any) {
  const [state, dispatch] = useImmerReducer(stateReducer, initialState);

  const { trigger: deleteIntent, isMutating: deleteLoading } =
    useSWRMutationFetcher({
      session,
      key: [''],
      axiosOptions: {
        method: 'DELETE',
      },
      swrOptions: {
        onSuccess: (data: any) => {
          notification['success']({
            message: 'Intent Deleted',
            description: 'Intent Data has been deleted',
          });
        },
      },
    });

  interface DataType {
    key: React.Key;
    title: any;
    date: string;
  }

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Title',
      dataIndex: 'displayName',
      render: (text, record, index) => (
        <div>
          <div className="flex flex-col">
            <p className="font-bold">{text}</p>
            <p className="text-xs">
              {moment(record?.date).format('MMMM D, YYYY h:mm A')}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Action',
      width: 100,
      render: (record, index) => (
        <div className="flex items-center">
          <Link href={`/admin/intent/${record.uuid}`}>
            <ButtonSmall
              info="Edit Intent"
              positionTooltip="bottomRight"
              icon={
                <EditOutlined
                  style={{ fontSize: '16px', color: '#4942E4' }}
                  className=""
                />
              }
            />
          </Link>
          <div className="px-1"></div>
          <Popconfirm
            className="mr-4"
            title="Delete Intent"
            description="Are you sure to delete this intent?"
            okText="Yes"
            cancelText="No"
            onConfirm={async () => {
              // delete
              const url: any = { url: `api/intent/${record.uuid}` };
              await deleteIntent(url);
              // revalidate
              await mutateIntent();
            }}
          >
            <ButtonSmall
              info="Delete Intent"
              positionTooltip="bottomRight"
              bg="!bg-red-300"
              icon={
                <DeleteOutlined
                  style={{ fontSize: '16px', color: 'red' }}
                  className=""
                />
              }
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const {
    data: dataIntent,
    isLoading,
    mutate: mutateIntent,
  } = useSWRFetcher<any>({
    key: ['api/intent'],
    session,
    axiosOptions: {
      params: {
        page: state.filters.page,
        limit: state.filters.limit,
      },
    },
  });

  return (
    <div>
      <Title level={4}>Manage Intent</Title>
      <Divider />
      {isLoading ? (
        <Skeleton loading={isLoading} active={true} />
      ) : (
        <>
          <div className='flex justify-end my-4'>
            <Link href={'/admin/intent-create'}>
              <Button icon={<PlusOutlined />} type="primary">Create New Intent</Button>
            </Link>
          </div>
          <Table
            columns={columns}
            dataSource={dataIntent?.data?.results}
            showHeader={false}
          />
        </>
      )}
    </div>
  );
}

interface initialStateType {
  filters: Record<string, any>;
}

const initialState: initialStateType = {
  filters: {
    page: 1,
    limit: 10,
  },
};

function stateReducer(draft: any, action: any) {
  switch (action.type) {
    case 'set filters':
      draft.filters = { ...draft.filters, ...action.payload };
      break;
  }
}
