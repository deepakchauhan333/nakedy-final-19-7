'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useAgeVerification } from '@/components/providers/age-verification-provider';
import { FastToolCard } from '@/components/fast-tool-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LazyImage } from '@/components/ui/lazy-image';
import { SemanticMain, SemanticSection, SemanticHeader } from '@/components/ui/semantic-layout';
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Star,
  ChevronRight,
  Zap,
  Crown,
  Heart,
  Search
} from 'lucide-react';
import Link from 'next/link';

interface FastTool {
  id: string;
  name: string;
  slug: string;
  description: string;
  url: string;
  category: string;
  pricing: string;
  is_nsfw: boolean;
  views: number;
  rating?: number;
  screenshot_url?: string;
}

interface FastCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
}

interface FastHomePageProps {
  initialTools: FastTool[];
  categories: FastCategory[];
}

const ToolCardSkeleton = () => (
  <div className="glass-card overflow-hidden animate-pulse">
    <div className="aspect-video bg-zinc-800" />
    <div className="p-4 space-y-3">
      <div className="h-6 bg-zinc-800 rounded" />
      <div className="h-4 bg-zinc-800 rounded w-3/4" />
    </div>
  </div>
);

const FastToolsGrid = React.memo(({ tools }: { tools: FastTool[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {tools.map((tool) => (
      <FastToolCard key={tool.id} tool={tool} />
    ))}
  </div>
));

export function FastHomePage({ initialTools, categories }: FastHomePageProps) {
  const { showNSFW } = useAgeVerification();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Ultra-fast filtering with minimal operations
  const filteredTools = useMemo(() => {
    let filtered = initialTools;

    if (!showNSFW) {
      filtered = filtered.filter(tool => !tool.is_nsfw);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [initialTools, showNSFW, searchQuery]);

  const categorizedTools = useMemo(() => {
    const sorted = [...filteredTools];
    return {
      all: sorted,
      trending: sorted.sort((a, b) => b.views - a.views).slice(0, 12),
      new: sorted.slice(0, 12),
      top: sorted.filter(tool => tool.rating && tool.rating >= 4.5).slice(0, 12),
      free: sorted.filter(tool => tool.pricing === 'free').slice(0, 12),
    };
  }, [filteredTools]);

  const getCurrentTools = () => {
    return categorizedTools[activeTab as keyof typeof categorizedTools] || [];
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'trending': return <TrendingUp className="w-4 h-4" />;
      case 'new': return <Clock className="w-4 h-4" />;
      case 'top': return <Star className="w-4 h-4" />;
      case 'free': return <Heart className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  return (
    <SemanticMain className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Section */}
      <SemanticHeader className="text-center space-y-6 py-12 hero-section">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text leading-tight">
            Discover the Best
            <br />
            <span className="text-red-400">NSFW AI Tools</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Explore the most comprehensive directory of adult AI tools, chatbots, and services. 
            Find the perfect AI companion for your needs.
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30 px-4 py-2">
            <Crown className="w-4 h-4 mr-2" />
            {initialTools.length}+ Premium Tools
          </Badge>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
            <Zap className="w-4 h-4 mr-2" />
            Updated Daily
          </Badge>
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Expert Reviews
          </Badge>
        </div>
      </SemanticHeader>

      {/* Fast Search */}
      <SemanticSection>
        <div className="glass-card p-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <Input
              placeholder="Search AI tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-card border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
            />
          </div>
        </div>
      </SemanticSection>

      {/* Tools Grid with Tabs */}
      <SemanticSection className="space-y-6 tool-grid">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="glass-card p-1 w-full justify-start overflow-x-auto">
            <TabsTrigger value="all" className="flex items-center gap-2 whitespace-nowrap">
              {getTabIcon('all')}
              All ({categorizedTools.all.length})
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2 whitespace-nowrap">
              {getTabIcon('trending')}
              Trending ({categorizedTools.trending.length})
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-2 whitespace-nowrap">
              {getTabIcon('new')}
              New ({categorizedTools.new.length})
            </TabsTrigger>
            <TabsTrigger value="top" className="flex items-center gap-2 whitespace-nowrap">
              {getTabIcon('top')}
              Top Rated ({categorizedTools.top.length})
            </TabsTrigger>
            <TabsTrigger value="free" className="flex items-center gap-2 whitespace-nowrap">
              {getTabIcon('free')}
              Free ({categorizedTools.free.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {getCurrentTools().length > 0 ? (
              <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ToolCardSkeleton key={i} />
                  ))}
                </div>
              }>
                <FastToolsGrid tools={getCurrentTools()} />
              </Suspense>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-zinc-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No tools found</h3>
                <p className="text-zinc-400 mb-4">
                  Try adjusting your search or filters.
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
          </TabsContent>
        </Tabs>
      </SemanticSection>

      {/* Categories Section */}
      <SemanticSection className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Popular Categories</h2>
          <Button asChild variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            <Link href="/categories">
              View all
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 8).map((category) => {
            const categoryTools = initialTools.filter(tool => tool.category === category.slug);
            const categoryCount = showNSFW 
              ? categoryTools.length 
              : categoryTools.filter(tool => !tool.is_nsfw).length;
            
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="block group"
              >
                <div className="glass-card glass-hover overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]">
                  <div className="relative aspect-video overflow-hidden">
                    <LazyImage
                      src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt={category.name}
                      className="w-full h-full"
                    />
                    <div 
                      className="absolute inset-0 opacity-60"
                      style={{ background: `linear-gradient(135deg, ${category.color}80, ${category.color}40)` }}
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Brain className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-black/50 text-white border-white/20">
                        {categoryCount} tools
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-white mb-1 group-hover:text-blue-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      Explore {categoryCount} amazing tools
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </SemanticSection>
    </SemanticMain>
  );
}