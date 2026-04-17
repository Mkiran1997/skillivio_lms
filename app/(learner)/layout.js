"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useNotification } from "@/contexts/NotificationContext";
import Sidebar from "@/components/shared/Sidebar";
import Splash from "@/components/splash";
import { GLOBAL_CSS } from "@/utils/globalCss";

const LEARNER_NAV_ITEMS = [
  { id: "dashboard", icon: "🏠", label: "Home", href: "/learner/dashboard" },
  { id: "courses", icon: "📚", label: "My Courses", href: "/learner/courses" },
  { id: "browse", icon: "🔍", label: "Browse Courses", href: "/learner/browse" },
  { id: "enrolments", icon: "📋", label: "Enrolments", href: "/learner/enrolments" },
  { id: "certificates", icon: "🏆", label: "Certificates", href: "/learner/certificates" },
];

export default function LearnerLayout({ children }) {
  const { currentUser, userRole, tenant, currentTenant, logout, authChecking } =
    useAuth();
  const { p, s, a, css } = useThemeContext();
  const { notification } = useNotification();
  const router = useRouter();
  const pathname = usePathname();

  // Auth guard
  useEffect(() => {
    if (!authChecking) {
      if (!currentUser) {
        router.replace("/login");
      } else if (userRole !== "learner") {
        if (userRole === "admin") router.replace("/admin/dashboard");
        else if (userRole === "superAdmin") router.replace("/superadmin/tenants");
        else router.replace("/login");
      }
    }
  }, [authChecking, currentUser, userRole, router]);

  if (authChecking) return <Splash />;
  if (!currentUser || userRole !== "learner") return <Splash />;

  // For course player route, don't show sidebar
  if (pathname.startsWith("/learner/course/")) {
    return <>{children}</>;
  }

  const activeTab = LEARNER_NAV_ITEMS.find((item) =>
    pathname.startsWith(item.href)
  )?.id || "dashboard";

  return (
    <div style={{ display: "flex", ...css.page }}>
      <style>{GLOBAL_CSS}</style>
      <Sidebar
        tab={activeTab}
        setTab={(tabId) => {
          const item = LEARNER_NAV_ITEMS.find((i) => i.id === tabId);
          if (item) router.push(item.href);
        }}
        items={LEARNER_NAV_ITEMS}
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
