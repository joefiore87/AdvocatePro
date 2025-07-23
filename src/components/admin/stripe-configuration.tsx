"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Package, 
  DollarSign, 
  Settings, 
  Eye,
  Edit,
  Trash2,
  Plus
} from "lucide-react";

const products = [
  {
    id: "prod_advocacy_toolkit",
    name: "Advocacy Toolkit Annual",
    description: "Full access to letter templates and training modules",
    prices: [
      { id: "price_annual", amount: 2999, interval: "year", currency: "usd" },
      { id: "price_monthly", amount: 499, interval: "month", currency: "usd" },
    ],
    active: true,
  },
  {
    id: "prod_premium_support",
    name: "Premium Support Add-on",
    description: "One-on-one consultation sessions",
    prices: [
      { id: "price_support", amount: 9999, interval: "one_time", currency: "usd" },
    ],
    active: false,
  },
];

const webhookEvents = [
  "payment_intent.succeeded",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
];

export function StripeConfiguration() {
  const [testMode, setTestMode] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState("");

  return (
    <Tabs defaultValue="products" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="pricing">Pricing</TabsTrigger>
        <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="products" className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Products</h3>
            <p className="text-sm text-muted-foreground">
              Manage your Stripe products and their details
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      {product.name}
                      <Badge variant={product.active ? "default" : "secondary"}>
                        {product.active ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Pricing Options:</Label>
                  {product.prices.map((price) => (
                    <div key={price.id} className="flex items-center justify-between p-2 border rounded">
                      <span>
                        ${(price.amount / 100).toFixed(2)} {price.currency.toUpperCase()}
                        {price.interval !== "one_time" && ` / ${price.interval}`}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="pricing" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing Configuration
            </CardTitle>
            <CardDescription>
              Configure pricing options and payment settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="annual-price">Annual Price</Label>
                <Input
                  id="annual-price"
                  type="number"
                  defaultValue="29.99"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="monthly-price">Monthly Price</Label>
                <Input
                  id="monthly-price"
                  type="number"
                  defaultValue="4.99"
                  step="0.01"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Free Trial</Label>
                  <p className="text-sm text-muted-foreground">
                    Offer a 30-day free trial
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Proration</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable proration for plan changes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Tax Collection</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically collect taxes based on location
                  </p>
                </div>
                <Switch />
              </div>
            </div>

            <Button>Update Pricing</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="webhooks" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Webhook Configuration</CardTitle>
            <CardDescription>
              Configure webhook endpoints for Stripe events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="webhook-url">Webhook Endpoint URL</Label>
              <Input
                id="webhook-url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://yourdomain.com/api/stripe/webhook"
              />
            </div>

            <div>
              <Label>Events to Listen For</Label>
              <div className="grid gap-2 mt-2">
                {webhookEvents.map((event) => (
                  <div key={event} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={event}
                      defaultChecked
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={event} className="text-sm font-mono">
                      {event}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button>Update Webhook</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Stripe Settings
            </CardTitle>
            <CardDescription>
              Configure your Stripe integration settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="publishable-key">Publishable Key</Label>
                <Input
                  id="publishable-key"
                  type="password"
                  placeholder="pk_test_..."
                />
              </div>
              <div>
                <Label htmlFor="secret-key">Secret Key</Label>
                <Input
                  id="secret-key"
                  type="password"
                  placeholder="sk_test_..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Test Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use Stripe test environment
                  </p>
                </div>
                <Switch
                  checked={testMode}
                  onCheckedChange={setTestMode}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Automatic Payment Methods</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable additional payment methods automatically
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Customer Portal</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to manage their subscriptions
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="pt-4">
              <Button>Save Configuration</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Status</CardTitle>
            <CardDescription>
              Current status of your Stripe integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Connection Status</span>
                <Badge variant="default">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Environment</span>
                <Badge variant={testMode ? "secondary" : "default"}>
                  {testMode ? "Test" : "Live"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Webhook Status</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Sync</span>
                <span className="text-sm text-muted-foreground">2 minutes ago</span>
              </div>
            </div>

            <div className="pt-4">
              <Button variant="outline">Test Connection</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}