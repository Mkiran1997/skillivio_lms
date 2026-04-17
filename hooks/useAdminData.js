"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useNotification } from "@/contexts/NotificationContext";
import { deleteCourse, fetchCourses, createCourses, updateCourse, updateCourseStatus } from "@/store/slices/courseSlice";
import { fetchlearners } from "@/store/slices/learnerSlice";
import { fetchbankdetails, updatebankdetails } from "@/store/slices/bankDetailSlice";
import { fetchEnrollment } from "@/store/slices/enrollmentSlice";
import { fetchcontactUs } from "@/store/slices/contactUsSlice";
import { fetchlessonStatus } from "@/store/slices/lessonStatusSlice";
import { usePagination, exportXLSX } from "@/utils/utility";
import { ENROLMENT_STORE, LEARNERS } from "@/utils/mockData";
import * as XLSX from "xlsx";

/**
 * Custom hook that provides all the shared admin data and actions.
 * Extracted from the monolithic AdminDashboard component to be shared
 * across individual admin pages.
 */
export function useAdminData() {
  const { currentUser, currentTenant, tenant, userRole, logout } = useAuth();
  const { p, s, a, css } = useThemeContext();
  const { notify, notification } = useNotification();
  const dispatch = useDispatch();

  // Redux selectors
  const { Course, loading, error } = useSelector((state) => state?.course);
  const { Learners } = useSelector((state) => state?.learners);
  const { bankdetails } = useSelector((state) => state?.bankdetail);
  const { Enrollment } = useSelector((state) => state?.enrollment);
  const { lessonStatus } = useSelector((state) => state?.lessonStatus);
  const { contactUs } = useSelector((state) => state?.contactUs);

  // Local state
  const [isEditing, setIsEditing] = useState(false);
  const [localBankDetails, setLocalBankDetails] = useState({});
  const [openEnrolmentForm, setOpenEnrolmentForm] = useState(false);
  const firstInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedLessonType, setSelectedLessonType] = useState("TEXT");
  const [activeLearner, setActiveLearner] = useState(null);
  const [filteredLearners, setFilteredLearners] = useState("");

  // Course builder state
  const [courseBuilderOpen, setCourseBuilderOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: "",
    cat: "Technology",
    level: "beginner",
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
  const [courseModules, setCourseModules] = useState([]);
  const [activeModuleIdx, setActiveModuleIdx] = useState(null);
  const [uploadingForCourse, setUploadingForCourse] = useState(null);
  const [courseFiles, setCourseFiles] = useState({});

  const BLANK_COURSE = {
    title: "",
    cat: "Technology",
    level: "beginner",
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

  // Fetch data on mount
  useEffect(() => {
    if (!Course || Course.length === 0) dispatch(fetchCourses());
    if (!Learners || Learners.length === 0) dispatch(fetchlearners());
    if (!bankdetails || bankdetails.length === 0) dispatch(fetchbankdetails());
    if (!Enrollment || Enrollment.length === 0) dispatch(fetchEnrollment());
    if (!contactUs || contactUs.length === 0) dispatch(fetchcontactUs());
    if (!lessonStatus || lessonStatus.length === 0) dispatch(fetchlessonStatus());
  }, []);

  useEffect(() => {
    if (bankdetails && bankdetails[0]) {
      setLocalBankDetails({ ...bankdetails[0] });
    }
  }, [bankdetails]);

  // Computed values
  const AdminCourse = useMemo(() => {
    return Course.filter((c) => c?.type === currentUser?.tenantId?.slug);
  }, [Course, currentUser]);

  const tenantLimit =
    currentTenant === "acme" ? 5 : currentTenant === "techpro" ? 10 : Infinity;
  const limitedCourses = AdminCourse.slice(0, tenantLimit);
  const coursesPag = usePagination(limitedCourses, 5);

  const tierLearner = Learners.filter((l) => {
    const lTenantId = l.tenantId || l.userId?.tenantId;
    const cTenantId = currentUser?.tenantId?._id || currentUser?.tenantId;
    if (!lTenantId || !cTenantId) return false;
    const lId = typeof lTenantId === "string" ? lTenantId : lTenantId?._id || lTenantId?.id;
    const cId = typeof cTenantId === "string" ? cTenantId : cTenantId?._id || cTenantId?.id;
    if (lId && cId) return String(lId) === String(cId);
    return l.userId?.tenantId?.slug === currentUser?.tenantId?.slug;
  });

  const LearnerCourseWise = useMemo(() => {
    if (!filteredLearners) return tierLearner;
    return tierLearner.filter((learner) =>
      Enrollment.some(
        (enrollment) =>
          enrollment?.learnerId?.userId?.id === learner?.userId?.id &&
          enrollment?.courseId?.title === filteredLearners
      )
    );
  }, [Enrollment, filteredLearners, tierLearner]);

  const published = AdminCourse.filter((c) => c?.status === "published");
  const totalEnrolled = useMemo(() => {
    return Enrollment.filter(
      (enrol) => enrol?.courseId?.type === currentUser?.tenantId?.slug
    );
  }, [Enrollment, currentUser]);

  const AdminContact = contactUs.filter(
    (c) => c?.type === currentUser?.tenantId?.slug
  );

  const learnersPag = usePagination(LearnerCourseWise, 6);
  const enrolPag = usePagination(totalEnrolled, 5);
  const contactPag = usePagination(AdminContact, 5);

  // Actions
  function openModule(learner) {
    setActiveLearner(learner);
  }

  function publishCourse(id, currentStatus) {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    dispatch(updateCourseStatus({ id, status: newStatus }))
      .unwrap()
      .then(() => notify("Status updated"))
      .catch((err) => notify("Failed to update status: " + (err.error || err.message)));
  }

  function openCourseEditor(course) {
    if (course) {
      setEditingCourse(course);
      setNewCourse({
        title: course.title || "",
        cat: course.cat || "Technology",
        level: course.level || "beginner",
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
          _id: module._id,
          moduleName: module.moduleName,
          lessons: module.lessons || [],
        })),
      });
      setCourseModules(course.modules || []);
      setActiveModuleIdx(0);
    } else {
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
              type: "video",
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
      0
    );
    for (const module of courseModules) {
      if (!module.moduleName) { notify("Module name is required.", "error"); return; }
      if (!module.lessons || module.lessons.length === 0) { notify("Each module should have at least one lesson.", "error"); return; }
      for (const lesson of module.lessons) {
        if (!lesson.title) { notify("Each lesson should have a title.", "error"); return; }
        if (!lesson.type) { notify("Each lesson should have a type.", "error"); return; }
      }
    }

    const courseData = {
      title,
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
      tenantId: currentUser.tenantId._id || currentUser.tenantId,
      type:
        currentUser.tenantId.slug === "acme"
          ? "acme"
          : currentUser.tenantId.slug === "techpro"
            ? "techpro"
            : "skillivio",
    };

    try {
      if (editingCourse) {
        await dispatch(
          updateCourse({ id: editingCourse?._id || editingCourse?.id, updatedData: courseData })
        );
        notify(`"${title}" updated successfully!`);
      } else {
        await dispatch(createCourses(courseData));
        notify(`"${title}" created! Ready to publish.`);
      }
      setCourseBuilderOpen(false);
      setEditingCourse(null);
      setNewCourse(BLANK_COURSE);
      setCourseModules([]);
      setActiveModuleIdx(null);
    } catch (error) {
      notify(error.error || "Error saving course: " + error.message, "error");
    }
  }

  const handleBankSave = () => {
    dispatch(
      updatebankdetails({
        id: localBankDetails?._id,
        updatedData: localBankDetails,
      })
    );
    setIsEditing(false);
  };

  function exportEnrolmentReport() {
    if (Enrollment?.length === 0) {
      notify("No enrolment records yet", "error");
      return;
    }
    const rows = [
      ["Learner", "ID Number", "Email", "Course", "NQF", "Credits", "SAQA ID", "Intake", "Start", "Delivery", "POPIA", "Declaration", "Docs Uploaded", "Submitted"],
    ];
    Enrollment.forEach(function (rec) {
      const docKeys = ["certifiedId", "highestQual", "cv", "studyPermit", "workplaceConf", "entryAssessment"];
      const uploaded = docKeys.filter((k) => rec.docs && rec.docs[k]).length;
      rows.push([
        rec.personal?.fullName || "",
        rec.personal?.idNumber || "",
        rec.personal?.email || "",
        rec.course?.title || "",
        rec?.nqfLevel || "",
        rec.secA?.credits || "",
        rec.secA?.saqaId || "",
        rec.secA?.intakeNo || "",
        rec.secA?.startDate || "",
        rec.secA?.mode || "",
        rec.secG?.consent ? "Yes" : "No",
        rec.secF?.agreed ? "Yes" : "No",
        uploaded + "/" + docKeys.length,
        rec?.submittedAt || "",
      ]);
    });
    exportXLSX("Enrolment_Report.xlsx", rows, "Enrolments");
    notify("Enrolment report exported!");
  }

  const LearnerCourse =
    activeLearner &&
    Enrollment?.filter((l) => l?.learnerId?._id === activeLearner?._id);

  return {
    // Data
    currentUser, currentTenant, tenant, userRole, logout,
    p, s, a, css,
    notify, notification,
    Course, AdminCourse, limitedCourses, coursesPag,
    Learners, tierLearner, LearnerCourseWise, learnersPag,
    Enrollment, totalEnrolled, enrolPag,
    bankdetails, localBankDetails, setLocalBankDetails,
    lessonStatus, contactUs, AdminContact, contactPag,
    published, loading, error,
    filteredLearners, setFilteredLearners,
    tenantLimit,

    // Learner detail
    activeLearner, setActiveLearner, openModule, LearnerCourse,

    // Course builder
    courseBuilderOpen, setCourseBuilderOpen,
    editingCourse, setEditingCourse,
    newCourse, setNewCourse,
    courseModules, setCourseModules,
    activeModuleIdx, setActiveModuleIdx,
    uploadingForCourse, setUploadingForCourse,
    courseFiles, setCourseFiles,
    BLANK_COURSE,
    openCourseEditor, saveCourse, publishCourse,

    // Bank details
    isEditing, setIsEditing, handleBankSave,

    // Enrolment
    openEnrolmentForm, setOpenEnrolmentForm,
    exportEnrolmentReport,
    fileInputRef, firstInputRef, selectedLessonType, setSelectedLessonType,
  };
}
