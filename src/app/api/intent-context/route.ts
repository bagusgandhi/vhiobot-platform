import IntentService from '@/services/intent/intent.service';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const token: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const services = new IntentService();
  const allIntentResponse = await services.getAllIntentContext(
    token?.account?.response?.access_token
  );

  if (allIntentResponse.status === 401) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = allIntentResponse.data;

  return Response.json({ data });
}


