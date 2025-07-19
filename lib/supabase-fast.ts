import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { ultraCache } from './cache';

const supabaseUrl = 'https://qzjfqtuefrocvjrablmq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6amZxdHVlZnJvY3ZqcmFibG1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MDE1MDksImV4cCI6MjA2NjA3NzUwOX0.3LL3j6W4cY0cwrfEYZdXLipXI8Ii2_LtJkKUAKUOsxE';

// Ultra-fast client with minimal config
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  global: {
    headers: { 'X-Client-Info': 'nakedifyai-fast' },
    fetch: (url, options = {}) => fetch(url, { ...options, signal: AbortSignal.timeout(5000) })
  },
  db: { schema: 'public' }
});

// Minimal data structures for ultra-fast loading
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
  seo_title?: string;
  seo_description?: string;
  features?: string[];
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

interface FastCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
  icon?: string;
}

// Ultra-fast queries with aggressive caching
export async function getFastTools(limit = 20): Promise<FastTool[]> {
  const cacheKey = `fast_tools_${limit}`;
  const cached = ultraCache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('id,name,slug,description,url,category,pricing,is_nsfw,views,rating,screenshot_url,seo_title,seo_description,features,tags,created_at')
      .eq('status', 'published')
      .order('views', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching tools:', error);
      return [];
    }

    const result = data || [];
    ultraCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Database error in getFastTools:', error);
    return [];
  }
}

export async function getFastCategories(): Promise<FastCategory[]> {
  const cacheKey = 'fast_categories';
  const cached = ultraCache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id,name,slug,color,description,icon')
      .eq('is_active', true)
      .order('sort_order')
      .limit(10);

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    const result = data || [];
    ultraCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Database error in getFastCategories:', error);
    return [];
  }
}

export async function getFastToolBySlug(slug: string): Promise<FastTool | null> {
  if (!slug || typeof slug !== 'string') {
    console.error('Invalid slug provided to getFastToolBySlug:', slug);
    return null;
  }

  const cacheKey = `fast_tool_${slug}`;
  const cached = ultraCache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('Tool not found for slug:', slug);
        return null;
      }
      console.error('Database error fetching tool by slug:', error);
      return null;
    }

    if (data) {
      ultraCache.set(cacheKey, data);
      return data;
    }
  } catch (error) {
    console.error('Unexpected error in getFastToolBySlug:', error);
  }
  
  return null;
}

export async function getFastToolsByCategory(categorySlug: string, limit = 50): Promise<FastTool[]> {
  if (!categorySlug || typeof categorySlug !== 'string') {
    console.error('Invalid category slug provided:', categorySlug);
    return [];
  }

  const cacheKey = `fast_category_${categorySlug}_${limit}`;
  const cached = ultraCache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('id,name,slug,description,url,category,pricing,is_nsfw,views,rating,screenshot_url,tags,features,seo_title,seo_description')
      .eq('category', categorySlug)
      .eq('status', 'published')
      .order('views', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching tools by category:', error);
      return [];
    }

    const result = data || [];
    ultraCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Database error in getFastToolsByCategory:', error);
    return [];
  }
}

// Get all tool slugs for static generation
export async function getAllFastToolSlugs(): Promise<string[]> {
  const cacheKey = 'all_tool_slugs';
  const cached = ultraCache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('slug')
      .eq('status', 'published');

    if (error) {
      console.error('Error fetching tool slugs:', error);
      return [];
    }

    const slugs = data?.map(tool => tool.slug).filter(Boolean) || [];
    ultraCache.set(cacheKey, slugs);
    return slugs;
  } catch (error) {
    console.error('Database error in getAllFastToolSlugs:', error);
    return [];
  }
}

// Background view increment (fire and forget)
export function incrementViewsFast(toolId: string): void {
  if (!toolId || typeof toolId !== 'string') {
    console.warn('Invalid toolId provided to incrementViewsFast:', toolId);
    return;
  }

  // Use requestIdleCallback for non-blocking execution
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    requestIdleCallback(() => {
      fetch(`${supabaseUrl}/rest/v1/rpc/increment_views`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tool_id: toolId })
      }).catch((error) => {
        console.warn('Failed to increment views:', error);
      });
    });
  }
}

// Preload critical data
export async function preloadCriticalData(): Promise<void> {
  try {
    await ultraCache.preload(
      ['fast_tools_20', 'fast_categories'],
      async (key) => {
        if (key === 'fast_tools_20') return getFastTools(20);
        if (key === 'fast_categories') return getFastCategories();
        return null;
      }
    );
  } catch (error) {
    console.error('Error preloading critical data:', error);
  }
}

// Search functionality
export async function searchFastTools(query: string, limit = 20): Promise<FastTool[]> {
  if (!query || query.trim().length < 2) return [];

  const cacheKey = `search_${query.toLowerCase()}_${limit}`;
  const cached = ultraCache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('id,name,slug,description,url,category,pricing,is_nsfw,views,rating,screenshot_url')
      .eq('status', 'published')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
      .order('views', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error searching tools:', error);
      return [];
    }

    const result = data || [];
    ultraCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Database error in searchFastTools:', error);
    return [];
  }
}