import { Button } from "@/components/ui/button";
import { PlusCircle, Mail, FileText, Users, Settings } from "lucide-react";

const actions = [
  {
    title: "Add New Letter Template",
    description: "Create a new advocacy letter template",
    icon: PlusCircle,
    action: () => console.log("Add template"),
  },
  {
    title: "Send Newsletter",
    description: "Send update to all subscribers",
    icon: Mail,
    action: () => console.log("Send newsletter"),
  },
  {
    title: "Export User Data",
    description: "Download user analytics report",
    icon: FileText,
    action: () => console.log("Export data"),
  },
  {
    title: "Manage Subscriptions",
    description: "View and update user subscriptions",
    icon: Users,
    action: () => console.log("Manage subs"),
  },
];

export function QuickActions() {
  return (
    <div className="grid gap-4">
      {actions.map((action, index) => (
        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <action.icon className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{action.title}</p>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={action.action}>
            Action
          </Button>
        </div>
      ))}
    </div>
  );
}