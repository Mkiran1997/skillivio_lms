"use client";

import { useAdminData } from "@/hooks/useAdminData";
import PaginationBar from "@/components/paginationBar";
import { useRouter } from "next/navigation";

export default function AdminLearnersPage() {
  const {
    p, css,
    AdminCourse, Enrollment, learnersPag, LearnerCourseWise,
    filteredLearners, setFilteredLearners,
    openModule, setActiveLearner, activeLearner, LearnerCourse,
    notify, lessonStatus,
  } = useAdminData();
  const router = useRouter();

  // If viewing a learner detail, show module view
  if (activeLearner) {
    return (
      <div className="fade">
        <button
          onClick={() => setActiveLearner(null)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#64748b", fontSize: 13, marginBottom: 16, padding: 0,
          }}
        >
          ← Back to Learners
        </button>
        <h1 style={{ ...css.h1, marginBottom: 24 }}>
          {activeLearner?.userId?.name}
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={css.card}>
            <h3 style={{ ...css.h3, marginBottom: 12 }}>Learner Info</h3>
            {[
              ["Name", activeLearner?.userId?.name],
              ["Email", activeLearner?.userId?.email],
              ["ID Number", activeLearner?.idNumber || "—"],
              ["Cohort", activeLearner?.cohort],
            ].map(([label, value]) => (
              <div key={label} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{value}</div>
              </div>
            ))}
          </div>
          <div style={css.card}>
            <h3 style={{ ...css.h3, marginBottom: 12 }}>Enrolled Courses</h3>
            {LearnerCourse?.length > 0 ? (
              LearnerCourse.map((enrol, i) => {
                const course = enrol.courseId;
                const totalLessons = course?.modules?.flatMap(m => m.lessons || []).length || 0;
                const completedLessons = lessonStatus?.filter(
                  ls => String(ls?.enrollmentId?._id || ls?.enrollmentId) === String(enrol._id) && ls?.status === "completed"
                ).length || 0;
                const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
                return (
                  <div key={i} style={{ marginBottom: 14, padding: "10px 0", borderBottom: "1px solid #f8fafc" }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{course?.thumb} {course?.title}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                      NQF {course?.nqf} · {course?.credits} Credits · {completedLessons}/{totalLessons} lessons
                    </div>
                    <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, marginTop: 6, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: pct + "%", background: "#10B981", borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>{pct}% complete</div>
                  </div>
                );
              })
            ) : (
              <div style={{ color: "#94a3b8", fontSize: 13 }}>No courses enrolled yet</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function downloadCSV(data) {
    if (!data?.length) { notify("No data to export", "error"); return; }
    const headers = ["Name", "Email", "Cohort", "ID Number"];
    const rows = data.map((l) => [l?.userId?.name, l?.userId?.email, l?.cohort, l?.idNumber || ""]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "learners_export.csv"; a.click();
    URL.revokeObjectURL(url);
    notify("Learners exported!");
  }

  return (
    <div className="fade">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={css.h1}>Learners</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <select
            onChange={(e) => setFilteredLearners(e?.target?.value)}
            style={{
              width: "100%", padding: "8px 12px", fontSize: 13, borderRadius: 6,
              border: `1px solid ${p}50`, outline: "none", background: "#fff",
              cursor: AdminCourse?.length ? "pointer" : "not-allowed",
            }}
          >
            <option value="">All Courses</option>
            {AdminCourse?.filter(f => f?.status === "published").map((course, i) => (
              <option key={i} value={course?.title}>{course?.title}</option>
            ))}
          </select>
          <button onClick={() => downloadCSV(LearnerCourseWise)} style={css.btn(p)}>
            ⬆ Export Learners
          </button>
        </div>
      </div>
      <div style={css.card}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
              {["Learner", "Email", "Course", "Cohort", "Enrolled", "Completed", "Credits", "Actions"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 12, color: "#64748b", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {learnersPag?.slice?.map((learner) => {
              const enrolled = Enrollment?.filter(e => e?.learnerId?.userId === learner?.userId?._id)?.length;
              const completedCount = Enrollment?.filter(e => e?.learnerId?.userId === learner?.userId?._id).reduce((count, enrol) => {
                const course = enrol.courseId;
                const total = course?.modules?.flatMap(m => m?.lessons?.map(l => l?._id?.toString())).length || 0;
                const completed = lessonStatus.filter(ls => ls?.enrollId?._id?.toString() === enrol?._id?.toString()).length;
                return total > 0 && completed === total ? count + 1 : count;
              }, 0);
              const userCourses = Enrollment.filter(e => e?.learnerId?.userId === learner?.userId?._id).reduce((prev, e) => {
                const userId = e?.learnerId?.userId?.toString();
                if (!prev[userId]) prev[userId] = { courses: [], totalCredits: 0 };
                prev[userId].courses.push(e.courseId?.title);
                prev[userId].totalCredits += e.courseId?.credits;
                return prev;
              }, {});
              const cur = userCourses[learner?.userId?._id] || { courses: [], totalCredits: 0 };
              return (
                <tr key={learner?.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: p + "20", color: p, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                        {learner?.userId?.name?.split(" ").slice(0,2).map(n => n[0]?.toUpperCase()).filter(Boolean).join("")}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{learner?.userId?.name}</div>
                    </div>
                  </td>
                  <td style={{ padding: "12px", fontSize: 12, color: "#64748b" }}>{learner?.userId?.email}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={css.tag(p)}>
                      {cur?.courses?.length > 0 ? cur.courses.join(", ") : "No courses"}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}><span style={css.tag(p)}>{learner?.cohort}</span></td>
                  <td style={{ padding: "12px", fontSize: 13, fontWeight: 600 }}>{enrolled}</td>
                  <td style={{ padding: "12px", fontSize: 13, fontWeight: 600, color: "#10B981" }}>{completedCount}</td>
                  <td style={{ padding: "12px", fontSize: 13, fontWeight: 700, color: "#8B5CF6" }}>{cur?.totalCredits}</td>
                  <td style={{ padding: "12px" }}>
                    <button
                      onClick={() => {
                        openModule(learner);
                        notify("Viewing " + learner?.userId?.name + "'s profile");
                      }}
                      style={css.btn(p, "#fff", true)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <PaginationBar {...learnersPag} perPage={6} color={p} />
      </div>
    </div>
  );
}
