"use client";

import { useAdminData } from "@/hooks/useAdminData";
import ToggleSwitch from "@/components/toggleSwitch";

export default function AdminSettingsPage() {
  const { p, css, notify, tenant, currentTenant } = useAdminData();

  return (
    <div className="fade">
      <h1 style={{ ...css.h1, marginBottom: 24 }}>Settings</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={css.card}>
          <h3 style={{ ...css.h3, marginBottom: 16 }}>General</h3>
          {[
            ["Platform Name", tenant?.name],
            ["Support Email", "support@" + currentTenant + ".co.za"],
            ["Timezone", "Africa/Johannesburg"],
            ["Currency", "ZAR (R)"],
          ].map(([label, value]) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <label style={css.label}>{label}</label>
              <input defaultValue={value} style={css.input} />
            </div>
          ))}
          <button onClick={() => notify("Settings saved!")} style={css.btn(p)}>Save Changes</button>
        </div>
        <div style={css.card}>
          <h3 style={{ ...css.h3, marginBottom: 16 }}>QCTO Configuration</h3>
          <div style={{ marginBottom: 14 }}>
            <label style={css.label}>Accreditation Number</label>
            <input defaultValue="QCTO/ACC/2024/001234" style={css.input} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={css.label}>SETA Affiliation</label>
            <select defaultValue="Services SETA" style={css.input}>
              {["QCTO (Direct)", "AgriSETA", "BankSETA", "CATHSSETA", "CHIETA", "ETDP SETA", "FoodBev SETA", "HWSETA", "INSETA", "LGSETA", "MerSETA", "MICTS SETA", "MQA", "PSETA", "SASSETA", "Services SETA", "TETA", "W&RSETA", "OTHER"].map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <ToggleSwitch label="Enable QCTO Audit Logging" hint="Log all learner activities" color={p} />
          <ToggleSwitch label="Auto-generate SETA Reports" hint="Month-end automated reports" color={p} />
          <button onClick={() => notify("QCTO settings saved!")} style={{ ...css.btn(p), marginTop: 16 }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
