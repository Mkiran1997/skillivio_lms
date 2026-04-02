import { useState } from "react";
import { GLOBAL_CSS } from "../app/globalCss";
import Toast from "./Toast";

function CoursePlayer({ ...props }) {
    // var css = props.css, p = props.p, s = props.s, a = props.a, tenant = props.tenant,
    //     activeCourse = props.activeCourse, notification = props.notification,
    //     notify = props.notify, setView = props.setView, userRole = props.userRole,
    //     activeLesson = props.activeLesson, setActiveLesson = props.setActiveLesson,
    //     setAssessSubmitted = props.setAssessSubmitted;


    const { css, p, s, a, tenant, activeCourse, notification, notify, setView, userRole, activeLesson, setActiveLesson, setAssessSubmitted } = props;

    var [cpTab, setCpTab] = useState("intro");      // intro | instructions | lessons | materials
    var [introAccepted, setIntroAccepted] = useState(false);
    var [instructionsAck, setInstructionsAck] = useState(false);
    var [matSearch, setMatSearch] = useState("");

    var TITLES = ["Introduction & Overview", "Core Concepts", "Practical Application", "Case Studies", "Advanced Techniques", "Assessment Preparation", "Review & Reflection", "Final Assessment"];
    var TYPES = ["VIDEO", "PDF", "VIDEO", "TEXT", "VIDEO", "VIDEO", "TEXT", "VIDEO"];
    var DURS = [12, 8, 18, 5, 22, 15, 10, 6];
    var lessonCount = activeCourse ? (activeCourse.lessons || 8) : 8;
    var lessons = [];
    for (var i = 0; i < lessonCount; i++) {
        lessons.push({ id: "l" + i, title: TITLES[i % 8], type: TYPES[i % 8], duration: DURS[i % 8], completed: activeCourse ? (activeCourse.progress || 0) >= (((i + 1) / lessonCount) * 100) : false });
    }
    var cur = lessons[activeLesson] || lessons[0];

    // Course materials list (simulated — in production fetched from API)
    var MATERIALS = [
        { id: "m1", name: "Course Study Guide.pdf", type: "PDF", size: "2.4 MB", icon: "📄", desc: "Complete study guide covering all modules" },
        { id: "m2", name: "Learner Workbook.pdf", type: "PDF", size: "1.8 MB", icon: "📓", desc: "Exercises and activities workbook" },
        { id: "m3", name: "Reference Manual.pdf", type: "PDF", size: "3.1 MB", icon: "📋", desc: "QCTO reference and compliance manual" },
        { id: "m4", name: "Module Slides — Unit 1.pptx", type: "PPTX", size: "5.6 MB", icon: "📊", desc: "Presentation slides for Module 1" },
        { id: "m5", name: "Module Slides — Unit 2.pptx", type: "PPTX", size: "4.9 MB", icon: "📊", desc: "Presentation slides for Module 2" },
        { id: "m6", name: "Assessment Criteria.pdf", type: "PDF", size: "0.9 MB", icon: "✅", desc: "QCTO assessment criteria and marking rubric" },
        { id: "m7", name: "PoE Guidelines.pdf", type: "PDF", size: "1.2 MB", icon: "📁", desc: "Portfolio of Evidence submission guidelines" },
        { id: "m8", name: "Workplace Logbook Template.xlsx", type: "XLSX", size: "0.4 MB", icon: "📋", desc: "Log your workplace activities here" },
    ];
    var filteredMats = MATERIALS.filter(function (m) {
        return !matSearch || m.name.toLowerCase().includes(matSearch.toLowerCase()) || m.desc.toLowerCase().includes(matSearch.toLowerCase());
    });

    var canProgress = introAccepted && instructionsAck;

    // If learner hasn't accepted yet, redirect from lessons tab
    function handleLessonTabClick() {
        if (!canProgress) { notify("Please read and accept the Introduction and Learner Instructions first.", "error"); return; }
        setCpTab("lessons");
    }

    var NAV_TABS = [
        { id: "intro", label: "📖 Introduction", badge: introAccepted ? "✓" : "!" },
        { id: "instructions", label: "📋 Instructions", badge: instructionsAck ? "✓" : "!" },
        { id: "lessons", label: "🎬 Lessons", badge: lessons.filter(function (l) { return l.completed; }).length + "/" + lessons.length },
        { id: "materials", label: "📦 Course Materials", badge: MATERIALS.length },
    ];

    return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI',system-ui,sans-serif", background: "#f0f2f5" }}>
            <Toast notification={notification} />
            <style>{GLOBAL_CSS}</style>

            {/* ── Left sidebar: course nav ── */}
            <div style={{ width: 280, background: "#fff", borderRight: "1px solid #f1f5f9", display: "flex", flexDirection: "column", flexShrink: 0 }}>
                <div style={{ padding: "16px 18px", background: s }}>
                    <button onClick={function () { setView(userRole === "TENANT_ADMIN" ? "admin" : "learner"); }}
                        style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 12, marginBottom: 8, padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
                        ← Back
                    </button>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>{activeCourse && activeCourse.title}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>NQF {activeCourse && activeCourse.nqf} · {activeCourse && activeCourse.credits || 10} credits</div>
                    <div style={{ marginTop: 10 }}>
                        <div style={{ height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: (activeCourse ? activeCourse.progress : 0) + "%", background: p, borderRadius: 2 }} />
                        </div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{activeCourse && activeCourse.progress}% complete</div>
                    </div>
                </div>

                {/* Tab navigation */}
                <div style={{ padding: "10px 10px 0" }}>
                    {NAV_TABS.map(function (t) {
                        var isActive = cpTab === t.id;
                        var isLocked = (t.id === "lessons" || t.id === "materials") && !canProgress;
                        return (
                            <button key={t.id}
                                onClick={function () { if (t.id === "lessons") { handleLessonTabClick(); } else { setCpTab(t.id); } }}
                                style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "9px 12px", border: "none",
                                    background: isActive ? p + "15" : "transparent", borderRadius: 8, marginBottom: 4, cursor: "pointer",
                                    opacity: isLocked ? 0.5 : 1
                                }}>
                                <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 400, color: isActive ? p : "#475569" }}>{t.label}</span>
                                <span style={{
                                    fontSize: 11, fontWeight: 700,
                                    color: t.badge === "✓" ? "#10B981" : t.badge === "!" ? "#EF4444" : p,
                                    background: t.badge === "✓" ? "#10B98118" : t.badge === "!" ? "#EF444418" : p + "18",
                                    borderRadius: 100, padding: "1px 7px"
                                }}>{t.badge}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Lesson list (only shown when on lessons tab) */}
                {cpTab === "lessons" && canProgress && (
                    <div style={{ flex: 1, overflow: "auto", padding: "8px 10px" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, padding: "8px 4px 4px" }}>LESSONS</div>
                        {lessons.map(function (lesson, i) {
                            return (
                                <button key={i} onClick={function () { setActiveLesson(i); }}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 10px", border: "none",
                                        background: activeLesson === i ? p + "15" : "transparent", borderRadius: 8, cursor: "pointer", marginBottom: 2, textAlign: "left"
                                    }}>
                                    <div style={{
                                        width: 22, height: 22, borderRadius: "50%", background: lesson.completed ? "#10B981" : (activeLesson === i ? p : "#e2e8f0"),
                                        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, flexShrink: 0
                                    }}>
                                        {lesson.completed ? "✓" : i + 1}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 12, fontWeight: activeLesson === i ? 700 : 400, color: activeLesson === i ? p : "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lesson.title}</div>
                                        <div style={{ fontSize: 10, color: "#94a3b8" }}>{lesson.type} · {lesson.duration} min</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Main content area ── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>

                {/* ── TAB: INTRODUCTION ── */}
                {cpTab === "intro" && (
                    <div style={{ flex: 1, padding: "36px 48px", maxWidth: 800, margin: "0 auto", width: "100%" }}>
                        <div style={{ background: "#fff", borderRadius: 16, padding: "36px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                                <div style={{ width: 56, height: 56, background: p + "15", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{activeCourse && activeCourse.thumb || "📘"}</div>
                                <div>
                                    <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0 }}>{activeCourse && activeCourse.title}</h1>
                                    <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>NQF Level {activeCourse && activeCourse.nqf} · {activeCourse && activeCourse.credits || 10} Credits · {activeCourse && activeCourse.cat}</div>
                                </div>
                            </div>

                            <div style={{ background: "#f8fafc", borderRadius: 10, padding: "20px 22px", marginBottom: 20, borderLeft: "4px solid " + p }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>About This Course</h3>
                                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.8, margin: 0 }}>{activeCourse && activeCourse.desc || "This qualification is designed to develop the knowledge, skills, and applied competence required by South African industry. It is aligned to the National Qualifications Framework and registered with SAQA."}</p>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                                {[
                                    ["🎓", "Qualification", "NQF Level " + (activeCourse && activeCourse.nqf || 4)],
                                    ["📊", "Total Credits", (activeCourse && activeCourse.credits || 10) + " NQF Credits"],
                                    ["⏱", "Estimated Duration", (activeCourse && activeCourse.lessons || 8) + " lessons · Self-paced"],
                                    ["🏆", "Assessment", "Final assessment + PoE required"],
                                    ["📋", "Delivery Mode", "Blended Learning"],
                                    ["✅", "Certificate", "Issued on successful completion"],
                                ].map(function (item) {
                                    return (
                                        <div key={item[1]} style={{ display: "flex", alignItems: "center", gap: 10, background: "#f8fafc", borderRadius: 8, padding: "12px 14px" }}>
                                            <span style={{ fontSize: 20 }}>{item[0]}</span>
                                            <div>
                                                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{item[1].toUpperCase()}</div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{item[2]}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div style={{ background: "#f8fafc", borderRadius: 10, padding: "20px 22px", marginBottom: 20 }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>Learning Outcomes</h3>
                                <ul style={{ margin: 0, paddingLeft: 20, color: "#475569", fontSize: 14, lineHeight: 2 }}>
                                    <li>Demonstrate applied competence in the core subject matter of this qualification</li>
                                    <li>Apply theoretical knowledge to practical workplace situations</li>
                                    <li>Complete a Portfolio of Evidence (PoE) demonstrating workplace application</li>
                                    <li>Pass the final assessment with a minimum score of {activeCourse && activeCourse.passingScore || 75}%</li>
                                    <li>Earn {activeCourse && activeCourse.credits || 10} NQF credits towards your qualification</li>
                                </ul>
                            </div>

                            {/* Acceptance checkbox */}
                            <div style={{ background: introAccepted ? "#f0fdf4" : "#fffbeb", borderRadius: 10, padding: "18px 20px", border: "1.5px solid " + (introAccepted ? "#86efac" : "#fde68a") }}>
                                <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                                    <input type="checkbox" checked={introAccepted}
                                        onChange={function (e) { setIntroAccepted(e.target.checked); if (e.target.checked) notify("Introduction acknowledged ✓"); }}
                                        style={{ width: 18, height: 18, marginTop: 2, accentColor: p, flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>I have read and understood the course introduction</div>
                                        <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>By ticking this box, you confirm that you have read the course overview, understand the learning outcomes, and are aware of the assessment requirements. You must acknowledge this before accessing course content.</div>
                                    </div>
                                </label>
                            </div>

                            {introAccepted && (
                                <button onClick={function () { setCpTab("instructions"); }}
                                    style={{ marginTop: 16, background: p, color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                                    Continue to Learner Instructions →
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* ── TAB: LEARNER INSTRUCTIONS ── */}
                {cpTab === "instructions" && (
                    <div style={{ flex: 1, padding: "36px 48px", maxWidth: 800, margin: "0 auto", width: "100%" }}>
                        <div style={{ background: "#fff", borderRadius: 16, padding: "36px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                                <div style={{ width: 44, height: 44, background: "#F59E0B15", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📋</div>
                                <div>
                                    <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0 }}>Learner Instructions</h2>
                                    <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>Please read all instructions carefully before beginning</div>
                                </div>
                            </div>

                            {[
                                {
                                    icon: "🎯", title: "How This Course Works",
                                    body: "This course is delivered in a blended format combining self-paced online learning with workplace application. You will progress through lessons at your own pace, complete activities, and build your Portfolio of Evidence (PoE) from workplace tasks."
                                },
                                {
                                    icon: "📅", title: "Pacing & Deadlines",
                                    body: "You have access to all course materials from your enrolment date. Your facilitator will communicate specific submission deadlines for your cohort. Complete each module before moving to the next. Reach out to your facilitator if you fall behind."
                                },
                                {
                                    icon: "📁", title: "Portfolio of Evidence (PoE)",
                                    body: "The PoE is a collection of evidence that demonstrates your workplace competence. You must gather evidence from real work activities as you progress through the course. Your facilitator will provide a PoE guide in the Course Materials tab. Upload your PoE before the submission deadline."
                                },
                                {
                                    icon: "💬", title: "Communication & Support",
                                    body: "Contact your facilitator via the Support tab or by email if you have questions. Expected response time is 1–2 business days. Technical issues should be reported via the platform Support ticket system."
                                },
                                {
                                    icon: "✅", title: "Assessment Rules",
                                    body: "The final assessment must be completed individually without assistance. You may attempt the assessment up to 3 times. A minimum score of " + (activeCourse && activeCourse.passingScore || 75) + "% is required to pass. Plagiarism will result in disqualification."
                                },
                                {
                                    icon: "🔒", title: "Integrity & Conduct",
                                    body: "All submitted work must be your own. You agree to uphold the principles of academic integrity throughout this course. Sharing assessment questions or answers with other learners is strictly prohibited and may result in your enrolment being cancelled."
                                },
                            ].map(function (section) {
                                return (
                                    <div key={section.title} style={{ marginBottom: 16, background: "#f8fafc", borderRadius: 10, padding: "18px 20px", border: "1px solid #e2e8f0" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                                            <span style={{ fontSize: 20 }}>{section.icon}</span>
                                            <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{section.title}</span>
                                        </div>
                                        <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.8, margin: 0 }}>{section.body}</p>
                                    </div>
                                );
                            })}

                            {/* Acknowledgement checkbox */}
                            <div style={{ background: instructionsAck ? "#f0fdf4" : "#fffbeb", borderRadius: 10, padding: "18px 20px", border: "1.5px solid " + (instructionsAck ? "#86efac" : "#fde68a"), marginTop: 8 }}>
                                <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                                    <input type="checkbox" checked={instructionsAck}
                                        onChange={function (e) { setInstructionsAck(e.target.checked); if (e.target.checked) notify("Instructions acknowledged ✓"); }}
                                        style={{ width: 18, height: 18, marginTop: 2, accentColor: p, flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>I acknowledge and accept these learner instructions</div>
                                        <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>By ticking this box you confirm that you have read and understood all learner instructions, including the PoE requirements, assessment rules, and code of conduct. This acknowledgement is recorded against your learner profile.</div>
                                    </div>
                                </label>
                            </div>

                            {instructionsAck && (
                                <button onClick={function () { setCpTab("lessons"); }}
                                    style={{ marginTop: 16, background: p, color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                                    Begin Course Content →
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* ── TAB: LESSONS (original video/PDF/text player) ── */}
                {cpTab === "lessons" && canProgress && (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        <div style={{ background: "#fff", padding: "14px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: 0 }}>{cur.title}</h2>
                                <span style={{ fontSize: 11, color: "#94a3b8" }}>{cur.type} · {cur.duration} min</span>
                            </div>
                            <button onClick={function () { notify("Marked complete!"); }}
                                style={{ background: "#10B981", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                                ✓ Mark Complete
                            </button>
                        </div>
                        <div style={{ flex: 1, padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            {cur.type === "VIDEO" && (
                                <div style={{ width: "100%", maxWidth: 720, background: "#000", borderRadius: 12, aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <div style={{ textAlign: "center", color: "#fff" }}>
                                        <div style={{ fontSize: 64, marginBottom: 16 }}>▶</div>
                                        <div style={{ fontSize: 16, fontWeight: 600 }}>Video Lesson</div>
                                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{cur.duration} minutes</div>
                                    </div>
                                </div>
                            )}
                            {cur.type === "PDF" && (
                                <div style={{ background: "#fff", borderRadius: 12, padding: "40px", maxWidth: 600, width: "100%", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", textAlign: "center" }}>
                                    <div style={{ fontSize: 64, marginBottom: 16 }}>📄</div>
                                    <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>PDF Resource</div>
                                    <div style={{ color: "#64748b", marginBottom: 20 }}>Download and review this lesson material</div>
                                    <button onClick={function () { notify("PDF downloaded!"); }} style={{ background: p, color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 600, cursor: "pointer" }}>⬇ Download PDF</button>
                                </div>
                            )}
                            {cur.type === "TEXT" && (
                                <div style={{ background: "#fff", borderRadius: 12, padding: "40px", maxWidth: 680, width: "100%", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: "#0f172a" }}>{cur.title}</h3>
                                    <p style={{ color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>This lesson covers the key concepts and practical applications related to the topic. Work through the reading carefully and take notes for your PoE.</p>
                                    <p style={{ color: "#475569", lineHeight: 1.8 }}>Apply these principles in your workplace context and document your examples in your Portfolio of Evidence.</p>
                                </div>
                            )}
                        </div>
                        <div style={{ background: "#fff", padding: "14px 24px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between" }}>
                            <button onClick={function () { if (activeLesson > 0) setActiveLesson(activeLesson - 1); }}
                                disabled={activeLesson === 0}
                                style={{ background: "#f1f5f9", color: activeLesson === 0 ? "#cbd5e1" : "#475569", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: activeLesson === 0 ? "default" : "pointer" }}>
                                ← Previous
                            </button>
                            <button onClick={function () { if (activeLesson < lessons.length - 1) setActiveLesson(activeLesson + 1); else { setAssessSubmitted(false); setView("assessment"); } }}
                                style={{ background: p, color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                                {activeLesson < lessons.length - 1 ? "Next →" : "Take Assessment →"}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── TAB: COURSE MATERIALS ── */}
                {cpTab === "materials" && (
                    <div style={{ flex: 1, padding: "28px 36px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <div>
                                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0 }}>Course Materials</h2>
                                <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{MATERIALS.length} files available for download</div>
                            </div>
                            <input
                                style={{ border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 14px", fontSize: 13, width: 240, outline: "none" }}
                                placeholder="🔍 Search materials..."
                                value={matSearch}
                                onChange={function (e) { setMatSearch(e.target.value); }} />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            {filteredMats.map(function (mat) {
                                var typeColor = mat.type === "PDF" ? "#EF4444" : mat.type === "PPTX" ? "#F59E0B" : mat.type === "XLSX" ? "#10B981" : "#6366F1";
                                return (
                                    <div key={mat.id} style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", display: "flex", gap: 14, alignItems: "flex-start", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                                        <div style={{ width: 44, height: 44, background: typeColor + "15", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{mat.icon}</div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 600, fontSize: 13, color: "#0f172a", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mat.name}</div>
                                            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10, lineHeight: 1.5 }}>{mat.desc}</div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <span style={{ background: typeColor + "18", color: typeColor, borderRadius: 4, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>{mat.type}</span>
                                                <span style={{ fontSize: 11, color: "#94a3b8" }}>{mat.size}</span>
                                                <button onClick={function () { notify("Downloading: " + mat.name); }}
                                                    style={{ marginLeft: "auto", background: p, color: "#fff", border: "none", borderRadius: 6, padding: "5px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                                                    ⬇ Download
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {filteredMats.length === 0 && (
                                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px", color: "#94a3b8", fontSize: 14 }}>
                                    No materials found matching &quot;{matSearch}&quot;
                                </div>
                            )}
                        </div>

                        {!canProgress && (
                            <div style={{ marginTop: 20, background: "#FEF2F2", borderRadius: 10, padding: "14px 18px", border: "1px solid #FECACA", fontSize: 13, color: "#991B1B" }}>
                                ⚠ Please complete the Introduction and Learner Instructions to unlock full course access.
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
export default CoursePlayer;