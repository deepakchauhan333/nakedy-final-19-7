'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES, PRICING_TYPES } from '@/lib/database.types';

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string | null) => void;
  onPricingChange: (pricing: string | null) => void;
  onTagsChange: (tags: string[]) => void;
  availableTags: string[];
  selectedTags: string[];
  searchQuery: string;
  selectedCategory: string | null;
  selectedPricing: string | null;
}

export function SearchFilters({
  onSearch,
  onCategoryChange,
  onPricingChange,
  onTagsChange,
  availableTags,
  selectedTags,
  searchQuery,
  selectedCategory,
  selectedPricing,
}: SearchFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(newTags);
  };

  const clearFilters = () => {
    onSearch('');
    onCategoryChange(null);
    onPricingChange(null);
    onTagsChange([]);
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedPricing || selectedTags.length > 0;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
        <Input
          placeholder="Search AI tools..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 glass-card border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Select value={selectedCategory || 'all'} onValueChange={(value) => onCategoryChange(value === 'all' ? null : value)}>
            <SelectTrigger className="w-40 glass-card border-white/10 bg-white/5 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="glass-card border-white/10 bg-zinc-900">
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category} className="text-white">
                  {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPricing || 'all'} onValueChange={(value) => onPricingChange(value === 'all' ? null : value)}>
            <SelectTrigger className="w-32 glass-card border-white/10 bg-white/5 text-white">
              <SelectValue placeholder="Pricing" />
            </SelectTrigger>
            <SelectContent className="glass-card border-white/10 bg-zinc-900">
              <SelectItem value="all">All Pricing</SelectItem>
              {PRICING_TYPES.map((pricing) => (
                <SelectItem key={pricing} value={pricing} className="text-white capitalize">
                  {pricing}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Tags
              {selectedTags.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-blue-500/20 text-blue-400">
                  {selectedTags.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 glass-card border-white/10 bg-zinc-900" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-white">Filter by Tags</Label>
                {selectedTags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTagsChange([])}
                    className="text-xs text-zinc-400 hover:text-white h-auto p-1"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto scrollbar-hide">
                {availableTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={tag}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => handleTagToggle(tag)}
                      className="border-white/20 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label
                      htmlFor={tag}
                      className="text-sm text-zinc-300 cursor-pointer capitalize"
                    >
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4 mr-2" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {(selectedTags.length > 0 || selectedCategory || selectedPricing) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-zinc-400">Active filters:</span>
          
          {selectedCategory && (
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {selectedCategory.replace('-', ' ')}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCategoryChange(null)}
                className="ml-1 h-auto p-0 hover:bg-transparent"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          
          {selectedPricing && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
              {selectedPricing}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPricingChange(null)}
                className="ml-1 h-auto p-0 hover:bg-transparent"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              #{tag}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTagToggle(tag)}
                className="ml-1 h-auto p-0 hover:bg-transparent"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}