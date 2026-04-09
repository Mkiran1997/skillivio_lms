"use client";

import { useEffect, useState } from "react";
import { COURSES, TENANTS } from "../app/mockData";
import { useTheme } from "../app/utility";
import LandingPage from "./landingPage";
import AdminDashboard from "./adminDashboard";
import AssessmentView from "./assessmentView";
import LoginPage from "./loginPage";
import LearnerPortal from "./learnerPortal";
import SkillivioSuperAdmin from "./skillivioSuperAdmin";
import CoursePlayer from "./coursePlayer";
import CertificateView from "./certificateView";
import {
  createCourses,
  fetchCourses,
  updateCourse,
} from "../store/slices/courseSlice";
import { useDispatch, useSelector } from "react-redux";

function App() {
  const { Course, loading, error } = useSelector((state) => state.course);
  var [currentTenant, setCurrentTenant] = useState("skillivio");
  var [view, setView] = useState("landing");
  var [userRole, setUserRole] = useState(null);
  var [currentUser, setCurrentUser] = useState(null);
  var [activeCourse, setActiveCourse] = useState(null);
  var [activeLesson, setActiveLesson] = useState(0);
  var [assessSubmitted, setAssessSubmitted] = useState(false);
  var [notification, setNotification] = useState(null);
  var [courses, setCourses] = useState(COURSES);
  // Course builder state — lives here to avoid remount loss
  var [courseBuilderOpen, setCourseBuilderOpen] = useState(false);
  var [editingCourse, setEditingCourse] = useState(null); // null = create mode, course obj = edit mode
  var [newCourse, setNewCourse] = useState({
    title: "",
    cat: "Technology",
    level: "BEGINNER",
    nqf: 4,
    credits: 10,
    price: "",
    free: true,
    desc: "",
    thumb: "📘",
    saqaId: "",
    passingScore: 75,
    dripEnabled: false,
    setaAffiliation: "",
  });
  var [courseModules, setCourseModules] = useState([]);
  var [activeModuleIdx, setActiveModuleIdx] = useState(null);
  var [uploadingForCourse, setUploadingForCourse] = useState(null);
  var [courseFiles, setCourseFiles] = useState({}); // { courseId: [{name,type,size,uploaded}] }
  const dispatch = useDispatch();

  var tenant = TENANTS[currentTenant];
  useTheme(tenant);
  var p = tenant?.primary,
    s = tenant.secondary,
    a = tenant.accent;

  function notify(msg, type) {
    setNotification({ msg: msg, type: type || "success" });
    setTimeout(function () {
      setNotification(null);
    }, 3500);
  }

  function loginUser(user) {
    setCurrentUser(user);
    setUserRole(user.role);
    // if (TENANTS[user.tenant]) setCurrentTenant(user.tenant);
    setView(
      user.role === "admin"
        ? "admin"
        : user.role === "superAdmin"
          ? "superadmin"
          : "learner",
    );
    notify("Welcome back, " + user.name.split(" ")[0] + "!");
  }

  function logout() {
    setView("landing");
    setUserRole(null);
    setCurrentUser(null);
    setActiveCourse(null);
  }

  function openCourse(course) {
    setActiveCourse(course);
    setActiveLesson(0);
    setAssessSubmitted(false);
    setView("course");
  }
  function publishCourse(id, currentStatus) {
    // Determine new status
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    // Update server via API (Redux thunk)
    dispatch(updateCourse({ id, updatedData: { status: newStatus } }))
      .unwrap()
      .then((updatedCourse) => {
        // Update local state after successful server update
        setCourses((cs) =>
          cs.map((c) =>
            c.id === id ? { ...c, status: updatedCourse.status } : c,
          ),
        );
        notify("Status updated");
      })
      .catch((err) => {
        notify("Failed to update status: " + err.error || err.message);
      });
  }
  var BLANK_COURSE = {
    title: "",
    cat: "Technology",
    level: "BEGINNER",
    nqf: 4,
    credits: 10,
    price: "",
    free: true,
    desc: "",
    thumb: "📘",
    saqaId: "",
    passingScore: 75,
    dripEnabled: false,
  };

  function openCourseEditor(course) {
    if (course) {
      // Edit existing course — pre-populate all fields
      setEditingCourse(course);

      // Set the new course data, including modules and lessons
      setNewCourse({
        title: course.title || "",
        cat: course.cat || "Technology",
        level: course.level || "BEGINNER",
        nqf: course.nqf || 4,
        credits: course.credits || 10,
        price: course.price || "",
        free: course.free !== false,
        desc: course.desc || "",
        thumb: course.thumb || "📘",
        saqaId: course.saqaId || "",
        passingScore: course.passingScore || 75,
        dripEnabled: course.dripEnabled || false,
        modules: course.modules.map((module) => ({
          _id: module._id, // Ensure module _id is present
          moduleName: module.moduleName, // Ensure moduleName is set
          lessons: module.lessons || [], // Ensure lessons are present
        })),
      });

      // Set the modules in the course
      setCourseModules(course.modules || []);
      setActiveModuleIdx(0); // Or set based on what module needs to be active
    } else {
      // Create new course
      setEditingCourse(null);
      setNewCourse(BLANK_COURSE);
      setCourseModules([
        {
          id: "m_" + Date.now(),
          moduleName: "Module 1: Introduction",
          lessons: [
            {
              id: "l_" + Date.now(),
              title: "Welcome & Overview",
              type: "VIDEO",
              desc: "",
              url:"",
            },
          ],
        },
      ]);
      setActiveModuleIdx(0);
    }
    setCourseBuilderOpen(true);
  }

  async function saveCourse() {
    const title = newCourse.title ? newCourse.title.trim() : "";
    if (!title) {
      notify("Course title is required.", "error");
      return;
    }

    const totalLessons = courseModules.reduce(
      (s, m) => s + (m.lessons ? m.lessons.length : 0),
      0,
    );

    // Validate modules and lessons before sending to the backend
    for (const module of courseModules) {
      if (!module.moduleName) {
        notify("Module name is required.", "error");
        return;
      }

      if (!module.lessons || module.lessons.length === 0) {
        notify("Each module should have at least one lesson.", "error");
        return;
      }

      for (const lesson of module.lessons) {
        if (!lesson.title) {
          notify("Each lesson should have a title.", "error");
          return;
        }

        if (!lesson.type) {
          notify(
            "Each lesson should have a type (e.g., VIDEO, TEXT).",
            "error",
          );
          return;
        }
      }
    }

    
    // Construct courseData with the full module object
    const courseData = {
      title: title,
      cat: newCourse.cat,
      level: newCourse.level,
      nqf: Number(newCourse.nqf),
      credits: Number(newCourse.credits) || 10,
      desc: newCourse.desc || "",
      price: newCourse.free ? 0 : Number(newCourse.price) || 0,
      free: newCourse.free,
      thumb: newCourse.thumb || "📘",
      saqaId: newCourse.saqaId || "",
      passingScore: Number(newCourse.passingScore) || 75,
      dripEnabled: newCourse.dripEnabled || false,
      modules: courseModules,
      lessons: totalLessons,
      setaAffiliation: newCourse.setaAffiliation,
      type:
        currentUser.tenantId.slug === "acme"
          ? "acme"
          : currentUser.tenantId.slug === "techpro"
            ? "techpro"
            : "skillivio",
    };


    try {
      if (editingCourse) {
        // Update existing course
        await dispatch(
          updateCourse({ id: editingCourse._id, updatedData: courseData }),
        );
        notify(`"${title}" updated successfully!`);
      } else {
        // Create a new course
        await dispatch(createCourses(courseData));
        notify(`"${title}" created! Ready to publish.`);
      }

      // Reset state after saving
      setCourseBuilderOpen(false);
      setEditingCourse(null);
      setNewCourse(BLANK_COURSE);
      setCourseModules([]);
      setActiveModuleIdx(null);
    } catch (error) {
      notify("Error saving course: " + error.message, "error");
    }
  }

  // Keep legacy name for backward compat
  function createCourse() {
    var title = newCourse.title ? newCourse.title.trim() : "";
    if (!title) {
      notify("Course title is required.", "error");
      return;
    }
    var totalLessons = courseModules.reduce(function (s, m) {
      return s + (m.lessons ? m.lessons.length : 0);
    }, 0);
    var courseData = {
      title: title,
      cat: newCourse.cat,
      level: newCourse.level,
      nqf: Number(newCourse.nqf),
      credits: Number(newCourse.credits) || 10,
      desc: newCourse.desc || "",
      price: newCourse.free ? 0 : Number(newCourse.price) || 0,
      free: newCourse.free,
      thumb: newCourse.thumb || "📘",
      saqaId: newCourse.saqaId || "",
      passingScore: Number(newCourse.passingScore) || 75,
      dripEnabled: newCourse.dripEnabled || false,
      modules: courseModules,
      lessons: totalLessons,
      type:
        currentUser.tenantId.slug === "acme"
          ? "acme"
          : currentUser.tenantId.slug === "techpro"
            ? "techpro"
            : "skillivio",
      setaAffiliation: newCourse.setaAffiliation,
    };
    dispatch(createCourses(courseData));
    setCourseBuilderOpen(false);
    setEditingCourse(null);
  }

  // CSS helpers
  var css = {
    page: {
      minHeight: "100vh",
      background: "#f0f2f5",
      fontFamily: "'Segoe UI',system-ui,sans-serif",
    },
    sidebar: {
      width: 240,
      background: s,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
    },
    main: { flex: 1, overflow: "auto", padding: "28px 32px" },
    card: {
      background: "#fff",
      borderRadius: 12,
      padding: "20px 24px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
    },
    btn: function (bg, col, sm) {
      bg = bg || p;
      col = col || "#fff";
      sm = sm || false;
      return {
        background: bg,
        color: col,
        border: "none",
        borderRadius: 8,
        padding: sm ? "7px 14px" : "10px 20px",
        fontSize: sm ? 12 : 14,
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
      };
    },
    btnOut: function (col, sm) {
      col = col || p;
      sm = sm || false;
      return {
        background: "transparent",
        color: col,
        border: "1.5px solid " + col,
        borderRadius: 8,
        padding: sm ? "6px 13px" : "9px 19px",
        fontSize: sm ? 12 : 14,
        fontWeight: 600,
        cursor: "pointer",
      };
    },
    tag: function (col) {
      col = col || p;
      return {
        background: col + "18",
        color: col,
        borderRadius: 100,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 600,
      };
    },
    input: {
      border: "1.5px solid #e2e8f0",
      borderRadius: 8,
      padding: "10px 12px",
      fontSize: 13,
      width: "100%",
      outline: "none",
      fontFamily: "inherit",
      boxSizing: "border-box",
    },
    label: {
      fontSize: 12,
      fontWeight: 600,
      color: "#64748b",
      marginBottom: 4,
      display: "block",
    },
    h1: { fontSize: 26, fontWeight: 800, color: "#0f172a", margin: 0 },
    h2: { fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 },
    h3: { fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 },
    avatar: function (bg) {
      bg = bg || p;
      return {
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: bg,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 700,
        flexShrink: 0,
      };
    },
  };

  // Shared props for portal components
  var sharedPortalProps = {
    p: p,
    s: s,
    a: a,
    css: css,
    notify: notify,
    notification: notification,
    tenant: tenant,
    currentTenant: currentTenant,
    userRole: userRole,
    currentUser: currentUser,
    logout: logout,
    setView: setView,
  };

  if (view === "landing")
    return (
      <LandingPage {...sharedPortalProps} setCurrentTenant={setCurrentTenant} />
    );

  if (view === "login")
    return (
      <LoginPage
        onLogin={loginUser}
        onBack={function () {
          setView("landing");
        }}
        tenant={tenant}
        p={p}
        s={s}
        currentTenant={currentTenant}
      />
    );

  if (view === "superadmin")
    return (
      <SkillivioSuperAdmin
        {...sharedPortalProps}
        courses={courses}
        setCurrentTenant={setCurrentTenant}
        setUserRole={setUserRole}
      />
    );

  if (view === "learner")
    return (
      <LearnerPortal
        {...sharedPortalProps}
        courses={courses}
        openCourse={openCourse}
        uploadingForCourse={uploadingForCourse}
      />
    );

  if (view === "admin")
    return (
      <AdminDashboard
        {...sharedPortalProps}
        courses={courses}
        setCourses={setCourses}
        openCourse={openCourse}
        publishCourse={publishCourse}
        courseBuilderOpen={courseBuilderOpen}
        setCourseBuilderOpen={setCourseBuilderOpen}
        setUploadingForCourse={setUploadingForCourse}
        newCourse={newCourse}
        setNewCourse={setNewCourse}
        createCourse={createCourse}
        setEditingCourse={setEditingCourse}
        saveCourse={saveCourse}
        openCourseEditor={openCourseEditor}
        BLANK_COURSE={BLANK_COURSE}
        courseModules={courseModules}
        setCourseModules={setCourseModules}
        activeModuleIdx={activeModuleIdx}
        setActiveModuleIdx={setActiveModuleIdx}
        editingCourse={editingCourse}
      />
    );

  if (view === "course" && activeCourse)
    return (
      <CoursePlayer
        {...sharedPortalProps}
        activeCourse={activeCourse}
        activeLesson={activeLesson}
        setActiveLesson={setActiveLesson}
        setAssessSubmitted={setAssessSubmitted}
      />
    );

  if (view === "assessment")
    return (
      <AssessmentView
        {...sharedPortalProps}
        activeCourse={activeCourse}
        setAssessSubmitted={setAssessSubmitted}
      />
    );

  if (view === "certificate")
    return (
      <CertificateView {...sharedPortalProps} activeCourse={activeCourse} />
    );

  return null;
}
export default App;
