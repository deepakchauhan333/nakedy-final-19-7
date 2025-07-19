/*
  # Fix Database Schema and Policies

  1. Drop conflicting policies
  2. Create clean database schema
  3. Add demo data
  4. Set up proper RLS policies
*/

-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow all for categories" ON categories;
DROP POLICY IF EXISTS "Allow all for ai_tools" ON ai_tools;
DROP POLICY IF EXISTS "Allow all for tags" ON tags;
DROP POLICY IF EXISTS "Allow all for collections" ON collections;
DROP POLICY IF EXISTS "Allow all for collection_tools" ON collection_tools;
DROP POLICY IF EXISTS "Allow all for tool_submissions" ON tool_submissions;

-- Ensure all tables exist with proper structure
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  color text DEFAULT '#6366f1',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  url text NOT NULL,
  is_nsfw boolean DEFAULT false,
  pricing text DEFAULT 'freemium',
  features text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  category text NOT NULL,
  category_id uuid,
  alt_tools uuid[] DEFAULT '{}',
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  screenshot_url text,
  rating numeric(3,2),
  review_count integer DEFAULT 0,
  status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured boolean DEFAULT false,
  seo_title text,
  seo_description text
);

CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  color text DEFAULT '#8b5cf6',
  usage_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  cover_image_url text,
  is_featured boolean DEFAULT false,
  is_public boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS collection_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES collections(id) ON DELETE CASCADE,
  tool_id uuid REFERENCES ai_tools(id) ON DELETE CASCADE,
  sort_order integer DEFAULT 0,
  added_at timestamptz DEFAULT now(),
  UNIQUE(collection_id, tool_id)
);

CREATE TABLE IF NOT EXISTS tool_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  pricing text DEFAULT 'freemium',
  is_nsfw boolean DEFAULT false,
  features text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  screenshot_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by text
);

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_submissions ENABLE ROW LEVEL SECURITY;

-- Create simple, permissive policies
CREATE POLICY "Public access for categories" ON categories FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public access for ai_tools" ON ai_tools FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public access for tags" ON tags FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public access for collections" ON collections FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public access for collection_tools" ON collection_tools FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public access for tool_submissions" ON tool_submissions FOR ALL TO public USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_tools_category ON ai_tools(category);
CREATE INDEX IF NOT EXISTS idx_ai_tools_tags ON ai_tools USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_ai_tools_views ON ai_tools(views DESC);
CREATE INDEX IF NOT EXISTS idx_ai_tools_created_at ON ai_tools(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_tools_status ON ai_tools(status);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

CREATE INDEX IF NOT EXISTS idx_tool_submissions_status ON tool_submissions(status);
CREATE INDEX IF NOT EXISTS idx_tool_submissions_submitted_at ON tool_submissions(submitted_at DESC);

-- Create helper functions
CREATE OR REPLACE FUNCTION increment_views(tool_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE ai_tools 
  SET views = views + 1 
  WHERE id = tool_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert demo categories
INSERT INTO categories (name, slug, description, icon, color, sort_order) VALUES
('Chatbots', 'chatbots', 'AI conversational agents and virtual assistants', 'MessageCircle', '#3b82f6', 1),
('Image Generators', 'image-generators', 'AI tools for creating and editing images', 'Image', '#10b981', 2),
('Text Generators', 'text-generators', 'AI tools for generating and editing text content', 'FileText', '#f59e0b', 3),
('Voice & Audio', 'voice-audio', 'AI tools for voice synthesis and audio processing', 'Mic', '#8b5cf6', 4),
('Video Creation', 'video-creation', 'AI tools for creating and editing videos', 'Video', '#ef4444', 5)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  sort_order = EXCLUDED.sort_order;

-- Insert demo tools
INSERT INTO ai_tools (name, slug, description, url, category, pricing, is_nsfw, features, tags, screenshot_url, rating, review_count, views, seo_title, seo_description) VALUES
(
  'ChatGPT Plus',
  'chatgpt-plus',
  'Advanced AI chatbot powered by GPT-4 with enhanced capabilities for conversations, coding, analysis, and creative tasks.',
  'https://chat.openai.com',
  'chatbots',
  'subscription',
  false,
  ARRAY['GPT-4 powered', 'Code generation', 'Data analysis', 'Creative writing', 'Multi-language support', 'Plugin ecosystem'],
  ARRAY['chatbot', 'gpt-4', 'conversation', 'ai-assistant', 'openai'],
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
  4.8,
  15420,
  125000,
  'ChatGPT Plus - Advanced AI Chatbot with GPT-4',
  'Experience the power of GPT-4 with ChatGPT Plus. Advanced AI conversations, coding help, analysis, and creative assistance in one platform.'
),
(
  'DALL-E 3',
  'dall-e-3',
  'State-of-the-art AI image generator that creates stunning, high-quality images from simple text descriptions with incredible detail and accuracy.',
  'https://openai.com/dall-e-3',
  'image-generators',
  'paid',
  false,
  ARRAY['High-quality images', 'Text-to-image', 'Creative control', 'Multiple styles', 'Commercial usage', 'Safety features'],
  ARRAY['image-generation', 'dall-e', 'art', 'creative', 'openai'],
  'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1200',
  4.7,
  8950,
  89000,
  'DALL-E 3 - AI Image Generator by OpenAI',
  'Create stunning images from text with DALL-E 3. Advanced AI image generation with incredible detail, creativity, and commercial usage rights.'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  url = EXCLUDED.url,
  category = EXCLUDED.category,
  pricing = EXCLUDED.pricing,
  is_nsfw = EXCLUDED.is_nsfw,
  features = EXCLUDED.features,
  tags = EXCLUDED.tags,
  screenshot_url = EXCLUDED.screenshot_url,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  views = EXCLUDED.views,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description;

-- Insert demo tags
INSERT INTO tags (name, slug, description, color) VALUES
('chatbot', 'chatbot', 'AI conversational agents', '#3b82f6'),
('image-generation', 'image-generation', 'AI image creation tools', '#10b981'),
('text-generation', 'text-generation', 'AI writing assistants', '#f59e0b'),
('voice', 'voice', 'AI voice and audio tools', '#8b5cf6'),
('video', 'video', 'AI video creation tools', '#ef4444'),
('free', 'free', 'Completely free to use', '#10b981'),
('premium', 'premium', 'Premium features available', '#f59e0b'),
('api', 'api', 'Provides API access', '#3b82f6'),
('mobile', 'mobile', 'Mobile app available', '#8b5cf6'),
('web', 'web', 'Web-based application', '#06b6d4')
ON CONFLICT (slug) DO NOTHING;

-- Update tag usage counts
UPDATE tags 
SET usage_count = (
  SELECT COUNT(*)
  FROM ai_tools
  WHERE tags.name = ANY(ai_tools.tags)
);