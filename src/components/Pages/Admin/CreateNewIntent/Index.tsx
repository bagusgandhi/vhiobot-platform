'use client';
import React, { useEffect } from 'react';
import {
  Typography,
  Divider,
  Input,
  List,
  Tooltip,
  Button,
  Form,
  message,
  notification,
  Skeleton,
} from 'antd';
import {
  DeleteOutlined,
  InfoCircleOutlined,
  NumberOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import ButtonSmall from '@/components/Button/ButtonSmall';
import { useImmerReducer } from 'use-immer';
import { useSWRMutationFetcher } from '@/utils/useSweFetcherMutation';
import InputIntent from '@/components/Input/InputIntent';
const { Title } = Typography;

export default function Index({ session }: any) {
  const [state, dispatch] = useImmerReducer(stateReducer, initialState);
  const [messageApi, contextHolder] = message.useMessage();
  const [formIntent] = Form.useForm();

  const { trigger: createIntent, isMutating: createLoading } =
    useSWRMutationFetcher({
      session,
      key: [`api/intent`],
      axiosOptions: {
        method: 'POST',
        url: `api/intent`,
      },
      swrOptions: {
        onSuccess: (data: any) => {
          notification['success']({
            message: 'Intent Created',
            description: 'Intent Data has been created',
          });
        },
      },
    });

  const submitHandler = () => {
    const displayName = formIntent.getFieldValue('displayName');
    const data: any = {
      data: {
        displayName,
        trainingPhrasesParts: state.trainingPhrases,
        messageTexts: state.responseTexts,
      },
    };

    createIntent(data);
    formIntent.resetFields()
  };

  return (
    <div className="pr-6">
      {contextHolder}
      <Title level={4}>Create Intent</Title>
      <Divider />
      <Form layout="vertical" form={formIntent} onFinish={submitHandler}>
        <div className="flex">
          <Form.Item
            name="displayName"
            className="w-5/6"
            rules={[
              { required: true, message: 'Please input your Intent Title!' },
            ]}
          >
            <Input placeholder="Intent Title" size="large" />
          </Form.Item>
          <div className="py-2 pl-2">
            <Tooltip
              placement="top"
              title={'This your intent title group naming'}
              arrow={true}
            >
              <InfoCircleOutlined />
            </Tooltip>
          </div>
          <Button
            type="primary"
            size="large"
            className="ml-4"
            htmlType="submit"
            loading={createLoading}
          >
            Save Intent
          </Button>
        </div>

        <div className="flex gap-10 my-6">
          <div className="pb-12 w-1/2">
            <div className="flex gap-2 items-center!">
              <h4 className="text-lg font-semibold">Training Phrases</h4>
              <Tooltip
                placement="top"
                title={'Phrase that you can expect from the user'}
                arrow={true}
              >
                <InfoCircleOutlined />
              </Tooltip>
            </div>
            <p className="text-xs text-gray-600">
              When a user says something similar to a training phrase, bot
              matches it to the intent. You don’t have to create an exhaustive
              list. vhiobot will fill out the list with similar expressions. To
              extract parameter values, use annotations with available system or
              custom entity types.
            </p>
            <div className="py-4">
              <div className="flex mb-2 items-center">
                <NumberOutlined type="primary" />
                <Form.Item
                  name="addNewTrainingPhrase"
                  className="w-full"
                  style={{ marginBottom: 0 }}
                >
                  <Input
                    placeholder="Add New Training Phrase"
                    variant="borderless"
                  />
                </Form.Item>

                {/* add new item button */}
                <ButtonSmall
                  info="Add new Training Phrase"
                  onClick={() => {
                    const value = formIntent.getFieldValue(
                      'addNewTrainingPhrase',
                    );
                    if (!value) {
                      messageApi.open({
                        type: 'warning',
                        content: 'Intent Input is empty!',
                      });
                    } else {
                      const existData = [...state.trainingPhrases];
                      existData.unshift(value);
                      dispatch({
                        type: 'set trainingPhrases',
                        payload: existData,
                      });

                      formIntent.resetFields(['addNewTrainingPhrase']);
                    }
                  }}
                  positionTooltip="bottomRight"
                  icon={
                    <PlusOutlined
                      style={{ fontSize: '16px', color: '#4942E4' }}
                      className=""
                    />
                  }
                />
              </div>
              <List
                dataSource={state.trainingPhrases}
                renderItem={(item, index) => (
                  <List.Item>
                    <InputIntent
                      item={state.trainingPhrases[index]}
                      info={'Edit Training Phrase'}
                      onChange={(e: any) => {
                        dispatch({
                          type: 'edit trainingPhrases',
                          payload: {
                            index,
                            value: e.target.value,
                          },
                        });
                      }}
                    >
                      <div className="px-1"></div>
                      <ButtonSmall
                        info="Delete Training Phrase"
                        onClick={() => {
                          dispatch({
                            type: 'delete trainingPhrases',
                            payload: index,
                          });
                        }}
                        positionTooltip="bottomRight"
                        bg="!bg-red-300"
                        icon={
                          <DeleteOutlined
                            style={{ fontSize: '16px', color: 'red' }}
                            className=""
                          />
                        }
                      />
                    </InputIntent>
                  </List.Item>
                )}
              />
            </div>
          </div>
          <div className="pb-12 w-1/2">
            <div className="flex gap-2 items-center!">
              <h4 className="text-lg font-semibold">Response Text</h4>
              <Tooltip
                placement="top"
                title={'Text response, that bot will deliver it to user'}
                arrow={true}
              >
                <InfoCircleOutlined />
              </Tooltip>
            </div>
            <div className="py-4">
              <div className="flex">
                <NumberOutlined type="primary" />
                <Form.Item
                  name="addNewResponseText"
                  className="w-full"
                  style={{ marginBottom: 0 }}
                >
                  <Input
                    size="middle"
                    placeholder="Add New Response Text"
                    variant="borderless"
                  />
                </Form.Item>
                {/* add new item button */}
                <ButtonSmall
                  info="Add new Response Text"
                  onClick={() => {
                    const value =
                      formIntent.getFieldValue('addNewResponseText');
                    if (!value) {
                      messageApi.open({
                        type: 'warning',
                        content: 'Intent Input is empty!',
                      });
                    } else {
                      const existData = [...state.responseTexts];
                      existData.unshift(value);
                      dispatch({
                        type: 'set responseTexts',
                        payload: existData,
                      });

                      formIntent.resetFields(['addNewResponseText']);
                    }
                  }}
                  positionTooltip="bottomRight"
                  icon={
                    <PlusOutlined
                      style={{ fontSize: '16px', color: '#4942E4' }}
                      className=""
                    />
                  }
                />

                {/* </ButtonSmall> */}
              </div>
              <List
                dataSource={state.responseTexts}
                renderItem={(item, index) => (
                  <List.Item>
                    <InputIntent
                      item={state.responseTexts[index]}
                      info={'Edit Response Text'}
                      onChange={(e: any) => {
                        dispatch({
                          type: 'edit responseTexts',
                          payload: {
                            index,
                            value: e.target.value,
                          },
                        });
                      }}
                    >
                      <div className="px-1"></div>
                      <ButtonSmall
                        info="Delete Response Text"
                        onClick={() => {
                          dispatch({
                            type: 'delete responseTexts',
                            payload: index,
                          });
                        }}
                        positionTooltip="bottomRight"
                        bg="!bg-red-300"
                        icon={
                          <DeleteOutlined
                            style={{ fontSize: '16px', color: 'red' }}
                            className=""
                          />
                        }
                      />
                    </InputIntent>
                  </List.Item>
                )}
              />
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}

interface initialStateType {
  trainingPhrases: string[];
  responseTexts: string[];
}

const initialState: initialStateType = {
  trainingPhrases: [],
  responseTexts: [],
};

function stateReducer(draft: any, action: any) {
  switch (action.type) {
    case 'delete trainingPhrases':
      const dataTrainingPhrases = [...draft.trainingPhrases];
      dataTrainingPhrases.splice(action.payload, 1);
      draft.trainingPhrases = dataTrainingPhrases;
      break;
    case 'delete responseTexts':
      const dataResponseTexts = [...draft.responseTexts];
      dataResponseTexts.splice(action.payload, 1);
      draft.responseTexts = dataResponseTexts;
      break;
    case 'edit trainingPhrases':
      let existDataTrainingPhrase = [...draft.trainingPhrases];
      existDataTrainingPhrase[action.payload.index] = action.payload.value;
      draft.trainingPhrases = existDataTrainingPhrase;
      break;
    case 'edit responseTexts':
      let existDataResponseTexts = [...draft.responseTexts];
      existDataResponseTexts[action.payload.index] = action.payload.value;
      draft.responseTexts = existDataResponseTexts;
      break;
    case 'set trainingPhrases':
      draft.trainingPhrases = action.payload;
      break;
    case 'set responseTexts':
      draft.responseTexts = action.payload;
      break;
  }
}
