"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Palette, Type, Monitor, Eye } from "lucide-react";

const colorSchemes = [
  { name: "Default", primary: "#3b82f6", secondary: "#64748b" },
  { name: "Green", primary: "#10b981", secondary: "#6b7280" },
  { name: "Purple", primary: "#8b5cf6", secondary: "#6b7280" },
  { name: "Orange", primary: "#f59e0b", secondary: "#6b7280" },
];

const fonts = [
  { name: "Inter", value: "Inter, sans-serif" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Open Sans", value: "Open Sans, sans-serif" },
  { name: "Lato", value: "Lato, sans-serif" },
];

export function AppearanceSettings() {
  const [selectedScheme, setSelectedScheme] = useState(colorSchemes[0]);
  const [selectedFont, setSelectedFont] = useState(fonts[0]);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Tabs defaultValue="colors" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="colors">Colors</TabsTrigger>
        <TabsTrigger value="typography">Typography</TabsTrigger>
        <TabsTrigger value="layout">Layout</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>

      <TabsContent value="colors" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Scheme
            </CardTitle>
            <CardDescription>
              Choose the primary color scheme for your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {colorSchemes.map((scheme) => (
                <div
                  key={scheme.name}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedScheme.name === scheme.name
                      ? "ring-2 ring-blue-500 border-blue-500"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedScheme(scheme)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{scheme.name}</h3>
                    <div className="flex gap-2">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: scheme.primary }}
                      />
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: scheme.secondary }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Primary: {scheme.primary}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable dark theme for the application
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="typography" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Typography
            </CardTitle>
            <CardDescription>
              Customize fonts and text styling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="font-family">Font Family</Label>
              <Select
                value={selectedFont.value}
                onValueChange={(value) => {
                  const font = fonts.find(f => f.value === value);
                  if (font) setSelectedFont(font);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fonts.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>{font.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="heading-size">Heading Size</Label>
                <Select defaultValue="large">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="body-size">Body Text Size</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="line-height">Line Height</Label>
                <Select defaultValue="normal">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tight">Tight</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="relaxed">Relaxed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="layout" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Layout Settings
            </CardTitle>
            <CardDescription>
              Configure layout and spacing options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="container-width">Container Width</Label>
                <Select defaultValue="default">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="narrow">Narrow (1024px)</SelectItem>
                    <SelectItem value="default">Default (1280px)</SelectItem>
                    <SelectItem value="wide">Wide (1536px)</SelectItem>
                    <SelectItem value="full">Full Width</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="spacing">Content Spacing</Label>
                <Select defaultValue="normal">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="relaxed">Relaxed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Rounded Corners</Label>
                  <p className="text-sm text-muted-foreground">
                    Use rounded corners for UI elements
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Drop Shadows</Label>
                  <p className="text-sm text-muted-foreground">
                    Add subtle shadows to cards and components
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="preview" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Live Preview
            </CardTitle>
            <CardDescription>
              See how your changes will look
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="p-6 border rounded-lg"
              style={{
                fontFamily: selectedFont.value,
                backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                color: darkMode ? "#f9fafb" : "#111827",
              }}
            >
              <h1
                className="text-2xl font-bold mb-4"
                style={{ color: selectedScheme.primary }}
              >
                Preview Heading
              </h1>
              <p className="mb-4">
                This is how your body text will appear with the selected font and color scheme.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <Button
                className="mr-2"
                style={{ backgroundColor: selectedScheme.primary }}
              >
                Primary Button
              </Button>
              <Button variant="outline">Secondary Button</Button>
            </div>

            <div className="mt-6 flex gap-2">
              <Button>Apply Changes</Button>
              <Button variant="outline">Reset to Default</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}