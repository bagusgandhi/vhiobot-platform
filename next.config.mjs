/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    serverRuntimeConfig: {
        APP_ENV: process.env.APP_ENV,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_SECRET: process.env.GOOGLE_SECRET,
        // SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
        VHIOBOT_API_HOST: process.env.VHIOBOT_API_HOST,
        SECRET_API_KEY: process.env.SECRET_API_KEY
    },
    publicRuntimeConfig: {
        NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
};

export default nextConfig;
