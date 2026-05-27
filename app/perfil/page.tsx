"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const SKIN_COLORS = ["#FFD5C2", "#FFCBA4", "#D4A574", "#A67C52", "#FFE0D4", "#8B5E3C"];
const FACES       = ["round", "oval", "square"];
const EYES        = ["dots", "starry", "wacky", "closed", "round", "slits"];
const MOUTHS      = ["smile", "open", "zigzag", "flat", "biggrin"];
const ACCESSORIES = ["none", "partyhat", "hair", "crown", "flower"];

const labels: Record<string, Record<string, string>> = {
  face:  { round: "redonda",  oval: "ovalada",    square: "cuadrada" },
  eyes:  { dots: "puntos",    starry: "estrellas", wacky: "locos", closed: "cerrados", round: "redondos", slits: "rayas" },
  mouth: { smile: "sonrisa",  open: "abierta",    zigzag: "dientes", flat: "recta", biggrin: "grande" },
  acc:   { none: "nada",      partyhat: "gorro",  hair: "pelo", crown: "corona", flower: "flor" },
};

function AvatarSVG({ skin, face, eyes, mouth, accessory, size = 220 }: {
  skin: string; face: string; eyes: string; mouth: string; accessory: string; size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240">
      {face === "round"  && <circle cx="120" cy="125" r="95" fill={skin} stroke="#1e1b4b" strokeWidth="3"/>}
      {face === "oval"   && <ellipse cx="120" cy="128" rx="80" ry="100" fill={skin} stroke="#1e1b4b" strokeWidth="3"/>}
      {face === "square" && <rect x="30" y="35" width="180" height="180" rx="30" fill={skin} stroke="#1e1b4b" strokeWidth="3"/>}
      {eyes === "dots"   && (<><circle cx="95" cy="105" r="7" fill="#1e1b4b"/><circle cx="145" cy="105" r="7" fill="#1e1b4b"/></>)}
      {eyes === "starry" && (<>{[95,145].map(cx=><g key={cx} transform={`translate(${cx},105)`}><line x1="-8" y1="-8" x2="8" y2="8" stroke="#1e1b4b" strokeWidth="2"/><line x1="-8" y1="8" x2="8" y2="-8" stroke="#1e1b4b" strokeWidth="2"/><line x1="0" y1="-10" x2="0" y2="10" stroke="#1e1b4b" strokeWidth="2"/><line x1="-10" y1="0" x2="10" y2="0" stroke="#1e1b4b" strokeWidth="2"/></g>)}</>)}
      {eyes === "wacky"  && (<><circle cx="90" cy="105" r="15" fill="#fff" stroke="#1e1b4b" strokeWidth="2.5"/><circle cx="90" cy="105" r="5" fill="#1e1b4b"/><circle cx="150" cy="105" r="5" fill="#1e1b4b"/></>)}
      {eyes === "closed" && (<><path d="M 82 105 Q 95 92 108 105" fill="none" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round"/><path d="M 132 105 Q 145 92 158 105" fill="none" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round"/></>)}
      {eyes === "round"  && (<><circle cx="95" cy="105" r="14" fill="#fff" stroke="#1e1b4b" strokeWidth="2.5"/><circle cx="98" cy="103" r="7" fill="#1e1b4b"/><circle cx="145" cy="105" r="14" fill="#fff" stroke="#1e1b4b" strokeWidth="2.5"/><circle cx="148" cy="103" r="7" fill="#1e1b4b"/></>)}
      {eyes === "slits"  && (<><line x1="83" y1="105" x2="107" y2="105" stroke="#1e1b4b" strokeWidth="4" strokeLinecap="round"/><line x1="133" y1="105" x2="157" y2="105" stroke="#1e1b4b" strokeWidth="4" strokeLinecap="round"/></>)}
      <circle cx="65"  cy="135" r="12" fill="#FFB5B5" opacity="0.5"/>
      <circle cx="175" cy="135" r="12" fill="#FFB5B5" opacity="0.5"/>
      {mouth === "smile"   && <path d="M 95 155 Q 120 175 145 155" fill="none" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round"/>}
      {mouth === "open"    && <ellipse cx="120" cy="160" rx="18" ry="22" fill="#C0392B" stroke="#1e1b4b" strokeWidth="2.5"/>}
      {mouth === "zigzag"  && <path d="M 90 150 L 100 142 L 110 150 L 120 142 L 130 150 L 140 142 L 150 150" fill="none" stroke="#1e1b4b" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>}
      {mouth === "flat"    && <line x1="95" y1="155" x2="145" y2="155" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round"/>}
      {mouth === "biggrin" && (<><path d="M 88 155 Q 120 185 152 155" fill="#C0392B" stroke="#1e1b4b" strokeWidth="2.5"/>{[100,110,120,130,140].map(x=><line key={x} x1={x} y1={x<=110?160:x>=130?161:162} x2={x} y2={x<=110?172:x>=130?176:177} stroke="#fff" strokeWidth="1.5"/>)}</>)}
      {accessory === "partyhat" && (<><path d="M 75 40 L 120 10 L 165 40" fill="#FF6B6B" stroke="#1e1b4b" strokeWidth="2.5" strokeLinejoin="round"/><circle cx="120" cy="10" r="7" fill="#FFD93D" stroke="#1e1b4b" strokeWidth="2"/>{[[80,38,90,42],[100,35,105,40],[135,35,140,40],[150,38,155,42]].map(([x1,y1,x2,y2],i)=><line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1e1b4b" strokeWidth="1.5"/>)}</>)}
      {accessory === "hair"     && <path d="M 30 100 Q 40 50 80 35 Q 120 25 160 35 Q 200 50 210 100" fill="none" stroke="#4A3728" strokeWidth="8" strokeLinecap="round"/>}
      {accessory === "crown"    && (<><path d="M 75 45 L 95 30 L 110 45 L 130 30 L 145 45 L 165 30 L 175 45" fill="#FFD93D" stroke="#1e1b4b" strokeWidth="2.5" strokeLinejoin="round"/><rect x="75" y="45" width="100" height="15" rx="3" fill="#FFD93D" stroke="#1e1b4b" strokeWidth="2.5"/>{([[95,30,"#FF6B6B"],[130,30,"#6BCB77"],[165,30,"#4D96FF"]] as [number,number,string][]).map(([cx,cy,color],i)=><circle key={i} cx={cx} cy={cy} r="4" fill={color}/>)}</>)}
      {accessory === "flower"   && (<><g transform="translate(190,80)">{[[0,-11],[10,-3],[6,9],[-6,9],[-10,-3]].map(([px,py],i)=><ellipse key={i} cx={px} cy={py} rx="7" ry="11" fill="#FF69B4" stroke="#1e1b4b" strokeWidth="1.5"/>)}<circle cx="0" cy="0" r="6" fill="#FFD93D" stroke="#1e1b4b" strokeWidth="1.5"/></g><path d="M 190 92 Q 185 120 175 135" fill="none" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/></>)}
    </svg>
  );
}

function Selector({ label, value, labels, onPrev, onNext }: {
  label: string; value: string; labels: Record<string, string>; onPrev: () => void; onNext: () => void;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <span className="font-hand text-sm text-gray-400 w-20 shrink-0">{label}</span>
      <div className="flex items-center gap-2 flex-1 justify-between">
        <button onClick={onPrev} className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 transition-colors text-lg bg-gray-50 border border-gray-200">‹</button>
        <span className="font-hand text-base text-gray-800 font-medium flex-1 text-center">{labels[value] || value}</span>
        <button onClick={onNext} className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 transition-colors text-lg bg-gray-50 border border-gray-200">›</button>
      </div>
    </div>
  );
}

const inkTones = [
  { bg: "rgba(99,102,241,0.10)",  border: "rgba(99,102,241,0.30)",  accent: "#4f46e5", glow: "rgba(99,102,241,0.35)"  },
  { bg: "rgba(139,92,246,0.09)",  border: "rgba(139,92,246,0.28)",  accent: "#7c3aed", glow: "rgba(139,92,246,0.35)" },
  { bg: "rgba(59,130,246,0.09)",  border: "rgba(59,130,246,0.28)",  accent: "#2563eb", glow: "rgba(59,130,246,0.35)" },
  { bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.26)",  accent: "#059669", glow: "rgba(16,185,129,0.35)" },
  { bg: "rgba(236,72,153,0.08)",  border: "rgba(236,72,153,0.26)",  accent: "#db2777", glow: "rgba(236,72,153,0.35)" },
  { bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.26)",  accent: "#d97706", glow: "rgba(245,158,11,0.35)" },
  { bg: "rgba(99,102,241,0.09)",  border: "rgba(99,102,241,0.28)",  accent: "#4338ca", glow: "rgba(99,102,241,0.35)" },
  { bg: "rgba(124,58,237,0.09)",  border: "rgba(124,58,237,0.28)",  accent: "#6d28d9", glow: "rgba(124,58,237,0.35)" },
];

const blobPaths = [
  "M50,20 C70,5 90,15 95,35 C100,55 85,75 65,78 C45,81 25,65 20,45 C15,25 30,35 50,20Z",
  "M55,15 C75,8 92,25 88,48 C84,70 60,80 40,72 C20,64 12,42 22,25 C32,8 35,22 55,15Z",
  "M48,18 C68,10 88,28 85,50 C82,72 58,82 38,70 C18,58 15,35 28,22 C38,12 28,26 48,18Z",
  "M52,22 C72,12 90,32 87,54 C84,76 60,84 40,74 C20,64 18,40 30,26 C42,14 32,32 52,22Z",
];

const heights   = [160, 200, 170, 220, 155, 190, 210, 175];
const rotations = [-0.6, 0.5, -0.4, 0.7, -0.5, 0.4, -0.7, 0.6];
const radiiList = ["20px 24px 16px 28px","22px 18px 26px 14px","18px 22px 20px 24px","24px 20px 16px 26px"];

const BIO_DEFAULT = "dibujante de manchas. veo cosas raras.\na veces un pato, a veces una nube.";

const AVATAR_DEFAULT = { skinIdx: 0, faceIdx: 0, eyesIdx: 0, mouthIdx: 0, accIdx: 0 };

export default function Perfil() {
  // Avatar — borrador (lo que el usuario está probando ahora)
  const [skinIdx,  setSkinIdx]  = useState(0);
  const [faceIdx,  setFaceIdx]  = useState(0);
  const [eyesIdx,  setEyesIdx]  = useState(0);
  const [mouthIdx, setMouthIdx] = useState(0);
  const [accIdx,   setAccIdx]   = useState(0);

  // Avatar — guardado (la última versión confirmada)
  const [saved, setSaved] = useState(AVATAR_DEFAULT);

  const [nombre,     setNombre]     = useState("artista anónimo");
  const [bio,        setBio]        = useState(BIO_DEFAULT);
  const [editingBio, setEditingBio] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ¿Hay cambios sin guardar en el avatar?
  const hasChanges =
    skinIdx  !== saved.skinIdx  ||
    faceIdx  !== saved.faceIdx  ||
    eyesIdx  !== saved.eyesIdx  ||
    mouthIdx !== saved.mouthIdx ||
    accIdx   !== saved.accIdx;

  useEffect(() => {
    const n = localStorage.getItem("plop_nombre");
    const b = localStorage.getItem("plop_bio");
    const a = localStorage.getItem("plop_avatar");
    if (n) setNombre(n);
    if (b) setBio(b);
    if (a) {
      const av = JSON.parse(a);
      setSkinIdx(av.skinIdx);  setFaceIdx(av.faceIdx);
      setEyesIdx(av.eyesIdx);  setMouthIdx(av.mouthIdx);
      setAccIdx(av.accIdx);
      setSaved(av);
    }
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (editingBio) textareaRef.current?.focus();
  }, [editingBio]);

  function saveAvatar() {
    const av = { skinIdx, faceIdx, eyesIdx, mouthIdx, accIdx };
    setSaved(av);
    localStorage.setItem("plop_avatar", JSON.stringify(av));
  }

  function cancelAvatar() {
    setSkinIdx(saved.skinIdx);  setFaceIdx(saved.faceIdx);
    setEyesIdx(saved.eyesIdx);  setMouthIdx(saved.mouthIdx);
    setAccIdx(saved.accIdx);
  }

  function saveBio() {
    const trimmed = bio.trim() || BIO_DEFAULT;
    setBio(trimmed);
    localStorage.setItem("plop_bio", trimmed);
    setEditingBio(false);
  }

  const skin      = SKIN_COLORS[skinIdx];
  const face      = FACES[faceIdx];
  const eyes      = EYES[eyesIdx];
  const mouth     = MOUTHS[mouthIdx];
  const accessory = ACCESSORIES[accIdx];

  return (
    <div className="min-h-screen bg-[#FFFDF7]">

      {/* Decoración de fondo */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse,#fde68a 0%,transparent 70%)", filter: "blur(80px)" }}/>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: "radial-gradient(ellipse,#ddd6fe 0%,transparent 70%)", filter: "blur(80px)" }}/>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-gray-100 px-6 md:px-16 lg:px-24 py-4 transition-shadow duration-200"
        style={{ background: "rgba(255,253,247,0.92)", boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.08)" : "none" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/inicio" className="font-display text-3xl rotate-[-1deg] text-gray-900 hover:text-indigo-600 transition-colors">
            PLOP
          </Link>
          <Link href="/inicio" className="font-hand text-base text-gray-400 hover:text-gray-700 transition-colors">
            ← inicio
          </Link>
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-16 lg:px-24 py-10 space-y-6">

        {/* ── FILA 1a: Bio card ── */}
        <div className="w-full rounded-3xl p-7 md:p-9 bg-white"
          style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">

            {/* Izquierda: badge + nombre + fecha */}
            <div className="shrink-0">
              <span className="inline-block font-hand text-xs text-indigo-500 px-3 py-1 rounded-full mb-4"
                style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)" }}>
                ✦ artista plop
              </span>
              <h1 className="font-display text-4xl md:text-6xl text-gray-900 leading-tight mb-1">{nombre}</h1>
              <p className="font-hand text-sm text-gray-400">miembro desde mayo 2026</p>
            </div>

            {/* Separador vertical */}
            <div className="hidden md:block w-px self-stretch bg-gray-100" />

            {/* Derecha: bio editable */}
            <div className="flex-1">
              {editingBio ? (
                <div className="space-y-2">
                  <textarea
                    ref={textareaRef}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && e.metaKey) saveBio(); }}
                    rows={2}
                    className="w-full font-hand text-base text-gray-700 leading-relaxed resize-none outline-none rounded-xl p-3"
                    style={{ background: "#FFFDF7", border: "1.5px solid rgba(99,102,241,0.35)" }}
                  />
                  <div className="flex items-center gap-2">
                    <button onClick={saveBio}
                      className="font-hand text-sm text-white px-4 py-1.5 rounded-xl hover:opacity-90 transition-opacity"
                      style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
                      guardar
                    </button>
                    <button onClick={() => setEditingBio(false)}
                      className="font-hand text-sm text-gray-400 hover:text-gray-600 transition-colors">
                      cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setEditingBio(true)}
                  className="group text-left rounded-xl px-3 py-2 -ml-3 transition-all hover:bg-gray-50 w-full">
                  <p className="font-hand text-lg text-gray-600 leading-relaxed whitespace-pre-line">{bio}</p>
                  <span className="text-sm opacity-0 group-hover:opacity-40 transition-opacity mt-1 block">✏️</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── FILA 1b: Stats en 3 cards ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: "12",  label: "dibujos",       style: { color: "#059669" } },
            { value: "342", label: "días activo",   style: { background: "linear-gradient(135deg,#4f46e5,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } },
            { value: "1",   label: "mancha de hoy", style: { color: "#f59e0b" } },
          ].map(({ value, label, style }) => (
            <div key={label} className="text-center rounded-3xl py-6 bg-white"
              style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              <p className="font-display text-5xl" style={style}>{value}</p>
              <p className="font-hand text-sm text-gray-400 mt-2">{label}</p>
            </div>
          ))}
        </div>

        {/* ── FILA 2: Avatar | Menú ── */}
        <div className="flex flex-col sm:flex-row gap-6">

          {/* Avatar preview */}
          <div className="flex items-center justify-center rounded-3xl p-6 bg-white shrink-0"
            style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <div className="relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-6 opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(ellipse,#6366f1 0%,transparent 70%)", filter: "blur(8px)" }}/>
              <AvatarSVG skin={skin} face={face} eyes={eyes} mouth={mouth} accessory={accessory}/>
            </div>
          </div>

          {/* Panel personalización */}
          <div className="flex-1 rounded-3xl p-6 bg-white flex flex-col"
            style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
            <p className="font-hand text-xs text-gray-400 uppercase tracking-widest mb-4">personaliza tu avatar</p>

            <div className="flex-1">
              <Selector label="cara"      value={face}      labels={labels.face}  onPrev={() => setFaceIdx(i  => (i-1+FACES.length)       % FACES.length)}       onNext={() => setFaceIdx(i  => (i+1) % FACES.length)}/>
              <Selector label="ojos"      value={eyes}      labels={labels.eyes}  onPrev={() => setEyesIdx(i  => (i-1+EYES.length)        % EYES.length)}        onNext={() => setEyesIdx(i  => (i+1) % EYES.length)}/>
              <Selector label="boca"      value={mouth}     labels={labels.mouth} onPrev={() => setMouthIdx(i => (i-1+MOUTHS.length)      % MOUTHS.length)}      onNext={() => setMouthIdx(i => (i+1) % MOUTHS.length)}/>
              <Selector label="accesorio" value={accessory} labels={labels.acc}   onPrev={() => setAccIdx(i   => (i-1+ACCESSORIES.length) % ACCESSORIES.length)} onNext={() => setAccIdx(i   => (i+1) % ACCESSORIES.length)}/>
              <div className="flex items-center gap-3 pt-4">
                <span className="font-hand text-sm text-gray-400 w-20 shrink-0">piel</span>
                <div className="flex gap-2">
                  {SKIN_COLORS.map((c, i) => (
                    <button key={i} onClick={() => setSkinIdx(i)}
                      className="w-7 h-7 rounded-full transition-all duration-150"
                      style={{
                        backgroundColor: c,
                        border: i === skinIdx ? "2.5px solid #6366f1" : "2px solid rgba(0,0,0,0.08)",
                        transform: i === skinIdx ? "scale(1.3)" : "scale(1)",
                        boxShadow: i === skinIdx ? "0 0 8px rgba(99,102,241,0.4)" : "none",
                      }}/>
                  ))}
                </div>
              </div>
            </div>

            {/* Botones guardar / cancelar — solo si hay cambios */}
            <div className={`mt-5 pt-4 border-t border-gray-100 flex items-center gap-3 transition-all duration-200 ${hasChanges ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
              <button onClick={saveAvatar}
                className="font-hand text-base text-white px-6 py-2.5 rounded-2xl transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", boxShadow: "0 4px 16px rgba(79,70,229,0.35)" }}>
                guardar cambios
              </button>
              <button onClick={cancelAvatar}
                className="font-hand text-base text-gray-400 hover:text-gray-700 transition-colors px-3 py-2.5">
                cancelar
              </button>
              <span className="font-hand text-xs text-indigo-400/60 ml-auto">cambios sin guardar</span>
            </div>
          </div>
        </div>

        {/* ── FILA 3: Mis dibujos ── */}
        <div>
          <div className="flex items-baseline gap-3 mb-6">
            <h2 className="font-display text-3xl md:text-4xl text-gray-900">mis dibujos</h2>
            <span className="font-hand text-base text-gray-400">8 manchas</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {inkTones.map((tone, i) => (
              <div key={i}
                className="relative flex flex-col items-center justify-center cursor-pointer group transition-all duration-200 hover:scale-[1.05]"
                style={{
                  height: heights[i],
                  borderRadius: radiiList[i % radiiList.length],
                  transform: `rotate(${rotations[i]}deg)`,
                  background: tone.bg,
                  border: `1px solid ${tone.border}`,
                  boxShadow: `0 0 16px ${tone.glow}, 0 2px 12px rgba(0,0,0,0.07)`,
                }}>
                <div className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ boxShadow: `inset 0 0 20px ${tone.glow}` }}/>
                <svg viewBox="0 0 100 100" className="w-20 h-20 transition-all duration-200 group-hover:scale-110"
                  style={{ filter: `drop-shadow(0 0 8px ${tone.glow})` }}>
                  <path d={blobPaths[i % blobPaths.length]} fill={tone.accent} opacity="0.8" transform="translate(2,2) scale(0.96)"/>
                </svg>
                <span className="font-hand text-sm mt-2 font-bold" style={{ color: tone.accent }}>
                  mancha #{i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
