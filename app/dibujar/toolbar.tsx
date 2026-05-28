"use client";

import Link from "next/link";
import { useRef, useState } from "react";

const SIZES = [2, 5, 10, 18];
const SIZE_LABELS: Record<number, string> = { 2: "fino", 5: "medio", 10: "grueso", 18: "muy grueso" };

const PRESET_COLORS = [
  "#000000", "#6B7280", "#2563EB",
  "#7C3AED", "#DC2626", "#EC4899",
  "#F59E0B", "#10B981",
];

const PAINT_PALETTE = [
  "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#ffffff",
  "#ff0000", "#e06666", "#ea9999", "#880015", "#c00000", "#ff4d4d",
  "#ff7f27", "#ffb347", "#ffd966", "#fff200", "#fce5cd", "#ffe599",
  "#00a2e8", "#6fa8dc", "#9fc5e8", "#3f48cc", "#4a86e8", "#7986cb",
  "#22b14c", "#6aa84f", "#b6d7a8", "#1b5e20", "#93c47d", "#d9ead3",
  "#a349a4", "#c27ba0", "#f4cccc", "#9900ff", "#7c3aed", "#e8d5ff",
];

const POPUP_W = 252;
const POPUP_H = 390;

export type Tool = "pen" | "eraser";

/* ── Iconos ──────────────────────────────────────────────── */

function PenIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" fill="currentColor" opacity="0.9"/>
      <path d="m15 5 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

function EraserIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 28 28" fill="none">
      {/* cuerpo de la goma — parte superior */}
      <rect x="2" y="8" width="16" height="7" rx="2" fill="currentColor" opacity="0.85"/>
      {/* cuerpo — parte inferior (tono diferente) */}
      <rect x="2" y="15" width="16" height="5" rx="0 0 2 2" fill="currentColor" opacity="0.45"/>
      {/* línea divisoria interior */}
      <line x1="2" y1="15" x2="18" y2="15" stroke="white" strokeWidth="1" opacity="0.6"/>
      {/* punta diagonal */}
      <path d="M18 8 L24 2 L24 14 L18 20 Z" fill="currentColor" opacity="0.6"/>
      {/* línea que indica la superficie */}
      <line x1="1" y1="21.5" x2="27" y2="21.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.55"/>
      {/* migajitas de goma */}
      <circle cx="9"  cy="22.5" r="1.1" fill="currentColor" opacity="0.25"/>
      <circle cx="13" cy="23.5" r="0.8" fill="currentColor" opacity="0.2"/>
    </svg>
  );
}

/* ── Toolbar ─────────────────────────────────────────────── */

