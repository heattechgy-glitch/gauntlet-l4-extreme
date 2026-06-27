import { createContext, useContext, useState, useCallback } from "react";

const NotifContext = createContext(null);

export const useNotif = () => {
  const context = useContext(NotifContext);
  if (!context) {
    throw new Error("useNotif must be used within NotifProvider");
  }
  return context;
};

export const NotifProvider = ({ children }) => {
  const [notifs, setNotifs] = useState([]);

  const push = useCallback((msg, type = "info") => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const notif = { id, msg, type };
    
    setNotifs((prev) => [...prev, notif]);

    setTimeout(() => {
      dismiss(id);
    }, 4000);

    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value = {
    notifs,
    push,
    dismiss,
  };

  return (
    <NotifContext.Provider value={value}>
      {children}
      <NotifContainer notifs={notifs} dismiss={dismiss} />
    </NotifContext.Provider>
  );
};

const NotifContainer = ({ notifs, dismiss }) => {
  if (notifs.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {notifs.map((notif) => (
        <NotifItem key={notif.id} notif={notif} dismiss={dismiss} />
      ))}
    </div>
  );
};

const NotifItem = ({ notif, dismiss }) => {
  const typeStyles = {
    info: "bg-sky-500/90 border-sky-400",
    success: "bg-green-500/90 border-green-400",
    error: "bg-red-500/90 border-red-400",
    warning: "bg-yellow-500/90 border-yellow-400",
  };

  const style = typeStyles[notif.type] || typeStyles.info;

  return (
    <div
      className={`${style} border text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between gap-3 animate-in slide-in-from-right duration-300`}
    >
      <span className="text-sm font-medium">{notif.msg}</span>
      <button
        onClick={() => dismiss(notif.id)}
        className="text-white/80 hover:text-white transition-colors flex-shrink-0"
        aria-label="Dismiss notification"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default NotifProvider;