"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useNotification } from "@/contexts/NotificationContext";

export default function LearnerCertificatesPage() {
  const { currentUser } = useAuth();
  const { p, css } = useThemeContext();
  const { notify } = useNotification();

  // TODO: Fetch actual certificates from API
  return (
    <div className="fade">
      <h1 style={{ ...css.h1, marginBottom: 24 }}>My Certificates</h1>
      <div style={{ ...css.card, textAlign: "center", padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
        <h3 style={css.h3}>No Certificates Yet</h3>
        <p style={{ color: "#64748b", marginTop: 8, maxWidth: 400, margin: "8px auto 0" }}>
          Complete your enrolled courses and pass the assessments to earn your certificates.
          They will appear here once awarded.
        </p>
      </div>
    </div>
  );
}
