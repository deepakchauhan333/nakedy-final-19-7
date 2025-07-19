import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/navigation';
import { Brain, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">
              Tool Not Found
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              The AI tool you're looking for doesn't exist or may have been removed.
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              <Link href="/categories">
                <Search className="w-4 h-4 mr-2" />
                Browse Categories
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}