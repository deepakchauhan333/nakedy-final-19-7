/*
  # Update Tool Images and Add More Sample Data

  1. Update existing tools with real screenshot URLs
  2. Add more sample tools with proper images
  3. Ensure all tools have valid image URLs
*/

-- Update existing tools with real screenshot URLs
UPDATE ai_tools SET screenshot_url = 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200' WHERE slug = 'character-ai-plus';
UPDATE ai_tools SET screenshot_url = 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1200' WHERE slug = 'dreamstudio-ai';

-- Add more sample tools with proper images
INSERT INTO ai_tools (name, slug, description, url, category, pricing, is_nsfw, features, tags, screenshot_url, rating, review_count, views) VALUES
(
  'Tinki AI',
  'tinki-ai',
  'Advanced text generation AI tool for creating high-quality content, articles, and creative writing with powerful language models.',
  'https://tinki.ai',
  'text-generator',
  'paid',
  false,
  ARRAY['Advanced text generation', 'Multiple writing styles', 'SEO optimization', 'Plagiarism detection', 'Real-time collaboration'],
  ARRAY['text-generation', 'writing', 'content', 'seo', 'creative'],
  'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1200',
  4.6,
  850,
  12400
),
(
  'Romantic AI Companion',
  'romantic-ai-companion',
  'Your perfect AI girlfriend/boyfriend. Engage in meaningful conversations, share photos, and build a genuine connection.',
  'https://romantic.ai',
  'companion',
  'subscription',
  true,
  ARRAY['Romantic conversations', 'Photo sharing', 'Relationship building', 'Emotional support', 'Voice calls'],
  ARRAY['companion', 'relationship', 'romance', 'emotional'],
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
  4.2,
  890,
  12350
),
(
  'Fantasy Roleplay AI',
  'fantasy-roleplay-ai',
  'Immerse yourself in fantasy worlds with AI-powered roleplay scenarios. Create custom characters and epic adventures.',
  'https://fantasy-rp.ai',
  'roleplay',
  'freemium',
  true,
  ARRAY['Fantasy scenarios', 'Custom characters', 'Epic adventures', 'World building', 'Story generation'],
  ARRAY['fantasy', 'roleplay', 'adventure', 'characters', 'stories'],
  'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1200',
  4.4,
  1200,
  15600
),
(
  'Voice AI Studio',
  'voice-ai-studio',
  'Professional voice synthesis and cloning technology. Create realistic voices for any project with advanced AI.',
  'https://voice-studio.ai',
  'voice-ai',
  'paid',
  false,
  ARRAY['Voice cloning', 'Multiple languages', 'Emotion control', 'Real-time synthesis', 'Commercial license'],
  ARRAY['voice', 'synthesis', 'cloning', 'audio', 'professional'],
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
  4.5,
  650,
  9800
),
(
  'AI Video Creator',
  'ai-video-creator',
  'Create stunning videos with AI. Generate animations, edit footage, and produce professional content with simple prompts.',
  'https://video-creator.ai',
  'video-generator',
  'subscription',
  false,
  ARRAY['Video generation', 'Animation creation', 'Auto editing', 'Multiple formats', 'HD quality'],
  ARRAY['video', 'animation', 'editing', 'creation', 'professional'],
  'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1200',
  4.3,
  1100,
  14200
),
(
  'Character Creator AI',
  'character-creator-ai',
  'Design and interact with unique AI characters. Each character has distinct personalities, memories, and conversation styles.',
  'https://character-creator.ai',
  'character-ai',
  'freemium',
  true,
  ARRAY['Character design', 'Personality traits', 'Memory system', 'Conversation styles', 'Visual avatars'],
  ARRAY['characters', 'personality', 'design', 'avatars', 'conversation'],
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
  4.1,
  950,
  11800
),
(
  'Animation Studio AI',
  'animation-studio-ai',
  'Professional animation creation with AI assistance. Create 2D and 3D animations, motion graphics, and visual effects.',
  'https://animation-studio.ai',
  'animation',
  'paid',
  false,
  ARRAY['2D/3D animation', 'Motion graphics', 'Visual effects', 'Auto rigging', 'Export options'],
  ARRAY['animation', '2d', '3d', 'motion-graphics', 'effects'],
  'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1200',
  4.4,
  750,
  10500
)
ON CONFLICT (slug) DO UPDATE SET
  screenshot_url = EXCLUDED.screenshot_url,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  views = EXCLUDED.views;