import React from 'react';
import { Metadata } from 'next';
import ManageIntentPage from '@/components/Pages/Admin/ManageIntent/Index';
 
export const metadata: Metadata = {
  title: 'Manage Intent',
}

export default function page() {
  return (
    <>
      <ManageIntentPage />
    </>
  )
}
