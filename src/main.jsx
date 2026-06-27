import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BoardProvider } from "./context/BoardContext.jsx";
import { NotifProvider } from "./context/NotifContext.jsx";

function AppProvider({ children }) {
  return (
    <AuthProvider>
      <BoardProvider>
        <NotifProvider>
          {children}
        </NotifProvider>
      </BoardProvider>
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);