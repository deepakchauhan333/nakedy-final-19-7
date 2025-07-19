import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { AgeVerificationProvider } from '@/components/providers/age-verification-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Footer } from '@/components/footer';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nakedifyai.com'),
  title: {
    default: 'NakedifyAI.com - Best Adult AI Apps & Services Directory 2025',
    template: '%s | NakedifyAI.com'
  },
  description: 'Discover the best NSFW AI tools, adult chatbots, image generators, and more. Comprehensive directory of AI-powered adult services with reviews and comparisons. Updated daily with the latest AI innovations.',
  keywords: [
    'NSFW AI', 'Adult AI Tools', 'AI Chatbots', 'AI Image Generator', 
    'Adult AI Services', 'NakedifyAI', 'AI Companions', 'Adult Chatbots',
    'NSFW Image Generation', 'AI Roleplay', 'Adult AI Directory',
    'AI Tools 2025', 'Best AI Apps', 'AI Technology'
  ],
  authors: [{ name: 'NakedifyAI.com', url: 'https://nakedifyai.com' }],
  creator: 'NakedifyAI.com',
  publisher: 'NakedifyAI.com',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nakedifyai.com',
    siteName: 'NakedifyAI.com',
    title: 'NakedifyAI.com - Best Adult AI Apps & Services Directory 2025',
    description: 'Discover the best NSFW AI tools, adult chatbots, image generators, and more. Comprehensive directory of AI-powered adult services.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NakedifyAI.com - Adult AI Tools Directory',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@nakedifyai',
    creator: '@nakedifyai',
    title: 'NakedifyAI.com - Best Adult AI Apps & Services Directory 2025',
    description: 'Discover the best NSFW AI tools, adult chatbots, image generators, and more.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://nakedifyai.com',
    languages: {
      'en-US': 'https://nakedifyai.com',
    },
  },
  category: 'technology',
  classification: 'Adult Content',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'NakedifyAI',
    'application-name': 'NakedifyAI',
    'msapplication-TileColor': '#121212',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#121212',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
  ],
};

// Structured Data for SEO
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NakedifyAI.com',
  description: 'Comprehensive directory of adult AI tools and services',
  url: 'https://nakedifyai.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://nakedifyai.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    name: 'NakedifyAI.com',
    url: 'https://nakedifyai.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.pexels.com" />
        <link rel="dns-prefetch" href="https://qzjfqtuefrocvjrablmq.supabase.co" />
        
        {/* PWA and mobile optimization */}
        <meta name="theme-color" content="#121212" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="NakedifyAI" />
        <meta name="application-name" content="NakedifyAI" />
        <meta name="msapplication-TileColor" content="#121212" />
        
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Performance hints */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AgeVerificationProvider>
            <div className="min-h-screen flex flex-col">
              <main className="flex-1" id="main-content">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </AgeVerificationProvider>
        </ThemeProvider>
        
        {/* Skip to main content for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>
      </body>
    </html>
  );
}