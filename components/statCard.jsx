function StatCard({...props}) {
    var icon = props.icon, value = props.value, label = props.label, color = props.color || "#2FBF71";
    return (
        <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: color }}>{value}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{label}</div>
        </div>
    );
}
export default StatCard;