export default function Toolbar({
  color, setColor, size, setSize,
  tool, setTool,
  onUndo, onClear, onSave,
  saving, saved,
}: {
  color: string;   setColor: (c: string) => void;
  size: number;    setSize:  (s: number) => void;
  tool: Tool;      setTool:  (t: Tool)   => void;
  onUndo: () => void;
  onClear: () => void;
  onSave:  () => void;
  saving: boolean; saved: boolean;
}) {
  const rainbowRef = useRef<HTMLButtonElement>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerPos, setPickerPos]   = useState({ top: 0, left: 0 });
  const isCustom = !PRESET_COLORS.includes(color);

  function openPicker() {
    const btn = rainbowRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const m = 12; // margen de pantalla
    const isMobile = window.innerWidth < 768;

    let top: number, left: number;

    if (isMobile) {
      // Intenta debajo del botón; si no cabe, arriba
      top  = r.bottom + m;
      if (top + POPUP_H > window.innerHeight - m) top = Math.max(m, r.top - POPUP_H - m);
      left = Math.max(m, Math.min(r.left, window.innerWidth - POPUP_W - m));
    } else {
      // Desktop: a la derecha del sidebar
      left = r.right + m;
      if (left + POPUP_W > window.innerWidth - m) left = Math.max(m, r.left - POPUP_W - m);
      top  = Math.max(m, Math.min(r.top, window.innerHeight - POPUP_H - m));
    }

    setPickerPos({ top, left });
    setShowPicker(s => !s);
  }

  /* botón de herramienta */
  const toolBtn = (t: Tool, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setTool(t)}
      title={label}
      className={`w-14 h-14 flex items-center justify-center rounded-2xl border-2
                  transition-all duration-150 cursor-pointer
                  ${tool === t
                    ? "bg-black border-black text-white shadow-lg scale-105"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50"}`}
    >
      {icon}
    </button>
  );

  return (
    <>
      {/* ══════════════ TOOLBAR ══════════════ */}
      <div className={`
        flex md:flex-col
        items-center
        gap-5 md:gap-7
        px-5 py-4 md:px-6 md:py-8
        bg-white/95 backdrop-blur-sm
        border-b-2 md:border-b-0 md:border-r-2 border-black
        order-first md:order-none
        overflow-x-auto md:overflow-x-visible md:overflow-y-auto
        md:h-screen md:min-w-[96px]
      `}>

        {/* ── PLOP + subir ── */}
        <div className="flex md:flex-col items-center gap-3 shrink-0">
          <Link
            href="/inicio"
            className="font-display text-xl text-gray-400 hover:text-black transition-colors rotate-[-0.5deg] whitespace-nowrap"
          >
            PLOP
          </Link>
          <button
            onClick={onSave}
            disabled={saving || saved}
            className="font-hand text-sm px-4 py-2.5 rounded-xl text-white
                       transition-all duration-200 hover:-translate-y-0.5 active:scale-95
                       disabled:opacity-60 cursor-pointer whitespace-nowrap"
            style={{
              background: saved
                ? "linear-gradient(135deg,#059669,#10b981)"
                : "linear-gradient(135deg,#4f46e5,#7c3aed)",
              boxShadow: "0 4px 16px rgba(79,70,229,0.3)",
              borderRadius: "12px 14px 10px 16px",
            }}
          >
            {saving ? "..." : saved ? "✅ subido" : "subir →"}
          </button>
        </div>

        <div className="hidden md:block w-12 h-px bg-gray-150" style={{ background: "#e5e7eb" }} />
        <div className="md:hidden h-10 w-px bg-gray-200" />

        {/* ── Herramientas ── */}
        <div className="flex md:flex-col items-center gap-3 shrink-0">
          {toolBtn("pen",    <PenIcon />,    "lápiz")}
          {toolBtn("eraser", <EraserIcon />, "goma de borrar")}
        </div>

        <div className="hidden md:block w-12 h-px" style={{ background: "#e5e7eb" }} />
        <div className="md:hidden h-10 w-px bg-gray-200" />

        {/* ── Tamaño ── */}
        <div className="flex md:flex-col items-center gap-3 shrink-0">
          {SIZES.map(s => (
            <button
              key={s}
              onClick={() => setSize(s)}
              title={SIZE_LABELS[s]}
              className={`rounded-full border-2 flex items-center justify-center
                          transition-all duration-150 cursor-pointer shrink-0
                          ${size === s ? "border-black shadow-sm" : "border-gray-300 hover:border-gray-500"}`}
              style={{
                width:  Math.max(26, s + 16),
                height: Math.max(26, s + 16),
                backgroundColor: size === s ? "black" : "transparent",
              }}
            >
              {size !== s && (
                <div
                  className="rounded-full bg-gray-500"
                  style={{ width: Math.max(5, s * 0.65), height: Math.max(5, s * 0.65) }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="hidden md:block w-12 h-px" style={{ background: "#e5e7eb" }} />
        <div className="md:hidden h-10 w-px bg-gray-200" />

        {/* ── Colores ── */}
        <div className="flex md:flex-col items-center gap-3 shrink-0">
          <div className="grid grid-cols-3 gap-2.5">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                title={c}
                className={`rounded-full border-2 transition-all duration-100 cursor-pointer
                  ${color === c
                    ? "border-black scale-125 shadow-md"
                    : "border-gray-200 hover:border-gray-500 hover:scale-110"}`}
                style={{ width: 28, height: 28, backgroundColor: c }}
              />
            ))}

            {/* Botón arcoíris → abre paleta */}
            <button
              ref={rainbowRef}
              onClick={openPicker}
              title="más colores"
              className={`rounded-full border-2 transition-all duration-100 cursor-pointer
                ${isCustom || showPicker
                  ? "border-black scale-125 shadow-md"
                  : "border-dashed border-gray-400 hover:border-gray-600 hover:scale-110"}`}
              style={{
                width: 28, height: 28,
                background: isCustom
                  ? color
                  : "conic-gradient(red,#ff0,lime,cyan,blue,magenta,red)",
              }}
            />
          </div>
        </div>

        <div className="hidden md:block w-12 h-px" style={{ background: "#e5e7eb" }} />
        <div className="md:hidden h-10 w-px bg-gray-200" />

        {/* ── Acciones ── */}
        <div className="flex md:flex-col items-center gap-3 shrink-0">
          <button
            onClick={onUndo}
            title="deshacer"
            className="w-14 h-14 flex items-center justify-center rounded-2xl border-2 border-gray-200
                       bg-white hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer text-2xl"
          >
            ↩
          </button>
          <button
            onClick={() => {
              if (window.confirm("¿Borrar todo el dibujo? Esta acción no se puede deshacer.")) onClear();
            }}
            title="limpiar todo"
            className="w-14 h-14 flex items-center justify-center rounded-2xl border-2 border-gray-200
                       bg-white hover:bg-red-50 hover:border-red-300 transition-all cursor-pointer text-2xl"
          >
            🗑
          </button>
        </div>

      </div>

      {/* ══════════════ POPUP PALETA ══════════════ */}
      {showPicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowPicker(false)} />

          <div
            className="fixed z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 p-5"
            style={{
              top:       pickerPos.top,
              left:      pickerPos.left,
              width:     POPUP_W,
              maxHeight: "calc(100vh - 24px)",
              overflowY: "auto",
            }}
          >
            <p className="font-hand text-xs text-gray-400 mb-3">elige un color</p>

            {/* Paleta */}
            <div className="grid grid-cols-6 gap-2 mb-4">
              {PAINT_PALETTE.map(c => (
                <button
                  key={c}
                  onClick={() => { setColor(c); setShowPicker(false); }}
                  title={c}
                  className={`rounded-lg border-2 transition-all cursor-pointer hover:scale-110
                    ${color === c
                      ? "border-black scale-110 shadow-sm"
                      : "border-transparent hover:border-gray-400"}`}
                  style={{ width: 32, height: 32, backgroundColor: c }}
                />
              ))}
            </div>

            {/* Color exacto */}
            <div className="border-t border-gray-100 pt-3">
              <p className="font-hand text-xs text-gray-400 mb-2">color exacto</p>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  className="w-9 h-9 rounded-xl border-2 border-gray-200 group-hover:border-gray-400 transition-colors shrink-0"
                  style={{ backgroundColor: color }}
                />
                <input
                  type="color"
                  value={color}
                  onChange={e => { setColor(e.target.value); }}
                  className="w-full h-9 cursor-pointer rounded-xl border border-gray-200"
                />
              </label>
            </div>
          </div>
        </>
      )}
    </>
  );
}
