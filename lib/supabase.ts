import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = 'https://qzjfqtuefrocvjrablmq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6amZxdHVlZnJvY3ZqcmFibG1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MDE1MDksImV4cCI6MjA2NjA3NzUwOX0.3LL3j6W4cY0cwrfEYZdXLipXI8Ii2_LtJkKUAKUOsxE';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'X-Client-Info': 'nakedifyai-directory'
    },
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        signal: AbortSignal.timeout(5000), // Reduced timeout to 5 seconds
      });
    }
  },
  db: {
    schema: 'public'
  }
});

// Cache for frequently accessed data
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(operation: string, params: any): string {
  return `${operation}_${JSON.stringify(params)}`;
}

function getCachedData(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function getTools(options?: {
  category?: string;
  isNsfw?: boolean;
  search?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
  status?: string;
}) {
  const cacheKey = getCacheKey('getTools', options);
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  let query = supabase
    .from('ai_tools')
    .select('id, name, slug, description, url, is_nsfw, pricing, features, tags, category, views, created_at, screenshot_url, rating, review_count, status')
    .order('views', { ascending: false });

  if (options?.category) {
    query = query.eq('category', options.category);
  }

  if (typeof options?.isNsfw === 'boolean') {
    query = query.eq('is_nsfw', options.isNsfw);
  }

  if (options?.search) {
    query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
  }

  if (options?.tags && options.tags.length > 0) {
    query = query.overlaps('tags', options.tags);
  }

  if (options?.status) {
    query = query.eq('status', options.status);
  } else {
    query = query.eq('status', 'published');
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  try {
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tools:', error);
      throw new Error(error.message);
    }

    const result = data || [];
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Database query failed:', error);
    return [];
  }
}

export async function getToolBySlug(slug: string) {
  const cacheKey = getCacheKey('getToolBySlug', { slug });
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('Error fetching tool by slug:', error);
      throw new Error(error.message);
    }

    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Failed to fetch tool:', error);
    throw error;
  }
}

export async function incrementViews(toolId: string) {
  try {
    // Use a more efficient approach with reduced timeout
    const { error } = await Promise.race([
      supabase.rpc('increment_views', { tool_id: toolId }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 2000)
      )
    ]);
    
    if (error) {
      console.warn('View increment failed:', error);
    }
  } catch (error) {
    console.warn('View increment timeout or error:', error);
    // Don't throw error to prevent page crashes
  }
}

export async function getCategories() {
  const cacheKey = getCacheKey('getCategories', {});
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      throw new Error(error.message);
    }

    const result = data || [];
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export async function getTags() {
  const cacheKey = getCacheKey('getTags', {});
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('tags')
      .select('name')
      .eq('is_active', true)
      .order('usage_count', { ascending: false })
      .limit(50); // Limit to most popular tags

    if (error) {
      console.error('Error fetching tags:', error);
      throw new Error(error.message);
    }

    const result = data?.map(tag => tag.name) || [];
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return [];
  }
}

export async function getCollections() {
  const cacheKey = getCacheKey('getCollections', {});
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('is_public', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching collections:', error);
      throw new Error(error.message);
    }

    const result = data || [];
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Failed to fetch collections:', error);
    return [];
  }
}

export async function getAlternativeTools(toolIds: string[]) {
  if (toolIds.length === 0) return [];

  const cacheKey = getCacheKey('getAlternativeTools', { toolIds });
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('id, name, slug, description, pricing, rating, screenshot_url')
      .in('id', toolIds)
      .eq('status', 'published')
      .limit(5);

    if (error) {
      console.error('Error fetching alternative tools:', error);
      throw new Error(error.message);
    }

    const result = data || [];
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Failed to fetch alternative tools:', error);
    return [];
  }
}

export async function getFeaturedTools(limit: number = 10) {
  const cacheKey = getCacheKey('getFeaturedTools', { limit });
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('id, name, slug, description, pricing, rating, screenshot_url, views')
      .eq('is_featured', true)
      .eq('status', 'published')
      .order('views', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching featured tools:', error);
      throw new Error(error.message);
    }

    const result = data || [];
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Failed to fetch featured tools:', error);
    return [];
  }
}

export async function getToolsByCategory(categorySlug: string, limit?: number) {
  const cacheKey = getCacheKey('getToolsByCategory', { categorySlug, limit });
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  let query = supabase
    .from('ai_tools')
    .select('id, name, slug, description, pricing, rating, screenshot_url, views, is_nsfw, tags, features')
    .eq('category', categorySlug)
    .eq('status', 'published')
    .order('views', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  try {
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tools by category:', error);
      throw new Error(error.message);
    }

    const result = data || [];
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Failed to fetch tools by category:', error);
    return [];
  }
}

export async function searchTools(searchQuery: string, filters?: {
  category?: string;
  pricing?: string;
  tags?: string[];
  isNsfw?: boolean;
}) {
  const cacheKey = getCacheKey('searchTools', { searchQuery, filters });
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  let query = supabase
    .from('ai_tools')
    .select('id, name, slug, description, pricing, rating, screenshot_url, views, is_nsfw, tags, category')
    .eq('status', 'published');

  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`);
  }

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.pricing) {
    query = query.eq('pricing', filters.pricing);
  }

  if (filters?.tags && filters.tags.length > 0) {
    query = query.overlaps('tags', filters.tags);
  }

  if (typeof filters?.isNsfw === 'boolean') {
    query = query.eq('is_nsfw', filters.isNsfw);
  }

  query = query.order('views', { ascending: false }).limit(50);

  try {
    const { data, error } = await query;

    if (error) {
      console.error('Error searching tools:', error);
      throw new Error(error.message);
    }

    const result = data || [];
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
}