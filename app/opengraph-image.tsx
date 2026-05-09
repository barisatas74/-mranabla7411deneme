import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Miss Bella — Zarafetin en özel hâli";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #fff4fa 0%, #ffd1e1 50%, #ff8cc3 100%)",
          position: "relative",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Dekoratif arka plan blur'lar */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 500,
            height: 500,
            background: "rgba(238, 42, 139, 0.35)",
            borderRadius: "50%",
            filter: "blur(100px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 500,
            height: 500,
            background: "rgba(168, 16, 98, 0.3)",
            borderRadius: "50%",
            filter: "blur(100px)",
          }}
        />

        {/* Üst etiket */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#a81062",
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            marginBottom: 30,
          }}
        >
          <div
            style={{ width: 50, height: 1, background: "currentColor" }}
          />
          Premium Koleksiyon
          <div
            style={{ width: 50, height: 1, background: "currentColor" }}
          />
        </div>

        {/* Marka adı */}
        <div
          style={{
            fontSize: 160,
            color: "#0a0a0c",
            lineHeight: 1,
            display: "flex",
            alignItems: "baseline",
            gap: 20,
          }}
        >
          Miss
          <span
            style={{
              fontStyle: "italic",
              backgroundImage:
                "linear-gradient(135deg, #ee2a8b 0%, #ff52a8 50%, #ff8cc3 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Bella
          </span>
        </div>

        {/* Alt slogan */}
        <div
          style={{
            fontSize: 32,
            color: "#1f1f22",
            fontStyle: "italic",
            marginTop: 30,
            opacity: 0.9,
          }}
        >
          Zarafetin en özel hâli
        </div>

        {/* Alt etiket */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            gap: 32,
            color: "#5d3443",
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <span>Fransız Danteli</span>
          <span>·</span>
          <span>El İşçiliği</span>
          <span>·</span>
          <span>Türkiye Üretimi</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
