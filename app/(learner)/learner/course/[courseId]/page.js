"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useNotification } from "@/contexts/NotificationContext";
import { fetchEnrollment } from "@/store/slices/enrollmentSlice";
import { fetchlessonStatus } from "@/store/slices/lessonStatusSlice";
import CoursePlayer from "@/components/coursePlayer";
import Splash from "@/components/splash";

export default function LearnerCoursePlayerPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  const { p, s, a, css } = useThemeContext();
  const { notify, notification } = useNotification();
  const dispatch = useDispatch();

  const { Enrollment } = useSelector((state) => state.enrollment);
  const [activeLesson, setActiveLesson] = useState(0);

  useEffect(() => {
    dispatch(fetchEnrollment());
    dispatch(fetchlessonStatus());
  }, [dispatch]);

  // Find the enrollment matching this courseId (enrollment ID)
  const enrollment = useMemo(() =>
    Enrollment.find(e => String(e._id) === String(courseId)),
    [Enrollment, courseId]
  );

  if (!enrollment) {
    return <Splash />;
  }

  const course = typeof enrollment.courseId === "object" ? enrollment.courseId : enrollment;

  return (
    <CoursePlayer
      css={css}
      p={p}
      s={s}
      a={a}
      tenant={null}
      activeCourse={enrollment}
      notification={notification}
      notify={notify}
      setView={(v) => {
        if (v === "learner") router.push("/learner/courses");
        else if (v === "admin") router.push("/admin/dashboard");
      }}
      userRole="learner"
      activeLesson={activeLesson}
      setActiveLesson={setActiveLesson}
      setAssessSubmitted={() => {}}
      currentUser={currentUser}
    />
  );
}
