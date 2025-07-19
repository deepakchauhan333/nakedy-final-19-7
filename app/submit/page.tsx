import React from 'react';
import { Metadata } from 'next';
import { Navigation } from '@/components/navigation';
import { SubmitToolPage } from '@/components/pages/submit-tool-page';

export const metadata: Metadata = {
  title: 'Submit AI Tool - NakedifyAI.com',
  description: 'Submit your NSFW AI tool to our directory. Get featured in the best adult AI tools collection.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SubmitToolPageRoute() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <SubmitToolPage />
    </div>
  );
}