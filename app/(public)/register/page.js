"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification } from "@/contexts/NotificationContext";
import RegisterPage from "@/components/registrationPage";
import Splash from "@/components/splash";

export default function RegisterRoute() {
  const { tenant, currentTenant, authChecking } = useAuth();
  const { notify } = useNotification();
  const router = useRouter();

  if (authChecking) return <Splash />;

  const p = tenant?.primary;
  const s = tenant?.secondary;

  return (
    <RegisterPage
      onRegister={(user) => {
        notify("Welcome, " + user.name.split(" ")[0] + "!");
        router.push("/login");
      }}
      onBack={() => router.push("/")}
      tenant={tenant}
      setView={(v) => {
        if (v === "login") router.push("/login");
        else if (v === "landing") router.push("/");
      }}
      p={p}
      s={s}
      currentTenant={currentTenant}
      notify={notify}
    />
  );
}
