export interface Database {
  public: {
    Tables: {
      ai_tools: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          url: string;
          is_nsfw: boolean;
          pricing: string;
          features: string[];
          tags: string[];
          category: string;
          category_id?: string;
          alt_tools: string[];
          views: number;
          created_at: string;
          updated_at?: string;
          screenshot_url?: string;
          favicon_url?: string;
          rating?: number;
          review_count?: number;
          status?: string;
          is_featured?: boolean;
          seo_title?: string;
          seo_description?: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          url: string;
          is_nsfw?: boolean;
          pricing?: string;
          features?: string[];
          tags?: string[];
          category?: string;
          category_id?: string;
          alt_tools?: string[];
          views?: number;
          created_at?: string;
          updated_at?: string;
          screenshot_url?: string;
          favicon_url?: string;
          rating?: number;
          review_count?: number;
          status?: string;
          is_featured?: boolean;
          seo_title?: string;
          seo_description?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          url?: string;
          is_nsfw?: boolean;
          pricing?: string;
          features?: string[];
          tags?: string[];
          category?: string;
          category_id?: string;
          alt_tools?: string[];
          views?: number;
          created_at?: string;
          updated_at?: string;
          screenshot_url?: string;
          favicon_url?: string;
          rating?: number;
          review_count?: number;
          status?: string;
          is_featured?: boolean;
          seo_title?: string;
          seo_description?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description?: string;
          icon?: string;
          color: string;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          icon?: string;
          color?: string;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          icon?: string;
          color?: string;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description?: string;
          color: string;
          usage_count: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          color?: string;
          usage_count?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          color?: string;
          usage_count?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      collections: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description?: string;
          cover_image_url?: string;
          is_featured: boolean;
          is_public: boolean;
          sort_order: number;
          created_by?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          cover_image_url?: string;
          is_featured?: boolean;
          is_public?: boolean;
          sort_order?: number;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          cover_image_url?: string;
          is_featured?: boolean;
          is_public?: boolean;
          sort_order?: number;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      collection_tools: {
        Row: {
          id: string;
          collection_id: string;
          tool_id: string;
          sort_order: number;
          added_at: string;
        };
        Insert: {
          id?: string;
          collection_id: string;
          tool_id: string;
          sort_order?: number;
          added_at?: string;
        };
        Update: {
          id?: string;
          collection_id?: string;
          tool_id?: string;
          sort_order?: number;
          added_at?: string;
        };
      };
      tool_submissions: {
        Row: {
          id: string;
          name: string;
          url: string;
          description: string;
          category: string;
          pricing: string;
          is_nsfw: boolean;
          features: string[];
          tags: string[];
          screenshot_url?: string;
          favicon_url?: string;
          status: 'pending' | 'approved' | 'rejected';
          submitted_at: string;
          reviewed_at?: string;
          reviewed_by?: string;
        };
        Insert: {
          id?: string;
          name: string;
          url: string;
          description: string;
          category: string;
          pricing: string;
          is_nsfw?: boolean;
          features?: string[];
          tags?: string[];
          screenshot_url?: string;
          favicon_url?: string;
          status?: 'pending' | 'approved' | 'rejected';
          submitted_at?: string;
          reviewed_at?: string;
          reviewed_by?: string;
        };
        Update: {
          id?: string;
          name?: string;
          url?: string;
          description?: string;
          category?: string;
          pricing?: string;
          is_nsfw?: boolean;
          features?: string[];
          tags?: string[];
          screenshot_url?: string;
          favicon_url?: string;
          status?: 'pending' | 'approved' | 'rejected';
          submitted_at?: string;
          reviewed_at?: string;
          reviewed_by?: string;
        };
      };
    };
  };
}

export type AITool = Database['public']['Tables']['ai_tools']['Row'];
export type AIToolInsert = Database['public']['Tables']['ai_tools']['Insert'];
export type AIToolUpdate = Database['public']['Tables']['ai_tools']['Update'];

export type Category = Database['public']['Tables']['categories']['Row'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
export type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

export type Tag = Database['public']['Tables']['tags']['Row'];
export type TagInsert = Database['public']['Tables']['tags']['Insert'];
export type TagUpdate = Database['public']['Tables']['tags']['Update'];

export type Collection = Database['public']['Tables']['collections']['Row'];
export type CollectionInsert = Database['public']['Tables']['collections']['Insert'];
export type CollectionUpdate = Database['public']['Tables']['collections']['Update'];

export type CollectionTool = Database['public']['Tables']['collection_tools']['Row'];
export type CollectionToolInsert = Database['public']['Tables']['collection_tools']['Insert'];
export type CollectionToolUpdate = Database['public']['Tables']['collection_tools']['Update'];

export type ToolSubmission = Database['public']['Tables']['tool_submissions']['Row'];
export type ToolSubmissionInsert = Database['public']['Tables']['tool_submissions']['Insert'];
export type ToolSubmissionUpdate = Database['public']['Tables']['tool_submissions']['Update'];

export const CATEGORIES = [
  'chatbot',
  'image-generator',
  'video-generator',
  'roleplay',
  'character-ai',
  'voice-ai',
  'companion',
  'fantasy',
  'animation',
  'text-generator'
] as const;

export type CategoryType = typeof CATEGORIES[number];

export const PRICING_TYPES = [
  'free',
  'freemium',
  'paid',
  'subscription'
] as const;

export type PricingType = typeof PRICING_TYPES[number];

export const TOOL_STATUS = [
  'draft',
  'published',
  'archived'
] as const;

export type ToolStatus = typeof TOOL_STATUS[number];