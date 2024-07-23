import IntentService from '@/services/intent/intent.service';
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

  const services = new IntentService();
  const allIntentResponse = await services.getAllIntent(
    token?.account?.response?.access_token, paramsObject
  );

  if (allIntentResponse.status === 401) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = allIntentResponse.data;

  return Response.json({ data });
}

export async function POST(req: NextRequest) {
  const token: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await req.json();
    const services = new IntentService();

    const result = await services.createIntent(
      token?.account?.response?.access_token,
      payload,
    );
    const data = result.data;

    // console.log(result)

    return Response.json({data});
  } catch (error) {
    // console.log(error)
    return Response.json(
      { error: 'Failed to process the request' },
      { status: 500 },
    );
  }
}
