/*
  # Complete Admin Panel Setup

  1. New Tables
    - `tool_submissions` - Store user-submitted tools for admin approval
    - Add favicon_url column to ai_tools

  2. Security
    - Enable RLS on tool_submissions table
    - Add policies for submissions

  3. Functions
    - Update existing functions to handle new fields
*/

-- Add favicon_url column to ai_tools if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_tools' AND column_name = 'favicon_url'
  ) THEN
    ALTER TABLE ai_tools ADD COLUMN favicon_url text;
  END IF;
END $$;

-- Create tool_submissions table
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
  favicon_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by text
);

-- Enable RLS on tool_submissions
ALTER TABLE tool_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for tool_submissions
CREATE POLICY "Allow all for tool_submissions" ON tool_submissions FOR ALL TO public USING (true) WITH CHECK (true);

-- Create indexes for tool_submissions
CREATE INDEX IF NOT EXISTS idx_tool_submissions_status ON tool_submissions(status);
CREATE INDEX IF NOT EXISTS idx_tool_submissions_submitted_at ON tool_submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_tool_submissions_category ON tool_submissions(category);

-- Update existing tools with better screenshot URLs
UPDATE ai_tools SET 
  screenshot_url = CASE 
    WHEN category = 'chatbot' THEN 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200'
    WHEN category = 'image-generator' THEN 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1200'
    WHEN category = 'text-generator' THEN 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1200'
    WHEN category = 'companion' THEN 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200'
    WHEN category = 'roleplay' THEN 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1200'
    WHEN category = 'voice-ai' THEN 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200'
    WHEN category = 'video-generator' THEN 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=1200'
    WHEN category = 'character-ai' THEN 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200'
    WHEN category = 'animation' THEN 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ELSE 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200'
  END
WHERE screenshot_url IS NULL OR screenshot_url = '';

-- Add some favicon URLs to existing tools
UPDATE ai_tools SET favicon_url = 'https://character.ai/favicon.ico' WHERE slug = 'character-ai-plus';
UPDATE ai_tools SET favicon_url = 'https://dreamstudio.ai/favicon.ico' WHERE slug = 'dreamstudio-ai';
UPDATE ai_tools SET favicon_url = 'https://tinki.ai/favicon.ico' WHERE slug = 'tinki-ai';