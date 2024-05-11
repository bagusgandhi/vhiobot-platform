"use client"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import React, { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client';
import { Button, Form, Input } from 'antd';
import NavbarChat from '@/components/Navbar/NavbarChat';
import { SendOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import socket from "@/utils/socket";

type Inputs = {
    message: string
}

export default function Index() {
    const [socketConn, setSocketConn] = useState<Socket | null>(null);
    const { data: session, status }: any = useSession()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        control
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        socket(session.user.uuid, session.user.name).emit('askBot', data);
        console.log(data)
    }

    // console.log(session?.user);
    useEffect(() => {
        if (session.user.uuid) {
            const conn = io('http://localhost:3009', {
                extraHeaders: {
                    room: session?.user?.uuid,
                    name: session?.user?.name
                }
            });

            // tell bot to join room
            conn.emit('joinRoom', session.user.uuid);
            setSocketConn(conn);
        }

    }, [session]);

    useEffect(() => {
        if (socketConn) {

            socketConn.on('connect', () => {
                // Join the specific room
                socketConn.emit('join', session.user.uuid);
            });

            // socketConn.on('message', (msg) => {
            //     setMessages((message: any) => [...message, msg]);
            //     const encryptedData = encryptData(messages);

            //     // set data to localStorage
            //     localStorage.setItem('history', encryptedData);

            //     console.log(msg);
            // });


        }
    }, [socketConn]);


    return (
        <div className='container mx-auto'>
            <div className='h-screen w-full max-w-xl mx-auto overflow-y-auto msg-body'>
                <NavbarChat />
                <div className='flex flex-col flex-grow h-full w-full bg-white bg-opacity-40 rounded-lg overflow-hidden'>
                    <div className='flex flex-col flex-grow h-0 p-4 overflow-auto py-24'>

                        <div className="flex w-full mt-2 space-x-3 max-w-xs">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                            <div>
                                <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                                    <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                </div>
                                <span className="text-xs text-gray-500 leading-none">2 min ago</span>
                            </div>
                        </div>

                        <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                            <div>
                                <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                                    <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
                                </div>
                                <span className="text-xs text-gray-500 leading-none">2 min ago</span>
                            </div>
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                        </div>

                        <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                            <div>
                                <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                                    <p className="text-sm">Lorem ipsum dolor sit amet.</p>
                                </div>
                                <span className="text-xs text-gray-500 leading-none">2 min ago</span>
                            </div>
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                        </div>

                        <div className="flex w-full mt-2 space-x-3 max-w-xs">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                            <div>
                                <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                                    <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                </div>
                                <span className="text-xs text-gray-500 leading-none">2 min ago</span>
                            </div>
                        </div>

                        <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                            <div>
                                <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                                    <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
                                </div>
                                <span className="text-xs text-gray-500 leading-none">2 min ago</span>
                            </div>
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                        </div>

                        <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                            <div>
                                <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                                    <p className="text-sm">Lorem ipsum dolor sit amet.</p>
                                </div>
                                <span className="text-xs text-gray-500 leading-none">2 min ago</span>
                            </div>
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                        </div>

                    </div>
                </div>
                <div className='p-10 bg-sky-300 fixed bottom-0 w-full md:max-w-xl  px-4 py-4 rounded-lg text-gray-600 flex justify-between items-center'>
                    <Form onFinish={handleSubmit(onSubmit)} className="!flex items-center w-full">
                        <Controller
                            name="message"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Input {...field} size="large" placeholder="Message" onPressEnter={handleSubmit(onSubmit)} />
                            )}
                        />
                        <span className='absolute right-4'>
                            <Button className="!py-2 !px-4 block !h-fit my-2" type="text" htmlType="submit">
                                <SendOutlined />
                            </Button>
                        </span>
                    </Form>
                </div>
            </div>
        </div>
    )
}
