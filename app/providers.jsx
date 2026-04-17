"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

export function Providers({ children }) {
  const [store] = useState(() => makeStore());

  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}
