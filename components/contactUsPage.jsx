import { useEffect, useState } from 'react';
import { GLOBAL_CSS } from '../app/globalCss';
import Toast from './toast';
import { useDispatch, useSelector } from 'react-redux';
import { createcontactUs, fetchcontactUs } from '@/store/slices/contactUsSlice';
import Link from 'next/link';

function ContactUsPage({ ...props }) {
    const { p, s, tenant, notification, css, onBack, notify, currentTenant,view } = props;
    const [selectConditionAndPolicy, setSelectConditionAndPolicy] = useState("");
    const dispatch = useDispatch();


    const [formData, setFormData] = useState({
        firstName: "", lastName: "", businessEmail: "", phoneNumber: "",
        company: "", noOfLMs: "", jobTitle: "", country: "South Africa",
        industry: "", status: "pending"
    });
    const [errors, setErrors] = useState({});
    const validateForm = () => {
        let tempErrors = {};
        if (!formData.firstName.length) tempErrors.firstName = "First name is required";
        if (!formData.lastName.length) tempErrors.lastName = "Last name is required";
        if (!formData.businessEmail.includes("@")) tempErrors.businessEmail = "Enter a valid business email";
        if (formData.phoneNumber.length < 10) tempErrors.phoneNumber = "Enter a valid phone number";
        if (!formData.company.length) tempErrors.company = "company name is required";
        if (!formData.jobTitle.length) tempErrors.jobTitle = "Job title name is required";
        if (!formData.industry.length) tempErrors.industry = "Industry name is required";
        if (!formData.noOfLMs || formData.noOfLMs < 1) tempErrors.noOfLMs = "Required";
        if (formData.status !== "Approve") tempErrors.status = "Required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            const newStatus = checked ? "Approve" : "pending";
            setFormData(prev => ({ ...prev, status: newStatus }));

            // Clear checkbox error if it exists
            if (errors.status) {
                setErrors(prev => {
                    const newErrs = { ...prev };
                    delete newErrs.status;
                    return newErrs;
                });
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
                // Use the currentTenant directly instead of a nested ternary
                type: currentTenant
            }));

            // Clear text field error as user types
            if (errors[name]) {
                setErrors(prev => {
                    const newErrs = { ...prev };
                    delete newErrs[name];
                    return newErrs;
                });
            }
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {

            dispatch(createcontactUs(formData));
            setFormData({
                firstName: "", lastName: "", businessEmail: "", phoneNumber: "",
                company: "", noOfLMs: "", jobTitle: "", country: "South Africa",
                industry: "", status: "pending"
            });
            setErrors({})
            notify("successfully send...")
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: s, fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#fff" }}>
            <Toast notification={notification} />
            <style>{GLOBAL_CSS}</style>

            <nav style={navStyle(s)}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between", width: "100%", }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ width: 40, height: 40, background: p, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, boxShadow: `0 4px 12px ${p}44` }}>
                            {tenant.logo}
                        </div>
                        <div>
                            <div style={{ color: "#fff", fontWeight: 800, fontSize: 18, lineHeight: 1 }}>{tenant.name}</div>
                            <div style={{ color: p, fontSize: 11, marginTop: 4, fontWeight: 600, letterSpacing: 0.5 }}>{tenant.tagline}</div>
                        </div>
                    </div>
                    <button onClick={onBack} className="back-btn" style={backButtonStyle}>
                        <span style={{ fontSize: 18 }}>←</span> Back
                    </button>
                </div>
            </nav>

            <div style={{ paddingTop: "140px", paddingBottom: "80px", display: "flex", justifyContent: "center", paddingLeft: 20, paddingRight: 20 }}>
                <div style={cardStyle(s)}>
                    <div style={{ textAlign: "center", marginBottom: 50 }}>
                        <div style={{ background: `${p}15`, color: p, padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700, display: "inline-block", marginBottom: 16, border: `1px solid ${p}33` }}>
                            {tenant.name}
                        </div>
                        <h1 style={{ fontSize: 48, fontWeight: 900, color: "#fff", marginBottom: 16, letterSpacing: "-1px" }}>
                            Scale Your <span style={{ color: p }}>Training</span>
                        </h1>
                        <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: 17, maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
                            Configure your QCTO-ready platform today. Provide your details for a personalized walkthrough.
                        </p>
                    </div>

                    <form style={{ display: "flex", flexDirection: "column", gap: 28 }} onSubmit={handleSubmit}>
                        <div style={grid2}>
                            <div style={inputGroup}>
                                <label style={labelStyle}>First Name</label>
                                <input name="firstName" value={formData.firstName} onChange={handleChange}
                                    style={{
                                        ...inputStyle(p),
                                        borderColor: errors.firstName ? "#ff4d4d" : "rgba(255,255,255,0.1)",
                                        background: errors.firstName ? "rgba(255, 77, 77, 0.05)" : "rgba(255,255,255,0.03)"
                                    }}
                                    placeholder="John" />
                                {errors.firstName && (
                                    <span style={errorTextStyle}>{errors.firstName}</span>
                                )}
                            </div>

                            <div style={inputGroup}>
                                <label style={labelStyle}>Last Name</label>
                                <input name="lastName" value={formData.lastName} onChange={handleChange} style={{
                                    ...inputStyle(p),
                                    borderColor: errors.lastName ? "#ff4d4d" : "rgba(255,255,255,0.1)",
                                    background: errors.lastName ? "rgba(255, 77, 77, 0.05)" : "rgba(255,255,255,0.03)"
                                }} placeholder="Doe" />
                                {errors.lastName && (
                                    <span style={errorTextStyle}>{errors.lastName}</span>
                                )}
                            </div>
                        </div>

                        <div style={grid2}>
                            <div style={inputGroup}>
                                <label style={labelStyle}>Business Email</label>
                                <input name="businessEmail" value={formData.businessEmail} onChange={handleChange} style={{
                                    ...inputStyle(p),
                                    borderColor: errors.businessEmail ? "#ff4d4d" : "rgba(255,255,255,0.1)",
                                    background: errors.businessEmail ? "rgba(255, 77, 77, 0.05)" : "rgba(255,255,255,0.03)"
                                }} type="email" placeholder="john@company.co.za" />
                                {errors.businessEmail && (
                                    <span style={errorTextStyle}>{errors.businessEmail}</span>
                                )}
                            </div>
                            <div style={inputGroup}>
                                <label style={labelStyle}>Phone Number</label>
                                <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} style={{
                                    ...inputStyle(p),
                                    borderColor: errors.phoneNumber ? "#ff4d4d" : "rgba(255,255,255,0.1)",
                                    background: errors.phoneNumber ? "rgba(255, 77, 77, 0.05)" : "rgba(255,255,255,0.03)"
                                }} type="tel" placeholder="+27 ..." />
                                {errors.phoneNumber && (
                                    <span style={errorTextStyle}>{errors.phoneNumber}</span>
                                )}
                            </div>
                        </div>

                        <div style={grid2}>
                            <div style={inputGroup}>
                                <label style={labelStyle}>Company Name</label>
                                <input name="company" value={formData.company} onChange={handleChange} style={{
                                    ...inputStyle(p),
                                    borderColor: errors.company ? "#ff4d4d" : "rgba(255,255,255,0.1)",
                                    background: errors.company ? "rgba(255, 77, 77, 0.05)" : "rgba(255,255,255,0.03)"
                                }} placeholder="Your organization" />
                                {errors.company && (
                                    <span style={errorTextStyle}>{errors.company}</span>
                                )}
                            </div>
                            <div style={inputGroup}>
                                <label style={labelStyle}>Job Title</label>
                                <input name="jobTitle" value={formData.jobTitle} onChange={handleChange} style={{
                                    ...inputStyle(p),
                                    borderColor: errors.jobTitle ? "#ff4d4d" : "rgba(255,255,255,0.1)",
                                    background: errors.jobTitle ? "rgba(255, 77, 77, 0.05)" : "rgba(255,255,255,0.03)"
                                }} placeholder="e.g. Training Director" />
                                {errors.jobTitle && (
                                    <span style={errorTextStyle}>{errors.jobTitle}</span>
                                )}
                            </div>
                        </div>

                        <div style={grid3}>
                            <div style={inputGroup}>
                                <label style={labelStyle}>Industry</label>
                                <input name="industry" value={formData.industry} onChange={handleChange} style={{
                                    ...inputStyle(p),
                                    borderColor: errors.industry ? "#ff4d4d" : "rgba(255,255,255,0.1)",
                                    background: errors.industry ? "rgba(255, 77, 77, 0.05)" : "rgba(255,255,255,0.03)"
                                }} placeholder="e.g. Finance" />
                                {errors.industry && (
                                    <span style={errorTextStyle}>{errors.industry}</span>
                                )}
                            </div>
                            <div style={inputGroup}>
                                <label style={labelStyle}>Country</label>
                                <input name="country" value={formData.country} onChange={handleChange} style={{
                                    ...inputStyle(p),
                                    "--placeholder-color": "rgba(255, 255, 255, 0.3)",
                                    "--placeholder-focus": `${p}88`,
                                    borderColor: errors.country ? "#ff4d4d" : "rgba(255,255,255,0.1)",
                                    background: errors.country ? "rgba(255, 77, 77, 0.05)" : "rgba(255,255,255,0.03)"
                                }} />
                                {errors.country && (
                                    <span style={errorTextStyle}>{errors.country}</span>
                                )}
                            </div>
                            <div style={inputGroup}>
                                <label style={labelStyle}>Learners</label>
                                <input name="noOfLMs" value={formData.noOfLMs} onChange={handleChange} style={{
                                    ...inputStyle(p),
                                    borderColor: errors.noOfLMs ? "#ff4d4d" : "rgba(255,255,255,0.1)",
                                    background: errors.noOfLMs ? "rgba(255, 77, 77, 0.05)" : "rgba(255,255,255,0.03)"
                                }} type="number" placeholder="500" />
                                {errors.noOfLMs && (
                                    <span style={errorTextStyle}>{errors.noOfLMs}</span>
                                )}
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <div style={consentBoxStyle(p, !!errors.status)}>
                                <input
                                    type="checkbox"
                                    name="status"
                                    style={checkboxStyle(p)}
                                    checked={formData.status === "Approve"}
                                    onChange={handleChange}
                                />
                                <span style={{ lineHeight: 1.5, color: "rgba(255, 255, 255, 0.7)", fontSize: "13px" }}>
                                    I confirm that I have read and agree to the
                                    <Link onClick={()=> localStorage.setItem("view",view)} href={`/terms?tenant=${currentTenant}`} style={linkStyle(p)}> Terms & Conditions </Link>
                                    and
                                    <Link onClick={()=> localStorage.setItem("view",view)} href={`/policy?tenant=${currentTenant}`} style={linkStyle(p)}> Privacy Policy</Link>.
                                    I also consent to receiving periodic platform updates and industry insights.
                                </span>
                            </div>

                            {errors.status && (
                                <div style={errorTextStyle}>
                                    <span style={{ fontSize: "14px" }}>⚠️</span> {errors.status}
                                </div>
                            )}
                        </div>


                        <button type="submit" className="submit-btn" style={submitButtonStyle(p)}>
                            Request My Custom Demo —
                        </button>
                    </form>
                </div>
            </div>

            <div style={{ padding: "48px", background: "rgba(0,0,0,0.2)", textAlign: "center" }}>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>© 2026 Skillivio Digital Learning Solutions • QCTO-Aligned • BBBEE Compliant • 🇿🇦 Proudly South African</div>
            </div>
        </div>
    );
}

