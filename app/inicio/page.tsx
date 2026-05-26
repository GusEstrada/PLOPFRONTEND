import Image from "next/image";

export default function Inicio() {
  return (
    <div className="font-sans">
      {/* Hero */}
      <section className="min-h-screen flex items-center px-6 md:px-16 lg:px-24 bg-white relative">
        <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-16 lg:px-24 py-5 max-w-6xl mx-auto w-full" style={{ left: '50%', transform: 'translateX(-50%)' }}>
          <span className="font-display text-2xl rotate-[-0.5deg] text-black select-none">PLOP</span>
          <div className="flex items-center gap-4">
            <a href="/dibujar" className="font-hand text-base text-gray-400 hover:text-black transition-colors rotate-[-0.4deg]">dibujar</a>
            <a href="/perfil" className="font-hand text-base text-gray-400 hover:text-black transition-colors rotate-[-0.2deg]">perfil</a>
            <a href="/" className="font-hand text-base text-gray-400 hover:text-black transition-colors rotate-[0.3deg]">login</a>
          </div>
        </nav>
        <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center gap-10 md:gap-16">
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
          <div className="flex-1 flex flex-col items-center md:items-start gap-5">
            <h1 className="font-display text-7xl md:text-8xl lg:text-9xl leading-none rotate-[-1.5deg] select-none">
              PLOP
            </h1>
            <p className="font-hand text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed text-center md:text-left">
              una mancha nueva cada d&iacute;a.
              <br />
              dib&uacute;jala a tu manera.
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

      {/* About */}
      <section className="py-20 md:py-28 px-6 md:px-16 lg:px-24 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-3 rotate-[-1deg]">
            &iquest;Qu&eacute; es PLOP?
          </h2>
          <p className="font-hand text-lg text-gray-500 text-center mb-14 max-w-lg mx-auto">
            un experimento de imaginaci&oacute;n colectiva.
            <br />
            todos los d&iacute;as una mancha nueva.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1 */}
            <div className="hand-border rounded-[20px_24px_16px_28px] bg-[#FFF9C4] p-6 md:p-8 flex flex-col items-center text-center rotate-[-0.8deg] hover:rotate-[0deg] transition-all duration-200">
              <div className="w-full aspect-square bg-gray-200/70 rounded-[12px_16px_10px_18px] mb-5 flex items-center justify-center text-gray-400 font-hand text-base">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                  <ellipse cx="24" cy="26" rx="18" ry="14" strokeDasharray="3 3" />
                  <circle cx="16" cy="22" r="3" fill="currentColor" />
                  <circle cx="30" cy="20" r="2" fill="currentColor" />
                  <circle cx="22" cy="14" r="4" fill="currentColor" />
                </svg>
              </div>
              <h3 className="font-display text-2xl mb-2">ve la mancha</h3>
              <p className="font-hand text-base text-gray-700 leading-relaxed">
                cada ma&ntilde;ana aparece una nueva mancha de tinta.
                nadie sabe qu&eacute; es.
              </p>
            </div>

            {/* Card 2 */}
            <div className="hand-border rounded-[22px_18px_26px_14px] bg-[#FFCDD2] p-6 md:p-8 flex flex-col items-center text-center rotate-[0.7deg] hover:rotate-[0deg] transition-all duration-200">
              <div className="w-full aspect-square bg-gray-200/70 rounded-[16px_12px_20px_14px] mb-5 flex items-center justify-center text-gray-400 font-hand text-base">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                  <rect x="8" y="8" width="32" height="32" rx="4" strokeDasharray="3 3" />
                  <path d="M14 28 L22 18 L28 26 L34 16 L38 22" />
                  <circle cx="20" cy="16" r="3" fill="currentColor" />
                </svg>
              </div>
              <h3 className="font-display text-2xl mb-2">dibuja encima</h3>
              <p className="font-hand text-base text-gray-700 leading-relaxed">
                usa tu imaginaci&oacute;n. dibuja, garabatea,
                transforma la mancha en lo que quieras.
              </p>
            </div>

            {/* Card 3 */}
            <div className="hand-border rounded-[18px_22px_20px_24px] bg-[#C8E6C9] p-6 md:p-8 flex flex-col items-center text-center rotate-[-0.6deg] hover:rotate-[0deg] transition-all duration-200">
              <div className="w-full aspect-square bg-gray-200/70 rounded-[14px_18px_12px_20px] mb-5 flex items-center justify-center text-gray-400 font-hand text-base">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                  <circle cx="16" cy="16" r="6" />
                  <circle cx="32" cy="16" r="6" />
                  <circle cx="16" cy="32" r="6" />
                  <circle cx="32" cy="32" r="6" />
                </svg>
              </div>
              <h3 className="font-display text-2xl mb-2">descubre</h3>
              <p className="font-hand text-base text-gray-700 leading-relaxed">
                explora el foro en vivo y mira c&oacute;mo otros
                interpretaron la misma mancha.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-[#DBEAFE]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
          <div className="flex-1 text-center md:text-left">
            <p className="font-hand text-2xl md:text-3xl lg:text-4xl text-gray-800 leading-relaxed">
              todos ven algo diferente.
              <br />
              <span className="text-blue-600">&iquest;t&uacute; qu&eacute; ves?</span>
            </p>
          </div>
          <div className="flex-shrink-0">
            <a
              href="/galeria"
              className="hand-border-thick rounded-[14px_18px_12px_16px] bg-black text-white font-hand text-lg md:text-xl px-8 py-3 inline-block rotate-[0.5deg] transition-all duration-150 hover:bg-gray-800 hover:rotate-[0deg] active:scale-95"
            >
              mancha de hoy
            </a>
          </div>
        </div>
      </section>

      {/* Contador */}
      <section className="py-20 md:py-28 px-6 md:px-16 lg:px-24 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl mb-12 rotate-[0.5deg]">
            PLOP en n&uacute;meros
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="hand-border rounded-[18px_22px_14px_26px] bg-[#FDFBF7] p-8 rotate-[-0.7deg]">
              <p className="font-display text-5xl md:text-6xl text-black">12,458</p>
              <p className="font-hand text-lg text-gray-500 mt-2">dibujos creados</p>
            </div>
            <div className="hand-border rounded-[22px_16px_26px_18px] bg-[#FDFBF7] p-8 rotate-[0.5deg]">
              <p className="font-display text-5xl md:text-6xl text-blue-600">342</p>
              <p className="font-hand text-lg text-gray-500 mt-2">dibujados hoy</p>
            </div>
            <div className="hand-border rounded-[20px_24px_16px_28px] bg-[#FDFBF7] p-8 rotate-[-0.4deg]">
              <p className="font-display text-5xl md:text-6xl text-black">1</p>
              <p className="font-hand text-lg text-gray-500 mt-2">mancha nueva cada d&iacute;a</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 bg-white text-center font-hand text-sm text-gray-300">
        PLOP &mdash; una mancha nueva cada d&iacute;a
      </footer>
    </div>
  );
}
