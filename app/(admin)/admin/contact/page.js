"use client";

import { useAdminData } from "@/hooks/useAdminData";
import PaginationBar from "@/components/paginationBar";

export default function AdminContactPage() {
  const { p, css, AdminContact, contactPag } = useAdminData();

  return (
    <div className="fade">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={css.h1}>Contact</h1>
      </div>
      <div style={css.card}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
              {["Name", "Company", "Industry", "noOfLMS", "Country", "Job Title", "Phone Number"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 12, color: "#64748b", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contactPag?.slice?.map(contact => (
              <tr key={contact?.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                <td style={{ padding: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: p + "20", color: p, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                      {contact?.firstName?.toUpperCase()[0]}{contact?.lastName?.toUpperCase()[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{contact?.firstName} {contact?.lastName}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{contact?.businessEmail}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px", fontSize: 13, color: "#475569" }}>{contact?.company}</td>
                <td style={{ padding: "12px", fontSize: 13, color: "#475569" }}>{contact?.industry}</td>
                <td style={{ padding: "12px", fontSize: 13, fontWeight: 600 }}>{contact?.noOfLMs}</td>
                <td style={{ padding: "12px", fontSize: 13, color: "#475569" }}>{contact?.country}</td>
                <td style={{ padding: "12px", fontSize: 13, color: "#475569" }}>{contact?.jobTitle}</td>
                <td style={{ padding: "12px", fontSize: 13, color: "#475569" }}>{contact?.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <PaginationBar {...contactPag} perPage={5} color={p} />
      </div>
    </div>
  );
}
