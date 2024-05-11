import io from 'socket.io-client';
// import { Env } from '@/common/env';

// const { SOCKET_URL } = Env;

const socket = (room: string, name: string) => io('http://localhost:3009', {
    extraHeaders: {
        room,
        name
    }
});

export default socket;
