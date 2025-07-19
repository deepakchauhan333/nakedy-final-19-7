/*
  # Comprehensive AI Tools Directory Schema

  1. New Tables
    - `categories` - Manage tool categories
    - `tags` - Manage available tags
    - `collections` - Curated tool collections
    - `collection_tools` - Many-to-many relationship for collections and tools
    - Enhanced `ai_tools` table with better relationships

  2. Security
    - Enable RLS on all tables
    - Public read access for most tables
    - Admin write access for management tables

  3. Functions
    - Auto-generate slugs
    - Update timestamps
    - Increment views atomically
*/

-- Create categories table
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

-- Create tags table
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

-- Create collections table
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

-- Create collection_tools junction table
CREATE TABLE IF NOT EXISTS collection_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES collections(id) ON DELETE CASCADE,
  tool_id uuid REFERENCES ai_tools(id) ON DELETE CASCADE,
  sort_order integer DEFAULT 0,
  added_at timestamptz DEFAULT now(),
  UNIQUE(collection_id, tool_id)
);

-- Update ai_tools table structure (add new columns if they don't exist)
DO $$
BEGIN
  -- Add category_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_tools' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE ai_tools ADD COLUMN category_id uuid REFERENCES categories(id);
  END IF;

  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_tools' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE ai_tools ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;

  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_tools' AND column_name = 'status'
  ) THEN
    ALTER TABLE ai_tools ADD COLUMN status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'));
  END IF;

  -- Add featured column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_tools' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE ai_tools ADD COLUMN is_featured boolean DEFAULT false;
  END IF;
END $$;

-- Enable Row Level Security on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_tools ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for categories"
  ON categories FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Public read access for tags"
  ON tags FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Public read access for collections"
  ON collections FOR SELECT TO public USING (is_public = true);

CREATE POLICY "Public read access for collection_tools"
  ON collection_tools FOR SELECT TO public USING (true);

-- Create policies for authenticated admin access
CREATE POLICY "Admin full access for categories"
  ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access for tags"
  ON tags FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access for collections"
  ON collections FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access for collection_tools"
  ON collection_tools FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_tags_active ON tags(is_active);
CREATE INDEX IF NOT EXISTS idx_tags_usage_count ON tags(usage_count DESC);

CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_featured ON collections(is_featured);
CREATE INDEX IF NOT EXISTS idx_collections_public ON collections(is_public);

CREATE INDEX IF NOT EXISTS idx_collection_tools_collection ON collection_tools(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_tools_tool ON collection_tools(tool_id);

CREATE INDEX IF NOT EXISTS idx_ai_tools_category_id ON ai_tools(category_id);
CREATE INDEX IF NOT EXISTS idx_ai_tools_status ON ai_tools(status);
CREATE INDEX IF NOT EXISTS idx_ai_tools_featured ON ai_tools(is_featured);

-- Create function to auto-generate slugs
CREATE OR REPLACE FUNCTION generate_slug(input_text text)
RETURNS text AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(input_text, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at
  BEFORE UPDATE ON tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_tools_updated_at
  BEFORE UPDATE ON ai_tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, slug, description, icon, color, sort_order) VALUES
('Chatbot', 'chatbot', 'AI-powered conversational agents and virtual assistants', 'MessageCircle', '#3b82f6', 1),
('Image Generator', 'image-generator', 'AI tools for creating and editing images', 'Image', '#10b981', 2),
('Video Generator', 'video-generator', 'AI tools for creating and editing videos', 'Video', '#f59e0b', 3),
('Roleplay', 'roleplay', 'AI companions for roleplay and interactive scenarios', 'Users', '#ef4444', 4),
('Character AI', 'character-ai', 'AI characters with distinct personalities', 'User', '#8b5cf6', 5),
('Voice AI', 'voice-ai', 'AI tools for voice synthesis and recognition', 'Mic', '#06b6d4', 6),
('Companion', 'companion', 'AI companions for emotional support and friendship', 'Heart', '#ec4899', 7),
('Fantasy', 'fantasy', 'AI tools for fantasy and creative content', 'Sparkles', '#6366f1', 8),
('Animation', 'animation', 'AI tools for creating animations and motion graphics', 'Play', '#f97316', 9),
('Text Generator', 'text-generator', 'AI tools for generating and editing text content', 'FileText', '#84cc16', 10)
ON CONFLICT (slug) DO NOTHING;

-- Insert default tags
INSERT INTO tags (name, slug, description, color) VALUES
('free', 'free', 'Completely free to use', '#10b981'),
('premium', 'premium', 'Premium features available', '#f59e0b'),
('nsfw', 'nsfw', 'Adult content - 18+ only', '#ef4444'),
('sfw', 'sfw', 'Safe for work content', '#10b981'),
('api', 'api', 'Provides API access', '#3b82f6'),
('mobile', 'mobile', 'Mobile app available', '#8b5cf6'),
('web', 'web', 'Web-based application', '#06b6d4'),
('opensource', 'opensource', 'Open source project', '#84cc16'),
('realtime', 'realtime', 'Real-time processing', '#f97316'),
('customizable', 'customizable', 'Highly customizable', '#ec4899'),
('beginner-friendly', 'beginner-friendly', 'Easy for beginners', '#6366f1'),
('advanced', 'advanced', 'Advanced features for experts', '#ef4444')
ON CONFLICT (slug) DO NOTHING;

-- Insert default collections
INSERT INTO collections (name, slug, description, is_featured, sort_order) VALUES
('Top Rated Tools', 'top-rated-tools', 'The highest rated AI tools in our directory', true, 1),
('Free Tools', 'free-tools', 'Completely free AI tools you can use right now', true, 2),
('New Releases', 'new-releases', 'Recently added tools to our directory', true, 3),
('Editor''s Choice', 'editors-choice', 'Hand-picked tools recommended by our team', true, 4),
('Trending Now', 'trending-now', 'Most popular tools this month', false, 5)
ON CONFLICT (slug) DO NOTHING;

-- Update existing ai_tools to link with categories
UPDATE ai_tools 
SET category_id = c.id 
FROM categories c 
WHERE ai_tools.category = c.slug 
AND ai_tools.category_id IS NULL;

-- Function to update tag usage count
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS void AS $$
BEGIN
  UPDATE tags 
  SET usage_count = (
    SELECT COUNT(*)
    FROM ai_tools
    WHERE tags.name = ANY(ai_tools.tags)
  );
END;
$$ LANGUAGE plpgsql;

-- Update tag usage counts
SELECT update_tag_usage_count();