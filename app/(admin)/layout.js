"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useNotification } from "@/contexts/NotificationContext";
import Sidebar from "@/components/shared/Sidebar";
import Splash from "@/components/splash";
import { GLOBAL_CSS } from "@/utils/globalCss";

const ADMIN_NAV_ITEMS = [
  { id: "dashboard", icon: "📊", label: "Dashboard", href: "/admin/dashboard" },
  { id: "courses", icon: "📚", label: "Courses", href: "/admin/courses" },
  { id: "learners", icon: "👥", label: "Learners", href: "/admin/learners" },
  { id: "enrolments", icon: "📋", label: "Enrolments", href: "/admin/enrolments" },
  { id: "analytics", icon: "📈", label: "Analytics", href: "/admin/analytics" },
  { id: "payments", icon: "💳", label: "Payments", href: "/admin/payments" },
  { id: "certificates", icon: "🏆", label: "Certificates", href: "/admin/certificates" },
  { id: "settings", icon: "⚙️", label: "Settings", href: "/admin/settings" },
  { id: "contact", icon: "👤", label: "Contact", href: "/admin/contact" },
];

export default function AdminLayout({ children }) {
  const { currentUser, userRole, tenant, currentTenant, logout, authChecking } =
    useAuth();
  const { p, s, a, css } = useThemeContext();
  const { notification } = useNotification();
  const router = useRouter();
  const pathname = usePathname();

  // Auth guard — redirect if not logged in or wrong role
  useEffect(() => {
    if (!authChecking) {
      if (!currentUser) {
        router.replace("/login");
      } else if (userRole !== "admin") {
        if (userRole === "superAdmin") router.replace("/superadmin/tenants");
        else if (userRole === "learner") router.replace("/learner/dashboard");
        else router.replace("/login");
      }
    }
  }, [authChecking, currentUser, userRole, router]);

  if (authChecking) return <Splash />;
  if (!currentUser || userRole !== "admin") return <Splash />;

  // Determine active tab from pathname
  const activeTab = ADMIN_NAV_ITEMS.find((item) =>
    pathname.startsWith(item.href)
  )?.id || "dashboard";

  return (
    <div style={{ display: "flex", ...css.page }}>
      <style>{GLOBAL_CSS}</style>
      <Sidebar
        tab={activeTab}
        setTab={(tabId) => {
          const item = ADMIN_NAV_ITEMS.find((i) => i.id === tabId);
          if (item) router.push(item.href);
        }}
        items={ADMIN_NAV_ITEMS}
        tenant={tenant}
        currentUser={currentUser}
        userRole={userRole}
        currentTenant={currentTenant}
        logout={() => {
          logout();
          router.push("/login");
        }}
        p={p}
        s={s}
        css={css}
        notification={notification}
      />
      <div style={css.main}>{children}</div>
    </div>
  );
}
