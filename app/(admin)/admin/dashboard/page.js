"use client";

import { useAdminData } from "@/hooks/useAdminData";
import StatCard from "@/components/statCard";

export default function AdminDashboardPage() {
  const {
    p, s, a, css,
    AdminCourse, totalEnrolled, published,
    tierLearner, Enrollment, openCourseEditor,
  } = useAdminData();

  return (
    <div className="fade">
      <h1 style={{ ...css.h1, marginBottom: 24 }}>Dashboard</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <StatCard icon="📚" value={AdminCourse?.length} label="Total Courses" color={p} />
        <StatCard icon="👥" value={totalEnrolled?.length?.toLocaleString()} label="Total Learners" color="#10B981" />
        <StatCard icon="📈" value={published?.length} label="Published" color={a} />
        <StatCard icon="💰" value="R47,850" label="Revenue MTD" color="#8B5CF6" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Recent Courses */}
        <div style={css.card}>
          <h3 style={{ ...css.h3, marginBottom: 14 }}>Recent Courses</h3>
          {AdminCourse?.slice(0, 4)?.map(function (course) {
            return (
              <div
                key={course?.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #f8fafc",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{course?.thumb}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{course?.title}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{course?.enrolled} enrolled</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={css.tag(course?.status === "published" ? "#10B981" : "#F59E0B")}>
                    {course?.status}
                  </span>
                  <button
                    onClick={() => openCourseEditor(course)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: 14, color: "#94a3b8", padding: 2,
                    }}
                    title="Edit course"
                  >
                    ✏
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Learners */}
        <div style={css.card}>
          <h3 style={{ ...css.h3, marginBottom: 14 }}>Recent Learners</h3>
          {tierLearner?.slice(0, 4)?.map(function (learner) {
            const userCourses = Enrollment.filter(
              (enroll) => enroll?.learnerId?.userId === learner?.userId?._id
            ).reduce((prev, enroll) => {
              const userId = enroll?.learnerId?.userId?.toString();
              if (!prev[userId]) {
                prev[userId] = { userId, courses: [], totalCredits: 0 };
              }
              prev[userId].courses.push(enroll.courseId?.title);
              prev[userId].totalCredits += enroll.courseId?.credits;
              return prev;
            }, {});

            const currentLearner = userCourses[learner?.userId?._id] || {
              courses: [], totalCredits: 0,
            };

            return (
              <div
                key={learner?.id}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 0", borderBottom: "1px solid #f8fafc",
                }}
              >
                <div
                  style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: p + "20", color: p,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}
                >
                  {learner?.userId?.name
                    ? learner.userId.name.split(" ").slice(0, 2).map((n) => n[0]?.toUpperCase()).filter(Boolean).join("")
                    : ""}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{learner?.userId?.name}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{learner?.cohort}</div>
                </div>
                <span style={{ fontSize: 12, color: "#10B981", fontWeight: 700 }}>
                  {currentLearner?.totalCredits} cr
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
