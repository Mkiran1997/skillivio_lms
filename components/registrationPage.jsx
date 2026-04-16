import { useEffect, useState } from "react";
import { GLOBAL_CSS } from "@/utils/globalCss";
import { useDispatch, useSelector } from "react-redux";

function RegisterPage({ ...props }) {
    const {
        onBack,
        tenant,
        p,
        s,
        currentTenant,
        setView,
        notify
    } = props;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState("");

    const dispatch = useDispatch();
    const { User } = useSelector(state => state.user);

    useEffect(() => {}, [dispatch]);

    async function attempt() {
        if (!name || !email || !pw) {
            setErr("Please fill all fields.");
            return;
        }

        setLoading(true);
        setErr("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    password: pw,
                    tenantId: tenant?._id,
                })
            });

            let data;
            try {
                data = await res.json();
            } catch {
                throw new Error("Invalid server response");
            }

            if (!res.ok) {
                setErr(data?.error || "Registration failed.");
                setLoading(false);
                return;
            }

            notify("Welcome, " + name.split(" ")[0] + "!");
            setView("login");

        } catch (error) {
            console.error("Frontend Error:", error);
            setErr("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    function iStyle(f) {
        return {
            border: "1.5px solid " + (focused === f ? p : err ? "#FCA5A5" : "#e2e8f0"),
            borderRadius: 10,
            padding: "12px 14px",
            fontSize: 14,
            width: "100%",
            outline: "none",
            fontFamily: "inherit",
            background: "#fff",
            transition: "border-color 0.2s",
            boxSizing: "border-box"
        };
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: s,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Segoe UI',system-ui,sans-serif",
            padding: 20
        }}>
            <style>{GLOBAL_CSS}</style>

            <div style={{ width: "100%", maxWidth: 420 }}>

                {/* Header SAME AS LOGIN */}
                <div style={{ textAlign: "center", marginBottom: 24, animation: "fadeIn 0.4s ease" }}>
                    {
                        currentTenant === "skillivio"
                            ? <img src="/logo/skillivioLogo.jpeg" alt="logo" style={{
                                width: 64, height: 64, borderRadius: 18,
                                margin: "0 auto 14px",
                                boxShadow: "0 8px 24px " + p + "44"
                            }} />
                            : <img src={tenant?.logo} alt="logo" style={{
                                width: 64, height: 64, borderRadius: 18,
                                margin: "0 auto 14px",
                                boxShadow: "0 8px 24px " + p + "44"
                            }} />
                    }

                    <div style={{ color: "#fff", fontWeight: 800, fontSize: 22 }}>
                        {tenant?.name}
                    </div>
                    <div style={{ color: p, fontSize: 12, marginTop: 3 }}>
                        {tenant?.tagline}
                    </div>
                </div>

                {/* Card */}
                <div style={{
                    background: "#fff",
                    borderRadius: 18,
                    padding: "32px 28px",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
                    animation: "fadeIn 0.5s ease 0.1s both"
                }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>
                        Create account
                    </h2>
                    <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 24px" }}>
                        Sign up to get started
                    </p>

                    {/* Name */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6, display: "block" }}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            placeholder="John Doe"
                            onChange={(e) => { setName(e.target.value); setErr(""); }}
                            onFocus={() => setFocused("name")}
                            onBlur={() => setFocused("")}
                            onKeyDown={(e) => e.key === "Enter" && attempt()}
                            style={iStyle("name")}
                        />
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6, display: "block" }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            placeholder="you@example.com"
                            onChange={(e) => { setEmail(e.target.value); setErr(""); }}
                            onFocus={() => setFocused("email")}
                            onBlur={() => setFocused("")}
                            onKeyDown={(e) => e.key === "Enter" && attempt()}
                            style={iStyle("email")}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: 8 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6, display: "block" }}>
                            Password
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPw ? "text" : "password"}
                                value={pw}
                                placeholder="Enter your password"
                                onChange={(e) => { setPw(e.target.value); setErr(""); }}
                                onFocus={() => setFocused("pw")}
                                onBlur={() => setFocused("")}
                                onKeyDown={(e) => e.key === "Enter" && attempt()}
                                style={{ ...iStyle("pw"), paddingRight: 44 }}
                            />
                            <button
                                onClick={() => setShowPw(!showPw)}
                                style={{
                                    position: "absolute",
                                    right: 12,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: 16,
                                    color: "#94a3b8"
                                }}
                            >
                                {showPw ? "🙈" : "👁"}
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {err && (
                        <div style={{
                            background: "#FEF2F2",
                            border: "1px solid #FECACA",
                            borderRadius: 8,
                            padding: "10px 14px",
                            marginBottom: 16,
                            fontSize: 13,
                            color: "#DC2626",
                            fontWeight: 500,
                            animation: "shake 0.4s ease"
                        }}>
                            ⚠ {err}
                        </div>
                    )}

                    {/* Button */}
                    <button
                        onClick={attempt}
                        disabled={loading}
                        style={{
                            background: loading ? "#94a3b8" : p,
                            color: "#fff",
                            border: "none",
                            borderRadius: 10,
                            padding: 13,
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: loading ? "not-allowed" : "pointer",
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            transition: "background 0.2s"
                        }}
                    >
                        {loading
                            ? <>
                                <span style={{
                                    display: "inline-block",
                                    width: 16,
                                    height: 16,
                                    border: "2px solid rgba(255,255,255,0.3)",
                                    borderTopColor: "#fff",
                                    borderRadius: "50%",
                                    animation: "spin 0.7s linear infinite"
                                }} />
                                Creating...
                              </>
                            : "Create Account →"}
                    </button>

                    {/* Login Link */}
                    <div style={{ marginTop: 16, textAlign: "center" }}>
                        <span style={{ fontSize: 13, color: "#64748b" }}>
                            Already have an account?{" "}
                            <span
                                onClick={() => setView("login")}
                                style={{
                                    color: p,
                                    fontWeight: 700,
                                    cursor: "pointer"
                                }}
                            >
                                Sign in
                            </span>
                        </span>
                    </div>
                </div>

                {/* Back */}
                <button
                    onClick={onBack}
                    style={{
                        display: "block",
                        margin: "16px auto 0",
                        background: "none",
                        border: "none",
                        color: "rgba(255,255,255,0.45)",
                        fontSize: 13,
                        cursor: "pointer",
                        padding: "8px 16px"
                    }}
                >
                    ← Back to Landing
                </button>

            </div>
        </div>
    );
}

export default RegisterPage;