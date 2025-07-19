'use client';

import React from 'react';
import Link from 'next/link';
import { AITool } from '@/lib/database.types';
import { useAgeVerification } from '@/components/providers/age-verification-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ExternalLink, 
  Eye, 
  Star, 
  Crown, 
  Zap, 
  Heart,
  ChevronLeft,
  Calendar,
  Tag,
  Globe,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToolCard } from '@/components/tool-card';

interface ToolDetailPageProps {
  tool: AITool;
  alternativeTools: AITool[];
}

export function ToolDetailPage({ tool, alternativeTools }: ToolDetailPageProps) {
  const { showNSFW } = useAgeVerification();
  const shouldBlur = tool.is_nsfw && !showNSFW;

  const getPricingColor = (pricing: string) => {
    switch (pricing.toLowerCase()) {
      case 'free':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'freemium':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'paid':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'subscription':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  const getPricingIcon = (pricing: string) => {
    switch (pricing.toLowerCase()) {
      case 'free':
        return <Heart className="w-4 h-4" />;
      case 'freemium':
        return <Zap className="w-4 h-4" />;
      case 'paid':
        return <Crown className="w-4 h-4" />;
      case 'subscription':
        return <Crown className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
          <Link href="/">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Directory
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
          <Link href={`/category/${tool.category}`}>
            View {tool.category.replace('-', ' ')} tools
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="space-y-6">
            {/* Screenshot */}
            {tool.screenshot_url && (
              <div className="relative aspect-video glass-card overflow-hidden">
                <img
                  src={tool.screenshot_url}
                  alt={tool.name}
                  className={cn(
                    'w-full h-full object-cover',
                    shouldBlur && 'blur-md'
                  )}
                  onError={(e) => {
                    // Hide image if it fails to load
                    e.currentTarget.style.display = 'none';
                  }}
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

            {/* Title and Meta */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-2">
                  <h1 className={cn(
                    'text-3xl font-bold text-white leading-tight',
                    shouldBlur && 'blur-sm'
                  )}>
                    {tool.name}
                  </h1>
                  
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline" className="text-zinc-400 border-zinc-700">
                      {tool.category.replace('-', ' ')}
                    </Badge>
                    
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        'font-medium border',
                        getPricingColor(tool.pricing)
                      )}
                    >
                      <div className="flex items-center gap-1">
                        {getPricingIcon(tool.pricing)}
                        {tool.pricing}
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
                        {tool.review_count && (
                          <span className="text-zinc-500">({tool.review_count} reviews)</span>
                        )}
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

              {/* Description */}
              <p className={cn(
                'text-lg text-zinc-300 leading-relaxed',
                shouldBlur && 'blur-sm'
              )}>
                {tool.description}
              </p>
            </div>
          </div>

          {/* Features */}
          {tool.features && tool.features.length > 0 && (
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tool.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-zinc-300">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className={shouldBlur ? 'blur-sm' : ''}>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {tool.tags && tool.tags.length > 0 && (
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Tag className="w-5 h-5 text-blue-400" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className={cn(
                        'text-zinc-400 border-zinc-700 hover:bg-zinc-800 cursor-pointer',
                        shouldBlur && 'blur-sm'
                      )}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tool Info */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Tool Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Category</span>
                <Badge variant="outline" className="text-zinc-300 border-zinc-700">
                  {tool.category.replace('-', ' ')}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Pricing</span>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    'font-medium border',
                    getPricingColor(tool.pricing)
                  )}
                >
                  {tool.pricing}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Added</span>
                <span className="text-zinc-300 text-sm">
                  {new Date(tool.created_at).toLocaleDateString()}
                </span>
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

              <Separator className="bg-zinc-800" />
              
              <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white">
                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-2" />
                  Visit Official Website
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Alternative Tools */}
          {alternativeTools.length > 0 && (
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Similar Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {alternativeTools.slice(0, 3).map((altTool) => (
                  <Link
                    key={altTool.id}
                    href={`/ai/${altTool.slug}`}
                    className="block glass-card glass-hover p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {altTool.screenshot_url && (
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={altTool.screenshot_url}
                            alt={altTool.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-white text-sm line-clamp-1">
                          {altTool.name}
                        </h4>
                        <p className="text-xs text-zinc-400 line-clamp-1">
                          {altTool.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400">
                            {altTool.pricing}
                          </Badge>
                          {altTool.rating && (
                            <div className="flex items-center gap-1 text-xs text-zinc-500">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              {altTool.rating.toFixed(1)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                
                {alternativeTools.length > 3 && (
                  <Button asChild variant="outline" size="sm" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                    <Link href={`/alternative/${tool.slug}`}>
                      View all alternatives
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}