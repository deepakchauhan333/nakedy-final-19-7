'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { FastImage } from '@/components/ui/fast-image';
import { useAgeVerification } from '@/components/providers/age-verification-provider';
import { cn } from '@/lib/utils';

interface FastTool {
  id: string;
  name: string;
  slug: string;
  description: string;
  pricing: string;
  is_nsfw: boolean;
  views: number;
  rating?: number;
  screenshot_url?: string;
}

interface FastToolCardProps {
  tool: FastTool;
}

const FastToolCard = memo(function FastToolCard({ tool }: FastToolCardProps) {
  const { showNSFW } = useAgeVerification();
  const shouldBlur = tool.is_nsfw && !showNSFW;

  const pricingColors = {
    free: 'bg-green-500/20 text-green-400',
    freemium: 'bg-blue-500/20 text-blue-400',
    paid: 'bg-yellow-500/20 text-yellow-400',
    subscription: 'bg-purple-500/20 text-purple-400'
  };

  return (
    <Link href={`/ai/${tool.slug}`} className="block">
      <div className={cn(
        'glass-card glass-hover group overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]',
        shouldBlur && 'blur-sm'
      )}>
        <div className="relative aspect-video">
          <FastImage
            src={tool.screenshot_url || 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800'}
            alt={tool.name}
            className="w-full h-full"
            fallback={tool.name}
          />
          
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={cn(
              'px-2 py-1 text-xs font-medium rounded-full',
              pricingColors[tool.pricing as keyof typeof pricingColors] || 'bg-zinc-500/20 text-zinc-400'
            )}>
              {tool.pricing}
            </span>
            {tool.is_nsfw && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-400">
                18+
              </span>
            )}
          </div>

          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/50 rounded-full text-xs text-white">
            {tool.views.toLocaleString()} views
          </div>
        </div>

        <div className="p-4 space-y-3">
          <h3 className={cn(
            'font-semibold text-lg leading-tight line-clamp-1 text-white',
            shouldBlur && 'blur-sm'
          )}>
            {tool.name}
          </h3>
          
          <p className={cn(
            'text-sm text-zinc-400 line-clamp-2 leading-relaxed',
            shouldBlur && 'blur-sm'
          )}>
            {tool.description}
          </p>

          {tool.rating && (
            <div className="flex items-center gap-1 text-xs text-zinc-400">
              <span className="text-yellow-400">★</span>
              {tool.rating.toFixed(1)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
});

export { FastToolCard };