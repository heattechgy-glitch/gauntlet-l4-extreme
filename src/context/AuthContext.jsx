import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const MOCK_USERS = [
  {
    id: "user_alice_001",
    name: "Alice",
    email: "alice@example.com",
    avatar: "A",
    color: "#0ea5e9"
  },
  {
    id: "user_bob_002",
    name: "Bob",
    email: "bob@example.com",
    avatar: "B",
    color: "#8b5cf6"
  },
  {
    id: "user_carol_003",
    name: "Carol",
    email: "carol@example.com",
    avatar: "C",
    color: "#ec4899"
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("gauntlet_auth_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("gauntlet_auth_user");
      }
    }
    setLoading(false);
  }, []);

  const login = (userId) => {
    const selectedUser = MOCK_USERS.find(u => u.id === userId);
    if (selectedUser) {
      setUser(selectedUser);
      localStorage.setItem("gauntlet_auth_user", JSON.stringify(selectedUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("gauntlet_auth_user");
  };

  const value = {
    user,
    users: MOCK_USERS,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;