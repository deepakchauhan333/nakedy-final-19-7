import React from 'react';
import { Metadata } from 'next';
import { FastAdminPanel } from '@/components/admin/fast-admin-panel';

export const metadata: Metadata = {
  title: 'Fast Admin Panel - NakedifyAI.com',
  description: 'Secure admin panel for managing AI tools directory',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <FastAdminPanel />;
}