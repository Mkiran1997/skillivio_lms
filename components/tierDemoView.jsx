import { useState } from "react";
import { GLOBAL_CSS } from "@/utils/globalCss";
import { TIER_DATA } from "@/utils/mockData";

function TierDemoView({ ...props }) {
    var tier = props.tier, onClose = props.onClose;
    var [dTab, setDTab] = useState("overview");
    var col = tier.color;

    function fVal(v) {
        if (v === true) return <span style={{ color: "#10B981", fontWeight: 700 }}>✓</span>;
        if (v === false) return <span style={{ color: "#e2e8f0", fontWeight: 700 }}>—</span>;
        return <span style={{ background: col + "15", color: col, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{v}</span>;
    }

    var tabStyle = function (id) { return { background: dTab === id ? col : "rgba(255,255,255,0.1)", color: dTab === id ? "#fff" : "rgba(255,255,255,0.6)", border: "1px solid " + (dTab === id ? col : "rgba(255,255,255,0.15)"), borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: dTab === id ? 700 : 400, cursor: "pointer" }; };

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 4000, display: "flex", flexDirection: "column", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
            <style>{GLOBAL_CSS}</style>
            <div style={{ background: "#2E3044", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 38, height: 38, background: col, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#fff" }}>{tier.emoji}</div>
                    <div>
                        <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>{tier.name} Tier — Interactive Demo</div>
                        <div style={{ color: col, fontSize: 12, marginTop: 1 }}>Showing exactly what your client gets on this plan</div>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ background: col + "20", border: "1px solid " + col + "40", borderRadius: 8, padding: "6px 14px" }}>
                        <span style={{ color: col, fontSize: 13, fontWeight: 700 }}>{tier.monthly}/month</span>
                        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}> + {tier.setup} setup</span>
                    </div>
                    <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>✕ Close Demo</button>
                </div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "10px 24px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[["overview", "🏠 Overview"], ["features", "✅ Features"], ["pricing", "💰 Pricing"]].map(function (pair) {
                    return <button key={pair[0]} onClick={function () { setDTab(pair[0]); }} style={tabStyle(pair[0])}>{pair[1]}</button>;
                })}
            </div>
            <div style={{ flex: 1, overflowY: "auto", background: "#f0f2f5", padding: "24px 28px" }}>
                {dTab === "overview" && (
                    <div className="fade">
                        <div style={{ background: "#2E3044", borderRadius: 16, padding: "32px", marginBottom: 20, display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32, alignItems: "center" }}>
                            <div>
                                <div style={{ background: col + "20", color: col, borderRadius: 100, padding: "5px 14px", fontSize: 12, fontWeight: 700, display: "inline-block", marginBottom: 12, border: "1px solid " + col + "40" }}>{tier.emoji} {tier.name.toUpperCase()}</div>
                                <h1 style={{ color: "#fff", fontSize: 30, fontWeight: 900, margin: "0 0 12px" }}>{tier.tagline}</h1>
                                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.7, margin: "0 0 16px" }}>{tier.ideal}</p>
                            </div>
                            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "24px", textAlign: "center", border: "1px solid " + col + "30" }}>
                                <div style={{ fontSize: 12, color: col, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>MONTHLY RETAINER</div>
                                <div style={{ fontSize: 40, fontWeight: 900, color: "#fff" }}>{tier.monthly}</div>
                                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>per month, VAT excluded</div>
                                <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 14, paddingTop: 14 }}>
                                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Once-off setup</div>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: col }}>{tier.setup}</div>
                                </div>
                                <div style={{ background: col + "15", borderRadius: 8, padding: "6px 10px", marginTop: 10, fontSize: 11, color: col, fontWeight: 600 }}>Annual: {tier.annual} (10% saving)</div>
                            </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                            {Object.entries(tier.features).map(function (pair) {
                                var cat = pair[0], feats = pair[1];
                                var enabled = feats.filter(function (f) { return f.v !== false; }).length;
                                return (
                                    <div key={cat} style={{ background: "#fff", borderRadius: 12, padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                                        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid " + col + "30" }}>{cat}</div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                            <div style={{ flex: 1, height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                                                <div style={{ height: "100%", width: (enabled / feats.length * 100) + "%", background: col, borderRadius: 3 }} />
                                            </div>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: col }}>{enabled}/{feats.length}</span>
                                        </div>
                                        {feats.map(function (feat) {
                                            return (
                                                <div key={feat.f} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: "1px solid #f8fafc" }}>
                                                    <span style={{ fontSize: 11, color: feat.v !== false ? "#334155" : "#94a3b8" }}>{feat.f}</span>
                                                    {fVal(feat.v)}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {dTab === "features" && (
                    <div className="fade">
                        <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "#2E3044" }}>
                                        <th style={{ textAlign: "left", padding: "14px 18px", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, width: "40%" }}>Feature</th>
                                        {Object.values(TIER_DATA).map(function (t) {
                                            return (
                                                <th key={t.id} style={{ padding: "14px 12px", textAlign: "center", fontSize: 13 }}>
                                                    <div style={{ color: t.id === tier.id ? t.color : "rgba(255,255,255,0.5)", fontWeight: 800 }}>{t.emoji} {t.name}</div>
                                                    {t.id === tier.id && <div style={{ background: t.color, color: "#fff", borderRadius: 4, padding: "2px 8px", fontSize: 10, fontWeight: 700, marginTop: 4 }}>CURRENT</div>}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(TIER_DATA.foundation.features).map(function (catPair, ci) {
                                        var cat = catPair[0], foundFeats = catPair[1];
                                        return [
                                            <tr key={"cat" + ci} style={{ background: col + "08" }}>
                                                <td colSpan={4} style={{ padding: "10px 18px", fontSize: 12, fontWeight: 800, color: col, letterSpacing: .5 }}>{cat}</td>
                                            </tr>
                                        ].concat(foundFeats.map(function (feat, fi) {
                                            return (
                                                <tr key={feat.f} style={{ borderBottom: "1px solid #f8fafc", background: fi % 2 === 0 ? "#fff" : "#fafafa" }}>
                                                    <td style={{ padding: "10px 18px", fontSize: 13, color: "#334155" }}>{feat.f}</td>
                                                    {Object.values(TIER_DATA).map(function (t) {
                                                        var tf = Object.values(t.features).reduce(function (acc, arr) { return acc.concat(arr); }, []).find(function (f) { return f.f === feat.f; });
                                                        var v = tf ? tf.v : false;
                                                        var isThis = t.id === tier.id;
                                                        return (
                                                            <td key={t.id} style={{ padding: "10px 12px", textAlign: "center", background: isThis ? (t.color + "06") : "transparent" }}>
                                                                {v === true && <span style={{ color: isThis ? t.color : "#10B981", fontWeight: 700, fontSize: 16 }}>✓</span>}
                                                                {v === false && <span style={{ color: "#e2e8f0", fontSize: 16 }}>—</span>}
                                                                {typeof v === "string" && <span style={{ background: isThis ? (t.color + "15") : "#f1f5f9", color: isThis ? t.color : "#475569", borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{v}</span>}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        }));
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {dTab === "pricing" && (
                    <div className="fade">
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                            <div style={{ background: "#fff", borderRadius: 12, padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 16px" }}>Cost Breakdown</h3>
                                {[["Once-off Setup Fee", tier.setup], ["Monthly Retainer", tier.monthly + "/month"], ["Annual Option", tier.annual], ["VAT", "15% added to invoices"], ["Transaction Fees", "None — ever"]].map(function (pair) {
                                    return <div key={pair[0]} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f8fafc", fontSize: 13 }}><span style={{ color: "#64748b" }}>{pair[0]}</span><span style={{ fontWeight: 700 }}>{pair[1]}</span></div>;
                                })}
                            </div>
                            <div style={{ background: "#fff", borderRadius: 12, padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 16px" }}>Revenue Models for SDPs</h3>
                                {["SETA / NSDP Funded Training", "Employer-Contracted Learnerships", "Fee-Paying Learner Enrolments", "Corporate In-House Skills Academies", "Short Skills Programmes (SSPs)"].map(function (item) {
                                    return <div key={item} style={{ display: "flex", gap: 8, padding: "8px 0", borderBottom: "1px solid #f8fafc", fontSize: 13 }}><span style={{ color: col }}>✓</span>{item}</div>;
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TierDemoView;