"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState(false);

  function handleEntrar() {
    if (nombre.trim() === "") {
      setError(true);
      setTimeout(() => setError(false), 600);
      return;
    }
    localStorage.setItem("plop_nombre", nombre.trim());
    router.push("/inicio");
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#07051A]">

      {/* ── Fondo / glows ── */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-40"
          style={{ background: "radial-gradient(ellipse, #4F46E5 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full opacity-25"
          style={{ background: "radial-gradient(ellipse, #7C3AED 0%, transparent 70%)", filter: "blur(100px)" }}
        />
        <div
          className="absolute top-1/2 -right-20 w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse, #3B82F6 0%, transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      {/* ── Partículas ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[12%]  left-[8%]    w-1.5 h-1.5 rounded-full bg-indigo-400/40" />
        <div className="absolute top-[22%]  right-[14%]  w-1   h-1   rounded-full bg-violet-400/30" />
        <div className="absolute top-[60%]  left-[6%]    w-2   h-2   rounded-full bg-indigo-300/20" />
        <div className="absolute bottom-[18%] right-[8%] w-1.5 h-1.5 rounded-full bg-blue-400/30" />
        <div className="absolute bottom-[35%] left-[18%] w-1   h-1   rounded-full bg-violet-300/25" />
        <div className="absolute top-[45%]  right-[22%]  w-1   h-1   rounded-full bg-indigo-200/20" />
      </div>

      {/* ── Contenido ── */}
      <div className="relative z-10 w-full max-w-[400px] px-6 flex flex-col items-center">

        {/* Pulpo + aura */}
        <div className="relative mb-5 flex items-center justify-center">
          <div
            className="absolute w-56 h-56 rounded-full opacity-50"
            style={{
              background: "radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)",
              filter: "blur(32px)",
            }}
          />
          <Image
            src="/Pulpito.png"
            alt="PLOP mascot"
            width={170}
            height={170}
            className="relative drop-shadow-2xl"
            style={{ filter: "drop-shadow(0 0 24px rgba(99,102,241,0.5))" }}
          />
        </div>

        {/* Título */}
        <h1
          className="font-display text-7xl text-white leading-none tracking-wide"
          style={{
            textShadow: "0 0 40px rgba(99,102,241,0.7), 0 0 80px rgba(99,102,241,0.3)",
            WebkitTextStroke: "1px rgba(129,140,248,0.4)",
          }}
        >
          PLOP
        </h1>

        {/* Tagline */}
        <p className="font-hand text-indigo-300/85 text-lg mt-3 mb-12 tracking-wide">
          una mancha nueva cada día
        </p>

        {/* Formulario */}
        <div className="w-full space-y-4">

          <div className="space-y-2">
            <label className="block font-hand text-indigo-200/90 text-lg pl-1">
              ¿cómo te llamas?
            </label>

            {/* Input con animación de shake cuando está vacío */}
            <input
              type="text"
              placeholder="tu nombre..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEntrar()}
              className="w-full rounded-2xl px-5 py-4 text-white font-hand text-lg placeholder:text-white/40 outline-none transition-all duration-200 bg-white/5 border focus:ring-2 focus:ring-indigo-500/20"
              style={{
                border: error
                  ? "1px solid rgba(239,68,68,0.8)"
                  : "1px solid rgba(255,255,255,0.08)",
                boxShadow: error ? "0 0 0 3px rgba(239,68,68,0.2)" : "none",
                animation: error ? "shake 0.4s ease" : "none",
              }}
            />

            {/* Mensaje de error */}
            <p
              className="font-hand text-red-400 text-sm pl-1 transition-all duration-200"
              style={{ opacity: error ? 1 : 0, transform: error ? "translateY(0)" : "translateY(-4px)" }}
            >
              escribe tu nombre para continuar
            </p>
          </div>

          {/* Botón */}
          <button
            onClick={handleEntrar}
            className="block w-full font-hand text-xl text-white text-center py-4 rounded-2xl transition-all duration-200 active:scale-[0.97] hover:-translate-y-0.5 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              boxShadow: "0 8px 32px rgba(79,70,229,0.45), 0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            entrar →
          </button>

          <p className="font-hand text-white/50 text-base text-center pt-1">
            sin registro · sin correo · solo dibuja
          </p>
        </div>
      </div>

      {/* Animación shake */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
        }
      `}</style>
    </main>
  );
}
