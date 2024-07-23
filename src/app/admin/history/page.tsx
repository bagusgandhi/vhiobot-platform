import React from 'react';
import { Metadata } from 'next';
import HistoryChatPage from '@/components/Pages/Admin/HistoryChat/Index';
 
export const metadata: Metadata = {
  title: 'History Chat',
}

export default function page({ session }: any) {
  return (
    <>
      <HistoryChatPage session={session} />
    </>
  )
}
