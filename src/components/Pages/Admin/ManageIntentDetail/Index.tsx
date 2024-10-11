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
  Select,
} from 'antd';
import {
  DeleteOutlined,
  InfoCircleOutlined,
  NumberOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import ButtonSmall from '@/components/Button/ButtonSmall';
import { useSWRFetcher } from '@/utils/useSwrFetcher';
import { useImmerReducer } from 'use-immer';
import { useSWRMutationFetcher } from '@/utils/useSweFetcherMutation';
import InputIntent from '@/components/Input/InputIntent';
const { Title } = Typography;

export default function Index({ intentId, session }: any) {
  const [state, dispatch] = useImmerReducer(stateReducer, initialState);
  const [messageApi, contextHolder] = message.useMessage();
  const [formIntent] = Form.useForm();

  const {
    data: dataIntent,
    error,
    isLoading,
    mutate,
  } = useSWRFetcher<any>({
    key: [`api/intent/${intentId}`],
    session,
  });

  const {
    data: dataIntentContext,
    isLoading: isLoadingIntentContext,
    mutate: isMutateIntentContext,
  } = useSWRFetcher<any>({
    key: [`api/intent-context`],
    session,
  });

  const optionsContext = dataIntentContext?.data?.map((item: any) => {
    return {
      label: item.title,
      value: item.title
    }
  })

  const { trigger: saveIntent, isMutating: saveLoading } =
    useSWRMutationFetcher({
      key: [`api/intent/${intentId}`],
      session,
      axiosOptions: {
        method: 'PUT',
        url: `api/intent/${intentId}`,
      },
      swrOptions: {
        onSuccess: (data: any) => {
          notification['success']({
            message: 'Intent Saved',
            description: 'Intent Data has been saved',
          });
        },
      },
    });

  useEffect(() => {
    dispatch({
      type: 'set trainingPhrases',
      payload: dataIntent?.data?.trainingPhrases,
    });

    dispatch({
      type: 'set responseTexts',
      payload: dataIntent?.data?.responseTexts,
    });
  }, [dataIntent?.data]);

  if (dataIntent) {
    formIntent.setFieldValue('displayName', dataIntent?.data.displayName);
    formIntent.setFieldValue('inputContext', dataIntent?.data.input_context);
    formIntent.setFieldValue('outputContext', dataIntent?.data.output_context);
  }

  const submitHandler = (values: any) => {
    if (
      formIntent.getFieldValue('addNewTrainingPhrase') ||
      formIntent.getFieldValue('addNewResponseText')
    ) {
      messageApi.open({
        type: 'warning',
        content: 'Please click button add in your input first',
      });
    } else {
      // const displayName = formIntent.getFieldValue('displayName');
      const updatedData: any = {
        data: {
          displayName: values.displayName,
          trainingPhrasesParts: state.trainingPhrases,
          messageTexts: state.responseTexts,
          inputContext: values.inputContext,
          outputContext: values.outputContext,
        },
      };

      console.log(updatedData)

      saveIntent(updatedData);
      mutate();
      isMutateIntentContext()
    }
  };

  return (
    <div className="pr-6">
      {contextHolder}
      <Title level={4}>Edit Intent</Title>
      <Divider />
      <Form layout="vertical" form={formIntent} onFinish={submitHandler}>
        {isLoading ? (
          <Skeleton.Input active={true} block={true} />
        ) : (
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
              loading={saveLoading}
            >
              Save Intent
            </Button>
          </div>
        )}

        {/* context */}
        <div>
          <div>
            {isLoading ? (
              <Skeleton active={true} />
            ) : (
              <>
                <div className="flex gap-2 items-center!">
                  <h4 className="text-lg font-semibold">Contexts</h4>
                  <Tooltip
                    placement="top"
                    title={
                      'Can be used to "remember" parameter values, so they can be passed between intents'
                    }
                    arrow={true}
                  >
                    <InfoCircleOutlined />
                  </Tooltip>
                </div>
                <p className="text-xs text-gray-600">
                  contexts are used to manage the flow of conversation by
                  keeping track of the user's input across multiple turns. They
                  act like variables that help the chatbot remember what the
                  user previously said, allowing for more dynamic and
                  context-aware conversations.
                </p>
              </>
            )}

            <div className="flex gap-10">
              {isLoading ? (
                <Skeleton active={true} />
              ) : (
                <div className="py-4 w-1/2">
                  <div className="flex mb-2 items-center">
                    <NumberOutlined type="primary" />
                    <Form.Item
                      name="inputContext"
                      className="w-full"
                      style={{ marginBottom: 0 }}
                    >
                      <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="Input Context"
                        loading={isLoadingIntentContext}
                        options={optionsContext ?? []}
                        variant="borderless"
                      />
                    </Form.Item>
                  </div>
                </div>
              )}

              {isLoading ? (
                <Skeleton active={true} />
              ) : (
                <div className="py-4 w-1/2">
                  <div className="flex mb-2 items-center">
                    <NumberOutlined type="primary" />
                    <Form.Item
                      name="outputContext"
                      className="w-full"
                      style={{ marginBottom: 0 }}
                    >
                      <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="Output Context"
                        loading={isLoadingIntentContext}
                        options={optionsContext ?? []}
                        variant="borderless"
                      />
                    </Form.Item>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-10 my-6">
          {isLoading ? (
            <Skeleton active={true} />
          ) : (
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
                list. vhiobot will fill out the list with similar expressions.
                To extract parameter values, use annotations with available
                system or custom entity types.
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
          )}
          {isLoading ? (
            <Skeleton active={true} />
          ) : (
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
          )}
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
