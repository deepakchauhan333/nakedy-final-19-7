import React from 'react';
import { Metadata } from 'next';
import { Navigation } from '@/components/navigation';
import { AboutPage } from '@/components/pages/about-page';

export const metadata: Metadata = {
  title: 'About Us - NakedifyAI.com',
  description: 'Learn about our mission to provide the most comprehensive directory of adult AI tools and services. Discover our story, values, and commitment to the AI community.',
  openGraph: {
    title: 'About Us - NakedifyAI.com',
    description: 'Learn about our mission to provide the most comprehensive directory of adult AI tools and services.',
    type: 'website',
  },
};

export default function AboutPageRoute() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <AboutPage />
    </div>
  );
}