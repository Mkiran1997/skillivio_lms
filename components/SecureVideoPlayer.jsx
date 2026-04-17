"use client";

import React, { useState, useEffect } from "react";

/**
 * A secure video player that fetches a temporary S3 URL on the fly.
 * @param {string} fileKey - The S3 Key (e.g., "courses/123/lessons/video.mp4")
 * @param {string} poster - Optional thumbnail image URL
 * @param {object} style - Optional additional styles
 */
export default function SecureVideoPlayer({ fileKey, poster, style = {} }) {
  const [signedUrl, setSignedUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSignedUrl() {
      if (!fileKey) return;
      
      try {
        setLoading(true);
        setError(null);

        // Fetch the temporary URL from our secure backend
        const res = await fetch(`/api/get-video-url?fileKey=${encodeURIComponent(fileKey)}`);
        const data = await res.json();

        if (data.url) {
          setSignedUrl(data.url);
        } else {
          setError(data.error || "Failed to load video access.");
        }
      } catch (err) {
        console.error("Video Fetch Error:", err);
        setError("Network error occurred while fetching video.");
      } finally {
        setLoading(false);
      }
    }

    fetchSignedUrl();
  }, [fileKey]);

  if (loading) {
    return (
      <div style={{ 
        width: "100%", 
        aspectRatio: "16/9", 
        background: "#0f172a", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        borderRadius: 12,
        ...style 
      }}>
        <div style={{ color: "#94a3b8", fontSize: 14 }}>
          <div className="spinner" style={{ marginBottom: 10 }}>⏳</div>
          Securing video connection...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        width: "100%", 
        aspectRatio: "16/9", 
        background: "#450a0a", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        borderRadius: 12,
        padding: 20,
        textAlign: "center",
        ...style 
      }}>
        <div style={{ color: "#fecaca", fontSize: 14 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>❌</div>
          {error}
        </div>
      </div>
    );
  }

  return (
    <video
      src={signedUrl}
      poster={poster}
      controls
      controlsList="nodownload" // Bonus: Prevent easy right-click downloads
      style={{
        width: "100%",
        borderRadius: 12,
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
        ...style
      }}
    >
      Your browser does not support the video tag.
    </video>
  );
}
