"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useNotification } from "@/contexts/NotificationContext";
import Sidebar from "@/components/shared/Sidebar";
import Splash from "@/components/splash";
import { GLOBAL_CSS } from "@/utils/globalCss";

const SUPER_ADMIN_NAV = [
  { id: "tenants", icon: "🏢", label: "Tenants", href: "/superadmin/tenants" },
  { id: "tiers", icon: "💎", label: "Tiers & Pricing", href: "/superadmin/tiers" },
  { id: "analytics", icon: "📊", label: "Analytics", href: "/superadmin/analytics" },
  { id: "billing", icon: "💰", label: "Billing", href: "/superadmin/billing" },
  { id: "platform", icon: "⚙️", label: "Platform", href: "/superadmin/platform" },
  { id: "cohorts", icon: "👥", label: "Cohorts", href: "/superadmin/cohorts" },
  { id: "support", icon: "🎧", label: "Support", href: "/superadmin/support" },
];

export default function SuperAdminLayout({ children }) {
  const { currentUser, userRole, tenant, currentTenant, logout, authChecking } =
    useAuth();
  const { p, s, a, css } = useThemeContext();
  const { notification } = useNotification();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authChecking) {
      if (!currentUser) {
        router.replace("/login");
      } else if (userRole !== "superAdmin") {
        if (userRole === "admin") router.replace("/admin/dashboard");
        else if (userRole === "learner") router.replace("/learner/dashboard");
        else router.replace("/login");
      }
    }
  }, [authChecking, currentUser, userRole, router]);

  if (authChecking) return <Splash />;
  if (!currentUser || userRole !== "superAdmin") return <Splash />;

  const activeTab = SUPER_ADMIN_NAV.find((item) =>
    pathname.startsWith(item.href)
  )?.id || "tenants";

  return (
    <div style={{ display: "flex", ...css.page }}>
      <style>{GLOBAL_CSS}</style>
      <Sidebar
        tab={activeTab}
        setTab={(tabId) => {
          const item = SUPER_ADMIN_NAV.find((i) => i.id === tabId);
          if (item) router.push(item.href);
        }}
        items={SUPER_ADMIN_NAV}
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
        brandOverride={{
          sidebarBg: "#2E3044",
          accent: "#2FBF71",
          subtitle: "Super Admin Console",
          restricted: true,
        }}
      />
      <div style={css.main}>{children}</div>
    </div>
  );
}
