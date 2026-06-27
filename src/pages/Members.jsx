import { useState, useEffect } from "react";
import { Users, UserPlus, Circle } from "lucide-react";
import { useBoardContext } from "@/context/BoardContext";

export default function Members() {
  const { cards } = useBoardContext();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const mockMembers = [
      {
        id: 1,
        name: "Galen Heat",
        email: "galen@heattechgy.com",
        role: "Owner",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Galen",
        online: Math.random() > 0.3,
      },
      {
        id: 2,
        name: "Sarah Mitchell",
        email: "sarah@heattechgy.com",
        role: "Editor",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        online: Math.random() > 0.3,
      },
      {
        id: 3,
        name: "Marcus Chen",
        email: "marcus@heattechgy.com",
        role: "Viewer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
        online: Math.random() > 0.3,
      },
    ];

    const membersWithCards = mockMembers.map((member) => ({
      ...member,
      cardCount: cards.filter((card) => card.assignee === member.name).length,
    }));

    setMembers(membersWithCards);
  }, [cards]);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Owner":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Editor":
        return "bg-sky-500/20 text-sky-400 border-sky-500/30";
      case "Viewer":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/10 rounded-lg">
              <Users className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Team Members</h1>
              <p className="text-gray-400 text-sm mt-1">
                Manage your team and permissions
              </p>
            </div>
          </div>
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-500 rounded-lg border border-gray-700 cursor-not-allowed opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        </div>

        <div className="grid gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-700"
                    />
                    <div className="absolute -bottom-1 -right-1 flex items-center justify-center">
                      <Circle
                        className={`w-5 h-5 ${
                          member.online
                            ? "text-green-400 fill-green-400"
                            : "text-gray-600 fill-gray-600"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-400">{member.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-md border ${getRoleBadgeColor(
                          member.role
                        )}`}
                      >
                        {member.role}
                      </span>
                      <span className="text-xs text-gray-500">
                        {member.online ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-sky-400">
                    {member.cardCount}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {member.cardCount === 1 ? "card" : "cards"} assigned
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-900 border border-gray-800 rounded-lg">
          <p className="text-sm text-gray-400 text-center">
            Team member invitations are currently disabled. Contact your
            administrator to add new members.
          </p>
        </div>
      </div>
    </div>
  );
}