import Link from "next/link";
import NavBar from "../inicio/NavBar";

const radii = [
  "20px 24px 16px 28px",
  "22px 18px 26px 14px",
  "18px 22px 20px 24px",
  "24px 20px 16px 26px",
  "16px 26px 22px 18px",
];

const cards = [
  { color: "#FFF9C4", h: 180, rot: "-0.8deg" },
  { color: "#FFCDD2", h: 260, rot: "0.6deg" },
  { color: "#C8E6C9", h: 140, rot: "-0.5deg" },
  { color: "#DBEAFE", h: 300, rot: "0.4deg" },
  { color: "#E8E0FF", h: 200, rot: "-0.7deg" },
  { color: "#FFE0B2", h: 220, rot: "0.3deg" },
  { color: "#F0F4C3", h: 170, rot: "-0.6deg" },
  { color: "#F8BBD0", h: 250, rot: "0.5deg" },
  { color: "#B2EBF2", h: 150, rot: "-0.4deg" },
  { color: "#FFF9C4", h: 280, rot: "0.7deg" },
  { color: "#E8E0FF", h: 190, rot: "-0.5deg" },
  { color: "#FFCDD2", h: 230, rot: "0.4deg" },
  { color: "#C8E6C9", h: 210, rot: "-0.6deg" },
  { color: "#DBEAFE", h: 170, rot: "0.3deg" },
  { color: "#FFE0B2", h: 260, rot: "-0.7deg" },
  { color: "#F0F4C3", h: 190, rot: "0.5deg" },
  { color: "#F8BBD0", h: 240, rot: "-0.4deg" },
  { color: "#B2EBF2", h: 210, rot: "0.6deg" },
];

export default function Galeria() {
  return (
    <div className="min-h-screen bg-[#FFFDF7] pb-16">

      {/* Fondo decorativo */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse,#fde68a 0%,transparent 65%)", filter: "blur(90px)" }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse,#ddd6fe 0%,transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse,#fca5a5 0%,transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      <NavBar />

      {/* Título */}
      <div className="relative z-10 px-6 md:px-16 lg:px-24 pt-12 pb-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl text-gray-900 rotate-[-0.5deg]">
            mancha de hoy
          </h1>
          <p className="font-hand text-lg text-gray-400 mt-2">
            lo que otros vieron hoy en la misma mancha
          </p>
        </div>
      </div>

      {/* Masonry */}
      <div className="relative z-10 px-6 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto columns-2 md:columns-3 lg:columns-4 gap-4">
          {cards.map((card, i) => (
            <div
              key={i}
              className="mb-4 p-4 flex flex-col items-center justify-center text-center break-inside-avoid transition-all duration-200 hover:scale-[1.02] hover:rotate-0 cursor-pointer"
              style={{
                backgroundColor: card.color,
                height: card.h,
                borderRadius: radii[i % radii.length],
                transform: `rotate(${card.rot})`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
              }}
            >
              <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center mb-2">
                <span className="font-hand text-xs text-black/40">{i + 1}</span>
              </div>
              <p className="font-hand text-xs text-gray-600 leading-tight">
                alguien vio algo<br />único aquí
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}