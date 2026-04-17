"use client";

import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const notify = useCallback((msg, type) => {
    setNotification({ msg: msg, type: type || "success" });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  }, []);

  const value = { notification, notify };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}

export default NotificationContext;
