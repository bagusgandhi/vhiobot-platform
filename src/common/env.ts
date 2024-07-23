import getConfig from 'next/config';

// const { serverRuntimeConfig } = getConfig();

export const Env = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET as string,
    SOCKET_URL: process.env.SOCKET_URL as string,
    VHIOBOT_API_HOST: process.env.VHIOBOT_API_HOST as string,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET as string,
    SECRET_API_KEY: process.env.SECRET_API_KEY as string,
}