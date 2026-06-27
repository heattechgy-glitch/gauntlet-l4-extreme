import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import LoginSelect from "@/components/LoginSelect";
import Layout from "@/components/Layout";
import KanbanBoard from "@/components/KanbanBoard";

function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState("board");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || "/";
      if (hash === "/" || hash === "/board") {
        setCurrentView("board");
      } else if (hash === "/members") {
        setCurrentView("members");
      } else if (hash === "/activity") {
        setCurrentView("activity");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-sky-500 text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginSelect />;
  }

  return (
    <Layout currentView={currentView}>
      {currentView === "board" && <KanbanBoard />}
      {currentView === "members" && (
        <div className="p-8 text-white">
          <h1 className="text-2xl font-bold text-sky-500 mb-4">Team Members</h1>
          <p className="text-gray-400">Members view coming soon...</p>
        </div>
      )}
      {currentView === "activity" && (
        <div className="p-8 text-white">
          <h1 className="text-2xl font-bold text-sky-500 mb-4">Activity Feed</h1>
          <p className="text-gray-400">Activity view coming soon...</p>
        </div>
      )}
    </Layout>
  );
}

export default App;