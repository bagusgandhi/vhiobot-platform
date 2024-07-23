'use client';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import React, { useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { Button, Form, Input } from 'antd';
import NavbarChat from '@/components/Navbar/NavbarChat';
import { SendOutlined } from '@ant-design/icons';
import { getSession, useSession } from 'next-auth/react';
import socket from '@/utils/socket';
import { useSWRFetcher } from '@/utils/useSwrFetcher';
import moment from 'moment';

type Inputs = {
  message: string;
};

export default function Index() {
  const lastMessageRef = useRef<any>(null);
  const [socketConn, setSocketConn] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Array<Record<string, any>>>([]);
  const { data: session }: any = useSession({ required: true });

  const { data, error, isLoading, mutate } = useSWRFetcher<any>({
    key: ['api/chat'],
    session,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    reset,
  } = useForm<Inputs>();

  const fetchSession = async () => {
    const session = await getSession();
    return session;
  };

  const onSubmit: SubmitHandler<Inputs> = async ({ message }) => {
    const fetchedSession: any = await fetchSession();

    if (fetchedSession) {
      socket(fetchedSession.user.uuid, fetchedSession.user.name).emit(
        'sendMessage',
        message,
      );
      socket(fetchedSession.user.uuid, fetchedSession.user.name).emit(
        'askBot',
        message,
      );
      reset();
    }
  };

  useEffect(() => {
    setMessages(data?.message);
  }, [data]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
      let conn: any;
      const initSock = async () => {
        const session:any = await fetchSession();
        conn = io(process.env.SOCKET_URL || 'http://localhost:3009', {
          extraHeaders: {
            room: session?.user?.uuid,
            name: session?.user?.name,
          },
        });

        // tell bot to join room
        conn.emit('joinRoom', session.user.uuid);
        setSocketConn(conn);
        console.log("session",session);
      } 

      initSock()

      return () => {
        if (conn) {
          conn.off('joinRoom');
          conn.disconnect();
        }
      };
  }, []);

  useEffect(() => {
    if (socketConn) {
      socketConn.on('connect', () => {
        // Join the specific room
        socketConn.emit('join', session.user.uuid);
      });

      socketConn.on('message', (msg) => {
        setMessages((prevMessage: any) => prevMessage ? [...prevMessage, msg] : [msg]);
      });
    }
  }, [socketConn]);

  return (
    <div className="container mx-auto">
      <div className="h-screen w-full max-w-xl mx-auto overflow-y-auto msg-body">
        <NavbarChat />
        <div className="flex flex-col flex-grow h-full w-full bg-white bg-opacity-40 rounded-lg overflow-hidden">
          <div className="flex flex-col flex-grow h-0 p-4 overflow-auto py-24">
            {isLoading && <>Loading</>}

            {messages &&
              messages.map((data: any, index: number) =>
                data.sender === 'vhiobot' ? (
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
                        {moment(data?.timestamp).format('h:mm A')}
                      </span>
                    </div>
                  </div>
                ) : (
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
                        {moment(data?.timestamp).format('h:mm A')}
                      </span>
                    </div>
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                  </div>
                ),
              )}

            <div ref={lastMessageRef} />
          </div>
        </div>
        <div className="p-10 bg-sky-300 fixed bottom-0 w-full md:max-w-xl  px-4 py-4 rounded-lg text-gray-600 flex justify-between items-center">
          <Form
            onFinish={handleSubmit(onSubmit)}
            className="!flex items-center w-full"
          >
            <Controller
              name="message"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  {...field}
                  size="large"
                  placeholder="Message"
                  onPressEnter={handleSubmit(onSubmit)}
                  required
                />
              )}
            />
            <span className="absolute right-4">
              <Button
                className="!py-2 !px-4 block !h-fit my-2"
                type="text"
                htmlType="submit"
              >
                <SendOutlined />
              </Button>
            </span>
          </Form>
        </div>
      </div>
    </div>
  );
}
