'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AITool, AIToolInsert } from '@/lib/database.types';
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
  Users
} from 'lucide-react';
import { CATEGORIES, PRICING_TYPES } from '@/lib/database.types';

export function AdminPanel() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTool, setEditingTool] = useState<AITool | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<AIToolInsert>>({
    name: '',
    slug: '',
    description: '',
    url: '',
    category: 'chatbot',
    pricing: 'freemium',
    is_nsfw: false,
    features: [],
    tags: [],
    screenshot_url: '',
  });
  
  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_tools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTools(data || []);
    } catch (error) {
      console.error('Error loading tools:', error);
      toast.error('Failed to load tools');
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

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features?.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter(f => f !== feature) || []
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim().toLowerCase()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingTool) {
        // Update existing tool
        const { error } = await supabase
          .from('ai_tools')
          .update(formData)
          .eq('id', editingTool.id);

        if (error) throw error;
        toast.success('Tool updated successfully');
      } else {
        // Create new tool
        const { error } = await supabase
          .from('ai_tools')
          .insert([formData as AIToolInsert]);

        if (error) throw error;
        toast.success('Tool created successfully');
      }

      // Reset form
      setFormData({
        name: '',
        slug: '',
        description: '',
        url: '',
        category: 'chatbot',
        pricing: 'freemium',
        is_nsfw: false,
        features: [],
        tags: [],
        screenshot_url: '',
      });
      setEditingTool(null);
      loadTools();
    } catch (error) {
      console.error('Error saving tool:', error);
      toast.error('Failed to save tool');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (tool: AITool) => {
    setEditingTool(tool);
    setFormData({
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
    });
  };

  const handleDelete = async (toolId: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;

    try {
      const { error } = await supabase
        .from('ai_tools')
        .delete()
        .eq('id', toolId);

      if (error) throw error;
      toast.success('Tool deleted successfully');
      loadTools();
    } catch (error) {
      console.error('Error deleting tool:', error);
      toast.error('Failed to delete tool');
    }
  };

  const cancelEdit = () => {
    setEditingTool(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      url: '',
      category: 'chatbot',
      pricing: 'freemium',
      is_nsfw: false,
      features: [],
      tags: [],
      screenshot_url: '',
    });
  };

  const stats = {
    total: tools.length,
    nsfw: tools.filter(t => t.is_nsfw).length,
    categories: [...new Set(tools.map(t => t.category))].length,
    totalViews: tools.reduce((sum, t) => sum + t.views, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-zinc-400">Manage your NSFW AI Tools Directory</p>
        </div>

        <Tabs defaultValue="tools" className="space-y-6">
          <TabsList className="glass-card p-1">
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Tools Management
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="glass-card border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-400">Total Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.total}</div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-400">NSFW Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">{stats.nsfw}</div>
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
            </div>
          </TabsContent>

          <TabsContent value="tools">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form */}
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">
                    {editingTool ? 'Edit Tool' : 'Add New Tool'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Tool Name *</Label>
                        <Input
                          id="name"
                          value={formData.name || ''}
                          onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="Enter tool name"
                          className="glass-card border-white/10 bg-white/5 text-white"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="slug" className="text-white">Slug</Label>
                        <Input
                          id="slug"
                          value={formData.slug || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder="auto-generated"
                          className="glass-card border-white/10 bg-white/5 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="url" className="text-white">Website URL *</Label>
                      <Input
                        id="url"
                        value={formData.url || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://example.com"
                        className="glass-card border-white/10 bg-white/5 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-white">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the AI tool..."
                        rows={3}
                        className="glass-card border-white/10 bg-white/5 text-white resize-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Category *</Label>
                        <Select 
                          value={formData.category} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as any }))}
                        >
                          <SelectTrigger className="glass-card border-white/10 bg-white/5 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-card border-white/10 bg-zinc-900">
                            {CATEGORIES.map((category) => (
                              <SelectItem key={category} value={category} className="text-white">
                                {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Pricing *</Label>
                        <Select 
                          value={formData.pricing} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, pricing: value as any }))}
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
                        <Label className="text-white">NSFW Content</Label>
                        <div className="flex items-center space-x-3 h-10">
                          <Switch
                            checked={formData.is_nsfw || false}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_nsfw: checked }))}
                            className="data-[state=checked]:bg-red-600"
                          />
                          <span className="text-sm text-zinc-300">
                            {formData.is_nsfw ? '18+ NSFW' : 'Safe for Work'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="screenshot_url" className="text-white">Screenshot URL</Label>
                      <Input
                        id="screenshot_url"
                        value={formData.screenshot_url || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, screenshot_url: e.target.value }))}
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
                      
                      {formData.features && formData.features.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.features.map((feature, index) => (
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
                      
                      {formData.tags && formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
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
                        <Button type="button" onClick={cancelEdit} variant="outline">
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
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-zinc-400">Loading tools...</p>
                    </div>
                  ) : tools.length === 0 ? (
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
                                  {tool.views}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(tool)}
                                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(tool.id)}
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
        </Tabs>
      </div>
    </div>
  );
}