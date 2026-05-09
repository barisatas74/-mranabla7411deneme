import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};
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
          background:
            "linear-gradient(135deg, #ee2a8b 0%, #ff52a8 50%, #ff8cc3 100%)",
          color: "white",
          fontSize: 22,
          fontWeight: 700,
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
          borderRadius: 6,
        }}
      >
        B
      </div>
    ),
    { ...size }
  );
}
