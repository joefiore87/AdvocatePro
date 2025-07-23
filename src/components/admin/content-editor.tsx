"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Save, Edit, Eye, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: string;
  lastModified: string;
  category: string;
}

interface ContentEditorProps {
  contentType: 'pages' | 'templates' | 'modules' | 'notifications';
}

export function ContentEditor({ contentType }: ContentEditorProps) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Fetch content items
  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/content?category=${contentType}`);
      if (!response.ok) throw new Error('Failed to fetch content');
      
      const data = await response.json();
      setItems(data.content || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error",
        description: "Failed to load content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [contentType]);

  const handleEdit = (item: ContentItem) => {
    setSelectedItem(item);
    setEditedContent(item.content);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedItem) return;
    
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/content/${selectedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent,
          modifiedBy: 'admin' // You can get this from your auth context
        }),
      });

      if (!response.ok) throw new Error('Failed to save content');

      // Update the local state
      setItems(prev => prev.map(item => 
        item.id === selectedItem.id 
          ? { ...item, content: editedContent, lastModified: new Date().toISOString() }
          : item
      ));

      // Update selected item
      setSelectedItem(prev => prev ? { ...prev, content: editedContent } : null);
      setIsEditing(false);

      toast({
        title: "Success",
        description: "Content updated successfully!",
      });

      // Refresh content to get latest data
      await fetchContent();
      
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = () => {
    fetchContent();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading content...</span>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Content List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Content Items</CardTitle>
              <CardDescription>
                Select an item to edit its content
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No content items found for {contentType}
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedItem?.id === item.id 
                      ? "bg-blue-50 border-blue-200" 
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => handleEdit(item)}
                >
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      Last modified: {new Date(item.lastModified).toLocaleDateString()}
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      {item.type}
                    </Badge>
                  </div>
                  <Edit className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Editor */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedItem ? `Edit: ${selectedItem.title}` : "Select Content to Edit"}
          </CardTitle>
          <CardDescription>
            {selectedItem ? "Make changes to the content below" : "Choose an item from the list to start editing"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedItem ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[200px]"
                  placeholder="Enter your content here..."
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleSave} 
                  disabled={!isEditing || saving || editedContent === selectedItem.content}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>

              {!isEditing && (
                <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                  <h4 className="text-sm font-medium mb-2">Preview:</h4>
                  <div className="text-sm whitespace-pre-wrap">{editedContent}</div>
                </div>
              )}

              {/* Real-time character count */}
              <div className="text-xs text-muted-foreground">
                {editedContent.length} characters
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Select a content item from the left to begin editing
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}