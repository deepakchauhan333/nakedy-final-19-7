/*
  # Complete AI Tools Directory Setup with Demo Data

  This SQL script will:
  1. Create the ai_tools table with all necessary columns
  2. Set up Row Level Security (RLS) policies
  3. Create performance indexes
  4. Add the increment_views function
  5. Insert 2 demo tools from 2 different categories

  Simply copy and paste this entire script into your Supabase SQL Editor.
*/

-- Create the ai_tools table
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
  alt_tools uuid[] DEFAULT '{}',
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  screenshot_url text,
  rating numeric(3,2),
  review_count integer DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE ai_tools ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public read access for ai_tools"
  ON ai_tools
  FOR SELECT
  TO public
  USING (true);

-- Create policy for authenticated admin writes
CREATE POLICY "Authenticated admin write access for ai_tools"
  ON ai_tools
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_tools_category ON ai_tools(category);
CREATE INDEX IF NOT EXISTS idx_ai_tools_tags ON ai_tools USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_ai_tools_views ON ai_tools(views DESC);
CREATE INDEX IF NOT EXISTS idx_ai_tools_created_at ON ai_tools(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_tools_rating ON ai_tools(rating DESC) WHERE rating IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ai_tools_is_nsfw ON ai_tools(is_nsfw);

-- Create function to increment views atomically
CREATE OR REPLACE FUNCTION increment_views(tool_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE ai_tools 
  SET views = views + 1 
  WHERE id = tool_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert demo data: 2 tools from 2 different categories
INSERT INTO ai_tools (name, slug, description, url, category, pricing, is_nsfw, features, tags, screenshot_url, rating, review_count, views) VALUES
(
  'Character AI Plus',
  'character-ai-plus',
  'Advanced AI chatbot for creating and chatting with custom characters. Features unlimited conversations, premium voices, and NSFW content support for mature users.',
  'https://character.ai',
  'chatbot',
  'freemium',
  true,
  ARRAY['Unlimited chats', 'Custom characters', 'Voice messages', 'NSFW support', 'Memory retention', 'Multiple personalities'],
  ARRAY['chatbot', 'roleplay', 'conversation', 'ai-companion', 'characters'],
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
  4.5,
  1250,
  15420
),
(
  'DreamStudio AI',
  'dreamstudio-ai',
  'Professional AI image generator powered by Stable Diffusion. Create stunning artwork, portraits, and creative visuals with simple text prompts.',
  'https://dreamstudio.ai',
  'image-generator',
  'paid',
  false,
  ARRAY['High-quality images', 'Text-to-image', 'Multiple art styles', 'Fast generation', 'Commercial license', 'HD resolution'],
  ARRAY['image-generation', 'art', 'creative', 'stable-diffusion', 'professional'],
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
  4.3,
  2100,
  18500
);

-- Verify the data was inserted
SELECT 
  name, 
  category, 
  pricing, 
  is_nsfw, 
  views,
  array_length(features, 1) as feature_count,
  array_length(tags, 1) as tag_count
FROM ai_tools 
ORDER BY created_at DESC;