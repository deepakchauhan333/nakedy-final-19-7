'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AITool, AIToolInsert, Category, ToolSubmission } from '@/lib/database.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Plus, 
  X, 
  Edit, 
  Trash2, 
  Eye,
  Settings,
  Database,
  BarChart3,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Palette
} from 'lucide-react';
import { PRICING_TYPES } from '@/lib/database.types';

interface Stats {
  totalTools: number;
  nsfwTools: number;
  categories: number;
  totalViews: number;
  pendingSubmissions: number;
}

export function EnhancedAdminPanel() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [submissions, setSubmissions] = useState<ToolSubmission[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalTools: 0,
    nsfwTools: 0,
    categories: 0,
    totalViews: 0,
    pendingSubmissions: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTool, setEditingTool] = useState<AITool | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Tool form state
  const [toolFormData, setToolFormData] = useState<Partial<AIToolInsert>>({
    name: '',
    slug: '',
    description: '',
    url: '',
    category: '',
    pricing: 'freemium',
    is_nsfw: false,
    features: [],
    tags: [],
    screenshot_url: '',
    seo_title: '',
    seo_description: '',
  });

  // Category form state
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    color: '#6366f1',
  });
  
  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load tools
      const { data: toolsData, error: toolsError } = await supabase
        .from('ai_tools')
        .select('*')
        .order('created_at', { ascending: false });

      if (toolsError) {
        console.error('Error loading tools:', toolsError);
        // Create some demo tools if table is empty
        if (toolsError.code === '42P01') {
          console.log('Tools table does not exist, using demo data');
          setTools([]);
        } else {
          throw toolsError;
        }
      } else {
        setTools(toolsData || []);
      }

      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (categoriesError) {
        console.error('Error loading categories:', categoriesError);
        if (categoriesError.code === '42P01') {
          console.log('Categories table does not exist, using demo data');
          setCategories([]);
        } else {
          throw categoriesError;
        }
      } else {
        setCategories(categoriesData || []);
      }

      // Try to load submissions (optional table)
      try {
        const { data: submissionsData, error: submissionsError } = await supabase
          .from('tool_submissions')
          .select('*')
          .order('submitted_at', { ascending: false });

        if (submissionsError) {
          console.log('Submissions table does not exist yet');
          setSubmissions([]);
        } else {
          setSubmissions(submissionsData || []);
        }
      } catch (error) {
        console.log('Submissions table not available');
        setSubmissions([]);
      }

      // Calculate stats
      const toolsArray = toolsData || [];
      const categoriesArray = categoriesData || [];
      const submissionsArray = submissions || [];

      setStats({
        totalTools: toolsArray.length,
        nsfwTools: toolsArray.filter(t => t.is_nsfw).length,
        categories: categoriesArray.length,
        totalViews: toolsArray.reduce((sum, t) => sum + (t.views || 0), 0),
        pendingSubmissions: submissionsArray.filter(s => s.status === 'pending').length,
      });

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data. Please check your database connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleToolNameChange = (name: string) => {
    setToolFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
      seo_title: name.length <= 60 ? name : name.substring(0, 57) + '...'
    }));
  };

  const handleToolDescriptionChange = (description: string) => {
    setToolFormData(prev => ({
      ...prev,
      description,
      seo_description: description.length <= 160 ? description : description.substring(0, 157) + '...'
    }));
  };

  const handleCategoryNameChange = (name: string) => {
    setCategoryFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !toolFormData.features?.includes(newFeature.trim())) {
      setToolFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setToolFormData(prev => ({
      ...prev,
      features: prev.features?.filter(f => f !== feature) || []
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !toolFormData.tags?.includes(newTag.trim().toLowerCase())) {
      setToolFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim().toLowerCase()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setToolFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const handleToolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingTool) {
        // Update existing tool
        const { error } = await supabase
          .from('ai_tools')
          .update(toolFormData)
          .eq('id', editingTool.id);

        if (error) throw error;
        toast.success('Tool updated successfully');
      } else {
        // Create new tool
        const { error } = await supabase
          .from('ai_tools')
          .insert([{
            ...toolFormData,
            status: 'published',
            views: 0,
            created_at: new Date().toISOString()
          } as AIToolInsert]);

        if (error) throw error;
        toast.success('Tool created successfully');
      }

      // Reset form
      setToolFormData({
        name: '',
        slug: '',
        description: '',
        url: '',
        category: '',
        pricing: 'freemium',
        is_nsfw: false,
        features: [],
        tags: [],
        screenshot_url: '',
        seo_title: '',
        seo_description: '',
      });
      setEditingTool(null);
      loadData();
    } catch (error) {
      console.error('Error saving tool:', error);
      toast.error('Failed to save tool. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update(categoryFormData)
          .eq('id', editingCategory.id);

        if (error) throw error;
        toast.success('Category updated successfully');
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert([{
            ...categoryFormData,
            is_active: true,
            sort_order: categories.length + 1,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
        toast.success('Category created successfully');
      }

      // Reset form
      setCategoryFormData({
        name: '',
        slug: '',
        description: '',
        icon: '',
        color: '#6366f1',
      });
      setEditingCategory(null);
      loadData();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTool = (tool: AITool) => {
    setEditingTool(tool);
    setToolFormData({
      name: tool.name,
      slug: tool.slug,
      description: tool.description,
      url: tool.url,
      category: tool.category,
      pricing: tool.pricing,
      is_nsfw: tool.is_nsfw,
      features: tool.features || [],
      tags: tool.tags || [],
      screenshot_url: tool.screenshot_url || '',
      seo_title: tool.seo_title || tool.name,
      seo_description: tool.seo_description || tool.description,
    });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || '',
      color: category.color,
    });
  };

  const handleDeleteTool = async (toolId: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;

    try {
      const { error } = await supabase
        .from('ai_tools')
        .delete()
        .eq('id', toolId);

      if (error) throw error;
      toast.success('Tool deleted successfully');
      loadData();
    } catch (error) {
      console.error('Error deleting tool:', error);
      toast.error('Failed to delete tool');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;
      toast.success('Category deleted successfully');
      loadData();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const cancelToolEdit = () => {
    setEditingTool(null);
    setToolFormData({
      name: '',
      slug: '',
      description: '',
      url: '',
      category: '',
      pricing: 'freemium',
      is_nsfw: false,
      features: [],
      tags: [],
      screenshot_url: '',
      seo_title: '',
      seo_description: '',
    });
  };

  const cancelCategoryEdit = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      slug: '',
      description: '',
      icon: '',
      color: '#6366f1',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="glass-card border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalTools}</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">NSFW Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{stats.nsfwTools}</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{stats.categories}</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{stats.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{stats.pendingSubmissions}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tools" className="space-y-6">
        <TabsList className="glass-card p-1">
          <TabsTrigger value="tools" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Tools Management
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="submissions" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Submissions ({stats.pendingSubmissions})
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Statistics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tools">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tool Form */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">
                  {editingTool ? 'Edit Tool' : 'Add New Tool'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleToolSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tool-name" className="text-white">Tool Name *</Label>
                      <Input
                        id="tool-name"
                        value={toolFormData.name || ''}
                        onChange={(e) => handleToolNameChange(e.target.value)}
                        placeholder="Enter tool name"
                        className="glass-card border-white/10 bg-white/5 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tool-slug" className="text-white">Slug</Label>
                      <Input
                        id="tool-slug"
                        value={toolFormData.slug || ''}
                        onChange={(e) => setToolFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="auto-generated"
                        className="glass-card border-white/10 bg-white/5 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tool-url" className="text-white">Website URL *</Label>
                    <Input
                      id="tool-url"
                      value={toolFormData.url || ''}
                      onChange={(e) => setToolFormData(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://example.com"
                      className="glass-card border-white/10 bg-white/5 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tool-description" className="text-white">Description *</Label>
                    <Textarea
                      id="tool-description"
                      value={toolFormData.description || ''}
                      onChange={(e) => handleToolDescriptionChange(e.target.value)}
                      placeholder="Describe the AI tool..."
                      rows={3}
                      className="glass-card border-white/10 bg-white/5 text-white resize-none"
                      required
                    />
                  </div>

                  {/* SEO Fields */}
                  <div className="space-y-4 p-4 glass-card border border-blue-500/20">
                    <h4 className="text-white font-medium flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      SEO Settings (Required)
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="seo-title" className="text-white">SEO Title * (max 60 chars)</Label>
                        <Input
                          id="seo-title"
                          value={toolFormData.seo_title || ''}
                          onChange={(e) => setToolFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                          placeholder="SEO optimized title"
                          className="glass-card border-white/10 bg-white/5 text-white"
                          maxLength={60}
                          required
                        />
                        <div className="text-xs text-zinc-500">
                          {(toolFormData.seo_title || '').length}/60 characters
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="seo-description" className="text-white">SEO Description * (max 160 chars)</Label>
                        <Textarea
                          id="seo-description"
                          value={toolFormData.seo_description || ''}
                          onChange={(e) => setToolFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                          placeholder="SEO meta description"
                          rows={3}
                          className="glass-card border-white/10 bg-white/5 text-white resize-none"
                          maxLength={160}
                          required
                        />
                        <div className="text-xs text-zinc-500">
                          {(toolFormData.seo_description || '').length}/160 characters
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Category *</Label>
                      <Select 
                        value={toolFormData.category} 
                        onValueChange={(value) => setToolFormData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className="glass-card border-white/10 bg-white/5 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-white/10 bg-zinc-900">
                          {categories.map((category) => (
                            <SelectItem key={category.slug} value={category.slug} className="text-white">
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Pricing *</Label>
                      <Select 
                        value={toolFormData.pricing} 
                        onValueChange={(value) => setToolFormData(prev => ({ ...prev, pricing: value as any }))}
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
                          checked={toolFormData.is_nsfw || false}
                          onCheckedChange={(checked) => setToolFormData(prev => ({ ...prev, is_nsfw: checked }))}
                          className="data-[state=checked]:bg-red-600"
                        />
                        <span className="text-sm text-zinc-300">
                          {toolFormData.is_nsfw ? '18+ NSFW' : 'Safe for Work'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="screenshot-url" className="text-white">Screenshot URL</Label>
                    <Input
                      id="screenshot-url"
                      value={toolFormData.screenshot_url || ''}
                      onChange={(e) => setToolFormData(prev => ({ ...prev, screenshot_url: e.target.value }))}
                      placeholder="https://example.com/screenshot.jpg"
                      className="glass-card border-white/10 bg-white/5 text-white"
                    />
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <Label className="text-white">Features</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Add a feature"
                        className="glass-card border-white/10 bg-white/5 text-white"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      />
                      <Button type="button" onClick={addFeature} size="sm" variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {toolFormData.features && toolFormData.features.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {toolFormData.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-400">
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
                  </div>

                  {/* Tags */}
                  <div className="space-y-3">
                    <Label className="text-white">Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        className="glass-card border-white/10 bg-white/5 text-white"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag} size="sm" variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {toolFormData.tags && toolFormData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {toolFormData.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-400">
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
                  </div>

                  <div className="flex gap-3 pt-4">
                    {editingTool && (
                      <Button type="button" onClick={cancelToolEdit} variant="outline">
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {isSubmitting ? 'Saving...' : editingTool ? 'Update Tool' : 'Add Tool'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Tools List */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Existing Tools ({tools.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {tools.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-zinc-400">No tools found. Add your first tool!</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {tools.map((tool) => (
                      <div key={tool.id} className="glass-card p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white truncate">{tool.name}</h3>
                            <p className="text-sm text-zinc-400 line-clamp-2">{tool.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {tool.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {tool.pricing}
                              </Badge>
                              {tool.is_nsfw && (
                                <Badge variant="destructive" className="text-xs">
                                  18+
                                </Badge>
                              )}
                              <div className="flex items-center gap-1 text-xs text-zinc-500">
                                <Eye className="w-3 h-3" />
                                {tool.views || 0}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditTool(tool)}
                              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteTool(tool.id)}
                              className="border-red-700 text-red-400 hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Form */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category-name" className="text-white">Category Name *</Label>
                      <Input
                        id="category-name"
                        value={categoryFormData.name}
                        onChange={(e) => handleCategoryNameChange(e.target.value)}
                        placeholder="Enter category name"
                        className="glass-card border-white/10 bg-white/5 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category-slug" className="text-white">Slug</Label>
                      <Input
                        id="category-slug"
                        value={categoryFormData.slug}
                        onChange={(e) => setCategoryFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="auto-generated"
                        className="glass-card border-white/10 bg-white/5 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category-description" className="text-white">Description</Label>
                    <Textarea
                      id="category-description"
                      value={categoryFormData.description}
                      onChange={(e) => setCategoryFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the category..."
                      rows={3}
                      className="glass-card border-white/10 bg-white/5 text-white resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category-icon" className="text-white">Icon (Lucide name)</Label>
                      <Input
                        id="category-icon"
                        value={categoryFormData.icon}
                        onChange={(e) => setCategoryFormData(prev => ({ ...prev, icon: e.target.value }))}
                        placeholder="MessageCircle"
                        className="glass-card border-white/10 bg-white/5 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category-color" className="text-white">Color</Label>
                      <Input
                        id="category-color"
                        type="color"
                        value={categoryFormData.color}
                        onChange={(e) => setCategoryFormData(prev => ({ ...prev, color: e.target.value }))}
                        className="glass-card border-white/10 bg-white/5 text-white h-10"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    {editingCategory && (
                      <Button type="button" onClick={cancelCategoryEdit} variant="outline">
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isSubmitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Add Category'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Categories List */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Existing Categories ({categories.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {categories.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-zinc-400">No categories found. Add your first category!</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {categories.map((category) => (
                      <div key={category.id} className="glass-card p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div 
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: category.color }}
                              />
                              <h3 className="font-medium text-white truncate">{category.name}</h3>
                            </div>
                            <p className="text-sm text-zinc-400 line-clamp-2">{category.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {category.slug}
                              </Badge>
                              {category.icon && (
                                <Badge variant="outline" className="text-xs">
                                  {category.icon}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditCategory(category)}
                              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteCategory(category.id)}
                              className="border-red-700 text-red-400 hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="submissions">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Tool Submissions ({submissions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-zinc-400">No submissions found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="glass-card p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-white">{submission.name}</h3>
                          <p className="text-sm text-zinc-400 mt-1">{submission.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {submission.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {submission.pricing}
                            </Badge>
                            <Badge 
                              variant={submission.status === 'pending' ? 'secondary' : 
                                     submission.status === 'approved' ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {submission.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {submission.status === 'pending' && (
                            <>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive">
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total Tools</span>
                  <span className="text-white font-medium">{stats.totalTools}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">NSFW Tools</span>
                  <span className="text-red-400 font-medium">{stats.nsfwTools}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Categories</span>
                  <span className="text-blue-400 font-medium">{stats.categories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total Views</span>
                  <span className="text-green-400 font-medium">{stats.totalViews.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-zinc-300">Admin panel accessed</span>
                    <span className="text-zinc-500 ml-auto">Now</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="text-zinc-300">Database connected</span>
                    <span className="text-zinc-500 ml-auto">Now</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}