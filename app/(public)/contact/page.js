"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useNotification } from "@/contexts/NotificationContext";
import ContactUsPage from "@/components/contactUsPage";
import Splash from "@/components/splash";
import { useState } from "react";

export default function ContactRoute() {
  const { tenant, currentTenant, currentUser, userRole, logout, authChecking } =
    useAuth();
  const { p, s, a, css } = useThemeContext();
  const { notify, notification } = useNotification();
  const [selectConditionAndPolicy, setSelectConditionAndPolicy] = useState("");
  const router = useRouter();

  if (authChecking) return <Splash />;

  return (
    <ContactUsPage
      p={p}
      s={s}
      a={a}
      css={css}
      notify={notify}
      notification={notification}
      tenant={tenant}
      currentTenant={currentTenant}
      currentUser={currentUser}
      userRole={userRole}
      logout={logout}
      setView={(v) => {
        if (v === "landing") router.push("/");
        else if (v === "login") router.push("/login");
      }}
      setSelectConditionAndPolicy={setSelectConditionAndPolicy}
      view="contact"
      onBack={() => router.push("/")}
    />
  );
}
