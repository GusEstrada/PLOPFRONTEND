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

// Paleta estilo Paint
const PAINT_PALETTE = [
  "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#ffffff",
  "#ff0000", "#e06666", "#ea9999", "#880015", "#c00000", "#ff4d4d",
  "#ff7f27", "#ffb347", "#ffd966", "#fff200", "#fce5cd", "#ffe599",
  "#00a2e8", "#6fa8dc", "#9fc5e8", "#3f48cc", "#4a86e8", "#7986cb",
  "#22b14c", "#6aa84f", "#b6d7a8", "#1b5e20", "#93c47d", "#d9ead3",
  "#a349a4", "#c27ba0", "#f4cccc", "#9900ff", "#7c3aed", "#e8d5ff",
];

export type Tool = "pen" | "eraser";

export default function Toolbar({
  color,
  setColor,
  size,
  setSize,
  tool,
  setTool,
  onUndo,
  onClear,
  onSave,
  saving,
  saved,
}: {
  color: string;
  setColor: (c: string) => void;
  size: number;
  setSize: (s: number) => void;
  tool: Tool;
  setTool: (t: Tool) => void;
  onUndo: () => void;
  onClear: () => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  const rainbowBtnRef = useRef<HTMLButtonElement>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerPos, setPickerPos] = useState({ top: 0, left: 0 });
  const isCustom = !PRESET_COLORS.includes(color);

  function openPicker() {
    const btn = rainbowBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    setPickerPos({
      top: isMobile ? rect.bottom + 8 : rect.top,
      left: isMobile
        ? Math.max(8, Math.min(rect.left, window.innerWidth - 248))
        : rect.right + 12,
    });
    setShowPicker(s => !s);
  }

  return (
    <>
      {/* ── Toolbar ── */}
      <div
        className="
          flex md:flex-col
          items-center md:items-center
          gap-4 md:gap-6
          px-4 py-3 md:px-5 md:py-6
          bg-white/95 backdrop-blur-sm
          border-b-2 md:border-b-0 md:border-r-2 border-black
          order-first md:order-none
          overflow-x-auto md:overflow-x-visible md:overflow-y-auto
          md:h-screen
        "
      >
        {/* PLOP + Subir */}
        <div className="flex md:flex-col items-center gap-3 shrink-0">
          <Link
            href="/inicio"
            className="font-display text-xl text-gray-400 hover:text-black transition-colors rotate-[-0.5deg]"
          >
            PLOP
          </Link>
          <button
            onClick={onSave}
            disabled={saving || saved}
            className="font-hand text-sm px-4 py-2 rounded-xl text-white transition-all duration-200
                       hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 cursor-pointer whitespace-nowrap"
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

        <div className="hidden md:block w-10 h-px bg-gray-200" />
        <div className="md:hidden h-8 w-px bg-gray-200" />

        {/* ── Herramienta ── */}
        <div className="flex md:flex-col items-center gap-2 shrink-0">
          <button
            onClick={() => setTool("pen")}
            title="lápiz"
            className={`w-11 h-11 flex items-center justify-center rounded-xl border-2 transition-all cursor-pointer text-xl
              ${tool === "pen"
                ? "bg-black border-black text-white shadow-md"
                : "bg-white border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50"}`}
          >
            ✏
          </button>
          <button
            onClick={() => setTool("eraser")}
            title="goma de borrar"
            className={`w-11 h-11 flex items-center justify-center rounded-xl border-2 transition-all cursor-pointer
              ${tool === "eraser"
                ? "bg-black border-black text-white shadow-md"
                : "bg-white border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50"}`}
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="6" width="9" height="8" rx="1.5" fill="currentColor" opacity="0.4" />
              <rect x="1" y="6" width="9" height="4" rx="1.5" fill="currentColor" />
              <path d="M10 6 L15 1 L15 5 L10 10 Z" fill="currentColor" opacity="0.7" />
              <line x1="0" y1="14.5" x2="16" y2="14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="hidden md:block w-10 h-px bg-gray-200" />
        <div className="md:hidden h-8 w-px bg-gray-200" />

        {/* ── Tamaño ── */}
        <div className="flex md:flex-col items-center gap-3 shrink-0">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              title={SIZE_LABELS[s]}
              className={`rounded-full border-2 flex items-center justify-center transition-all duration-150 cursor-pointer shrink-0
                ${size === s ? "border-black shadow-sm" : "border-gray-300 hover:border-gray-500"}`}
              style={{
                width: Math.max(24, s + 14),
                height: Math.max(24, s + 14),
                backgroundColor: size === s ? "black" : "transparent",
              }}
            >
              {size !== s && (
                <div
                  className="rounded-full bg-gray-500"
                  style={{ width: Math.max(5, s * 0.6), height: Math.max(5, s * 0.6) }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="hidden md:block w-10 h-px bg-gray-200" />
        <div className="md:hidden h-8 w-px bg-gray-200" />

        {/* ── Colores ── */}
        <div className="flex md:flex-col items-center gap-3 shrink-0">
          {/* Grid 3 columnas */}
          <div className="grid grid-cols-3 gap-2.5">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                title={c}
                className={`rounded-full border-2 transition-all duration-100 cursor-pointer shrink-0
                  ${color === c
                    ? "border-black scale-125 shadow-md"
                    : "border-gray-200 hover:border-gray-500 hover:scale-110"}`}
                style={{ width: 26, height: 26, backgroundColor: c }}
              />
            ))}

            {/* Botón de paleta amplia */}
            <button
              ref={rainbowBtnRef}
              onClick={openPicker}
              title="más colores"
              className={`rounded-full border-2 transition-all duration-100 cursor-pointer w-[26px] h-[26px] shrink-0
                ${isCustom || showPicker
                  ? "border-black scale-125 shadow-md"
                  : "border-dashed border-gray-400 hover:border-gray-600 hover:scale-110"}`}
              style={{
                background: isCustom
                  ? color
                  : "conic-gradient(red,#ff0,lime,cyan,blue,magenta,red)",
              }}
            />
          </div>
        </div>

        <div className="hidden md:block w-10 h-px bg-gray-200" />
        <div className="md:hidden h-8 w-px bg-gray-200" />

        {/* ── Acciones ── */}
        <div className="flex md:flex-col items-center gap-2 shrink-0">
          <button
            onClick={onUndo}
            title="deshacer"
            className="w-11 h-11 flex items-center justify-center rounded-xl border-2 border-gray-200
                       bg-white hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer text-xl"
          >
            ↩
          </button>
          <button
            onClick={() => {
              if (window.confirm("¿Borrar todo el dibujo? Esta acción no se puede deshacer.")) {
                onClear();
              }
            }}
            title="limpiar todo"
            className="w-11 h-11 flex items-center justify-center rounded-xl border-2 border-gray-200
                       bg-white hover:bg-red-50 hover:border-red-300 transition-all cursor-pointer text-xl"
          >
            🗑
          </button>
        </div>
      </div>

      {/* ── Popup paleta estilo Paint ── */}
      {showPicker && (
        <>
          {/* Overlay para cerrar */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPicker(false)}
          />

          {/* Panel de colores */}
          <div
            className="fixed z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4"
            style={{ top: pickerPos.top, left: pickerPos.left, width: 232 }}
          >
            <p className="font-hand text-xs text-gray-400 mb-3">elige un color</p>

            {/* Paleta de colores */}
            <div className="grid grid-cols-6 gap-1.5 mb-3">
              {PAINT_PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => { setColor(c); setShowPicker(false); }}
                  title={c}
                  className={`rounded-md border transition-all cursor-pointer hover:scale-110
                    ${color === c ? "border-black scale-110 shadow-sm" : "border-gray-200 hover:border-gray-500"}`}
                  style={{ width: 28, height: 28, backgroundColor: c }}
                />
              ))}
            </div>

            {/* Separador */}
            <div className="border-t border-gray-100 pt-3">
              <p className="font-hand text-xs text-gray-400 mb-2">color exacto</p>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  className="w-8 h-8 rounded-lg border-2 border-gray-200 group-hover:border-gray-400 transition-colors shrink-0"
                  style={{ backgroundColor: color }}
                />
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-8 cursor-pointer rounded-lg border border-gray-200"
                />
              </label>
            </div>
          </div>
        </>
      )}
    </>
  );
}
