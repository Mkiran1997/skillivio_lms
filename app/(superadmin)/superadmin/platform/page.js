"use client";

import { useThemeContext } from "@/contexts/ThemeContext";
import { useNotification } from "@/contexts/NotificationContext";
import ToggleSwitch from "@/components/toggleSwitch";

export default function SuperAdminPlatformPage() {
  const { css } = useThemeContext();
  const { notify } = useNotification();
  const sa = "#F4A800";

  return (
    <div className="fade">
      <h1 style={{ ...css.h1, marginBottom: 24 }}>Platform Settings</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { icon: "🔒", title: "Security", desc: "JWT token settings, session duration, IP whitelisting" },
          { icon: "📧", title: "Email Templates", desc: "Configure enrolment, welcome and reminder emails" },
          { icon: "🌐", title: "Domain Management", desc: "Custom domain mapping for tenant SDPs" },
          { icon: "📊", title: "QCTO Integration", desc: "SETA reporting endpoints and audit log config" },
        ].map(card => (
          <div key={card.title} style={css.card}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>{card.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{card.title}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{card.desc}</div>
              </div>
            </div>
            <ToggleSwitch label={"Enable " + card.title} hint="Toggle feature" color={sa} />
            <button onClick={() => notify(card.title + " settings saved!")} style={{ ...css.btn(sa), marginTop: 12 }}>Configure</button>
          </div>
        ))}
      </div>
    </div>
  );
}
