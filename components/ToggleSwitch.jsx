import { useState } from "react";

function ToggleSwitch({...props}) {
    var label = props.label, defaultOn = props.defaultOn, hint = props.hint, color = props.color || "#2FBF71";
    var [on, setOn] = useState(defaultOn !== false);
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid #f8fafc" }}>
            <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{label}</div>
                {hint && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{hint}</div>}
            </div>
            <div onClick={function () { setOn(!on); }} style={{
                width: 44, height: 24, borderRadius: 12, background: on ? color : "#e2e8f0",
                cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0
            }}>
                <div style={{
                    width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute",
                    top: 3, left: on ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                }} />
            </div>
        </div>
    );
}

export default ToggleSwitch;