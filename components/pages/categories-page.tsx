'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Category } from '@/lib/database.types';
import { useAgeVerification } from '@/components/providers/age-verification-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Brain, 
  Search, 
  Grid3X3,
  List,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Star,
  MessageCircle,
  Image,
  Video,
  Users,
  User,
  Mic,
  Heart,
  Play,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryWithCount extends Category {
  toolCount: number;
}

interface CategoriesPageProps {
  categories: CategoryWithCount[];
}

export function CategoriesPage({ categories }: CategoriesPageProps) {
  const { showNSFW } = useAgeVerification();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Category data with unique images and icons
  const categoryData = [
    {
      slug: 'chatbot',
      name: 'Chatbot',
      icon: MessageCircle,
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-blue-500 to-cyan-500',
      description: 'AI-powered conversational agents and virtual assistants'
    },
    {
      slug: 'image-generator',
      name: 'Image Generator',
      icon: Image,
      image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-green-500 to-emerald-500',
      description: 'AI tools for creating and editing images'
    },
    {
      slug: 'video-generator',
      name: 'Video Generator',
      icon: Video,
      image: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-yellow-500 to-orange-500',
      description: 'AI tools for creating and editing videos'
    },
    {
      slug: 'roleplay',
      name: 'Roleplay',
      icon: Users,
      image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-red-500 to-pink-500',
      description: 'AI companions for roleplay and interactive scenarios'
    },
    {
      slug: 'character-ai',
      name: 'Character AI',
      icon: User,
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-purple-500 to-violet-500',
      description: 'AI characters with distinct personalities'
    },
    {
      slug: 'voice-ai',
      name: 'Voice AI',
      icon: Mic,
      image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-cyan-500 to-blue-500',
      description: 'AI tools for voice synthesis and recognition'
    },
    {
      slug: 'companion',
      name: 'Companion',
      icon: Heart,
      image: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-pink-500 to-rose-500',
      description: 'AI companions for emotional support and friendship'
    },
    {
      slug: 'fantasy',
      name: 'Fantasy',
      icon: Sparkles,
      image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-indigo-500 to-purple-500',
      description: 'AI tools for fantasy and creative content'
    },
    {
      slug: 'animation',
      name: 'Animation',
      icon: Play,
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-orange-500 to-red-500',
      description: 'AI tools for creating animations and motion graphics'
    },
    {
      slug: 'text-generator',
      name: 'Text Generator',
      icon: FileText,
      image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-lime-500 to-green-500',
      description: 'AI tools for generating and editing text content'
    }
  ];

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort categories by tool count and activity
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (a.is_active !== b.is_active) {
      return a.is_active ? -1 : 1;
    }
    return b.toolCount - a.toolCount;
  });

  const totalTools = categories.reduce((sum, cat) => sum + cat.toolCount, 0);
  const activeCategories = categories.filter(cat => cat.is_active).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <section className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text leading-tight">
            AI Tool Categories
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Explore our comprehensive collection of AI tool categories. 
            Find the perfect tools for your specific needs.
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
            <Brain className="w-4 h-4 mr-2" />
            {activeCategories} Categories
          </Badge>
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            {totalTools} Total Tools
          </Badge>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
            <Star className="w-4 h-4 mr-2" />
            Curated Collection
          </Badge>
        </div>
      </section>

      {/* Search and Controls */}
      <section className="glass-card p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-card border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? '' : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? '' : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            <Badge variant="outline" className="text-zinc-400 border-zinc-700">
              {sortedCategories.length} categories
            </Badge>
          </div>
        </div>
      </section>

      {/* Categories Grid with Images */}
      <section>
        {sortedCategories.length > 0 ? (
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              : "space-y-4"
          )}>
            {sortedCategories.map((category) => {
              const categoryInfo = categoryData.find(cat => cat.slug === category.slug);
              const Icon = categoryInfo?.icon || Brain;
              
              return (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="block group"
                >
                  <Card className={cn(
                    'glass-card glass-hover overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]',
                    viewMode === 'list' && 'flex items-center'
                  )}>
                    {/* Category Image */}
                    <div className={cn(
                      'relative overflow-hidden',
                      viewMode === 'grid' ? 'aspect-video' : 'w-32 h-24 flex-shrink-0'
                    )}>
                      <img
                        src={categoryInfo?.image || 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800'}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${categoryInfo?.gradient || 'from-blue-500 to-cyan-500'} opacity-60`} />
                      
                      {/* Icon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      {/* Tool Count Badge */}
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-black/50 text-white border-white/20 text-xs">
                          {category.toolCount} tools
                        </Badge>
                      </div>
                    </div>

                    {/* Category Info */}
                    <CardHeader className={cn(
                      'p-4',
                      viewMode === 'list' && 'flex-1'
                    )}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors">
                            {category.name}
                          </h3>
                          {viewMode === 'grid' && category.description && (
                            <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                              {category.description}
                            </p>
                          )}
                          {viewMode === 'list' && (
                            <p className="text-sm text-zinc-400 mt-1">
                              {category.toolCount} tools available
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors ml-2" />
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              No categories found
            </h3>
            <p className="text-zinc-400 mb-4">
              Try adjusting your search query to find categories.
            </p>
            <Button
              onClick={() => setSearchQuery('')}
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Clear search
            </Button>
          </div>
        )}
      </section>

      {/* Popular Categories */}
      {searchQuery === '' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Most Popular Categories</h2>
            <TrendingUp className="w-6 h-6 text-blue-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sortedCategories.slice(0, 3).map((category) => {
              const categoryInfo = categoryData.find(cat => cat.slug === category.slug);
              const Icon = categoryInfo?.icon || Brain;
              
              return (
                <Link
                  key={`popular-${category.id}`}
                  href={`/category/${category.slug}`}
                  className="block group"
                >
                  <Card className="glass-card glass-hover cursor-pointer overflow-hidden">
                    <div className="relative aspect-video">
                      <img
                        src={categoryInfo?.image || 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800'}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${categoryInfo?.gradient || 'from-blue-500 to-cyan-500'} opacity-60`} />
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-xl text-white group-hover:text-blue-400 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-zinc-400 text-sm mt-1">
                        {category.toolCount} tools available
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-green-400" />
                          <span className="text-xs text-green-400">Popular</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}