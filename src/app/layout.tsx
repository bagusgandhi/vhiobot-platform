import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import './globals.css';
import SessionProvider from '@/components/SessionProvider';

export const metadata: Metadata = {
  title: 'Vhiobot - Virtual Asisten Hostin',
  description: 'Virtual Asisten Hosting',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html>
      <body>
        <SessionProvider session={session}>
          <AntdRegistry>{children}</AntdRegistry>
        </SessionProvider>
      </body>
    </html>
  );
}
