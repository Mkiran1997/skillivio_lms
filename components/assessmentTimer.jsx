import { useEffect, useRef, useState } from "react";

function AssessmentTimer({ ...props }) {
    var total = props.total || 2700, onExpire = props.onExpire, color = props.color || "#2FBF71";
    var [secs, setSecs] = useState(total);
    var ref = useRef(null);
    useEffect(function () {
        ref.current = setInterval(function () {
            setSecs(function (s) {
                if (s <= 1) { clearInterval(ref.current); if (onExpire) onExpire(); return 0; }
                return s - 1;
            });
        }, 1000);
        return function () { clearInterval(ref.current); };
    }, []);
    var m = Math.floor(secs / 60), s = secs % 60;
    var pct = secs / total;
    var timerColor = pct < 0.2 ? "#EF4444" : pct < 0.4 ? "#F59E0B" : color;
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 48, height: 48, position: "relative" }}>
                <svg width="48" height="48" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
                    <circle cx="24" cy="24" r="20" fill="none" stroke={timerColor} strokeWidth="4"
                        strokeDasharray={125.6} strokeDashoffset={125.6 * (1 - pct)} strokeLinecap="round"
                        transform="rotate(-90 24 24)" style={{ transition: "stroke-dashoffset 1s linear,stroke 0.3s" }} />
                </svg>
            </div>
            <div style={{ color: timerColor, fontWeight: 800, fontSize: 20, fontVariantNumeric: "tabular-nums" }}>
                {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
            </div>
        </div>
    );
}
export default AssessmentTimer;