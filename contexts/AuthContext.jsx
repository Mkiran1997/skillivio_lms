"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchtenants } from "@/store/slices/tenantSlice";
import { TENANTS } from "@/utils/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [currentTenant, setCurrentTenant] = useState("skillivio");
  const [authChecking, setAuthChecking] = useState(true);

  const dispatch = useDispatch();
  const { tenants } = useSelector((state) => state.tenants);

  // Fetch tenants on mount
  useEffect(() => {
    dispatch(fetchtenants());
  }, [dispatch]);

  // Resolve current tenant object
  const tenant =
    tenants.find((t) => t.slug === currentTenant) || TENANTS[currentTenant];

  // Restore session from JWT on mount
  useEffect(() => {
    if (!tenant) return;

    async function restoreSession() {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setAuthChecking(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-tenant-id": tenant._id || tenant.slug,
          },
        });

        if (!res.ok) {
          localStorage.removeItem("accessToken");
          setAuthChecking(false);
          return;
        }

        const data = await res.json();
        const user = data.user;

        setCurrentUser(user);
        setUserRole(user.roles);
      } catch (err) {
        console.error("Session restore error:", err);
        localStorage.removeItem("accessToken");
      } finally {
        setAuthChecking(false);
      }
    }

    restoreSession();
  }, [tenant]);

  const login = useCallback((user) => {
    setCurrentUser(user);
    setUserRole(user.roles);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Length": "0" },
      });
      localStorage.removeItem("accessToken");
    } catch (e) {
      console.error("Logout API failed", e);
    }
    setCurrentUser(null);
    setUserRole(null);
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    userRole,
    setUserRole,
    currentTenant,
    setCurrentTenant,
    tenant,
    authChecking,
    login,
    logout,
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
