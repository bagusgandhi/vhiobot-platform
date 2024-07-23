import React from 'react'
import ManageIntentDetailPage from '@/components/Pages/Admin/ManageIntentDetail/Index';

interface pageProps {
  params: { id: string };
}
export default function page({ params }: pageProps) {
  return (
    <>
      <ManageIntentDetailPage intentId={params.id}/>
    </>
  )
}
