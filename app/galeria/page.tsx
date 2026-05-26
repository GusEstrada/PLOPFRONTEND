import Link from "next/link";

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
    <div className="min-h-screen bg-[#FDFBF7] pb-16">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b-2 border-black px-6 md:px-16 lg:px-24 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/inicio"
            className="font-display text-3xl rotate-[-1deg] hover:text-blue-600 transition-colors"
          >
            PLOP
          </Link>
          <div className="flex items-center gap-4">
            <p className="font-hand text-base md:text-lg text-gray-500">
              {new Date().toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <a href="/perfil" className="font-hand text-base text-gray-400 hover:text-black transition-colors rotate-[-0.2deg]">perfil</a>
          </div>
        </div>
      </header>

      {/* Title */}
      <div className="px-6 md:px-16 lg:px-24 pt-10 pb-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl rotate-[-0.5deg]">
            mancha de hoy
          </h1>
          <p className="font-hand text-lg text-gray-500 mt-2">
            lo que otros vieron hoy en la misma mancha
          </p>
        </div>
      </div>

      {/* Masonry */}
      <div className="px-6 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto columns-2 md:columns-3 lg:columns-4 gap-4">
          {cards.map((card, i) => (
            <div
              key={i}
              className="hand-border mb-4 p-4 flex flex-col items-center justify-center text-center break-inside-avoid"
              style={{
                backgroundColor: card.color,
                height: card.h,
                borderRadius: radii[i % radii.length],
                transform: `rotate(${card.rot})`,
              }}
            >
              <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center mb-2">
                <span className="font-hand text-xs text-black/40">
                  {i + 1}
                </span>
              </div>
              <p className="font-hand text-xs text-gray-500 leading-tight">
                alguien vio algo
                <br />
                &uacute;nico aqu&iacute;
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
