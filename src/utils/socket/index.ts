import io from 'socket.io-client';
// import { Env } from '@/common/env';

// const { SOCKET_URL } = Env;

const socket = (room: string, name: string) => io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    extraHeaders: {
        room,
        name
    }
});

export default socket;
