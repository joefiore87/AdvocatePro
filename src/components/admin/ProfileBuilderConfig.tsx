// Profile builder configuration interface
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AdminProfileStep, AdminProfileField } from '@/lib/admin-types';
import { Plus, Edit, Trash2, GripVertical, Settings, Eye } from 'lucide-react';

interface ProfileBuilderConfigProps {
  onClose?: () => void;
}

export function ProfileBuilderConfig({ onClose }: ProfileBuilderConfigProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [config, setConfig] = useState<{
    steps: AdminProfileStep[];
    settings: any;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<AdminProfileField | null>(null);
  const [editingStep, setEditingStep] = useState<AdminProfileStep | null>(null);
  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false);
  const [isStepDialogOpen, setIsStepDialogOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Form state for field editor
  const [fieldForm, setFieldForm] = useState({
    label: '',
    type: 'text' as AdminProfileField['type'],
    options: [] as string[],
    required: false,
    helpText: '',
    validation: ''
  });

  // Form state for step editor
  const [stepForm, setStepForm] = useState({
    title: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    if (!user) return;
    
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/admin/profile-builder', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      } else {
        throw new Error('Failed to load configuration');
      }
    } catch (error) {
      console.error('Error loading config:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile builder configuration',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!user || !config) return;
    
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/admin/profile-builder', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Profile builder configuration updated successfully'
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save configuration',
        variant: 'destructive'
      });
    }
  };

  const handleStepToggle = (stepNumber: number, isActive: boolean) => {
    if (!config) return;
    
    // Check if this is a required step
    const requiredSteps = config.settings?.requiredSteps || [1, 2];
    if (requiredSteps.includes(stepNumber) && !isActive) {
      toast({
        title: 'Cannot disable required step',
        description: `Step ${stepNumber} is required and cannot be disabled`,
        variant: 'destructive'
      });
      return;
    }
    
    setConfig({
      ...config,
      steps: config.steps.map(step =>
        step.step === stepNumber ? { ...step, isActive } : step
      )
    });
  };

  const handleFieldToggle = (stepNumber: number, fieldId: string, isActive: boolean) => {
    if (!config) return;
    
    setConfig({
      ...config,
      steps: config.steps.map(step =>
        step.step === stepNumber
          ? {
              ...step,
              fields: step.fields.map(field =>
                field.id === fieldId ? { ...field, isActive } : field
              )
            }
          : step
      )
    });
  };

  const handleEditField = (step: AdminProfileStep, field: AdminProfileField) => {
    setEditingField(field);
    setFieldForm({
      label: field.label,
      type: field.type,
      options: field.options || [],
      required: field.required,
      helpText: field.helpText || '',
      validation: field.validation || ''
    });
    setIsFieldDialogOpen(true);
  };

  const handleSaveField = () => {
    if (!config || !editingField) return;
    
    const updatedField = {
      ...editingField,
      ...fieldForm,
      options: fieldForm.type === 'select' || fieldForm.type === 'multiselect' ? fieldForm.options : undefined
    };
    
    setConfig({
      ...config,
      steps: config.steps.map(step =>
        step.step === editingField.step
          ? {
              ...step,
              fields: step.fields.map(field =>
                field.id === editingField.id ? updatedField : field
              )
            }
          : step
      )
    });
    
    setIsFieldDialogOpen(false);
    setEditingField(null);
  };

  const handleEditStep = (step: AdminProfileStep) => {
    setEditingStep(step);
    setStepForm({
      title: step.title,
      description: step.description || '',
      isActive: step.isActive
    });
    setIsStepDialogOpen(true);
  };

  const handleSaveStep = () => {
    if (!config || !editingStep) return;
    
    setConfig({
      ...config,
      steps: config.steps.map(step =>
        step.step === editingStep.step
          ? { ...step, ...stepForm }
          : step
      )
    });
    
    setIsStepDialogOpen(false);
    setEditingStep(null);
  };

  const handleAddCustomField = (stepNumber: number) => {
    if (!config) return;
    
    const newField: AdminProfileField = {
      id: `custom_${Date.now()}`,
      step: stepNumber,
      label: 'New Custom Field',
      type: 'text',
      required: false,
      order: Math.max(...config.steps.find(s => s.step === stepNumber)?.fields.map(f => f.order) || [0]) + 1,
      isActive: true,
      isCustom: true
    };
    
    setConfig({
      ...config,
      steps: config.steps.map(step =>
        step.step === stepNumber
          ? { ...step, fields: [...step.fields, newField] }
          : step
      )
    });
  };

  const handleDeleteField = (stepNumber: number, fieldId: string) => {
    if (!config) return;
    
    const field = config.steps
      .find(s => s.step === stepNumber)
      ?.fields.find(f => f.id === fieldId);
    
    if (!field?.isCustom) {
      toast({
        title: 'Cannot delete original field',
        description: 'Original profile fields cannot be deleted, only disabled',
        variant: 'destructive'
      });
      return;
    }
    
    if (!confirm('Are you sure you want to delete this custom field?')) {
      return;
    }
    
    setConfig({
      ...config,
      steps: config.steps.map(step =>
        step.step === stepNumber
          ? { ...step, fields: step.fields.filter(f => f.id !== fieldId) }
          : step
      )
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading configuration...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="text-center p-8">
        <p>Failed to load configuration</p>
        <Button onClick={loadConfig} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Profile Builder Configuration</h2>
          <p className="text-muted-foreground">Customize the student profile form steps and fields</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Edit Mode' : 'Preview Mode'}
          </Button>
          <Button onClick={saveConfig}>
            Save Changes
          </Button>
        </div>
      </div>

      {previewMode ? (
        // Preview Mode
        <div className="border rounded-lg p-6 bg-muted/10">
          <h3 className="text-lg font-semibold mb-4">Profile Builder Preview</h3>
          <div className="space-y-6">
            {config.steps.filter(step => step.isActive).map((step, index) => (
              <Card key={step.step}>
                <CardHeader>
                  <CardTitle>Step {step.step}: {step.title}</CardTitle>
                  {step.description && (
                    <CardDescription>{step.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {step.fields.filter(field => field.isActive).map((field) => (
                      <div key={field.id} className="space-y-2">
                        <Label>
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {field.type === 'text' && <Input placeholder="Text input" disabled />}
                        {field.type === 'textarea' && <Textarea placeholder="Textarea input" disabled />}
                        {field.type === 'select' && (
                          <Select disabled>
                            <SelectTrigger>
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                          </Select>
                        )}
                        {field.helpText && (
                          <p className="text-sm text-muted-foreground">{field.helpText}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        // Edit Mode
        <div className="space-y-6">
          {config.steps.map((step) => (
            <Card key={step.step}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle>Step {step.step}: {step.title}</CardTitle>
                      <Switch
                        checked={step.isActive}
                        onCheckedChange={(checked) => handleStepToggle(step.step, checked)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditStep(step)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    {step.description && (
                      <CardDescription className="mt-2">{step.description}</CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Fields ({step.fields.length})</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddCustomField(step.step)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Custom Field
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                    {step.fields.map((field) => (
                      <div
                        key={field.id}
                        className={`border rounded-lg p-4 ${field.isActive ? 'bg-background' : 'bg-muted/50'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-medium">{field.label}</span>
                              {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                              {field.isCustom && <Badge variant="secondary" className="text-xs">Custom</Badge>}
                              <Badge variant="outline" className="text-xs">{field.type}</Badge>
                            </div>
                            {field.helpText && (
                              <p className="text-sm text-muted-foreground">{field.helpText}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={field.isActive}
                              onCheckedChange={(checked) => handleFieldToggle(step.step, field.id, checked)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditField(step, field)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {field.isCustom && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteField(step.step, field.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Field Edit Dialog */}
      <Dialog open={isFieldDialogOpen} onOpenChange={setIsFieldDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
            <DialogDescription>
              Customize the field properties and validation
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="field-label">Field Label</Label>
              <Input
                id="field-label"
                value={fieldForm.label}
                onChange={(e) => setFieldForm({ ...fieldForm, label: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="field-type">Field Type</Label>
              <Select
                value={fieldForm.type}
                onValueChange={(value: AdminProfileField['type']) => 
                  setFieldForm({ ...fieldForm, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="textarea">Textarea</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="multiselect">Multi-select</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(fieldForm.type === 'select' || fieldForm.type === 'multiselect') && (
              <div>
                <Label htmlFor="field-options">Options (one per line)</Label>
                <Textarea
                  id="field-options"
                  value={fieldForm.options.join('\n')}
                  onChange={(e) => setFieldForm({ 
                    ...fieldForm, 
                    options: e.target.value.split('\n').filter(opt => opt.trim()) 
                  })}
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                />
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Switch
                id="field-required"
                checked={fieldForm.required}
                onCheckedChange={(checked) => setFieldForm({ ...fieldForm, required: checked })}
              />
              <Label htmlFor="field-required">Required field</Label>
            </div>
            
            <div>
              <Label htmlFor="field-help">Help Text</Label>
              <Input
                id="field-help"
                value={fieldForm.helpText}
                onChange={(e) => setFieldForm({ ...fieldForm, helpText: e.target.value })}
                placeholder="Optional help text to display below the field"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFieldDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveField}>
              Save Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Step Edit Dialog */}
      <Dialog open={isStepDialogOpen} onOpenChange={setIsStepDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Step</DialogTitle>
            <DialogDescription>
              Customize the step title and description
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="step-title">Step Title</Label>
              <Input
                id="step-title"
                value={stepForm.title}
                onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="step-description">Step Description</Label>
              <Textarea
                id="step-description"
                value={stepForm.description}
                onChange={(e) => setStepForm({ ...stepForm, description: e.target.value })}
                placeholder="Optional description to help users understand this step"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="step-active"
                checked={stepForm.isActive}
                onCheckedChange={(checked) => setStepForm({ ...stepForm, isActive: checked })}
              />
              <Label htmlFor="step-active">Step is active</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStepDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStep}>
              Save Step
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
