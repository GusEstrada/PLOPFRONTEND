import Link from "next/link";
import Image from "next/image";

export default function Login() {
  return (
    <section className="min-h-screen bg-[#1E1B4B] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Ink blot atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#312E81] rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-[#4338CA] rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-[#6366F1] rounded-full blur-3xl opacity-20" />
      </div>

      {/* Floating ink dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[10%] w-3 h-3 bg-indigo-400/30 rounded-full" />
        <div className="absolute top-[25%] right-[20%] w-2 h-2 bg-blue-400/20 rounded-full" />
        <div className="absolute bottom-[30%] left-[15%] w-4 h-4 bg-indigo-300/20 rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] w-2 h-2 bg-blue-300/25 rounded-full" />
        <div className="absolute top-[50%] left-[50%] w-1.5 h-1.5 bg-indigo-200/20 rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Octopus + Brand */}
        <div className="text-center mb-10">
          <div className="relative inline-block">
            <Image
              src="/Pulpito.png"
              alt=""
              width={140}
              height={140}
              className="mx-auto mb-3 opacity-85 drop-shadow-2xl"
            />
          </div>
          <h1 className="font-display text-6xl md:text-7xl text-white rotate-[-1deg] leading-none">
            PLOP
          </h1>
          <p className="font-hand text-base md:text-lg text-indigo-300/80 mt-2">
            una mancha nueva cada d&iacute;a
          </p>
        </div>

        {/* Card */}
        <div
          className="hand-border p-8 backdrop-blur-md"
          style={{
            borderRadius: "20px 24px 16px 28px",
            backgroundColor: "rgba(255,255,255,0.06)",
          }}
        >
          <label className="font-hand text-base text-indigo-200/90 block mb-2">
            &iquest;c&oacute;mo te llamas?
          </label>
          <input
            type="text"
            placeholder="tu nombre..."
            className="w-full border-2 border-white/15 px-4 py-3 text-white font-hand text-base placeholder:text-indigo-300/40 outline-none transition-colors focus:border-blue-400/60"
            style={{ borderRadius: "12px 16px 10px 14px", backgroundColor: "rgba(255,255,255,0.04)" }}
          />
          <Link
            href="/inicio"
            className="hand-border-thick bg-black text-white font-hand text-lg w-full py-3 mt-5 block text-center transition-all duration-150 hover:bg-gray-800 active:scale-95"
            style={{ borderRadius: "14px 18px 12px 16px", transform: "rotate(-0.3deg)" }}
          >
            entrar
          </Link>
          <p className="font-hand text-xs text-indigo-300/40 text-center mt-4">
            sin registro, sin correo. solo dibuja.
          </p>
        </div>
      </div>
    </section>
  );
}
