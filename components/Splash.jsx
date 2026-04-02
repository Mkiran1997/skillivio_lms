"use client";
import { useEffect } from "react";

export default function Splash() {
    useEffect(() => {
        // Fade out splash after page load
        requestAnimationFrame(() => {
            setTimeout(() => {
                const splash = document.getElementById("splash");
                if (splash) {
                    splash.classList.add("out");
                    setTimeout(() => splash.remove(), 600); // matches CSS transition
                }
            }, 500);
        });

        // Global error handler
        const handleError = (e) => {
            const box = document.getElementById("err");
            if (box) {
                box.style.display = "block";
                box.innerHTML =
                    "<strong>Error:</strong> " +
                    (e.message || "Unknown error") +
                    "<br><br>Open browser DevTools (F12) → Console for details.";
            }
            console.error("App error:", e.error || e);
        };

        window.addEventListener("error", handleError);

        // Clean up listener on unmount
        return () => {
            window.removeEventListener("error", handleError);
        };
    }, []);
    return (
        <div id="splash">
            <div className="slogo">S</div>
            <div style={{ color: "#fff", fontSize: '24px', fontWeight: 900 }}>Skillivio LMS</div>
            <div style={{ color: "rgba(255,255,255,.45)", fontSize: '13px' }}>White Label Platform for South African SDPs</div>
            <div className="sbar">
                <div className="sfill"></div>
            </div>
            <div className="err" id="err"></div>
        </div >
    )
}
