"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContext";

import { fetchEnrollment } from "@/store/slices/enrollmentSlice";
import EnrolmentForm from "@/components/enrolmentForm";

export default function LearnerEnrolmentsPage() {
  const { currentUser } = useAuth();
  const { p, s, css } = useThemeContext();
  const dispatch = useDispatch();

  const [selectedEnrolment, setSelectedEnrolment] = useState(null);

  const { Enrollment } = useSelector((state) => state.enrollment);

  useEffect(() => {
    dispatch(fetchEnrollment());
  }, [dispatch]);

  const myEnrollments = useMemo(() =>
    Enrollment.filter(e =>
      e?.learnerId?.userId?._id === currentUser?._id || e?.learnerId?.userId === currentUser?._id
    ),
    [Enrollment, currentUser]
  );

  return (
    <div className="fade">
      <h1 style={{ ...css.h1, marginBottom: 24 }}>My Enrolments</h1>
      {myEnrollments.length === 0 ? (
        <div style={{ ...css.card, textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h3 style={css.h3}>No Enrolments Yet</h3>
          <p style={{ color: "#64748b", marginTop: 8 }}>Browse courses and enroll to see your records here.</p>
        </div>
      ) : (
        myEnrollments.map((enrol, i) => {
          const course = typeof enrol.courseId === "object" ? enrol.courseId : null;
          return (
            <div
              key={i}
              style={{ ...css.card, marginBottom: 12, cursor: "pointer" }}
              onClick={() => setSelectedEnrolment(enrol)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{course?.thumb || "📘"}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{course?.title || "Course"}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>
                      NQF {course?.nqf} · {course?.credits} credits · {course?.cat}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={css.tag("#10B981")}>✓ Enrolled</span>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>
                    {enrol.createdAt ? new Date(enrol.createdAt).toLocaleDateString() : "—"}
                  </span>
                </div>
              </div>
            </div>
          );
        })
      )}

      {selectedEnrolment && (
        <EnrolmentForm
          course={typeof selectedEnrolment.courseId === "object" ? selectedEnrolment.courseId : selectedEnrolment}
          learnerUser={currentUser}
          onSubmit={() => setSelectedEnrolment(null)}
          onCancel={() => setSelectedEnrolment(null)}
          p={p}
          s="#2E3044"
          notify={(msg) => console.log(msg)}
        />
      )}
    </div>
  );
}
