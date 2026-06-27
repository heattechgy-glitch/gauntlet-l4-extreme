import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { Bell, LogOut, LayoutDashboard, Users, Activity } from "lucide-react";
import NotifToast from "@/components/NotifToast";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [notifCount, setNotifCount] = useState(0);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchNotifCount = async () => {
      try {
        const { count, error } = await supabase
          .from("notifications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("read", false);

        if (!error && count !== null) {
          setNotifCount(count);
        }
      } catch (err) {
        console.error("Failed to fetch notification count:", err);
      }
    };

    fetchNotifCount();

    const channel = supabase
      .channel("notif_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchNotifCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const navLinks = [
    { path: "/", icon: LayoutDashboard, label: "Board" },
    { path: "/members", icon: Users, label: "Members" },
    { path: "/activity", icon: Activity, label: "Activity" },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-sky-500">Kanban Pro</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-300" />
              {notifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {notifCount > 9 ? "9+" : notifCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="text-sm text-gray-300 hidden sm:block">
              {user?.email}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-red-400"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4 hidden md:block overflow-y-auto">
          <nav className="space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? "bg-sky-500/10 text-sky-500 font-medium"
                      : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      <NotifToast />
    </div>
  );
}