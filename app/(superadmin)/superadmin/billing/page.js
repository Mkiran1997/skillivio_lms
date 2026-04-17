"use client";

import { useThemeContext } from "@/contexts/ThemeContext";
import { useNotification } from "@/contexts/NotificationContext";

export default function SuperAdminBillingPage() {
  const { css } = useThemeContext();
  const { notify } = useNotification();
  const sa = "#F4A800";

  return (
    <div className="fade">
      <h1 style={{ ...css.h1, marginBottom: 24 }}>Billing & Invoicing</h1>
      <div style={{ ...css.card, textAlign: "center", padding: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>💰</div>
        <h3 style={css.h3}>Billing Management Coming Soon</h3>
        <p style={{ color: "#64748b", marginTop: 8 }}>Tenant invoicing, subscription management and payment tracking.</p>
      </div>
    </div>
  );
}
