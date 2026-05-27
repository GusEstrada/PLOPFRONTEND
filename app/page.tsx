"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [modo, setModo] = useState<"login" | "register">("login");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contra, setContra] = useState("");
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

  function switchModo(m: "login" | "register") {
    setModo(m);
    setError(false);
    setNombre(""); setCorreo(""); setContra("");
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#FFFDF7]">

      {/* ── Glows suaves de fondo ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-15"
          style={{ background: "radial-gradient(ellipse,#fde68a 0%,transparent 65%)", filter: "blur(90px)" }}/>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-08"
          style={{ background: "radial-gradient(ellipse,#ddd6fe 0%,transparent 70%)", filter: "blur(80px)" }}/>
      </div>

      {/* ── Manchas de tinta — fondo ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">

        {/* 1 — Indigo grande, arriba izquierda */}
        <svg className="absolute -top-10 -left-12" width="340" height="310" viewBox="0 0 340 310" style={{ opacity:0.14, transform:"rotate(-14deg)" }}>
          <path fill="#4f46e5" d="M145,32 C185,10 240,20 264,58 C292,102 282,162 252,188 C220,216 170,218 136,198 C96,175 74,128 82,86 C90,48 110,52 145,32Z"/>
          <path fill="#4f46e5" d="M264,58 C282,42 308,24 320,8 C324,2 316,-2 312,4 C304,16 288,32 268,52Z"/>
          <path fill="#4f46e5" d="M82,86 C66,70 42,58 24,62 C16,64 18,74 26,74 C40,74 60,76 78,90Z"/>
          <circle fill="#4f46e5" cx="288" cy="95" r="12"/>
          <circle fill="#4f46e5" cx="58" cy="208" r="8"/>
          <circle fill="#4f46e5" cx="255" cy="210" r="10"/>
          <circle fill="#4f46e5" cx="115" cy="224" r="6"/>
          <circle fill="#4f46e5" cx="315" cy="170" r="7"/>
          <circle fill="#4f46e5" cx="46" cy="145" r="5"/>
        </svg>

        {/* 2 — Amber grande, arriba derecha */}
        <svg className="absolute -top-6 -right-14" width="360" height="330" viewBox="0 0 360 330" style={{ opacity:0.16, transform:"rotate(10deg)" }}>
          <path fill="#f59e0b" d="M160,30 C202,8 260,18 285,56 C314,100 304,164 272,192 C238,222 186,224 150,204 C108,180 84,132 92,88 C100,48 122,50 160,30Z"/>
          <path fill="#f59e0b" d="M92,88 C74,68 48,54 28,58 C20,60 20,70 28,70 C44,70 66,74 88,92Z"/>
          <path fill="#f59e0b" d="M272,192 C288,208 308,228 320,246 C324,252 332,248 328,242 C318,228 300,210 274,196Z"/>
          <circle fill="#f59e0b" cx="308" cy="78" r="13"/>
          <circle fill="#f59e0b" cx="64" cy="210" r="9"/>
          <circle fill="#f59e0b" cx="290" cy="215" r="11"/>
          <circle fill="#f59e0b" cx="130" cy="228" r="7"/>
          <circle fill="#f59e0b" cx="335" cy="138" r="8"/>
          <circle fill="#f59e0b" cx="42" cy="155" r="6"/>
          <circle fill="#f59e0b" cx="170" cy="10" r="5"/>
        </svg>

        {/* 3 — Emerald mediana, mitad izquierda */}
        <svg className="absolute top-1/3 -left-8" width="260" height="240" viewBox="0 0 260 240" style={{ opacity:0.13, transform:"rotate(-8deg)" }}>
          <path fill="#059669" d="M110,24 C140,8 182,14 202,42 C224,74 218,116 196,138 C172,162 132,164 106,148 C76,130 62,94 70,62 C78,34 84,38 110,24Z"/>
          <path fill="#059669" d="M202,42 C218,28 238,12 248,2 C252,-3 245,-5 242,1 C234,12 220,26 204,44Z"/>
          <circle fill="#059669" cx="222" cy="80" r="10"/>
          <circle fill="#059669" cx="44" cy="118" r="7"/>
          <circle fill="#059669" cx="104" cy="166" r="9"/>
          <circle fill="#059669" cx="212" cy="150" r="6"/>
          <circle fill="#059669" cx="56" cy="52" r="5"/>
        </svg>

        {/* 4 — Rosa/pink, arriba centro-derecha */}
        <svg className="absolute top-8 left-[38%]" width="200" height="185" viewBox="0 0 200 185" style={{ opacity:0.13, transform:"rotate(18deg)" }}>
          <path fill="#ec4899" d="M88,20 C112,6 148,10 164,34 C182,62 176,100 154,118 C130,138 94,138 72,122 C46,104 36,70 46,44 C56,20 66,32 88,20Z"/>
          <path fill="#ec4899" d="M164,34 C176,22 192,8 200,0 C203,-4 197,-6 194,0 C188,10 176,22 166,36Z"/>
          <circle fill="#ec4899" cx="178" cy="65" r="9"/>
          <circle fill="#ec4899" cx="32" cy="90" r="6"/>
          <circle fill="#ec4899" cx="76" cy="148" r="8"/>
          <circle fill="#ec4899" cx="170" cy="122" r="5"/>
          <circle fill="#ec4899" cx="100" cy="4" r="4"/>
        </svg>

        {/* 5 — Cyan, mitad derecha */}
        <svg className="absolute top-[40%] -right-6" width="240" height="220" viewBox="0 0 240 220" style={{ opacity:0.12, transform:"rotate(-10deg)" }}>
          <path fill="#0891b2" d="M100,22 C130,6 170,12 190,38 C212,68 206,110 184,130 C160,152 120,152 96,136 C68,118 56,82 64,54 C72,28 74,36 100,22Z"/>
          <path fill="#0891b2" d="M64,54 C48,38 26,26 10,30 C2,32 4,42 12,42 C26,42 46,46 62,58Z"/>
          <circle fill="#0891b2" cx="208" cy="70" r="10"/>
          <circle fill="#0891b2" cx="38" cy="140" r="7"/>
          <circle fill="#0891b2" cx="190" cy="146" r="9"/>
          <circle fill="#0891b2" cx="78" cy="154" r="5"/>
          <circle fill="#0891b2" cx="220" cy="110" r="6"/>
        </svg>

        {/* 6 — Violeta grande, abajo izquierda */}
        <svg className="absolute -bottom-12 -left-10" width="370" height="340" viewBox="0 0 370 340" style={{ opacity:0.15, transform:"rotate(6deg)" }}>
          <path fill="#7c3aed" d="M165,30 C208,8 268,18 294,58 C324,104 314,166 282,194 C248,224 194,226 158,206 C114,182 90,132 98,88 C106,48 126,50 165,30Z"/>
          <path fill="#7c3aed" d="M282,194 C298,212 320,234 334,252 C338,258 346,252 342,246 C330,230 312,210 284,198Z"/>
          <circle fill="#7c3aed" cx="316" cy="82" r="13"/>
          <circle fill="#7c3aed" cx="66" cy="215" r="9"/>
          <circle fill="#7c3aed" cx="298" cy="220" r="12"/>
          <circle fill="#7c3aed" cx="136" cy="234" r="7"/>
          <circle fill="#7c3aed" cx="46" cy="160" r="6"/>
          <circle fill="#7c3aed" cx="350" cy="148" r="8"/>
        </svg>

        {/* 7 — Naranja, abajo centro */}
        <svg className="absolute bottom-10 left-[30%]" width="220" height="200" viewBox="0 0 220 200" style={{ opacity:0.13, transform:"rotate(-16deg)" }}>
          <path fill="#ea580c" d="M96,22 C124,6 162,12 180,38 C200,68 194,106 172,126 C148,148 110,148 86,132 C58,114 46,78 56,50 C66,26 70,36 96,22Z"/>
          <path fill="#ea580c" d="M180,38 C194,24 212,10 220,2 C224,-2 217,-5 214,1 C206,12 194,24 182,40Z"/>
          <circle fill="#ea580c" cx="194" cy="70" r="10"/>
          <circle fill="#ea580c" cx="38" cy="102" r="7"/>
          <circle fill="#ea580c" cx="80" cy="152" r="9"/>
          <circle fill="#ea580c" cx="184" cy="130" r="5"/>
          <circle fill="#ea580c" cx="104" cy="6" r="4"/>
          <circle fill="#ea580c" cx="28" cy="70" r="6"/>
        </svg>

        {/* 8 — Indigo pequeña, abajo derecha */}
        <svg className="absolute -bottom-6 -right-10" width="280" height="260" viewBox="0 0 280 260" style={{ opacity:0.14, transform:"rotate(14deg)" }}>
          <path fill="#4338ca" d="M120,26 C154,8 200,16 222,48 C248,86 240,138 214,162 C186,188 144,190 116,172 C82,152 64,108 72,70 C80,36 90,42 120,26Z"/>
          <path fill="#4338ca" d="M72,70 C56,52 32,40 14,44 C6,46 6,56 14,56 C28,56 50,60 70,74Z"/>
          <circle fill="#4338ca" cx="238" cy="80" r="11"/>
          <circle fill="#4338ca" cx="48" cy="174" r="8"/>
          <circle fill="#4338ca" cx="222" cy="178" r="10"/>
          <circle fill="#4338ca" cx="98" cy="188" r="6"/>
          <circle fill="#4338ca" cx="34" cy="126" r="5"/>
        </svg>

        {/* 9 — Rosa pequeña, centro alto */}
        <svg className="absolute top-[15%] left-[55%]" width="140" height="130" viewBox="0 0 140 130" style={{ opacity:0.11, transform:"rotate(-22deg)" }}>
          <path fill="#db2777" d="M62,14 C80,4 106,8 118,26 C132,48 126,76 108,88 C88,102 60,100 46,86 C28,68 30,42 42,26 C50,14 52,22 62,14Z"/>
          <circle fill="#db2777" cx="124" cy="46" r="7"/>
          <circle fill="#db2777" cx="28" cy="94" r="5"/>
          <circle fill="#db2777" cx="114" cy="94" r="4"/>
          <circle fill="#db2777" cx="70" cy="108" r="6"/>
        </svg>

        {/* 10 — Salpicaduras verdes sueltas, borde izquierdo */}
        <svg className="absolute top-[22%] left-2" width="60" height="200" viewBox="0 0 60 200" style={{ opacity:0.12 }}>
          <circle fill="#059669" cx="28" cy="18" r="9"/>
          <circle fill="#059669" cx="48" cy="48" r="5"/>
          <circle fill="#059669" cx="16" cy="78" r="7"/>
          <circle fill="#059669" cx="44" cy="108" r="6"/>
          <circle fill="#059669" cx="22" cy="138" r="8"/>
          <circle fill="#059669" cx="50" cy="168" r="4"/>
          <circle fill="#059669" cx="10" cy="192" r="5"/>
        </svg>

        {/* 11 — Salpicaduras amber, borde derecho */}
        <svg className="absolute top-[18%] right-2" width="60" height="220" viewBox="0 0 60 220" style={{ opacity:0.13 }}>
          <circle fill="#f59e0b" cx="38" cy="14" r="8"/>
          <circle fill="#f59e0b" cx="14" cy="44" r="5"/>
          <circle fill="#f59e0b" cx="46" cy="76" r="10"/>
          <circle fill="#f59e0b" cx="18" cy="108" r="4"/>
          <circle fill="#f59e0b" cx="42" cy="138" r="7"/>
          <circle fill="#f59e0b" cx="12" cy="166" r="6"/>
          <circle fill="#f59e0b" cx="40" cy="198" r="9"/>
          <circle fill="#f59e0b" cx="20" cy="214" r="4"/>
        </svg>

        {/* 12 — Teal, esquina arriba centro-izq */}
        <svg className="absolute top-2 left-[18%]" width="160" height="145" viewBox="0 0 160 145" style={{ opacity:0.11, transform:"rotate(25deg)" }}>
          <path fill="#0d9488" d="M70,16 C92,4 122,8 136,28 C152,52 146,84 124,98 C100,114 68,112 50,96 C28,78 30,48 44,30 C54,16 58,26 70,16Z"/>
          <circle fill="#0d9488" cx="144" cy="52" r="8"/>
          <circle fill="#0d9488" cx="28" cy="104" r="6"/>
          <circle fill="#0d9488" cx="132" cy="106" r="5"/>
          <circle fill="#0d9488" cx="74" cy="122" r="7"/>
        </svg>

        {/* 13 — Gotitas violeta dispersas, centro */}
        <svg className="absolute top-[55%] left-[12%]" width="100" height="80" viewBox="0 0 100 80" style={{ opacity:0.10 }}>
          <circle fill="#7c3aed" cx="12" cy="14" r="7"/>
          <circle fill="#7c3aed" cx="48" cy="8" r="4"/>
          <circle fill="#7c3aed" cx="80" cy="22" r="9"/>
          <circle fill="#7c3aed" cx="30" cy="42" r="5"/>
          <circle fill="#7c3aed" cx="66" cy="52" r="6"/>
          <circle fill="#7c3aed" cx="14" cy="66" r="4"/>
          <circle fill="#7c3aed" cx="90" cy="68" r="7"/>
        </svg>

        {/* 14 — Gotitas cyan, centro-derecha bajo */}
        <svg className="absolute top-[62%] right-[10%]" width="90" height="100" viewBox="0 0 90 100" style={{ opacity:0.10 }}>
          <circle fill="#0891b2" cx="20" cy="10" r="6"/>
          <circle fill="#0891b2" cx="58" cy="18" r="9"/>
          <circle fill="#0891b2" cx="10" cy="42" r="4"/>
          <circle fill="#0891b2" cx="74" cy="48" r="7"/>
          <circle fill="#0891b2" cx="36" cy="68" r="5"/>
          <circle fill="#0891b2" cx="80" cy="82" r="8"/>
          <circle fill="#0891b2" cx="18" cy="88" r="4"/>
        </svg>

        {/* 15 — Rojo, centro arriba */}
        <svg className="absolute top-[5%] left-[45%]" width="170" height="155" viewBox="0 0 170 155" style={{ opacity:0.12, transform:"rotate(-30deg)" }}>
          <path fill="#dc2626" d="M76,18 C100,4 134,10 150,32 C168,58 162,94 140,110 C116,128 80,126 60,110 C36,90 36,56 52,36 C62,18 64,30 76,18Z"/>
          <path fill="#dc2626" d="M150,32 C164,18 180,6 188,-2 C191,-6 185,-8 182,-2 C176,8 164,20 152,34Z"/>
          <circle fill="#dc2626" cx="162" cy="62" r="9"/>
          <circle fill="#dc2626" cx="30" cy="82" r="6"/>
          <circle fill="#dc2626" cx="76" cy="138" r="8"/>
          <circle fill="#dc2626" cx="154" cy="116" r="5"/>
          <circle fill="#dc2626" cx="20" cy="48" r="4"/>
        </svg>

        {/* 16 — Purple claro, mitad centro */}
        <svg className="absolute top-[48%] left-[42%]" width="150" height="138" viewBox="0 0 150 138" style={{ opacity:0.09, transform:"rotate(12deg)" }}>
          <path fill="#8b5cf6" d="M68,16 C90,4 120,8 134,28 C150,52 144,84 122,98 C98,114 64,112 46,96 C24,76 26,46 40,28 C50,14 54,26 68,16Z"/>
          <circle fill="#8b5cf6" cx="142" cy="54" r="8"/>
          <circle fill="#8b5cf6" cx="22" cy="100" r="6"/>
          <circle fill="#8b5cf6" cx="72" cy="124" r="7"/>
          <circle fill="#8b5cf6" cx="136" cy="104" r="4"/>
        </svg>

        {/* 17 — Verde lima, abajo centro-izq */}
        <svg className="absolute bottom-[8%] left-[22%]" width="180" height="168" viewBox="0 0 180 168" style={{ opacity:0.13, transform:"rotate(-18deg)" }}>
          <path fill="#10b981" d="M82,18 C108,4 145,10 163,34 C183,62 177,102 153,120 C127,140 89,140 65,124 C36,104 26,66 38,40 C50,16 58,30 82,18Z"/>
          <path fill="#10b981" d="M163,34 C177,20 196,6 204,-2 C208,-6 201,-8 198,-2 C190,10 178,22 165,36Z"/>
          <circle fill="#10b981" cx="176" cy="65" r="10"/>
          <circle fill="#10b981" cx="22" cy="95" r="7"/>
          <circle fill="#10b981" cx="62" cy="150" r="9"/>
          <circle fill="#10b981" cx="168" cy="128" r="5"/>
          <circle fill="#10b981" cx="105" cy="2" r="4"/>
        </svg>

        {/* 18 — Naranja brillante, arriba izq-centro */}
        <svg className="absolute top-[12%] left-[28%]" width="130" height="118" viewBox="0 0 130 118" style={{ opacity:0.12, transform:"rotate(32deg)" }}>
          <path fill="#f97316" d="M56,14 C74,4 102,8 114,26 C128,48 122,78 102,90 C80,104 50,102 36,86 C18,66 20,40 34,24 C44,12 46,22 56,14Z"/>
          <circle fill="#f97316" cx="120" cy="46" r="7"/>
          <circle fill="#f97316" cx="18" cy="90" r="5"/>
          <circle fill="#f97316" cx="56" cy="108" r="8"/>
          <circle fill="#f97316" cx="112" cy="92" r="4"/>
        </svg>

        {/* 19 — Indigo claro, borde derecho medio */}
        <svg className="absolute top-[28%] -right-4" width="200" height="186" viewBox="0 0 200 186" style={{ opacity:0.13, transform:"rotate(-6deg)" }}>
          <path fill="#6366f1" d="M90,20 C116,6 154,12 172,36 C192,64 186,104 162,124 C136,146 96,146 72,128 C44,108 32,72 42,44 C52,20 66,32 90,20Z"/>
          <path fill="#6366f1" d="M42,44 C26,28 6,16 -8,20 C-16,22 -14,32 -6,32 C8,32 28,38 42,48Z"/>
          <circle fill="#6366f1" cx="184" cy="68" r="10"/>
          <circle fill="#6366f1" cx="20" cy="120" r="7"/>
          <circle fill="#6366f1" cx="170" cy="134" r="8"/>
          <circle fill="#6366f1" cx="78" cy="154" r="5"/>
          <circle fill="#6366f1" cx="100" cy="4" r="6"/>
        </svg>

        {/* 20 — Rosa fuerte, borde izquierdo bajo */}
        <svg className="absolute bottom-[25%] -left-4" width="190" height="175" viewBox="0 0 190 175" style={{ opacity:0.12, transform:"rotate(9deg)" }}>
          <path fill="#f43f5e" d="M86,20 C112,6 150,12 168,36 C188,66 180,108 156,128 C130,150 90,150 66,132 C38,112 26,74 36,46 C46,22 62,32 86,20Z"/>
          <path fill="#f43f5e" d="M168,36 C182,22 200,8 208,0 C212,-5 205,-7 202,-1 C194,10 182,24 170,38Z"/>
          <circle fill="#f43f5e" cx="180" cy="68" r="11"/>
          <circle fill="#f43f5e" cx="22" cy="112" r="7"/>
          <circle fill="#f43f5e" cx="166" cy="140" r="9"/>
          <circle fill="#f43f5e" cx="74" cy="158" r="5"/>
          <circle fill="#f43f5e" cx="40" cy="156" r="6"/>
        </svg>

        {/* 21 — Amarillo, esquina arriba izq lejos */}
        <svg className="absolute top-[30%] left-[8%]" width="110" height="100" viewBox="0 0 110 100" style={{ opacity:0.13, transform:"rotate(-25deg)" }}>
          <path fill="#eab308" d="M48,12 C64,2 88,6 98,22 C110,42 104,70 86,80 C66,92 40,88 28,74 C12,56 14,32 28,18 C36,8 38,20 48,12Z"/>
          <circle fill="#eab308" cx="104" cy="40" r="7"/>
          <circle fill="#eab308" cx="14" cy="80" r="5"/>
          <circle fill="#eab308" cx="54" cy="96" r="6"/>
          <circle fill="#eab308" cx="96" cy="82" r="4"/>
        </svg>

        {/* 22 — Teal grande, centro derecha abajo */}
        <svg className="absolute bottom-[15%] right-[5%]" width="220" height="205" viewBox="0 0 220 205" style={{ opacity:0.12, transform:"rotate(-12deg)" }}>
          <path fill="#0d9488" d="M100,22 C130,6 172,14 192,42 C215,74 207,120 182,142 C155,166 112,166 86,148 C54,126 42,86 54,54 C66,26 72,36 100,22Z"/>
          <path fill="#0d9488" d="M54,54 C36,36 10,22 -6,26 C-14,28 -12,38 -4,38 C12,38 34,44 54,58Z"/>
          <circle fill="#0d9488" cx="204" cy="78" r="11"/>
          <circle fill="#0d9488" cx="28" cy="148" r="8"/>
          <circle fill="#0d9488" cx="190" cy="156" r="9"/>
          <circle fill="#0d9488" cx="84" cy="168" r="6"/>
          <circle fill="#0d9488" cx="40" cy="96" r="5"/>
        </svg>

        {/* 23 — Cluster de gotitas mixtas, centro */}
        <svg className="absolute top-[35%] left-[24%]" width="120" height="110" viewBox="0 0 120 110" style={{ opacity:0.11 }}>
          <circle fill="#4f46e5" cx="14" cy="16" r="8"/>
          <circle fill="#ec4899" cx="50" cy="8" r="5"/>
          <circle fill="#059669" cx="88" cy="20" r="9"/>
          <circle fill="#f59e0b" cx="22" cy="48" r="6"/>
          <circle fill="#0891b2" cx="66" cy="44" r="7"/>
          <circle fill="#7c3aed" cx="100" cy="56" r="4"/>
          <circle fill="#ea580c" cx="36" cy="76" r="8"/>
          <circle fill="#10b981" cx="78" cy="82" r="5"/>
          <circle fill="#dc2626" cx="10" cy="96" r="4"/>
          <circle fill="#6366f1" cx="108" cy="94" r="7"/>
          <circle fill="#f97316" cx="56" cy="104" r="6"/>
        </svg>

        {/* 24 — Cluster gotitas mixtas, abajo centro-der */}
        <svg className="absolute bottom-[30%] right-[22%]" width="130" height="120" viewBox="0 0 130 120" style={{ opacity:0.10 }}>
          <circle fill="#7c3aed" cx="18" cy="12" r="7"/>
          <circle fill="#f59e0b" cx="58" cy="6" r="9"/>
          <circle fill="#0891b2" cx="98" cy="18" r="5"/>
          <circle fill="#ec4899" cx="30" cy="44" r="8"/>
          <circle fill="#059669" cx="72" cy="38" r="4"/>
          <circle fill="#ea580c" cx="108" cy="52" r="7"/>
          <circle fill="#4f46e5" cx="14" cy="72" r="5"/>
          <circle fill="#dc2626" cx="52" cy="80" r="9"/>
          <circle fill="#10b981" cx="90" cy="86" r="6"/>
          <circle fill="#8b5cf6" cx="24" cy="104" r="4"/>
          <circle fill="#0d9488" cx="116" cy="108" r="7"/>
        </svg>

        {/* 25 — Manchita violeta, centro-arriba der */}
        <svg className="absolute top-[20%] right-[28%]" width="100" height="90" viewBox="0 0 100 90" style={{ opacity:0.11, transform:"rotate(40deg)" }}>
          <path fill="#a855f7" d="M44,10 C58,2 78,6 88,20 C100,38 94,62 76,72 C56,84 30,80 20,64 C6,44 10,20 24,10 C32,4 36,16 44,10Z"/>
          <circle fill="#a855f7" cx="92" cy="38" r="6"/>
          <circle fill="#a855f7" cx="8" cy="66" r="4"/>
          <circle fill="#a855f7" cx="46" cy="84" r="5"/>
        </svg>

        {/* 26 — Gotitas naranjas top-derecha lejos */}
        <svg className="absolute top-[42%] right-[32%]" width="80" height="90" viewBox="0 0 80 90" style={{ opacity:0.10 }}>
          <circle fill="#fb923c" cx="16" cy="10" r="7"/>
          <circle fill="#fb923c" cx="54" cy="20" r="4"/>
          <circle fill="#fb923c" cx="70" cy="46" r="8"/>
          <circle fill="#fb923c" cx="24" cy="58" r="5"/>
          <circle fill="#fb923c" cx="60" cy="72" r="6"/>
          <circle fill="#fb923c" cx="10" cy="82" r="4"/>
        </svg>

        {/* 27 — Mancha roja pequeña, arriba der lejos */}
        <svg className="absolute top-[32%] right-[15%]" width="115" height="106" viewBox="0 0 115 106" style={{ opacity:0.11, transform:"rotate(-20deg)" }}>
          <path fill="#ef4444" d="M50,12 C66,2 90,6 102,22 C115,42 108,70 88,82 C66,95 36,91 22,75 C4,54 8,28 24,14 C34,4 38,20 50,12Z"/>
          <circle fill="#ef4444" cx="108" cy="42" r="6"/>
          <circle fill="#ef4444" cx="8" cy="80" r="5"/>
          <circle fill="#ef4444" cx="52" cy="100" r="7"/>
        </svg>

        {/* 28 — Tira de gotitas horizontales, centro */}
        <svg className="absolute top-[78%] left-[15%]" width="280" height="40" viewBox="0 0 280 40" style={{ opacity:0.09 }}>
          <circle fill="#4f46e5" cx="10" cy="20" r="6"/>
          <circle fill="#ec4899" cx="40" cy="10" r="4"/>
          <circle fill="#f59e0b" cx="68" cy="26" r="8"/>
          <circle fill="#059669" cx="100" cy="14" r="5"/>
          <circle fill="#0891b2" cx="128" cy="28" r="7"/>
          <circle fill="#7c3aed" cx="158" cy="10" r="4"/>
          <circle fill="#ea580c" cx="188" cy="22" r="9"/>
          <circle fill="#10b981" cx="218" cy="12" r="5"/>
          <circle fill="#dc2626" cx="248" cy="28" r="6"/>
          <circle fill="#8b5cf6" cx="270" cy="16" r="4"/>
        </svg>

        {/* 29 — Tira de gotitas, top horizontal */}
        <svg className="absolute top-[8%] left-[20%]" width="300" height="36" viewBox="0 0 300 36" style={{ opacity:0.09 }}>
          <circle fill="#f59e0b" cx="10" cy="18" r="5"/>
          <circle fill="#7c3aed" cx="44" cy="8" r="7"/>
          <circle fill="#ec4899" cx="78" cy="24" r="4"/>
          <circle fill="#059669" cx="114" cy="12" r="8"/>
          <circle fill="#0891b2" cx="148" cy="26" r="5"/>
          <circle fill="#f97316" cx="180" cy="10" r="6"/>
          <circle fill="#4f46e5" cx="214" cy="22" r="9"/>
          <circle fill="#10b981" cx="248" cy="14" r="4"/>
          <circle fill="#dc2626" cx="280" cy="26" r="7"/>
        </svg>

        {/* 30 — Gran cluster centro izquierda */}
        <svg className="absolute top-[68%] left-[30%]" width="160" height="90" viewBox="0 0 160 90" style={{ opacity:0.09 }}>
          <circle fill="#4f46e5" cx="10" cy="45" r="9"/>
          <circle fill="#f59e0b" cx="36" cy="20" r="6"/>
          <circle fill="#ec4899" cx="62" cy="58" r="8"/>
          <circle fill="#059669" cx="88" cy="16" r="5"/>
          <circle fill="#0891b2" cx="112" cy="44" r="10"/>
          <circle fill="#7c3aed" cx="138" cy="24" r="6"/>
          <circle fill="#ea580c" cx="152" cy="68" r="7"/>
          <circle fill="#10b981" cx="20" cy="78" r="4"/>
          <circle fill="#dc2626" cx="80" cy="82" r="5"/>
        </svg>

      </div>

      {/* ── Glass card ── */}
      <div className="relative z-10 w-full max-w-md mx-6 rounded-3xl px-8 py-7"
        style={{
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.80)",
          boxShadow: "0 8px 48px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}>

        {/* Logo compacto */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="relative">
            <div className="absolute inset-0 rounded-full"
              style={{ background: "radial-gradient(circle,rgba(165,180,252,0.55) 0%,transparent 65%)", filter: "blur(12px)", transform: "scale(1.6)" }}/>
            <Image src="/Pulpito.png" alt="Pulpito PLOP" width={48} height={48}
              className="relative object-contain drop-shadow-lg"/>
          </div>
          <h1 className="font-display text-4xl text-gray-900 leading-none select-none"
            style={{ transform: "rotate(-0.8deg)", display: "inline-block" }}>
            PLOP
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex mb-5 rounded-xl p-1" style={{ background: "rgba(0,0,0,0.05)" }}>
          {(["login","register"] as const).map(m => (
            <button key={m} onClick={() => switchModo(m)}
              className="flex-1 font-hand text-sm py-2 rounded-lg transition-all duration-200 cursor-pointer"
              style={{
                background: modo === m ? "white" : "transparent",
                color: modo === m ? "#4f46e5" : "rgba(0,0,0,0.4)",
                boxShadow: modo === m ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                fontWeight: modo === m ? 700 : 400,
              }}>
              {m === "login" ? "iniciar sesión" : "registrar"}
            </button>
          ))}
        </div>

        {/* Campos */}
        <div className="flex flex-col gap-3">

          {/* Nombre — siempre visible */}
          <div className={error ? "shake" : ""}>
            <label className="font-hand text-sm text-gray-500 block mb-1">nombre de usuario</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleEntrar()}
              placeholder="tu nombre aquí"
              className="w-full font-hand text-base text-gray-800 placeholder-gray-300 px-4 py-3 rounded-xl outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.7)",
                border: error ? "1.5px solid rgba(239,68,68,0.6)" : "1.5px solid rgba(0,0,0,0.08)",
                boxShadow: error ? "0 0 0 3px rgba(239,68,68,0.1)" : "none",
              }}
            />
            {error && <p className="font-hand text-xs text-red-400 mt-1 pl-1">escribe tu nombre para continuar</p>}
          </div>

          {/* Correo + Contraseña — solo en registro */}
          {modo === "register" && (
            <>
              <div>
                <label className="font-hand text-sm text-gray-500 block mb-1">correo</label>
                <input
                  type="email"
                  value={correo}
                  onChange={e => setCorreo(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full font-hand text-base text-gray-800 placeholder-gray-300 px-4 py-3 rounded-xl outline-none transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(0,0,0,0.08)" }}
                />
              </div>
              <div>
                <label className="font-hand text-sm text-gray-500 block mb-1">contraseña</label>
                <input
                  type="password"
                  value={contra}
                  onChange={e => setContra(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleEntrar()}
                  placeholder="••••••••"
                  className="w-full font-hand text-base text-gray-800 placeholder-gray-300 px-4 py-3 rounded-xl outline-none transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(0,0,0,0.08)" }}
                />
              </div>
            </>
          )}

          {/* Botón */}
          <button
            onClick={handleEntrar}
            className="mt-1 w-full font-hand text-base py-3 rounded-xl text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
            style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", boxShadow: "0 6px 24px rgba(79,70,229,0.35)" }}
          >
            {modo === "login" ? "entrar →" : "crear cuenta →"}
          </button>
        </div>

        <p className="font-hand text-base text-gray-400 text-center mt-5 tracking-wide">
          PLOP — una mancha nueva cada día
        </p>
      </div>

      {/* Shake animation */}
      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-6px)}
          40%{transform:translateX(6px)}
          60%{transform:translateX(-4px)}
          80%{transform:translateX(4px)}
        }
        .shake{animation:shake 0.5s ease}
      `}</style>
    </main>
  );
}
