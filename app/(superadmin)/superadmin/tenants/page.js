"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useNotification } from "@/contexts/NotificationContext";
import { fetchtenants, createtenants, updatetenants } from "@/store/slices/tenantSlice";
import { TIER_DATA } from "@/utils/mockData";
import NewTenantForm from "@/components/newTenantForm";
import EditTenantForm from "@/components/editTenantForm";
import StatCard from "@/components/statCard";

export default function SuperAdminTenantsPage() {
  const { currentUser } = useAuth();
  const { p, css } = useThemeContext();
  const { notify } = useNotification();
  const dispatch = useDispatch();

  const { tenants } = useSelector((state) => state.tenants);

  const [showForm, setShowForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    dispatch(fetchtenants());
  }, [dispatch]);

  const sa = "#F4A800"; // SuperAdmin accent

  function handleNewTenant(form) {
      const id = "t" + Date.now();
      const newTenant = {
          id,
          name: form.name,
          slug: form.slug,
          primary: form.primary || "#000000",
          secondary: form.secondary || "#ffffff",
          accent: form.accent || "#10B981",
          logo: form.logo || "",
          tagline: form.tagline || "",
          general: {
              supportEmail: form.supportEmail || "support@example.com",
              timeZone: form.timeZone || "UTC",
              currency: form.currency || "ZAR"
          },
          QCTOConfig: {
              accreditationNumber: form.accreditationNumber || "",
              setaAffiliation: form.setaAffiliation || "OTHER",
              qctoAudit: form.qctoAudit ?? true,
              autoGenerateQCTO: form.autoGenerateQCTO ?? true
          },
          tier: form.tier,
          contact: form.contact,
          domain: form.domain || `${form.slug}.skillivio.com`,
          email: form.email,
          learners: 0,
          mrr: TIER_DATA[form.tier] ? Number(TIER_DATA[form.tier].monthly.replace(/[^0-9]/g, "")) : 1490,
          color: form.color,
          phone: form.phone || "",
          qctoNo: form.qctoNo || "",
          seta: form.seta || "",
          status: "pending",
          setupDate: new Date().toISOString().split("T")[0]
      };
      dispatch(createtenants(newTenant));
      setShowForm(false);
      notify(`Tenant "${form.name}" created! Onboarding email sent.`);
  }

  return (
    <div className="fade">
      {showForm && <NewTenantForm onSave={handleNewTenant} onCancel={() => setShowForm(false)} />}
      {showEditForm && editingTenant && (
        <EditTenantForm
          tenant={editingTenant}
          onCancel={() => setShowEditForm(false)}
          onSave={(updatedTenant) => {
            dispatch(updatetenants({ id: updatedTenant.id, updatedData: updatedTenant }))
            setShowEditForm(false);
            notify(`Tenant "${updatedTenant.name}" updated successfully!`);
          }}
        />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={css.h1}>Tenant Management</h1>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Manage all client SDPs on the platform</p>
        </div>
        <button onClick={() => setShowForm(true)} style={css.btn(sa)}>
          + Add Tenant
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon="🏢" value={tenants?.length} label="Active Tenants" color={sa} />
        <StatCard icon="👥" value="—" label="Total Learners" color="#10B981" />
        <StatCard icon="📚" value="—" label="Total Courses" color="#6366F1" />
        <StatCard icon="💰" value="—" label="Revenue MTD" color="#8B5CF6" />
      </div>

      <div style={css.card}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
              {["Tenant", "Slug", "Tier", "Status", "Actions"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 12, color: "#64748b", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tenants?.map((t) => (
              <tr key={t._id} style={{ borderBottom: "1px solid #f8fafc" }}>
                <td style={{ padding: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: sa + "20", color: sa, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>
                      {t.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{t.tagline}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px", fontSize: 13, color: "#475569" }}>{t.slug}</td>
                <td style={{ padding: "12px" }}><span style={css.tag(sa)}>{t.tier || "Standard"}</span></td>
                <td style={{ padding: "12px" }}><span style={css.tag("#10B981")}>Active</span></td>
                <td style={{ padding: "12px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { setEditingTenant(t); setShowEditForm(true); notify("Editing " + t.name); }} style={css.btn(sa, "#fff", true)}>Edit</button>
                    <button onClick={() => notify("Viewing " + t.name + " details")} style={css.btnOut(sa, true)}>Details</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
