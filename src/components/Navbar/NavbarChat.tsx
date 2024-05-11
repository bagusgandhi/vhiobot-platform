"use client"
import { Button } from 'antd';
import { signOut } from 'next-auth/react';
import React from 'react';

export default function NavbarChat() {
    return (
        <div className='fixed top-0 w-full md:max-w-xl bg-white px-4 py-4 rounded-lg text-gray-600 flex justify-between items-center'>
            <div className='flex'>
                <div className='p-4 rounded-full bg-sky-400 m-2'></div>
                <div>
                    <p className='font-bold text-xl'>Vhiobot</p>
                    <p className='text-xs'>Online</p>
                </div>
            </div>
            <Button onClick={() => signOut()} className="!py-2 !px-4 block !h-fit !bg-red-500" danger>
                <span className="!flex items-center justify-center !text-white text-sm">
                    Log Out
                </span>
            </Button>
        </div>
    )
}
