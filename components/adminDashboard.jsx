import React, { useEffect, useMemo, useRef, useState } from "react";
import { exportXLSX, usePagination } from "@/utils/utility";
import { ENROLMENT_STORE, LEARNERS } from "@/utils/mockData";
import { GLOBAL_CSS } from "@/utils/globalCss";
import AdminSidebar from "./adminSidebar";
import StatCard from "./statCard";
import PaginationBar from "./paginationBar";
import ToggleSwitch from "./toggleSwitch";
import { useDispatch, useSelector } from "react-redux";
import { deleteCourse, fetchCourses } from "../store/slices/courseSlice";
import { fetchlearners } from "@/store/slices/learnerSlice";
import {
  fetchbankdetails,
  updatebankdetails,
} from "@/store/slices/bankDetailSlice";
import * as XLSX from "xlsx";
import { fetchEnrollment } from "@/store/slices/enrollmentSlice";
import EnrolmentForm from "./enrolmentForm";
import { fetchcontactUs } from "@/store/slices/contactUsSlice";
import { fetchlessonStatus } from "@/store/slices/lessonStatusSlice";
// import StatCard from "./StatCard";
// import PaginationBar from "./PaginationBar";
// import ToggleSwitch from "./ToggleSwitch";

function AdminDashboard({ ...props }) {
  const {
    courses,
    openCourse,
    setCourses,
    publishCourse,
    notify,
    notification,
    css,
    tenant,
    currentTenant,
    userRole,
    currentUser,
    logout,
    setView,
    courseBuilderOpen,
    BLANK_COURSE,
    setCourseBuilderOpen,
    newCourse,
    setNewCourse,
    createCourse,
    openCourseEditor,
    courseModules,
    setCourseModules,
    activeModuleIdx,
    setActiveModuleIdx,
    editingCourse,
    s,
    a,
    p,
    setEditingCourse,
    saveCourse,
    setUploadingForCourse,
  } = props;



  const { Course, loading, error } = useSelector((state) => state?.course);
  const { Learners } = useSelector((state) => state?.learners);
  const { bankdetails } = useSelector((state) => state?.bankdetail);
  const { Enrollment } = useSelector((state) => state?.enrollment);
  const { lessonStatus } = useSelector((state) => state?.lessonStatus);
  const { contactUs } = useSelector((state) => state?.contactUs);

  const [isEditing, setIsEditing] = useState(false);
  const [localBankDetails, setLocalBankDetails] = useState({});
  const [openEnrolmentForm, setOpenEnrolmentForm] = useState(false);
  const firstInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedLessonType, setSelectedLessonType] = useState("TEXT");
  var [activeLearner, setActiveLearner] = useState(null);

  const dispatch = useDispatch();

  function openModule(learner) {
    setActiveLearner(learner);
  }

  var [tab, setTab] = useState("dashboard");
  var tenantLimit =
    currentTenant === "acme" ? 5 : currentTenant === "techpro" ? 10 : Infinity;
  const AdminCourse = useMemo(() => {
    return Course.filter((c) => c?.type === currentUser?.tenantId?.slug);
  }, [Course, currentUser]);


  const tierLearner = Learners.filter((l) => {
    const lTenantId = l.tenantId || l.userId?.tenantId;
    const cTenantId = currentUser.tenantId?._id || currentUser.tenantId;

    if (!lTenantId || !cTenantId) return false;

    // Support both ID string comparison and populated object comparison
    const lId = typeof lTenantId === "string" ? lTenantId : lTenantId?._id || lTenantId?.id;
    const cId = typeof cTenantId === "string" ? cTenantId : cTenantId?._id || cTenantId?.id;

    if (lId && cId) return String(lId) === String(cId);

    // Fallback to slug if IDs aren't matching or available
    return l.userId?.tenantId?.slug === currentUser?.tenantId?.slug;
  });
  const [filteredLearners, setFilteredLearners] = useState("");

  const LearnerCourseWise = useMemo(() => {
    // If no course is selected, return all learners
    if (!filteredLearners) return tierLearner;

    // Filter learners who are enrolled in the selected course
    return tierLearner.filter((learner) =>
      Enrollment.some(
        (enrollment) =>
          enrollment?.learnerId?.userId?.id === learner?.userId?.id &&
          enrollment?.courseId?.title === filteredLearners,
      ),
    );
  }, [Enrollment, filteredLearners, tierLearner]);

  var limitedCourses = AdminCourse.slice(0, tenantLimit);
  var coursesPag = usePagination(limitedCourses, 5);
  const AdminContact = contactUs.filter((c) => c?.type === currentUser?.tenantId?.slug)
  var contactPag = usePagination(AdminContact, 5)

  var [cohorts, setCohorts] = useState([
    {
      id: "coh1",
      name: "Intake 2026-01",
      company: "Internal",
      learners: 34,
      status: "Active",
      course: "Project Management Fundamentals",
      start: "2026-01-15",
      end: "2026-06-30",
    },
    {
      id: "coh2",
      name: "ACME Cohort A",
      company: "ACME Ltd",
      learners: 18,
      status: "Active",
      course: "Leadership & Team Management",
      start: "2026-02-01",
      end: "2026-07-31",
    },
    {
      id: "coh3",
      name: "TechPro Batch 1",
      company: "TechPro (Pty) Ltd",
      learners: 22,
      status: "Active",
      course: "Advanced JavaScript & Node.js",
      start: "2026-01-10",
      end: "2026-05-31",
    },
    {
      id: "coh4",
      name: "NDC Group B",
      company: "National Dev College",
      learners: 45,
      status: "Completed",
      course: "Financial Accounting Principles",
      start: "2025-07-01",
      end: "2025-12-31",
    },
  ]);

  var [showCohortForm, setShowCohortForm] = useState(false);
  var [newCohort, setNewCohort] = useState({
    name: "",
    company: "",
    course: "",
    start: "",
    end: "",
  });
  var learnersPag = usePagination(LearnerCourseWise, 6);
  var enrolments = Object.values(ENROLMENT_STORE);

  var published = AdminCourse.filter(function (c) {
    return c?.status === "published";
  });
  const totalEnrolled = useMemo(() => {
    return Enrollment.filter(
      (enrol) => enrol?.courseId?.type === currentUser?.tenantId?.slug,
    );
  });

  var enrolPag = usePagination(totalEnrolled, 5);

  var SB_ITEMS = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    {
      id: "courses",
      icon: "📚",
      label: "Courses",
      badge: limitedCourses.length,
    },
    {
      id: "learners",
      icon: "👥",
      label: "Learners",
      badge: tierLearner.length,
    },
    {
      id: "enrolments",
      icon: "📋",
      label: "Enrolments",
      badge: totalEnrolled.length || undefined,
    },
    { id: "analytics", icon: "📈", label: "Analytics" },
    { id: "payments", icon: "💳", label: "Payments" },
    { id: "certificates", icon: "🏆", label: "Certificates" },
    { id: "settings", icon: "⚙️", label: "Settings" },
    { id: "contact", icon: "👤", label: "Contact" },
  ];

  const bankDetailsArray = [
    { key: "accountName", label: "Account Name" },
    { key: "bank", label: "Bank" },
    { key: "accountNo", label: "Account No" },
    { key: "branchCode", label: "Branch Code" },
    { key: "accountType", label: "Account Type" },
    // { key: "payShapId", label: "PayShap ID" },
  ];

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchlearners());
    dispatch(fetchbankdetails());
    dispatch(fetchEnrollment());
    dispatch(fetchcontactUs());
    dispatch(fetchlessonStatus());
  }, [dispatch]);

  useEffect(() => {
    if (bankdetails && bankdetails[0]) {
      setLocalBankDetails({ ...bankdetails[0] });
    }
  }, [bankdetails]);

  const handleSave = () => {
    dispatch(
      updatebankdetails({
        id: localBankDetails?._id,
        updatedData: localBankDetails,
      }),
    );
    setIsEditing(false); // exit edit mode
  };

  function exportEnrolmentReport() {
    if (Enrollment?.length === 0) {
      notify("No enrolment records yet", "error");
      return;
    }
    var rows = [
      [
        "Learner",
        "ID Number",
        "Email",
        "Course",
        "NQF",
        "Credits",
        "SAQA ID",
        "Intake",
        "Start",
        "Delivery",
        "POPIA",
        "Declaration",
        "Docs Uploaded",
        "Submitted",
      ],
    ];
    Enrollment.forEach(function (rec) {
      var docKeys = [
        "certifiedId",
        "highestQual",
        "cv",
        "studyPermit",
        "workplaceConf",
        "entryAssessment",
      ];
      var uploaded = docKeys.filter(function (k) {
        return rec.docs && rec.docs[k];
      }).length;
      rows.push([
        (rec.personal && rec?.personal?.fullName) || "",
        (rec.personal && rec?.personal?.idNumber) || "",
        (rec.personal && rec?.personal?.email) || "",
        (rec.course && rec?.course?.title) || "",
        (rec && rec?.nqfLevel) || "",
        (rec.secA && rec?.secA?.credits) || "",
        (rec.secA && rec?.secA?.saqaId) || "",
        (rec.secA && rec?.secA?.intakeNo) || "",
        (rec.secA && rec?.secA?.startDate) || "",
        (rec.secA && rec?.secA?.mode) || "",
        rec.secG && rec?.secG?.consent ? "Yes" : "No",
        rec.secF && rec?.secF?.agreed ? "Yes" : "No",
        uploaded + "/" + docKeys?.length,
        rec?.submittedAt || "",
      ]);
    });
    exportXLSX("Enrolment_Report.xlsx", rows, "Enrolments");
    notify("Enrolment report exported!");
  }

  const ImportEnrolmentReport = () => {
    fileInputRef?.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e?.target?.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet);

      rows.forEach((row) => {
        // Map your Excel columns to secB, secC, etc.
        const secB = {
          fullName: row["Full Name"] || "",
          idNumber: row["ID Number"] || "",
          dob: row["DOB"] || "",
          gender: row["Gender"] || "",
          nationality: row["Nationality"] || "South African",
          address: row["Address"] || "",
          contact: row["Contact"] || "",
          email: row["Email"] || "",
        };

        const secC = {
          employer: row["Employer"] || "",
          workAddress: row["Work Address"] || "",
          contactPerson: row["Contact Person"] || "",
          contactNo: row["Contact No"] || "",
          mentor: row["Mentor"] || "No",
        };

        const secA = {
          saqaId: row["SAQA ID"] || "",
          nqfLevel: AdminCourse.nqf,
          credits: AdminCourse.credits,
          intakeNo: row["Intake No"] || "",
          startDate:
            row["Start Date"] || new Date().toISOString().split("T")[0],
          endDate: row["End Date"] || "",
          mode: row["Mode"] || "Blended",
        };

        const secD = [
          { req: "Certified ID Copy", sub: "N", verBy: "", date: "" },
          { req: "Highest Qualification", sub: "N", verBy: "", date: "" },
          { req: "Pre-requisite Qualification", sub: "N", verBy: "", date: "" },
          {
            req: "Study Permit (if applicable)",
            sub: "N",
            verBy: "",
            date: "",
          },
          { req: "Workplace Confirmation", sub: "N", verBy: "", date: "" },
        ];

        const secE = {
          conducted: "No",
          dateCond: "",
          outcome: "Competent - Approved",
          assessor: "",
          sig: "",
        };
        const secF = {
          name: "",
          sig: "",
          date: new Date().toISOString().split("T")[0],
          agreed: false,
        };
        const secG = {
          consent: false,
          sig: "",
          date: new Date().toISOString().split("T")[0],
        };
        const secH = {
          verified: "No",
          approved: "No",
          qctoDate: "",
          repName: "",
          sig: "",
          date: new Date().toISOString().split("T")[0],
        };
        const docs = {
          certifiedId: null,
          highestQual: null,
          cv: null,
          studyPermit: null,
          workplaceConf: null,
          entryAssessment: null,
        };

        const record = {
          Course,
          secA,
          secB,
          secC,
          secD,
          secE,
          secF,
          secG,
          secH,
          docs,
          submittedAt: new Date().toISOString(),
        };
        const key = secB?.idNumber + "_" + Course?.id;

        ENROLMENT_STORE[key] = record;
      });

      notify(` learners imported successfully!`);
    };

    reader.readAsArrayBuffer(file);
  };

  // for learner Import
  const downloadExcel = (array) => {
    const formattedData = array?.map((learner) => {
      const enrollment = Enrollment?.find(
        (enrolment) => enrolment.learnerId?.userId?.id === learner.userId?.id,
      );
      const courseTitle = enrollment ? enrollment?.courseId?.title : "";

      return {
        UserID: learner?.userId?.id, // Replace with actual field name for learner's ID
        CourseTitle: courseTitle, // Get course title from enrollment
      };
    });
    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Learners");
    XLSX.writeFile(wb, "filtered_learners.xlsx");
  };
  const convertToCSV = (array) => {
    // Create a userCourses object to map userId to courses and total credits
    const userCourses = Enrollment?.filter((enroll) =>
      array?.some((learner) => learner?.userId?._id === enroll?.learnerId?.userId),
    ).reduce((prev, enroll) => {
      const userId = enroll?.learnerId?.userId?.toString();

      if (!prev[userId]) {
        prev[userId] = {
          userId: userId,
          courses: [],
          totalCredits: 0,
        };
      }

      const course = enroll?.courseId;
      prev[userId].courses.push(course?.title);
      prev[userId].totalCredits += course?.credits;

      return prev;
    }, {});

    // Define headers
    const headers = ["UserID", "Courses", "TotalCredits"];

    // Map learners to rows including their courses and total credits
    const rows = array?.map((learner) => {
      const learnerCourses = userCourses[learner?.userId?._id];
      const courseTitles = learnerCourses
        ? learnerCourses?.courses?.join(", ")
        : "";
      const totalCredits = learnerCourses ? learnerCourses?.totalCredits : 0;

      return [
        learner.userId.name, // Learner's UserID (adjust this field)
        courseTitles, // Learner's courses
        totalCredits, // Total credits from courses
      ];
    });

    // Combine headers and rows into CSV content
    const csvContent = [
      headers.join(","), // Join headers by commas
      ...rows.map((row) => row.join(",")), // Join each row by commas
    ].join("\n"); // Combine everything with newlines between rows

    return csvContent;
  };

  // Function to trigger CSV download
  const downloadCSV = (array) => {
    const csvData = convertToCSV(array);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "learners.csv"; // File name for download
    link.click(); // Trigger the download
  };

  const LearnerCourse = activeLearner && Enrollment?.filter(
    (l) => l?.learnerId?._id === activeLearner?._id,
  );


  return (
    <div style={{ display: "flex", ...css.page }}>
      <style>{GLOBAL_CSS}</style>

      {/* ══════════════════════════════════════════════════════
     Course Builder / Editor Modal
     Admin can CREATE new or EDIT any existing course.
     Sections: Details · Curriculum · Settings
  ══════════════════════════════════════════════════════ */}
      {courseBuilderOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 1000,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "24px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              width: "100%",
              maxWidth: 820,
              boxShadow: "0 40px 100px rgba(0,0,0,0.25)",
              animation: "fadeIn 0.2s ease",
              marginBottom: 24,
            }}
          >
            {/* ── Modal header ── */}
            <div
              style={{
                background: s,
                borderRadius: "18px 18px 0 0",
                padding: "22px 32px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>
                  {editingCourse ? "✏ Edit Course" : "📚 New Course"}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  {editingCourse
                    ? "Update course details, curriculum, and settings"
                    : "Build a tailored course for your SDP learners"}
                </div>
              </div>
              <button
                onClick={function () {
                  setCourseBuilderOpen(false);
                  setEditingCourse(null);
                }}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  color: "#fff",
                  borderRadius: 8,
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                ✕ Close
              </button>
            </div>

            <div style={{ padding: "28px 32px", display: "grid", gap: 24 }}>
              {/* ── SECTION A: COURSE DETAILS ── */}
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: 12,
                  padding: "20px 22px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      background: p,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    A
                  </div>
                  <span
                    style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}
                  >
                    Course Details
                  </span>
                </div>
                <div style={{ display: "grid", gap: 12 }}>
                  {/* Row 1: Title + Emoji */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 12,
                      alignItems: "end",
                    }}
                  >
                    <div>
                      <label style={css.label}>
                        Course Title <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <input
                        style={css.input}
                        value={newCourse?.title}
                        onChange={function (e) {
                          var v = e?.target?.value;
                          setNewCourse(function (n) {
                            return { ...n, title: v };
                          });
                        }}
                        placeholder="e.g. Business Administration NQF 4"
                      />
                    </div>
                    <div style={{ width: 100 }}>
                      <label style={css.label}>Icon</label>
                      <select
                        style={css.input}
                        value={newCourse?.thumb}
                        onChange={function (e) {
                          var v = e?.target?.value;
                          setNewCourse(function (n) {
                            return { ...n, thumb: v };
                          });
                        }}
                      >
                        {[
                          "📘",
                          "💻",
                          "📊",
                          "👥",
                          "📱",
                          "🤝",
                          "🏗",
                          "⚕️",
                          "🔬",
                          "📋",
                          "🎓",
                          "🔧",
                          "📦",
                          "🌍",
                          "💡",
                          "🏦",
                        ].map(function (em) {
                          return (
                            <option key={em} value={em}>
                              {em}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Category + Level + NQF + Credits */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <div>
                      <label style={css.label}>Category</label>
                      <select
                        style={css.input}
                        value={newCourse?.cat}
                        onChange={function (e) {
                          var v = e?.target?.value;
                          setNewCourse(function (n) {
                            return { ...n,  cat: v };
                          });
                        }}
                      >
                        {[
                          "Technology",
                          "Management",
                          "Finance",
                          "Marketing",
                          "HR",
                          "Operations",
                          "Healthcare",
                          "Construction",
                          "Agriculture",
                          "Retail",
                          "Hospitality",
                          "Legal",
                          "Education",
                        ]?.map(function (c) {
                          return <option key={c}>{c}</option>;
                        })}
                      </select>
                    </div>
                    <div>
                      <label style={css.label}>Level</label>
                      <select
                        style={css.input}
                        value={newCourse?.level}
                        onChange={function (e) {
                          var v = e?.target?.value;
                          setNewCourse(function (n) {
                            return { ...n, level: v };
                          });
                        }}
                      >
                        {["beginner", "intermediate", "advanced"].map(
                          function (l) {
                            return <option key={l}>{l.toUpperCase()}</option>;
                          },
                        )}
                      </select>
                    </div>
                    <div>
                      <label style={css.label}>NQF Level</label>
                      <select
                        style={css.input}
                        value={newCourse?.nqf}
                        onChange={function (e) {
                          var v = Number(e?.target?.value);
                          setNewCourse(function (n) {
                            return { ...n, nqf: v };
                          });
                        }}
                      >
                        {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (l) {
                          return (
                            <option key={l} value={l}>
                              NQF {l}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div>
                      <label style={css.label}>Credits</label>
                      <input
                        style={css.input}
                        type="number"
                        min="1"
                        max={240}
                        value={newCourse?.credits}
                        onChange={function (e) {
                          var v = e?.target?.value;
                          setNewCourse(function (n) {
                            return { ...n, credits: v };
                          });
                        }}
                        placeholder="e.g. 10"
                      />
                    </div>
                  </div>

                  {/* Row 3: SAQA ID + Passing Score */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <div>
                      <label style={css.label}>SAQA Qualification ID</label>
                      <input
                        style={css.input}
                        value={newCourse?.saqaId}
                        onChange={function (e) {
                          var v = e?.target?.value;
                          setNewCourse(function (n) {
                            return { ...n, saqaId: v };
                          });
                        }}
                        placeholder="e.g. 57712"
                      />
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <label style={css.label}>Accrediting Body</label>
                      <select
                        defaultValue="Services SETA"
                        style={css.input}
                        onChange={function (e) {
                          var v = e?.target?.value;
                          setNewCourse(function (n) {
                            return { ...n, setaAffiliation: v };
                          });
                        }}
                      >
                        {[
                          "QCTO (Direct)",
                          "AgriSETA",
                          "BankSETA",
                          "CATHSSETA",
                          "CHIETA",
                          "ETDP SETA",
                          "FoodBev SETA",
                          "HWSETA",
                          "INSETA",
                          "LGSETA",
                          "MerSETA",
                          "MICTS SETA",
                          "MQA",
                          "PSETA",
                          "SASSETA",
                          "Services SETA",
                          "TETA",
                          "W&RSETA",
                          "OTHER",
                        ].map(function (s) {
                          return <option key={s}>{s}</option>;
                        })}
                      </select>
                    </div>
                    <div>
                      <label style={css.label}>Passing Score (%)</label>
                      <input
                        style={css.input}
                        type="number"
                        min="50"
                        max="100"
                        value={newCourse?.passingScore}
                        onChange={function (e) {
                          var v = e?.target?.value;
                          setNewCourse(function (n) {
                            return { ...n, passingScore: v };
                          });
                        }}
                        placeholder="75"
                      />
                    </div>
                  </div>

                  {/* Row 4: Pricing */}
                  <div>
                    <label style={css.label}>Pricing</label>
                    <div
                      style={{ display: "flex", gap: 10, alignItems: "center" }}
                    >
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 13,
                          cursor: "pointer",
                          background: newCourse?.free ? "#10B98115" : "#f8fafc",
                          border:
                            "1.5px solid " +
                            (newCourse?.free ? "#10B981" : "#e2e8f0"),
                          borderRadius: 8,
                          padding: "8px 14px",
                          fontWeight: newCourse?.free ? 700 : 400,
                        }}
                      >
                        <input
                          type="radio"
                          checked={newCourse?.free === true}
                          onChange={function () {
                            setNewCourse(function (n) {
                              return { ...n, free: true, price: "" };
                            });
                          }}
                          style={{ accentColor: "#10B981" }}
                        />
                        🎁 Free
                      </label>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 13,
                          cursor: "pointer",
                          background: !newCourse?.free ? "#6366F115" : "#f8fafc",
                          border:
                            "1.5px solid " +
                            (!newCourse?.free ? "#6366F1" : "#e2e8f0"),
                          borderRadius: 8,
                          padding: "8px 14px",
                          fontWeight: !newCourse.free ? 700 : 400,
                        }}
                      >
                        <input
                          type="radio"
                          checked={newCourse?.free === false}
                          onChange={function () {
                            setNewCourse(function (n) {
                              return { ...n, free: false };
                            });
                          }}
                          style={{ accentColor: "#6366F1" }}
                        />
                        💳 Paid
                      </label>
                      {!newCourse.free && (
                        <input
                          style={{ ...css.input, width: 160 }}
                          type="number"
                          min="0"
                          placeholder="Price in ZAR (excl. VAT)"
                          value={newCourse?.price}
                          onChange={function (e) {
                            var v = e?.target?.value;
                            setNewCourse(function (n) {
                              return { ...n, price: v };
                            });
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Row 5: Description */}
                  <div>
                    <label style={css.label}>Course Description</label>
                    <textarea
                      style={{
                        ...css.input,
                        resize: "vertical",
                        minHeight: 80,
                        lineHeight: 1.6,
                      }}
                      value={newCourse?.desc}
                      onChange={function (e) {
                        var v = e?.target?.value;
                        setNewCourse(function (n) {
                          return { ...n, desc: v };
                        });
                      }}
                      placeholder="Describe what learners will achieve. This appears on the course card and enrolment form."
                    />
                  </div>

                  {/* Row 6: Quick tools */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                    }}
                  >
                    <button
                      onClick={function () {
                        notify("Generating AI outline…");
                        setTimeout(function () {
                          var aiMods = [
                            "Introduction & Overview",
                            "Core Principles",
                            "Practical Application",
                            "Assessment & Certification",
                          ].map(function (t, mi) {
                            return {
                              id: "ai_m" + (mi + 1),
                              title: "Module " + (mi + 1) + ": " + t,
                              lessons: [
                                {
                                  id: "ai_l" + (mi + 1) + "_1",
                                  title: "Lesson 1: " + t,
                                  type: "VIDEO",
                                  desc: "",
                                },
                                {
                                  id: "ai_l" + (mi + 1) + "_2",
                                  title: "Lesson 2: Practical exercises",
                                  type: "TEXT",
                                  desc: "",
                                },
                              ],
                            };
                          });
                          setCourseModules(aiMods);
                          setActiveModuleIdx(0);
                          notify("✨ AI generated 4 modules with 8 lessons!");
                        }, 2000);
                      }}
                      style={{
                        ...css.btn(a, "#0f172a"),
                        fontSize: 12,
                        padding: "9px 12px",
                      }}
                    >
                      🤖 AI Outline
                    </button>
                    {/* <button
                      onClick={function () {
                        notify("SCORM package importer opened");
                      }}
                      style={{
                        ...css.btnOut(p),
                        fontSize: 12,
                        padding: "9px 12px",
                      }}
                    >
                      📦 SCORM Import
                    </button> */}
                    <button
                      onClick={function () {
                        var copy = {
                          id: "m_" + Date.now(),
                          title: "New Module",
                          lessons: [
                            {
                              id: "l_" + Date.now(),
                              title: "New Lesson",
                              type: "VIDEO",
                              desc: "",
                            },
                          ],
                        };
                        setCourseModules(function (ms) {
                          return ms.concat([copy]);
                        });
                        setActiveModuleIdx(courseModules?.length);
                        notify("Module added");
                      }}
                      style={{
                        ...css.btnOut("#8B5CF6"),
                        fontSize: 12,
                        padding: "9px 12px",
                      }}
                    >
                      + Add Module
                    </button>
                  </div>
                </div>
              </div>

              {/* ── SECTION B: CURRICULUM BUILDER ── */}
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: 12,
                  padding: "20px 22px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        background: "#8B5CF6",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      B
                    </div>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 15,
                        color: "#0f172a",
                      }}
                    >
                      Curriculum
                    </span>
                    <span
                      style={{ fontSize: 12, color: "#94a3b8", marginLeft: 4 }}
                    >
                      {courseModules.length} module
                      {courseModules.length !== 1 ? "s" : ""} ·{" "}
                      {courseModules.reduce(function (s, m) {
                        return s + (m.lessons ? m.lessons.length : 0);
                      }, 0)}{" "}
                      lessons
                    </span>
                  </div>
                </div>

                {courseModules?.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "24px",
                      color: "#94a3b8",
                      fontSize: 13,
                    }}
                  >
                    No modules yet. Click &quot;AI Outline&quot; to generate or
                    &quot;+ Add Module&quot; to build manually.
                  </div>
                )}

                {courseModules?.map(function (mod, mi) {
                  var isOpen = activeModuleIdx === mi;
                  return (
                    <div
                      key={mod?.id || mi}
                      style={{
                        marginBottom: 8,
                        border:
                          "1.5px solid " + (isOpen ? "#8B5CF6" : "#e2e8f0"),
                        borderRadius: 10,
                        overflow: "hidden",
                        background: "#fff",
                      }}
                    >
                      {/* Module header row */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "12px 16px",
                          cursor: "pointer",
                          background: isOpen ? "#8B5CF608" : "#fff",
                        }}
                        onClick={function () {
                          setActiveModuleIdx(isOpen ? null : mi);
                        }}
                      >
                        <span
                          style={{
                            fontSize: 14,
                            color: "#8B5CF6",
                            fontWeight: 700,
                          }}
                        >
                          {mi + 1}
                        </span>
                        <input
                          style={{
                            flex: 1,
                            border: "none",
                            outline: "none",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#0f172a",
                            background: "transparent",
                            cursor: "text",
                          }}
                          value={mod?.moduleName || ""}
                          onClick={function (e) {
                            e.stopPropagation();
                          }}
                          onChange={function (e) {
                            var v = e?.target?.value;
                            setCourseModules(function (ms) {
                              return ms.map(function (m, i) {
                                return i === mi ? { ...m, moduleName: v } : m;
                              });
                            });
                          }}
                          placeholder="Module title"
                        />
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>
                          {mod?.lessons ? mod?.lessons?.length : 0} lessons
                        </span>
                        <button
                          onClick={function (e) {
                            e.stopPropagation();
                            if (courseModules?.length <= 1) {
                              notify(
                                "A course needs at least one module.",
                                "error",
                              );
                              return;
                            }
                            setCourseModules(function (ms) {
                              var n = ms.filter(function (_, i) {
                                return i !== mi;
                              });
                              return n;
                            });
                            setActiveModuleIdx(null);
                            notify("Module removed");
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#EF4444",
                            fontSize: 14,
                            padding: "2px 6px",
                          }}
                        >
                          ✕
                        </button>
                        <span style={{ color: "#8B5CF6", fontSize: 13 }}>
                          {isOpen ? "▲" : "▼"}
                        </span>
                      </div>

                      {/* Lessons panel */}
                      {isOpen && (
                        <div
                          style={{
                            padding: "12px 16px 16px",
                            borderTop: "1px solid #f1f5f9",
                          }}
                        >
                          {(mod.lessons || [])?.map(function (les, li) {
                            return (
                              <div
                                key={les?.id || li}
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "1fr 110px 32px",
                                  gap: 8,
                                  alignItems: "center",
                                  marginBottom: 8,
                                  padding: "10px 12px",
                                  background: "#f8fafc",
                                  borderRadius: 8,
                                  border: "1px solid #e2e8f0",
                                }}
                              >
                                <div>
                                  <input
                                    style={{
                                      ...css.input,
                                      padding: "7px 10px",
                                      fontSize: 12,
                                      marginBottom: 4,
                                    }}
                                    value={les?.title}
                                    onChange={function (e) {
                                      var v = e?.target?.value;
                                      setCourseModules(function (ms) {
                                        return ms.map(function (m, i) {
                                          if (i !== mi) return m;
                                          var newL = m?.lessons?.map(
                                            function (l, j) {
                                              return j === li
                                                ? { ...l, title: v }
                                                : l;
                                            },
                                          );
                                          return { ...m, lessons: newL };
                                        });
                                      });
                                    }}
                                    placeholder="Lesson title"
                                  />
                                  {(les?.type || "").toUpperCase() === "TEXT" ? (
                                    <input
                                      key="text-input"
                                      style={{
                                        ...css.input,
                                        padding: "5px 10px",
                                        fontSize: 11,
                                        color: "#64748b",
                                      }}
                                      value={les?.desc || ""}
                                      onChange={function (e) {
                                        var v = e?.target?.value;
                                        setCourseModules(function (ms) {
                                          return ms.map(function (m, i) {
                                            if (i !== mi) return m;
                                            var newL = m.lessons.map(
                                              function (l, j) {
                                                return j === li
                                                  ? { ...l, desc: v }
                                                  : l;
                                              },
                                            );
                                            return { ...m, lessons: newL };
                                          });
                                        });
                                      }}
                                      placeholder="Brief description (optional)"
                                    />
                                  )
                                    : (
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: "4px",
                                        }}
                                      >
                                        {/* 1. The actual file input (no value prop!) */}
                                        <input
                                          key="file-input"
                                          type="file"
                                          style={{
                                            ...css.input,
                                            padding: "5px 10px",
                                            fontSize: 11,
                                            color: "#64748b",
                                          }}
                                          onChange={function (e) {
                                            var file = e?.target?.files[0];
                                            if (!file) return;

                                            // Create a temporary local URL for previewing
                                            var previewUrl =
                                              URL.createObjectURL(file);

                                            setCourseModules(function (ms) {
                                              return ms?.map(function (m, i) {
                                                if (i !== mi) return m;
                                                return {
                                                  ...m,
                                                  lessons: m?.lessons?.map(
                                                    function (l, j) {
                                                      return j === li
                                                        ? {
                                                          ...l,
                                                          file: file,
                                                          tempName: file.name,
                                                          url: previewUrl, // Set the preview URL here
                                                        }
                                                        : l;
                                                    },
                                                  ),
                                                };
                                              });
                                            });
                                          }}
                                        />

                                        {/* 2. Show the existing database URL if it exists */}
                                        {les?.url && !les?.tempName && (
                                          <div
                                            style={{
                                              fontSize: 10,
                                              color: "#3b82f6",
                                              paddingLeft: 5,
                                            }}
                                          >
                                            Current File: {les?.url}
                                            <a
                                              href={les?.url}
                                              target="_blank"
                                              rel="noreferrer"
                                              style={{
                                                textDecoration: "underline",
                                              }}
                                            >
                                              View existing
                                            </a>
                                          </div>
                                        )}

                                        {/* 3. Show the new filename if the user just selected one */}
                                        {les?.tempName && (
                                          <div
                                            style={{
                                              fontSize: 10,
                                              color: "#22c55e",
                                              paddingLeft: 5,
                                            }}
                                          >
                                            New file selected:{" "}
                                            <strong>{les?.tempName}</strong>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                </div>
                                <select
                                  style={{
                                    ...css.input,
                                    padding: "7px 8px",
                                    fontSize: 11,
                                  }}
                                  value={(les?.type || "").toUpperCase()}
                                  onChange={function (e) {
                                    var v = e?.target?.value;
                                    setSelectedLessonType(v);
                                    setCourseModules(function (ms) {
                                      return ms?.map(function (m, i) {
                                        if (i !== mi) return m;
                                        var newL = m?.lessons?.map(
                                          function (l, j) {
                                            return j === li
                                              ? { ...l, type: v }
                                              : l;
                                          },
                                        );
                                        return { ...m, lessons: newL };
                                      });
                                    });
                                  }}
                                >
                                  {[
                                    "VIDEO",
                                    "PDF",
                                    "TEXT",
                                    "AUDIO",
                                    "SCORM",
                                    "ZOOM",
                                    "ASSIGNMENT",
                                  ].map(function (t) {
                                    return <option key={t}>{t}</option>;
                                  })}
                                </select>
                                <button
                                  onClick={function () {
                                    if ((mod?.lessons || []).length <= 1) {
                                      notify(
                                        "A module needs at least one lesson.",
                                        "error",
                                      );
                                      return;
                                    }
                                    setCourseModules(function (ms) {
                                      return ms?.map(function (m, i) {
                                        if (i !== mi) return m;
                                        var newL = m?.lessons?.filter(
                                          function (_, j) {
                                            return j !== li;
                                          },
                                        );
                                        return { ...m, lessons: newL };
                                      });
                                    });
                                    notify("Lesson removed");
                                  }}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#EF4444",
                                    fontSize: 14,
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            );
                          })}

                          {/* Add lesson */}
                          <button
                            onClick={function () {
                              var newLes = {
                                title: "New Lesson",
                                type: "VIDEO",
                                desc: "",
                              };
                              setCourseModules(function (ms) {
                                return ms?.map(function (m, i) {
                                  return i === mi
                                    ? {
                                      ...m,
                                      lessons: (m?.lessons || []).concat([
                                        newLes,
                                      ]),
                                    }
                                    : m;
                                });
                              });
                              notify("Lesson added");
                            }}
                            style={{
                              ...css.btnOut("#8B5CF6"),
                              fontSize: 12,
                              padding: "7px 14px",
                              marginTop: 4,
                            }}
                          >
                            + Add Lesson
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ── SECTION C: COURSE SETTINGS ── */}
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: 12,
                  padding: "20px 22px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      background: "#F59E0B",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    C
                  </div>
                  <span
                    style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}
                  >
                    Settings
                  </span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  {/* Drip Release */}
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 8,
                      padding: "14px 16px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 13,
                            marginBottom: 2,
                          }}
                        >
                          Drip Release
                        </div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>
                          Release content gradually over time
                        </div>
                      </div>
                      <button
                        onClick={function () {
                          setNewCourse(function (n) {
                            return { ...n, dripEnabled: !n.dripEnabled };
                          });
                        }}
                        style={{
                          width: 44,
                          height: 24,
                          background: newCourse?.dripEnabled ? p : "#e2e8f0",
                          borderRadius: 12,
                          border: "none",
                          cursor: "pointer",
                          transition: "background 0.2s",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: 2,
                            left: newCourse?.dripEnabled ? 22 : 2,
                            width: 20,
                            height: 20,
                            background: "#fff",
                            borderRadius: "50%",
                            transition: "left 0.2s",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                          }}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Certificate on completion */}
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 8,
                      padding: "14px 16px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 13,
                            marginBottom: 2,
                          }}
                        >
                          Issue Certificate
                        </div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>
                          Auto-issue on passing score
                        </div>
                      </div>
                      <div
                        style={{
                          width: 44,
                          height: 24,
                          background: p,
                          borderRadius: 12,
                          border: "none",
                          cursor: "default",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: 2,
                            left: 22,
                            width: 20,
                            height: 20,
                            background: "#fff",
                            borderRadius: "50%",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* QCTO Compliant */}
                  <div
                    style={{
                      background: "#f0fdf4",
                      borderRadius: 8,
                      padding: "14px 16px",
                      border: "1px solid #86efac",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: "#166534",
                        marginBottom: 2,
                      }}
                    >
                      ✅ QCTO Aligned
                    </div>
                    <div style={{ fontSize: 11, color: "#16a34a" }}>
                      NQF Level, credits, and SAQA ID are QCTO-compliant fields
                    </div>
                  </div>

                  {/* Enrolment form */}
                  <div
                    style={{
                      background: "#eff6ff",
                      borderRadius: 8,
                      padding: "14px 16px",
                      border: "1px solid #bfdbfe",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: "#1e40af",
                        marginBottom: 2,
                      }}
                    >
                      📋 Enrolment Form
                    </div>
                    <div style={{ fontSize: 11, color: "#3b82f6" }}>
                      QCTO enrolment form (Sections A–H) auto-attached to this
                      course
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Footer buttons ── */}
            <div
              style={{
                padding: "16px 32px 24px",
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
                borderTop: "1px solid #f1f5f9",
              }}
            >
              <button
                onClick={function () {
                  setCourseBuilderOpen(false);
                  setEditingCourse(null);
                }}
                style={css.btnOut("#94a3b8")}
              >
                Cancel
              </button>
              {editingCourse && (
                <button
                  onClick={async function () {
                    if (
                      window.confirm(
                        "Delete this course? This cannot be undone.",
                      )
                    ) {
                      try {
                        // Dispatch the deleteCourse thunk
                        await dispatch(
                          deleteCourse(editingCourse?._id || editingCourse?.id),
                        ).unwrap();

                        // Optional: close builder and reset local states
                        setCourseBuilderOpen(false);
                        setEditingCourse(null);
                        setNewCourse(BLANK_COURSE);
                        setCourseModules([]);
                        setActiveModuleIdx(null);

                        notify("Course deleted.");
                      } catch (err) {
                        notify(err.error || "Failed to delete course", "error");
                      }
                    }
                  }}
                  style={css.btnOut("#EF4444")}
                >
                  🗑 Delete Course
                </button>
              )}
              <button
                onClick={editingCourse ? saveCourse : createCourse}
                disabled={!newCourse?.title}
                style={{
                  ...css.btn(p),
                  opacity: newCourse?.title ? 1 : 0.5,
                  minWidth: 140,
                }}
              >
                {editingCourse ? "💾 Save Changes" : "📚 Create Course"}
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminSidebar
        tab={tab}
        setTab={setTab}
        items={SB_ITEMS}
        tenant={tenant}
        p={p}
        s={s}
        css={css}
        currentUser={currentUser}
        userRole={userRole}
        currentTenant={currentTenant}
        logout={logout}
        notification={notification}
      />

      <div style={css.main}>
        {tab === "dashboard" && (
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
              <StatCard
                icon="📚"
                value={AdminCourse?.length}
                label="Total Courses"
                color={p}
              />
              <StatCard
                icon="👥"
                value={totalEnrolled?.length.toLocaleString()}
                label="Total Learners"
                color="#10B981"
              />
              <StatCard
                icon="📈"
                value={published?.length}
                label="Published"
                color={a}
              />
              <StatCard
                icon="💰"
                value="R47,850"
                label="Revenue MTD"
                color="#8B5CF6"
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
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
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <span style={{ fontSize: 20 }}>{course?.thumb}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>
                            {course?.title}
                          </div>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>
                            {course?.enrolled} enrolled
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={css.tag(
                            course?.status === "published" ? "#10B981" : "#F59E0B",
                          )}
                        >
                          {course?.status}
                        </span>
                        <button
                          onClick={function () {
                            openCourseEditor(course);
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 14,
                            color: "#94a3b8",
                            padding: 2,
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
              <div style={css.card}>
                <h3 style={{ ...css.h3, marginBottom: 14 }}>Recent Learners</h3>
                {tierLearner?.slice(0, 4)?.map(function (learner) {
                  const userCourses = Enrollment.filter(
                    (enroll) => enroll?.learnerId?.userId === learner?.userId?._id,
                  ).reduce((prev, enroll) => {
                    const userId = enroll?.learnerId?.userId?.toString();

                    if (!prev[userId]) {
                      prev[userId] = {
                        userId: userId,
                        courses: [],
                        totalCredits: 0,
                      };
                    }

                    const course = enroll.courseId;
                    prev[userId].courses.push(course?.title);
                    prev[userId].totalCredits += course?.credits;

                    return prev;
                  }, {});

                  const currentUser = userCourses[learner?.userId?._id] || {
                    courses: [],
                    totalCredits: 0,
                  };
                  return (
                    <div
                      key={learner?.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 0",
                        borderBottom: "1px solid #f8fafc",
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          background: p + "20",
                          color: p,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      > {learner?.userId?.name
                        ? learner?.userId?.name?.split(" ")
                          .slice(0, 2)
                          .map(name => name[0]?.toUpperCase())
                          .filter(Boolean)
                          .join('')
                        : ""}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>
                          {learner?.userId.name}
                        </div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>
                          {learner?.cohort}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          color: "#10B981",
                          fontWeight: 700,
                        }}
                      >
                        {currentUser?.totalCredits} cr
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab === "courses" && (
          <div className="fade">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <h1 style={css.h1}>Courses</h1>
              <button
                onClick={function () {
                  (currentTenant === "acme" && limitedCourses?.length === 5) ||
                    (currentTenant === "techpro" && limitedCourses?.length === 10)
                    ? notify(
                      "Please delete the existing course before adding a new one.",
                      "error",
                    )
                    : openCourseEditor(null);
                }}
                style={css.btn(p)}
              >
                + New Course
              </button>
            </div>
            <div style={css.card}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                    {[
                      "Course",
                      "Category",
                      "NQF",
                      "Enrolled",
                      "Status",
                      "Actions",
                    ]?.map(function (header) {
                      return (
                        <th
                          key={header}
                          style={{
                            textAlign: "left",
                            padding: "8px 12px",
                            fontSize: 12,
                            color: "#64748b",
                            fontWeight: 600,
                          }}
                        >
                          {header}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {coursesPag.slice.map(function (course) {
                    console.log("Course:", course);
                    const enrolled = Enrollment.filter((enrollment) => enrollment?.courseId?._id === course?.id).length;
                    return (
                      <tr
                        key={course?.id}
                        style={{ borderBottom: "1px solid #f8fafc" }}
                      >
                        <td style={{ padding: "12px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <span style={{ fontSize: 20 }}>{course?.thumb}</span>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13 }}>
                                {course?.title}
                              </div>
                              <div style={{ fontSize: 11, color: "#94a3b8" }}>
                                {course?.level.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: 13,
                            color: "#475569",
                          }}
                        >
                          {course?.cat}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          {course?.nqf}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          {enrolled}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span
                            style={css.tag(
                              course?.status === "published" ? "#10B981" : "#F59E0B",
                            )}
                          >
                            {course?.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              onClick={function () {
                                openCourse(course);
                              }}
                              style={css.btn(p, "#fff", true)}
                            >
                              View
                            </button>
                            <button
                              onClick={function () {
                                openCourseEditor(course);
                              }}
                              style={{
                                ...css.btnOut(p, true),
                                background: p + "10",
                              }}
                            >
                              ✏ Edit
                            </button>
                            <button
                              onClick={function () {
                                setUploadingForCourse(course);
                              }}
                              style={css.btnOut("#8B5CF6", true)}
                            >
                              📦 Materials
                            </button>
                            <button
                              onClick={function () {
                                publishCourse(course?._id || course?.id, course?.status);
                              }}
                              style={css.btnOut(
                                course?.status === "published" ? "#EF4444" : p,
                                true,
                              )}
                            >
                              {course?.status === "published"
                                ? "Unpublish"
                                : "Publish"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <PaginationBar {...coursesPag} perPage={5} color={p} />
            </div>
          </div>
        )}

        {tab === "learners" && (
          <div className="fade">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <h1 style={css.h1}>Learners</h1>
              <div style={{ display: "flex", gap: 10 }}>
                <select
                  onChange={(e) => setFilteredLearners(e?.target?.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    fontSize: 13,
                    borderRadius: 6,
                    border: `1px solid ${p}50`,
                    outline: "none",
                    background: "#fff",
                    cursor: AdminCourse?.length ? "pointer" : "not-allowed",
                  }}
                >
                  <option value="">All Courses</option>
                  {AdminCourse?.filter((f) => f?.status === "published").map((course, index) => (
                    <option key={index} value={course?.title}>
                      {course?.title}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => downloadCSV(LearnerCourseWise)}
                  style={css.btn(p)}
                >
                  ⬆ Export Learners
                </button>
                {/* <button
                  // onClick={() => downloadCSV(LearnerCourseWise)}
                  style={css.btn(p)}
                >
                  ⬇ Import Learners
                </button> */}
              </div>
            </div>
            <div style={css.card}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                    {[
                      "Learner",
                      "Email",
                      "Course",
                      "Cohort",
                      "Enrolled",
                      "Completed",
                      "Credits",
                      "Actions",
                    ]?.map(function (header) {
                      return (
                        <th
                          key={header}
                          style={{
                            textAlign: "left",
                            padding: "8px 12px",
                            fontSize: 12,
                            color: "#64748b",
                            fontWeight: 600,
                          }}
                        >
                          {header}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {learnersPag?.slice?.map(function (learner) {
                    const Enrolled = Enrollment?.filter(
                      (enroll) => enroll?.learnerId?.userId === learner?.userId?._id,
                    )?.length;
                    const completedCoursesCount = Enrollment?.filter(
                      (enroll) => enroll?.learnerId?.userId === learner?.userId?._id
                    ).reduce((count, enroll) => {
                      const course = enroll.courseId;

                      // 👉 Total lessons in course
                      const totalLessons =
                        course?.modules?.flatMap((m) =>
                          m?.lessons?.map((lesson) => lesson?._id?.toString())
                        ).length || 0;


                      // 👉 Completed lessons for this enrollment
                      const completedLessons = lessonStatus.filter(
                        (ls) =>
                          ls?.enrollId?._id?.toString() === enroll?._id?.toString()
                      ).length;
                      // 👉 Check if fully completed
                      if (totalLessons > 0 && completedLessons === totalLessons) {
                        return count + 1;
                      }

                      return count;
                    }, 0);
                    const userCourses = Enrollment.filter(
                      (enroll) => enroll?.learnerId?.userId === learner?.userId?._id,
                    ).reduce((prev, enroll) => {
                      const userId = enroll?.learnerId?.userId?.toString();

                      if (!prev[userId]) {
                        prev[userId] = {
                          userId: userId,
                          courses: [],
                          totalCredits: 0,
                        };
                      }

                      const course = enroll.courseId;
                      prev[userId].courses.push(course.title);
                      prev[userId].totalCredits += course.credits;

                      return prev;
                    }, {});

                    const currentUser = userCourses[learner?.userId?._id] || {
                      courses: [],
                      totalCredits: 0,
                    };
                    return (
                      <tr
                        key={learner?.id}
                        style={{ borderBottom: "1px solid #f8fafc" }}
                      >
                        <td style={{ padding: "12px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                background: p + "20",
                                color: p,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 12,
                                fontWeight: 700,
                              }}
                            >
                              {learner?.userId?.name
                                ? learner?.userId?.name?.split(" ")
                                  ?.slice(0, 2)
                                  ?.map(name => name[0]?.toUpperCase())
                                  ?.filter(Boolean)
                                  ?.join('')
                                : ""}                            </div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>
                              {learner?.userId?.name}
                            </div>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: 12,
                            color: "#64748b",
                          }}
                        >
                          {learner?.userId?.email}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span style={css.tag(courses)}>
                            {currentUser?.courses?.length > 0 ? (
                              <ul>
                                {currentUser?.courses?.map((course, index) => (
                                  <li key={index}>{course}</li> // Display course name
                                ))}
                              </ul>
                            ) : (
                              <p>No courses enrolled</p>
                            )}
                          </span>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span style={css.tag(p)}>{learner?.cohort}</span>
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          {Enrolled}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#10B981",
                          }}
                        >
                          {completedCoursesCount}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#8B5CF6",
                          }}
                        >
                          {currentUser?.totalCredits}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <button
                            onClick={function () {
                              openModule(learner);
                              setTab("module");
                              notify("Viewing " + learner?.userId?.name + "'s profile");
                            }}
                            style={css.btn(p, "#fff", true)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <PaginationBar {...learnersPag} perPage={6} color={p} />
            </div>
            { }
          </div>
        )}

        {activeLearner && tab === "module" && (
          <div className="fade">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <h1 style={{ ...css.h1, marginBottom: 24 }}>{activeLearner?.userId?.name} Courses</h1>


              <button
                onClick={() => setTab("learners")}
                style={css.btn(p)}
              >
                Back
              </button>

            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: 16,
              }}
            >
              {LearnerCourse?.map(function (learnerCourse) {
                // Direct progress calculation for the specific course card
                const totalLessons = learnerCourse?.courseId?.modules?.reduce((sum, mod) => sum + (mod?.lessons?.length || 0), 0) || 0;
                const completedLessons = lessonStatus?.filter(ls =>
                  String(ls?.enrollmentId?._id || ls?.enrollmentId) === String(learnerCourse?._id) &&
                  ls?.status === "completed"
                ).length;
                const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

                return (
                  <div
                    key={learnerCourse?._id}
                    style={{ ...css.card, display: "flex", gap: 14 }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        background: p + "18",
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 26,
                      }}
                    >
                      {learnerCourse?.courseId?.thumb}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          marginBottom: 4,
                        }}
                      >
                        {learnerCourse?.courseId?.title}
                      </div>
                      <div style={{
                        height: 6,
                        background: "#f1f5f9",
                        borderRadius: 3,
                        margin: "8px 0",
                        overflow: "hidden"
                      }}>
                        <div style={{
                          height: "100%",
                          width: progressPercentage + "%",
                          background: p,
                          borderRadius: 3,
                          transition: "width 0.4s ease"
                        }} />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>{progressPercentage}% complete</span>

                        <div style={{ display: "flex", gap: 5 }}>
                          <div style={{ display: "flex", gap: 5 }}>
                            <input
                              type="file"
                              accept=".txt,.pdf"
                              style={{ display: "none" }}
                              id={`fileUpload-${learnerCourse?._id}`} // unique ID per course
                              onChange={(e) => handleFileUpload(e, learnerCourse?._id)} // pass course ID
                            />
                            <div
                              style={{
                                backgroundColor: "#007BFF",
                                color: "#fff",
                                padding: "10px",
                                border: "none",
                                borderRadius: "4px",
                              }}
                            >
                              Practical
                            </div>
                            {/* {uploadedFilesByCourse[c?.id]?.length > 0 && (
                              <div>
                                <ul>
                                  {uploadedFilesByCourse[c?.id].map(
                                    (file, index) => (
                                      <li key={index} style={{ marginTop: 5 }}>
                                        <button
                                          onClick={() => openFile(file)}
                                          style={{
                                            marginLeft: 10,
                                            padding: "2px 5px",
                                            backgroundColor: "#4CAF50",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: 3,
                                          }}
                                        >
                                          Open
                                        </button>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            )} */}
                          </div>

                          {(learnerCourse?.progress?.percentage ?? learnerCourse?.progress) === 100 ? (
                            <span
                              style={{
                                ...css.tag("#10B981"),
                                fontSize: 10,
                                paddingTop: 10,
                              }}
                            >
                              Completed
                            </span>
                          ) : (
                            <button
                              onClick={function () {
                                openCourse(learnerCourse);
                              }}
                              style={css.btn(p, "#fff", true)}
                            >
                              Continue
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* <PaginationBar {...myCourPag} perPage={4} color={p} /> */}
          </div>
        )}

        {tab === "enrolments" && (
          <div className="fade">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <div>
                <h1 style={css.h1}>Enrolment Records</h1>
                <p style={{ color: "#64748b", marginTop: 4, fontSize: 14 }}>
                  QCTO-compliant enrolment forms with document status
                </p>
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                <button
                  onClick={() => setOpenEnrolmentForm(true)}
                  style={{
                    background: "#21734615",
                    color: "#217346",
                    border: "1px solid #21734630",
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  + Add Learner Enrollment
                </button>

                <button
                  onClick={exportEnrolmentReport}
                  style={{
                    background: "#21734615",
                    color: "#217346",
                    border: "1px solid #21734630",
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  📊 Export Report (.xlsx)
                </button>
                <>
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <button
                    onClick={ImportEnrolmentReport}
                    style={{
                      background: "#21734615",
                      color: "#217346",
                      border: "1px solid #21734630",
                      borderRadius: 8,
                      padding: "10px 18px",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    📊 Bulk Import (.xlsx)
                  </button>
                </>
              </div>
            </div>
            {Enrollment?.length === 0 ? (
              <div
                style={{ ...css.card, textAlign: "center", padding: "60px" }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                <h3 style={css.h3}>No Enrolment Forms Yet</h3>
                <p style={{ color: "#64748b", marginTop: 8 }}>
                  Learners must complete the QCTO enrolment form when enrolling
                  in a course.
                </p>
              </div>
            ) : (
              enrolPag?.slice?.map(function (rec, i) {
                var docKeys = [
                  "certifiedId",
                  "highestQual",
                  "cv",
                  "studyPermit",
                  "workplaceConf",
                  "entryAssessment",
                ];
                var docLabels = {
                  certifiedId: "Certified ID",
                  highestQual: "Highest Qual",
                  cv: "CV",
                  studyPermit: "Study Permit",
                  workplaceConf: "Workplace Conf",
                  entryAssessment: "Entry Assessment",
                };
                var uploaded = docKeys?.filter(function (k) {
                  return rec?.docs && rec?.docs[k];
                }).length;
                var outstanding = docKeys
                  ?.filter(function (k) {
                    return !rec?.docs || !rec?.docs[k];
                  })
                  .map(function (k) {
                    return docLabels[k];
                  });
                return (
                  <div key={rec?._id} style={{ ...css.card, marginBottom: 14 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 12,
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 15 }}>
                          {(rec?.personal && rec?.personal?.fullName) || "—"}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#64748b",
                            marginTop: 2,
                          }}
                        >
                          {rec?.personal && rec?.personal?.idNumber} •{" "}
                          {rec?.personal && rec?.personal?.email}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: p,
                            marginTop: 4,
                            fontWeight: 600,
                          }}
                        >
                          {rec?.courseId && rec?.courseId?.title} — NQF{" "}
                          {rec?.courseId && rec?.courseId?.nqf} •{" "}
                          {rec?.courseId && rec?.courseId?.credits} Credits
                        </div>
                      </div>
                      <span style={{ ...css.tag("#10B981") }}>✓ Submitted</span>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4,1fr)",
                        gap: 10,
                        marginBottom: 12,
                      }}
                    >
                      {[
                        ["SAQA ID", (rec && rec?.saqaId) || "—"],
                        ["Intake", (rec && rec?.intakeNo) || "—"],
                        [
                          "POPIA",
                          rec?.popia && rec?.popia?.consent ? "✓ Yes" : "⚠ No",
                        ],
                        [
                          "Approved",
                          (rec?.provider && rec?.provider?.approved) || "—",
                        ],
                      ].map(function (pair) {
                        return (
                          <div
                            key={pair[0]}
                            style={{
                              background: "#f8fafc",
                              borderRadius: 8,
                              padding: "8px 10px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: 10,
                                color: "#94a3b8",
                                fontWeight: 600,
                              }}
                            >
                              {pair[0]}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                marginTop: 2,
                              }}
                            >
                              {pair[1]}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#475569",
                          marginBottom: 6,
                        }}
                      >
                        Documents ({uploaded}/{docKeys?.length} uploaded)
                      </div>
                      <div
                        style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                      >
                        {docKeys?.map(function (key) {
                          var has = rec.docs && rec.docs[key];
                          return (
                            <span
                              key={key}
                              style={{
                                background: has ? "#10B98118" : "#FEF3C7",
                                color: has ? "#10B981" : "#92400E",
                                border:
                                  "1px solid " + (has ? "#86EFAC" : "#FDE68A"),
                                borderRadius: 100,
                                padding: "3px 10px",
                                fontSize: 11,
                                fontWeight: 600,
                              }}
                            >
                              {has ? "✓" : "⚠"} {docLabels[key]}
                            </span>
                          );
                        })}
                      </div>
                      {outstanding.length > 0 && (
                        <div
                          style={{
                            marginTop: 8,
                            fontSize: 11,
                            color: "#92400E",
                            background: "#FEF3C7",
                            borderRadius: 6,
                            padding: "6px 10px",
                          }}
                        >
                          ⚠ Outstanding: {outstanding.join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            {Enrollment.length > 5 && (
              <PaginationBar {...enrolPag} perPage={5} color={p} />
            )}
          </div>
        )}

        {tab === "analytics" && (
          <div className="fade">
            <h1 style={{ ...css.h1, marginBottom: 24 }}>Analytics</h1>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <StatCard
                icon="👥"
                value={totalEnrolled?.length.toLocaleString()}
                label="Total Enrolments"
                color={p}
              />
              <StatCard
                icon="🏆"
                value="89%"
                label="Completion Rate"
                color="#10B981"
              />
              <StatCard icon="📝" value="76%" label="Avg Pass Rate" color={a} />
              <StatCard
                icon="⭐"
                value="247"
                label="Credits Awarded"
                color="#8B5CF6"
              />
            </div>
            <div style={{ ...css.card }}>
              <h3 style={{ ...css.h3, marginBottom: 16 }}>
                Course Performance
              </h3>
              {AdminCourse?.filter(function (c) {
                return c?.status === "published";
              }).map(function (c) {
                const enrolled = Enrollment.filter(
                  (enroll) => enroll?.courseId?._id === c?._id,
                )?.length;
                var pct = Math.round((enrolled / 500) * 100);
                return (
                  <div key={c?.id} style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <span style={{ fontSize: 13 }}>
                        {c?.thumb} {c?.title}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: p }}>
                        {enrolled} enrolled
                      </span>
                    </div>
                    <div
                      style={{
                        height: 8,
                        background: "#f1f5f9",
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: pct + "%",
                          background: p,
                          borderRadius: 4,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "payments" && (
          <div className="fade">
            <h1 style={{ ...css.h1, marginBottom: 4 }}>Payments & Orders</h1>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>
              South African payment methods —{/* PayShap instant transfer and */}EFT
              bank deposit. Zero transaction fees.
            </p>

            {/* ── Stat cards ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <StatCard
                icon="💰"
                value="R47,850"
                label="Revenue MTD"
                color="#10B981"
              />
              <StatCard icon="📋" value="89" label="Transactions" color={p} />
              <StatCard
                icon="⏳"
                value="R1,250"
                label="Pending EFTs"
                color="#F59E0B"
              />
              <StatCard
                icon="⚡"
                value="R9,840"
                label="PayShap MTD"
                color="#6366F1"
              />
            </div>

            {/* ── Banking details card ── */}
            <div
              style={{
                ...css.card,
                marginBottom: 16,
                border: "2px solid " + p + "30",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      background: p + "15",
                      borderRadius: 10,
                      padding: "8px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 20 }}>🏦</span>
                    <span style={{ fontWeight: 800, fontSize: 15, color: p }}>
                      Billing Bank Account
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>
                    Learners make payment to this account for EFT {/*and PayShap*/}
                  </span>
                </div>

                {/* Edit / Save button */}
                <button
                  style={{
                    background: isEditing ? "#10B981" : "#6366F1",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    isEditing ? handleSave() : setIsEditing(true)
                  }
                >
                  {isEditing ? "Save" : "Edit"}
                </button>
              </div>

              {/* Bank detail inputs */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {bankDetailsArray?.map(({ key, label }, idx) => (
                  <div
                    key={key}
                    style={{
                      background: "#f8fafc",
                      borderRadius: 8,
                      padding: "10px 14px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: "#94a3b8",
                        fontWeight: 600,
                        marginBottom: 3,
                      }}
                    >
                      {label?.toUpperCase()}
                    </div>
                    <input
                      ref={idx === 0 ? firstInputRef : null}
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#0f172a",
                        width: "100%",
                        border: isEditing ? "1px solid #6366F1" : "none",
                        borderRadius: isEditing ? 6 : 0,
                        background: isEditing ? "#fff" : "transparent",
                        padding: isEditing ? "4px 8px" : 0,
                        cursor: isEditing ? "text" : "default",
                        outline: "none",
                        transition: "all 0.15s ease",
                      }}
                      value={
                        /*(key === "accountName" && (tenant.name || localBankDetails[key])) || */ (key ===
                          "payShapId" &&
                          `${localBankDetails[key]}-${currentTenant}`) ||
                        localBankDetails[key]
                      }
                      readOnly={!isEditing}
                      onChange={(e) =>
                        setLocalBankDetails({
                          ...localBankDetails,
                          [key]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 12,
                  padding: "10px 14px",
                  background: "#FEF9C3",
                  borderRadius: 8,
                  border: "1px solid #FDE68A",
                  fontSize: 12,
                  color: "#92400E",
                }}
              >
                ⚠ Learners must use their <strong>Invoice Number</strong> as the
                payment reference so payments can be matched automatically.
              </div>
            </div>

            {/* ── Payment methods guide ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 16,
                marginBottom: 16,
              }}
            >
              {/* PayShap */}
              {/* <div style={{ ...css.card, border: "2px solid #6366F130" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      background: "#6366F115",
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                    }}
                  >
                    ⚡
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 15,
                        color: "#0f172a",
                      }}
                    >
                      PayShap
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#10B981",
                        fontWeight: 600,
                      }}
                    >
                      Instant · Real-time clearing
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "#475569",
                    lineHeight: 1.7,
                    marginBottom: 14,
                  }}
                >
                  South Africa&apos;s real-time interbank payment system.
                  Learner sends payment instantly from any SA bank app using the
                  PayShap ID. Cleared in seconds, confirmed immediately.
                </p>
                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: 8,
                    padding: "10px 12px",
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "#94a3b8",
                      fontWeight: 600,
                      marginBottom: 2,
                    }}
                  >
                    PAYSHAP ID
                  </div>
                  <div
                    style={{ fontSize: 14, fontWeight: 800, color: "#6366F1" }}
                  >
                    {"@skillivio-" + currentTenant}
                  </div>
                </div>
                <div
                  style={{ fontSize: 12, color: "#64748b", lineHeight: 1.8 }}
                >
                  <div>✓ Available at all major SA banks</div>
                  <div>✓ Up to R3,000 per transaction</div>
                  <div>✓ 24/7 including weekends and holidays</div>
                  <div>✓ No additional fees for learner or SDP</div>
                </div>
              </div> */}

              {/* EFT */}
              <div style={{ ...css.card, border: "2px solid #F59E0B30" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      background: "#F59E0B15",
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                    }}
                  >
                    🏦
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 15,
                        color: "#0f172a",
                      }}
                    >
                      EFT Bank Transfer
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#F59E0B",
                        fontWeight: 600,
                      }}
                    >
                      1–2 business days
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "#475569",
                    lineHeight: 1.7,
                    marginBottom: 14,
                  }}
                >
                  Standard electronic fund transfer. Learner logs into their
                  bank and makes a direct deposit. Payment reflects within 1–2
                  business days and must be manually verified by admin.
                </p>
                <div
                  style={{
                    background: "#FEF9C3",
                    borderRadius: 8,
                    padding: "10px 12px",
                    marginBottom: 10,
                    border: "1px solid #FDE68A",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "#92400E",
                      fontWeight: 600,
                      marginBottom: 2,
                    }}
                  >
                    ⚠ LEARNER MUST USE AS REFERENCE
                  </div>
                  <div
                    style={{ fontSize: 13, fontWeight: 800, color: "#92400E" }}
                  >
                    Invoice number from email
                  </div>
                </div>
                <div
                  style={{ fontSize: 12, color: "#64748b", lineHeight: 1.8 }}
                >
                  <div>✓ Accepted from any SA bank</div>
                  <div>✓ No transaction amount limit</div>
                  <div>⚠ Admin must verify and activate enrolment</div>
                  <div>⚠ Learner must upload proof of payment</div>
                </div>
              </div>
            </div>

            {/* ── Recent transactions ── */}
            <div style={css.card}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <h3 style={css.h3}>Recent Transactions</h3>
                <div style={{ display: "flex", gap: 8 }}>
                  {/* <span
                    style={{ ...css.tag("#6366F1"), cursor: "pointer" }}
                    onClick={function () {
                      notify("Filtered: PayShap");
                    }}
                  >
                    ⚡ PayShap
                  </span> */}
                  <span
                    style={{ ...css.tag("#F59E0B"), cursor: "pointer" }}
                    onClick={function () {
                      notify("Filtered: EFT");
                    }}
                  >
                    🏦 EFT
                  </span>
                  <span
                    style={{ ...css.tag("#10B981"), cursor: "pointer" }}
                    onClick={function () {
                      notify("Filtered: Cleared");
                    }}
                  >
                    ✓ Cleared
                  </span>
                </div>
              </div>
              {[
                // {
                //   n: "Priya Sharma",
                //   c: "Advanced JavaScript",
                //   m: "R1,499",
                //   method: "PayShap",
                //   status: "Cleared",
                //   icon: "⚡",
                // },
                {
                  n: "Thabo Nkosi",
                  c: "Financial Accounting",
                  m: "R999",
                  method: "EFT",
                  status: "Pending",
                  icon: "🏦",
                },
                {
                  n: "Nomvula Dlamini",
                  c: "Leadership & Mgmt",
                  m: "R799",
                  method: "EFT",
                  status: "Cleared",
                  icon: "🏦",
                },
                {
                  n: "Sipho Mthembu",
                  c: "Digital Marketing",
                  m: "R0",
                  method: "Free",
                  status: "Enrolled",
                  icon: "🎁",
                },
                // {
                //   n: "Fatima Hendricks",
                //   c: "Project Management",
                //   m: "R1,499",
                //   method: "PayShap",
                //   status: "Cleared",
                //   icon: "⚡",
                // },
              ].map(function (t, i) {
                var statusColor =
                  t.status === "Cleared" || t.status === "Enrolled"
                    ? "#10B981"
                    : "#F59E0B";
                var methodColor =
                {/* t.method === "PayShap"
                    ? "#6366F1"
                    : */}
                t.method === "EFT"
                  ? "#F59E0B"
                  : "#94a3b8";
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "12px 0",
                      borderBottom: "1px solid #f8fafc",
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        background: methodColor + "15",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      {t.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{t.n}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>
                        {t.c}
                      </div>
                    </div>
                    <span style={{ ...css.tag(methodColor), fontSize: 10 }}>
                      {t.method}
                    </span>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: 14,
                        color: "#0f172a",
                        minWidth: 60,
                        textAlign: "right",
                      }}
                    >
                      {t.m}
                    </span>
                    <span style={{ ...css.tag(statusColor) }}>{t.status}</span>
                    {t.status === "Pending" && (
                      <button
                        onClick={function () {
                          notify("EFT verified — enrolment activated!");
                        }}
                        style={{
                          ...css.btn("#10B981", "#fff", true),
                          fontSize: 11,
                        }}
                      >
                        ✓ Verify
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Pending EFT alerts ── */}
            <div
              style={{
                ...css.card,
                marginTop: 16,
                background: "#FEF9C3",
                border: "1px solid #FDE68A",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 20 }}>⏳</span>
                <h3 style={{ ...css.h3, color: "#92400E" }}>
                  1 EFT Awaiting Verification
                </h3>
              </div>
              <p style={{ fontSize: 13, color: "#92400E", marginBottom: 12 }}>
                The following EFT payments have been initiated but not yet
                verified. Check your bank statement and click Verify to activate
                the learner&apos;s enrolment.
              </p>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>
                    Thabo Nkosi — Financial Accounting
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>
                    Invoice: INV-EFT-1711234567 · R999 · Initiated 2 days ago
                  </div>
                </div>
                <button
                  onClick={function () {
                    notify("Proof of payment request sent to Thabo!");
                  }}
                  style={css.btnOut("#F59E0B", true)}
                >
                  Request Proof
                </button>
                <button
                  onClick={function () {
                    notify("EFT verified! Thabo's enrolment activated.");
                  }}
                  style={css.btn("#10B981", "#fff", true)}
                >
                  ✓ Mark Paid
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "certificates" && (
          <div className="fade">
            <h1 style={{ ...css.h1, marginBottom: 24 }}>Certificates</h1>
            <div style={css.card}>
              <h3 style={{ ...css.h3, marginBottom: 14 }}>
                Issued Certificates
              </h3>
              {[
                {
                  n: "Priya Sharma",
                  c: "Financial Accounting",
                  score: "91%",
                  date: "10 Feb 2026",
                },
                {
                  n: "Nomvula Dlamini",
                  c: "Leadership & Team Mgmt",
                  score: "84%",
                  date: "01 Mar 2026",
                },
                {
                  n: "Fatima Hendricks",
                  c: "Project Management",
                  score: "95%",
                  date: "05 Feb 2026",
                },
              ].map(function (cert, i) {
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "12px 0",
                      borderBottom: "1px solid #f8fafc",
                    }}
                  >
                    <div style={{ fontSize: 28 }}>🏆</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>
                        {cert.n}
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>
                        {cert.c} • {cert.date}
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, color: "#10B981" }}>
                      {cert.score}
                    </span>
                    <button
                      onClick={function () {
                        notify("Certificate downloaded");
                      }}
                      style={css.btn(p, "#fff", true)}
                    >
                      ⬇ PDF
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div className="fade">
            <h1 style={{ ...css.h1, marginBottom: 24 }}>Settings</h1>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div style={css.card}>
                <h3 style={{ ...css.h3, marginBottom: 16 }}>General</h3>
                {[
                  ["Platform Name", tenant.name],
                  ["Support Email", "support@" + currentTenant + ".co.za"],
                  ["Timezone", "Africa/Johannesburg"],
                  ["Currency", "ZAR (R)"],
                ].map(function (pair) {
                  return (
                    <div key={pair[0]} style={{ marginBottom: 14 }}>
                      <label style={css.label}>{pair[0]}</label>
                      <input defaultValue={pair[1]} style={css.input} />
                    </div>
                  );
                })}
                <button
                  onClick={function () {
                    notify("Settings saved!");
                  }}
                  style={css.btn(p)}
                >
                  Save Changes
                </button>
              </div>
              <div style={css.card}>
                <h3 style={{ ...css.h3, marginBottom: 16 }}>
                  QCTO Configuration
                </h3>
                <div style={{ marginBottom: 14 }}>
                  <label style={css.label}>Accreditation Number</label>
                  <input
                    defaultValue="QCTO/ACC/2024/001234"
                    style={css.input}
                  />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={css.label}>SETA Affiliation</label>
                  <select defaultValue="Services SETA" style={css.input}>
                    {[
                      "QCTO (Direct)",
                      "AgriSETA",
                      "BankSETA",
                      "CATHSSETA",
                      "CHIETA",
                      "ETDP SETA",
                      "FoodBev SETA",
                      "HWSETA",
                      "INSETA",
                      "LGSETA",
                      "MerSETA",
                      "MICTS SETA",
                      "MQA",
                      "PSETA",
                      "SASSETA",
                      "Services SETA",
                      "TETA",
                      "W&RSETA",
                      "OTHER",
                    ].map(function (s) {
                      return <option key={s}>{s}</option>;
                    })}
                  </select>
                </div>
                <ToggleSwitch
                  label="Enable QCTO Audit Logging"
                  hint="Log all learner activities"
                  color={p}
                />
                <ToggleSwitch
                  label="Auto-generate SETA Reports"
                  hint="Month-end automated reports"
                  color={p}
                />
                <button
                  onClick={function () {
                    notify("QCTO settings saved!");
                  }}
                  style={{ ...css.btn(p), marginTop: 16 }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "contact" && (
          <div className="fade">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <h1 style={css.h1}>Contact</h1>
            </div>
            <div style={css.card}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                    {[
                      "Name",
                      "Company",
                      "Industry",
                      "noOfLMS",
                      "Country",
                      "Job Title",
                      "Phone Number",
                    ].map(function (h) {
                      return (
                        <th
                          key={h}
                          style={{
                            textAlign: "left",
                            padding: "8px 12px",
                            fontSize: 12,
                            color: "#64748b",
                            fontWeight: 600,
                          }}
                        >
                          {h}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {contactPag?.slice?.map(function (contact) {
                    return (
                      <tr
                        key={contact?.id}
                        style={{ borderBottom: "1px solid #f8fafc" }}
                      >
                        <td style={{ padding: "12px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                background: p + "20",
                                color: p,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 12,
                                fontWeight: 700,
                              }}
                            >
                              {contact?.firstName.toUpperCase()[0]}{contact?.lastName.toUpperCase()[0]}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13 }}>
                                {contact?.firstName} {contact?.lastName}
                              </div>
                              <div style={{ fontSize: 11, color: "#94a3b8" }}>
                                {contact?.businessEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: 13,
                            color: "#475569",
                          }}
                        >
                          {contact?.company}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: 13,
                            color: "#475569",
                          }}
                        >
                          {contact?.industry}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          {contact?.noOfLMs}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: 13,
                            color: "#475569",
                          }}
                        >
                          {contact?.country}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: 13,
                            color: "#475569",
                          }}
                        >
                          {contact?.jobTitle}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: 13,
                            color: "#475569",
                          }}
                        >
                          {contact?.phoneNumber}
                        </td>


                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <PaginationBar {...contactPag} perPage={5} color={p} />
            </div>
          </div>
        )}


      </div>
      {openEnrolmentForm && (
        <EnrolmentForm
          p={p}
          s={s}
          notify={notify}
          learnerUser={currentUser}
          onCancel={function () {
            setOpenEnrolmentForm(false);
          }}
          onSubmit={function (record) {
            // setMyEnrolments(function (prev) { return prev.concat([record]); });
            setOpenEnrolmentForm(false);
            notify("Enrolment submitted successfully!");
            // openCourse(enrollingCourse);
          }}
        />
      )}
    </div>
  );
}
export default AdminDashboard;
