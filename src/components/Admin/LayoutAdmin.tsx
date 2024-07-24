"use client"
import Link from 'next/link'
import React, { useState } from 'react';
import { Layout, Breadcrumb, Menu, Button, ConfigProvider } from 'antd';
import type { MenuProps } from 'antd';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
const { Header, Content, Footer, Sider } = Layout;
import { usePathname } from 'next/navigation';
import { signOut, useSession } from "next-auth/react"


type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  path?: string,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label: path ? <Link href={path}>{label}</Link> : label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Dashboard', '/admin', <PieChartOutlined />, '/admin'),
  getItem('Manage Intent', '/admin/intent', <DesktopOutlined />, '/admin/intent'),
  getItem('History Chat', '/admin/history', <FileOutlined />, '/admin/history'),
];

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  // const { data: session, status } = useSession()

  // console.log(pathname)
  
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4942E4'
        }
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          theme='light'
          style={{ 
            background: '#ffffff', 
            borderRight: '1px solid #ddd',
            position: 'fixed',
            height: '100vh',
            overflow: 'hidden',
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div className="lg:bg-gray-100 rounded-md lg:m-2" ><p className='w-full lg:text-xl font-bold lg:py-2 text-center text-primary lg:m-2 my-2'>Vhiobot</p></div>
          <Menu style={{ background: '#ffffff', borderRight: '0px', }} theme="light" defaultSelectedKeys={[pathname]} mode="inline" items={items} />
        </Sider>
        <Layout style={{ background: '#f9f9f9' }}>
          <Header style={{ padding: 0, background: '#f9f9f9'}}>
            <div className='px-4 flex justify-end'>
              <div>
              <Button onClick={() => signOut()} className="!py-2 !px-4 block !h-fit !bg-red-500" danger>
                  <span className="!flex items-center justify-center !text-white text-sm">
                      Log Out
                  </span>
              </Button>
              </div>
            </div>
          </Header>
          <Content style={{ marginLeft: `${collapsed ? 80 : 200}px`}} >
            <div className='px-4 flex flex-col'>
            {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
