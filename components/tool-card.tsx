'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { AITool } from '@/lib/database.types';
import { useAgeVerification } from '@/components/providers/age-verification-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { 
  ExternalLink, 
  Eye, 
  Star, 
  Crown, 
  Zap, 
  Heart,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  tool: AITool;
  showNSFWBlur?: boolean;
}

const ToolCard = memo(function ToolCard({ tool, showNSFWBlur = true }: ToolCardProps) {
  const { showNSFW } = useAgeVerification();
  const shouldBlur = tool.is_nsfw && !showNSFW && showNSFWBlur;

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
        return <Heart className="w-3 h-3" />;
      case 'freemium':
        return <Zap className="w-3 h-3" />;
      case 'paid':
        return <Crown className="w-3 h-3" />;
      case 'subscription':
        return <Crown className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <Link href={`/ai/${tool.slug}`} className="block">
      <Card className={cn(
        'glass-card glass-hover group overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]',
        shouldBlur && 'nsfw-blur'
      )}>
        <CardHeader className="p-0">
          {/* Tool Image */}
          <div className="relative aspect-video bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden">
            {tool.screenshot_url ? (
              <img
                src={tool.screenshot_url}
                alt={tool.name}
                className={cn(
                  'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105',
                  shouldBlur && 'blur-md'
                )}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-4xl font-bold text-zinc-600">
                  {tool.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
            
            {/* Overlay Info */}
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge 
                variant="secondary" 
                className={cn(
                  'text-xs font-medium border',
                  getPricingColor(tool.pricing)
                )}
              >
                <div className="flex items-center gap-1">
                  {getPricingIcon(tool.pricing)}
                  {tool.pricing}
                </div>
              </Badge>
              
              {tool.is_nsfw && (
                <Badge variant="destructive" className="text-xs font-medium">
                  18+
                </Badge>
              )}
            </div>

            {/* Views */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/50 rounded-full text-xs text-white">
              <Eye className="w-3 h-3" />
              {(tool.views || 0).toLocaleString()}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          {/* Title & Category */}
          <div className="space-y-2">
            <h3 className={cn(
              'font-semibold text-lg leading-tight line-clamp-1 text-white',
              shouldBlur && 'blur-sm'
            )}>
              {tool.name}
            </h3>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs text-zinc-400 border-zinc-700">
                {tool.category.replace('-', ' ')}
              </Badge>
              
              {tool.rating && (
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {tool.rating.toFixed(1)}
                  {tool.review_count && (
                    <span className="text-zinc-500">({tool.review_count})</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className={cn(
            'text-sm text-zinc-400 line-clamp-2 leading-relaxed',
            shouldBlur && 'blur-sm'
          )}>
            {tool.description}
          </p>

          {/* Tags */}
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tool.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    'px-2 py-1 text-xs bg-white/5 text-zinc-500 rounded-full',
                    shouldBlur && 'blur-sm'
                  )}
                >
                  #{tag}
                </span>
              ))}
              {tool.tags.length > 3 && (
                <span className="px-2 py-1 text-xs text-zinc-500">
                  +{tool.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          <div className="flex-1 text-sm text-zinc-400 flex items-center gap-2">
            <ChevronRight className="w-4 h-4" />
            <span>View Details</span>
          </div>
          
          <Button 
            asChild 
            size="sm" 
            variant="outline" 
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            <a href={tool.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
});

export { ToolCard };