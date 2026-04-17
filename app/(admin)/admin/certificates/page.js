"use client";

import { useAdminData } from "@/hooks/useAdminData";

export default function AdminCertificatesPage() {
  const { p, css, notify } = useAdminData();

  return (
    <div className="fade">
      <h1 style={{ ...css.h1, marginBottom: 24 }}>Certificates</h1>
      <div style={css.card}>
        <h3 style={{ ...css.h3, marginBottom: 14 }}>Issued Certificates</h3>
        {[
          { n: "Priya Sharma", c: "Financial Accounting", score: "91%", date: "10 Feb 2026" },
          { n: "Nomvula Dlamini", c: "Leadership & Team Mgmt", score: "84%", date: "01 Mar 2026" },
          { n: "Fatima Hendricks", c: "Project Management", score: "95%", date: "05 Feb 2026" },
        ].map((cert, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid #f8fafc" }}>
            <div style={{ fontSize: 28 }}>🏆</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{cert.n}</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>{cert.c} • {cert.date}</div>
            </div>
            <span style={{ fontWeight: 700, color: "#10B981" }}>{cert.score}</span>
            <button onClick={() => notify("Certificate downloaded")} style={css.btn(p, "#fff", true)}>⬇ PDF</button>
          </div>
        ))}
      </div>
    </div>
  );
}
