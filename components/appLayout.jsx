"use client";

import { useEffect, useState } from "react";
import { TENANTS } from "../app/mockData";
import { useTheme } from "../app/utility";
import LandingPage from "./landingPage";

import { useDispatch, useSelector } from "react-redux";
import ContactUsPage from "./contactUsPage";
import { fetchtenants } from "@/store/slices/tenantSlice";

function App() {
  var [currentTenant, setCurrentTenant] = useState("skillivio");
  var [view, setView] = useState("landing");
  var [userRole, setUserRole] = useState(null);
  var [currentUser, setCurrentUser] = useState(null);
  var [activeCourse, setActiveCourse] = useState(null);
  var [notification, setNotification] = useState(null);
  const [selectConditionAndPolicy, setSelectConditionAndPolicy] = useState("");
  const [isClient, setIsClient] = useState(false);


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


  function logout() {
    setView("landing");
    setUserRole(null);
    setCurrentUser(null);
    setActiveCourse(null);
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

  if (view === "contact")
    return <ContactUsPage {...sharedPortalProps} p={p} s={s} tenant={tenant} setSelectConditionAndPolicy={setSelectConditionAndPolicy}
      view={view}
      setView={setView}
      currentTenant={currentTenant}
      onBack={function () { setView("landing"); }} />;

  return null;
}
export default App;
