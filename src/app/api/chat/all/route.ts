import ChatService from '@/services/chat/chat.service';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const token: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // console.log("req", new URLSearchParams(req.nextUrl.searchParams))
  const params: any = new URLSearchParams(req.nextUrl.search);

  // Convert URLSearchParams to a plain object
  const paramsObject: Record<string, any> = {};
  params.forEach((value:any, key: any) => {
    paramsObject[key] = value;
  });

  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const services = new ChatService();
  const allChatResponse = await services.getAllChat(
    token?.account?.response?.access_token, paramsObject
  );

  if (allChatResponse.status === 401) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = allChatResponse.data;

  return Response.json({ data });
}
