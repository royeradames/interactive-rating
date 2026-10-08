import { ImageResponse } from "next/og";

export const alt = "Interactive Rating: how did we do? Choose a rating from 1 to 5";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#131518" }}>
        <div style={{ display: "flex", flexDirection: "column", width: 760, padding: 64, borderRadius: 48, background: "linear-gradient(180deg, #232a34, #181e27)" }}>
          <div style={{ fontSize: 72, fontWeight: 700, color: "#ffffff" }}>Interactive Rating</div>
          <div style={{ marginTop: 20, fontSize: 34, color: "#969fad" }}>How did we do? Choose a rating from 1 to 5.</div>
          <div style={{ display: "flex", gap: 32, marginTop: 48 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} style={{ display: "flex", width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 700, background: n === 4 ? "#ffffff" : "#262e38", color: n === 4 ? "#262e38" : "#969fad" }}>{n}</div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
