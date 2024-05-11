import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export const Env = {
    GOOGLE_CLIENT_ID: serverRuntimeConfig.GOOGLE_CLIENT_ID as string,
    GOOGLE_SECRET: serverRuntimeConfig.GOOGLE_SECRET as string,
    SOCKET_URL: serverRuntimeConfig.SOCKET_URL as string,
    VHIOBOT_API_HOST: serverRuntimeConfig.VHIOBOT_API_HOST as string,
    NEXTAUTH_SECRET: serverRuntimeConfig.NEXTAUTH_SECRET as string,
    SECRET_API_KEY: serverRuntimeConfig.SECRET_API_KEY as string,
}