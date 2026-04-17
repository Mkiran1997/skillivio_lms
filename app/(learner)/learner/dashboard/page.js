"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useNotification } from "@/contexts/NotificationContext";
import { fetchCourses } from "@/store/slices/courseSlice";
import { fetchEnrollment } from "@/store/slices/enrollmentSlice";
import { fetchlearners } from "@/store/slices/learnerSlice";
import StatCard from "@/components/statCard";

export default function LearnerDashboardPage() {
  const { currentUser, tenant, currentTenant } = useAuth();
  const { p, s, a, css } = useThemeContext();
  const { notify } = useNotification();
  const dispatch = useDispatch();

  const { Course } = useSelector((state) => state.course);
  const { Enrollment } = useSelector((state) => state.enrollment);
  const { Learners } = useSelector((state) => state.learners);

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchEnrollment());
    dispatch(fetchlearners());
  }, [dispatch]);

  const myEnrollments = useMemo(() =>
    Enrollment.filter(e => e?.learnerId?.userId?._id === currentUser?._id || e?.learnerId?.userId === currentUser?._id),
    [Enrollment, currentUser]
  );

  const myLearner = useMemo(() =>
    Learners.find(l => l?.userId?._id === currentUser?._id),
    [Learners, currentUser]
  );

  return (
    <div className="fade">
      <div style={{ marginBottom: 24 }}>
        <h1 style={css.h1}>
          Welcome back, {currentUser?.name?.split(" ")[0] || "Learner"} 👋
        </h1>
        <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>
          Here&apos;s your learning overview
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon="📚" value={myEnrollments?.length} label="My Courses" color={p} />
        <StatCard icon="🏆" value="0" label="Certificates" color="#10B981" />
        <StatCard icon="⭐" value={myEnrollments.reduce((sum, e) => sum + (e?.courseId?.credits || 0), 0)} label="Credits Earned" color="#8B5CF6" />
        <StatCard icon="📈" value={myLearner?.cohort || "—"} label="Cohort" color={a} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={css.card}>
          <h3 style={{ ...css.h3, marginBottom: 14 }}>My Current Courses</h3>
          {myEnrollments.length === 0 ? (
            <p style={{ color: "#94a3b8", fontSize: 13 }}>No courses enrolled yet. Browse courses to get started!</p>
          ) : (
            myEnrollments.slice(0, 4).map((enrol, i) => {
              const course = enrol.courseId;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #f8fafc" }}>
                  <span style={{ fontSize: 20 }}>{course?.thumb || "📘"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{course?.title}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>NQF {course?.nqf} · {course?.credits} credits</div>
                  </div>
                  <span style={css.tag("#10B981")}>Active</span>
                </div>
              );
            })
          )}
        </div>

        <div style={css.card}>
          <h3 style={{ ...css.h3, marginBottom: 14 }}>Quick Actions</h3>
          {[
            { icon: "📚", label: "Browse Courses", desc: "Find new courses to enroll in", href: "/learner/browse" },
            { icon: "📋", label: "My Enrolments", desc: "View enrolment history", href: "/learner/enrolments" },
            { icon: "🏆", label: "Certificates", desc: "Download your certificates", href: "/learner/certificates" },
          ].map(item => (
            <div
              key={item.label}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #f8fafc", cursor: "pointer" }}
              onClick={() => window.location.href = item.href}
            >
              <div style={{ fontSize: 24 }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#0f172a" }}>{item.label}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
