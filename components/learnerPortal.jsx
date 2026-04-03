import React, { useEffect, useState } from "react";
import { usePagination } from "../app/utility";
import { GLOBAL_CSS } from "../app/globalCss";
import AdminSidebar from "./adminSidebar";
import StatCard from "./statCard";
import PaginationBar from "./paginationBar";
import EnrolmentForm from "./enrolmentForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "@/store/slices/courseSlice";
import { fetchEnrollment } from "@/store/slices/enrollmentSlice";

function LearnerPortal({ ...props }) {
    // var p = props.p, s = props.s, a = props.a, css = props.css,
    //     notify = props.notify, notification = props.notification,
    //     tenant = props.tenant, currentTenant = props.currentTenant,
    //     userRole = props.userRole, currentUser = props.currentUser,
    //     logout = props.logout, setView = props.setView,
    //     courses = props.courses, openCourse = props.openCourse, uploadingForCourse = props.uploadingForCourse;


    const { Course, loading, error } = useSelector(state => state.course);
    const { Enrollment } = useSelector(state => state.enrollment);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCourses())
    }, [dispatch]);


    const { setUploadingForCourse, setCourseFiles, courseFiles, p, s, a, css, notify, notification, tenant, currentTenant, userRole, currentUser, logout, setView, courses, openCourse, uploadingForCourse } = props;
    var [tab, setTab] = useState("home");
    const [uploadedFilesByCourse, setUploadedFilesByCourse] = useState({});
    var [enrollingCourse, setEnrolling] = useState(null);
    var [myEnrolments, setMyEnrolments] = useState([]);
    var myCourses = courses.filter(function (c) { return c.progress > 0 || c.id === "c3"; });
    var browseable = Course.filter(function (c) { return c.status === "PUBLISHED"; });
    var browsePag = usePagination(browseable, 6);
    const userCourses = Enrollment.map((course) => course.courseId);
    console.log(userCourses)
    var myCourPag = usePagination(userCourses,4);

    var SB_ITEMS = [
        { id: "home", icon: "🏠", label: "My Dashboard" },
        { id: "courses", icon: "📚", label: "My Courses", badge: userCourses.length },
        { id: "browse", icon: "🔍", label: "Browse Courses" },
        { id: "enrolments", icon: "📋", label: "My Enrolments", badge: Enrollment.length || undefined },
        { id: "certificates", icon: "🏆", label: "Certificates", badge: "1" },
        { id: "community", icon: "💬", label: "Community" },
    ];

    useEffect(() => {
        dispatch(fetchEnrollment());
    }, [dispatch])


    const handleFileUpload = (event, courseId) => {
        const files = Array.from(event.target.files); // convert FileList to array

        const validFiles = files.filter(
            (file) => file.type === "text/plain" || file.type === "application/pdf"
        );

        if (validFiles.length === 0) {
            alert("Please select only text (.txt) or PDF (.pdf) files.");
            return;
        }

        setUploadedFilesByCourse((prev) => ({
            ...prev,
            [courseId]: validFiles, // store files under this course ID
        }));

        console.log(`Uploaded files for course ${courseId}:`, validFiles);
    };

    const openFile = (file) => {
        if (file.type === "application/pdf") {
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        } else if (file.type === "text/plain") {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const newWindow = window.open();
                newWindow.document.write(`<pre>${text}</pre>`);
            };
            reader.readAsText(file);
        }
    };
    return (
        <div style={{ display: "flex", ...css.page }}>
            <style>{GLOBAL_CSS}</style>
            {/* ── Course Materials Upload Modal ── */}
            {uploadingForCourse && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
                    <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 620, boxShadow: "0 40px 100px rgba(0,0,0,0.25)", animation: "fadeIn 0.2s ease", maxHeight: "85vh", overflowY: "auto" }}>
                        <div style={{ background: s, padding: "20px 28px", borderRadius: "16px 16px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>📦 Course Materials</div>
                                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 2 }}>{uploadingForCourse.title}</div>
                            </div>
                            <button onClick={function () { setUploadingForCourse(null); }} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>✕ Close</button>
                        </div>

                        <div style={{ padding: "24px 28px" }}>
                            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20, lineHeight: 1.7 }}>
                                Upload documents, slides, workbooks, and other resources for this course. Learners can download these from the Course Materials tab inside the course player.
                            </p>

                            {/* Upload drop zone */}
                            <div style={{ border: "2px dashed #e2e8f0", borderRadius: 12, padding: "32px", textAlign: "center", background: "#f8fafc", marginBottom: 20, cursor: "pointer" }}
                                onClick={function () {
                                    var fname = prompt("Enter file name to simulate upload (e.g. Study Guide.pdf):", "Study Guide.pdf");
                                    if (!fname) return;
                                    var ext = fname.split(".").pop().toUpperCase();
                                    var newFile = { id: "f" + Date.now(), name: fname, type: ext, size: (Math.random() * 4 + 0.5).toFixed(1) + " MB", uploaded: new Date().toLocaleDateString("en-ZA") };
                                    setCourseFiles(function (cf) { var id = uploadingForCourse.id; var existing = cf[id] || []; return { ...cf, [id]: existing.concat([newFile]) }; });
                                    notify('"' + fname + '" uploaded successfully!');
                                }}>
                                <div style={{ fontSize: 40, marginBottom: 10 }}>📁</div>
                                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 4 }}>Click to upload a file</div>
                                <div style={{ fontSize: 12, color: "#94a3b8" }}>PDF, PPTX, DOCX, XLSX, MP4, ZIP — max 50 MB per file</div>
                            </div>

                            {/* File type quick-add buttons */}
                            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                                {[["📄 Study Guide", "Study Guide.pdf"], ["📓 Workbook", "Learner Workbook.pdf"], ["📊 Slides", "Module Slides.pptx"], ["✅ Assessment Criteria", "Assessment Criteria.pdf"], ["📁 PoE Guidelines", "PoE Guidelines.pdf"], ["📋 Logbook", "Workplace Logbook.xlsx"]].map(function (item) {
                                    return (
                                        <button key={item[0]} onClick={function () {
                                            var ext = item[1].split(".").pop().toUpperCase();
                                            var newFile = { id: "f" + Date.now(), name: item[1], type: ext, size: (Math.random() * 3 + 0.5).toFixed(1) + " MB", uploaded: new Date().toLocaleDateString("en-ZA") };
                                            setCourseFiles(function (cf) { var id = uploadingForCourse.id; var existing = cf[id] || []; return { ...cf, [id]: existing.concat([newFile]) }; });
                                            notify('"' + item[1] + '" added!');
                                        }}
                                            style={{ background: p + "12", color: p, border: "1px solid " + p + "30", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                                            {item[0]}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Uploaded files list */}
                            {(courseFiles[uploadingForCourse.id] || []).length > 0 && (
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 10, letterSpacing: 0.5 }}>UPLOADED FILES ({(courseFiles[uploadingForCourse.id] || []).length})</div>
                                    {(courseFiles[uploadingForCourse.id] || []).map(function (file) {
                                        var typeColor = file.type === "PDF" ? "#EF4444" : file.type === "PPTX" ? "#F59E0B" : file.type === "XLSX" ? "#10B981" : "#6366F1";
                                        return (
                                            <div key={file.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#f8fafc", borderRadius: 8, marginBottom: 8, border: "1px solid #e2e8f0" }}>
                                                <div style={{ width: 36, height: 36, background: typeColor + "15", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>📄</div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontWeight: 600, fontSize: 13, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
                                                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{file.type} · {file.size} · {file.uploaded}</div>
                                                </div>
                                                <span style={{ background: typeColor + "18", color: typeColor, borderRadius: 4, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>{file.type}</span>
                                                <button onClick={function () { setCourseFiles(function (cf) { var id = uploadingForCourse.id; return { ...cf, [id]: (cf[id] || []).filter(function (f) { return f.id !== file.id; }) }; }); notify(file.name + " removed"); }}
                                                    style={{ background: "none", border: "none", cursor: "pointer", color: "#EF4444", fontSize: 16, padding: "2px 6px" }}>✕</button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {(courseFiles[uploadingForCourse.id] || []).length === 0 && (
                                <div style={{ textAlign: "center", padding: "16px", color: "#94a3b8", fontSize: 13 }}>No files uploaded yet for this course.</div>
                            )}

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
                                <button onClick={function () { setUploadingForCourse(null); }} style={css.btn(p)}>Done</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <AdminSidebar tab={tab} setTab={setTab} items={SB_ITEMS}
                tenant={tenant} p={p} s={s} css={css}
                currentUser={currentUser} userRole={userRole}
                currentTenant={currentTenant} logout={logout}
                notification={notification} />
            <div style={css.main}>
                {tab === "home" && (
                    <div className="fade">
                        <h1 style={{ ...css.h1, marginBottom: 4 }}>Good morning, {currentUser ? currentUser.name.split(" ")[0] : "Learner"} 👋</h1>
                        <p style={{ color: "#64748b", marginBottom: 24 }}>Continue where you left off</p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                            <StatCard icon="📚" value={myCourses.length} label="Enrolled" color={p} />
                            <StatCard icon="🏆" value={myCourses.filter(function (c) { return c.progress === 100; }).length} label="Completed" color="#10B981" />
                            <StatCard icon="📈" value={Math.round(myCourses.reduce(function (s, c) { return s + c.progress; }, 0) / Math.max(myCourses.length, 1)) + "%"} label="Avg Progress" color={a} />
                            <StatCard icon="⭐" value="18" label="Credits Earned" color="#8B5CF6" />
                        </div>
                        <div style={{ ...css.card, marginBottom: 16 }}>
                            <h3 style={{ ...css.h3, marginBottom: 16 }}>Continue Learning</h3>
                            {myCourses.filter(function (c) { return c.progress > 0 && c.progress < 100; }).map(function (c) {
                                return (
                                    <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: "1px solid #f8fafc" }}>
                                        <div style={{ width: 44, height: 44, background: p + "18", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{c.thumb}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, fontSize: 14 }}>{c.title}</div>
                                            <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, margin: "6px 0", overflow: "hidden" }}>
                                                <div style={{ height: "100%", width: c.progress + "%", background: p, borderRadius: 3 }} />
                                            </div>
                                            <div style={{ fontSize: 11, color: "#94a3b8" }}>{c.progress}% complete</div>
                                        </div>
                                        <button onClick={function () { openCourse(c); }} style={css.btn(p, "#fff", true)}>Continue</button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {tab === "browse" && (
                    <div className="fade">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <h1 style={css.h1}>Browse Courses</h1>
                            <input style={{ ...css.input, width: 240 }} placeholder="🔍 Search courses…" />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
                            {browsePag.slice.map(function (course) {
                                return (
                                    <div key={course.id} style={{ ...css.card, padding: 0, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}
                                        onMouseEnter={function (e) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)"; }}
                                        onMouseLeave={function (e) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.07)"; }}>
                                        <div style={{ background: s, padding: "24px 20px", textAlign: "center" }}>
                                            <div style={{ fontSize: 40 }}>{course.thumb}</div>
                                        </div>
                                        <div style={{ padding: "16px 18px" }}>
                                            <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                                                <span style={{ ...css.tag(p), fontSize: 10 }}>{course.level}</span>
                                                <span style={{ ...css.tag("#64748b"), fontSize: 10 }}>NQF {course.nqf}</span>
                                            </div>
                                            <h3 style={{ ...css.h3, fontSize: 14, marginBottom: 6 }}>{course.title}</h3>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                                                <div>
                                                    <div style={{ fontSize: 16, fontWeight: 800, color: course.free ? "#10B981" : p }}>
                                                        {course.free ? "FREE" : "R" + course.price}
                                                    </div>
                                                    {!course.free && (
                                                        <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>PayShap · EFT</div>
                                                    )}
                                                </div>
                                                <button onClick={function () { setEnrolling(course); }}
                                                    style={css.btn(p, "#fff", true)}>Enroll</button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <PaginationBar {...browsePag} perPage={6} color={p} />
                    </div>
                )}

                {tab === "courses" && (
                    <div className="fade">
                        <h1 style={{ ...css.h1, marginBottom: 24 }}>My Courses</h1>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
                            {myCourPag.slice?.map(function (c) {
                                return (
                                    <div key={c.id} style={{ ...css.card, display: "flex", gap: 14 }}>
                                        <div style={{ width: 52, height: 52, background: p + "18", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{c.thumb}</div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{c.title}</div>
                                            <div style={{ height: 5, background: "#f1f5f9", borderRadius: 2, overflow: "hidden", marginBottom: 4 }}>
                                                <div style={{ height: "100%", width: c.progress + "%", background: c.progress === 100 ? "#10B981" : p }} />
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span style={{ fontSize: 11, color: "#94a3b8" }}>{c.progress}%</span>
                                                <div style={{ display: "flex", gap: 5 }}>
                                                    <div style={{ display: "flex", gap: 5 }}>
                                                        <input
                                                            type="file"
                                                            accept=".txt,.pdf"
                                                            style={{ display: "none" }}
                                                            id={`fileUpload-${c.id}`} // unique ID per course
                                                            onChange={(e) => handleFileUpload(e, c.id)} // pass course ID
                                                        />
                                                        <div style={{ backgroundColor: "#007BFF", color: "#fff", padding: "10px", border: "none", borderRadius: "4px" }}>
                                                            Practical
                                                        </div>
                                                        {uploadedFilesByCourse[c.id]?.length > 0 && (
                                                            <div>
                                                                <ul>
                                                                    {uploadedFilesByCourse[c.id].map((file, index) => (
                                                                        <li key={index} style={{ marginTop: 5 }}>

                                                                            <button
                                                                                onClick={() => openFile(file)}
                                                                                style={{
                                                                                    marginLeft: 10,
                                                                                    padding: "2px 5px",
                                                                                    backgroundColor: "#4CAF50",
                                                                                    color: "#fff",
                                                                                    border: "none",
                                                                                    borderRadius: 3,
                                                                                }}
                                                                            >
                                                                                Open
                                                                            </button>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                    </div>

                                                    {c.progress === 100
                                                        ? <span style={{ ...css.tag("#10B981"), fontSize: 10, paddingTop: 10 }}>Completed</span>
                                                        : <button onClick={function () { openCourse(c); }} style={css.btn(p, "#fff", true)}>Continue</button>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                        <PaginationBar {...myCourPag} perPage={4} color={p} />
                    </div>
                )}

                {tab === "enrolments" && (
                    <div className="fade">
                        <h1 style={{ ...css.h1, marginBottom: 24 }}>My Enrolments</h1>
                        {Enrollment.length === 0
                            ? <div style={{ ...css.card, textAlign: "center", padding: "48px" }}>
                                <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                                <h3 style={css.h3}>No Enrolments Yet</h3>
                                <p style={{ color: "#94a3b8", marginTop: 8, marginBottom: 20 }}>Browse courses and click Enroll to complete the QCTO enrolment form.</p>
                                <button onClick={function () { setTab("browse"); }} style={css.btn(p)}>Browse Courses →</button>
                            </div>
                            : Enrollment.map(function (rec, i) {
                                var docKeys = ["certifiedId", "highestQual", "cv", "studyPermit", "workplaceConf", "entryAssessment"];
                                var uploaded = docKeys.filter(function (k) { return rec.docs && rec.docs[k]; }).length;
                                return (
                                    <div key={i} style={{ ...css.card, marginBottom: 12 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: 15 }}>{rec.courseId && rec.courseId.title}</div>
                                                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>NQF {rec.courseId && rec.courseId.nqf} • {rec.courseId && rec.courseId.credits} Credits • {rec.personal && rec.personal.mode}</div>
                                            </div>
                                            <span style={{ ...css.tag("#10B981") }}>✓ Enrolled</span>
                                        </div>
                                        <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
                                            <div style={{ fontSize: 12 }}><span style={{ color: "#64748b" }}>Documents: </span>
                                                <span style={{ fontWeight: 700, color: uploaded === docKeys.length ? "#10B981" : "#F59E0B" }}>{uploaded}/{docKeys.length} uploaded</span>
                                            </div>
                                            <div style={{ fontSize: 12 }}><span style={{ color: "#64748b" }}>POPIA: </span>
                                                <span style={{ fontWeight: 700, color: rec.popia && rec.popia.consent ? "#10B981" : "#EF4444" }}>{rec.popia && rec.popia.consent ? "✓ Consented" : "⚠ Pending"}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                )}

                {tab === "certificates" && (
                    <div className="fade">
                        <h1 style={{ ...css.h1, marginBottom: 24 }}>My Certificates</h1>
                        <div style={{ ...css.card, padding: 0, overflow: "hidden" }}>
                            <div style={{ background: s, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ color: "#fff" }}><div style={{ fontWeight: 800, fontSize: 16 }}>Financial Accounting Principles</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>NQF 5 • 18 Credits • Score: 88%</div></div>
                                <div style={{ fontSize: 36 }}>🏆</div>
                            </div>
                            <div style={{ padding: "16px 24px", display: "flex", gap: 12 }}>
                                <button onClick={function () { setView("certificate"); }} style={css.btn(p, "#fff", true)}>View</button>
                                <button onClick={function () { notify("PDF downloaded!"); }} style={css.btnOut(p, true)}>⬇ PDF</button>
                                <button onClick={function () { notify("Shared to LinkedIn!"); }} style={css.btn("#0A66C2", "#fff", true)}>in LinkedIn</button>
                            </div>
                        </div>
                    </div>
                )}

                {tab === "community" && (
                    <div className="fade">
                        <h1 style={{ ...css.h1, marginBottom: 24 }}>Community</h1>
                        <div style={{ ...css.card, textAlign: "center", padding: "60px" }}>
                            <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
                            <h3 style={css.h3}>Discussion Forums</h3>
                            <p style={{ color: "#64748b", marginTop: 8 }}>Connect with fellow learners and facilitators</p>
                        </div>
                    </div>
                )}
            </div>

            {enrollingCourse && (
                <EnrolmentForm
                    course={enrollingCourse}
                    learnerUser={currentUser}
                    onSubmit={function (record) {
                        setMyEnrolments(function (prev) { return prev.concat([record]); });
                        setEnrolling(null);
                        notify("Enrolment for \"" + enrollingCourse.title + "\" submitted successfully!");
                        openCourse(enrollingCourse);
                    }}
                    onCancel={function () { setEnrolling(null); }}
                    p={p} s={s} notify={notify}
                />
            )}
        </div>
    );
}
export default LearnerPortal;