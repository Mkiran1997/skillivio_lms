"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification } from "@/contexts/NotificationContext";
import LoginPage from "@/components/loginPage";
import Splash from "@/components/splash";

export default function LoginRoute() {
  const { tenant, currentTenant, login, authChecking } = useAuth();
  const { notify } = useNotification();
  const router = useRouter();

  if (authChecking) return <Splash />;

  const p = tenant?.primary;
  const s = tenant?.secondary;

  return (
    <LoginPage
      onLogin={(user) => {
        login(user);
        notify("Welcome back, " + user.name.split(" ")[0] + "!");
        if (user.roles === "superAdmin") router.push("/superadmin/tenants");
        else if (user.roles === "admin") router.push("/admin/dashboard");
        else router.push("/learner/dashboard");
      }}
      onBack={() => router.push("/")}
      tenant={tenant}
      currentTenant={currentTenant}
      setView={(v) => {
        if (v === "register") router.push("/register");
        else if (v === "landing") router.push("/");
      }}
      p={p}
      s={s}
      notify={notify}
    />
  );
}
