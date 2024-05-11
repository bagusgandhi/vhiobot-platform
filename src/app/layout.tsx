import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Vhiobot platform",
  description: "simple chatbot experience",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html>
      <body className="bg-sky-100">
        <SessionProvider session={session}>
          <AntdRegistry>
            {children}
          </AntdRegistry>
        </SessionProvider>
      </body>
    </html>
  );
}
