"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useNotification } from "@/contexts/NotificationContext";
import { fetchEnrollment } from "@/store/slices/enrollmentSlice";
import { fetchlessonStatus } from "@/store/slices/lessonStatusSlice";

export default function LearnerCoursesPage() {
  const { currentUser } = useAuth();
  const { p, css } = useThemeContext();
  const { notify } = useNotification();
  const dispatch = useDispatch();
  const router = useRouter();

  const { Enrollment } = useSelector((state) => state.enrollment);
  const { lessonStatus } = useSelector((state) => state.lessonStatus);

  useEffect(() => {
    dispatch(fetchEnrollment());
    dispatch(fetchlessonStatus());
  }, [dispatch]);

  const myEnrollments = useMemo(() =>
    Enrollment.filter(e =>
      e?.learnerId?.userId?._id === currentUser?._id || e?.learnerId?.userId === currentUser?._id
    ),
    [Enrollment, currentUser]
  );

  return (
    <div className="fade">
      <h1 style={{ ...css.h1, marginBottom: 24 }}>My Courses</h1>
      {myEnrollments.length === 0 ? (
        <div style={{ ...css.card, textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
          <h3 style={css.h3}>No courses yet</h3>
          <p style={{ color: "#64748b", marginTop: 8 }}>Browse available courses to enroll.</p>
          <button onClick={() => router.push("/learner/browse")} style={{ ...css.btn(p), marginTop: 16 }}>Browse Courses →</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {myEnrollments.map((enrol, i) => {
            const course = typeof enrol.courseId === "object" ? enrol.courseId : enrol;
            const totalLessons = course?.modules?.flatMap(m => m.lessons || []).length || 0;
            const completedLessons = lessonStatus?.filter(ls =>
              String(ls?.enrollmentId?._id || ls?.enrollmentId) === String(enrol._id) && ls?.status === "completed"
            ).length || 0;
            const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

            return (
              <div key={i} style={{ ...css.card, cursor: "pointer" }} onClick={() => router.push(`/learner/course/${enrol._id}`)}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 28 }}>{course?.thumb || "📘"}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{course?.title}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>NQF {course?.nqf} · {course?.credits} credits</div>
                  </div>
                </div>
                <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ height: "100%", width: pct + "%", background: pct === 100 ? "#10B981" : p, borderRadius: 3, transition: "width 0.3s" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                  <span style={{ color: "#94a3b8" }}>{completedLessons}/{totalLessons} lessons</span>
                  <span style={{ color: pct === 100 ? "#10B981" : p, fontWeight: 700 }}>{pct}%</span>
                </div>
                <button style={{ ...css.btn(pct === 100 ? "#10B981" : p), marginTop: 12, width: "100%", textAlign: "center" }}>
                  {pct === 100 ? "✓ Completed" : pct > 0 ? "Continue →" : "Start Course →"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
