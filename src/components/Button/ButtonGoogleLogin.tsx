"use client"
import React from 'react';
import { signIn } from 'next-auth/react';
import { Button } from "antd";
import Image from "next/image";
import GoogleIcon from "../../../public/google.svg";

export default function ButtonGoogleLogin() {

    const handleLOginWIthGoogle = () => {
        signIn('google', { callbackUrl: '/chat' });
    }

    return (
        <>
            <Button onClick={handleLOginWIthGoogle} className="!py-2 !px-4 block !h-fit " type="default">
                <span className="!flex items-center justify-center">
                    <Image
                        priority
                        src={GoogleIcon}
                        alt="google icon"
                        width={32}
                        height={32}
                    />
                    Login with Google
                </span>
            </Button>
        </>
    )
}
