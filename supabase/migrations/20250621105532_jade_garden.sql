/*
  # Create AI Tools Directory Schema

  1. New Tables
    - `ai_tools`
      - `id` (uuid, primary key)
      - `name` (text, tool name)
      - `slug` (text, unique URL slug)
      - `description` (text, tool description)
      - `url` (text, tool website URL)
      - `is_nsfw` (boolean, content rating)
      - `pricing` (text, pricing model)
      - `features` (text array, key features)
      - `tags` (text array, searchable tags)
      - `category` (text, tool category)
      - `alt_tools` (uuid array, alternative tool IDs)
      - `views` (integer, view count)
      - `created_at` (timestamp, creation date)
      - `screenshot_url` (text, optional screenshot)
      - `rating` (numeric, average rating)
      - `review_count` (integer, number of reviews)

  2. Security
    - Enable RLS on `ai_tools` table
    - Add policy for public read access
    - Add policy for authenticated admin writes

  3. Indexes
    - Index on category for fast filtering
    - Index on tags using GIN for array searches
    - Index on views for popularity sorting
    - Index on created_at for chronological sorting

  4. Functions
    - `increment_views` function for atomic view counting
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

-- Create policy for authenticated admin writes (you'll need to adjust this based on your auth setup)
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

-- Insert sample data for demo purposes
INSERT INTO ai_tools (name, slug, description, url, category, pricing, is_nsfw, features, tags, screenshot_url, rating, review_count, views) VALUES
(
  'Character AI Plus',
  'character-ai-plus',
  'Advanced AI chatbot for creating and chatting with custom characters. Features unlimited conversations, premium voices, and NSFW content support.',
  'https://character.ai',
  'chatbot',
  'freemium',
  true,
  ARRAY['Unlimited chats', 'Custom characters', 'Voice messages', 'NSFW support', 'Memory retention'],
  ARRAY['chatbot', 'roleplay', 'conversation', 'ai-companion'],
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
  4.5,
  1250,
  15420
),
(
  'Romantic AI',
  'romantic-ai',
  'Your perfect AI girlfriend/boyfriend. Engage in meaningful conversations, share photos, and build a genuine connection with your AI companion.',
  'https://romantic.ai',
  'companion',
  'subscription',
  true,
  ARRAY['Romantic conversations', 'Photo sharing', 'Relationship building', 'Emotional support', 'Voice calls'],
  ARRAY['companion', 'relationship', 'romance', 'emotional'],
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
  4.2,
  890,
  12350
),
(
  'DreamGF AI',
  'dreamgf-ai',
  'Create your ideal AI girlfriend with customizable appearance and personality. Chat, share photos, and experience virtual intimacy.',
  'https://dreamgf.ai',
  'companion',
  'paid',
  true,
  ARRAY['Custom appearance', 'Personality traits', 'Photo generation', 'Voice messages', 'Intimate conversations'],
  ARRAY['girlfriend', 'virtual', 'customizable', 'photos'],
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
  4.1,
  650,
  9870
),
(
  'PornPen AI',
  'pornpen-ai',
  'Generate high-quality NSFW images using advanced AI technology. Create custom adult content with simple text prompts.',
  'https://pornpen.ai',
  'image-generator',
  'freemium',
  true,
  ARRAY['High-quality images', 'Text-to-image', 'Multiple styles', 'Fast generation', 'Privacy focused'],
  ARRAY['image-generation', 'nsfw', 'art', 'custom'],
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
  4.3,
  2100,
  18500
),
(
  'Candy AI',
  'candy-ai',
  'Premium AI companion platform with realistic conversations and personalities. Choose from diverse characters or create your own.',
  'https://candy.ai',
  'chatbot',
  'subscription',
  true,
  ARRAY['Realistic conversations', 'Multiple personalities', 'Character creation', 'Memory system', 'Mobile app'],
  ARRAY['chatbot', 'ai-companion', 'personalities', 'mobile'],
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
  4.4,
  1450,
  14200
),
(
  'Replika',
  'replika',
  'Your AI companion that cares. Replika is designed to be a friend you can chat with anytime. Safe, supportive, and always there for you.',
  'https://replika.ai',
  'companion',
  'freemium',
  false,
  ARRAY['24/7 availability', 'Emotional support', 'Learning conversations', 'Personal growth', 'Safe environment'],
  ARRAY['companion', 'emotional-support', 'friendship', 'safe'],
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
  4.0,
  3200,
  25600
),
(
  'Muah AI',
  'muah-ai',
  'Uncensored AI companion for adult conversations. Chat, exchange photos, and engage in unrestricted roleplay scenarios.',
  'https://muah.ai',
  'roleplay',
  'subscription',
  true,
  ARRAY['Uncensored chat', 'Photo exchange', 'Roleplay scenarios', 'Voice messages', 'Memory retention'],
  ARRAY['uncensored', 'roleplay', 'adult-chat', 'scenarios'],
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
  4.0,
  950,
  11200
),
(
  'Janitor AI',
  'janitor-ai',
  'Chat with thousands of AI characters created by the community. From wholesome conversations to NSFW roleplay.',
  'https://janitorai.com',
  'character-ai',
  'freemium',
  true,
  ARRAY['Community characters', 'Custom bots', 'NSFW support', 'Group chats', 'Character sharing'],
  ARRAY['character-ai', 'community', 'roleplay', 'custom-bots'],
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
  4.2,
  1800,
  16800
);