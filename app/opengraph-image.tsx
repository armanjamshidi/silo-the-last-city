import { ImageResponse } from "next/og";

export const alt = "SILO — The Last City: an interactive archive of Silo 18's 144 levels";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#080a08", color: "#e7dfcf", position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", width: 744, flexDirection: "column", padding: "68px 0 66px 72px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, color: "#c9a66b", fontSize: 18, letterSpacing: 5 }}>
          <span style={{ display: "flex", width: 54, height: 54, border: "2px solid #c9a66b", borderRadius: 54, justifyContent: "center", alignItems: "center", fontSize: 20, letterSpacing: 0 }}>18</span>
          STRUCTURAL ARCHIVE · 18 / INTERNAL
        </div>
        <div style={{ display: "flex", marginTop: 68, fontSize: 104, fontWeight: 700, letterSpacing: 18, lineHeight: 1 }}>SILO</div>
        <div style={{ display: "flex", marginTop: 7, fontSize: 46, letterSpacing: 4 }}>THE LAST CITY</div>
        <div style={{ display: "flex", width: 510, height: 2, marginTop: 42, background: "#9b7d53" }} />
        <div style={{ display: "flex", marginTop: 34, maxWidth: 565, fontSize: 25, lineHeight: 1.4, color: "#bcb5a9" }}>Descend through 144 levels. Trace the systems beneath Mechanical. Explore the fifty-silo field.</div>
        <div style={{ display: "flex", marginTop: "auto", fontSize: 16, letterSpacing: 3, color: "#c9a66b" }}>SERIES THROUGH SEASON 3 · BOOKS · RECONSTRUCTIONS</div>
      </div>
      <div style={{ display: "flex", position: "absolute", top: 0, right: 0, width: 460, height: 630, background: "#151814", borderLeft: "1px solid #454138", justifyContent: "center" }}>
        <div style={{ display: "flex", position: "absolute", top: 48, left: 30, color: "#9e9b8d", fontSize: 16, letterSpacing: 3 }}>CUTAWAY / 144</div>
        <div style={{ display: "flex", position: "absolute", top: 76, left: 98, width: 280, height: 462, border: "5px solid #817969", borderRadius: "48px 48px 10px 10px", background: "#242822", flexDirection: "column", justifyContent: "space-between", padding: "20px 12px 22px" }}>
          {Array.from({ length: 48 }, (_, index) => (
            <div key={index} style={{ display: "flex", width: "100%", height: 2, background: index > 40 ? "#a2553b" : index > 22 && index < 29 ? "#8d9360" : "#806d4b" }} />
          ))}
        </div>
        <div style={{ display: "flex", position: "absolute", top: 102, left: 237, width: 10, height: 405, background: "#c9a66b", borderLeft: "3px solid #11130f", borderRight: "3px solid #11130f" }} />
        <div style={{ display: "flex", position: "absolute", bottom: 43, left: 170, width: 200, height: 34, border: "2px solid #a2553b", borderRadius: 100, background: "#28221e", justifyContent: "center", alignItems: "center", color: "#e4b08b", fontSize: 13, letterSpacing: 3 }}>MECHANICAL</div>
        <div style={{ display: "flex", position: "absolute", top: 180, right: 18, width: 58, height: 1, background: "#a89c81" }} />
        <div style={{ display: "flex", position: "absolute", top: 314, right: 18, width: 58, height: 1, background: "#a89c81" }} />
        <div style={{ display: "flex", position: "absolute", top: 470, right: 18, width: 58, height: 1, background: "#a89c81" }} />
      </div>
    </div>,
    size,
  );
}
