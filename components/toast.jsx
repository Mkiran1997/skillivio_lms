function Toast({ ...props }) {
    var n = props.notification;
    if (!n) return null;
    return (
        <div style={{
            position: "fixed", bottom: 24, right: 24, background: n.type === "error" ? "#EF4444" : "#10B981",
            color: "#fff", padding: "12px 20px", borderRadius: 10, fontWeight: 600, fontSize: 14,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)", zIndex: 9999, display: "flex", alignItems: "center",
            gap: 10, animation: "slideUp 0.3s ease"
        }}>
            <span>{n.type === "error" ? "⚠" : "✓"}</span>{n.msg}
        </div>
    );
}
export default Toast;