import { ImageResponse } from "next/og";
import { siteName } from "@/lib/site-config";

export const alt = siteName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #030712 0%, #07101f 45%, #0b1120 100%)",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            BB
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -1 }}>
            {siteName}
          </div>
        </div>
        <div
          style={{
            fontSize: 34,
            lineHeight: 1.35,
            color: "#cbd5e1",
            maxWidth: 900,
          }}
        >
          Inglés y español con Paulina Poloca
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 24,
            color: "#22d3ee",
          }}
        >
          Clase de prueba gratis · Clases online personalizadas
        </div>
      </div>
    ),
    { ...size },
  );
}
