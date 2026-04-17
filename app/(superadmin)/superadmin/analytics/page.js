"use client";

import { useThemeContext } from "@/contexts/ThemeContext";
import StatCard from "@/components/statCard";

export default function SuperAdminAnalyticsPage() {
  const { css } = useThemeContext();
  const sa = "#F4A800";

  return (
    <div className="fade">
      <h1 style={{ ...css.h1, marginBottom: 24 }}>Platform Analytics</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon="🏢" value="—" label="Active Tenants" color={sa} />
        <StatCard icon="👥" value="—" label="Total Learners" color="#10B981" />
        <StatCard icon="📚" value="—" label="Total Courses" color="#6366F1" />
        <StatCard icon="🏆" value="—" label="Certificates Issued" color="#8B5CF6" />
      </div>
      <div style={{ ...css.card, textAlign: "center", padding: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
        <h3 style={css.h3}>Analytics Dashboard Coming Soon</h3>
        <p style={{ color: "#64748b", marginTop: 8 }}>Advanced platform analytics with tenant comparisons and growth metrics.</p>
      </div>
    </div>
  );
}
