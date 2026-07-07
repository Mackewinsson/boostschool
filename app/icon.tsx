import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
          borderRadius: 8,
          color: "#ffffff",
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: -0.5,
        }}
      >
        BB
      </div>
    ),
    { ...size },
  );
}
