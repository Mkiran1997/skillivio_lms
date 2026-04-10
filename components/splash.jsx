"use client";
import { useEffect, useState } from "react";

export default function Splash() {
    const [isOut, setIsOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOut(true); // Tell React to add the "out" class
        }, 500);

        const handleError = (e) => {
            const box = document.getElementById("err");
            if (box) {
                box.style.display = "block";
                box.innerHTML = `<strong>Error:</strong> ${e.message || "Unknown error"}`;
            }
        };

        window.addEventListener("error", handleError);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("error", handleError);
        };
    }, []);

    return (
        <div 
            id="splash" 
            className={isOut ? "out" : ""}
            style={{
                // Ensure the splash doesn't block clicks after it fades out
                pointerEvents: isOut ? 'none' : 'auto',
                transition: 'opacity 0.6s ease, visibility 0.6s',
                visibility: isOut ? 'hidden' : 'visible',
                opacity: isOut ? 0 : 1,
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <div className="slogo">S</div>
            <div style={{ color: "#fff", fontSize: '24px', fontWeight: 900 }}>Skillivio LMS</div>
            <div style={{ color: "rgba(255,255,255,.45)", fontSize: '13px' }}>White Label Platform for South African SDPs</div>
            <div className="sbar">
                <div className="sfill"></div>
            </div>
            <div className="err" id="err"></div>
        </div>
    );
}