"use client";

import { createContext, useContext, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { useTheme as useThemeEffect } from "@/utils/utility";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const { tenant } = useAuth();

  // Apply CSS custom properties for the tenant
  useThemeEffect(tenant);

  const p = tenant?.primary;
  const s = tenant?.secondary;
  const a = tenant?.accent;

  // Memoize CSS helpers so they don't recreate on every render
  const css = useMemo(() => ({
    page: {
      minHeight: "100vh",
      background: "#f0f2f5",
      fontFamily: "'Segoe UI',system-ui,sans-serif",
    },
    sidebar: {
      width: 240,
      background: s,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
    },
    main: { flex: 1, overflow: "auto", padding: "28px 32px" },
    card: {
      background: "#fff",
      borderRadius: 12,
      padding: "20px 24px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
    },
    btn: function (bg, col, sm) {
      bg = bg || p;
      col = col || "#fff";
      sm = sm || false;
      return {
        background: bg,
        color: col,
        border: "none",
        borderRadius: 8,
        padding: sm ? "7px 14px" : "10px 20px",
        fontSize: sm ? 12 : 14,
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
      };
    },
    btnOut: function (col, sm) {
      col = col || p;
      sm = sm || false;
      return {
        background: "transparent",
        color: col,
        border: "1.5px solid " + col,
        borderRadius: 8,
        padding: sm ? "6px 13px" : "9px 19px",
        fontSize: sm ? 12 : 14,
        fontWeight: 600,
        cursor: "pointer",
      };
    },
    tag: function (col) {
      col = col || p;
      return {
        background: col + "18",
        color: col,
        borderRadius: 100,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 600,
      };
    },
    input: {
      border: "1.5px solid #e2e8f0",
      borderRadius: 8,
      padding: "10px 12px",
      fontSize: 13,
      width: "100%",
      outline: "none",
      fontFamily: "inherit",
      boxSizing: "border-box",
    },
    label: {
      fontSize: 12,
      fontWeight: 600,
      color: "#64748b",
      marginBottom: 4,
      display: "block",
    },
    h1: { fontSize: 26, fontWeight: 800, color: "#0f172a", margin: 0 },
    h2: { fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 },
    h3: { fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 },
    avatar: function (bg) {
      bg = bg || p;
      return {
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: bg,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 700,
        flexShrink: 0,
      };
    },
  }), [p, s]);

  const value = { p, s, a, css };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}

export default ThemeContext;
