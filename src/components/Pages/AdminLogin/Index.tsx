'use client';
import { Form, Button, Input, notification } from 'antd';
import { signIn } from 'next-auth/react';
import React from 'react';
import { useImmerReducer } from 'use-immer';

export default function index() {
  const [state, dispatch] = useImmerReducer(stateReducer, initialState);

  const onFinish = async (values: any) => {
    dispatch({ type: 'set loading', payload: true });
    await signIn('cred-email-password', { ...values, callbackUrl: '/admin' });
    dispatch({ type: 'set loading', payload: false });
  };

  const onFinishFailed = (errorInfo: any) => {
    notification.error({
      message: 'Login Failed',
      description: 'Something went wrong, please try again',
    });
  };

  type FieldType = {
    email?: string;
    password?: string;
    style?: any;
  };

  return (
    <>
      <div className="h-screen flex items-center justify-center ">
        <Form
          name="admin-login"
          style={{ maxWidth: '100%' }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="!w-1/6"
        >
          <h3 className="text-3xl font-bold text-center my-4 text-primary p-4 rounded-md">
            Vhiobot
          </h3>
          <Form.Item<FieldType>
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'The input is not valid email!' },
            ]}
          >
            <Input placeholder="Email" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Password" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button
              loading={state.loading}
              type="primary"
              className="!bg-primary !w-full"
              htmlType="submit"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

interface initialStateType {
  loading: boolean;
}

const initialState: initialStateType = {
  loading: false,
};

function stateReducer(draft: any, action: any) {
  switch (action.type) {
    case 'set loading':
      draft.loading = action.payload;
      break;
  }
}
