import { useEffect, useState } from "react";
import { TIER_DATA } from "@/utils/mockData";
import { GLOBAL_CSS } from "@/utils/globalCss";
import Toast from "./toast";
import StatCard from "./statCard";
import TierDemoView from "./tierDemoView";
import NewTenantForm from "./newTenantForm";
import { useDispatch, useSelector } from "react-redux";
import { createtenants, fetchtenants, updatetenants, } from "@/store/slices/tenantSlice";
import EditTenantForm from "./editTenantForm";
import { fetchEnrollment } from "@/store/slices/enrollmentSlice";


function SkillivioSuperAdmin({ ...props }) {
    var p = props.p, s = props.s, a = props.a, css = props.css,
        notify = props.notify, notification = props.notification,
        currentUser = props.currentUser, logout = props.logout,
        courses = props.courses, setCurrentTenant = props.setCurrentTenant,
        setView = props.setView, setUserRole = props.setUserRole;

    const { setCohorts, setShowCohortForm, newCohort, setNewCohort, showCohortForm, cohorts, } = props

    var SKP = "#2FBF71";
    var SKS = "#2E3044";

    const { tenants } = useSelector(state => state.tenants);
    const { Enrollment } = useSelector(state => state.enrollment);
    const dispatch = useDispatch();


    var [tab, setTab] = useState("tenants");
    var [Tenants, setTenants] = useState(tenants);
    var [sendingInvoice, setSendingInvoice] = useState(null);
    var [showForm, setShowForm] = useState(false);
    var [demoTier, setDemoTier] = useState(null);
    const [editingTenant, setEditingTenant] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);


    // var tenantList = Object.values(tenants);
    var totalMRR = tenants?.filter(function (t) { return t.status === "active"; }).reduce(function (s, t) { return s + t.mrr; }, 0);
    var totalLrn = Enrollment?.filter((enrol) => enrol._id).length;
    var active = tenants?.filter(function (t) { return t.status === "active"; }).length;
    var pending = tenants?.filter(function (t) { return t.status === "pending"; }).length;

    var tierColor = { foundation: "#10B981", professional: "#7C3AED", enterprise: "#0EA5E9" };

    useEffect(() => {
        dispatch(fetchtenants())
        dispatch(fetchEnrollment());
    }, [dispatch])

    function handleNewTenant(form) {
        const id = "t" + Date.now();

        const newTenant = {
            // Basic info
            id,                               // unique ID
            name: form.name,
            slug: form.slug,
            primary: form.primary || "#000000",     // fallback if not provided
            secondary: form.secondary || "#ffffff",
            accent: form.accent || "#10B981",
            logo: form.logo || "",
            tagline: form.tagline || "",

            // General settings
            general: {
                supportEmail: form.supportEmail || "support@example.com",
                timeZone: form.timeZone || "UTC",
                currency: form.currency || "ZAR"
            },

            // QCTO configuration
            QCTOConfig: {
                accreditationNumber: form.accreditationNumber || "",
                setaAffiliation: form.setaAffiliation || "OTHER",
                qctoAudit: form.qctoAudit ?? true,
                autoGenerateQCTO: form.autoGenerateQCTO ?? true
            },

            // Tenant business info
            tier: form.tier,
            contact: form.contact,
            domain: form.domain || `${form.slug}.skillivio.com`,
            email: form.email,
            learners: 0,   // start with zero learners
            mrr: TIER_DATA[form.tier]
                ? Number(TIER_DATA[form.tier].monthly.replace(/[^0-9]/g, ""))
                : 1490,
            color: form.color,
            phone: form.phone || "",
            qctoNo: form.qctoNo || "",
            seta: form.seta || "",
            status: "pending",
            setupDate: new Date().toISOString().split("T")[0]
        };

        // Dispatch the action with the tenant payload
        dispatch(createtenants(newTenant));

        setShowForm(false);
        notify(`Tenant "${form.name}" created! Onboarding email sent.`);
    }

    function activate(id) {
        setTenants(function (prev) { var n = { ...prev }; n[id] = { ...n[id], status: "Active" }; return n; });
        notify("Tenant activated and platform configured!");
    }

    var SB_ITEMS = [
        { id: "tenants", icon: "🏢", label: "Tenants", badge: tenants.filter(tenant => tenant.slug !== "skillivio")?.length },
        { id: "tiers", icon: "📦", label: "Tier" },
        { id: "analytics", icon: "📊", label: "Global Analytics" },
        { id: "billing", icon: "💳", label: "Billing" },
        { id: "platform", icon: "⚙️", label: "Platform" },
        { id: "cohorts", icon: "🏷", label: "Groups & Cohorts" },
        { id: "support", icon: "🎧", label: "Support" },
    ];

    function renderInvoiceModal() {
        var t = sendingInvoice;
        var invNo = "SKIL-INV-" + new Date().getFullYear() + "-" + String(Math.floor(Math.random() * 9000) + 1000);
        var issueDate = new Date().toLocaleDateString("en-ZA");
        var dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString("en-ZA");
        var tierLabels = { foundation: "foundation", professional: "professional", enterprise: "enterprise" };
        var tierAmts = { foundation: 1490, professional: 2990, enterprise: 5490 };
        var monthly = tierAmts[t.tier] || 1490;
        var vat = Math.round(monthly * 0.15);
        var total = monthly + vat;
        return (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 2000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px", overflowY: "auto" }}>
                <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 680, boxShadow: "0 40px 100px rgba(0,0,0,0.3)", marginBottom: 24 }}>

                    {/* Invoice header */}
                    <div style={{ background: "#2E3044", borderRadius: "16px 16px 0 0", padding: "28px 36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <div style={{ color: "#2FBF71", fontWeight: 900, fontSize: 22, letterSpacing: -0.5 }}>SKILLIVIO</div>
                            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 2 }}>Digital Learning Solutions (Pty) Ltd</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>TAX INVOICE</div>
                            <div style={{ color: "#2FBF71", fontWeight: 700, fontSize: 14, marginTop: 2 }}>{invNo}</div>
                        </div>
                    </div>

                    <div style={{ padding: "28px 36px" }}>

                        {/* Parties */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                            <div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", marginBottom: 8, letterSpacing: 1 }}>FROM</div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Skillivio Digital Learning Solutions (Pty) Ltd</div>
                                <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7, marginTop: 4 }}>
                                    [Company Registration No.]<br />
                                    [Physical Address], South Africa<br />
                                    info@skillivio.co.za<br />
                                    VAT No: [Insert VAT No.]
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", marginBottom: 8, letterSpacing: 1 }}>BILL TO</div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{t.name}</div>
                                <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7, marginTop: 4 }}>
                                    Attn: {t.contact}<br />
                                    {t.email}<br />
                                    {t.domain}
                                </div>
                            </div>
                        </div>

                        {/* Invoice details row */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
                            {[["Invoice No.", invNo], ["Issue Date", issueDate], ["Due Date", dueDate]].map(function (pair) {
                                return (
                                    <div key={pair[0]} style={{ background: "#f8fafc", borderRadius: 8, padding: "12px 14px" }}>
                                        <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, marginBottom: 3 }}>{pair[0].toUpperCase()}</div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{pair[1]}</div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Line items */}
                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
                            <thead>
                                <tr style={{ background: "#f8fafc" }}>
                                    {["Description", "Period", "Unit Price", "Qty", "Amount"].map(function (h) {
                                        return <th key={h} style={{ padding: "10px 12px", fontSize: 11, fontWeight: 700, color: "#64748b", textAlign: h === "Amount" || h === "Unit Price" || h === "Qty" ? "right" : "left", borderBottom: "2px solid #e2e8f0" }}>{h}</th>;
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <td style={{ padding: "12px", fontSize: 13, color: "#0f172a" }}>Skillivio LMS — {tierLabels[t.tier]} Plan<div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Monthly platform licence · {t.slug}.skillivio.com</div></td>
                                    <td style={{ padding: "12px", fontSize: 13, color: "#475569", whiteSpace: "nowrap" }}>{new Date().toLocaleString("en-ZA", { month: "long", year: "numeric" })}</td>
                                    <td style={{ padding: "12px", fontSize: 13, color: "#0f172a", textAlign: "right" }}>R{monthly.toLocaleString()}</td>
                                    <td style={{ padding: "12px", fontSize: 13, color: "#0f172a", textAlign: "right" }}>1</td>
                                    <td style={{ padding: "12px", fontSize: 13, fontWeight: 600, color: "#0f172a", textAlign: "right" }}>R{monthly.toLocaleString()}</td>
                                </tr>
                                <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                                    <td style={{ padding: "12px", fontSize: 12, color: "#64748b" }}>VAT (15%)</td>
                                    <td /><td /><td />
                                    <td style={{ padding: "12px", fontSize: 12, color: "#64748b", textAlign: "right" }}>R{vat.toLocaleString()}</td>
                                </tr>
                                <tr style={{ background: "#2E3044" }}>
                                    <td colSpan={4} style={{ padding: "12px", fontSize: 14, fontWeight: 700, color: "#fff" }}>TOTAL DUE</td>
                                    <td style={{ padding: "12px", fontSize: 16, fontWeight: 900, color: "#2FBF71", textAlign: "right" }}>R{total.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Payment details */}
                        <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "16px 18px", border: "1px solid #86efac", marginBottom: 20 }}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: "#166534", marginBottom: 10 }}>Payment Details</div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                {[["Bank", "First National Bank (FNB)"], ["Account Name", "Skillivio Digital Learning Solutions (Pty) Ltd"], ["Account No", "62 0000 0000"], ["Branch Code", "250655"], /*["PayShap ID", "@skillivio"],*/["Reference", t.slug + "-" + new Date().getFullYear() + "-" + (new Date().getMonth() + 1)]].map(function (pair) {
                                    return (
                                        <div key={pair[0]} style={{ fontSize: 12 }}>
                                            <span style={{ color: "#64748b" }}>{pair[0]}: </span>
                                            <span style={{ fontWeight: 600, color: "#0f172a" }}>{pair[1]}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.7, marginBottom: 20 }}>Payment is due within 14 days of invoice date. Late payment attracts interest at prime + 2% per annum. This is a system-generated tax invoice. For queries contact finance@skillivio.co.za.</div>

                        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                            <button onClick={function () { setSendingInvoice(null); }} style={{ background: "transparent", color: "#64748b", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "10px 20px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                            <button onClick={function () { notify("📄 Invoice " + invNo + " downloaded as PDF."); }} style={{ background: "#f1f5f9", color: "#0f172a", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, cursor: "pointer" }}>⬇ Download PDF</button>
                            <button onClick={function () { notify("✅ Invoice " + invNo + " emailed to " + t.email); setSendingInvoice(null); }} style={{ background: "#2FBF71", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, cursor: "pointer" }}>📧 Send to Client</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
            <style>{GLOBAL_CSS}</style>
            {demoTier && <TierDemoView tier={TIER_DATA[demoTier]} onClose={function () { setDemoTier(null); }} />}
            {showForm && <NewTenantForm onSave={handleNewTenant} onCancel={function () { setShowForm(false); }} />}
            {showEditForm && editingTenant && (
                <EditTenantForm
                    tenant={editingTenant}
                    onCancel={() => setShowEditForm(false)}
                    onSave={(updatedTenant) => {
                        dispatch(updatetenants({ id: updatedTenant.id, updatedData: updatedTenant }))// Redux action to update tenant
                        setShowEditForm(false);
                        notify(`Tenant "${updatedTenant.name}" updated successfully!`);
                    }}
                />
            )}

            {/* ── Automated Invoice Modal ── */}
            {sendingInvoice && renderInvoiceModal()}

            {/* Custom Skillivio sidebar */}
            <div style={{ width: 240, background: SKS, minHeight: "100vh", display: "flex", flexDirection: "column", flexShrink: 0 }}>
                <Toast notification={notification} />
                <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

                        <img src='/logo/skillivioLogo.jpeg' alt='skillivio' style={{
                            width: 34, height: 34, background: p, borderRadius: 9, display: "flex", alignItems: "center",
                            justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#fff"
                        }} />


                        {/* <div style={{ width: 38, height: 38, background: SKP, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#fff" }}>S</div> */}
                        <div>
                            <div style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>Skillivio</div>
                            <div style={{ color: SKP, fontSize: 10, fontWeight: 600 }}>SUPER ADMIN</div>
                        </div>
                    </div>
                </div>
                <nav style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
                    {SB_ITEMS.map(function (item) {
                        return (
                            <button key={item.id} onClick={function () { setTab(item.id); }}
                                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer", textAlign: "left", marginBottom: 2, background: tab === item.id ? (SKP + "22") : "transparent", color: tab === item.id ? SKP : "rgba(255,255,255,0.65)", fontWeight: tab === item.id ? 700 : 400, fontSize: 13 }}>
                                <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{item.icon}</span>
                                {item.label}
                                {item.badge !== undefined && <span style={{ marginLeft: "auto", background: SKP, color: "#fff", borderRadius: 100, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>{item.badge}</span>}
                            </button>
                        );
                    })}
                </nav>
                <div style={{ padding: "14px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ background: SKP + "15", border: "1px solid " + SKP + "30", borderRadius: 8, padding: "8px 12px", marginBottom: 12 }}>
                        <div style={{ color: SKP, fontSize: 10, fontWeight: 700, letterSpacing: .5 }}>🔒 RESTRICTED</div>
                        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 2 }}>Skillivio staff only</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: SKP, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>SA</div>
                        <div><div style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>Super Admin</div><div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>super@skillivio.com</div></div>
                    </div>
                    <button onClick={logout} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", borderRadius: 8, width: "100%", padding: "8px", fontSize: 12, cursor: "pointer" }}>Sign Out</button>
                </div>
            </div>

            <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", background: "#f0f2f5" }}>

                {tab === "tenants" && (
                    <div className="fade">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                            <div>
                                <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: 0 }}>Tenant Management</h1>
                                <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>All SDP clients on the Skillivio platform</p>
                            </div>
                            <button onClick={function () { setShowForm(true); }} style={{ background: SKP, color: "#fff", border: "none", borderRadius: 8, padding: "11px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>➕ Add New Tenant</button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                            <StatCard icon="🏢" value={active} label="Active Tenants" color={SKP} />
                            <StatCard icon="👥" value={totalLrn?.toLocaleString()} label="Total Learners" color="#6366F1" />
                            <StatCard icon="💰" value={"R" + totalMRR?.toLocaleString()} label="Monthly Revenue" color="#10B981" />
                            <StatCard icon="⏳" value={pending || 0} label="Pending Onboarding" color="#F59E0B" />
                        </div>
                        <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead><tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                                    {["Client", "Tier", "Domain", "Contact", "Learners", "MRR", "Status", "Actions"].map(function (h) {
                                        return <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 12, color: "#64748b", fontWeight: 600 }}>{h}</th>;
                                    })}
                                </tr></thead>
                                <tbody>
                                    {tenants.filter((t) => t.slug !== "skillivio").map(function (t) {
                                        return (
                                            <tr key={t.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                                                <td style={{ padding: "12px" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        {/* <div style={{ width: 34, height: 34, background: t.color, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 14 }}>{t.logo}</div> */}
                                                        <div
                                                            style={{
                                                                width: 34,
                                                                height: 34,
                                                                background: t.color || "#ccc",
                                                                borderRadius: 8,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                color: "#fff",
                                                                fontWeight: 900,
                                                                fontSize: 14,
                                                                overflow: "hidden"
                                                            }}
                                                        >
                                                            {t.logo && t.logo.startsWith("data:") ? (
                                                                // If logo is a base64/image URL
                                                                <img
                                                                    src={t.logo}
                                                                    alt={t.name}
                                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                                />
                                                            ) : t.logo ? (
                                                                // If logo is a single letter
                                                                t.logo
                                                            ) : (
                                                                // Fallback
                                                                t.name.charAt(0).toUpperCase()
                                                            )}
                                                        </div>
                                                        <div><div style={{ fontWeight: 700, fontSize: 13 }}>{t.name}</div><div style={{ fontSize: 10, color: "#94a3b8" }}>{t.slug}.skillivio.com</div></div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: "12px" }}><span style={{ background: tierColor[t.tier] + "15", color: tierColor[t.tier], borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 700, textTransform: "capitalize" }}>{TIER_DATA[t.tier] && TIER_DATA[t.tier].emoji} {t.tier}</span></td>
                                                <td style={{ padding: "12px", fontSize: 12, color: "#64748b" }}>{t.domain}</td>
                                                <td style={{ padding: "12px" }}><div style={{ fontSize: 12, fontWeight: 600 }}>{t.contact}</div><div style={{ fontSize: 10, color: "#94a3b8" }}>{t.email}</div></td>
                                                <td style={{ padding: "12px", fontSize: 13, fontWeight: 600 }}>{t?.learners?.toLocaleString()}</td>
                                                <td style={{ padding: "12px", fontSize: 13, fontWeight: 700, color: "#10B981" }}>R{t?.mrr?.toLocaleString()}/mo</td>
                                                <td style={{ padding: "12px" }}><span style={{ background: t.status === "Active" ? "#10B98118" : "#FEF3C7", color: t.status === "Active" ? "#10B981" : "#92400E", borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{t.status}</span></td>
                                                <td style={{ padding: "12px" }}>
                                                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                                        {t.status === "active" && <button onClick={function () { setCurrentTenant(t.slug); setView("admin"); setUserRole("TENANT_ADMIN"); notify("Viewing " + t.name); }} style={{ background: SKP, color: "#fff", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>View</button>}
                                                        {t.status === "pending" && <button onClick={function () { activate(t.id); }} style={{ background: "#10B981", color: "#fff", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>✓ Activate</button>}
                                                        <button onClick={function () { setEditingTenant(t); setShowEditForm(true); notify("Editing " + t.name); }} style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 6, padding: "6px 10px", fontSize: 11, cursor: "pointer" }}>Edit</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {tab === "tiers" && (
                    <div className="fade">
                        <div style={{ marginBottom: 24 }}>
                            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: 0 }}>Tier Demos & Pricing</h1>
                            <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Launch an interactive demo of each tier to show clients exactly what they get — sourced from the Skillivio Business Model.</p>
                        </div>
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
                )}

                {tab === "analytics" && (
                    <div className="fade">
                        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 24px" }}>Global Analytics</h1>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
                            <StatCard icon="🏢" value={active} label="Active Tenants" color={SKP} />
                            <StatCard icon="👥" value={totalLrn.toLocaleString()} label="Total Learners" color="#6366F1" />
                            <StatCard icon="💰" value={"R" + totalMRR.toLocaleString()} label="MRR" color="#10B981" />
                            <StatCard icon="📈" value="98.7%" label="Platform Uptime" color={SKP} />
                        </div>
                        <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Revenue by Tier</h3>
                            {Object.entries({ foundation: 1490, professional: 2990, enterprise: 5490 }).map(function (pair) {
                                var tier = pair[0], rate = pair[1];
                                var count = tenants.filter(function (t) { return t.tier === tier && t.status === "Active"; }).length;
                                var rev = count * rate;
                                return (
                                    <div key={tier} style={{ marginBottom: 14 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                            <span style={{ fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>{TIER_DATA[tier] && TIER_DATA[tier].emoji} {tier} ({count} tenants)</span>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: SKP }}>R{rev.toLocaleString()}/mo</span>
                                        </div>
                                        <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                                            <div style={{ height: "100%", width: totalMRR > 0 ? ((rev / totalMRR) * 100) + "%" : "0%", background: tierColor[tier], borderRadius: 4 }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {tab === "billing" && (
                    <div className="fade">
                        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 24px" }}>Billing & Revenue</h1>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                            <StatCard icon="💰" value={"R" + totalMRR.toLocaleString()} label="Total MRR" color={SKP} />
                            <StatCard icon="📈" value={"R" + (totalMRR * 12).toLocaleString()} label="ARR (Projected)" color="#10B981" />
                            <StatCard icon="🏢" value={active + "/" + tenants.length} label="Active / Total" color="#6366F1" />
                            <StatCard icon="⏳" value={pending || 0} label="Pending EFTs" color="#F59E0B" />
                        </div>

                        {/* ── Skillivio banking details for SDP client billing ── */}
                        <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", marginBottom: 20, border: "2px solid " + SKP + "30" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                <span style={{ fontSize: 22 }}>🏦</span>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>Skillivio Billing Bank Account</div>
                                    <div style={{ fontSize: 12, color: "#64748b" }}>SDP clients pay their monthly retainer to this account via PayShap or EFT</div>
                                </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 14 }}>
                                {[
                                    ["Account Name", "Skillivio Digital Learning Solutions (Pty) Ltd"],
                                    ["Bank", "First National Bank (FNB)"],
                                    ["Account No", "62 0000 0000"],
                                    ["Branch Code", "250655 (Universal)"],
                                    ["Account Type", "Business Cheque"],
                                ].map(function (pair) {
                                    return (
                                        <div key={pair[0]} style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 14px" }}>
                                            <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, marginBottom: 2 }}>{pair[0].toUpperCase()}</div>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{pair[1]}</div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                                {/* <div style={{ background: "#f0f9ff", borderRadius: 8, padding: "12px 16px", border: "1px solid #bae6fd" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                        <span style={{ fontSize: 18 }}>⚡</span>
                                        <span style={{ fontWeight: 700, fontSize: 14, color: "#0369a1" }}>PayShap (Preferred)</span>
                                    </div>
                                    <div style={{ fontSize: 12, color: "#0369a1", lineHeight: 1.7 }}>
                                        Instant real-time clearing. SDP sends monthly retainer from any SA bank using PayShap ID @skillivio with their tenant reference as payment description.
                                    </div>
                                </div> */}
                                <div style={{ background: "#FEF9C3", borderRadius: 8, padding: "12px 16px", border: "1px solid #FDE68A" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                        <span style={{ fontSize: 18 }}>🏦</span>
                                        <span style={{ fontWeight: 700, fontSize: 14, color: "#92400E" }}>EFT (Manual Verification)</span>
                                    </div>
                                    <div style={{ fontSize: 12, color: "#92400E", lineHeight: 1.7 }}>
                                        Standard bank transfer. Reflects in 1–2 business days. SDP must use their slug (e.g. &apos;acme-retainer-march2026&quot;) as reference. Admin verifies and marks paid.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Tenant billing status ── */}
                        <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Tenant Billing Status</h3>
                            {Object.values(tenants).slice(0, 4).map(function (t) {
                                var tierColor = { foundation: "#10B981", professional: "#7C3AED", enterprise: "#0EA5E9" }[t.tier] || "#94a3b8";
                                return (
                                    <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid #f8fafc" }}>
                                        <div style={{ width: 34, height: 34, background: t.color, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 14, flexShrink: 0 }}>{t.name[0]}</div>
                                        <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13 }}>{t.name}</div><div style={{ fontSize: 11, color: "#94a3b8" }}>{t.tier.charAt(0).toUpperCase() + t.tier.slice(1)} · Ref: {t.slug}-retainer</div></div>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: tierColor }}>R{t.mrr.toLocaleString()}/mo</span>
                                        <span style={{ background: "#10B98118", color: "#10B981", borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>Paid</span>
                                        <button onClick={function () { setSendingInvoice(t); }} style={{ background: SKP, color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>🧾 Invoice</button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {tab === "platform" && (
                    <div className="fade">
                        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 24px" }}>Platform Settings</h1>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                            {[{ title: "CDN & DNS", icon: "🌐", desc: "Wildcard DNS *.skillivio.com, auto-SSL via Cloudflare" }, { title: "Email (SendGrid)", icon: "📧", desc: "Transactional email from client domains" }, { title: "Video (Mux)", icon: "🎬", desc: "Adaptive video transcoding per tenant" }, /*{ title: "Payments (PayShap & EFT)", icon: "⚡", desc: "PayShap real-time clearing + EFT bank deposits. Zero transaction fees." },*/ { title: "AI (OpenAI)", icon: "🤖", desc: "Course creator, quiz generator, student chatbot" }, { title: "SCORM Runtime", icon: "📦", desc: "SCORM 1.2 and 2004 package hosting" }].map(function (s) {
                                return (
                                    <div key={s.title} style={{ background: "#fff", borderRadius: 12, padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", gap: 14 }}>
                                        <div style={{ fontSize: 28 }}>{s.icon}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{s.title}</div>
                                            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6, marginBottom: 10 }}>{s.desc}</div>
                                            <button onClick={function () { notify("Opening " + s.title + " config"); }} style={{ background: SKP, color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Configure</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {tab === "cohorts" && (
                    <div className="fade">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <div>
                                <h1 style={css.h1}>Groups & Cohorts</h1>
                                <p style={{ color: "#64748b", fontSize: 14, marginTop: 6 }}>Organise learners by intake, company, or learning group. Each cohort tracks its own progress and reporting.</p>
                            </div>
                            <button onClick={function () { setShowCohortForm(true); }} style={css.btn(p)}>+ New Cohort</button>
                        </div>

                        {/* New cohort form */}
                        {showCohortForm && (
                            <div style={{ ...css.card, marginBottom: 20, border: "2px solid " + p + "30" }}>
                                <h3 style={{ ...css.h3, marginBottom: 16 }}>Create New Cohort / Group</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                                    <div>
                                        <label style={css.label}>Cohort / Group Name <span style={{ color: "#EF4444" }}>*</span></label>
                                        <input style={css.input} value={newCohort.name} placeholder="e.g. Intake 2026-Q1 or ACME Corporate"
                                            onChange={function (e) { var v = e.target.value; setNewCohort(function (n) { return { ...n, name: v }; }); }} />
                                    </div>
                                    <div>
                                        <label style={css.label}>Company / Organisation</label>
                                        <input style={css.input} value={newCohort.company} placeholder="e.g. ABC (Pty) Ltd — or leave blank for internal"
                                            onChange={function (e) { var v = e.target.value; setNewCohort(function (n) { return { ...n, company: v }; }); }} />
                                    </div>
                                    <div>
                                        <label style={css.label}>Linked Course</label>
                                        <select style={css.input} value={newCohort.course}
                                            onChange={function (e) { var v = e.target.value; setNewCohort(function (n) { return { ...n, course: v }; }); }}>
                                            <option value="">— Select course —</option>
                                            {courses.map(function (c) { return <option key={c.id} value={c.title}>{c.title}</option>; })}
                                        </select>
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                        <div>
                                            <label style={css.label}>Start Date</label>
                                            <input style={css.input} type="date" value={newCohort.start}
                                                onChange={function (e) { var v = e.target.value; setNewCohort(function (n) { return { ...n, start: v }; }); }} />
                                        </div>
                                        <div>
                                            <label style={css.label}>End Date</label>
                                            <input style={css.input} type="date" value={newCohort.end}
                                                onChange={function (e) { var v = e.target.value; setNewCohort(function (n) { return { ...n, end: v }; }); }} />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 10 }}>
                                    <button onClick={function () { setShowCohortForm(false); setNewCohort({ name: "", company: "", course: "", start: "", end: "" }); }}
                                        style={css.btnOut("#94a3b8")}>Cancel</button>
                                    <button onClick={function () {
                                        if (!newCohort.name.trim()) { notify("Cohort name is required.", "error"); return; }
                                        var created = {
                                            id: "coh" + Date.now(), name: newCohort.name, company: newCohort.company || "Internal",
                                            learners: 0, status: "Active", course: newCohort.course || "—", start: newCohort.start, end: newCohort.end
                                        };
                                        setCohorts(function (cs) { return [created].concat(cs); });
                                        setShowCohortForm(false);
                                        setNewCohort({ name: "", company: "", course: "", start: "", end: "" });
                                        notify('"' + newCohort.name + '" cohort created!');
                                    }} style={css.btn(p)}>Create Cohort</button>
                                </div>
                            </div>
                        )}

                        {/* Cohort stats */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                            <StatCard icon="🏷" value={cohorts.length} label="Total Cohorts" color={p} />
                            <StatCard icon="✅" value={cohorts.filter(function (c) { return c.status === "Active"; }).length} label="Active" color="#10B981" />
                            <StatCard icon="👥" value={cohorts.reduce(function (s, c) { return s + c.learners; }, 0)} label="Total Learners" color="#8B5CF6" />
                            <StatCard icon="🏢" value={[...new Set(cohorts.map(function (c) { return c.company; }))].length} label="Companies" color="#F59E0B" />
                        </div>

                        {/* Cohort table */}
                        <div style={css.card}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead><tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                                    {["Cohort / Group", "Company", "Course", "Learners", "Period", "Status", "Actions"].map(function (h) {
                                        return <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 12, color: "#64748b", fontWeight: 600 }}>{h}</th>;
                                    })}
                                </tr></thead>
                                <tbody>
                                    {cohorts.map(function (coh) {
                                        var sc = coh.status === "Active" ? "#10B981" : "#94a3b8";
                                        return (
                                            <tr key={coh.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                                                <td style={{ padding: "12px" }}>
                                                    <div style={{ fontWeight: 700, fontSize: 13 }}>{coh.name}</div>
                                                </td>
                                                <td style={{ padding: "12px" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                        <div style={{ width: 28, height: 28, background: p + "20", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🏢</div>
                                                        <span style={{ fontSize: 13, color: "#475569" }}>{coh.company}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: "12px", fontSize: 12, color: "#64748b", maxWidth: 180 }}>
                                                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{coh.course}</div>
                                                </td>
                                                <td style={{ padding: "12px", fontSize: 13, fontWeight: 700, color: p, textAlign: "center" }}>{coh.learners}</td>
                                                <td style={{ padding: "12px", fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>{coh.start} → {coh.end}</td>
                                                <td style={{ padding: "12px" }}><span style={{ ...css.tag(sc) }}>{coh.status}</span></td>
                                                <td style={{ padding: "12px" }}>
                                                    <div style={{ display: "flex", gap: 6 }}>
                                                        <button onClick={function () { notify("Viewing " + coh.name + " roster"); }} style={css.btn(p, "#fff", true)}>View</button>
                                                        <button onClick={function () { notify("Report generated for " + coh.name); }} style={css.btnOut(p, true)}>Report</button>
                                                        <button onClick={function () { setCohorts(function (cs) { return cs.filter(function (c) { return c.id !== coh.id; }); }); notify(coh.name + " removed"); }}
                                                            style={css.btnOut("#EF4444", true)}>✕</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {tab === "support" && (
                    <div className="fade">
                        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 24px" }}>Client Support</h1>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 20 }}>
                            <StatCard icon="🎫" value="3" label="Open Tickets" color="#F59E0B" />
                            <StatCard icon="🚨" value="1" label="Critical Issues" color="#EF4444" />
                            <StatCard icon="⚡" value="98.7%" label="Uptime" color={SKP} />
                        </div>
                        <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                            {[{ id: "TKT-001", client: "ACME Training Academy", issue: "Custom domain not resolving", pri: "High", tier: "professional" }, { id: "TKT-002", client: "TechPro Institute", issue: "SCORM file upload failing", pri: "Medium", tier: "enterprise" }, { id: "TKT-003", client: "National Dev College", issue: "Certificate template update", pri: "Low", tier: "foundation" }].map(function (tk) {
                                return (
                                    <div key={tk.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid #f8fafc" }}>
                                        <div style={{ fontFamily: "monospace", fontSize: 11, color: "#94a3b8", width: 70 }}>{tk.id}</div>
                                        <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13 }}>{tk.client}</div><div style={{ fontSize: 12, color: "#64748b" }}>{tk.issue}</div></div>
                                        <span style={{ background: tierColor[tk.tier] + "15", color: tierColor[tk.tier], borderRadius: 100, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>{tk.tier}</span>
                                        <span style={{ background: tk.pri === "High" ? "#FEE2E2" : tk.pri === "Medium" ? "#FEF3C7" : "#F0FDF4", color: tk.pri === "High" ? "#DC2626" : tk.pri === "Medium" ? "#92400E" : "#15803D", borderRadius: 100, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>{tk.pri}</span>
                                        <button onClick={function () { notify("Opening ticket " + tk.id); }} style={{ background: SKP, color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>View</button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default SkillivioSuperAdmin;