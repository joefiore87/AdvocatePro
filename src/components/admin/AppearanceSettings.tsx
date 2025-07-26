// Appearance and theme settings for admin
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Palette, Upload, RotateCcw, Eye } from 'lucide-react';

interface AppearanceConfig {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    borderRadius: string;
    fontFamily: string;
    fontSize: string;
  };
  branding: {
    logoUrl?: string;
    siteName: string;
    tagline: string;
    favicon?: string;
  };
  layout: {
    headerStyle: 'default' | 'minimal' | 'prominent';
    footerEnabled: boolean;
    sidebarEnabled: boolean;
    maxWidth: string;
  };
  customCss?: string;
}

const DEFAULT_CONFIG: AppearanceConfig = {
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    accentColor: '#10b981',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    borderRadius: '0.5rem',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px'
  },
  branding: {
    siteName: 'AdvocatePro',
    tagline: 'Empowering Parent Advocates'
  },
  layout: {
    headerStyle: 'default',
    footerEnabled: true,
    sidebarEnabled: false,
    maxWidth: '1200px'
  }
};

export function AppearanceSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [config, setConfig] = useState<AppearanceConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    if (!user) return;
    
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/admin/appearance', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setConfig({ ...DEFAULT_CONFIG, ...data.config });
      }
    } catch (error) {
      console.error('Error loading appearance config:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/admin/appearance', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ config })
      });
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Appearance settings saved successfully'
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all appearance settings to defaults?')) {
      setConfig(DEFAULT_CONFIG);
    }
  };

  const updateTheme = (key: keyof AppearanceConfig['theme'], value: string) => {
    setConfig({
      ...config,
      theme: {
        ...config.theme,
        [key]: value
      }
    });
  };

  const updateBranding = (key: keyof AppearanceConfig['branding'], value: string) => {
    setConfig({
      ...config,
      branding: {
        ...config.branding,
        [key]: value
      }
    });
  };

  const updateLayout = (key: keyof AppearanceConfig['layout'], value: any) => {
    setConfig({
      ...config,
      layout: {
        ...config.layout,
        [key]: value
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading appearance settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Appearance Settings</h3>
          <p className="text-sm text-muted-foreground">Customize the look and feel of your application</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={saveConfig} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {previewMode ? (
        // Preview Mode
        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle>Theme Preview</CardTitle>
            <CardDescription>This is how your theme will look</CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="p-6 rounded-lg border"
              style={{
                backgroundColor: config.theme.backgroundColor,
                color: config.theme.textColor,
                fontFamily: config.theme.fontFamily,
                fontSize: config.theme.fontSize,
                borderRadius: config.theme.borderRadius
              }}
            >
              <h2 
                className="text-2xl font-bold mb-4"
                style={{ color: config.theme.primaryColor }}
              >
                {config.branding.siteName}
              </h2>
              <p className="mb-4" style={{ color: config.theme.secondaryColor }}>
                {config.branding.tagline}
              </p>
              <div className="flex gap-3">
                <div 
                  className="px-4 py-2 rounded text-white"
                  style={{ 
                    backgroundColor: config.theme.primaryColor,
                    borderRadius: config.theme.borderRadius
                  }}
                >
                  Primary Button
                </div>
                <div 
                  className="px-4 py-2 rounded border"
                  style={{ 
                    borderColor: config.theme.secondaryColor,
                    color: config.theme.secondaryColor,
                    borderRadius: config.theme.borderRadius
                  }}
                >
                  Secondary Button
                </div>
                <div 
                  className="px-4 py-2 rounded text-white"
                  style={{ 
                    backgroundColor: config.theme.accentColor,
                    borderRadius: config.theme.borderRadius
                  }}
                >
                  Accent Button
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Edit Mode
        <div className="grid gap-6">
          {/* Theme Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Theme Colors
              </CardTitle>
              <CardDescription>
                Customize the color scheme of your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="primary-color"
                      type="color"
                      value={config.theme.primaryColor}
                      onChange={(e) => updateTheme('primaryColor', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={config.theme.primaryColor}
                      onChange={(e) => updateTheme('primaryColor', e.target.value)}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={config.theme.secondaryColor}
                      onChange={(e) => updateTheme('secondaryColor', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={config.theme.secondaryColor}
                      onChange={(e) => updateTheme('secondaryColor', e.target.value)}
                      placeholder="#64748b"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="accent-color"
                      type="color"
                      value={config.theme.accentColor}
                      onChange={(e) => updateTheme('accentColor', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={config.theme.accentColor}
                      onChange={(e) => updateTheme('accentColor', e.target.value)}
                      placeholder="#10b981"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bg-color">Background Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="bg-color"
                      type="color"
                      value={config.theme.backgroundColor}
                      onChange={(e) => updateTheme('backgroundColor', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={config.theme.backgroundColor}
                      onChange={(e) => updateTheme('backgroundColor', e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="text-color">Text Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="text-color"
                      type="color"
                      value={config.theme.textColor}
                      onChange={(e) => updateTheme('textColor', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={config.theme.textColor}
                      onChange={(e) => updateTheme('textColor', e.target.value)}
                      placeholder="#1f2937"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>Configure fonts and text styling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="font-family">Font Family</Label>
                  <Select
                    value={config.theme.fontFamily}
                    onValueChange={(value) => updateTheme('fontFamily', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                      <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
                      <SelectItem value="Open Sans, sans-serif">Open Sans</SelectItem>
                      <SelectItem value="Lato, sans-serif">Lato</SelectItem>
                      <SelectItem value="Poppins, sans-serif">Poppins</SelectItem>
                      <SelectItem value="Montserrat, sans-serif">Montserrat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="font-size">Base Font Size</Label>
                  <Select
                    value={config.theme.fontSize}
                    onValueChange={(value) => updateTheme('fontSize', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12px">Small (12px)</SelectItem>
                      <SelectItem value="14px">Medium (14px)</SelectItem>
                      <SelectItem value="16px">Large (16px)</SelectItem>
                      <SelectItem value="18px">Extra Large (18px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="border-radius">Border Radius</Label>
                  <Select
                    value={config.theme.borderRadius}
                    onValueChange={(value) => updateTheme('borderRadius', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">None (0)</SelectItem>
                      <SelectItem value="0.25rem">Small (4px)</SelectItem>
                      <SelectItem value="0.5rem">Medium (8px)</SelectItem>
                      <SelectItem value="0.75rem">Large (12px)</SelectItem>
                      <SelectItem value="1rem">Extra Large (16px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Branding */}
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Configure your brand identity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input
                    id="site-name"
                    value={config.branding.siteName}
                    onChange={(e) => updateBranding('siteName', e.target.value)}
                    placeholder="AdvocatePro"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={config.branding.tagline}
                    onChange={(e) => updateBranding('tagline', e.target.value)}
                    placeholder="Empowering Parent Advocates"
                  />
                </div>
                
                <div>
                  <Label htmlFor="logo-url">Logo URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="logo-url"
                      value={config.branding.logoUrl || ''}
                      onChange={(e) => updateBranding('logoUrl', e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                    <Button variant="outline" disabled>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Layout */}
          <Card>
            <CardHeader>
              <CardTitle>Layout Settings</CardTitle>
              <CardDescription>Configure the overall layout structure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="header-style">Header Style</Label>
                  <Select
                    value={config.layout.headerStyle}
                    onValueChange={(value: 'default' | 'minimal' | 'prominent') => 
                      updateLayout('headerStyle', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="prominent">Prominent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="max-width">Max Width</Label>
                  <Select
                    value={config.layout.maxWidth}
                    onValueChange={(value) => updateLayout('maxWidth', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1024px">Small (1024px)</SelectItem>
                      <SelectItem value="1200px">Medium (1200px)</SelectItem>
                      <SelectItem value="1400px">Large (1400px)</SelectItem>
                      <SelectItem value="100%">Full Width</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Footer Enabled</Label>
                    <p className="text-sm text-muted-foreground">Show footer on all pages</p>
                  </div>
                  <Switch
                    checked={config.layout.footerEnabled}
                    onCheckedChange={(checked) => updateLayout('footerEnabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Sidebar Enabled</Label>
                    <p className="text-sm text-muted-foreground">Show sidebar navigation</p>
                  </div>
                  <Switch
                    checked={config.layout.sidebarEnabled}
                    onCheckedChange={(checked) => updateLayout('sidebarEnabled', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom CSS */}
          <Card>
            <CardHeader>
              <CardTitle>Custom CSS</CardTitle>
              <CardDescription>
                Add custom CSS to further customize your application's appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={config.customCss || ''}
                onChange={(e) => setConfig({ ...config, customCss: e.target.value })}
                placeholder="/* Add your custom CSS here */&#10;.custom-class {&#10;  /* Your styles */&#10;}"
                rows={10}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
