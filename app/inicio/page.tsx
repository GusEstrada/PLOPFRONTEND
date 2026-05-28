"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "./NavBar";
import Contadores from "./Contadores";

export default function Inicio() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("plop_token")) router.replace("/");
  }, [router]);
  return (
    <div className="bg-[#FFFDF7] min-h-screen">

      {/* Decoración fija de fondo */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse,#fde68a 0%,transparent 65%)", filter: "blur(90px)" }}/>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse,#ddd6fe 0%,transparent 70%)", filter: "blur(80px)" }}/>
      </div>

      <NavBar />

      {/* ── HERO centrado ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-16 lg:px-24 pt-16 pb-32 flex flex-col items-center text-center">

        {/* Badge */}
        <span className="font-hand text-sm text-indigo-500 px-4 py-1.5 rounded-full mb-10"
          style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)" }}>
          ✦ una mancha nueva cada día
        </span>

        {/* Pulpito encima de PLOP */}
        <div className="relative flex flex-col items-center">
          <div className="relative z-20 mb-[-20px] md:mb-[-32px]">
            <div className="absolute inset-0 rounded-full"
              style={{ background: "radial-gradient(circle,rgba(165,180,252,0.5) 0%,transparent 65%)", filter: "blur(28px)" }}/>
            <Image
              src="/Pulpito.png"
              alt="Pulpito PLOP"
              width={300}
              height={300}
              className="relative object-contain w-36 h-36 md:w-56 md:h-56 drop-shadow-2xl"
              priority
            />
          </div>
          <h1
            className="relative z-10 font-display text-[64px] md:text-[100px] lg:text-[130px] text-gray-900 leading-none select-none"
            style={{ letterSpacing: "-0.02em", transform: "rotate(-1.2deg)" }}
          >
            PLOP
          </h1>
        </div>

        <p className="font-hand text-xl md:text-2xl text-gray-400 leading-relaxed mt-8 max-w-xs">
          dibújala a tu manera.<br />todos ven algo diferente.
        </p>

        <div className="flex flex-wrap gap-3 mt-8 justify-center">
          <Link href="/dibujar"
            className="font-hand text-lg md:text-xl px-8 py-3.5 rounded-2xl text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", boxShadow: "0 8px 28px rgba(79,70,229,0.4)" }}>
            dibujar ahora
          </Link>
          <Link href="/galeria"
            className="font-hand text-lg md:text-xl px-8 py-3.5 rounded-2xl text-indigo-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-50 active:scale-95"
            style={{ border: "1.5px solid rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.04)" }}>
            explorar →
          </Link>
        </div>
      </section>

      {/* ── ¿QUÉ ES PLOP? (pasos editoriales) ── */}
      <section className="relative z-10 px-6 md:px-16 lg:px-24 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl text-gray-900 mb-3">¿Qué es PLOP?</h2>
            <p className="font-hand text-lg text-gray-400">un experimento de imaginación colectiva</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {[
              { num: "01", emoji: "🫧", title: "ve la mancha",   text: "cada mañana aparece una nueva mancha de tinta. nadie sabe qué es.",                         color: "#f59e0b" },
              { num: "02", emoji: "🖊️", title: "dibuja encima", text: "usa tu imaginación. dibuja, garabatea, transforma la mancha en lo que tú quieras.",         color: "#4f46e5" },
              { num: "03", emoji: "🌍", title: "descubre",       text: "explora el foro en vivo y mira cómo otros interpretaron la misma mancha.",                  color: "#059669" },
            ].map(({ num, emoji, title, text, color }) => (
              <div key={num} className="flex flex-col items-center text-center gap-5">
                {/* Emoji en caja coloreada */}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: `${color}12`, border: `1.5px solid ${color}25` }}>
                  {emoji}
                </div>
                {/* Número */}
                <span className="font-display text-sm tracking-[0.2em] uppercase" style={{ color, opacity: 0.8 }}>{num}</span>
                {/* Texto */}
                <div>
                  <h3 className="font-display text-2xl text-gray-900 mb-2">{title}</h3>
                  <p className="font-hand text-base text-gray-400 leading-relaxed max-w-[240px] mx-auto">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO abierto ── */}
      <section className="relative z-10 px-6 md:px-16 lg:px-24 py-20 md:py-32 overflow-hidden">
        {/* Glow detrás del texto */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[320px] rounded-full opacity-20"
            style={{ background: "radial-gradient(ellipse,#c4b5fd 0%,transparent 70%)", filter: "blur(80px)" }}/>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="font-hand text-4xl md:text-5xl lg:text-6xl text-gray-700 leading-snug mb-3">
            todos ven algo diferente.
          </p>
          <p className="font-hand text-5xl md:text-6xl lg:text-7xl leading-snug mb-14"
            style={{
              background: "linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#db2777 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
            ¿tú qué ves?
          </p>
          <Link href="/dibujar"
            className="inline-block font-hand text-lg md:text-xl px-10 py-4 rounded-2xl text-white transition-all duration-200 hover:-translate-y-1 active:scale-95"
            style={{
              background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
              boxShadow: "0 8px 28px rgba(79,70,229,0.35)",
            }}>
            ver la mancha de hoy →
          </Link>
        </div>
      </section>

      {/* ── CONTADORES ── */}
      <Contadores />

      {/* ── FOOTER ── */}
      <footer className="relative z-10 py-8 px-6 text-center border-t border-gray-100">
        <p className="font-hand text-sm text-gray-300">PLOP — una mancha nueva cada día</p>
      </footer>

    </div>
  );
}
