import { useState } from "react";
import { QUESTIONS } from "../app/mockData";
import { GLOBAL_CSS } from "../app/globalCss";
import Toast from "./Toast";
import AssessmentTimer from "./AssessmentTimer";

function AssessmentView({ ...props }) {
    // var css = props.css, p = props.p, s = props.s, tenant = props.tenant,
    //     activeCourse = props.activeCourse, notification = props.notification,
    //     setAssessSubmitted = props.setAssessSubmitted, setView = props.setView;

    const { css, p, s, tenant, activeCourse, notification, setAssessSubmitted, setView } = props;

    var [sub, setSub] = useState(null);
    var [ans, setAns] = useState({});

    function handleSubmit(timedOut  ) {
        var score = 0, total = 0;
        QUESTIONS.forEach(function (q) {
            total += q.points;
            var av = ans[q.id];
            if (q.type === "MCQ" && av === q.correct) score += q.points;
            if (q.type === "TRUE_FALSE" && av === q.correct) score += q.points;
            if (q.type === "SHORT_ANSWER" && av && av.toLowerCase().indexOf("stakeholder") >= 0) score += q.points;
        });
        var result   = { score: score, total: total, pct: Math.round(score / total * 100), timedOut: !!timedOut };
        setAssessSubmitted(result);
        setSub(result);
    }

    var passing = activeCourse ? activeCourse.nqf >= 5 ? 75 : 70 : 75;

    return (
        <div style={{ minHeight: "100vh", background: "#f0f2f5", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
            <Toast notification={notification} />
            <style>{GLOBAL_CSS}</style>
            <div style={{ background: s, padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 32, height: 32, background: p, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff" }}>{tenant.logo}</div>
                    <span style={{ color: "#fff", fontWeight: 700 }}>Assessment: {activeCourse && activeCourse.title}</span>
                </div>
                {!sub && <AssessmentTimer total={2700} onExpire={function () { handleSubmit(true); }} color={p} />}
                {sub && <button onClick={function () { setView("course"); }} style={css.btnOut("rgba(255,255,255,0.5)", true)}>← Back to Course</button>}
            </div>
            <div style={{ maxWidth: 720, margin: "40px auto", padding: "0 20px" }}>
                {!sub ? (
                    <div className="fade">
                        <div style={{ ...css.card, marginBottom: 20, background: s, padding: "24px 28px" }}>
                            <h2 style={{ ...css.h2, color: "#fff", marginBottom: 4 }}>Final Assessment</h2>
                            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{QUESTIONS.length} questions • Pass mark: {passing}%</p>
                        </div>
                        {QUESTIONS.map(function (q  , qi) {
                            return (
                                <div key={q.id} style={{ ...css.card, marginBottom: 16 }}>
                                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
                                        <div style={{ width: 28, height: 28, background: p + "18", color: p, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{qi + 1}</div>
                                        <div style={{ flex: 1 }}>
                                            <span style={{ ...css.tag(p), marginBottom: 8, display: "inline-block" }}>{q.type.replace("_", " ")} • {q.points} pts</span>
                                            <p style={{ fontWeight: 600, fontSize: 15, margin: 0, lineHeight: 1.5 }}>{q.text}</p>
                                        </div>
                                    </div>
                                    {q.type === "MCQ" && (
                                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginLeft: 40 }}>
                                            {q.options.map(function (opt  , oi  ) {
                                                return (
                                                    <label key={oi} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, border: "2px solid " + (ans[q.id] === oi ? p : "#e2e8f0"), background: ans[q.id] === oi ? (p + "0f") : "#f8fafc", cursor: "pointer" }}>
                                                        <input type="radio" name={q.id} checked={ans[q.id] === oi}
                                                            onChange={function () { var id = q.id; setAns(function (prev  ) { var n = { ...prev }; n[id] = oi; return n; }); }}
                                                            style={{ accentColor: p }} />
                                                        <span style={{ fontSize: 14 }}>{opt}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {q.type === "TRUE_FALSE" && (
                                        <div style={{ display: "flex", gap: 12, marginLeft: 40 }}>
                                            {["true", "false"].map(function (v) {
                                                return (
                                                    <label key={v} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 24px", borderRadius: 8, border: "2px solid " + (ans[q.id] === v ? p : "#e2e8f0"), background: ans[q.id] === v ? (p + "0f") : "#f8fafc", cursor: "pointer", textTransform: "capitalize", fontWeight: 600 }}>
                                                        <input type="radio" name={q.id} checked={ans[q.id] === v}
                                                            onChange={function () { var id = q.id; setAns(function (prev  ) { var n = { ...prev }; n[id] = v; return n; }); }}
                                                            style={{ accentColor: p }} />{v}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {q.type === "SHORT_ANSWER" && (
                                        <textarea style={{ ...css.input, resize: "vertical", minHeight: 80 }}
                                            placeholder="Type your answer…"
                                            value={ans[q.id] || ""}
                                            onChange={function (e) { var id = q.id, v = e.target.value; setAns(function (prev  ) { var n = { ...prev }; n[id] = v; return n; }); }} />
                                    )}
                                </div>
                            );
                        })}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                            <span style={{ fontSize: 13, color: "#64748b" }}>{Object.keys(ans).length}/{QUESTIONS.length} answered</span>
                            <button onClick={function () { handleSubmit(false); }} style={{ ...css.btn(p), padding: "12px 32px", fontSize: 15 }}>Submit Assessment →</button>
                        </div>
                    </div>
                ) : (
                    <div className="fade" style={{ textAlign: "center" }}>
                        <div style={{ ...css.card, padding: "48px 40px" }}>
                            {sub.timedOut && <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 8, padding: "10px 16px", marginBottom: 20, fontSize: 13, color: "#92400E", fontWeight: 600 }}>⏱ Time expired — auto-submitted</div>}
                            <div style={{ fontSize: 64, marginBottom: 20 }}>{sub.pct >= passing ? "🏆" : "📝"}</div>
                            <h2 style={{ ...css.h2, fontSize: 28, marginBottom: 8 }}>{sub.pct >= passing ? "Congratulations! You Passed!" : "Keep Practising"}</h2>
                            <div style={{ fontSize: 52, fontWeight: 900, color: sub.pct >= passing ? "#10B981" : "#EF4444", margin: "20px 0" }}>{sub.pct}%</div>
                            <p style={{ color: "#64748b" }}>{sub.score}/{sub.total} points • Pass mark: {passing}%</p>
                            {sub.pct >= passing && <p style={{ color: "#10B981", fontWeight: 600, marginTop: 8 }}>✓ Certificate being generated…</p>}
                            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
                                <button onClick={function () { setView("certificate"); }} style={css.btn(sub.pct >= passing ? "#10B981" : p)}>
                                    {sub.pct >= passing ? "🎓 View Certificate" : "Retake"}
                                </button>
                                <button onClick={function () { setView("course"); }} style={css.btnOut(p)}>Back to Course</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default AssessmentView;