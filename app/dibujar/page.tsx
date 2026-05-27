"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { InkBlotSVG } from "./inkblot";
import Toolbar from "./toolbar";

const KonvaCanvas = dynamic(() => import("./KonvaCanvas"), { ssr: false });

export default function Dibujar() {
  const [phase, setPhase] = useState<"idle" | "drawing">("idle");
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(5);
  const [dims, setDims] = useState({ w: 800, h: 600 });
  const undoRef = useRef<(() => void) | null>(null);
  const clearRef = useRef<(() => void) | null>(null);

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

  if (phase === "idle") {
    return (
      <div className="min-h-screen bg-[#07051A] flex items-center justify-center px-6 relative overflow-hidden">

        {/* Glows */}
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
          <div className="mb-8 animate-[pulse_4s_ease-in-out_infinite]" style={{ filter: "drop-shadow(0 0 30px rgba(99,102,241,0.5))" }}>
            <InkBlotSVG className="w-48 h-40 md:w-64 md:h-56 mx-auto opacity-50" />
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
      />
      <div className="flex-1 relative">
        <KonvaCanvas
          width={dims.w}
          height={dims.h}
          toolColor={color}
          toolSize={size}
          undoRef={undoRef}
          clearRef={clearRef}
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
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#312E81] rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-[#4338CA] rounded-full blur-3xl opacity-40" />
        </div>

        <div className="relative z-10 text-center">
          <div className="mb-8 animate-[pulse_4s_ease-in-out_infinite]">
            <InkBlotSVG className="w-48 h-40 md:w-64 md:h-56 mx-auto opacity-40" />
          </div>

          <h1 className="font-display text-5xl md:text-7xl text-white rotate-[-1deg] leading-none mb-3">
            mancha de hoy
          </h1>
          <p className="font-hand text-base md:text-lg text-indigo-300/70 mb-10">
            mirá la mancha. dibujá lo que ves.
          </p>

          <button
            onClick={() => setPhase("drawing")}
            className="hand-border-thick bg-black text-white font-hand text-xl md:text-2xl px-12 py-4 inline-block transition-all duration-150 hover:bg-gray-800 hover:scale-105 active:scale-95"
            style={{ borderRadius: "18px 22px 14px 26px", transform: "rotate(-0.5deg)" }}
          >
            PLAY &#9654;
          </button>

          <div className="mt-8">
            <Link href="/inicio" className="font-hand text-sm text-indigo-400/60 hover:text-indigo-300 transition-colors">
              &larr; volver al inicio
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
      />
      <div className="flex-1 relative">
        <KonvaCanvas
          width={dims.w}
          height={dims.h}
          toolColor={color}
          toolSize={size}
          undoRef={undoRef}
          clearRef={clearRef}
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
