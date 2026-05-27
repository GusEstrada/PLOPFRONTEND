"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InkBlotSVG, defaultBlotData } from "./inkblot";
import type { BlotData } from "./inkblot";
import type { ImageTransform } from "./KonvaCanvas";
import Toolbar from "./toolbar";
import NavBar from "../inicio/NavBar";
import { apiFetch } from "@/lib/api";

const KonvaCanvas = dynamic(() => import("./KonvaCanvas"), { ssr: false });

export default function Dibujar() {
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "drawing">("idle");
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(5);
  const [dims, setDims] = useState({ w: 800, h: 600 });
  const [animIn, setAnimIn] = useState(false);
  const [blot, setBlot] = useState<BlotData | undefined>(undefined);
  const [blotId, setBlotId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const undoRef = useRef<(() => void) | null>(null);
  const clearRef = useRef<(() => void) | null>(null);
  const linesRef = useRef<any[]>([]);
  const imageTransformRef = useRef<ImageTransform>({
    offsetX: 0, offsetY: 0, scale: 1, imgW: 800, imgH: 600,
  });

  useEffect(() => {
    const t = setTimeout(() => setAnimIn(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    apiFetch<{
      id: string;
      mainBlot: number[];
      satellites: { x: number; y: number; r: number }[];
      imageUrl?: string;
    }>("/blot/today")
      .then((data) => {
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
      <div className="min-h-screen bg-[#FFFDF7] flex flex-col relative overflow-hidden">
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

        <div className="flex-1 flex items-center justify-center px-6">
          <div
            className="relative z-10 text-center flex flex-col items-center"
            style={{
              opacity: animIn ? 1 : 0,
              transform: animIn ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <span
              className="font-hand text-sm text-indigo-500 px-4 py-1.5 rounded-full mb-10"
              style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)" }}
            >
              ✦ mancha de hoy
            </span>

            <div className="relative mb-6">
              <div
                className="absolute inset-0 -m-8 rounded-full"
                style={{
                  background: "radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)",
                  filter: "blur(24px)",
                }}
              />
              <div style={{ animation: "floatBlot 6s ease-in-out infinite" }}>
                {imageUrl ? (
                  <img src={imageUrl} alt="mancha de hoy" className="w-44 h-36 md:w-64 md:h-56 object-contain opacity-90" />
                ) : (
                  <InkBlotSVG className="w-44 h-36 md:w-64 md:h-52 mx-auto opacity-90 drop-shadow-md" blot={blot} />
                )}
              </div>
            </div>

            <h1
              className="font-display text-5xl md:text-7xl text-gray-900 leading-none mb-3"
              style={{ transform: "rotate(-1deg)", letterSpacing: "-0.01em" }}
            >
              mancha de hoy
            </h1>

            <p className="font-hand text-lg md:text-xl text-gray-400 mb-12 leading-relaxed">
              mirá la mancha.{" "}
              <span className="text-indigo-400">dibujá lo que ves.</span>
            </p>

            <button
              onClick={() => setPhase("drawing")}
              className="group relative font-hand text-xl md:text-2xl px-14 py-4 text-white transition-all duration-200 hover:-translate-y-1 hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                borderRadius: "20px 24px 16px 28px",
                boxShadow: "0 10px 40px rgba(79,70,229,0.35), 0 2px 0 rgba(255,255,255,0.1) inset",
                transform: "rotate(-0.5deg)",
              }}
            >
              <span
                className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)" }}
              />
              <span className="relative flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base"
                  style={{ boxShadow: "0 0 0 2px rgba(255,255,255,0.2)" }}
                >
                  ▶
                </span>
                PLAY
              </span>
            </button>

            <p className="font-hand text-xs text-gray-300 mt-6">
              no hay respuesta incorrecta ✦ solo tu imaginación
            </p>
          </div>
        </div>

        <style>{`
          @keyframes floatBlot {
            0%, 100% { transform: translateY(0) rotate(-1deg); }
            50%       { transform: translateY(-10px) rotate(1deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FFFDF7] flex flex-col-reverse md:flex-row">
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
