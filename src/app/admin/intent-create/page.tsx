import { Metadata } from 'next';
import React from 'react';
import CreateNewIntentPage from '@/components/Pages/Admin/CreateNewIntent/Index';

export const metadata: Metadata = {
  title: 'Create New Intent',
};

export default function page() {
  return (
    <>
      <CreateNewIntentPage />
    </>
  );
}
