'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Plus, 
  X, 
  Upload, 
  AlertCircle, 
  CheckCircle,
  Brain,
  ExternalLink,
  Image as ImageIcon,
  Globe,
  Palette
} from 'lucide-react';
import { PRICING_TYPES } from '@/lib/database.types';

const submitToolSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  url: z.string().url('Please enter a valid URL'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Please select a category'),
  pricing: z.enum(PRICING_TYPES as any),
  is_nsfw: z.boolean(),
  screenshot_url: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
  favicon_url: z.string().url('Please enter a valid favicon URL').optional().or(z.literal('')),
  features: z.array(z.string()).min(1, 'Add at least one feature'),
  tags: z.array(z.string()).min(1, 'Add at least one tag'),
  seo_title: z.string().min(1, 'SEO title is required').max(60, 'SEO title must be under 60 characters'),
  seo_description: z.string().min(1, 'SEO description is required').max(160, 'SEO description must be under 160 characters'),
});

type SubmitToolForm = z.infer<typeof submitToolSchema>;

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export function SubmitToolPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  const form = useForm<SubmitToolForm>({
    resolver: zodResolver(submitToolSchema),
    defaultValues: {
      name: '',
      url: '',
      description: '',
      category: '',
      pricing: 'freemium',
      is_nsfw: false,
      screenshot_url: '',
      favicon_url: '',
      features: [],
      tags: [],
      seo_title: '',
      seo_description: '',
    },
  });

  const { watch, setValue, handleSubmit, formState: { errors } } = form;
  const features = watch('features');
  const tags = watch('tags');
  const name = watch('name');
  const description = watch('description');

  useEffect(() => {
    loadCategories();
  }, []);

  // Auto-generate SEO fields when name or description changes
  useEffect(() => {
    if (name && name.length <= 60) {
      setValue('seo_title', name);
    }
  }, [name, setValue]);

  useEffect(() => {
    if (description && description.length <= 160) {
      setValue('seo_description', description);
    } else if (description && description.length > 160) {
      setValue('seo_description', description.substring(0, 157) + '...');
    }
  }, [description, setValue]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, icon')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setValue('features', [...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setValue('features', features.filter(f => f !== feature));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase())) {
      setValue('tags', [...tags, newTag.trim().toLowerCase()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setValue('tags', tags.filter(t => t !== tag));
  };

  const onSubmit = async (data: SubmitToolForm) => {
    setIsSubmitting(true);
    
    try {
      // Submit to tool_submissions table
      const { error } = await supabase
        .from('tool_submissions')
        .insert([{
          name: data.name,
          url: data.url,
          description: data.description,
          category: data.category,
          pricing: data.pricing,
          is_nsfw: data.is_nsfw,
          features: data.features,
          tags: data.tags,
          screenshot_url: data.screenshot_url || null,
          favicon_url: data.favicon_url || null,
          status: 'pending',
          submitted_at: new Date().toISOString()
        }]);

      if (error) throw error;
      
      toast.success('Tool submitted successfully! We\'ll review it within 24 hours.');
      form.reset();
    } catch (error) {
      toast.error('Failed to submit tool. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto">
          <Plus className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold gradient-text">
          Submit Your AI Tool
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Get your NSFW AI tool featured in our directory. Fill out the form below and we'll review your submission within 24 hours.
        </p>
      </div>

      {/* Submission Guidelines */}
      <Card className="glass-card border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <AlertCircle className="w-5 h-5" />
            Submission Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-zinc-300">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <span>Your tool must be functional and accessible</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <span>Provide an accurate description and features list</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <span>Include a high-quality screenshot (optional but recommended)</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <span>Add a favicon URL for better presentation</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <span>Fill in SEO title and description for better search visibility</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <span>Mark NSFW content appropriately</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <span>We review all submissions manually before publishing</span>
          </div>
        </CardContent>
      </Card>

      {/* Submission Form */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="w-5 h-5" />
            Tool Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Tool Name *</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="Enter tool name"
                  className="glass-card border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                />
                {errors.name && (
                  <p className="text-sm text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="url" className="text-white">Website URL *</Label>
                <Input
                  id="url"
                  {...form.register('url')}
                  placeholder="https://example.com"
                  className="glass-card border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                />
                {errors.url && (
                  <p className="text-sm text-red-400">{errors.url.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description *</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Describe what your AI tool does, its key features, and what makes it unique..."
                rows={4}
                className="glass-card border-white/10 bg-white/5 text-white placeholder:text-zinc-500 resize-none"
              />
              {errors.description && (
                <p className="text-sm text-red-400">{errors.description.message}</p>
              )}
            </div>

            {/* SEO Fields */}
            <div className="space-y-4 p-4 glass-card border border-blue-500/20">
              <h4 className="text-white font-medium flex items-center gap-2">
                <Palette className="w-4 h-4" />
                SEO Settings (Required for better search visibility)
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seo_title" className="text-white">SEO Title * (max 60 chars)</Label>
                  <Input
                    id="seo_title"
                    {...form.register('seo_title')}
                    placeholder="SEO optimized title for search engines"
                    className="glass-card border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                    maxLength={60}
                  />
                  <div className="text-xs text-zinc-500">
                    {(watch('seo_title') || '').length}/60 characters
                  </div>
                  {errors.seo_title && (
                    <p className="text-sm text-red-400">{errors.seo_title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seo_description" className="text-white">SEO Description * (max 160 chars)</Label>
                  <Textarea
                    id="seo_description"
                    {...form.register('seo_description')}
                    placeholder="SEO meta description for search results"
                    rows={3}
                    className="glass-card border-white/10 bg-white/5 text-white placeholder:text-zinc-500 resize-none"
                    maxLength={160}
                  />
                  <div className="text-xs text-zinc-500">
                    {(watch('seo_description') || '').length}/160 characters
                  </div>
                  {errors.seo_description && (
                    <p className="text-sm text-red-400">{errors.seo_description.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Category and Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-white">Category *</Label>
                <Select 
                  value={watch('category')} 
                  onValueChange={(value) => setValue('category', value)}
                >
                  <SelectTrigger className="glass-card border-white/10 bg-white/5 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10 bg-zinc-900">
                    {categories.map((category) => (
                      <SelectItem key={category.slug} value={category.slug} className="text-white">
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-400">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-white">Pricing Model *</Label>
                <Select 
                  value={watch('pricing')} 
                  onValueChange={(value) => setValue('pricing', value as any)}
                >
                  <SelectTrigger className="glass-card border-white/10 bg-white/5 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10 bg-zinc-900">
                    {PRICING_TYPES.map((pricing) => (
                      <SelectItem key={pricing} value={pricing} className="text-white capitalize">
                        {pricing}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Content Rating</Label>
                <div className="flex items-center space-x-3 h-10">
                  <Switch
                    checked={watch('is_nsfw')}
                    onCheckedChange={(checked) => setValue('is_nsfw', checked)}
                    className="data-[state=checked]:bg-red-600"
                  />
                  <span className="text-sm text-zinc-300">
                    {watch('is_nsfw') ? '18+ NSFW' : 'Safe for Work'}
                  </span>
                </div>
              </div>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="screenshot_url" className="text-white">Screenshot URL (Optional)</Label>
                <Input
                  id="screenshot_url"
                  {...form.register('screenshot_url')}
                  placeholder="https://example.com/screenshot.jpg"
                  className="glass-card border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                />
                <p className="text-xs text-zinc-500">
                  Provide a direct link to a high-quality screenshot (recommended: 1200x630px)
                </p>
                {errors.screenshot_url && (
                  <p className="text-sm text-red-400">{errors.screenshot_url.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="favicon_url" className="text-white">Favicon URL (Optional)</Label>
                <Input
                  id="favicon_url"
                  {...form.register('favicon_url')}
                  placeholder="https://example.com/favicon.ico"
                  className="glass-card border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                />
                <p className="text-xs text-zinc-500">
                  Direct link to your site's favicon (16x16 or 32x32 pixels)
                </p>
                {errors.favicon_url && (
                  <p className="text-sm text-red-400">{errors.favicon_url.message}</p>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <Label className="text-white">Key Features *</Label>
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a key feature"
                  className="glass-card border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {feature}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(feature)}
                        className="ml-1 h-auto p-0 hover:bg-transparent"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
              
              {errors.features && (
                <p className="text-sm text-red-400">{errors.features.message}</p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <Label className="text-white">Tags *</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  className="glass-card border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      #{tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(tag)}
                        className="ml-1 h-auto p-0 hover:bg-transparent"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
              
              {errors.tags && (
                <p className="text-sm text-red-400">{errors.tags.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white min-w-32"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Submit Tool
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="glass-card border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            What happens next?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-zinc-300">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
            <div>
              <div className="font-medium text-white">Review Process</div>
              <div className="text-zinc-400">Our team will review your submission within 24 hours</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
            <div>
              <div className="font-medium text-white">Quality Check</div>
              <div className="text-zinc-400">We'll verify your tool is working and meets our guidelines</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
            <div>
              <div className="font-medium text-white">Publication</div>
              <div className="text-zinc-400">Once approved, your tool will be live in our directory</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}