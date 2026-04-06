import { useState } from "react";
import { TIER_DATA } from "../app/mockData";
import { GLOBAL_CSS } from "../app/globalCss";
import { useDispatch } from "react-redux";

function EditTenantForm({ tenant, onSave, onCancel }) {
    const p = "#2FBF71";

    // Prefill form with tenant data
    const [form, setForm] = useState({
        id: tenant.id || "",
        name: tenant.name || "",
        slug: tenant.slug || "",
        tier: tenant.tier || "professional",
        contact: tenant.contact || "",
        email: tenant.email || "",
        phone: tenant.phone || "",
        domain: tenant.domain || "",
        color: tenant.color || "#7C3AED",
        qctoNo: tenant.qctoNo || "",
        seta: tenant.seta || "Services SETA",
        logo: tenant.logo || "",
        setupDate: tenant.setupDate || new Date().toISOString().split("T")[0],
        status: tenant.status || "Pending"
    });

    const [errors, setErrors] = useState({});
    const [step, setStep] = useState(1);
    const dispatch = useDispatch()

    function validate() {
        const e = {};
        if (!form.name.trim()) e.name = "Required";
        if (!form.slug.trim()) e.slug = "Required";
        if (!form.contact.trim()) e.contact = "Required";
        if (!form.email.trim()) e.email = "Required";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function iSt(field) {
        return {
            border: "1.5px solid " + (errors[field] ? "#FCA5A5" : "#e2e8f0"),
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 13,
            width: "100%",
            outline: "none",
            boxSizing: "border-box"
        };
    }

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <style>{GLOBAL_CSS}</style>
            <div style={{ background: "#f0f2f5", borderRadius: 16, width: "100%", maxWidth: 680, boxShadow: "0 30px 80px rgba(0,0,0,0.25)", animation: "fadeIn 0.3s ease", maxHeight: "90vh", overflowY: "auto" }}>

                {/* Header */}
                <div style={{ background: "#2E3044", padding: "20px 24px", borderRadius: "16px 16px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>✏️ Edit Tenant</div>
                        <div style={{ color: "#2FBF71", fontSize: 13, marginTop: 2 }}>Step {step} of 3</div>
                    </div>
                    <button onClick={onCancel} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer" }}>✕</button>
                </div>

                <div style={{ padding: 20 }}>
                    {/* Step 1 — Organisation Details */}
                    {step === 1 && (
                        <div style={{ background: "#fff", borderRadius: 12, padding: "24px" }}>
                            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Step 1 — Organisation Details</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                {/* Name */}
                                <div style={{ gridColumn: "1/-1" }}>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4, display: "block" }}>Organisation Name <span style={{ color: "#EF4444" }}>*</span></label>
                                    <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. ACME Training Academy" style={iSt("name")} />
                                    {errors.name && <div style={{ fontSize: 11, color: "#EF4444", marginTop: 3 }}>{errors.name}</div>}
                                </div>

                                {/* Subdomain */}
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4, display: "block" }}>Subdomain <span style={{ color: "#EF4444" }}>*</span></label>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <input value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))} placeholder="acme" style={{ ...iSt("slug"), borderRadius: "8px 0 0 8px", borderRight: "none" }} />
                                        <div style={{ background: "#f1f5f9", border: "1.5px solid #e2e8f0", borderLeft: "none", padding: "10px 10px", borderRadius: "0 8px 8px 0", fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>.skillivio.com</div>
                                    </div>
                                    {errors.slug && <div style={{ fontSize: 11, color: "#EF4444", marginTop: 3 }}>{errors.slug}</div>}
                                </div>

                                {/* Domain */}
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4, display: "block" }}>Custom Domain</label>
                                    <input value={form.domain} onChange={(e) => setForm(f => ({ ...f, domain: e.target.value }))} placeholder="learn.yourorg.co.za" style={iSt("domain")} />
                                </div>

                                {/* Contact */}
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4, display: "block" }}>Contact Person <span style={{ color: "#EF4444" }}>*</span></label>
                                    <input value={form.contact} onChange={(e) => setForm(f => ({ ...f, contact: e.target.value }))} placeholder="Full name" style={iSt("contact")} />
                                    {errors.contact && <div style={{ fontSize: 11, color: "#EF4444", marginTop: 3 }}>{errors.contact}</div>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4, display: "block" }}>Email <span style={{ color: "#EF4444" }}>*</span></label>
                                    <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="admin@org.co.za" style={iSt("email")} />
                                    {errors.email && <div style={{ fontSize: 11, color: "#EF4444", marginTop: 3 }}>{errors.email}</div>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4, display: "block" }}>Phone</label>
                                    <input value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+27 (0) 11 000 0000" style={iSt("phone")} />
                                </div>

                                {/* QCTO */}
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4, display: "block" }}>QCTO Accreditation Number</label>
                                    <input value={form.qctoNo} onChange={(e) => setForm(f => ({ ...f, qctoNo: e.target.value }))} placeholder="QCTO/ACC/2024/…" style={iSt("qctoNo")} />
                                </div>

                                {/* SETA */}
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4, display: "block" }}>SETA Affiliation</label>
                                    <select value={form.seta} onChange={function (e) { var v = e.target.value; setForm(function (f) { return { ...f, seta: v }; }); }} style={{ border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 13, width: "100%", outline: "none" }}>
                                        {["AgriSETA", "BankSETA", "CATHSSETA", "CHIETA", "CETA", "ETDP SETA", "FoodBev SETA", "HWSETA", "INSETA", "LGSETA", "MICTS SETA", "MQA", "MERSETA", "PSETA", "SASSETA", "Services SETA", "TETA", "W&RSETA"].map(function (s) { return <option key={s}>{s}</option>; })}
                                    </select>
                                </div>
                                <div style={{ marginBottom: 16, maxWidth: 200 }}>
                                    <label style={{
                                        display: "block",
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: "#475569",
                                        marginBottom: 6
                                    }}>
                                        Logo
                                    </label>

                                    <div style={{display:"flex",gap:10}}>
                                        {/* File input styled like a button */}
                                        <label style={{
                                            display: "inline-block",
                                            padding: "8px 16px",
                                            backgroundColor: "#10B981",
                                            color: "#fff",
                                            borderRadius: 8,
                                            cursor: "pointer",
                                            fontSize: 13,
                                            fontWeight: 600,
                                            marginBottom: 8,
                                            textAlign: "center"
                                        }}>
                                            Choose Image
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setForm(f => ({ ...f, logo: reader.result }));
                                                    };
                                                    reader.readAsDataURL(file);
                                                }}
                                                style={{ display: "none" }}
                                            />
                                        </label>

                                        {/* Preview box */}
                                        {form.logo && (
                                            <div style={{
                                                width: 38,
                                                height: 38,
                                                borderRadius: 12,
                                                border: "2px dashed #cbd5e1",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                overflow: "hidden",
                                                backgroundColor: "#f9fafb"
                                            }}>
                                                <img
                                                    src={form.logo}
                                                    alt="Logo Preview"
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4, display: "block" }}>Logo</label>
                                    <input value={form.logo} onChange={(e) => setForm(f => ({ ...f, logo: e.target.value }))} placeholder="" style={iSt("logo")} />
                                </div> */}
                            </div>
                        </div>
                    )}

                    {/* Step 2 — Service Tier */}
                    {step === 2 && (
                        <div style={{ background: "#fff", borderRadius: 12, padding: "24px" }}>
                            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Step 2 — Select Service Tier</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                                {Object.values(TIER_DATA).map(function (tier) {
                                    var selected = form.tier === tier.id;
                                    return (
                                        <div key={tier.id} onClick={function () { setForm(function (f) { return { ...f, tier: tier.id }; }); }}
                                            style={{ border: "2.5px solid " + (selected ? tier.color : "#e2e8f0"), borderRadius: 12, padding: "18px 16px", cursor: "pointer", background: selected ? (tier.color + "08") : "#fff", transition: "all 0.2s" }}>
                                            <div style={{ fontSize: 26, marginBottom: 8 }}>{tier.emoji}</div>
                                            <div style={{ fontWeight: 800, fontSize: 15, color: tier.color, marginBottom: 4 }}>{tier.name}</div>
                                            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>{tier.tagline}</div>
                                            <div style={{ fontSize: 20, fontWeight: 900 }}>{tier.monthly}<span style={{ fontSize: 11, fontWeight: 400, color: "#94a3b8" }}>/mo</span></div>
                                            <div style={{ fontSize: 11, color: "#94a3b8" }}>Setup: {tier.setup}</div>
                                            {selected && <div style={{ marginTop: 10, background: tier.color + "15", color: tier.color, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700, textAlign: "center" }}>✓ Selected</div>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Step 3 — Branding & Confirmation */}
                    {step === 3 && (
                        <div style={{ background: "#fff", borderRadius: 12, padding: "24px" }}>
                            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Step 3 — Branding & Confirmation</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4, display: "block" }}>Primary Brand Colour</label>
                                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                        <div style={{ width: 36, height: 36, background: form.color, borderRadius: 8, border: "2px solid #e2e8f0", flexShrink: 0 }} />
                                        <input value={form.color} onChange={function (e) { var v = e.target.value; setForm(function (f) { return { ...f, color: v }; }); }} placeholder="#7C3AED" style={{ ...iSt("color"), flex: 1 }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4, display: "block" }}>Setup Date</label>
                                    <input type="date" value={form.setupDate} onChange={function (e) { var v = e.target.value; setForm(function (f) { return { ...f, setupDate: v }; }); }} style={iSt("setupDate")} />
                                </div>
                            </div>
                            <div style={{ background: "#f8fafc", borderRadius: 12, padding: 18, border: "1px solid #e2e8f0" }}>
                                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>📋 Summary</div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                    {[["Organisation", form.name], ["Subdomain", form.slug + ".skillivio.com"], ["Tier", form.tier.charAt(0).toUpperCase() + form.tier.slice(1)], ["Monthly", TIER_DATA[form.tier] && TIER_DATA[form.tier].monthly + "/mo"], ["Contact", form.contact], ["Email", form.email], ["SETA", form.seta], ["Setup Fee", TIER_DATA[form.tier] && TIER_DATA[form.tier].setup]].map(function (pair) {
                                        return (
                                            <div key={pair[0]} style={{ background: "#fff", borderRadius: 8, padding: "8px 12px" }}>
                                                <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>{pair[0].toUpperCase()}</div>
                                                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{pair[1] || "—"}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                        <button onClick={step === 1 ? onCancel : () => setStep(step - 1)}
                            style={{ background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                            {step === 1 ? "Cancel" : "← Back"}
                        </button>
                        {step < 3
                            ? <button onClick={() => { if (step === 1 && !validate()) return; setStep(step + 1); }}
                                style={{ background: p, color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Next →</button>
                            : <button onClick={() => { if (!validate()) return; onSave(form); }}
                                style={{ background: "#F59E0B", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>💾 Save Changes</button>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditTenantForm;