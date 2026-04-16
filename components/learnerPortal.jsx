import React, { useEffect, useMemo, useState } from "react";
import { usePagination } from "@/utils/utility";
import { GLOBAL_CSS } from "@/utils/globalCss";
import AdminSidebar from "./adminSidebar";
import StatCard from "./statCard";
import PaginationBar from "./paginationBar";
import EnrolmentForm from "./enrolmentForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "@/store/slices/courseSlice";
import { fetchEnrollment } from "@/store/slices/enrollmentSlice";
import { fetchlessonStatus } from "@/store/slices/lessonStatusSlice";

function LearnerPortal({ ...props }) {
    const { setUploadingForCourse, setCourseFiles, courseFiles, p, s, a, css, notify, notification, tenant, currentTenant, userRole, currentUser, logout, setView, courses, openCourse, uploadingForCourse } = props;
    const { Course, loading, error } = useSelector(state => state.course);
    const { Enrollment } = useSelector(state => state.enrollment);
    const { lessonStatus } = useSelector((state) => state.lessonStatus);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCourses());
        dispatch(fetchEnrollment());
        dispatch(fetchlessonStatus());

    }, [dispatch]);

    const userEnrollment = useMemo(() => {
        return Enrollment.filter((enroll) => enroll?.learnerId?.userId === currentUser?._id)
    }, [Enrollment, currentUser])


    var [tab, setTab] = useState("home");
    const [uploadedFilesByCourse, setUploadedFilesByCourse] = useState({});
    var [enrollingCourse, setEnrolling] = useState(null);
    var [myEnrolments, setMyEnrolments] = useState([]);
    var myCourses = Enrollment.filter((enrol) => enrol?.learnerId?.userId === currentUser?._id);
    var browseable = Course.filter(function (c) { return c?.status === "published" && currentUser?.tenantId?.slug === c?.type });
    var browsePag = usePagination(browseable, 6);
    var myCourPag = usePagination(myCourses, 4);


    var SB_ITEMS = [
        { id: "home", icon: "🏠", label: "My Dashboard" },
        { id: "courses", icon: "📚", label: "My Courses", badge: myCourses?.length },
        { id: "browse", icon: "🔍", label: "Browse Courses" },
        { id: "enrolments", icon: "📋", label: "My Enrolments", badge: userEnrollment?.length || undefined },
        { id: "certificates", icon: "🏆", label: "Certificates", badge: myCourses?.length === 0 ? "0" : "1" },
        // { id: "community", icon: "💬", label: "Community" },
    ]




    const handleFileUpload = (event, courseId) => {
        const files = Array.from(event.target.files); // convert FileList to array

        const validFiles = files.filter(
            (file) => file?.type === "text/plain" || file?.type === "application/pdf"
        );

        if (validFiles?.length === 0) {
            alert("Please select only text (.txt) or PDF (.pdf) files.");
            return;
        }

        setUploadedFilesByCourse((prev) => ({
            ...prev,
            [courseId]: validFiles, // store files under this course ID
        }));

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

    // Robust progress calculation helper
    const calculateProgress = (enrollment) => {
        if (!enrollment || !enrollment?.courseId) return 0;

        const course = enrollment?.courseId;
        const eId = enrollment?._id || enrollment?.id;

        // Count total lessons across all modules
        const totalLessons = course?.modules?.reduce((sum, mod) => {
            return sum + (mod.lessons?.length || 0);
        }, 0) || 0;

        // Count completed lessons for this specific enrollment
        const completedCount = lessonStatus.filter(ls =>
            (String(ls.enrollmentId?._id || ls.enrollmentId || ls.enrollId?._id || ls.enrollId) === String(eId)) &&
            ls.status === "completed"
        ).length;

        if (totalLessons === 0) return 0;
        return Math.min(100, Math.round((completedCount / totalLessons) * 100));
    };

    // Calculate individual course progresses
    const myCourseProgresses = myCourses.map(c => calculateProgress(c));

    // Calculate average progress
    const avgProgress = myCourseProgresses.length > 0
        ? Math.round(myCourseProgresses.reduce((sum, p) => sum + p, 0) / myCourseProgresses.length)
        : 0;

    // Calculate total credits earned (only for completed courses)
    const totalCreditsEarned = myCourses.reduce((sum, enrollment, idx) => {
        if (myCourseProgresses[idx] === 100) {
            return sum + (Number(enrollment?.courseId?.credits) || 0);
        }
        return sum;
    }, 0);

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
                            <StatCard icon="🏆" value={myCourseProgresses.filter(cp => cp === 100).length} label="Completed" color="#10B981" />
                            <StatCard icon="📈" value={avgProgress + "%"} label="Avg Progress" color={a} />
                            <StatCard icon="⭐" value={totalCreditsEarned} label="Credits Earned" color="#8B5CF6" />
                        </div>
                        <div style={{ ...css.card, marginBottom: 16 }}>
                            <h3 style={{ ...css.h3, marginBottom: 16 }}>Continue Learning</h3>
                            {myCourses.map(function (c) {
                                const progress = calculateProgress(c);
                                return (
                                    <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: "1px solid #f8fafc" }}>
                                        <div style={{ width: 44, height: 44, background: p + "18", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{c.courseId.thumb}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, fontSize: 14 }}>{c.courseId.title}</div>
                                            <div style={{ marginTop: 8 }}>
                                                <div style={{
                                                    maxWidth: "100%",
                                                    height: 6,
                                                    background: "#f1f5f9",
                                                    borderRadius: 3,
                                                    margin: "6px 0",
                                                    overflow: "hidden",
                                                    width: "100%",
                                                }}>
                                                    <div style={{
                                                        height: "100%",
                                                        width: progress + "%",
                                                        background: p,
                                                        borderRadius: 3,
                                                        transition: "width 0.4s ease"
                                                    }} />
                                                </div>
                                                <div style={{ fontSize: 11, color: "#94a3b8" }}>
                                                    {progress}% complete
                                                </div>
                                            </div>
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
                                const isEnrolling = Enrollment.some((enrol) => enrol.courseId._id === course.id && enrol.learnerId?.userId === currentUser._id);
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
                                                        <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}> EFT</div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={function () { setEnrolling(course); }}
                                                    disabled={isEnrolling}
                                                    style={{ ...css.btn(p, "#fff", true), backgroundColor: isEnrolling ? "#ccc" : "#10B981" }}>Enroll</button>
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
                            {myCourses?.map(function (c) {
                                const progress = calculateProgress(c);

                                return (
                                    <div key={c._id} style={{ ...css.card, display: "flex", gap: 14 }}>
                                        <div style={{ width: 52, height: 52, background: p + "18", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{c?.courseId.thumb}</div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{c?.courseId.title}</div>
                                            <div style={{
                                                height: 6,
                                                background: "#f1f5f9",
                                                borderRadius: 3,
                                                margin: "8px 0",
                                                overflow: "hidden"
                                            }}>
                                                <div style={{
                                                    height: "100%",
                                                    width: progress + "%",
                                                    background: p,
                                                    borderRadius: 3,
                                                    transition: "width 0.4s ease"
                                                }} />
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span style={{ fontSize: 11, color: "#94a3b8" }}>{progress}% complete</span>
                                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                                    <div style={{ display: "flex", gap: 8 }}>
                                                        <input
                                                            type="file"
                                                            accept=".txt,.pdf"
                                                            style={{ display: "none" }}
                                                            id={`fileUpload-${c?._id}`}
                                                            onChange={(e) => handleFileUpload(e, c?._id)}
                                                        />
                                                        <label
                                                            htmlFor={`fileUpload-${c?._id}`}
                                                            style={{
                                                                backgroundColor: "#3b82f6",
                                                                color: "#fff",
                                                                padding: "8px 16px",
                                                                borderRadius: "8px",
                                                                fontSize: "12px",
                                                                fontWeight: "600",
                                                                cursor: "pointer",
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                transition: "all 0.2s ease",
                                                                boxShadow: "0 2px 4px rgba(59, 130, 246, 0.2)"
                                                            }}
                                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
                                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
                                                        >
                                                            📋 Practical
                                                        </label>
                                                    </div>

                                                    {(progress === 100)
                                                        ? <div style={{
                                                            background: "#f0fdf4",
                                                            color: "#16a34a",
                                                            padding: "8px 16px",
                                                            borderRadius: "8px",
                                                            fontSize: "12px",
                                                            fontWeight: "700",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "4px",
                                                            border: "1px solid #bbf7d0"
                                                        }}>
                                                            <span style={{ fontSize: 14 }}>✓</span> Completed
                                                        </div>
                                                        : <button
                                                            onClick={function () { openCourse(c); }}
                                                            style={{
                                                                ...css.btn(p, "#fff", true),
                                                                padding: "8px 16px",
                                                                borderRadius: "8px",
                                                                fontSize: "12px",
                                                                fontWeight: "700",
                                                                boxShadow: `0 2px 4px ${p}33`
                                                            }}>
                                                            Continue →
                                                        </button>
                                                    }
                                                </div>
                                            </div>
                                            {uploadedFilesByCourse[c?._id]?.length > 0 && (
                                                <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
                                                    {uploadedFilesByCourse[c?._id].map((file, index) => (
                                                        <div key={index} style={{
                                                            fontSize: "10px",
                                                            background: "#f8fafc",
                                                            border: "1px solid #e2e8f0",
                                                            padding: "2px 8px",
                                                            borderRadius: "4px",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "4px"
                                                        }}>
                                                            <span style={{ color: "#64748b" }}>📄 {file.name.substring(0, 15)}...</span>
                                                            <button
                                                                onClick={() => openFile(file)}
                                                                style={{ border: "none", background: "none", color: p, cursor: "pointer", fontWeight: "700" }}
                                                            >View</button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
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
                        {userEnrollment.length === 0
                            ? <div style={{ ...css.card, textAlign: "center", padding: "48px" }}>
                                <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                                <h3 style={css.h3}>No Enrolments Yet</h3>
                                <p style={{ color: "#94a3b8", marginTop: 8, marginBottom: 20 }}>Browse courses and click Enroll to complete the QCTO enrolment form.</p>
                                <button onClick={function () { setTab("browse"); }} style={css.btn(p)}>Browse Courses →</button>
                            </div>
                            : userEnrollment.map(function (rec, i) {
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

                {/* {tab === "community" && (
                    <div className="fade">
                        <h1 style={{ ...css.h1, marginBottom: 24 }}>Community</h1>
                        <div style={{ ...css.card, textAlign: "center", padding: "60px" }}>
                            <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
                            <h3 style={css.h3}>Discussion Forums</h3>
                            <p style={{ color: "#64748b", marginTop: 8 }}>Connect with fellow learners and facilitators</p>
                        </div>
                    </div>
                )} */}
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