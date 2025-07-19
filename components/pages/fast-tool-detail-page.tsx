'use client';

import React from 'react';
import Link from 'next/link';
import { useAgeVerification } from '@/components/providers/age-verification-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LazyImage } from '@/components/ui/lazy-image';
import { SemanticArticle, SemanticHeader, SemanticSection } from '@/components/ui/semantic-layout';
import { 
  ExternalLink, 
  Eye, 
  Star, 
  Crown, 
  Zap, 
  Heart,
  ChevronLeft,
  CheckCircle,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FastToolDetailPageProps {
  tool: any;
}

export function FastToolDetailPage({ tool }: FastToolDetailPageProps) {
  const { showNSFW } = useAgeVerification();
  
  if (!tool) {
    return (
      <SemanticSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-white mb-4">Tool Not Found</h1>
          <p className="text-zinc-400 mb-6">The requested tool could not be found.</p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </SemanticSection>
    );
  }

  const shouldBlur = tool.is_nsfw && !showNSFW;

  const getPricingColor = (pricing: string) => {
    switch (pricing?.toLowerCase()) {
      case 'free': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'freemium': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'paid': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'subscription': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  const getPricingIcon = (pricing: string) => {
    switch (pricing?.toLowerCase()) {
      case 'free': return <Heart className="w-4 h-4" />;
      case 'freemium': return <Zap className="w-4 h-4" />;
      case 'paid': return <Crown className="w-4 h-4" />;
      case 'subscription': return <Crown className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Semantic Navigation */}
      <nav aria-label="Breadcrumb">
        <Button asChild variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
          <Link href="/">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Directory
          </Link>
        </Button>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <SemanticArticle className="lg:col-span-2 space-y-8">
          <SemanticHeader className="space-y-6">
            {/* Tool Screenshot */}
            {tool.screenshot_url && (
              <div className="relative aspect-video glass-card overflow-hidden">
                <LazyImage
                  src={tool.screenshot_url}
                  alt={tool.name || 'Tool Screenshot'}
                  className={cn('w-full h-full', shouldBlur && 'blur-md')}
                  fallback={tool.name?.charAt(0) || 'T'}
                  priority
                />
                {shouldBlur && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-center text-white">
                      <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">NSFW Content Hidden</p>
                      <p className="text-sm opacity-75">Enable NSFW content to view</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tool Information */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-2">
                  <h1 className={cn(
                    'text-3xl font-bold text-white leading-tight',
                    shouldBlur && 'blur-sm'
                  )}>
                    {tool.name || 'Unnamed Tool'}
                  </h1>
                  
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline" className="text-zinc-400 border-zinc-700">
                      {tool.category?.replace('-', ' ') || 'Uncategorized'}
                    </Badge>
                    
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        'font-medium border',
                        getPricingColor(tool.pricing || 'freemium')
                      )}
                    >
                      <div className="flex items-center gap-1">
                        {getPricingIcon(tool.pricing || 'freemium')}
                        {tool.pricing || 'freemium'}
                      </div>
                    </Badge>
                    
                    {tool.is_nsfw && (
                      <Badge variant="destructive">
                        18+
                      </Badge>
                    )}

                    <div className="flex items-center gap-1 text-sm text-zinc-400">
                      <Eye className="w-4 h-4" />
                      {(tool.views || 0).toLocaleString()} views
                    </div>

                    {tool.rating && (
                      <div className="flex items-center gap-1 text-sm text-zinc-400">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {tool.rating.toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                    <a href={tool.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Tool
                    </a>
                  </Button>
                </div>
              </div>

              <p className={cn(
                'text-lg text-zinc-300 leading-relaxed',
                shouldBlur && 'blur-sm'
              )}>
                {tool.description || 'No description available.'}
              </p>
            </div>
          </SemanticHeader>

          {/* Features Section */}
          {tool.features && tool.features.length > 0 && (
            <SemanticSection>
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Key Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tool.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 text-zinc-300">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className={shouldBlur ? 'blur-sm' : ''}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </SemanticSection>
          )}
        </SemanticArticle>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Tool Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Category</span>
                <Badge variant="outline" className="text-zinc-300 border-zinc-700">
                  {tool.category?.replace('-', ' ') || 'Uncategorized'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Pricing</span>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    'font-medium border',
                    getPricingColor(tool.pricing || 'freemium')
                  )}
                >
                  {tool.pricing || 'freemium'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Views</span>
                <span className="text-zinc-300 font-medium">
                  {(tool.views || 0).toLocaleString()}
                </span>
              </div>

              {tool.rating && (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-zinc-300 font-medium">
                      {tool.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              )}
              
              <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white">
                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-2" />
                  Visit Official Website
                </a>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}