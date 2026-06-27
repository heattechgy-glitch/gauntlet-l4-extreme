import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { User } from "lucide-react";

export default function LoginSelect() {
  const navigate = useNavigate();

  const users = [
    { id: "alice", name: "Alice", avatar: "A", color: "bg-pink-500" },
    { id: "bob", name: "Bob", avatar: "B", color: "bg-blue-500" },
    { id: "carol", name: "Carol", avatar: "C", color: "bg-purple-500" },
  ];

  const handleLogin = async (user) => {
    // Mock login - set user in session storage
    sessionStorage.setItem("current_user", JSON.stringify(user));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-white text-center mb-12">
          Who are you?
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleLogin(user)}
              className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-sky-500 rounded-lg p-8 transition-all duration-200 flex flex-col items-center gap-4 group"
            >
              <div
                className={`w-24 h-24 rounded-full ${user.color} flex items-center justify-center text-white text-3xl font-bold group-hover:scale-110 transition-transform duration-200`}
              >
                {user.avatar}
              </div>
              <span className="text-xl font-semibold text-white">
                {user.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}