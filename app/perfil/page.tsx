"use client";

import { useState } from "react";
import Link from "next/link";

const SKIN_COLORS = ["#FFD5C2", "#FFCBA4", "#D4A574", "#A67C52", "#FFE0D4", "#8B5E3C"];
const FACES = ["round", "oval", "square"];
const EYES = ["dots", "starry", "wacky", "closed", "round", "slits"];
const MOUTHS = ["smile", "open", "zigzag", "flat", "biggrin"];
const ACCESSORIES = ["none", "partyhat", "hair", "crown", "flower"];

const labels: Record<string, Record<string, string>> = {
  face: { round: "redonda", oval: "ovalada", square: "cuadrada" },
  eyes: { dots: "puntos", starry: "estrellas", wacky: "locos", closed: "cerrados", round: "redondos", slits: "rayas" },
  mouth: { smile: "sonrisa", open: "abierta", zigzag: "dientes", flat: "recta", biggrin: "grande" },
  acc: { none: "nada", partyhat: "gorro", hair: "pelo", crown: "corona", flower: "flor" },
};

function AvatarSVG({ skin, face, eyes, mouth, accessory }: { skin: string; face: string; eyes: string; mouth: string; accessory: string }) {
  return (
    <svg width="260" height="260" viewBox="0 0 240 240" className="drop-shadow-md">
      {/* Face base */}
      {face === "round" && <circle cx="120" cy="125" r="95" fill={skin} stroke="#000" strokeWidth="3" />}
      {face === "oval" && <ellipse cx="120" cy="128" rx="80" ry="100" fill={skin} stroke="#000" strokeWidth="3" />}
      {face === "square" && <rect x="30" y="35" width="180" height="180" rx="30" fill={skin} stroke="#000" strokeWidth="3" />}

      {/* Eyes */}
      {eyes === "dots" && (
        <><circle cx="95" cy="105" r="7" fill="#000" /><circle cx="145" cy="105" r="7" fill="#000" /></>
      )}
      {eyes === "starry" && (
        <>
          {[95, 145].map((cx) => (
            <g key={cx} transform={`translate(${cx},105)`}>
              <line x1="-8" y1="-8" x2="8" y2="8" stroke="#000" strokeWidth="2" />
              <line x1="-8" y1="8" x2="8" y2="-8" stroke="#000" strokeWidth="2" />
              <line x1="0" y1="-10" x2="0" y2="10" stroke="#000" strokeWidth="2" />
              <line x1="-10" y1="0" x2="10" y2="0" stroke="#000" strokeWidth="2" />
            </g>
          ))}
        </>
      )}
      {eyes === "wacky" && (
        <><circle cx="90" cy="105" r="15" fill="#fff" stroke="#000" strokeWidth="2.5" /><circle cx="90" cy="105" r="5" fill="#000" /><circle cx="150" cy="105" r="5" fill="#000" /></>
      )}
      {eyes === "closed" && (
        <><path d="M 82 105 Q 95 92 108 105" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" /><path d="M 132 105 Q 145 92 158 105" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" /></>
      )}
      {eyes === "round" && (
        <>
          <circle cx="95" cy="105" r="14" fill="#fff" stroke="#000" strokeWidth="2.5" /><circle cx="98" cy="103" r="7" fill="#000" />
          <circle cx="145" cy="105" r="14" fill="#fff" stroke="#000" strokeWidth="2.5" /><circle cx="148" cy="103" r="7" fill="#000" />
        </>
      )}
      {eyes === "slits" && (
        <><line x1="83" y1="105" x2="107" y2="105" stroke="#000" strokeWidth="4" strokeLinecap="round" /><line x1="133" y1="105" x2="157" y2="105" stroke="#000" strokeWidth="4" strokeLinecap="round" /></>
      )}

      {/* Cheeks */}
      <circle cx="65" cy="135" r="12" fill="#FFB5B5" opacity="0.5" />
      <circle cx="175" cy="135" r="12" fill="#FFB5B5" opacity="0.5" />

      {/* Mouth */}
      {mouth === "smile" && <path d="M 95 155 Q 120 175 145 155" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" />}
      {mouth === "open" && <ellipse cx="120" cy="160" rx="18" ry="22" fill="#C0392B" stroke="#000" strokeWidth="2.5" />}
      {mouth === "zigzag" && <path d="M 90 150 L 100 142 L 110 150 L 120 142 L 130 150 L 140 142 L 150 150" fill="none" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />}
      {mouth === "flat" && <line x1="95" y1="155" x2="145" y2="155" stroke="#000" strokeWidth="3" strokeLinecap="round" />}
      {mouth === "biggrin" && (
        <>
          <path d="M 88 155 Q 120 185 152 155" fill="#C0392B" stroke="#000" strokeWidth="2.5" />
          {[100, 110, 120, 130, 140].map((x) => (
            <line key={x} x1={x} y1={x <= 110 ? 160 : x >= 130 ? 161 : 162} x2={x} y2={x <= 110 ? 172 : x >= 130 ? 176 : 177} stroke="#fff" strokeWidth="1.5" />
          ))}
        </>
      )}

      {/* Accessories */}
      {accessory === "partyhat" && (
        <>
          <path d="M 75 40 L 120 10 L 165 40" fill="#FF6B6B" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="120" cy="10" r="7" fill="#FFD93D" stroke="#000" strokeWidth="2" />
          {[[80, 38, 90, 42], [100, 35, 105, 40], [135, 35, 140, 40], [150, 38, 155, 42]].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000" strokeWidth="1.5" />
          ))}
        </>
      )}
      {accessory === "hair" && <path d="M 30 100 Q 40 50 80 35 Q 120 25 160 35 Q 200 50 210 100" fill="none" stroke="#4A3728" strokeWidth="8" strokeLinecap="round" />}
      {accessory === "crown" && (
        <>
          <path d="M 75 45 L 95 30 L 110 45 L 130 30 L 145 45 L 165 30 L 175 45" fill="#FFD93D" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="75" y="45" width="100" height="15" rx="3" fill="#FFD93D" stroke="#000" strokeWidth="2.5" />
          {([[95, 30, "#FF6B6B"], [130, 30, "#6BCB77"], [165, 30, "#4D96FF"]] as [number, number, string][]).map(([cx, cy, color], i) => (
            <circle key={i} cx={cx} cy={cy} r="4" fill={color} />
          ))}
        </>
      )}
      {accessory === "flower" && (
        <>
          <g transform="translate(190, 80)">
            {[[0, -11], [10, -3], [6, 9], [-6, 9], [-10, -3]].map(([px, py], i) => (
              <ellipse key={i} cx={px} cy={py} rx="7" ry="11" fill="#FF69B4" stroke="#000" strokeWidth="1.5" />
            ))}
            <circle cx="0" cy="0" r="6" fill="#FFD93D" stroke="#000" strokeWidth="1.5" />
          </g>
          <path d="M 190 92 Q 185 120 175 135" fill="none" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function Selector({ label, value, options, labels, onPrev, onNext }: {
  label: string;
  value: string;
  options: string[];
  labels: Record<string, string>;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-hand text-sm text-gray-500 w-14 shrink-0">{label}</span>
      <button onClick={onPrev} className="hand-border w-7 h-7 flex items-center justify-center text-sm bg-white hover:bg-gray-100 transition-colors" style={{ borderRadius: "8px 10px 6px 12px" }}>&larr;</button>
      <span className="font-hand text-base text-gray-800 min-w-[80px] text-center">{labels[value] || value}</span>
      <button onClick={onNext} className="hand-border w-7 h-7 flex items-center justify-center text-sm bg-white hover:bg-gray-100 transition-colors" style={{ borderRadius: "10px 8px 12px 6px" }}>&rarr;</button>
    </div>
  );
}

const placeholderDrawings = [
  { color: "#FFF9C4", h: 160 },
  { color: "#FFCDD2", h: 220 },
  { color: "#C8E6C9", h: 140 },
  { color: "#DBEAFE", h: 200 },
  { color: "#E8E0FF", h: 180 },
  { color: "#FFE0B2", h: 240 },
  { color: "#F0F4C3", h: 150 },
  { color: "#F8BBD0", h: 190 },
];

export default function Perfil() {
  const [skinIdx, setSkinIdx] = useState(0);
  const [faceIdx, setFaceIdx] = useState(0);
  const [eyesIdx, setEyesIdx] = useState(0);
  const [mouthIdx, setMouthIdx] = useState(0);
  const [accIdx, setAccIdx] = useState(0);

  const skin = SKIN_COLORS[skinIdx];
  const face = FACES[faceIdx];
  const eyes = EYES[eyesIdx];
  const mouth = MOUTHS[mouthIdx];
  const accessory = ACCESSORIES[accIdx];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b-2 border-black px-6 md:px-16 lg:px-24 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/inicio" className="font-display text-3xl rotate-[-1deg] hover:text-blue-600 transition-colors">PLOP</Link>
          <Link href="/inicio" className="font-hand text-base text-gray-400 hover:text-black transition-colors rotate-[0.3deg]">inicio</Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 py-10">
        {/* Top: avatar + bio */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
          {/* Avatar column */}
          <div className="flex flex-col items-center shrink-0">
            <div className="hand-border-thick bg-white p-4" style={{ borderRadius: "24px 28px 20px 32px", transform: "rotate(-0.8deg)" }}>
              <AvatarSVG skin={skin} face={face} eyes={eyes} mouth={mouth} accessory={accessory} />
            </div>
            <div className="mt-6 flex flex-col gap-2" style={{ transform: "rotate(0.3deg)" }}>
              <Selector label="cara" value={face} options={FACES} labels={labels.face} onPrev={() => setFaceIdx((i) => (i - 1 + FACES.length) % FACES.length)} onNext={() => setFaceIdx((i) => (i + 1) % FACES.length)} />
              <Selector label="ojos" value={eyes} options={EYES} labels={labels.eyes} onPrev={() => setEyesIdx((i) => (i - 1 + EYES.length) % EYES.length)} onNext={() => setEyesIdx((i) => (i + 1) % EYES.length)} />
              <Selector label="boca" value={mouth} options={MOUTHS} labels={labels.mouth} onPrev={() => setMouthIdx((i) => (i - 1 + MOUTHS.length) % MOUTHS.length)} onNext={() => setMouthIdx((i) => (i + 1) % MOUTHS.length)} />
              <Selector label="accesorio" value={accessory} options={ACCESSORIES} labels={labels.acc} onPrev={() => setAccIdx((i) => (i - 1 + ACCESSORIES.length) % ACCESSORIES.length)} onNext={() => setAccIdx((i) => (i + 1) % ACCESSORIES.length)} />
              <div className="flex items-center gap-2 mt-1">
                <span className="font-hand text-sm text-gray-500 w-14 shrink-0">piel</span>
                <div className="flex gap-1.5">
                  {SKIN_COLORS.map((c, i) => (
                    <button key={i} onClick={() => setSkinIdx(i)} className={`w-6 h-6 rounded-full border-2 transition-all ${i === skinIdx ? "border-black scale-110" : "border-gray-300"}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bio column */}
          <div className="flex-1 mt-4 md:mt-12">
            <div className="hand-border bg-white p-6 md:p-8" style={{ borderRadius: "20px 24px 16px 28px", transform: "rotate(0.4deg)" }}>
              <h1 className="font-display text-4xl md:text-5xl mb-1" style={{ transform: "rotate(-0.5deg)" }}>artista an&oacute;nimo</h1>
              <p className="font-hand text-base text-gray-400 mb-4" style={{ transform: "rotate(0.2deg)" }}>miembro desde mayo 2026</p>
              <p className="font-hand text-lg text-gray-700 leading-relaxed mb-6">
                dibujante de manchas. veo cosas raras.
                <br />
                a veces un pato, a veces una nube.
              </p>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="font-display text-3xl text-black">12</p>
                  <p className="font-hand text-xs text-gray-400">dibujos</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-3xl text-blue-600">342</p>
                  <p className="font-hand text-xs text-gray-400">d&iacute;as</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-3xl text-black">1</p>
                  <p className="font-hand text-xs text-gray-400">mancha de hoy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mis dibujos */}
        <div className="mt-16 md:mt-20">
          <h2 className="font-display text-3xl md:text-4xl mb-8" style={{ transform: "rotate(-0.5deg)" }}>mis dibujos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {placeholderDrawings.map((d, i) => (
              <div
                key={i}
                className="hand-border p-4 flex flex-col items-center justify-center text-center break-inside-avoid"
                style={{
                  backgroundColor: d.color,
                  height: d.h,
                  borderRadius: ["20px 24px 16px 28px", "22px 18px 26px 14px", "18px 22px 20px 24px", "24px 20px 16px 26px"][i % 4],
                  transform: `rotate(${[-0.6, 0.5, -0.4, 0.7][i % 4]}deg)`,
                }}
              >
                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center mb-2">
                  <span className="font-hand text-xs text-black/40">{i + 1}</span>
                </div>
                <p className="font-hand text-xs text-gray-500 leading-tight">
                  dibujo #{i + 1}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
