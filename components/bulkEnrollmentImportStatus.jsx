import { useDispatch, useSelector } from "react-redux";
import { clearBulkEnrollmentImport } from "@/store/slices/enrollmentSlice";

function BulkEnrollmentImportStatus({ color = "#2563eb" }) {
  const dispatch = useDispatch();
  const bulkImport = useSelector((state) => state?.enrollment?.bulkImport);

  if (!bulkImport || bulkImport.status === "idle") {
    return null;
  }

  const total = bulkImport.total || 0;
  const processed = bulkImport.processed || 0;
  const percent = total > 0 ? Math.min(100, Math.round((processed / total) * 100)) : 0;
  const isRunning = bulkImport.status === "running";
  const isFailed = bulkImport.status === "failed";
  const heading = isRunning
    ? "Bulk enrolment import running"
    : isFailed
      ? "Bulk enrolment import failed"
      : "Bulk enrolment import complete";

  return (
    <div
      style={{
        position: "fixed",
        left: 24,
        bottom: 24,
        width: 360,
        maxWidth: "calc(100vw - 48px)",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        boxShadow: "0 20px 45px rgba(15, 23, 42, 0.18)",
        padding: 16,
        zIndex: 9998,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
            {heading}
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
            {bulkImport.fileName || "Spreadsheet import"}
          </div>
        </div>
        {!isRunning && (
          <button
            onClick={() => dispatch(clearBulkEnrollmentImport())}
            style={{
              border: "none",
              background: "transparent",
              color: "#64748b",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
            }}
            aria-label="Dismiss import status"
          >
            ×
          </button>
        )}
      </div>

      <div style={{ marginTop: 14 }}>
        <div
          style={{
            height: 10,
            borderRadius: 999,
            overflow: "hidden",
            background: "#e2e8f0",
          }}
        >
          <div
            style={{
              width: `${percent}%`,
              height: "100%",
              background: isFailed ? "#ef4444" : color,
              transition: "width 0.2s ease",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            fontSize: 12,
            color: "#475569",
          }}
        >
          <span>
            {processed} of {total} rows
          </span>
          <span>{percent}%</span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 10,
          marginTop: 14,
        }}
      >
        {[
          { label: "Created", value: bulkImport.created, color: "#047857" },
          { label: "Skipped", value: bulkImport.skipped, color: "#b45309" },
          
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 10,
              padding: "10px 12px",
            }}
          >
            <div style={{ fontSize: 11, color: "#64748b" }}>{item.label}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: item.color }}>
              {item.value || 0}
            </div>
          </div>
        ))}
      </div>

      {bulkImport.error && (
        <div
          style={{
            marginTop: 12,
            fontSize: 12,
            color: "#b91c1c",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 10,
            padding: "10px 12px",
          }}
        >
          {bulkImport.error}
        </div>
      )}

      {bulkImport.failures?.length > 0 && (
        <div
          style={{
            marginTop: 12,
            maxHeight: 120,
            overflowY: "auto",
            fontSize: 12,
            color: "#7f1d1d",
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: 10,
            padding: "10px 12px",
            whiteSpace: "pre-line",
          }}
        >
          {bulkImport.failures.join("\n")}
        </div>
      )}
    </div>
  );
}

export default BulkEnrollmentImportStatus;
