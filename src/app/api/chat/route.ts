import ChatService from "@/services/chat/chat.service";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const services = new ChatService();
  const chatResponse = await services.getChat(token?.account?.response?.access_token);

  if (chatResponse.status === 401) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const message = chatResponse.data.message;

  return Response.json({ message });
}
