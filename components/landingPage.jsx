import { GLOBAL_CSS } from '../app/globalCss';
import { TENANTS } from "../app/mockData";
import Toast from './toast';


function LandingPage({ ...props }) {
    // var p = props.p, s = props.s, tenant = props.tenant, setView = props.setView,
    //     currentTenant = props.currentTenant, setCurrentTenant = props.setCurrentTenant,
    //     notification = props.notification, css = props.css;

    const { p, s, tenant, setView, currentTenant, setCurrentTenant, notification, css } = props;


    return (
        <div style={{ minHeight: "100vh", background: s, fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
            <Toast notification={notification} />
            <style>{GLOBAL_CSS}</style>
            <nav style={{ padding: "18px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 38, height: 38, background: p, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 16 }}>{tenant.logo}</div>
                    <div>
                        <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>{tenant.name}</div>
                        <div style={{ color: p, fontSize: 11 }}>{tenant.tagline}</div>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <select onChange={function (e) { setCurrentTenant(e.target.value); }} value={currentTenant}
                        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 8, padding: "7px 12px", fontSize: 12, cursor: "pointer", outline: "none" }}>
                        {Object.entries(TENANTS).map(function (pair) { return <option key={pair[0]} value={pair[0]} style={{ background: "#333" }}>{pair[1].name}</option>; })}
                    </select>
                    <button onClick={function () { setView("login"); }} style={css.btn(p)}>Log In</button>
                </div>
            </nav>
            <div style={{ padding: "80px 48px 60px", display: "flex", alignItems: "center", gap: 60, maxWidth: 1200, margin: "0 auto" }}>
                <div style={{ flex: 1, animation: "fadeIn 0.6s ease" }}>
                    <div style={{ background: p + "22", color: p, borderRadius: 100, padding: "6px 16px", fontSize: 12, fontWeight: 700, display: "inline-block", marginBottom: 20, border: "1px solid " + p + "40" }}>🎓 QCTO-Aligned White Label LMS</div>
                    <h1 style={{ fontSize: 52, fontWeight: 900, color: "#fff", lineHeight: 1.05, margin: "0 0 20px" }}>Your Brand.<br /><span style={{ color: p }}>Your Platform.</span><br />QCTO Ready.</h1>
                    <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 17, lineHeight: 1.7, maxWidth: 500, margin: "0 0 36px" }}>A fully managed LMS delivered under your brand — configured for QCTO compliance from day one. Learner analytics, assessments, PoE and SETA exports included.</p>
                    <div style={{ display: "flex", gap: 14 }}>
                        <button onClick={function () { setView("login"); }} style={{ ...css.btn(p), padding: "14px 28px", fontSize: 16 }}>Launch Platform →</button>
                    </div>
                    <div style={{ display: "flex", gap: 32, marginTop: 48}}>
                        {[["500+", "SDPs Trust Us"], ["50K+", "Learners Served"], ["QCTO", "Aligned"]].map(function (pair) {
                            return <div key={pair[1]}><div style={{ fontSize: 22, fontWeight: 900, color: p }}>{pair[0]}</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{pair[1]}</div></div>;
                        })}
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