import IntentService from '@/services/intent/intent.service';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const token: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;
  const intentId = pathname.split('/')[3];

  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const services = new IntentService();
  const intentDetail = await services.getIntentById(
    token?.account?.response?.access_token,
    intentId,
  );

  if (intentDetail.status === 401) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = intentDetail.data;

  return Response.json({ data });
}

export async function PUT(req: NextRequest) {
  const token: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;
  const intentId = pathname.split('/')[3];

  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await req.json();
    const services = new IntentService();

    const result = await services.updateIntent(
      token?.account?.response?.access_token,
      intentId,
      payload,
    );

    const data = result.data;

    return Response.json({data});
  } catch (error) {

    return Response.json(
      { error: 'Failed to process the request' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const token: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;
  const intentId = pathname.split('/')[3];

  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const services = new IntentService();
  const intentDetail = await services.deleteIntent(
    token?.account?.response?.access_token,
    intentId,
  );

  if (intentDetail.status === 401) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = intentDetail.data;

  return Response.json({ data });
}
