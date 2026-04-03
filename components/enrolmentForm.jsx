import { useState } from "react";
import { ENROLMENT_STORE } from "../app/mockData";
import { GLOBAL_CSS } from "../app/globalCss";
import { useDispatch, useSelector } from "react-redux";
import { createEnrollment } from "@/store/slices/enrollmentSlice";



function EnrolmentForm({ ...props }) {
    const { course, learnerUser, onSubmit, onCancel, p, s, notify } = props;
    var today = new Date().toISOString().split("T")[0];

    var [step, setStep] = useState("A");
    var [secA, setSecA] = useState({ saqaId: "", nqfLevel: (course.nqf), credits: (course.credits), intakeNo: "", startDate: today, endDate: "", mode: "Blended" });
    var [secB, setSecB] = useState({ fullName: "", idNumber: "", dob: "", gender: "", nationality: "South African", address: "", contact: "", email: learnerUser ? learnerUser.email : "" });
    var [secC, setSecC] = useState({ employer: "", workAddress: "", contactPerson: "", contactNo: "", mentor: "No" });
    var [secD, setSecD] = useState([
        { req: "Certified ID Copy", sub: "N", verBy: "", date: "" },
        { req: "Highest Qualification", sub: "N", verBy: "", date: "" },
        { req: "Pre-requisite Qualification", sub: "N", verBy: "", date: "" },
        { req: "Study Permit (if applicable)", sub: "N", verBy: "", date: "" },
        { req: "Workplace Confirmation", sub: "N", verBy: "", date: "" },
    ]);
    var [secE, setSecE] = useState({ conducted: "No", dateCond: "", outcome: "Competent - Approved", assessor: "", sig: "" });
    var [secF, setSecF] = useState({ name: "", sig: "", date: today, agreed: false });
    var [secG, setSecG] = useState({ consent: false, sig: "", date: today });
    var [secH, setSecH] = useState({ verified: "No", approved: "No", qctoDate: "", repName: "", sig: "", date: today });
    var [docs, setDocs] = useState({ certifiedId: null, highestQual: null, cv: null, studyPermit: null, workplaceConf: null, entryAssessment: null });
    var [submitting, setSubmitting] = useState(false);

    var DOC_LABELS = { certifiedId: "Certified ID", highestQual: "Highest Qualification", cv: "CV", studyPermit: "Study Permit", workplaceConf: "Workplace Confirmation", entryAssessment: "Entry Assessment Record" };

    var SECTIONS = ["A", "B", "C", "D", "E", "F", "G", "H", "DOCS"];
    function fakeUpload(key) {
        setDocs(d => {
            const n = { ...d };
            n[key] = key + "_document.pdf"; // ✅ Now allowed
            return n;
        });

        notify(DOC_LABELS[key] + " uploaded!");
    }
    const { Enrollment } = useSelector(state => state.enrollment);
    const dispatch = useDispatch();

    function handleSubmit() {
        if (!secB.fullName) { notify("Full name required in Section B", "error"); setStep("B"); return; }
        if (!secB.idNumber) { notify("ID number required in Section B", "error"); setStep("B"); return; }
        if (!secF.agreed) { notify("Please accept the declaration in Section F", "error"); setStep("F"); return; }
        if (!secG.consent) { notify("POPIA consent required in Section G", "error"); setStep("G"); return; }
        setSubmitting(true);
        var record = { course: course, secA: secA, secB: secB, secC: secC, secD: secD, secE: secE, secF: secF, secG: secG, secH: secH, docs: docs, submittedAt: new Date().toISOString() };
        var key = (learnerUser ? learnerUser.id : "u") + "_" + course.id;
        const enrollmentRecord = {
            courseId: course._id,          // ObjectId of course
            userId: "69cf9f8735f8f030ce7fcb7e", // ObjectId of user (or null if guest)
            saqaId: secA.saqaId,
            intakeNo: secA.intakeNo,
            startDate: secA.startDate ? new Date(secA.startDate) : new Date(),
            endDate: secA.endDate ? new Date(secA.endDate) : null,
            mode: secA.mode,

            personal: { ...secB },
            employment: { ...secC },
            enteyRequest: [...secD],
            assessment: {
                ...secE,
                dateCond: secE.dateCond ? new Date(secE.dateCond) : null
            },
            declaration: { ...secF },
            popia: { ...secG },
            provider: { ...secH },
            docs: { ...docs },
            submittedAt: new Date()
        };
        // ENROLMENT_STORE[key] = record;
        dispatch(createEnrollment(enrollmentRecord));

        setTimeout(function () { setSubmitting(false); onSubmit(record); }, 700);
    }

    function F(fp) {
        var label = fp.label, val = fp.val, onChange = fp.onChange, type = fp.type || "text", options = fp.options, required = fp.required;
        return (
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4, display: "block" }}>
                    {label}{required && <span style={{ color: "#EF4444" }}> *</span>}
                </label>
                {type === "select" ?
                    <select value={val} onChange={function (e) { onChange(e.target.value); }}
                        style={{ border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "9px 12px", fontSize: 13, width: "100%", outline: "none" }}>
                        {options.map(function (o) { return <option key={o}>{o}</option>; })}
                    </select>
                    : type === "textarea" ?
                        <textarea value={val} onChange={function (e) { onChange(e.target.value); }} rows={2}
                            style={{ border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "9px 12px", fontSize: 13, width: "100%", outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
                        :
                        <input type={type} value={val} onChange={function (e) { onChange(e.target.value); }}
                            style={{ border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "9px 12px", fontSize: 13, width: "100%", outline: "none", boxSizing: "border-box" }} />
                }
            </div>
        );
    }

    function SH(sp) {
        var letter = sp.letter, title = sp.title;
        return (
            <div style={{ background: s, color: "#fff", borderRadius: "10px 10px 0 0", padding: "12px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, background: p, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: "#fff", flexShrink: 0 }}>{letter}</div>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Section {letter}: {title}</span>
            </div>
        );
    }

    var cardSt = { background: "#fff", borderRadius: "0 0 10px 10px", padding: "20px", border: "1px solid #e2e8f0", borderTop: "none", marginBottom: 16 };

    var stepIdx = SECTIONS.indexOf(step);

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 2000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px", overflowY: "auto" }}>
            <style>{GLOBAL_CSS}</style>
            <div style={{ background: "#f0f2f5", borderRadius: 16, width: "100%", maxWidth: 820, boxShadow: "0 30px 80px rgba(0,0,0,0.25)", animation: "fadeIn 0.3s ease", marginTop: 20 }}>
                <div style={{ background: s, padding: "20px 24px", borderRadius: "16px 16px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>Learner Enrolment Form</div>
                        <div style={{ color: p, fontSize: 13, marginTop: 2 }}>{course.title} — NQF Level {course.nqf} • {course.credits} Credits</div>
                    </div>
                    <button onClick={onCancel} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer" }}>✕ Close</button>
                </div>
                <div style={{ background: "#fff", padding: "10px 16px", display: "flex", gap: 6, flexWrap: "wrap", borderBottom: "1px solid #e2e8f0" }}>
                    {[["A", "A. Qualification"], ["B", "B. Personal"], ["C", "C. Employment"], ["D", "D. Entry Req."],
                    ["E", "E. Assessment"], ["F", "F. Declaration"], ["G", "G. POPIA"], ["H", "H. Provider"], ["DOCS", "📎 Docs"]].map(function (pair) {
                        var id = pair[0], lbl = pair[1];
                        return (
                            <button key={id} onClick={function () { setStep(id); }}
                                style={{
                                    background: step === id ? p : "#f8fafc", color: step === id ? "#fff" : "#475569",
                                    border: "1px solid " + (step === id ? p : "#e2e8f0"), borderRadius: 6, padding: "5px 10px",
                                    fontSize: 11, fontWeight: step === id ? 700 : 400, cursor: "pointer"
                                }}>{lbl}</button>
                        );
                    })}
                </div>
                <div style={{ padding: 16 }}>
                    {step === "A" && (<>
                        <SH letter="A" title="Qualification Details" />
                        <div style={cardSt}>
                            <div style={{ marginBottom: 14, padding: "10px 14px", background: p + "10", borderRadius: 8, border: "1px solid " + p + "30" }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: p }}>{course.title}</div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <F label="SAQA ID" val={secA.saqaId} onChange={function (v) { setSecA(function (s) { return { ...s, saqaId: v }; }); }} required />
                                <F label="NQF Level" val={secA.nqfLevel} onChange={function (v) { setSecA(function (s) { return { ...s, nqfLevel: v }; }); }} type="select" options={["2", "3", "4", "5", "6", "7", "8"]} />
                                <F label="Credits" val={secA.credits} onChange={function (v) { setSecA(function (s) { return { ...s, credits: v }; }); }} />
                                <F label="Intake Number" val={secA.intakeNo} onChange={function (v) { setSecA(function (s) { return { ...s, intakeNo: v }; }); }} required />
                                <F label="Start Date" val={secA.startDate} onChange={function (v) { setSecA(function (s) { return { ...s, startDate: v }; }); }} type="date" />
                                <F label="Planned End Date" val={secA.endDate} onChange={function (v) { setSecA(function (s) { return { ...s, endDate: v }; }); }} type="date" />
                            </div>
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 8, display: "block" }}>Delivery Mode</label>
                                <div style={{ display: "flex", gap: 20 }}>
                                    {["Face-to-Face", "Blended", "Workplace-Based"].map(function (mode) {
                                        return (
                                            <label key={mode} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, cursor: "pointer" }}>
                                                <input type="radio" name="delMode" checked={secA.mode === mode}
                                                    onChange={function () { setSecA(function (s) { return { ...s, mode: mode }; }); }} style={{ accentColor: p }} />{mode}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </>)}

                    {step === "B" && (<>
                        <SH letter="B" title="Learner Personal Details" />
                        <div style={cardSt}>
                            <F label="Full Name (as per ID)" val={secB.fullName} onChange={function (v) { setSecB(function (s) { return { ...s, fullName: v }; }); }} required />
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <F label="ID Number / Passport Number" val={secB.idNumber} onChange={function (v) { setSecB(function (s) { return { ...s, idNumber: v }; }); }} required />
                                <F label="Date of Birth" val={secB.dob} onChange={function (v) { setSecB(function (s) { return { ...s, dob: v }; }); }} type="date" />
                                <F label="Gender" val={secB.gender} onChange={function (v) { setSecB(function (s) { return { ...s, gender: v }; }); }} type="select" options={["", "Male", "Female", "Non-binary", "Prefer not to say"]} />
                                <F label="Nationality" val={secB.nationality} onChange={function (v) { setSecB(function (s) { return { ...s, nationality: v }; }); }} />
                                <F label="Contact Number" val={secB.contact} onChange={function (v) { setSecB(function (s) { return { ...s, contact: v }; }); }} />
                                <F label="Email Address" val={secB.email} onChange={function (v) { setSecB(function (s) { return { ...s, email: v }; }); }} type="email" required />
                            </div>
                            <F label="Home Address" val={secB.address} onChange={function (v) { setSecB(function (s) { return { ...s, address: v }; }); }} type="textarea" />
                        </div>
                    </>)}

                    {step === "C" && (<>
                        <SH letter="C" title="Employment / Workplace Details (If Applicable)" />
                        <div style={cardSt}>
                            <F label="Employer Name" val={secC.employer} onChange={function (v) { setSecC(function (s) { return { ...s, employer: v }; }); }} />
                            <F label="Workplace Address" val={secC.workAddress} onChange={function (v) { setSecC(function (s) { return { ...s, workAddress: v }; }); }} type="textarea" />
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <F label="Contact Person" val={secC.contactPerson} onChange={function (v) { setSecC(function (s) { return { ...s, contactPerson: v }; }); }} />
                                <F label="Contact Number" val={secC.contactNo} onChange={function (v) { setSecC(function (s) { return { ...s, contactNo: v }; }); }} />
                            </div>
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 8, display: "block" }}>Mentor Assigned</label>
                                <div style={{ display: "flex", gap: 20 }}>
                                    {["Yes", "No"].map(function (v) {
                                        return <label key={v} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, cursor: "pointer" }}>
                                            <input type="radio" name="mentor" checked={secC.mentor === v}
                                                onChange={function () { setSecC(function (s) { return { ...s, mentor: v }; }); }} style={{ accentColor: p }} />{v}
                                        </label>;
                                    })}
                                </div>
                            </div>
                        </div>
                    </>)}

                    {step === "D" && (<>
                        <SH letter="D" title="Entry Requirements Verification" />
                        <div style={cardSt}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead><tr style={{ background: "#f8fafc" }}>
                                    {["Requirement", "Submitted (Y/N)", "Verified By", "Date"].map(function (h) {
                                        return <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", borderBottom: "2px solid #e2e8f0" }}>{h}</th>;
                                    })}
                                </tr></thead>
                                <tbody>
                                    {secD.map(function (row, i) {
                                        return (
                                            <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                                <td style={{ padding: "10px 12px", fontSize: 13 }}>{row.req}</td>
                                                <td style={{ padding: "8px 12px" }}>
                                                    <select value={row.sub} onChange={function (e) { var v = e.target.value; setSecD(function (d) { return d.map(function (r, j) { return j === i ? { ...r, sub: v } : r; }); }); }}
                                                        style={{ border: "1px solid #e2e8f0", borderRadius: 6, padding: "5px 8px", fontSize: 12, width: 60, outline: "none" }}>
                                                        <option>N</option><option>Y</option>
                                                    </select>
                                                </td>
                                                <td style={{ padding: "8px 12px" }}>
                                                    <input value={row.verBy} onChange={function (e) { var v = e.target.value; setSecD(function (d) { return d.map(function (r, j) { return j === i ? { ...r, verBy: v } : r; }); }); }}
                                                        placeholder="Name" style={{ border: "1px solid #e2e8f0", borderRadius: 6, padding: "5px 8px", fontSize: 12, width: "100%", outline: "none" }} />
                                                </td>
                                                <td style={{ padding: "8px 12px" }}>
                                                    <input type="date" value={row.date} onChange={function (e) { var v = e.target.value; setSecD(function (d) { return d.map(function (r, j) { return j === i ? { ...r, date: v } : r; }); }); }}
                                                        style={{ border: "1px solid #e2e8f0", borderRadius: 6, padding: "5px 8px", fontSize: 12, outline: "none" }} />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>)}

                    {step === "E" && (<>
                        <SH letter="E" title="Entry Assessment (If Required)" />
                        <div style={cardSt}>
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 8, display: "block" }}>Entry Assessment Conducted</label>
                                <div style={{ display: "flex", gap: 20 }}>
                                    {["Yes", "No"].map(function (v) {
                                        return <label key={v} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, cursor: "pointer" }}>
                                            <input type="radio" name="eaConducted" checked={secE.conducted === v}
                                                onChange={function () { setSecE(function (s) { return { ...s, conducted: v }; }); }} style={{ accentColor: p }} />{v}
                                        </label>;
                                    })}
                                </div>
                            </div>
                            {secE.conducted === "Yes" && (
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                    <F label="Date Conducted" val={secE.dateCond} onChange={function (v) { setSecE(function (s) { return { ...s, dateCond: v }; }); }} type="date" />
                                    <F label="Outcome" val={secE.outcome} onChange={function (v) { setSecE(function (s) { return { ...s, outcome: v }; }); }} type="select" options={["Competent - Approved", "Bridging Required", "Not Competent"]} />
                                    <F label="Assessor Name" val={secE.assessor} onChange={function (v) { setSecE(function (s) { return { ...s, assessor: v }; }); }} />
                                    <F label="Signature (type full name)" val={secE.sig} onChange={function (v) { setSecE(function (s) { return { ...s, sig: v }; }); }} />
                                </div>
                            )}
                        </div>
                    </>)}

                    {step === "F" && (<>
                        <SH letter="F" title="Learner Declaration" />
                        <div style={cardSt}>
                            <div style={{ background: "#f8fafc", borderRadius: 8, padding: "14px 16px", marginBottom: 16, fontSize: 13, color: "#334155", lineHeight: 1.8 }}>
                                <div style={{ fontWeight: 700, marginBottom: 8 }}>I confirm that:</div>
                                {["The information provided is true and correct.",
                                    "I meet the minimum entry requirements for this qualification.",
                                    "I understand this is an occupational qualification registered on the OQSF.",
                                    "I must complete Knowledge Modules, Practical Skills Modules, and Workplace Experience.",
                                    "I must be competent in all modules before registration for the EISA.",
                                    "Final certification is issued by the QCTO, not the training provider.",
                                    "I consent to my information being submitted to the QCTO for enrolment and certification purposes."
                                ].map(function (item, i) {
                                    return <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}><span style={{ color: p, flexShrink: 0 }}>•</span><span>{item}</span></div>;
                                })}
                            </div>
                            <label style={{
                                display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20, cursor: "pointer",
                                padding: "12px 14px", background: secF.agreed ? (p + "08") : "#f8fafc", borderRadius: 8, border: "1.5px solid " + (secF.agreed ? p : "#e2e8f0")
                            }}>
                                <input type="checkbox" checked={secF.agreed} onChange={function (e) { var v = e.target.checked; setSecF(function (s) { return { ...s, agreed: v }; }); }}
                                    style={{ accentColor: p, width: 16, height: 16, marginTop: 1, flexShrink: 0 }} />
                                <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>I have read and agree to all declarations above. <span style={{ color: "#EF4444" }}>*</span></span>
                            </label>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                                <F label="Learner Name" val={secF.name} onChange={function (v) { setSecF(function (s) { return { ...s, name: v }; }); }} required />
                                <F label="Signature (type full name)" val={secF.sig} onChange={function (v) { setSecF(function (s) { return { ...s, sig: v }; }); }} required />
                                <F label="Date" val={secF.date} onChange={function (v) { setSecF(function (s) { return { ...s, date: v }; }); }} type="date" />
                            </div>
                        </div>
                    </>)}

                    {step === "G" && (<>
                        <SH letter="G" title="POPIA Consent" />
                        <div style={cardSt}>
                            <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8, padding: "14px 16px", marginBottom: 16, fontSize: 13, color: "#1E40AF", lineHeight: 1.7 }}>
                                In compliance with the <strong>Protection of Personal Information Act, 2013 (Act No. 4 of 2013)</strong>, your information will be collected and processed for training, assessment, enrolment, monitoring and certification purposes.
                            </div>
                            <label style={{
                                display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20, cursor: "pointer",
                                padding: "12px 14px", background: secG.consent ? (p + "08") : "#f8fafc", borderRadius: 8, border: "1.5px solid " + (secG.consent ? p : "#e2e8f0")
                            }}>
                                <input type="checkbox" checked={secG.consent} onChange={function (e) { var v = e.target.checked; setSecG(function (s) { return { ...s, consent: v }; }); }}
                                    style={{ accentColor: p, width: 16, height: 16, marginTop: 1, flexShrink: 0 }} />
                                <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>I consent to the processing of my personal information for training, assessment, enrolment, monitoring and certification purposes. <span style={{ color: "#EF4444" }}>*</span></span>
                            </label>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <F label="Signature (type full name)" val={secG.sig} onChange={function (v) { setSecG(function (s) { return { ...s, sig: v }; }); }} required />
                                <F label="Date" val={secG.date} onChange={function (v) { setSecG(function (s) { return { ...s, date: v }; }); }} type="date" />
                            </div>
                        </div>
                    </>)}

                    {step === "H" && (<>
                        <SH letter="H" title="Provider Authorisation" />
                        <div style={cardSt}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 16 }}>
                                {[["Entry Requirements Verified", "verified"], ["Learner Approved for Enrolment", "approved"]].map(function (pair) {
                                    var lbl = pair[0], key = pair[1];
                                    return (
                                        <div key={key}>
                                            <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 8, display: "block" }}>{lbl}</label>
                                            <div style={{ display: "flex", gap: 20 }}>
                                                {["Yes", "No"].map(function (v) {
                                                    return <label key={v} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, cursor: "pointer" }}>
                                                        <input type="radio" name={"h" + key} checked={secH[key] === v}
                                                            onChange={function () { setSecH(function (s) { var n = { ...s }; n[key] = v; return n; }); }} style={{ accentColor: p }} />{v}
                                                    </label>;
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <F label="QCTO Submission Date" val={secH.qctoDate} onChange={function (v) { setSecH(function (s) { return { ...s, qctoDate: v }; }); }} type="date" />
                                <F label="Authorised Representative Name" val={secH.repName} onChange={function (v) { setSecH(function (s) { return { ...s, repName: v }; }); }} />
                                <F label="Signature" val={secH.sig} onChange={function (v) { setSecH(function (s) { return { ...s, sig: v }; }); }} />
                                <F label="Date" val={secH.date} onChange={function (v) { setSecH(function (s) { return { ...s, date: v }; }); }} type="date" />
                            </div>
                        </div>
                    </>)}

                    {step === "DOCS" && (<>
                        <div style={{ background: s, color: "#fff", borderRadius: "10px 10px 0 0", padding: "12px 18px", fontWeight: 700, fontSize: 14 }}>📎 Supporting Documents</div>
                        <div style={cardSt}>
                            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>Upload all required supporting documents. Outstanding docs will appear in your enrolment record and the admin report.</p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                {Object.keys(DOC_LABELS).map(function (key) {
                                    return (
                                        <div key={key} style={{ padding: "14px", background: docs[key] ? "#F0FDF4" : "#F8FAFC", borderRadius: 10, border: "1.5px solid " + (docs[key] ? "#86EFAC" : "#E2E8F0") }}>
                                            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{DOC_LABELS[key]}</div>
                                            {docs[key]
                                                ? <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span>✅</span><span style={{ fontSize: 11, color: "#15803D", fontWeight: 600 }}>{docs[key]}</span><button onClick={function () { setDocs(function (d) { var n = { ...d }; n[key] = null; return n; }); }} style={{ marginLeft: "auto", background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>✕</button></div>
                                                : <button onClick={function () { fakeUpload(key); }} style={{ background: p, color: "#fff", border: "none", borderRadius: 6, padding: "7px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", width: "100%", marginTop: 4 }}>⬆ Upload File</button>
                                            }
                                        </div>
                                    );
                                })}
                            </div>
                            <div style={{ marginTop: 14, padding: "12px 14px", background: "#FEF9C3", border: "1px solid #FDE68A", borderRadius: 8, fontSize: 12, color: "#92400E" }}>
                                ⚠ Certified ID and Highest Qualification Certificate must not be older than 3 months.
                            </div>

                            {/* Payment section — shown for paid courses */}
                            {course && !course.free && (
                                <div style={{ marginTop: 16, background: "#fff", borderRadius: 12, border: "2px solid #e2e8f0", overflow: "hidden" }}>
                                    <div style={{ background: p, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                                        <span style={{ fontSize: 18 }}>💳</span>
                                        <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Course Fee — R{course.price}</span>
                                        <span style={{ marginLeft: "auto", background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>VAT excl.</span>
                                    </div>
                                    <div style={{ padding: "16px 18px" }}>
                                        <p style={{ fontSize: 13, color: "#475569", marginBottom: 14 }}>
                                            Select your preferred payment method. Your enrolment will be activated once payment is confirmed.
                                        </p>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                            {/* PayShap */}
                                            <div style={{ background: "#f0f9ff", borderRadius: 10, padding: "14px", border: "2px solid #0ea5e940", cursor: "pointer" }}
                                                onClick={function () { notify("PayShap details copied to clipboard!"); }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                    <span style={{ fontSize: 20 }}>⚡</span>
                                                    <div>
                                                        <div style={{ fontWeight: 800, fontSize: 13, color: "#0369a1" }}>PayShap</div>
                                                        <div style={{ fontSize: 10, color: "#10B981", fontWeight: 600 }}>Instant clearing</div>
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: 12, color: "#0369a1", lineHeight: 1.7 }}>
                                                    <div style={{ fontWeight: 700, marginBottom: 2 }}>PayShap ID:</div>
                                                    <div style={{ background: "#fff", borderRadius: 6, padding: "6px 10px", fontWeight: 800, fontSize: 13, color: "#0369a1", marginBottom: 6 }}>{"@skillivio-" + ((course.id) || "lms")}</div>
                                                    <div>Amount: <strong>R{course.price}</strong></div>
                                                    <div>Reference: <strong>your ID number</strong></div>
                                                </div>
                                            </div>
                                            {/* EFT */}
                                            <div style={{ background: "#FEF9C3", borderRadius: 10, padding: "14px", border: "2px solid #FDE68A", cursor: "pointer" }}
                                                onClick={function () { notify("EFT banking details sent to your email!"); }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                    <span style={{ fontSize: 20 }}>🏦</span>
                                                    <div>
                                                        <div style={{ fontWeight: 800, fontSize: 13, color: "#92400E" }}>EFT Transfer</div>
                                                        <div style={{ fontSize: 10, color: "#F59E0B", fontWeight: 600 }}>1–2 business days</div>
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: 12, color: "#92400E", lineHeight: 1.7 }}>
                                                    <div>Bank: <strong>FNB</strong></div>
                                                    <div>Acc: <strong>62 0000 0000</strong></div>
                                                    <div>Branch: <strong>250655</strong></div>
                                                    <div>Ref: <strong>your ID + course name</strong></div>
                                                    <div style={{ marginTop: 6 }}>
                                                        <button onClick={function () { notify("Banking details emailed!"); }}
                                                            style={{ background: "#F59E0B", color: "#fff", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", width: "100%" }}>
                                                            📧 Email Me Banking Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: 12, padding: "8px 12px", background: "#f8fafc", borderRadius: 6, fontSize: 11, color: "#64748b" }}>
                                            ℹ After payment, please upload your proof of payment above. Your enrolment will be activated within 1 business day once verified.
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>)}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                        <div style={{ display: "flex", gap: 8 }}>
                            {stepIdx > 0 && <button onClick={function () { setStep(SECTIONS[stepIdx - 1]); }}
                                style={{ background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>← Previous</button>}
                            {stepIdx < SECTIONS.length - 1 && <button onClick={function () { setStep(SECTIONS[stepIdx + 1]); }}
                                style={{ background: p, color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Next →</button>}
                        </div>
                        <button onClick={handleSubmit} disabled={submitting}
                            style={{ background: submitting ? "#94a3b8" : "#10B981", color: "#fff", border: "none", borderRadius: 8, padding: "11px 28px", fontSize: 14, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer" }}>
                            {submitting ? "Submitting…" : "✓ Submit Enrolment Form"}
                        </button>
                    </div>
                </div>
            </div>
            
        </div>
    );
}
export default EnrolmentForm;