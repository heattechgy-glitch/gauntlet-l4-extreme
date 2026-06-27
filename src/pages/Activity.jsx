import { useState } from "react";
import { Activity as ActivityIcon, User, MessageSquare, ArrowRight, CheckCircle2, Plus } from "lucide-react";

export default function Activity() {
  const [selectedUser, setSelectedUser] = useState("all");

  const activities = [
    {
      id: 1,
      user: "Alice",
      action: "moved card",
      target: "Implement authentication",
      from: "In Progress",
      to: "Done",
      type: "move",
      timestamp: "2 minutes ago",
      avatar: "A",
      color: "bg-blue-500"
    },
    {
      id: 2,
      user: "Bob",
      action: "added card",
      target: "Fix navigation bug",
      type: "create",
      timestamp: "15 minutes ago",
      avatar: "B",
      color: "bg-green-500"
    },
    {
      id: 3,
      user: "Carol",
      action: "commented on",
      target: "Design system update",
      comment: "Looks great! Ready to merge.",
      type: "comment",
      timestamp: "32 minutes ago",
      avatar: "C",
      color: "bg-purple-500"
    },
    {
      id: 4,
      user: "Alice",
      action: "moved card",
      target: "Database migration",
      from: "To Do",
      to: "In Progress",
      type: "move",
      timestamp: "1 hour ago",
      avatar: "A",
      color: "bg-blue-500"
    },
    {
      id: 5,
      user: "David",
      action: "completed card",
      target: "Write documentation",
      type: "complete",
      timestamp: "2 hours ago",
      avatar: "D",
      color: "bg-amber-500"
    },
    {
      id: 6,
      user: "Bob",
      action: "commented on",
      target: "Fix navigation bug",
      comment: "Working on this now, should be done soon.",
      type: "comment",
      timestamp: "3 hours ago",
      avatar: "B",
      color: "bg-green-500"
    },
    {
      id: 7,
      user: "Carol",
      action: "added card",
      target: "Refactor API endpoints",
      type: "create",
      timestamp: "4 hours ago",
      avatar: "C",
      color: "bg-purple-500"
    },
    {
      id: 8,
      user: "David",
      action: "moved card",
      target: "Performance optimization",
      from: "In Progress",
      to: "Code Review",
      type: "move",
      timestamp: "5 hours ago",
      avatar: "D",
      color: "bg-amber-500"
    },
    {
      id: 9,
      user: "Alice",
      action: "commented on",
      target: "Implement authentication",
      comment: "Added JWT support and refresh tokens.",
      type: "comment",
      timestamp: "6 hours ago",
      avatar: "A",
      color: "bg-blue-500"
    },
    {
      id: 10,
      user: "Bob",
      action: "completed card",
      target: "Setup CI/CD pipeline",
      type: "complete",
      timestamp: "8 hours ago",
      avatar: "B",
      color: "bg-green-500"
    }
  ];

  const users = ["all", ...new Set(activities.map(a => a.user))];

  const filteredActivities = selectedUser === "all" 
    ? activities 
    : activities.filter(a => a.user === selectedUser);

  const getIcon = (type) => {
    switch (type) {
      case "move":
        return <ArrowRight className="w-4 h-4" />;
      case "create":
        return <Plus className="w-4 h-4" />;
      case "comment":
        return <MessageSquare className="w-4 h-4" />;
      case "complete":
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <ActivityIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ActivityIcon className="w-8 h-8 text-sky-500" />
            <h1 className="text-3xl font-bold">Activity Feed</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-400" />
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {users.map(user => (
                <option key={user} value={user}>
                  {user === "all" ? "All Users" : user}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div 
              key={activity.id} 
              className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className={`${activity.color} w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0`}>
                  {activity.avatar}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white">{activity.user}</span>
                    <span className="text-gray-400">{activity.action}</span>
                    <span className="text-sky-400 font-medium truncate">{activity.target}</span>
                    
                    {activity.from && activity.to && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">from</span>
                        <span className="bg-gray-800 px-2 py-1 rounded text-gray-300">{activity.from}</span>
                        <ArrowRight className="w-4 h-4 text-gray-500" />
                        <span className="bg-gray-800 px-2 py-1 rounded text-gray-300">{activity.to}</span>
                      </div>
                    )}
                  </div>
                  
                  {activity.comment && (
                    <div className="mt-2 text-gray-300 bg-gray-800/50 border border-gray-700 rounded p-3 text-sm">
                      "{activity.comment}"
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    {getIcon(activity.type)}
                    <span>{activity.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <ActivityIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No activity found for this user</p>
          </div>
        )}
      </div>
    </div>
  );
}