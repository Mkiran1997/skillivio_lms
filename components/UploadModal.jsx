import React from "react";

export default function UploadModal(props) {
  const { uploadingForCourse, setUploadingForCourse, p, s, a, css, notify, courseFiles, setCourseFiles } = props;

  return (
    <>
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
    </>
  );
}
