import React from 'react';
import { useRouter } from 'next/navigation';

const PrivacyContent = ({ p, s, tenant }) => {
    const router = useRouter();

        

    const Section = ({ title, children }) => (
        <div style={{ marginBottom: "40px" }}>
            <h2 style={{ color: p, fontSize: "20px", fontWeight: 700, marginBottom: "15px" }}>{title}</h2>
            <div style={{ lineHeight: "1.8", color: "rgba(255,255,255,0.7)", fontSize: "15px" }}>
                {children}
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${s} 0%, #0a0a0c 100%)`, color: "#fff", fontFamily: "sans-serif" }}>

            {/* Nav */}
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
            <div style={{ paddingTop: "120px", paddingBottom: "80px", display: "flex", justifyContent: "center", paddingLeft: 20, paddingRight: 20 }}>
                <div style={{ maxWidth: "800px", width: "100%", background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: "32px", padding: "60px", backdropFilter: "blur(40px)" }}>

                    <h1 style={{ fontSize: "42px", fontWeight: 900, marginBottom: "10px" }}>Privacy <span style={{ color: p }}>Policy</span></h1>
                    <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: "50px" }}>Last updated: April 10, 2026</p>

                    <Section title="1. Information We Collect">
                        <p>We collect information you provide directly to us when you request a demo, including your name, business email, phone number, and company details. For registered learners, we also collect progress data and assessment results required for QCTO reporting.</p>
                    </Section>

                    <Section title="2. How We Use Your Data">
                        <p>Your data is used to:</p>
                        <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
                            <li>Provide personalized platform walkthroughs.</li>
                            <li>Generate compliance reports for SETAs and QCTO.</li>
                            <li>Maintain academic integrity within the LMS.</li>
                            <li>Send platform updates (with your explicit consent).</li>
                        </ul>
                    </Section>

                    <Section title="3. Data Protection (POPIA)">
                        <p>As a South African service provider, we adhere strictly to the <strong>Protection of Personal Information Act (POPIA)</strong>. All data is stored on secure servers with enterprise-grade encryption. We do not share your personal information with third-party marketers.</p>
                    </Section>

                    <Section title="4. Cookies and Tracking">
                        <p>We use functional cookies to remember your login session and analytics cookies to understand how users interact with our training modules. You can manage your cookie preferences through your browser settings.</p>
                    </Section>

                    <div style={{ marginTop: "40px", padding: "24px", background: `${p}10`, borderRadius: "16px", border: `1px solid ${p}20`, textAlign: "center" }}>
                        <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
                            Data requests or POPIA inquiries? Email our Information Officer at: <br />
                            <strong style={{ color: p }}>privacy@{tenant.name.toLowerCase().replace(/\s/g, '')}.co.za</strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const navStyle = (s) => ({
    padding: "0 40px", height: "70px", display: "flex", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1000,
    alignItems: "center", background: `${s}dd`, backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)"
});

const backButtonStyle = { 
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", 
    padding: "8px 16px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: 600, transition: "0.2s" 
};


export default PrivacyContent;