import { useEffect, useState } from "react";
import { getUser } from "../app/utility";
import { GLOBAL_CSS } from "../app/globalCss";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "@/store/slices/authSlice";
import { current } from "@reduxjs/toolkit";


function LoginPage({ ...props }) {
    var onLogin = props.onLogin, onBack = props.onBack, tenant = props.tenant, p = props.p, s = props.s, currentTenant = props.currentTenant;
    var [email, setEmail] = useState("");
    var [pw, setPw] = useState("");
    var [showPw, setShowPw] = useState(false);
    var [err, setErr] = useState("");
    var [loading, setLoading] = useState(false);
    var [focused, setFocused] = useState("");

    const { User } = useSelector(state => state.user);
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch])

    function attempt() {
        if (!email || !pw) { setErr("Please enter your email and password."); return; }
        setLoading(true); setErr("");
        setTimeout(function () {
            var user = getUser(User, email, pw);
            if (user) { onLogin(user); }
            else { setErr("Incorrect email or password. Please try again."); setLoading(false); }
        }, 600);
    }
    var demos = currentTenant === "skillivio" ? [
        { label: "👤 Learner", e: "thabo@example.co.za", pw: "Learner@123", c: "#10B981" },
        { label: "🛡 Admin", e: "admin@skillivio.co.za", pw: "Admin@2026!", c: p },
        { label: "⚡ Super Admin", e: "super@skillivio.com", pw: "Super@Admin1", c: "#F59E0B" },
    ] : currentTenant==="acme"? [
        { label: "👤 Learner", e: "nomsa@example.co.za", pw: "nomsa!789", c: "#10B981" },
        { label: "🛡 Admin", e: "admin@acme.co.za", pw: "Acme@2026!", c: p },
        // { label: "⚡ Super Admin", e: "super@skillivio.com", pw: "Super@Admin1", c: "#F59E0B" },
    ]:[
        { label: "👤 Learner", e: "ayanda@example.co.za", pw: "Ayanda!456", c: "#10B981" },
        { label: "🛡 Admin", e: "admin@techpro.co.za", pw: "TechPro!456", c: p },
        // { label: "⚡ Super Admin", e: "super@skillivio.com", pw: "Super@Admin1", c: "#F59E0B" },
    ];
    const demosToShow = demos.filter((d, index) => {
        if (index === demos.length - 1 && tenant.name !== "Skillivio Demo") return false;
        return true;
    });

    function iStyle(f) {
        return {
            border: "1.5px solid " + (focused === f ? p : err ? "#FCA5A5" : "#e2e8f0"),
            borderRadius: 10, padding: "12px 14px", fontSize: 14, width: "100%", outline: "none",
            fontFamily: "inherit", background: "#fff", transition: "border-color 0.2s", boxSizing: "border-box"
        };
    }

    return (
        <div style={{
            minHeight: "100vh", background: s, display: "flex", alignItems: "center",
            justifyContent: "center", fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 20
        }}>
            <style>{GLOBAL_CSS}</style>
            <div style={{ width: "100%", maxWidth: 420 }}>
                <div style={{ textAlign: "center", marginBottom: 24, animation: "fadeIn 0.4s ease" }}>
                    {
                        currentTenant === "skillivio" ?
                            <img src='/logo/skillivioLogo.jpeg' alt='skillivio' style={{
                                width: 64, height: 64, background: p, borderRadius: 18, display: "flex", alignItems: "center",
                                justifyContent: "center", fontSize: 28, fontWeight: 900, color: "#fff", margin: "0 auto 14px",
                                boxShadow: "0 8px 24px " + p + "44"
                            }} />
                            :

                            <div style={{
                                width: 64, height: 64, background: p, borderRadius: 18, display: "flex", alignItems: "center",
                                justifyContent: "center", fontSize: 28, fontWeight: 900, color: "#fff", margin: "0 auto 14px",
                                boxShadow: "0 8px 24px " + p + "44"
                            }}>{tenant.logo}</div>
                    }
                    <div style={{ color: "#fff", fontWeight: 800, fontSize: 22 }}>{tenant.name}</div>
                    <div style={{ color: p, fontSize: 12, marginTop: 3 }}>{tenant.tagline}</div>
                </div>
                <div style={{
                    background: "#fff", borderRadius: 18, padding: "32px 28px",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.18)", animation: "fadeIn 0.5s ease 0.1s both"
                }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>Welcome back</h2>
                    <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 24px" }}>Sign in to your account to continue</p>
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6, display: "block" }}>Email Address</label>
                        <input type="email" value={email} placeholder="you@example.co.za"
                            onChange={function (e) { setEmail(e.target.value); setErr(""); }}
                            onFocus={function () { setFocused("email"); }} onBlur={function () { setFocused(""); }}
                            onKeyDown={function (e) { if (e.key === "Enter") attempt(); }}
                            style={iStyle("email")} />
                    </div>
                    <div style={{ marginBottom: 8 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6, display: "block" }}>Password</label>
                        <div style={{ position: "relative" }}>
                            <input type={showPw ? "text" : "password"} value={pw} placeholder="Enter your password"
                                onChange={function (e) { setPw(e.target.value); setErr(""); }}
                                onFocus={function () { setFocused("pw"); }} onBlur={function () { setFocused(""); }}
                                onKeyDown={function (e) { if (e.key === "Enter") attempt(); }}
                                style={{ ...iStyle("pw"), paddingRight: 44 }} />
                            <button onClick={function () { setShowPw(!showPw); }}
                                style={{
                                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                                    background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#94a3b8"
                                }}>
                                {showPw ? "🙈" : "👁"}
                            </button>
                        </div>
                    </div>
                    <div style={{ textAlign: "right", marginBottom: 20 }}>
                        <span style={{ fontSize: 12, color: p, cursor: "pointer", fontWeight: 600 }}
                            onClick={function () { setErr("Password reset email sent!"); }}>Forgot password?</span>
                    </div>
                    {err && <div style={{
                        background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8,
                        padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#DC2626", fontWeight: 500,
                        animation: "shake 0.4s ease"
                    }}>⚠ {err}</div>}
                    <button onClick={attempt} disabled={loading}
                        style={{
                            background: loading ? "#94a3b8" : p, color: "#fff", border: "none", borderRadius: 10,
                            padding: 13, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            transition: "background 0.2s"
                        }}>
                        {loading
                            ? <><span style={{
                                display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)",
                                borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite"
                            }} /> Signing in…</>
                            : "Sign In →"}
                    </button>
                    <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #f1f5f9" }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textAlign: "center", marginBottom: 10, letterSpacing: .5 }}>
                            DEMO ACCOUNTS — CLICK TO FILL
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 8 }}>
                            {demos.map(function (d) {
                                return (
                                    <button key={d.label} onClick={function () { setEmail(d.e); setPw(d.pw); setErr(""); }}
                                        style={{
                                            background: d.c + "10", border: "1.5px solid " + d.c + "30", borderRadius: 8,
                                            padding: "8px 6px", fontSize: 11, fontWeight: 700, color: d.c, cursor: "pointer", textAlign: "center", width: "100%"
                                        }}>
                                        {d.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <button onClick={onBack}
                    style={{
                        display: "block", margin: "16px auto 0", background: "none", border: "none",
                        color: "rgba(255,255,255,0.45)", fontSize: 13, cursor: "pointer", padding: "8px 16px"
                    }}>
                    ← Back to Landing
                </button>
            </div>
        </div>
    );
}
export default LoginPage;