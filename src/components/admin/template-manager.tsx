// Template management interface
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AdminTemplate, TEMPLATE_CATEGORIES } from '@/lib/admin-types';
import { Plus, Edit, Trash2, Eye, Search, Copy, FileText } from 'lucide-react';

interface TemplateManagerProps {
  onClose?: () => void;
}

export function TemplateManager({ onClose }: TemplateManagerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingTemplate, setEditingTemplate] = useState<AdminTemplate | null>(null);
  const [viewingTemplate, setViewingTemplate] = useState<AdminTemplate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [templatePreview, setTemplatePreview] = useState('');

  // Form state for new/edit template
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general' as AdminTemplate['category'],
    body: ''
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    if (!user) return;
    
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/admin/templates', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      } else {
        throw new Error('Failed to load templates');
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load templates',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!user) return;
    
    try {
      const token = await user.getIdToken();
      const isEditing = editingTemplate !== null;
      const url = isEditing 
        ? `/api/admin/templates/${editingTemplate.id}`
        : '/api/admin/templates';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: `Template ${isEditing ? 'updated' : 'created'} successfully`
        });
        
        setIsDialogOpen(false);
        setEditingTemplate(null);
        setFormData({ name: '', description: '', category: 'general', body: '' });
        loadTemplates();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save template',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteTemplate = async (template: AdminTemplate) => {
    if (!user || !template.isCustom) return;
    
    if (!confirm(`Are you sure you want to delete "${template.name}"?`)) {
      return;
    }
    
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/admin/templates/${template.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Template deleted successfully'
        });
        loadTemplates();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete template',
        variant: 'destructive'
      });
    }
  };

  const handlePreviewTemplate = async (template: AdminTemplate) => {
    if (!user) return;
    
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/admin/templates/${template.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTemplatePreview(data.preview || '');
        setViewingTemplate(template);
        setIsPreviewOpen(true);
      }
    } catch (error) {
      console.error('Error loading preview:', error);
      toast({
        title: 'Error',
        description: 'Failed to load template preview',
        variant: 'destructive'
      });
    }
  };

  const handleEditTemplate = (template: AdminTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      category: template.category,
      body: template.body
    });
    setIsDialogOpen(true);
  };

  const handleCreateNew = () => {
    setEditingTemplate(null);
    setFormData({ name: '', description: '', category: 'general', body: '' });
    setIsDialogOpen(true);
  };

  const handleDuplicateTemplate = (template: AdminTemplate) => {
    setEditingTemplate(null);
    setFormData({
      name: `${template.name} (Copy)`,
      description: template.description,
      category: template.category,
      body: template.body
    });
    setIsDialogOpen(true);
  };

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.variables.some(v => v.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Group templates by category
  const templatesByCategory = filteredTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, AdminTemplate[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Template Management</h2>
          <p className="text-muted-foreground">Manage letter templates and create new ones</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(TEMPLATE_CATEGORIES).map(([key, category]) => (
              <SelectItem key={key} value={key}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates by Category */}
      <Tabs value={selectedCategory === 'all' ? Object.keys(templatesByCategory)[0] || 'evaluation' : selectedCategory} 
            onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          {selectedCategory === 'all' && (
            <TabsTrigger value="all">All ({filteredTemplates.length})</TabsTrigger>
          )}
          {Object.entries(TEMPLATE_CATEGORIES).map(([key, category]) => {
            const count = templatesByCategory[key]?.length || 0;
            return (
              <TabsTrigger key={key} value={key}>
                {category.name} ({count})
              </TabsTrigger>
            );
          })}
        </TabsList>

        {selectedCategory === 'all' ? (
          <div className="mt-6 space-y-6">
            {Object.entries(templatesByCategory).map(([categoryKey, categoryTemplates]) => (
              <div key={categoryKey}>
                <h3 className="text-lg font-semibold mb-3">
                  {TEMPLATE_CATEGORIES[categoryKey as keyof typeof TEMPLATE_CATEGORIES]?.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onEdit={handleEditTemplate}
                      onDelete={handleDeleteTemplate}
                      onPreview={handlePreviewTemplate}
                      onDuplicate={handleDuplicateTemplate}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          Object.entries(TEMPLATE_CATEGORIES).map(([key, category]) => (
            <TabsContent key={key} value={key}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(templatesByCategory[key] || []).map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onEdit={handleEditTemplate}
                    onDelete={handleDeleteTemplate}
                    onPreview={handlePreviewTemplate}
                    onDuplicate={handleDuplicateTemplate}
                  />
                ))}
              </div>
            </TabsContent>
          ))
        )}
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate ? 'Modify the template details below.' : 'Create a new template for advocacy letters.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter template name"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe when to use this template"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as AdminTemplate['category'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TEMPLATE_CATEGORIES).map(([key, category]) => (
                      <SelectItem key={key} value={key}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="body">Template Body</Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                placeholder="Use {{variableName}} for dynamic content"
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use double braces for variables: {{childName}}, {{schoolName}}, etc.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>
              {editingTemplate ? 'Update Template' : 'Create Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Template Preview: {viewingTemplate?.name}</DialogTitle>
            <DialogDescription>
              Preview with sample data
            </DialogDescription>
          </DialogHeader>
          
          <div className="whitespace-pre-wrap bg-muted p-4 rounded-md font-mono text-sm max-h-96 overflow-y-auto">
            {templatePreview}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsPreviewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Template Card Component
interface TemplateCardProps {
  template: AdminTemplate;
  onEdit: (template: AdminTemplate) => void;
  onDelete: (template: AdminTemplate) => void;
  onPreview: (template: AdminTemplate) => void;
  onDuplicate: (template: AdminTemplate) => void;
}

function TemplateCard({ template, onEdit, onDelete, onPreview, onDuplicate }: TemplateCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-base">{template.name}</CardTitle>
            <CardDescription className="text-sm line-clamp-2">
              {template.description}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            {template.isCustom && (
              <Badge variant="secondary" className="text-xs">Custom</Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {TEMPLATE_CATEGORIES[template.category]?.name || template.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1 mb-3">
          {template.variables.slice(0, 3).map((variable) => (
            <Badge key={variable} variant="outline" className="text-xs">
              {variable}
            </Badge>
          ))}
          {template.variables.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{template.variables.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onPreview(template)}>
            <Eye className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(template)}>
            <Edit className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDuplicate(template)}>
            <Copy className="w-3 h-3" />
          </Button>
          {template.isCustom && (
            <Button size="sm" variant="outline" onClick={() => onDelete(template)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
