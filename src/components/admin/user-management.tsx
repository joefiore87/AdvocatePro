"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Users, 
  MoreHorizontal, 
  Mail, 
  Ban, 
  CheckCircle,
  Search,
  Filter
} from "lucide-react";

const users = [
  {
    id: "1",
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    status: "active",
    subscription: "annual",
    joinDate: "2024-01-15",
    lastActive: "2024-01-20",
    lettersGenerated: 23,
  },
  {
    id: "2",
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    status: "active",
    subscription: "monthly",
    joinDate: "2024-01-10",
    lastActive: "2024-01-19",
    lettersGenerated: 15,
  },
  {
    id: "3",
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    status: "inactive",
    subscription: "trial",
    joinDate: "2024-01-05",
    lastActive: "2024-01-12",
    lettersGenerated: 3,
  },
  {
    id: "4",
    name: "William Kim",
    email: "william.kim@email.com",
    status: "active",
    subscription: "annual",
    joinDate: "2023-12-20",
    lastActive: "2024-01-20",
    lettersGenerated: 67,
  },
  {
    id: "5",
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    status: "suspended",
    subscription: "monthly",
    joinDate: "2024-01-08",
    lastActive: "2024-01-18",
    lettersGenerated: 8,
  },
];

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case "annual":
        return <Badge variant="default">Annual</Badge>;
      case "monthly":
        return <Badge variant="outline">Monthly</Badge>;
      case "trial":
        return <Badge variant="secondary">Trial</Badge>;
      default:
        return <Badge variant="outline">{subscription}</Badge>;
    }
  };

  return (
    <Tabs defaultValue="users" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="users">All Users</TabsTrigger>
        <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>
              View and manage all user accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                    All Users
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                    Inactive
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("suspended")}>
                    Suspended
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Letters Generated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{getSubscriptionBadge(user.subscription)}</TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>{user.lettersGenerated}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Activate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Ban className="mr-2 h-4 w-4" />
                            Suspend User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="subscriptions" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Overview</CardTitle>
            <CardDescription>
              Monitor subscription status and revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold">2,350</div>
                <div className="text-sm text-muted-foreground">Total Subscriptions</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold">1,890</div>
                <div className="text-sm text-muted-foreground">Active Subscriptions</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold">$45,231</div>
                <div className="text-sm text-muted-foreground">Monthly Revenue</div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Billing</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.filter(u => u.subscription !== "trial").map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{getSubscriptionBadge(user.subscription)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      {user.subscription === "annual" ? "2025-01-15" : "2024-02-15"}
                    </TableCell>
                    <TableCell>
                      ${user.subscription === "annual" ? "29.99" : "4.99"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="activity" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>
              Recent user actions and engagement metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold">127</div>
                <div className="text-sm text-muted-foreground">Letters Generated Today</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold">1,890</div>
                <div className="text-sm text-muted-foreground">Active Users This Week</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Recent Activity</h4>
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Generated {user.lettersGenerated} letters • Last active {user.lastActive}
                    </div>
                  </div>
                  <Badge variant="outline">{user.lettersGenerated} letters</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}