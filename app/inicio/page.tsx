import Image from "next/image";
import Saludo from "./Saludo";
import Contadores from "./Contadores";

export default function Inicio() {
  return (
    <div className="font-sans">

      {/* ── Hero (white) ── */}
      <section className="min-h-screen flex items-center px-6 md:px-16 lg:px-24 bg-white relative">

        {/* Nav */}
        <nav
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-16 lg:px-24 py-5 max-w-6xl mx-auto w-full"
          style={{ left: "50%", transform: "translateX(-50%)" }}
        >
          <span className="font-display text-2xl rotate-[-0.5deg] text-black select-none">PLOP</span>
          <div className="flex items-center gap-4">
            <a href="/dibujar" className="font-hand text-base text-gray-400 hover:text-black transition-colors rotate-[-0.4deg]">dibujar</a>
            <a href="/perfil"  className="font-hand text-base text-gray-400 hover:text-black transition-colors rotate-[-0.2deg]">perfil</a>
            <Saludo />
          </div>
        </nav>

        {/* Hero content */}
        <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center gap-10 md:gap-16">

          {/* Pulpo */}
          <div className="flex-1 flex justify-center md:justify-end -ml-0 md:-ml-16">
            <Image
              src="/Pulpito.png"
              alt="Pulpito PLOP"
              width={520}
              height={520}
              className="object-contain w-72 h-72 md:w-[480px] md:h-[480px] lg:w-[520px] lg:h-[520px] drop-shadow-xl"
              priority
            />
          </div>

          {/* Texto */}
          <div className="flex-1 flex flex-col items-center md:items-start gap-5">
            <h1 className="font-display text-7xl md:text-8xl lg:text-9xl leading-none rotate-[-1.5deg] select-none">
              PLOP
            </h1>
            <p className="font-hand text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed text-center md:text-left">
              una mancha nueva cada día.
              <br />
              dibújala a tu manera.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <a
                href="/dibujar"
                className="hand-border-thick rounded-[14px_18px_12px_16px] bg-black text-white font-hand text-lg md:text-xl px-8 py-3 inline-block rotate-[-0.5deg] transition-all duration-150 hover:bg-gray-800 hover:rotate-[0deg] active:scale-95"
              >
                dibujar ahora
              </a>
              <a
                href="/galeria"
                className="hand-border-thick rounded-[16px_12px_18px_14px] text-black font-hand text-lg md:text-xl px-8 py-3 inline-block rotate-[0.6deg] transition-all duration-150 hover:bg-blue-50 hover:rotate-[0deg] active:scale-95"
              >
                explorar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section className="py-20 md:py-28 px-6 md:px-16 lg:px-24 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-3 rotate-[-1deg]">
            ¿Qué es PLOP?
          </h2>
          <p className="font-hand text-lg text-gray-500 text-center mb-14 max-w-lg mx-auto">
            un experimento de imaginación colectiva.
            <br />
            todos los días una mancha nueva.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

            {/* Card 1 */}
            <div className="hand-border rounded-[20px_24px_16px_28px] bg-[#FFF9C4] p-6 md:p-8 flex flex-col items-center text-center rotate-[-0.8deg] hover:rotate-[0deg] hover:scale-[1.02] transition-all duration-200">
              <span className="text-6xl mb-1 select-none">🫧</span>
              <span className="font-hand text-xs text-yellow-600/60 mb-4 tracking-widest">01</span>
              <h3 className="font-display text-2xl mb-2">ve la mancha</h3>
              <p className="font-hand text-base text-gray-700 leading-relaxed">
                cada mañana aparece una nueva mancha de tinta. nadie sabe qué es.
              </p>
            </div>

            {/* Card 2 */}
            <div className="hand-border rounded-[22px_18px_26px_14px] bg-[#FFCDD2] p-6 md:p-8 flex flex-col items-center text-center rotate-[0.7deg] hover:rotate-[0deg] hover:scale-[1.02] transition-all duration-200">
              <span className="text-6xl mb-1 select-none">🖊️</span>
              <span className="font-hand text-xs text-red-400/60 mb-4 tracking-widest">02</span>
              <h3 className="font-display text-2xl mb-2">dibuja encima</h3>
              <p className="font-hand text-base text-gray-700 leading-relaxed">
                usa tu imaginación. dibuja, garabatea, transforma la mancha en lo que quieras.
              </p>
            </div>

            {/* Card 3 */}
            <div className="hand-border rounded-[18px_22px_20px_24px] bg-[#C8E6C9] p-6 md:p-8 flex flex-col items-center text-center rotate-[-0.6deg] hover:rotate-[0deg] hover:scale-[1.02] transition-all duration-200">
              <span className="text-6xl mb-1 select-none">🌍</span>
              <span className="font-hand text-xs text-green-600/60 mb-4 tracking-widest">03</span>
              <h3 className="font-display text-2xl mb-2">descubre</h3>
              <p className="font-hand text-base text-gray-700 leading-relaxed">
                explora el foro en vivo y mira cómo otros interpretaron la misma mancha.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Manifesto ── */}
      <section className="relative py-32 md:py-44 px-6 md:px-16 lg:px-24 bg-[#07051A] overflow-hidden">

        {/* Glows */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-30"
            style={{ background: "radial-gradient(ellipse, #4F46E5 0%, transparent 65%)", filter: "blur(80px)" }}
          />
          <div
            className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full opacity-20"
            style={{ background: "radial-gradient(ellipse, #7C3AED 0%, transparent 70%)", filter: "blur(70px)" }}
          />
        </div>

        {/* Mancha decorativa SVG de fondo */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]">
          <svg viewBox="0 0 400 400" className="w-[600px] h-[600px]" fill="white">
            <path d="M200,60 C260,40 340,80 360,150 C385,230 350,310 280,340 C210,370 130,350 90,290 C45,220 55,130 110,90 C145,65 175,72 200,60 Z" />
            <circle cx="310" cy="120" r="35" />
            <circle cx="80" cy="260" r="25" />
            <ellipse cx="200" cy="340" rx="50" ry="25" transform="rotate(-20 200 340)" />
            <circle cx="340" cy="300" r="18" />
          </svg>
        </div>

        {/* Contenido */}
        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-10">

          {/* Cita */}
          <div className="space-y-2">
            <p className="font-hand text-3xl md:text-5xl lg:text-6xl text-white/90 leading-tight">
              todos ven algo diferente.
            </p>
            <p
              className="font-hand text-4xl md:text-6xl lg:text-7xl leading-tight"
              style={{
                background: "linear-gradient(135deg, #818CF8 0%, #C4B5FD 50%, #60A5FA 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ¿tú qué ves?
            </p>
          </div>

          {/* Separador decorativo */}
          <div className="flex items-center gap-3 opacity-40">
            <div className="w-12 h-px bg-indigo-400" />
            <div className="w-2 h-2 rounded-full bg-indigo-400" />
            <div className="w-12 h-px bg-indigo-400" />
          </div>

          {/* Botón */}
          <a
            href="/galeria"
            className="font-hand text-lg md:text-xl px-10 py-4 rounded-2xl text-white transition-all duration-200 hover:-translate-y-1 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              boxShadow: "0 8px 40px rgba(79,70,229,0.5), 0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            ver la mancha de hoy →
          </a>
        </div>
      </section>

      {/* ── Contadores animados ── */}
      <Contadores />

      {/* ── Footer ── */}
      <footer className="py-6 px-6 bg-white text-center font-hand text-sm text-gray-300">
        PLOP — una mancha nueva cada día
      </footer>
    </div>
  );
}
