import { useState } from "react";
import { GLOBAL_CSS } from "../app/globalCss";
import Toast from "./Toast";

function CertificateView({ ...props }) {
    // var css = props.css, p = props.p, s = props.s, tenant = props.tenant,
    //     activeCourse = props.activeCourse, notification = props.notification,
    //     notify = props.notify, setView = props.setView;


    const { css, p, s, tenant, activeCourse, notification, notify, setView } = props;

    const [randomId,setRandomId] = useState(() => Math.floor(Math.random() * 9000 + 1000))
    return (
        <div style={{ minHeight: "100vh", background: "#f0f2f5", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
            <Toast notification={notification} />
            <style>{GLOBAL_CSS}</style>
            <div style={{ background: s, padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ color: "#fff", fontWeight: 700 }}>Certificate of Completion</span>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={function () { notify("PDF downloaded!"); }} style={css.btn(p, "#fff", true)}>⬇ PDF</button>
                    <button onClick={function () { notify("Shared to LinkedIn!"); }} style={css.btn("#0A66C2", "#fff", true)}>in LinkedIn</button>
                    <button onClick={function () { setView("course"); }} style={css.btnOut("rgba(255,255,255,0.5)", true)}>← Back</button>
                </div>
            </div>
            <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px", animation: "fadeIn 0.5s ease" }}>
                <div style={{ background: "#fff", borderRadius: 2, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
                    <div style={{ background: p, padding: "8px 0", textAlign: "center" }}><span style={{ color: "#fff", fontWeight: 700, fontSize: 12, letterSpacing: 3 }}>CERTIFICATE OF ACHIEVEMENT</span></div>
                    <div style={{ padding: "48px 60px", textAlign: "center" }}>
                        <div style={{ fontSize: 13, color: "#94a3b8", letterSpacing: 2, marginBottom: 4 }}>THIS IS TO CERTIFY THAT</div>
                        <div style={{ fontSize: 38, fontWeight: 900, color: "#0f172a", margin: "12px 0" }}>Thabo Nkosi</div>
                        <div style={{ width: 120, height: 2, background: p, margin: "0 auto 20px" }} />
                        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>has successfully completed</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: p, margin: "10px 0 4px" }}>{activeCourse ? activeCourse.title : "Financial Accounting Principles"}</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 24 }}>NQF Level {activeCourse ? activeCourse.nqf : 5} • {activeCourse ? activeCourse.credits : 18} Credits • Score: 88%</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 40, paddingTop: 20, borderTop: "1px solid #f1f5f9" }}>
                            <div style={{ textAlign: "center" }}><div style={{ fontSize: 13, fontWeight: 700 }}>{new Date().toLocaleDateString("en-ZA")}</div><div style={{ fontSize: 11, color: "#94a3b8" }}>Date Issued</div></div>
                            <div style={{ textAlign: "center" }}><div style={{ width: 40, height: 40, background: p, borderRadius: 8, margin: "0 auto 4px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900 }}>{tenant.logo}</div><div style={{ fontSize: 11, color: "#94a3b8" }}>{tenant.name}</div></div>
                            <div style={{ textAlign: "center" }}><div style={{ fontSize: 13, fontWeight: 700 }}>Dr. S. Dlamini</div><div style={{ fontSize: 11, color: "#94a3b8" }}>Programme Director</div></div>
                        </div>
                    </div>
                    <div style={{ background: "#f8fafc", padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 10, color: "#94a3b8" }}>CERT-{tenant.slug.toUpperCase()}-2026-{randomId}</span>
                        <span style={{ fontSize: 10, color: p, cursor: "pointer" }} onClick={function () { notify("Verification link copied!"); }}>🔗 Verify Certificate</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CertificateView;