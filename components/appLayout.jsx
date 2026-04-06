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
import { createCourses, fetchCourses, updateCourse } from "../store/slices/courseSlice";
import { useDispatch, useSelector } from "react-redux";

function App() {

  const { Course, loading, error } = useSelector(state => state.course);
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
  var [editingCourse, setEditingCourse] = useState(null);   // null = create mode, course obj = edit mode
  var [newCourse, setNewCourse] = useState({ title: "", cat: "Technology", level: "BEGINNER", nqf: 4, credits: 10, price: "", free: true, desc: "", thumb: "📘", saqaId: "", passingScore: 75, dripEnabled: false,setaAffiliation:"" });
  var [courseModules, setCourseModules] = useState([]);
  var [activeModuleIdx, setActiveModuleIdx] = useState(null);
  var [uploadingForCourse, setUploadingForCourse] = useState(null);
  var [courseFiles, setCourseFiles] = useState({});   // { courseId: [{name,type,size,uploaded}] }
  const dispatch = useDispatch();

  var tenant = TENANTS[currentTenant];
  useTheme(tenant);
  var p = tenant?.primary, s = tenant.secondary, a = tenant.accent;

  function notify(msg, type) {
    setNotification({ msg: msg, type: type || "success" });
    setTimeout(function () { setNotification(null); }, 3500);
  }

  function loginUser(user) {
    setCurrentUser(user);
    setUserRole(user.role);
    // if (TENANTS[user.tenant]) setCurrentTenant(user.tenant);
    setView(user.role === "admin" ? "admin" : user.role === "superAdmin" ? "superadmin" : "learner");
    notify("Welcome back, " + user.name.split(" ")[0] + "!");
  }

  function logout() { setView("landing"); setUserRole(null); setCurrentUser(null); setActiveCourse(null); }

  function openCourse(course) { setActiveCourse(course); setActiveLesson(0); setAssessSubmitted(false); setView("course"); }
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
            c.id === id ? { ...c, status: updatedCourse.status } : c
          )
        );
        notify("Status updated");
      })
      .catch((err) => {
        notify("Failed to update status: " + err.error || err.message);
      });
  }
  var BLANK_COURSE = { title: "", cat: "Technology", level: "BEGINNER", nqf: 4, credits: 10, price: "", free: true, desc: "", thumb: "📘", saqaId: "", passingScore: 75, dripEnabled: false };

  function openCourseEditor(course) {
    if (course) {
      // Edit existing course — pre-populate all fields
      setEditingCourse(course);
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
      });
      // Build editable modules from course.modules or generate stubs
      var mods = course.modules && course.modules.length
        ? course.modules
        : Array.from({ length: Math.min(course.lessons || 3, 4) }, function (_, mi) {
          return {
            id: "m" + (mi + 1), title: "Module " + (mi + 1) + ": " + (mi === 0 ? "Introduction" : mi === 1 ? "Core Concepts" : mi === 2 ? "Practical Application" : "Assessment"),
            lessons: [{ id: "l" + (mi + 1) + "_1", title: "Lesson 1", type: "VIDEO", desc: "" }, { id: "l" + (mi + 1) + "_2", title: "Lesson 2", type: "TEXT", desc: "" }]
          };
        });
      setCourseModules(mods);
      setActiveModuleIdx(0);
    } else {
      // Create new course
      setEditingCourse(null);
      setNewCourse(BLANK_COURSE);
      setCourseModules([{ id: "m_" + Date.now(), title: "Module 1: Introduction", lessons: [{ id: "l_" + Date.now(), title: "Welcome & Overview", type: "VIDEO", desc: "" }] }]);
      setActiveModuleIdx(0);
    }
    setCourseBuilderOpen(true);
  }

  function saveCourse() {
    var title = newCourse.title ? newCourse.title.trim() : "";
    if (!title) { notify("Course title is required.", "error"); return; }
    var totalLessons = courseModules.reduce(function (s, m) { return s + (m.lessons ? m.lessons.length : 0); }, 0);
    var courseData = {
      title: title,
      cat: newCourse.cat,
      level: newCourse.level,
      nqf: Number(newCourse.nqf),
      credits: Number(newCourse.credits) || 10,
      desc: newCourse.desc || "",
      price: newCourse.free ? 0 : (Number(newCourse.price) || 0),
      free: newCourse.free,
      thumb: newCourse.thumb || "📘",
      // enrolled: newCourse.enrolled || 0,
      saqaId: newCourse.saqaId || "",
      passingScore: Number(newCourse.passingScore) || 75,
      dripEnabled: newCourse.dripEnabled || false,
      modules: courseModules,
      lessons: totalLessons,
      setaAffiliation:newCourse.setaAffiliation
    };
    if (editingCourse) {
      // Update existing
      // setCourses(function (cs) { return cs.map(function (c) { return c.id === editingCourse.id ? { ...c, ...courseData } : c; }); });
      dispatch(updateCourse({ id: editingCourse._id, updatedData: courseData }));

      notify('"' + title + '" updated successfully!');
    } else {
      // Create new
      dispatch(createCourses(courseData));
      notify('"' + title + '" created! Ready to publish.');
    }
    setCourseBuilderOpen(false);
    setEditingCourse(null);
    setNewCourse(BLANK_COURSE);
    setCourseModules([]);
    setActiveModuleIdx(null);
  }

  // Keep legacy name for backward compat
  function createCourse() {
    var title = newCourse.title ? newCourse.title.trim() : "";
    if (!title) { notify("Course title is required.", "error"); return; }
    var totalLessons = courseModules.reduce(function (s, m) { return s + (m.lessons ? m.lessons.length : 0); }, 0);
    var courseData = {
      title: title,
      cat: newCourse.cat,
      level: newCourse.level,
      nqf: Number(newCourse.nqf),
      credits: Number(newCourse.credits) || 10,
      desc: newCourse.desc || "",
      price: newCourse.free ? 0 : (Number(newCourse.price) || 0),
      free: newCourse.free,
      thumb: newCourse.thumb || "📘",
      saqaId: newCourse.saqaId || "",
      passingScore: Number(newCourse.passingScore) || 75,
      dripEnabled: newCourse.dripEnabled || false,
      modules: courseModules,
      lessons: totalLessons,
      type: currentUser.tenantId.slug === "acme" ? "acme" : currentUser.tenantId.slug === "techpro" ? "techpro" : "skillivio",
      setaAffiliation:newCourse.setaAffiliation
    };
    dispatch(createCourses(courseData))
    setCourseBuilderOpen(false);
    setEditingCourse(null);
    
  }

  // CSS helpers
  var css = {
    page: { minHeight: "100vh", background: "#f0f2f5", fontFamily: "'Segoe UI',system-ui,sans-serif" },
    sidebar: { width: 240, background: s, minHeight: "100vh", display: "flex", flexDirection: "column", flexShrink: 0 },
    main: { flex: 1, overflow: "auto", padding: "28px 32px" },
    card: { background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" },
    btn: function (bg, col, sm) { bg = bg || p; col = col || "#fff"; sm = sm || false; return { background: bg, color: col, border: "none", borderRadius: 8, padding: sm ? "7px 14px" : "10px 20px", fontSize: sm ? 12 : 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }; },
    btnOut: function (col, sm) { col = col || p; sm = sm || false; return { background: "transparent", color: col, border: "1.5px solid " + col, borderRadius: 8, padding: sm ? "6px 13px" : "9px 19px", fontSize: sm ? 12 : 14, fontWeight: 600, cursor: "pointer" }; },
    tag: function (col) { col = col || p; return { background: col + "18", color: col, borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 600 }; },
    input: { border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 13, width: "100%", outline: "none", fontFamily: "inherit", boxSizing: "border-box" },
    label: { fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4, display: "block" },
    h1: { fontSize: 26, fontWeight: 800, color: "#0f172a", margin: 0 },
    h2: { fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 },
    h3: { fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 },
    avatar: function (bg) { bg = bg || p; return { width: 36, height: 36, borderRadius: "50%", background: bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }; },
  };

  // Shared props for portal components
  var sharedPortalProps = {
    p: p, s: s, a: a, css: css, notify: notify, notification: notification,
    tenant: tenant, currentTenant: currentTenant, userRole: userRole, currentUser: currentUser,
    logout: logout, setView: setView,
  };

  if (view === "landing") return <LandingPage {...sharedPortalProps} setCurrentTenant={setCurrentTenant} />;

  if (view === "login") return <LoginPage onLogin={loginUser} onBack={function () { setView("landing"); }} tenant={tenant} p={p} s={s} currentTenant={currentTenant}/>;

  if (view === "superadmin") return (
    <SkillivioSuperAdmin {...sharedPortalProps}
      courses={courses}
      setCurrentTenant={setCurrentTenant}
      setUserRole={setUserRole}
    />
  );

  if (view === "learner") return (
    <LearnerPortal {...sharedPortalProps}
      courses={courses}
      openCourse={openCourse}
      uploadingForCourse={uploadingForCourse}
    />
  );

  if (view === "admin") return (
    <AdminDashboard {...sharedPortalProps}
      courses={courses} setCourses={setCourses}
      openCourse={openCourse} publishCourse={publishCourse}
      courseBuilderOpen={courseBuilderOpen}
      setCourseBuilderOpen={setCourseBuilderOpen}
      setUploadingForCourse={setUploadingForCourse}
      newCourse={newCourse} setNewCourse={setNewCourse}
      createCourse={createCourse}
      setEditingCourse={setEditingCourse}
      saveCourse={saveCourse}
      openCourseEditor={openCourseEditor}
      BLANK_COURSE={BLANK_COURSE}
      courseModules={courseModules} setCourseModules={setCourseModules}
      activeModuleIdx={activeModuleIdx} setActiveModuleIdx={setActiveModuleIdx}
      editingCourse={editingCourse}
    />
  );

  if (view === "course" && activeCourse) return (
    <CoursePlayer {...sharedPortalProps}
      activeCourse={activeCourse}
      activeLesson={activeLesson}
      setActiveLesson={setActiveLesson}
      setAssessSubmitted={setAssessSubmitted}
    />
  );

  if (view === "assessment") return (
    <AssessmentView {...sharedPortalProps}
      activeCourse={activeCourse}
      setAssessSubmitted={setAssessSubmitted}
    />
  );

  if (view === "certificate") return (
    <CertificateView {...sharedPortalProps}
      activeCourse={activeCourse}
    />
  );

  return null;
}
export default App;