// Custom Refined Styles
const navStyle = (s) => ({
    padding: "0 48px", height: "80px", display: "flex", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1000,
    alignItems: "center", background: `${s}ee`, backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)"
});

const cardStyle = (s) => ({
    width: "100%", maxWidth: "800px", background: `linear-gradient(135deg, ${s} 0%, #0a0a0c 100%)`, border: "1px solid rgba(255, 255, 255, 0.07)",
    borderRadius: 32, padding: "60px", backdropFilter: "blur(40px)", boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.6)"
});

const inputStyle = (p) => ({
    width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "14px", padding: "14px 18px", color: "#fff", fontSize: "15px", transition: "all 0.3s ease",
    outline: "none",
});

const submitButtonStyle = (p) => ({
    background: p, color: "#fff", border: "none", borderRadius: "14px", padding: "18px", fontSize: "16px",
    fontWeight: 800, cursor: "pointer", transition: "all 0.3s ease", boxShadow: `0 20px 40px -10px ${p}55`,
    marginTop: 10
});

const consentBoxStyle = (p) => ({
    display: "flex", alignItems: "flex-start", gap: 14, color: "rgba(255, 255, 255, 0.5)", fontSize: 13,
    padding: "24px", background: "rgba(255,255,255,0.02)", borderRadius: "18px", border: "1px solid rgba(255,255,255,0.05)"
});

const backButtonStyle = {
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff",
    borderRadius: "10px", padding: "8px 16px", cursor: "pointer", fontSize: "14px", fontWeight: 600,
    display: "flex", alignItems: "center", gap: 8, transition: "0.2s"
};

const errorTextStyle = {
    color: "#ff4d4d",
    fontSize: "11px",
    marginTop: "6px",
    marginLeft: "4px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    animation: "fadeIn 0.2s ease" // Optional: add a quick fade-in to your GLOBAL_CSS
};

const linkStyle = (p) => ({
    color: p,
    textDecoration: "none",
    fontWeight: 700,
    borderBottom: `1px solid ${p}33`, // Subtle underline
    transition: "all 0.2s ease",
    paddingBottom: "1px"
});


const checkboxStyle = (p) => ({ width: 18, height: 18, accentColor: p, cursor: "pointer", marginTop: 2 });
const labelStyle = { color: "rgba(255,255,255,0.8)", fontSize: "13px", fontWeight: 600, marginBottom: 8, display: "block" };
const inputGroup = { display: "flex", flexDirection: "column" };
const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 };
const grid3 = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 };

export default ContactUsPage;