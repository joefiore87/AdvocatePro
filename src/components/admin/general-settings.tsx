"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings, Mail, Bell, Shield, Database, Globe } from "lucide-react";

export function GeneralSettings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: true,
    security: true,
  });

  return (
    <Tabs defaultValue="general" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="integrations">Integrations</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Application Settings
            </CardTitle>
            <CardDescription>
              Configure basic application settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="app-name">Application Name</Label>
                <Input
                  id="app-name"
                  defaultValue="Special Education Advocacy Toolkit"
                />
              </div>
              <div>
                <Label htmlFor="app-url">Application URL</Label>
                <Input
                  id="app-url"
                  defaultValue="https://advocacytoolkit.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="app-description">Description</Label>
              <Textarea
                id="app-description"
                defaultValue="A toolkit to empower parents in special education advocacy."
                className="min-h-[100px]"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  defaultValue="support@advocacytoolkit.com"
                />
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="America/New_York">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Put the application in maintenance mode
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>User Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to register
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Debug Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable detailed error logging
                  </p>
                </div>
                <Switch />
              </div>
            </div>

            <Button>Save General Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO & Meta</CardTitle>
            <CardDescription>
              Configure SEO settings and meta information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="meta-title">Meta Title</Label>
              <Input
                id="meta-title"
                defaultValue="Special Education Advocacy Toolkit - Empower Your Voice"
              />
            </div>

            <div>
              <Label htmlFor="meta-description">Meta Description</Label>
              <Textarea
                id="meta-description"
                defaultValue="Create professional advocacy letters for your special needs child. Get the tools to help schools understand your child's needs."
              />
            </div>

            <div>
              <Label htmlFor="meta-keywords">Keywords</Label>
              <Input
                id="meta-keywords"
                defaultValue="special education, advocacy, IEP, 504 plan, parent rights"
              />
            </div>

            <Button>Update SEO Settings</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Configure how and when to send notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications via email
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, email: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send browser push notifications
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, push: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Send newsletters and promotional content
                  </p>
                </div>
                <Switch
                  checked={notifications.marketing}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, marketing: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Security Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Send security and account alerts
                  </p>
                </div>
                <Switch
                  checked={notifications.security}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, security: checked }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="email-from">From Email Address</Label>
                <Input
                  id="email-from"
                  type="email"
                  defaultValue="noreply@advocacytoolkit.com"
                />
              </div>
              <div>
                <Label htmlFor="email-from-name">From Name</Label>
                <Input
                  id="email-from-name"
                  defaultValue="Advocacy Toolkit"
                />
              </div>
            </div>

            <Button>Save Notification Settings</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Configure security policies and authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Password Requirements</Label>
                  <p className="text-sm text-muted-foreground">
                    Enforce strong password policies
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">
                    Auto-logout inactive users
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="session-duration">Session Duration (minutes)</Label>
                <Input
                  id="session-duration"
                  type="number"
                  defaultValue="60"
                />
              </div>
              <div>
                <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                <Input
                  id="max-login-attempts"
                  type="number"
                  defaultValue="5"
                />
              </div>
            </div>

            <Button>Update Security Settings</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="integrations" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Third-Party Integrations
            </CardTitle>
            <CardDescription>
              Manage external service integrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded">
                <div className="flex items-center gap-3">
                  <Database className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Firebase</div>
                    <div className="text-sm text-muted-foreground">Authentication & Database</div>
                  </div>
                </div>
                <Badge variant="default">Connected</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-purple-100 rounded flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">S</span>
                  </div>
                  <div>
                    <div className="font-medium">Stripe</div>
                    <div className="text-sm text-muted-foreground">Payment Processing</div>
                  </div>
                </div>
                <Badge variant="default">Connected</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded">
                <div className="flex items-center gap-3">
                  <Mail className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <div className="font-medium">SendGrid</div>
                    <div className="text-sm text-muted-foreground">Email Service</div>
                  </div>
                </div>
                <Badge variant="secondary">Not Connected</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">API Keys</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="google-analytics">Google Analytics ID</Label>
                  <Input
                    id="google-analytics"
                    placeholder="GA-XXXXXXXXX-X"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook-pixel">Facebook Pixel ID</Label>
                  <Input
                    id="facebook-pixel"
                    placeholder="123456789012345"
                  />
                </div>
              </div>
            </div>

            <Button>Save Integration Settings</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}