'use client';
import { Form, Button, Input, notification } from 'antd';
import { signIn } from 'next-auth/react';
import React from 'react';

export default function index() {
  // const [form] = Form.useForm();

  const onFinish = (values: any) => {
    signIn('cred-email-password', { ...values, callbackUrl: '/admin' })
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
  };

  return (
    <>
      <div className='h-screen flex items-center justify-center '>
        <Form
          name="admin-login"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'The input is not valid email!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
