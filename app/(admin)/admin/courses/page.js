"use client";

import { useAdminData } from "@/hooks/useAdminData";
import PaginationBar from "@/components/paginationBar";
import CourseBuilderModal from "@/components/CourseBuilderModal";
import UploadModal from "@/components/UploadModal";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useNotification } from "@/contexts/NotificationContext";
import { useRouter } from "next/navigation";

export default function AdminCoursesPage() {
  const admin = useAdminData();
  const {
    p, s, a, css,
    AdminCourse, limitedCourses, coursesPag,
    Enrollment, notify, currentTenant,
    openCourseEditor, publishCourse, tenantLimit,
    courseBuilderOpen, setCourseBuilderOpen,
    editingCourse, setEditingCourse,
    newCourse, setNewCourse,
    courseModules, setCourseModules,
    activeModuleIdx, setActiveModuleIdx,
    saveCourse, BLANK_COURSE,
    uploadingForCourse, setUploadingForCourse, currentUser,
    saveCourseMaterials, courseFiles, setCourseFiles
  } = admin;
  const router = useRouter();

  return (
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
              ? notify("Please delete the existing course before adding a new one.", "error")
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
              {["Course", "Category", "NQF", "Enrolled", "Status", "Actions"].map(
                function (header) {
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
                }
              )}
            </tr>
          </thead>
          <tbody>
            {coursesPag.slice.map(function (course) {
              const enrolled = Enrollment.filter(
                (enrollment) => enrollment?.courseId?._id === course?.id
              ).length;
              return (
                <tr key={course?.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 20 }}>{course?.thumb}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{course?.title}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>
                          {course?.level?.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px", fontSize: 13, color: "#475569" }}>
                    {course?.cat}
                  </td>
                  <td style={{ padding: "12px", fontSize: 13, fontWeight: 600 }}>
                    {course?.nqf}
                  </td>
                  <td style={{ padding: "12px", fontSize: 13, fontWeight: 600 }}>
                    {enrolled}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={css.tag(
                        course?.status === "published" ? "#10B981" : "#F59E0B"
                      )}
                    >
                      {course?.status?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => {
                          notify("Navigating to preview...");
                          router.push(`/admin/dashboard`); // Or implement preview
                        }}
                        style={css.btn(p, "#fff", true)}
                      >
                        View
                      </button>
                      <button
                        onClick={() => openCourseEditor(course)}
                        style={{ ...css.btnOut(p, true), background: p + "10" }}
                      >
                        ✏ Edit
                      </button>
                      <button
                        onClick={() => setUploadingForCourse(course)}
                        style={css.btnOut("#8B5CF6", true)}
                      >
                        📦 Materials
                      </button>
                      <button
                        onClick={() =>
                          publishCourse(course?._id || course?.id, course?.status)
                        }
                        style={css.btnOut(
                          course?.status === "published" ? "#EF4444" : p,
                          true
                        )}
                      >
                        {course?.status === "published" ? "Unpublish" : "Publish"}
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
      {courseBuilderOpen && (
        <CourseBuilderModal
          courseBuilderOpen={courseBuilderOpen}
          setCourseBuilderOpen={setCourseBuilderOpen}
          p={p} s={s} a={a} css={css} notify={notify}
          editingCourse={editingCourse} setEditingCourse={setEditingCourse}
          newCourse={newCourse} setNewCourse={setNewCourse}
          courseModules={courseModules} setCourseModules={setCourseModules}
          activeModuleIdx={activeModuleIdx} setActiveModuleIdx={setActiveModuleIdx}
          saveCourse={saveCourse} currentUser={currentUser}
        />
      )}
      {uploadingForCourse && (
        <UploadModal
          uploadingForCourse={uploadingForCourse}
          setUploadingForCourse={setUploadingForCourse}
          p={p} s={s} a={a} css={css} notify={notify}
          saveCourseMaterials={saveCourseMaterials}
          courseFiles={courseFiles}
          setCourseFiles={setCourseFiles}
        />
      )}
    </div>
  );
}
