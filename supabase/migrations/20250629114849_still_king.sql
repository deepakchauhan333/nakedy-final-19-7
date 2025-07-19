/*
  # Add SEO fields to ai_tools table

  1. New Columns
    - `seo_title` (text) - SEO optimized title for search engines (max 60 chars)
    - `seo_description` (text) - SEO meta description for search results (max 160 chars)

  2. Updates
    - Add SEO fields to existing ai_tools table
    - Update existing tools with basic SEO data
*/

-- Add SEO fields to ai_tools table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_tools' AND column_name = 'seo_title'
  ) THEN
    ALTER TABLE ai_tools ADD COLUMN seo_title text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_tools' AND column_name = 'seo_description'
  ) THEN
    ALTER TABLE ai_tools ADD COLUMN seo_description text;
  END IF;
END $$;

-- Update existing tools with basic SEO data
UPDATE ai_tools 
SET 
  seo_title = CASE 
    WHEN LENGTH(name) <= 60 THEN name
    ELSE SUBSTRING(name FROM 1 FOR 57) || '...'
  END,
  seo_description = CASE 
    WHEN LENGTH(description) <= 160 THEN description
    ELSE SUBSTRING(description FROM 1 FOR 157) || '...'
  END
WHERE seo_title IS NULL OR seo_description IS NULL;

-- Create indexes for SEO fields
CREATE INDEX IF NOT EXISTS idx_ai_tools_seo_title ON ai_tools(seo_title);
CREATE INDEX IF NOT EXISTS idx_ai_tools_seo_description ON ai_tools(seo_description);