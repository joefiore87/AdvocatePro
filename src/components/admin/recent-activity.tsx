import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const activities = [
  {
    user: "olivia.martin@email.com",
    action: "Generated IEP meeting request",
    time: "2 minutes ago",
    avatar: "/avatars/01.png",
    initials: "OM",
  },
  {
    user: "jackson.lee@email.com",
    action: "Subscribed to annual plan",
    time: "5 minutes ago",
    avatar: "/avatars/02.png",
    initials: "JL",
  },
  {
    user: "isabella.nguyen@email.com",
    action: "Downloaded evaluation request letter",
    time: "10 minutes ago",
    avatar: "/avatars/03.png",
    initials: "IN",
  },
  {
    user: "william.kim@email.com",
    action: "Completed advocacy training module",
    time: "15 minutes ago",
    avatar: "/avatars/04.png",
    initials: "WK",
  },
  {
    user: "sofia.davis@email.com",
    action: "Generated accommodation request",
    time: "20 minutes ago",
    avatar: "/avatars/05.png",
    initials: "SD",
  },
];

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.avatar} alt={activity.user} />
            <AvatarFallback>{activity.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.user}
            </p>
            <p className="text-sm text-muted-foreground">
              {activity.action}
            </p>
            <p className="text-xs text-muted-foreground">
              {activity.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}