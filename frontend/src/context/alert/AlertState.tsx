import React, { useState, useCallback } from "react";
import AlertContext, { Alert, AlertContextType } from "./AlertContext";

const AlertState: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert: AlertContextType["showAlert"] = useCallback((
    msg: string, 
    type: Alert["type"], 
    duration = 5000,
    action?: Alert["action"]
  ) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newAlert: Alert = { id, msg, type, duration, action };
    
    setAlerts(prev => [...prev, newAlert]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeAlert(id);
      }, duration);
    }
  }, []);

  const showSuccess: AlertContextType["showSuccess"] = useCallback((msg: string, duration = 3000) => {
    showAlert(msg, "success", duration);
  }, [showAlert]);

  const showError: AlertContextType["showError"] = useCallback((msg: string, duration = 5000) => {
    showAlert(msg, "danger", duration);
  }, [showAlert]);

  const showInfo: AlertContextType["showInfo"] = useCallback((msg: string, duration = 4000) => {
    showAlert(msg, "info", duration);
  }, [showAlert]);

  const showWarning: AlertContextType["showWarning"] = useCallback((msg: string, duration = 4000) => {
    showAlert(msg, "warning", duration);
  }, [showAlert]);

  const removeAlert: AlertContextType["removeAlert"] = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const clearAllAlerts: AlertContextType["clearAllAlerts"] = useCallback(() => {
    setAlerts([]);
  }, []);

  const value: AlertContextType = {
    alerts,
    showAlert,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    removeAlert,
    clearAllAlerts
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertContainer alerts={alerts} onRemove={removeAlert} />
    </AlertContext.Provider>
  );
};

// Alert Container Component
const AlertContainer: React.FC<{
  alerts: Alert[];
  onRemove: (id: string) => void;
}> = ({ alerts, onRemove }) => {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-sm">
      {alerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} onRemove={onRemove} />
      ))}
    </div>
  );
};

// Individual Alert Component
const AlertItem: React.FC<{
  alert: Alert;
  onRemove: (id: string) => void;
}> = ({ alert, onRemove }) => {
  const getAlertStyles = (type: Alert["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "danger":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getIcon = (type: Alert["type"]) => {
    switch (type) {
      case "success":
        return "✅";
      case "danger":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "📢";
    }
  };

  return (
    <div className={`border rounded-lg p-4 shadow-lg transition-all duration-300 ${getAlertStyles(alert.type)}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2">
          <span className="text-lg">{getIcon(alert.type)}</span>
          <div className="flex-1">
            <p className="text-sm font-medium">{alert.msg}</p>
            {alert.action && (
              <button
                onClick={alert.action.onClick}
                className="mt-2 text-xs underline hover:no-underline"
              >
                {alert.action.label}
              </button>
            )}
          </div>
        </div>
        <button
          onClick={() => onRemove(alert.id)}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AlertState;

