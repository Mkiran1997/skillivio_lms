import React, { useState } from "react";

export default function CourseBuilderModal(props) {
  const [selectedLessonType, setSelectedLessonType] = useState("TEXT");
  const fileInputRef = React.useRef(null);
  const firstInputRef = React.useRef(null);

  const { courseBuilderOpen, setCourseBuilderOpen, p, s, a, css, notify, editingCourse, setEditingCourse, newCourse, setNewCourse, courseModules, setCourseModules, activeModuleIdx, setActiveModuleIdx, saveCourse, currentUser } = props;

  return (
    <>
      {courseBuilderOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 1000,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "24px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              width: "100%",
              maxWidth: 820,
              boxShadow: "0 40px 100px rgba(0,0,0,0.25)",
              animation: "fadeIn 0.2s ease",
              marginBottom: 24,
            }}
          >
            {/* ── Modal header ── */}
            <div
              style={{
                background: s,
                borderRadius: "18px 18px 0 0",
                padding: "22px 32px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>
                  {editingCourse ? "✏ Edit Course" : "📚 New Course"}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  {editingCourse
                    ? "Update course details, curriculum, and settings"
                    : "Build a tailored course for your SDP learners"}
                </div>
              </div>
              <button
                onClick={function () {
                  setCourseBuilderOpen(false);
                  setEditingCourse(null);
                }}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  color: "#fff",
                  borderRadius: 8,
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                ✕ Close
              </button>
            </div>

            <div style={{ padding: "28px 32px", display: "grid", gap: 24 }}>
              {/* ── SECTION A: COURSE DETAILS ── */}
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: 12,
                  padding: "20px 22px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      background: p,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    A
                  </div>
                  <span
                    style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}
                  >
                    Course Details
                  </span>
                </div>
                <div style={{ display: "grid", gap: 12 }}>
                  {/* Row 1: Title + Emoji */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 12,
                      alignItems: "end",
                    }}
                  >
                    <div>
                      <label style={css.label}>
                        Course Title <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <input
                        style={css.input}
                        value={newCourse?.title}
                        onChange={function (e) {
                          var v = e?.target?.value;
                          setNewCourse(function (n) {
                            return { ...n, title: v };
                          });
                        }}
                        placeholder="e.g. Business Administration NQF 4"
                      />
                    </div>
                    <div style={{ width: 100 }}>
                      <label style={css.label}>Icon</label>
                      <select
                        style={css.input}
                        value={newCourse?.thumb}
                        onChange={function (e) {
                          var v = e?.target?.value;
                          setNewCourse(function (n) {
                            return { ...n, thumb: v };
                          });
                        }}
                      >
                        {[
                          "📘",
                          "💻",
                          "📊",
                          "👥",
                          "📱",
                          "🤝",
                          "🏗",
                          "⚕️",
                          "🔬",
                          "📋",
                          "🎓",
                          "🔧",
                          "📦",
                          "🌍",
                          "💡",
                          "🏦",
                        ].map(function (em) {
                          return (
                            <option key={em} value={em}>
                              {em}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Category + Level + NQF + Credits */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <div>
                      <label style={css.label}>Category</label>
                      <select
                        style={css.input}
                        value={newCourse?.cat}
                        onChange={function (e) {
                          var v = e?.target?.value;
                          setNewCourse(function (n) {
                            return { ...n,  cat: v };
                          });
                        }}
                      >
                        {[
                          "Technology",
                          "Management",
                          "Finance",
                          "Marketing",
                          "HR",
                          "Operations",
                          "Healthcare",
                          "Construction",
                          "Agriculture",
                          "Retail",
                          "Hospitality",
                          "Legal",
                          "Education",
                        ]?.map(function (c) {
                          return <option key={c}>{c}</option>;
                        })}
                      </select>
                    </div>
                    <div>
                      <label style={css.label}>Level</label>
                      <select
                        style={css.input}
                        value={newCourse?.level}
                        onChange={function (e) {
                          var v = e?.target?.value;
                          setNewCourse(function (n) {
                            return { ...n, level: v };
                          });
                        }}
                      >
                        {["beginner", "intermediate", "advanced"].map(
                          function (l) {
                            return <option key={l}>{l.toUpperCase()}</option>;
                          },
                        )}
                      </select>
                    </div>
                    <div>
                      <label style={css.label}>NQF Level</label>
                      <select
                        style={css.input}
                        value={newCourse?.nqf}
                        onChange={function (e) {
                          var v = Number(e?.target?.value);
                          setNewCourse(function (n) {
                            return { ...n, nqf: v };
                          });
                        }}
                      >
                        {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (l) {
                          return (
                            <option key={l} value={l}>
                              NQF {l}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div>
                      <label style={css.label}>Credits</label>
                      <input
                        style={css.input}
                        type="number"
                        min="1"
                        max={240}
                        value={newCourse?.credits}
                        onChange={function (e) {
                          var v = e?.target?.value;
                          setNewCourse(function (n) {
                            return { ...n, credits: v };
                          });
                        }}
                        placeholder="e.g. 10"
                      />
                    </div>
                  </div>

                  {/* Row 3: SAQA ID + Passing Score */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <div>
                      <label style={css.label}>SAQA Qualification ID</label>
                      <input
                        style={css.input}
                        value={newCourse?.saqaId}
                        onChange={function (e) {
                          var v = e?.target?.value;
                          setNewCourse(function (n) {
                            return { ...n, saqaId: v };
                          });
                        }}
                        placeholder="e.g. 57712"
                      />
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <label style={css.label}>Accrediting Body</label>
                      <select
                        defaultValue="Services SETA"
                        style={css.input}
                        onChange={function (e) {
                          var v = e?.target?.value;
                          setNewCourse(function (n) {
                            return { ...n, setaAffiliation: v };
                          });
                        }}
                      >
                        {[
                          "QCTO (Direct)",
                          "AgriSETA",
                          "BankSETA",
                          "CATHSSETA",
                          "CHIETA",
                          "ETDP SETA",
                          "FoodBev SETA",
                          "HWSETA",
                          "INSETA",
                          "LGSETA",
                          "MerSETA",
                          "MICTS SETA",
                          "MQA",
                          "PSETA",
                          "SASSETA",
                          "Services SETA",
                          "TETA",
                          "W&RSETA",
                          "OTHER",
                        ].map(function (s) {
                          return <option key={s}>{s}</option>;
                        })}
                      </select>
                    </div>
                    <div>
                      <label style={css.label}>Passing Score (%)</label>
                      <input
                        style={css.input}
                        type="number"
                        min="50"
                        max="100"
                        value={newCourse?.passingScore}
                        onChange={function (e) {
                          var v = e?.target?.value;
                          setNewCourse(function (n) {
                            return { ...n, passingScore: v };
                          });
                        }}
                        placeholder="75"
                      />
                    </div>
                  </div>

                  {/* Row 4: Pricing */}
                  <div>
                    <label style={css.label}>Pricing</label>
                    <div
                      style={{ display: "flex", gap: 10, alignItems: "center" }}
                    >
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 13,
                          cursor: "pointer",
                          background: newCourse?.free ? "#10B98115" : "#f8fafc",
                          border:
                            "1.5px solid " +
                            (newCourse?.free ? "#10B981" : "#e2e8f0"),
                          borderRadius: 8,
                          padding: "8px 14px",
                          fontWeight: newCourse?.free ? 700 : 400,
                        }}
                      >
                        <input
                          type="radio"
                          checked={newCourse?.free === true}
                          onChange={function () {
                            setNewCourse(function (n) {
                              return { ...n, free: true, price: "" };
                            });
                          }}
                          style={{ accentColor: "#10B981" }}
                        />
                        🎁 Free
                      </label>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 13,
                          cursor: "pointer",
                          background: !newCourse?.free ? "#6366F115" : "#f8fafc",
                          border:
                            "1.5px solid " +
                            (!newCourse?.free ? "#6366F1" : "#e2e8f0"),
                          borderRadius: 8,
                          padding: "8px 14px",
                          fontWeight: !newCourse.free ? 700 : 400,
                        }}
                      >
                        <input
                          type="radio"
                          checked={newCourse?.free === false}
                          onChange={function () {
                            setNewCourse(function (n) {
                              return { ...n, free: false };
                            });
                          }}
                          style={{ accentColor: "#6366F1" }}
                        />
                        💳 Paid
                      </label>
                      {!newCourse.free && (
                        <input
                          style={{ ...css.input, width: 160 }}
                          type="number"
                          min="0"
                          placeholder="Price in ZAR (excl. VAT)"
                          value={newCourse?.price}
                          onChange={function (e) {
                            var v = e?.target?.value;
                            setNewCourse(function (n) {
                              return { ...n, price: v };
                            });
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Row 5: Description */}
                  <div>
                    <label style={css.label}>Course Description</label>
                    <textarea
                      style={{
                        ...css.input,
                        resize: "vertical",
                        minHeight: 80,
                        lineHeight: 1.6,
                      }}
                      value={newCourse?.desc}
                      onChange={function (e) {
                        var v = e?.target?.value;
                        setNewCourse(function (n) {
                          return { ...n, desc: v };
                        });
                      }}
                      placeholder="Describe what learners will achieve. This appears on the course card and enrolment form."
                    />
                  </div>

                  {/* Row 6: Quick tools */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                    }}
                  >
                    <button
                      onClick={function () {
                        notify("Generating AI outline…");
                        setTimeout(function () {
                          var aiMods = [
                            "Introduction & Overview",
                            "Core Principles",
                            "Practical Application",
                            "Assessment & Certification",
                          ].map(function (t, mi) {
                            return {
                              id: "ai_m" + (mi + 1),
                              title: "Module " + (mi + 1) + ": " + t,
                              lessons: [
                                {
                                  id: "ai_l" + (mi + 1) + "_1",
                                  title: "Lesson 1: " + t,
                                  type: "VIDEO",
                                  desc: "",
                                },
                                {
                                  id: "ai_l" + (mi + 1) + "_2",
                                  title: "Lesson 2: Practical exercises",
                                  type: "TEXT",
                                  desc: "",
                                },
                              ],
                            };
                          });
                          setCourseModules(aiMods);
                          setActiveModuleIdx(0);
                          notify("✨ AI generated 4 modules with 8 lessons!");
                        }, 2000);
                      }}
                      style={{
                        ...css.btn(a, "#0f172a"),
                        fontSize: 12,
                        padding: "9px 12px",
                      }}
                    >
                      🤖 AI Outline
                    </button>
                    {/* <button
                      onClick={function () {
                        notify("SCORM package importer opened");
                      }}
                      style={{
                        ...css.btnOut(p),
                        fontSize: 12,
                        padding: "9px 12px",
                      }}
                    >
                      📦 SCORM Import
                    </button> */}
                    <button
                      onClick={function () {
                        var copy = {
                          id: "m_" + Date.now(),
                          title: "New Module",
                          lessons: [
                            {
                              id: "l_" + Date.now(),
                              title: "New Lesson",
                              type: "VIDEO",
                              desc: "",
                            },
                          ],
                        };
                        setCourseModules(function (ms) {
                          return ms.concat([copy]);
                        });
                        setActiveModuleIdx(courseModules?.length);
                        notify("Module added");
                      }}
                      style={{
                        ...css.btnOut("#8B5CF6"),
                        fontSize: 12,
                        padding: "9px 12px",
                      }}
                    >
                      + Add Module
                    </button>
                  </div>
                </div>
              </div>

              {/* ── SECTION B: CURRICULUM BUILDER ── */}
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: 12,
                  padding: "20px 22px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        background: "#8B5CF6",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      B
                    </div>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 15,
                        color: "#0f172a",
                      }}
                    >
                      Curriculum
                    </span>
                    <span
                      style={{ fontSize: 12, color: "#94a3b8", marginLeft: 4 }}
                    >
                      {courseModules.length} module
                      {courseModules.length !== 1 ? "s" : ""} ·{" "}
                      {courseModules.reduce(function (s, m) {
                        return s + (m.lessons ? m.lessons.length : 0);
                      }, 0)}{" "}
                      lessons
                    </span>
                  </div>
                </div>

                {courseModules?.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "24px",
                      color: "#94a3b8",
                      fontSize: 13,
                    }}
                  >
                    No modules yet. Click &quot;AI Outline&quot; to generate or
                    &quot;+ Add Module&quot; to build manually.
                  </div>
                )}

                {courseModules?.map(function (mod, mi) {
                  var isOpen = activeModuleIdx === mi;
                  return (
                    <div
                      key={mod?.id || mi}
                      style={{
                        marginBottom: 8,
                        border:
                          "1.5px solid " + (isOpen ? "#8B5CF6" : "#e2e8f0"),
                        borderRadius: 10,
                        overflow: "hidden",
                        background: "#fff",
                      }}
                    >
                      {/* Module header row */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "12px 16px",
                          cursor: "pointer",
                          background: isOpen ? "#8B5CF608" : "#fff",
                        }}
                        onClick={function () {
                          setActiveModuleIdx(isOpen ? null : mi);
                        }}
                      >
                        <span
                          style={{
                            fontSize: 14,
                            color: "#8B5CF6",
                            fontWeight: 700,
                          }}
                        >
                          {mi + 1}
                        </span>
                        <input
                          style={{
                            flex: 1,
                            border: "none",
                            outline: "none",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#0f172a",
                            background: "transparent",
                            cursor: "text",
                          }}
                          value={mod?.moduleName || ""}
                          onClick={function (e) {
                            e.stopPropagation();
                          }}
                          onChange={function (e) {
                            var v = e?.target?.value;
                            setCourseModules(function (ms) {
                              return ms.map(function (m, i) {
                                return i === mi ? { ...m, moduleName: v } : m;
                              });
                            });
                          }}
                          placeholder="Module title"
                        />
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>
                          {mod?.lessons ? mod?.lessons?.length : 0} lessons
                        </span>
                        <button
                          onClick={function (e) {
                            e.stopPropagation();
                            if (courseModules?.length <= 1) {
                              notify(
                                "A course needs at least one module.",
                                "error",
                              );
                              return;
                            }
                            setCourseModules(function (ms) {
                              var n = ms.filter(function (_, i) {
                                return i !== mi;
                              });
                              return n;
                            });
                            setActiveModuleIdx(null);
                            notify("Module removed");
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#EF4444",
                            fontSize: 14,
                            padding: "2px 6px",
                          }}
                        >
                          ✕
                        </button>
                        <span style={{ color: "#8B5CF6", fontSize: 13 }}>
                          {isOpen ? "▲" : "▼"}
                        </span>
                      </div>

                      {/* Lessons panel */}
                      {isOpen && (
                        <div
                          style={{
                            padding: "12px 16px 16px",
                            borderTop: "1px solid #f1f5f9",
                          }}
                        >
                          {(mod.lessons || [])?.map(function (les, li) {
                            return (
                              <div
                                key={les?.id || li}
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "1fr 110px 32px",
                                  gap: 8,
                                  alignItems: "center",
                                  marginBottom: 8,
                                  padding: "10px 12px",
                                  background: "#f8fafc",
                                  borderRadius: 8,
                                  border: "1px solid #e2e8f0",
                                }}
                              >
                                <div>
                                  <input
                                    style={{
                                      ...css.input,
                                      padding: "7px 10px",
                                      fontSize: 12,
                                      marginBottom: 4,
                                    }}
                                    value={les?.title}
                                    onChange={function (e) {
                                      var v = e?.target?.value;
                                      setCourseModules(function (ms) {
                                        return ms.map(function (m, i) {
                                          if (i !== mi) return m;
                                          var newL = m?.lessons?.map(
                                            function (l, j) {
                                              return j === li
                                                ? { ...l, title: v }
                                                : l;
                                            },
                                          );
                                          return { ...m, lessons: newL };
                                        });
                                      });
                                    }}
                                    placeholder="Lesson title"
                                  />
                                  {(les?.type || "").toUpperCase() === "TEXT" ? (
                                    <input
                                      key="text-input"
                                      style={{
                                        ...css.input,
                                        padding: "5px 10px",
                                        fontSize: 11,
                                        color: "#64748b",
                                      }}
                                      value={les?.desc || ""}
                                      onChange={function (e) {
                                        var v = e?.target?.value;
                                        setCourseModules(function (ms) {
                                          return ms.map(function (m, i) {
                                            if (i !== mi) return m;
                                            var newL = m.lessons.map(
                                              function (l, j) {
                                                return j === li
                                                  ? { ...l, desc: v }
                                                  : l;
                                              },
                                            );
                                            return { ...m, lessons: newL };
                                          });
                                        });
                                      }}
                                      placeholder="Brief description (optional)"
                                    />
                                  )
                                    : (
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: "4px",
                                        }}
                                      >
                                        {/* 1. The actual file input (no value prop!) */}
                                        <input
                                          key="file-input"
                                          type="file"
                                          style={{
                                            ...css.input,
                                            padding: "5px 10px",
                                            fontSize: 11,
                                            color: "#64748b",
                                          }}
                                          onChange={function (e) {
                                            var file = e?.target?.files[0];
                                            if (!file) return;

                                            // Create a temporary local URL for previewing
                                            var previewUrl =
                                              URL.createObjectURL(file);

                                            setCourseModules(function (ms) {
                                              return ms?.map(function (m, i) {
                                                if (i !== mi) return m;
                                                return {
                                                  ...m,
                                                  lessons: m?.lessons?.map(
                                                    function (l, j) {
                                                      return j === li
                                                        ? {
                                                          ...l,
                                                          file: file,
                                                          tempName: file.name,
                                                          url: previewUrl, // Set the preview URL here
                                                        }
                                                        : l;
                                                    },
                                                  ),
                                                };
                                              });
                                            });
                                          }}
                                        />

                                        {/* 2. Show the existing database URL if it exists */}
                                        {les?.url && !les?.tempName && (
                                          <div
                                            style={{
                                              fontSize: 10,
                                              color: "#3b82f6",
                                              paddingLeft: 5,
                                            }}
                                          >
                                            Current File: {les?.url}
                                            <a
                                              href={les?.url}
                                              target="_blank"
                                              rel="noreferrer"
                                              style={{
                                                textDecoration: "underline",
                                              }}
                                            >
                                              View existing
                                            </a>
                                          </div>
                                        )}

                                        {/* 3. Show the new filename if the user just selected one */}
                                        {les?.tempName && (
                                          <div
                                            style={{
                                              fontSize: 10,
                                              color: "#22c55e",
                                              paddingLeft: 5,
                                            }}
                                          >
                                            New file selected:{" "}
                                            <strong>{les?.tempName}</strong>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                </div>
                                <select
                                  style={{
                                    ...css.input,
                                    padding: "7px 8px",
                                    fontSize: 11,
                                  }}
                                  value={(les?.type || "").toUpperCase()}
                                  onChange={function (e) {
                                    var v = e?.target?.value;
                                    setSelectedLessonType(v);
                                    setCourseModules(function (ms) {
                                      return ms?.map(function (m, i) {
                                        if (i !== mi) return m;
                                        var newL = m?.lessons?.map(
                                          function (l, j) {
                                            return j === li
                                              ? { ...l, type: v }
                                              : l;
                                          },
                                        );
                                        return { ...m, lessons: newL };
                                      });
                                    });
                                  }}
                                >
                                  {[
                                    "VIDEO",
                                    "PDF",
                                    "TEXT",
                                    "AUDIO",
                                    "SCORM",
                                    "ZOOM",
                                    "ASSIGNMENT",
                                  ].map(function (t) {
                                    return <option key={t}>{t}</option>;
                                  })}
                                </select>
                                <button
                                  onClick={function () {
                                    if ((mod?.lessons || []).length <= 1) {
                                      notify(
                                        "A module needs at least one lesson.",
                                        "error",
                                      );
                                      return;
                                    }
                                    setCourseModules(function (ms) {
                                      return ms?.map(function (m, i) {
                                        if (i !== mi) return m;
                                        var newL = m?.lessons?.filter(
                                          function (_, j) {
                                            return j !== li;
                                          },
                                        );
                                        return { ...m, lessons: newL };
                                      });
                                    });
                                    notify("Lesson removed");
                                  }}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#EF4444",
                                    fontSize: 14,
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            );
                          })}

                          {/* Add lesson */}
                          <button
                            onClick={function () {
                              var newLes = {
                                title: "New Lesson",
                                type: "VIDEO",
                                desc: "",
                              };
                              setCourseModules(function (ms) {
                                return ms?.map(function (m, i) {
                                  return i === mi
                                    ? {
                                      ...m,
                                      lessons: (m?.lessons || []).concat([
                                        newLes,
                                      ]),
                                    }
                                    : m;
                                });
                              });
                              notify("Lesson added");
                            }}
                            style={{
                              ...css.btnOut("#8B5CF6"),
                              fontSize: 12,
                              padding: "7px 14px",
                              marginTop: 4,
                            }}
                          >
                            + Add Lesson
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ── SECTION C: COURSE SETTINGS ── */}
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: 12,
                  padding: "20px 22px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      background: "#F59E0B",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    C
                  </div>
                  <span
                    style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}
                  >
                    Settings
                  </span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  {/* Drip Release */}
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 8,
                      padding: "14px 16px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 13,
                            marginBottom: 2,
                          }}
                        >
                          Drip Release
                        </div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>
                          Release content gradually over time
                        </div>
                      </div>
                      <button
                        onClick={function () {
                          setNewCourse(function (n) {
                            return { ...n, dripEnabled: !n.dripEnabled };
                          });
                        }}
                        style={{
                          width: 44,
                          height: 24,
                          background: newCourse?.dripEnabled ? p : "#e2e8f0",
                          borderRadius: 12,
                          border: "none",
                          cursor: "pointer",
                          transition: "background 0.2s",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: 2,
                            left: newCourse?.dripEnabled ? 22 : 2,
                            width: 20,
                            height: 20,
                            background: "#fff",
                            borderRadius: "50%",
                            transition: "left 0.2s",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                          }}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Certificate on completion */}
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 8,
                      padding: "14px 16px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 13,
                            marginBottom: 2,
                          }}
                        >
                          Issue Certificate
                        </div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>
                          Auto-issue on passing score
                        </div>
                      </div>
                      <div
                        style={{
                          width: 44,
                          height: 24,
                          background: p,
                          borderRadius: 12,
                          border: "none",
                          cursor: "default",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: 2,
                            left: 22,
                            width: 20,
                            height: 20,
                            background: "#fff",
                            borderRadius: "50%",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* QCTO Compliant */}
                  <div
                    style={{
                      background: "#f0fdf4",
                      borderRadius: 8,
                      padding: "14px 16px",
                      border: "1px solid #86efac",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: "#166534",
                        marginBottom: 2,
                      }}
                    >
                      ✅ QCTO Aligned
                    </div>
                    <div style={{ fontSize: 11, color: "#16a34a" }}>
                      NQF Level, credits, and SAQA ID are QCTO-compliant fields
                    </div>
                  </div>

                  {/* Enrolment form */}
                  <div
                    style={{
                      background: "#eff6ff",
                      borderRadius: 8,
                      padding: "14px 16px",
                      border: "1px solid #bfdbfe",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: "#1e40af",
                        marginBottom: 2,
                      }}
                    >
                      📋 Enrolment Form
                    </div>
                    <div style={{ fontSize: 11, color: "#3b82f6" }}>
                      QCTO enrolment form (Sections A–H) auto-attached to this
                      course
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Footer buttons ── */}
            <div
              style={{
                padding: "16px 32px 24px",
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
                borderTop: "1px solid #f1f5f9",
              }}
            >
              <button
                onClick={function () {
                  setCourseBuilderOpen(false);
                  setEditingCourse(null);
                }}
                style={css.btnOut("#94a3b8")}
              >
                Cancel
              </button>
              {editingCourse && (
                <button
                  onClick={async function () {
                    if (
                      window.confirm(
                        "Delete this course? This cannot be undone.",
                      )
                    ) {
                      try {
                        // Dispatch the deleteCourse thunk
                        await dispatch(
                          deleteCourse(editingCourse?._id || editingCourse?.id),
                        ).unwrap();

                        // Optional: close builder and reset local states
                        setCourseBuilderOpen(false);
                        setEditingCourse(null);
                        setNewCourse(BLANK_COURSE);
                        setCourseModules([]);
                        setActiveModuleIdx(null);

                        notify("Course deleted.");
                      } catch (err) {
                        notify(err.error || "Failed to delete course", "error");
                      }
                    }
                  }}
                  style={css.btnOut("#EF4444")}
                >
                  🗑 Delete Course
                </button>
              )}
              <button
                onClick={editingCourse ? saveCourse : createCourse}
                disabled={!newCourse?.title}
                style={{
                  ...css.btn(p),
                  opacity: newCourse?.title ? 1 : 0.5,
                  minWidth: 140,
                }}
              >
                {editingCourse ? "💾 Save Changes" : "📚 Create Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
