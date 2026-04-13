import { useState } from 'react';
import { GLOBAL_CSS } from '../app/globalCss';
import { TENANTS } from "../app/mockData";
import Toast from './toast';
import { usePathname } from "next/navigation";


function LandingPage({ ...props }) {

    const { p, s, tenant, setView, currentTenant, setCurrentTenant, notification, css } = props;
    const pathname = usePathname();
    const isAdmin = pathname === "/admin";


    return (
        <div style={{ minHeight: "100vh", background: s, fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
            <Toast notification={notification} />
            <style>{GLOBAL_CSS}</style>
            <nav style={{ padding: "18px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {
                        currentTenant === "skillivio" ?
                            <img src='/logo/skillivioLogo.jpeg' alt={tenant.logo} style={{ width: 38, height: 38, objectFit: "contain", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 16 }} />
                            : <img src={tenant?.logo} alt={tenant?.name[0]} style={{ width: 38, height: 38, background: p, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 16 }} />

                    }
                    <div>
                        <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>{tenant?.name}</div>
                        <div style={{ color: p, fontSize: 11 }}>{tenant?.tagline}</div>
                    </div>
                </div>
                {
                    isAdmin && (
                        <div style={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "12px",
                            backdropFilter: "blur(10px)"
                        }}>
                            <select
                                onChange={(e) => setCurrentTenant(e.target.value)}
                                value={currentTenant}
                                style={{
                                    background: "rgba(255, 255, 255, 0.05)",
                                    border: `1px solid rgba(255, 255, 255, 0.2)`,
                                    color: "#fff",
                                    borderRadius: "10px",
                                    padding: "10px 16px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    outline: "none",
                                    appearance: "none", // Removes default browser arrow for a cleaner look
                                    transition: "all 0.2s ease-in-out",
                                    minWidth: "160px"
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = p;
                                    e.target.style.background = "rgba(255, 255, 255, 0.1)";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                                    e.target.style.background = "rgba(255, 255, 255, 0.05)";
                                }}
                            >
                                {Object.entries(TENANTS).map(([key, tenant]) => (
                                    <option key={key} value={key} style={{ background: "#1a1a1a", color: "#fff" }}>
                                        {tenant.name}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={() => setView("login")}
                                style={{
                                    background: p,
                                    border: "none",
                                    color: "white",
                                    borderRadius: "10px",
                                    padding: "10px 24px",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    boxShadow: `0 4px 15px -5px ${p}`,
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = "translateY(-2px)";
                                    e.target.style.filter = "brightness(1.1)";
                                    e.target.style.boxShadow = `0 6px 20px -5px ${p}`;
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.filter = "brightness(1)";
                                    e.target.style.boxShadow = `0 4px 15px -5px ${p}`;
                                }}
                            >
                                Log In
                            </button>
                        </div>
                    )
                }
            </nav>
            <div style={{ padding: "80px 48px 60px", display: "flex", alignItems: "center", gap: 60, maxWidth: 1200, margin: "0 auto" }}>
                <div style={{ flex: 1, animation: "fadeIn 0.6s ease" }}>
                    <div style={{ background: p + "22", color: p, borderRadius: 100, padding: "6px 16px", fontSize: 12, fontWeight: 700, display: "inline-block", marginBottom: 20, border: "1px solid " + p + "40" }}>🎓 QCTO-Aligned White Label LMS</div>
                    <h1 style={{ fontSize: 52, fontWeight: 900, color: "#fff", lineHeight: 1.05, margin: "0 0 20px" }}>Your Brand.<br /><span style={{ color: p }}>Your Platform.</span><br />QCTO Ready.</h1>
                    <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 17, lineHeight: 1.7, maxWidth: 500, margin: "0 0 36px" }}>A fully managed LMS delivered under your brand — configured for QCTO compliance from day one. Learner analytics, assessments, PoE and SETA exports included.</p>
                    <div style={{ display: "flex", gap: 14 }}>
                        {/* <button onClick={function () { setView("login"); }} style={{ ...css.btn(p), padding: "14px 28px", fontSize: 16 }}>Launch Platform →</button> */}
                        <button onClick={function () { setView("contact"); }} style={{ ...css?.btn(p), padding: "14px 28px", fontSize: 16 }}>Contact Us →</button>
                    </div>
                    <div style={{ display: "flex", gap: 32, marginTop: 48 }}>
                        {[["500+", "SDPs Trust Us"], ["50K+", "Learners Served"], ["QCTO", "Aligned"]].map(function (pair) {
                            return <div key={pair[1]}><div style={{ fontSize: 22, fontWeight: 900, color: p }}>{pair[0]}</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{pair[1]}</div></div>;
                        })}
                    </div>
                    <div style={{ marginTop: 40, display: "flex", flexDirection: "row", gap: 16 }}>
                        <div style={{ color: "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "1px", paddingTop: 15 }}>
                            Connect with us
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                            {[
                                { icon: "fab fa-facebook-f", url: "https://www.facebook.com/share/18YVwWrqoS/?mibextid=wwXIfr" },
                                { icon: "fab fa-linkedin-in", url: "https://www.linkedin.com/company/skillivio/" },
                                { icon: "fab fa-instagram", url: "https://www.instagram.com/skillivio_?igsh=bWlkcG5oODByZXdx&wa_status_inline=true" }
                            ].map((social, index) => (
                                <a key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-icon-button"
                                    style={{
                                        width: 42,
                                        height: 42,
                                        borderRadius: 10,
                                        background: "rgba(255,255,255,0.05)",
                                        border: `1px solid ${p}`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: p,
                                        fontSize: 18,
                                        textDecoration: "none",
                                        transition: "all 0.3s ease",
                                    }}
                                >
                                    <i className={social.icon}></i>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {[
                        { icon: "🎨", t: "White Label Branding", d: "Custom domain, logo & colours" },
                        { icon: "📋", t: "QCTO Compliance", d: "NQF, credits, PoE & SETA reporting" },
                        { icon: "📊", t: "Advanced Analytics", d: "Learner progress & assessment reports" },
                        { icon: "🏆", t: "Digital Certificates", d: "Verifiable with proof links" },
                        { icon: "🤖", t: "AI Course Builder", d: "Generate outlines & quizzes" },
                        { icon: "⚡", t: "PayShap & EFT", d: "Instant PayShap + EFT — zero transaction fees" },
                    ].map(function (f) {
                        return (
                            <div key={f.t} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "18px" }}>
                                <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
                                <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{f.t}</div>
                                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{f.d}</div>
                            </div>
                        );
                    })}
                </div>
            </div>





            <div style={{ padding: "48px", background: "rgba(0,0,0,0.2)", textAlign: "center" }}>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>© 2026 Skillivio Digital Learning Solutions • QCTO-Aligned • BBBEE Compliant • 🇿🇦 Proudly South African</div>
            </div>
        </div>
    );
}
export default LandingPage;