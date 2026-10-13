import { ImageResponse } from "next/og";
export const alt = "Ninho Veículos — Seu próximo caminho começa aqui";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#f2c94c",
        color: "#25251f",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 80,
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontSize: 42 }}>ninho · VEÍCULOS</div>
      <div style={{ fontSize: 86, lineHeight: 1.05, maxWidth: 950 }}>
        Seu próximo caminho começa aqui.
      </div>
      <div style={{ fontSize: 24, color: "#4b4328" }}>
        Carros escolhidos com cuidado. · Goiânia, GO · Demonstração
      </div>
    </div>,
    { ...size },
  );
}
