"use client"
import LandingPage from "@/components/landingPage";
import { fetchtenants } from "@/store/slices/tenantSlice";
import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { COURSES, TENANTS } from "../mockData";
import { useSearchParams } from "next/navigation";
import { useTheme } from "../utility";
import LoginPage from "@/components/loginPage";
import { createCourses, updateCourse, updateCourseStatus } from "@/store/slices/courseSlice";
import ContactUsPage from "@/components/contactUsPage";
import SkillivioSuperAdmin from "@/components/skillivioSuperAdmin";
import LearnerPortal from "@/components/learnerPortal";
import AdminDashboard from "@/components/adminDashboard";
import CoursePlayer from "@/components/coursePlayer";
import AssessmentView from "@/components/assessmentView";
import CertificateView from "@/components/certificateView";
import RegisterPage from "@/components/registrationPage";
import Splash from "@/components/splash";

function Admin() {
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
    const [selectConditionAndPolicy, setSelectConditionAndPolicy] = useState("");
    const [isClient, setIsClient] = useState(false);
    const [authChecking, setAuthChecking] = useState(true);

    useEffect(() => {
        if (!tenant) return; // 🚨 WAIT until tenant is available

        async function restoreSession() {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                setAuthChecking(false);
                return;
            }

            try {
                const res = await fetch("/api/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "x-tenant-id": tenant._id || tenant.slug
                    }
                });

                if (!res.ok) {
                    localStorage.removeItem("accessToken");
                    setAuthChecking(false);
                    return;
                }

                const data = await res.json();
                const user = data.user;

                setCurrentUser(user);
                setUserRole(user.roles);

                // ✅ THIS decides which page opens after refresh
                if (user.roles === "admin") {
                    setView("admin");  // 👉 AdminDashboard
                } else if (user.roles === "superAdmin") {
                    setView("superadmin");
                } else {
                    setView("learner");
                }

            } catch (err) {
                console.error("Session restore error:", err);
                localStorage.removeItem("accessToken");
            } finally {
                setAuthChecking(false);
            }
        }

        restoreSession();
    }, [tenant]);




    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Now we know we're in the browser
            const storedView = localStorage.getItem('view') || ''; // Get stored view
            if (storedView.length > 0) {
                setView(storedView); // Set view state
                localStorage.removeItem('view')
            }
            setIsClient(true); // Mark as client
        }
    }, []);

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

    const { tenants } = useSelector(state => state.tenants)

    useEffect(() => {
        dispatch(fetchtenants())
    }, [dispatch]);


    var tenant = tenants.find((t) => t.slug === currentTenant) || TENANTS[currentTenant];
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
        setUserRole(user.roles);
        // if (TENANTS[user.tenant]) setCurrentTenant(user.tenant);
        setView(
            user.roles === "admin"
                ? "admin"
                : user.roles === "superAdmin"
                    ? "superadmin"
                    : "learner",
        );
        notify("Welcome back, " + user.name.split(" ")[0] + "!");
    }

    function registerUser(user) {

        notify("Welcome back, " + user.name.split(" ")[0] + "!");
        setView("login")
    }

    async function logout() {
        try {
            await fetch("/api/auth/logout", { method: "POST", headers: { "Content-Length": "0" } });
            localStorage.removeItem("accessToken");
        } catch (e) {
            console.error("Logout API failed", e);
        }
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
        dispatch(updateCourseStatus({ id, status: newStatus }))
            .unwrap()
            .then(() => {

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

    // useEffect(() => {
    //   if (getStoreView?.length > 0) {
    //     setView(getStoreView);
    //     localStorage.removeItem("view");
    //   }
    // }, [getStoreView])

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
                            url: "",
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

    if (authChecking) {
        return (
            <Splash/>
        );
    }
    if (view === "landing")
        return (
            <LandingPage {...sharedPortalProps} setCurrentTenant={setCurrentTenant} />
        );

    if (view === "contact")
        return <ContactUsPage {...sharedPortalProps} p={p} s={s} tenant={tenant} setSelectConditionAndPolicy={setSelectConditionAndPolicy}
            view={view}
            setView={setView}
            currentTenant={currentTenant}
            onBack={function () { setView("landing"); }} />;



    if (view === "login")
        return (
            <LoginPage
                onLogin={loginUser}
                onBack={function () {
                    setView("landing");
                }}
                setView={setView}
                tenant={tenant}
                p={p}
                s={s}
                currentTenant={currentTenant}
            />
        );


    if (view === "register")
        return (
            <RegisterPage
                onRegister={registerUser}
                onBack={function () {
                    setView("landing");
                }}
                tenant={tenant}
                setView={setView}
                p={p}
                s={s}
                currentTenant={currentTenant}
                notify={notify}
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
                currentUser={currentUser}
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


    const props = {
        p: tenant.primary,
        s: tenant.secondary,
        tenant: tenant,
        css: css,
        setView: setView,
        currentTenant: currentTenant,
        setCurrentTenant: setCurrentTenant
    };



    return <LandingPage {...props} />;



}

export default function Page() {
    return <Suspense fallback={<div>Loading...</div>}>
        <Admin />
    </Suspense>
}