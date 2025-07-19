'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { AITool } from '@/lib/database.types';
import { useAgeVerification } from '@/components/providers/age-verification-provider';
import { SearchFilters } from '@/components/search-filters';
import { ToolCard } from '@/components/tool-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  MessageCircle,
  Image,
  Video,
  Users,
  User,
  Mic,
  Play,
  FileText
} from 'lucide-react';
import Link from 'next/link';

interface HomePageProps {
  initialTools: AITool[];
  availableTags: string[];
}

// Loading skeleton component
const ToolCardSkeleton = () => (
  <div className="glass-card overflow-hidden animate-pulse">
    <div className="aspect-video bg-zinc-800" />
    <div className="p-4 space-y-3">
      <div className="h-6 bg-zinc-800 rounded" />
      <div className="h-4 bg-zinc-800 rounded w-3/4" />
      <div className="h-4 bg-zinc-800 rounded w-1/2" />
    </div>
  </div>
);

const ToolsGrid = React.memo(({ tools }: { tools: AITool[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {tools.map((tool) => (
      <ToolCard key={tool.id} tool={tool} />
    ))}
  </div>
));

export function HomePage({ initialTools, availableTags }: HomePageProps) {
  const { showNSFW } = useAgeVerification();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPricing, setSelectedPricing] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  // Filter tools based on current filters and NSFW setting
  const filteredTools = useMemo(() => {
    let filtered = initialTools;

    // Filter by NSFW preference
    if (!showNSFW) {
      filtered = filtered.filter(tool => !tool.is_nsfw);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    // Filter by pricing
    if (selectedPricing) {
      filtered = filtered.filter(tool => tool.pricing === selectedPricing);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(tool =>
        selectedTags.some(tag => tool.tags?.includes(tag))
      );
    }

    return filtered;
  }, [initialTools, showNSFW, searchQuery, selectedCategory, selectedPricing, selectedTags]);

  // Categorize tools for tabs
  const categorizedTools = useMemo(() => {
    return {
      all: filteredTools,
      trending: filteredTools.sort((a, b) => b.views - a.views).slice(0, 12),
      new: filteredTools.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ).slice(0, 12),
      top: filteredTools.filter(tool => tool.rating && tool.rating >= 4.5).slice(0, 12),
      free: filteredTools.filter(tool => tool.pricing === 'free').slice(0, 12),
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

  // Category data with unique images and icons
  const categoryData = [
    {
      slug: 'chatbot',
      name: 'Chatbot',
      icon: MessageCircle,
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      slug: 'image-generator',
      name: 'Image Generator',
      icon: Image,
      image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      slug: 'video-generator',
      name: 'Video Generator',
      icon: Video,
      image: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      slug: 'roleplay',
      name: 'Roleplay',
      icon: Users,
      image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      slug: 'character-ai',
      name: 'Character AI',
      icon: User,
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-purple-500 to-violet-500'
    },
    {
      slug: 'voice-ai',
      name: 'Voice AI',
      icon: Mic,
      image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      slug: 'companion',
      name: 'Companion',
      icon: Heart,
      image: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      slug: 'fantasy',
      name: 'Fantasy',
      icon: Sparkles,
      image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      slug: 'animation',
      name: 'Animation',
      icon: Play,
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      slug: 'text-generator',
      name: 'Text Generator',
      icon: FileText,
      image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-lime-500 to-green-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
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
      </section>

      {/* Search and Filters */}
      <section className="glass-card p-6">
        <SearchFilters
          onSearch={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onPricingChange={setSelectedPricing}
          onTagsChange={setSelectedTags}
          availableTags={availableTags}
          selectedTags={selectedTags}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          selectedPricing={selectedPricing}
        />
      </section>

      {/* Tools Grid with Tabs */}
      <section className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="glass-card p-1 w-full justify-start overflow-x-auto">
            <TabsTrigger value="all" className="flex items-center gap-2 whitespace-nowrap">
              {getTabIcon('all')}
              All Tools ({categorizedTools.all.length})
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
                <ToolsGrid tools={getCurrentTools()} />
              </Suspense>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-zinc-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No tools found</h3>
                <p className="text-zinc-400 mb-4">
                  Try adjusting your filters or search query to find more tools.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                    setSelectedPricing(null);
                    setSelectedTags([]);
                  }}
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* Categories Section with Image Cards */}
      <section className="space-y-6">
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
          {categoryData.slice(0, 8).map((category) => {
            const categoryTools = initialTools.filter(tool => tool.category === category.slug);
            const categoryCount = showNSFW 
              ? categoryTools.length 
              : categoryTools.filter(tool => !tool.is_nsfw).length;
            
            const Icon = category.icon;
            
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="block group"
              >
                <div className="glass-card glass-hover overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]">
                  {/* Category Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-60`} />
                    
                    {/* Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    {/* Tool Count Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-black/50 text-white border-white/20">
                        {categoryCount} tools
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Category Info */}
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
      </section>
    </div>
  );
}