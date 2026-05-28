"use client";

import Link from "next/link";
import { useRef, useState } from "react";

const SIZES = [2, 5, 10, 18];
const SIZE_LABELS: Record<number, string> = { 2: "fino", 5: "medio", 10: "grueso", 18: "muy grueso" };

const PRESET_COLORS = [
  "#000000", "#6B7280",
  "#2563EB", "#7C3AED",
  "#DC2626", "#EC4899",
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
    <div className="flex md:flex-col items-center justify-center gap-1 md:gap-4 p-2 md:p-5 bg-white/90 backdrop-blur-sm border-t-2 md:border-t-0 md:border-r-2 border-black flex-wrap order-last md:order-none">

      {/* PLOP */}
      <Link
        href="/inicio"
        className="font-display text-xl text-gray-400 hover:text-black transition-colors rotate-[-0.5deg] flex-shrink-0"
      >
        PLOP
      </Link>

      {/* Subir */}
      <button
        onClick={onSave}
        disabled={saving || saved}
        className="font-hand text-xs px-2 py-1 md:text-sm md:px-4 md:py-2 rounded-xl text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:hover:translate-y-0 flex-shrink-0 cursor-pointer"
        style={{
          background: saved
            ? "linear-gradient(135deg,#059669,#10b981)"
            : "linear-gradient(135deg,#4f46e5,#7c3aed)",
          boxShadow: "0 4px 16px rgba(79,70,229,0.35)",
          borderRadius: "14px 16px 12px 18px",
        }}
      >
        {saving ? "..." : saved ? "✅ subido" : "subir →"}
      </button>

      <div className="hidden md:block w-6 h-px bg-gray-200" />

      {/* Herramienta: lápiz / goma */}
      <div className="flex md:flex-col items-center gap-1.5 md:gap-2">
        <span className="hidden md:inline font-hand text-xs text-gray-400">herramienta</span>
        <button
          onClick={() => setTool("pen")}
          className={`hand-border w-9 h-9 flex items-center justify-center text-base transition-colors cursor-pointer ${
            tool === "pen" ? "bg-black text-white" : "bg-white hover:bg-gray-100 text-black"
          }`}
          style={{ borderRadius: "10px 12px 8px 14px" }}
          title="lápiz"
        >
          ✏
        </button>
        <button
          onClick={() => setTool("eraser")}
          className={`hand-border w-9 h-9 flex items-center justify-center transition-colors cursor-pointer ${
            tool === "eraser" ? "bg-black text-white" : "bg-white hover:bg-gray-100 text-black"
          }`}
          style={{ borderRadius: "12px 10px 14px 8px" }}
          title="goma de borrar"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="6" width="9" height="8" rx="1.5" fill="currentColor" opacity="0.4" />
            <rect x="1" y="6" width="9" height="4" rx="1.5" fill="currentColor" />
            <path d="M10 6 L15 1 L15 5 L10 10 Z" fill="currentColor" opacity="0.65" />
            <line x1="0" y1="14.5" x2="16" y2="14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="hidden md:block w-6 h-px bg-gray-200" />

      {/* Tamaños */}
      <div className="flex md:flex-col items-center gap-1.5 md:gap-2">
        <span className="hidden md:inline font-hand text-xs text-gray-400">tamaño</span>
        {SIZES.map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={`rounded-full border-2 transition-all duration-100 cursor-pointer ${
              size === s ? "border-black scale-110" : "border-gray-300"
            }`}
            style={{
              width: Math.max(18, s + 12),
              height: Math.max(18, s + 12),
              backgroundColor: s === size ? "black" : "transparent",
            }}
            title={SIZE_LABELS[s]}
          >
            <div
              className="rounded-full bg-black mx-auto"
              style={{
                width: Math.max(4, s * 0.5),
                height: Math.max(4, s * 0.5),
                opacity: size === s ? 0 : 1,
              }}
            />
          </button>
        ))}
      </div>

      <div className="hidden md:block w-6 h-px bg-gray-200" />

      {/* Colores */}
      <div className="flex md:flex-col items-center gap-1.5 md:gap-2">
        <span className="hidden md:inline font-hand text-xs text-gray-400">color</span>

        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`rounded-full border-2 transition-all duration-100 flex-shrink-0 cursor-pointer ${
              color === c ? "border-black scale-110" : "border-transparent hover:border-gray-300"
            }`}
            style={{ width: 22, height: 22, backgroundColor: c }}
          />
        ))}

        {/* Custom color picker */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => colorPickerRef.current?.click()}
            className={`rounded-full border-2 transition-all duration-100 cursor-pointer ${
              isCustom ? "border-black scale-110" : "border-dashed border-gray-400 hover:border-gray-600"
            }`}
            style={{
              width: 22,
              height: 22,
              background: isCustom
                ? color
                : "conic-gradient(red,#ff0,lime,cyan,blue,magenta,red)",
            }}
            title="color personalizado"
          />
          <input
            ref={colorPickerRef}
            type="color"
            value={isCustom ? color : customColor}
            onChange={(e) => {
              setCustomColor(e.target.value);
              setColor(e.target.value);
            }}
            className="absolute opacity-0 pointer-events-none w-0 h-0 top-0 left-0"
          />
        </div>
      </div>

      <div className="hidden md:block w-6 h-px bg-gray-200" />

      {/* Acciones */}
      <div className="flex md:flex-col items-center gap-1.5 md:gap-2">
        <button
          onClick={onUndo}
          className="hand-border w-9 h-9 flex items-center justify-center text-sm bg-white hover:bg-gray-100 transition-colors cursor-pointer"
          style={{ borderRadius: "10px 12px 8px 14px" }}
          title="deshacer"
        >
          ↩
        </button>
        <button
          onClick={() => {
            if (window.confirm("¿Borrar todo el dibujo? Esta acción no se puede deshacer.")) {
              onClear();
            }
          }}
          className="hand-border w-9 h-9 flex items-center justify-center text-sm bg-white hover:bg-gray-100 transition-colors cursor-pointer"
          style={{ borderRadius: "12px 10px 14px 8px" }}
          title="limpiar todo"
        >
          🗑
        </button>
      </div>

    </div>
  );
}
