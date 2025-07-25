'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  priority?: boolean;
}

export function LazyImage({ src, alt, className, fallback, priority = false }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  if (hasError && fallback) {
    return (
      <div className={cn(
        'flex items-center justify-center bg-zinc-800 text-zinc-400',
        className
      )}>
        <span className="text-2xl font-bold">{fallback}</span>
      </div>
    );
  }

  return (
    <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}
    </div>
  );
}