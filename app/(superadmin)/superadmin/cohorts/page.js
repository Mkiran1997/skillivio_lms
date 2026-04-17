"use client";

import { useThemeContext } from "@/contexts/ThemeContext";

export default function SuperAdminCohortsPage() {
  const { css } = useThemeContext();

  return (
    <div className="fade">
      <h1 style={{ ...css.h1, marginBottom: 24 }}>Cohorts & Groups</h1>
      <div style={{ ...css.card, textAlign: "center", padding: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
        <h3 style={css.h3}>Cohort Management Coming Soon</h3>
        <p style={{ color: "#64748b", marginTop: 8 }}>Manage learner groups, intakes and cohort assignments across tenants.</p>
      </div>
    </div>
  );
}
