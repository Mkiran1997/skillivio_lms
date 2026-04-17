"use client";

import { useAdminData } from "@/hooks/useAdminData";
import PaginationBar from "@/components/paginationBar";
import EnrolmentForm from "@/components/enrolmentForm";

export default function AdminEnrolmentsPage() {
  const {
    p, s, css,
    Enrollment, enrolPag, notify, currentUser,
    openEnrolmentForm, setOpenEnrolmentForm,
    exportEnrolmentReport, fileInputRef,
  } = useAdminData();

  function ImportEnrolmentReport() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      notify("Importing " + file.name + "...");
      // TODO: Implement bulk import logic
      setTimeout(() => notify("Import complete!"), 1500);
    }
  }

  const docKeys = ["certifiedId", "highestQual", "cv", "studyPermit", "workplaceConf", "entryAssessment"];
  const docLabels = {
    certifiedId: "Certified ID", highestQual: "Highest Qual", cv: "CV",
    studyPermit: "Study Permit", workplaceConf: "Workplace Conf", entryAssessment: "Entry Assessment",
  };

  return (
    <div className="fade">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={css.h1}>Enrolment Records</h1>
          <p style={{ color: "#64748b", marginTop: 4, fontSize: 14 }}>
            QCTO-compliant enrolment forms with document status
          </p>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          <button onClick={() => setOpenEnrolmentForm(true)} style={{ background: "#21734615", color: "#217346", border: "1px solid #21734630", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            + Add Learner Enrollment
          </button>
          <button onClick={exportEnrolmentReport} style={{ background: "#21734615", color: "#217346", border: "1px solid #21734630", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            📊 Export Report (.xlsx)
          </button>
          <>
            <input type="file" accept=".xlsx, .xls" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
            <button onClick={ImportEnrolmentReport} style={{ background: "#21734615", color: "#217346", border: "1px solid #21734630", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              📊 Bulk Import (.xlsx)
            </button>
          </>
        </div>
      </div>

      {Enrollment?.length === 0 ? (
        <div style={{ ...css.card, textAlign: "center", padding: "60px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h3 style={css.h3}>No Enrolment Forms Yet</h3>
          <p style={{ color: "#64748b", marginTop: 8 }}>
            Learners must complete the QCTO enrolment form when enrolling in a course.
          </p>
        </div>
      ) : (
        enrolPag?.slice?.map((rec) => {
          const uploaded = docKeys.filter(k => rec?.docs && rec?.docs[k]).length;
          const outstanding = docKeys.filter(k => !rec?.docs || !rec?.docs[k]).map(k => docLabels[k]);
          return (
            <div key={rec?._id} style={{ ...css.card, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{rec?.personal?.fullName || "—"}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{rec?.personal?.idNumber} • {rec?.personal?.email}</div>
                  <div style={{ fontSize: 12, color: p, marginTop: 4, fontWeight: 600 }}>
                    {rec?.courseId?.title} — NQF {rec?.courseId?.nqf} • {rec?.courseId?.credits} Credits
                  </div>
                </div>
                <span style={css.tag("#10B981")}>✓ Submitted</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 12 }}>
                {[
                  ["SAQA ID", rec?.saqaId || "—"],
                  ["Intake", rec?.intakeNo || "—"],
                  ["POPIA", rec?.popia?.consent ? "✓ Yes" : "⚠ No"],
                  ["Approved", rec?.provider?.approved || "—"],
                ].map(([label, val]) => (
                  <div key={label} style={{ background: "#f8fafc", borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>{label}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>{val}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
                  Documents ({uploaded}/{docKeys.length} uploaded)
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {docKeys.map(key => {
                    const has = rec.docs && rec.docs[key];
                    return (
                      <span key={key} style={{
                        background: has ? "#10B98118" : "#FEF3C7", color: has ? "#10B981" : "#92400E",
                        border: "1px solid " + (has ? "#86EFAC" : "#FDE68A"), borderRadius: 100,
                        padding: "3px 10px", fontSize: 11, fontWeight: 600,
                      }}>
                        {has ? "✓" : "⚠"} {docLabels[key]}
                      </span>
                    );
                  })}
                </div>
                {outstanding.length > 0 && (
                  <div style={{ marginTop: 8, fontSize: 11, color: "#92400E", background: "#FEF3C7", borderRadius: 6, padding: "6px 10px" }}>
                    ⚠ Outstanding: {outstanding.join(", ")}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
      {Enrollment.length > 5 && <PaginationBar {...enrolPag} perPage={5} color={p} />}

      {openEnrolmentForm && (
        <EnrolmentForm
          p={p} s={s} notify={notify} learnerUser={currentUser}
          onCancel={() => setOpenEnrolmentForm(false)}
          onSubmit={(record) => { setOpenEnrolmentForm(false); notify("Enrolment submitted successfully!"); }}
        />
      )}
    </div>
  );
}
