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
  const colorPickerRef = useRef<HTMLInputElement>(null);
  const [customColor, setCustomColor] = useState("#FF6B6B");
  const isCustom = !PRESET_COLORS.includes(color);

  return (
    <div
      className="flex md:flex-col gap-3 md:gap-5 p-3 md:p-4 bg-white/95 backdrop-blur-sm
                 border-b-2 md:border-b-0 md:border-r-2 border-black
                 order-first md:order-none overflow-x-auto md:overflow-visible
                 items-start md:items-stretch"
      style={{ minWidth: 0 }}
    >

      {/* ── Fila superior: PLOP + Subir ── */}
      <div className="flex md:flex-col items-center md:items-stretch gap-2 shrink-0">
        <Link
          href="/inicio"
          className="font-display text-lg text-gray-400 hover:text-black transition-colors rotate-[-0.5deg] shrink-0 self-center"
        >
          PLOP
        </Link>
        <button
          onClick={onSave}
          disabled={saving || saved}
          className="font-hand text-sm px-4 py-2 rounded-xl text-white transition-all duration-200
                     hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 cursor-pointer shrink-0"
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

      <div className="hidden md:block h-px bg-gray-200 w-full" />
      <div className="md:hidden w-px bg-gray-200 self-stretch" />

      {/* ── Herramienta ── */}
      <div className="flex md:flex-col gap-2 shrink-0">
        <p className="hidden md:block font-hand text-xs text-gray-400 mb-0.5">herramienta</p>

        {/* Lápiz */}
        <button
          onClick={() => setTool("pen")}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all duration-150 cursor-pointer font-hand text-sm
            ${tool === "pen"
              ? "bg-black border-black text-white"
              : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"}`}
        >
          <span className="text-base leading-none">✏</span>
          <span>lápiz</span>
        </button>

        {/* Goma */}
        <button
          onClick={() => setTool("eraser")}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all duration-150 cursor-pointer font-hand text-sm
            ${tool === "eraser"
              ? "bg-black border-black text-white"
              : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"}`}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <rect x="1" y="6" width="9" height="8" rx="1.5" fill="currentColor" opacity="0.4" />
            <rect x="1" y="6" width="9" height="4" rx="1.5" fill="currentColor" />
            <path d="M10 6 L15 1 L15 5 L10 10 Z" fill="currentColor" opacity="0.7" />
            <line x1="0" y1="14.5" x2="16" y2="14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>goma</span>
        </button>
      </div>

      <div className="hidden md:block h-px bg-gray-200 w-full" />
      <div className="md:hidden w-px bg-gray-200 self-stretch" />

      {/* ── Tamaño ── */}
      <div className="flex md:flex-col gap-2 shrink-0">
        <p className="hidden md:block font-hand text-xs text-gray-400 mb-0.5">tamaño</p>
        <div className="flex md:flex-col items-center gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              title={SIZE_LABELS[s]}
              className={`rounded-full border-2 flex items-center justify-center transition-all duration-100 cursor-pointer shrink-0
                ${size === s ? "border-black" : "border-gray-300 hover:border-gray-500"}`}
              style={{
                width: Math.max(22, s + 14),
                height: Math.max(22, s + 14),
                backgroundColor: size === s ? "black" : "transparent",
              }}
            >
              {size !== s && (
                <div
                  className="rounded-full bg-gray-600"
                  style={{ width: Math.max(4, s * 0.6), height: Math.max(4, s * 0.6) }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden md:block h-px bg-gray-200 w-full" />
      <div className="md:hidden w-px bg-gray-200 self-stretch" />

      {/* ── Colores ── */}
      <div className="flex md:flex-col gap-2 shrink-0">
        <p className="hidden md:block font-hand text-xs text-gray-400 mb-0.5">color</p>
        {/* Grid 3 columnas en desktop, fila en mobile */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-1.5">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              title={c}
              className={`rounded-full border-2 transition-all duration-100 cursor-pointer shrink-0
                ${color === c ? "border-black scale-125 shadow-sm" : "border-transparent hover:border-gray-400"}`}
              style={{ width: 24, height: 24, backgroundColor: c }}
            />
          ))}

          {/* Color picker personalizado */}
          <div className="relative">
            <button
              onClick={() => colorPickerRef.current?.click()}
              title="color personalizado"
              className={`rounded-full border-2 transition-all duration-100 cursor-pointer w-6 h-6
                ${isCustom ? "border-black scale-125 shadow-sm" : "border-dashed border-gray-400 hover:border-gray-600"}`}
              style={{
                background: isCustom
                  ? color
                  : "conic-gradient(red,#ff0,lime,cyan,blue,magenta,red)",
              }}
            />
            <input
              ref={colorPickerRef}
              type="color"
              value={isCustom ? color : customColor}
              onChange={(e) => { setCustomColor(e.target.value); setColor(e.target.value); }}
              className="absolute opacity-0 pointer-events-none w-0 h-0 top-0 left-0"
            />
          </div>
        </div>
      </div>

      <div className="hidden md:block h-px bg-gray-200 w-full" />
      <div className="md:hidden w-px bg-gray-200 self-stretch" />

      {/* ── Acciones ── */}
      <div className="flex md:flex-col gap-2 shrink-0">
        <p className="hidden md:block font-hand text-xs text-gray-400 mb-0.5">acciones</p>

        {/* Deshacer */}
        <button
          onClick={onUndo}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-gray-200
                     bg-white hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer
                     font-hand text-sm text-gray-700"
        >
          <span className="text-base leading-none">↩</span>
          <span>deshacer</span>
        </button>

        {/* Limpiar */}
        <button
          onClick={() => {
            if (window.confirm("¿Borrar todo el dibujo? Esta acción no se puede deshacer.")) {
              onClear();
            }
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-gray-200
                     bg-white hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all cursor-pointer
                     font-hand text-sm text-gray-700"
        >
          <span className="text-base leading-none">🗑</span>
          <span>limpiar</span>
        </button>
      </div>

    </div>
  );
}
