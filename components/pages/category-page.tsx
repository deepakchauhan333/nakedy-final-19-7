'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AITool, Category } from '@/lib/database.types';
import { useAgeVerification } from '@/components/providers/age-verification-provider';
import { ToolCard } from '@/components/tool-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  TrendingUp, 
  Star, 
  Calendar,
  Grid3X3,
  List,
  ChevronLeft,
  Search,
  Filter,
  Sparkles
} from 'lucide-react';

interface CategoryPageProps {
  category: Category;
  tools: AITool[];
}

export function CategoryPage({ category, tools }: CategoryPageProps) {
  const { showNSFW } = useAgeVerification();
  const [sortBy, setSortBy] = useState('views');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [pricingFilter, setPricingFilter] = useState<string>('all');

  // Filter and sort tools
  const processedTools = useMemo(() => {
    let filtered = tools;

    // Filter by NSFW preference
    if (!showNSFW) {
      filtered = filtered.filter(tool => !tool.is_nsfw);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by pricing
    if (pricingFilter !== 'all') {
      filtered = filtered.filter(tool => tool.pricing === pricingFilter);
    }

    // Sort tools
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return b.views - a.views;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [tools, showNSFW, sortBy, searchQuery, pricingFilter]);

  const getSortIcon = (sort: string) => {
    switch (sort) {
      case 'views': return <TrendingUp className="w-4 h-4" />;
      case 'rating': return <Star className="w-4 h-4" />;
      case 'newest': return <Calendar className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const pricingOptions = ['free', 'freemium', 'paid', 'subscription'];
  const availablePricing = [...new Set(tools.map(tool => tool.pricing))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
            <Link href="/categories">
              <ChevronLeft className="w-4 h-4 mr-2" />
              All Categories
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${category.color}20`, border: `1px solid ${category.color}30` }}
            >
              <Brain 
                className="w-8 h-8" 
                style={{ color: category.color }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                {category.name} AI Tools
              </h1>
              <p className="text-zinc-400">
                {category.description || `Discover the best ${category.name.toLowerCase()} AI tools and services`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <Badge 
              variant="secondary" 
              className="border"
              style={{ 
                backgroundColor: `${category.color}20`, 
                color: category.color,
                borderColor: `${category.color}30`
              }}
            >
              {processedTools.length} {processedTools.length === 1 ? 'tool' : 'tools'} found
            </Badge>
            
            {!showNSFW && (
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                Safe mode active
              </Badge>
            )}

            {searchQuery && (
              <Badge variant="outline" className="text-zinc-400 border-zinc-700">
                Search: "{searchQuery}"
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <Input
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-card border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
              />
            </div>
          </div>

          <Select value={pricingFilter} onValueChange={setPricingFilter}>
            <SelectTrigger className="w-40 glass-card border-white/10 bg-white/5 text-white">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <SelectValue placeholder="Pricing" />
              </div>
            </SelectTrigger>
            <SelectContent className="glass-card border-white/10 bg-zinc-900">
              <SelectItem value="all" className="text-white">All Pricing</SelectItem>
              {availablePricing.map((pricing) => (
                <SelectItem key={pricing} value={pricing} className="text-white capitalize">
                  {pricing}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-400">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 glass-card border-white/10 bg-white/5 text-white">
                  <div className="flex items-center gap-2">
                    {getSortIcon(sortBy)}
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10 bg-zinc-900">
                  <SelectItem value="views" className="text-white">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Most Popular
                    </div>
                  </SelectItem>
                  <SelectItem value="rating" className="text-white">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Highest Rated
                    </div>
                  </SelectItem>
                  <SelectItem value="newest" className="text-white">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Newest First
                    </div>
                  </SelectItem>
                  <SelectItem value="name" className="text-white">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Alphabetical
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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
        </div>
      </div>

      {/* Tools Grid */}
      {processedTools.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }>
          {processedTools.map((tool) => (
            <ToolCard 
              key={tool.id} 
              tool={tool}
              showNSFWBlur={!showNSFW}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${category.color}20`, border: `1px solid ${category.color}30` }}
          >
            <Brain 
              className="w-8 h-8" 
              style={{ color: category.color }}
            />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            No {category.name.toLowerCase()} tools found
          </h3>
          <p className="text-zinc-400 mb-4">
            {searchQuery || pricingFilter !== 'all'
              ? 'Try adjusting your search or filters to find more tools.'
              : !showNSFW 
                ? 'Try enabling NSFW content to see more tools, or check back later for new additions.'
                : 'Check back later for new tools in this category.'
            }
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {(searchQuery || pricingFilter !== 'all') && (
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setPricingFilter('all');
                }}
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                Clear filters
              </Button>
            )}
            <Button asChild variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              <Link href="/categories">
                Browse other categories
              </Link>
            </Button>
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
              <Link href="/submit">
                <Sparkles className="w-4 h-4 mr-2" />
                Submit a tool
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}