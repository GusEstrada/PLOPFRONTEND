"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InkBlotSVG, defaultBlotData } from "./inkblot";
import type { BlotData } from "./inkblot";
import type { ImageTransform } from "./KonvaCanvas";
import Toolbar from "./toolbar";
import { apiFetch } from "@/lib/api";

const KonvaCanvas = dynamic(() => import("./KonvaCanvas"), { ssr: false });

export default function Dibujar() {
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "drawing">("idle");
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(5);
  const [dims, setDims] = useState({ w: 800, h: 600 });
  const [blot, setBlot] = useState<BlotData | undefined>(undefined);
  const [blotId, setBlotId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const undoRef = useRef<(() => void) | null>(null);
  const clearRef = useRef<(() => void) | null>(null);
  const linesRef = useRef<any[]>([]);
  const imageTransformRef = useRef<ImageTransform>({ offsetX: 0, offsetY: 0, scale: 1, imgW: 800, imgH: 600 });

  useEffect(() => {
    apiFetch<{ id: string; mainBlot: number[]; satellites: { x: number; y: number; r: number }[]; imageUrl?: string }>("/blot/today")
      .then(data => {
        setBlot({ mainBlot: data.mainBlot ?? [], satellites: data.satellites ?? [] });
        setBlotId(data.id);
        if (data.imageUrl) setImageUrl(data.imageUrl);
      })
      .catch(() => {
        setBlot(defaultBlotData);
      });
  }, []);

  useEffect(() => {
    if (phase !== "drawing") return;
    const update = () => {
      const isMobile = window.innerWidth < 768;
      setDims({
        w: window.innerWidth - (isMobile ? 0 : 80),
        h: window.innerHeight - (isMobile ? 80 : 0),
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [phase]);

  const handleSave = useCallback(async () => {
    if (!blotId || saved) return;
    setSaving(true);
    try {
      const { offsetX, offsetY, scale } = imageTransformRef.current;
      const lines = linesRef.current.map((line: any) => ({
        ...line,
        points: line.points.map((p: number, i: number) =>
          i % 2 === 0 ? (p - offsetX) / scale : (p - offsetY) / scale
        ),
      }));
      await apiFetch("/drawings", {
        method: "POST",
        body: { blotId, lines },
      });
      setSaved(true);
      setTimeout(() => router.push("/galeria"), 1500);
    } catch {}
    setSaving(false);
  }, [blotId, saved, router]);

  if (phase === "idle") {
    return (
      <div className="min-h-screen bg-[#07051A] flex items-center justify-center px-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[600px] rounded-full opacity-30"
            style={{ background: "radial-gradient(ellipse, #4F46E5 0%, transparent 65%)", filter: "blur(90px)" }}
          />
          <div
            className="absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: "radial-gradient(ellipse, #7C3AED 0%, transparent 70%)", filter: "blur(80px)" }}
          />
        </div>

        <div className="relative z-10 text-center">
          <div className="mb-8 animate-[pulse_4s_ease-in-out_infinite] flex justify-center" style={{ filter: "drop-shadow(0 0 30px rgba(99,102,241,0.5))" }}>
            {imageUrl ? (
              <img src={imageUrl} alt="mancha de hoy" className="w-48 h-40 md:w-64 md:h-56 object-contain opacity-70" />
            ) : (
              <InkBlotSVG className="w-48 h-40 md:w-64 md:h-56 mx-auto opacity-50" blot={blot} />
            )}
          </div>

          <h1
            className="font-display text-5xl md:text-7xl text-white rotate-[-1deg] leading-none mb-3"
            style={{ textShadow: "0 0 40px rgba(99,102,241,0.6)" }}
          >
            mancha de hoy
          </h1>
          <p className="font-hand text-base md:text-lg text-indigo-300/70 mb-10">
            mirá la mancha. dibujá lo que ves.
          </p>

          <button
            onClick={() => setPhase("drawing")}
            className="font-hand text-xl md:text-2xl px-12 py-4 inline-block text-white transition-all duration-200 hover:-translate-y-1 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              borderRadius: "18px 22px 14px 26px",
              boxShadow: "0 8px 40px rgba(79,70,229,0.5)",
              transform: "rotate(-0.5deg)",
            }}
          >
            PLAY ▶
          </button>

          <div className="mt-8">
            <Link href="/inicio" className="font-hand text-sm text-indigo-400/50 hover:text-indigo-300 transition-colors">
              ← volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FAFAFA] flex flex-col-reverse md:flex-row">
      <Toolbar
        color={color}
        setColor={setColor}
        size={size}
        setSize={setSize}
        onUndo={() => undoRef.current?.()}
        onClear={() => clearRef.current?.()}
        onSave={handleSave}
        saving={saving}
        saved={saved}
      />
      <div className="flex-1 relative">
        <KonvaCanvas
          width={dims.w}
          height={dims.h}
          toolColor={color}
          toolSize={size}
          undoRef={undoRef}
          clearRef={clearRef}
          blot={blot}
          linesRef={linesRef as any}
          imageUrl={imageUrl}
          imageTransformRef={imageTransformRef}
        />
        <Link
          href="/inicio"
          className="absolute top-3 left-3 z-20 font-display text-xl text-gray-400 hover:text-black transition-colors rotate-[-0.5deg]"
        >
          PLOP
        </Link>
      </div>
    </div>
  );
}
