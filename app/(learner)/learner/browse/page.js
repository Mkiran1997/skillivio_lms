"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useNotification } from "@/contexts/NotificationContext";
import { fetchCourses } from "@/store/slices/courseSlice";
import { fetchEnrollment } from "@/store/slices/enrollmentSlice";
import EnrolmentForm from "@/components/enrolmentForm";

export default function LearnerBrowsePage() {
  const { currentUser } = useAuth();
  const { p, css } = useThemeContext();
  const { notify } = useNotification();
  const dispatch = useDispatch();
  const router = useRouter();

  const [enrollingCourse, setEnrollingCourse] = useState(null);

  const { Course } = useSelector((state) => state.course);
  const { Enrollment } = useSelector((state) => state.enrollment);

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchEnrollment());
  }, [dispatch]);

  // Show only published courses for the learner's tenant
  const availableCourses = useMemo(() =>
    Course.filter(c =>
      c?.status === "published" &&
      c?.type === currentUser?.tenantId?.slug
    ),
    [Course, currentUser]
  );

  const myEnrolledCourseIds = useMemo(() =>
    Enrollment
      .filter(e => e?.learnerId?.userId?._id === currentUser?._id || e?.learnerId?.userId === currentUser?._id)
      .map(e => e?.courseId?._id || e?.courseId),
    [Enrollment, currentUser]
  );

  return (
    <div className="fade">
      <h1 style={{ ...css.h1, marginBottom: 8 }}>Browse Courses</h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>
        Discover courses available for enrolment
      </p>

      {availableCourses.length === 0 ? (
        <div style={{ ...css.card, textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h3 style={css.h3}>No Courses Available</h3>
          <p style={{ color: "#64748b", marginTop: 8 }}>Check back later for new courses.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {availableCourses.map((course) => {
            const isEnrolled = myEnrolledCourseIds.includes(course._id);
            return (
              <div
                key={course._id}
                style={{ ...css.card, display: "flex", flexDirection: "column", cursor: isEnrolled ? "pointer" : "default" }}
                onClick={() => {
                  if (isEnrolled) {
                    setEnrollingCourse(course);
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 28 }}>{course?.thumb || "📘"}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{course?.title}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{course?.cat}</div>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6, marginBottom: 12, flex: 1 }}>
                  {course?.desc?.substring(0, 120) || "Explore this qualification aligned to the NQF framework."}
                  {course?.desc?.length > 120 ? "…" : ""}
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                  <span style={css.tag(p)}>NQF {course?.nqf}</span>
                  <span style={css.tag("#8B5CF6")}>{course?.credits} Credits</span>
                  <span style={css.tag(course?.free ? "#10B981" : "#F59E0B")}>
                    {course?.free ? "Free" : `R${course?.price}`}
                  </span>
                </div>
                {isEnrolled ? (
                  <button
                    style={{ ...css.btn("#10B981"), width: "100%", textAlign: "center", cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEnrollingCourse(course);
                    }}
                  >
                    ✓ Already Enrolled
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEnrollingCourse(course);
                      notify("Opening enrolment for " + course?.title);
                    }}
                    style={{ ...css.btn(p), width: "100%", textAlign: "center" }}
                  >
                    Enroll Now →
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
      {enrollingCourse && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
          <EnrolmentForm
            course={enrollingCourse}
            learnerUser={currentUser}
            onSubmit={(record) => {
              setEnrollingCourse(null);
              notify(`Enrolment for "${enrollingCourse.title}" submitted successfully!`);
              router.push("/learner/courses");
            }}
            onCancel={() => setEnrollingCourse(null)}
            p={p} 
            s="#2E3044" 
            notify={notify}
          />
        </div>
      )}
    </div>
  );
}
