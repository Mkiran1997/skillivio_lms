"use client";

import { useThemeContext } from "@/contexts/ThemeContext";

export default function SuperAdminSupportPage() {
  const { css } = useThemeContext();

  return (
    <div className="fade">
      <h1 style={{ ...css.h1, marginBottom: 24 }}>Client Support</h1>
      <div style={{ ...css.card, textAlign: "center", padding: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎧</div>
        <h3 style={css.h3}>Support Dashboard Coming Soon</h3>
        <p style={{ color: "#64748b", marginTop: 8 }}>Ticket management, live chat and tenant support requests.</p>
      </div>
    </div>
  );
}
