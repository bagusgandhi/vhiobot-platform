import React from 'react';
import AdminPage from '@/components/Pages/Admin/Index';
import { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Dashboard',
}

export default function page() {

  return (
    <>
      <AdminPage />
    </>
  )
}
