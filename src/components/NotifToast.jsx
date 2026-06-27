import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

const TOAST_DURATION = 5000;

let toastIdCounter = 0;
let addToastCallback = null;

export const toast = {
  success: (message) => addToastCallback?.({ type: "success", message }),
  error: (message) => addToastCallback?.({ type: "error", message }),
  info: (message) => addToastCallback?.({ type: "info", message }),
  warning: (message) => addToastCallback?.({ type: "warning", message }),
};

const ToastItem = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, TOAST_DURATION);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 300);
  };

  const typeConfig = {
    success: {
      icon: CheckCircle2,
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      iconColor: "text-green-400",
    },
    error: {
      icon: AlertCircle,
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      iconColor: "text-red-400",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      iconColor: "text-yellow-400",
    },
    info: {
      icon: Info,
      bgColor: "bg-sky-500/10",
      borderColor: "border-sky-500/30",
      iconColor: "text-sky-400",
    },
  };

  const config = typeConfig[toast.type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div
      className={`flex items-start gap-3 ${config.bgColor} ${config.borderColor} border backdrop-blur-sm rounded-lg p-4 shadow-xl transition-all duration-300 min-w-[320px] max-w-[420px] ${
        isExiting
          ? "translate-x-[120%] opacity-0"
          : "translate-x-0 opacity-100"
      }`}
      style={{
        transform: isExiting ? "translateX(120%)" : "translateX(0)",
      }}
    >
      <Icon className={`${config.iconColor} w-5 h-5 flex-shrink-0 mt-0.5`} />
      <p className="text-sm text-gray-200 flex-1 leading-relaxed">
        {toast.message}
      </p>
      <button
        onClick={handleDismiss}
        className="text-gray-400 hover:text-gray-200 transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function NotifToast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    addToastCallback = (toastData) => {
      const id = ++toastIdCounter;
      setToasts((prev) => [...prev, { ...toastData, id }]);
    };

    return () => {
      addToastCallback = null;
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onDismiss={removeToast} />
        </div>
      ))}
    </div>
  );
}