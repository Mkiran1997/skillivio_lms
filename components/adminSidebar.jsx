import Toast from "./toast";

function AdminSidebar({ ...props }) {


  const { tab, setTab, items, tenant, currentUser, userRole, currentTenant, logout, p, s, css, notification } = props;
  return (
    <div style={css.sidebar}>
      <Toast notification={notification} />
      <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {
            currentTenant === "skillivio" ?
              <img src='/logo/skillivioLogo.jpeg' alt={tenant.logo} style={{
                width: 34, height: 34, background: p, borderRadius: 9, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#fff"
              }} />
              : <img src={tenant?.logo} alt={tenant?.name[0]} style={{
                width: 34, height: 34, background: p, borderRadius: 9, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#fff"
              }} />

          }
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>{tenant && tenant.name}</div>
            <div style={{ color: p, fontSize: 10 }}>{tenant && tenant.tier}</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
        {items.map(function (item) {
          return (
            <button key={item.id} onClick={function () { setTab(item.id); }}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px",
                borderRadius: 8, border: "none", cursor: "pointer", textAlign: "left", marginBottom: 2,
                background: tab === item.id ? (p + "22") : "transparent",
                color: tab === item.id ? p : "rgba(255,255,255,0.65)",
                fontWeight: tab === item.id ? 700 : 400, fontSize: 13
              }}>
              <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{item.icon}</span>
              {item.label}
              {item.badge !== undefined && item.badge !== null &&
                <span style={{
                  marginLeft: "auto", background: p, color: "#fff", borderRadius: 100,
                  padding: "1px 7px", fontSize: 10, fontWeight: 700
                }}>{item.badge}</span>}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: "14px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%", background: p, color: "#fff", display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0
          }}>
            {currentUser ? currentUser.name[0].toUpperCase() + currentUser.tenantId.slug[0].toUpperCase() : (userRole === "superAdmin" ? "SA" : "AD")}
          </div>
          <div>
            <div style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>
              {currentUser ? currentUser.name : (userRole === "superAdmin" ? "Super Admin" : "Admin")}
            </div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>
              {currentUser ? currentUser.email : ("admin@" + (currentTenant || "skillivio") + ".co.za")}
            </div>
          </div>
        </div>
        <button onClick={logout}
          style={{
            background: "transparent", color: "rgba(255,255,255,0.6)", border: "1.5px solid rgba(255,255,255,0.25)",
            borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", width: "100%"
          }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
export default AdminSidebar;