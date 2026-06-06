import { ImageResponse } from "next/og";

export const alt = "Andaman Studio — Cinematic Photography & Film at Havelock Island";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded bright editorial social-share card with viewfinder framing.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(140deg, #fcfbf8 0%, #f4f1ea 55%, #ebe5d8 100%)",
          color: "#16201e",
          padding: 64,
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* viewfinder corners */}
        <div style={{ position: "absolute", top: 40, left: 40, width: 40, height: 40, borderTop: "2px solid rgba(22,32,30,0.4)", borderLeft: "2px solid rgba(22,32,30,0.4)" }} />
        <div style={{ position: "absolute", top: 40, right: 40, width: 40, height: 40, borderTop: "2px solid rgba(22,32,30,0.4)", borderRight: "2px solid rgba(22,32,30,0.4)" }} />
        <div style={{ position: "absolute", bottom: 40, left: 40, width: 40, height: 40, borderBottom: "2px solid rgba(22,32,30,0.4)", borderLeft: "2px solid rgba(22,32,30,0.4)" }} />
        <div style={{ position: "absolute", bottom: 40, right: 40, width: 40, height: 40, borderBottom: "2px solid rgba(22,32,30,0.4)", borderRight: "2px solid rgba(22,32,30,0.4)" }} />

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, color: "#0e8c7f" }}>
          <span style={{ display: "flex", alignItems: "center" }}>● REC</span>
          <span>11.98°N 93.00°E</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, letterSpacing: 8, color: "#c8881b", marginBottom: 18 }}>
            THE BEST AT HAVELOCK · ANDAMAN ISLANDS
          </div>
          <div style={{ fontSize: 96, lineHeight: 1.02, fontStyle: "italic" }}>Andaman Studio</div>
          <div style={{ fontSize: 34, color: "#43504c", marginTop: 18 }}>
            Cinematic photography &amp; film across the islands.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 3, color: "#43504c" }}>
          <span>andaman.studio</span>
          <span>ƒ/1.8 · 4K · 24FPS</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
