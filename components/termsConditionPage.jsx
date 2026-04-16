import React from 'react';
import { GLOBAL_CSS } from '@/utils/globalCss';
import { useRouter } from 'next/navigation';

function TermsAndConditions({ ...props }) {
    const { p, s, tenant, onBack, css } = props;

    const router=useRouter();

    // Helper for section headers to keep JSX clean
    const SectionHeader = ({ children }) => (
        <h2 style={{ 
            color: p, 
            fontSize: "20px", 
            fontWeight: 700, 
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
        }}>
            <span style={{ width: "4px", height: "20px", background: p, borderRadius: "2px" }} />
            {children}
        </h2>
    );

    return (
        <div style={{ 
            minHeight: "100vh", 
            background: `linear-gradient(135deg, ${s} 0%, #0a0a0c 100%)`, 
            fontFamily: "'Segoe UI',system-ui,sans-serif", 
            color: "#fff" 
        }}>
            <style>{GLOBAL_CSS}</style>

            {/* Sticky Navigation */}
        
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
                    <button onClick={()=> router.back()} className="back-btn" style={backButtonStyle}>
                        <span style={{ fontSize: 18 }}>←</span> Back
                    </button>
                </div>
            </nav>

            <div style={{ paddingTop: "120px", paddingBottom: "100px", display: "flex", justifyContent: "center", paddingLeft: 20, paddingRight: 20 }}>
                <div style={contentCardStyle}>
                    
                    {/* Header */}
                    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "30px", marginBottom: "40px" }}>
                        <h1 style={{ fontSize: "42px", fontWeight: 900, marginBottom: "12px", letterSpacing: "-1px" }}>
                            Terms & <span style={{ color: p }}>Conditions</span>
                        </h1>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>
                            Effective Date: April 10, 2026 • Version 2.1
                        </p>
                    </div>

                    {/* Content Sections */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                        
                        <section>
                            <SectionHeader>1. Acceptance of Terms</SectionHeader>
                            <p style={paragraphStyle}>
                                By accessing the {tenant.name} platform, you agree to be bound by these Terms and Conditions and all applicable South African laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                            </p>
                        </section>

                        <section>
                            <SectionHeader>2. User Accountability & QCTO Compliance</SectionHeader>
                            <p style={paragraphStyle}>
                                As a QCTO-aligned platform, users are required to provide accurate information for the generation of Proof of Evidence (PoE). Any falsification of data or academic dishonesty may result in immediate account termination and reporting to relevant SETAs.
                            </p>
                        </section>

                        <section>
                            <SectionHeader>3. Intellectual Property</SectionHeader>
                            <p style={paragraphStyle}>
                                The technology, AI Course Builder logic, and analytics dashboards are the exclusive property of {tenant.name}. Client-uploaded course materials remain the property of the client, granted under a hosting license for educational delivery.
                            </p>
                        </section>

                        <section>
                            <SectionHeader>4. POPIA & Data Privacy</SectionHeader>
                            <p style={paragraphStyle}>
                                We are committed to the Protection of Personal Information Act (POPIA). We collect only necessary data for learner tracking, certificate verification, and BBBEE compliance reporting. Your data is never sold to third parties.
                            </p>
                        </section>

                        <section>
                            <SectionHeader>5. Limitation of Liability</SectionHeader>
                            <p style={paragraphStyle}>
                                {tenant.name} shall not be held liable for any damages arising out of the use or inability to use the materials on the platform, even if we have been notified orally or in writing of the possibility of such damage.
                            </p>
                        </section>

                    </div>

                    {/* Contact Legal Footer */}
                    <div style={legalFooterStyle(p)}>
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>
                            Have questions regarding our legal framework?
                        </p>
                        <a href={`mailto:legal@${tenant.name}.co.za`} style={{ color: p, textDecoration: "none", fontSize: "14px", fontWeight: 700 }}>
                            Contact Legal Support →
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer Text */}
            <div style={{ textAlign: "center", paddingBottom: "40px", color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
                © 2026 {tenant.name} Digital Learning Solutions • Proudly South African 🇿🇦
            </div>
        </div>
    );
}

// Styles
const navStyle = (s) => ({
    padding: "0 40px", height: "70px", display: "flex", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1000,
    alignItems: "center", background: `${s}dd`, backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)"
});

const contentCardStyle = {
    width: "100%", maxWidth: "800px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.07)",
    borderRadius: "32px", padding: "60px", backdropFilter: "blur(40px)", boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.5)"
};

const paragraphStyle = { 
    lineHeight: "1.8", color: "rgba(255,255,255,0.7)", fontSize: "15px", margin: 0 
};

const backButtonStyle = { 
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", 
    padding: "8px 16px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: 600, transition: "0.2s" 
};

const legalFooterStyle = (p) => ({
    marginTop: "60px", padding: "24px", background: `${p}08`, borderRadius: "16px", border: `1px solid ${p}22`,
    display: "flex", justifyContent: "space-between", alignItems: "center"
});

export default TermsAndConditions;