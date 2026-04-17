"use client";

import { useState } from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useNotification } from "@/contexts/NotificationContext";
import TierDemoView from "@/components/tierDemoView";
import { TIER_DATA } from "@/utils/mockData";

export default function SuperAdminTiersPage() {
  const { css } = useThemeContext();
  const { notify } = useNotification();
  const [demoTier, setDemoTier] = useState(null);

  return (
    <div className="fade">
      {demoTier && <TierDemoView tier={TIER_DATA[demoTier]} onClose={() => setDemoTier(null)} />}
      <h1 style={{ ...css.h1, marginBottom: 8 }}>Tiers & Pricing</h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>Manage subscription tiers for tenant SDPs</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
        {Object.values(TIER_DATA).map(function (tier) {
            return (
                <div key={tier.id} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", border: "2px solid " + tier.color + "30" }}>
                    <div style={{ background: tier.color, padding: "20px", textAlign: "center" }}>
                        <div style={{ fontSize: 36, marginBottom: 6 }}>{tier.emoji}</div>
                        <div style={{ color: "#fff", fontWeight: 900, fontSize: 20 }}>{tier.name}</div>
                        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 }}>{tier.tagline}</div>
                    </div>
                    <div style={{ padding: "20px" }}>
                        <div style={{ textAlign: "center", marginBottom: 14 }}>
                            <div style={{ fontSize: 30, fontWeight: 900, color: "#0f172a" }}>{tier.monthly}<span style={{ fontSize: 13, fontWeight: 400, color: "#94a3b8" }}>/mo</span></div>
                            <div style={{ fontSize: 12, color: "#94a3b8" }}>Setup: {tier.setup}</div>
                        </div>
                        <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6, marginBottom: 14 }}>{tier.ideal}</p>
                        <button onClick={function () { setDemoTier(tier.id); }}
                            style={{ background: tier.color, color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                            ▶ Launch {tier.name} Demo
                        </button>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
}
