import React from 'react';
import { Metadata } from 'next';
import { Navigation } from '@/components/navigation';
import { ContactPage } from '@/components/pages/contact-page';

export const metadata: Metadata = {
  title: 'Contact Us - NakedifyAI.com',
  description: 'Get in touch with our team. We\'re here to help with questions, suggestions, or partnership opportunities.',
  openGraph: {
    title: 'Contact Us - NakedifyAI.com',
    description: 'Get in touch with our team. We\'re here to help with questions, suggestions, or partnership opportunities.',
    type: 'website',
  },
};

export default function ContactPageRoute() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <ContactPage />
    </div>
  );
}