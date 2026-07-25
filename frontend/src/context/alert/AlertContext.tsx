import { createContext, useContext } from "react";

export interface Alert {
  id: string;
  msg: string;
  type: "success" | "danger" | "info" | "warning";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface AlertContextType {
  alerts: Alert[];
  showAlert: (msg: string, type: Alert["type"], duration?: number, action?: Alert["action"]) => void;
  showSuccess: (msg: string, duration?: number) => void;
  showError: (msg: string, duration?: number) => void;
  showInfo: (msg: string, duration?: number) => void;
  showWarning: (msg: string, duration?: number) => void;
  removeAlert: (id: string) => void;
  clearAllAlerts: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export default AlertContext;


