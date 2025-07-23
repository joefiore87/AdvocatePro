"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { TrendingUp, Users, FileText, DollarSign } from "lucide-react";

const usageData = [
  { month: "Jan", users: 400, letters: 1200, revenue: 4000 },
  { month: "Feb", users: 300, letters: 900, revenue: 3000 },
  { month: "Mar", users: 500, letters: 1500, revenue: 5000 },
  { month: "Apr", users: 450, letters: 1350, revenue: 4500 },
  { month: "May", users: 600, letters: 1800, revenue: 6000 },
  { month: "Jun", users: 550, letters: 1650, revenue: 5500 },
  { month: "Jul", users: 700, letters: 2100, revenue: 7000 },
];

const letterTypeData = [
  { name: "IEP Requests", value: 35, color: "#8884d8" },
  { name: "Evaluation Requests", value: 25, color: "#82ca9d" },
  { name: "Accommodation Requests", value: 20, color: "#ffc658" },
  { name: "Meeting Requests", value: 15, color: "#ff7300" },
  { name: "Other", value: 5, color: "#0088fe" },
];

const engagementData = [
  { day: "Mon", sessions: 245, pageViews: 1200 },
  { day: "Tue", sessions: 189, pageViews: 980 },
  { day: "Wed", sessions: 378, pageViews: 1890 },
  { day: "Thu", sessions: 289, pageViews: 1445 },
  { day: "Fri", sessions: 456, pageViews: 2280 },
  { day: "Sat", sessions: 234, pageViews: 1170 },
  { day: "Sun", sessions: 156, pageViews: 780 },
];

const conversionData = [
  { source: "Google", visitors: 1000, conversions: 125, rate: 12.5 },
  { source: "Facebook", visitors: 800, conversions: 72, rate: 9.0 },
  { source: "Direct", visitors: 600, conversions: 90, rate: 15.0 },
  { source: "Email", visitors: 400, conversions: 80, rate: 20.0 },
  { source: "Other", visitors: 300, conversions: 21, rate: 7.0 },
];

export function AnalyticsDashboard() {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="usage">Usage</TabsTrigger>
        <TabsTrigger value="engagement">Engagement</TabsTrigger>
        <TabsTrigger value="conversion">Conversion</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,350</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Letters Generated</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,234</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.5%</div>
              <p className="text-xs text-muted-foreground">
                +4.5% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Usage Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" />
                  <Line type="monotone" dataKey="letters" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Letter Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={letterTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {letterTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="usage" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Usage Statistics</CardTitle>
            <CardDescription>
              Track user activity and letter generation over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#8884d8" name="Active Users" />
                <Bar dataKey="letters" fill="#82ca9d" name="Letters Generated" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="engagement" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Engagement</CardTitle>
            <CardDescription>
              User sessions and page views by day of week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sessions" stroke="#8884d8" name="Sessions" />
                <Line type="monotone" dataKey="pageViews" stroke="#82ca9d" name="Page Views" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="conversion" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversion by Source</CardTitle>
            <CardDescription>
              Track how different traffic sources convert to subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionData.map((source) => (
                <div key={source.source} className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <div className="font-medium">{source.source}</div>
                    <div className="text-sm text-muted-foreground">
                      {source.conversions} conversions from {source.visitors} visitors
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{source.rate}%</div>
                    <div className="text-sm text-muted-foreground">conversion rate</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}