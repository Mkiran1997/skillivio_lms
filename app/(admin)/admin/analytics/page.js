"use client";

import { useAdminData } from "@/hooks/useAdminData";
import StatCard from "@/components/statCard";

export default function AdminAnalyticsPage() {
  const { p, a, css, AdminCourse, totalEnrolled, Enrollment } = useAdminData();

  return (
    <div className="fade">
      <h1 style={{ ...css.h1, marginBottom: 24 }}>Analytics</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
        <StatCard icon="👥" value={totalEnrolled?.length?.toLocaleString()} label="Total Enrolments" color={p} />
        <StatCard icon="🏆" value="89%" label="Completion Rate" color="#10B981" />
        <StatCard icon="📝" value="76%" label="Avg Pass Rate" color={a} />
        <StatCard icon="⭐" value="247" label="Credits Awarded" color="#8B5CF6" />
      </div>
      <div style={css.card}>
        <h3 style={{ ...css.h3, marginBottom: 16 }}>Course Performance</h3>
        {AdminCourse?.filter(c => c?.status === "published").map(c => {
          const enrolled = Enrollment.filter(e => e?.courseId?._id === c?._id)?.length;
          const pct = Math.round((enrolled / 500) * 100);
          return (
            <div key={c?.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13 }}>{c?.thumb} {c?.title}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: p }}>{enrolled} enrolled</span>
              </div>
              <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: pct + "%", background: p, borderRadius: 4 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
