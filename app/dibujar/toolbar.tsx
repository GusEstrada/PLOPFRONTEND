const SIZES = [2, 5, 10, 18];
const COLORS = ["#000000", "#2563EB", "#7C3AED", "#DC2626"];
const SIZE_LABELS: Record<number, string> = { 2: "fino", 5: "medio", 10: "grueso", 18: "muy grueso" };

export default function Toolbar({
  color,
  setColor,
  size,
  setSize,
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
  onUndo: () => void;
  onClear: () => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  return (
    <div className="flex md:flex-col items-center gap-4 md:gap-5 p-4 md:p-5 bg-white/90 backdrop-blur-sm border-t-2 md:border-t-0 md:border-r-2 border-black">
      {/* Tamaños */}
      <div className="flex md:flex-col items-center gap-2 md:gap-3">
        <span className="font-hand text-xs text-gray-400">tamaño</span>
        {SIZES.map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={`rounded-full border-2 transition-all duration-100 ${
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

      <div className="w-px h-6 md:w-6 md:h-px bg-gray-200" />

      {/* Colores */}
      <div className="flex md:flex-col items-center gap-2 md:gap-3">
        <span className="font-hand text-xs text-gray-400">color</span>
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`rounded-full border-2 transition-all duration-100 ${
              color === c ? "border-black scale-110" : "border-transparent"
            }`}
            style={{
              width: 22,
              height: 22,
              backgroundColor: c,
            }}
          />
        ))}
      </div>

      <div className="w-px h-6 md:w-6 md:h-px bg-gray-200" />

      {/* Acciones */}
      <div className="flex md:flex-col items-center gap-2">
        <button
          onClick={onUndo}
          className="hand-border w-9 h-9 flex items-center justify-center text-sm bg-white hover:bg-gray-100 transition-colors"
          style={{ borderRadius: "10px 12px 8px 14px" }}
          title="deshacer"
        >
          ↩
        </button>
        <button
          onClick={onClear}
          className="hand-border w-9 h-9 flex items-center justify-center text-sm bg-white hover:bg-gray-100 transition-colors"
          style={{ borderRadius: "12px 10px 14px 8px" }}
          title="limpiar todo"
        >
          🗑
        </button>
      </div>

      <div className="w-px h-6 md:w-6 md:h-px bg-gray-200" />

      {/* Subir */}
      <button
        onClick={onSave}
        disabled={saving || saved}
        className="font-hand text-sm px-4 py-2 rounded-xl text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:hover:translate-y-0"
        style={{
          background: saved
            ? "linear-gradient(135deg, #059669, #10b981)"
            : "linear-gradient(135deg, #4f46e5, #7c3aed)",
          boxShadow: "0 4px 16px rgba(79,70,229,0.35)",
          borderRadius: "14px 16px 12px 18px",
          transform: "rotate(-0.3deg)",
        }}
      >
        {saving ? "..." : saved ? "✅ subido" : "subir →"}
      </button>
    </div>
  );
}
