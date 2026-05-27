"use client";

import { useEffect, useState } from "react";
import Saludo from "./Saludo";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b border-gray-100 px-6 md:px-16 lg:px-24 py-4 transition-shadow duration-200"
      style={{
        background: "rgba(255,253,247,0.92)",
        boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <span className="font-display text-2xl rotate-[-0.5deg] text-gray-900 select-none">PLOP</span>
        <div className="flex items-center gap-5">
          <a href="/dibujar" className="font-hand text-base text-gray-400 hover:text-gray-800 transition-colors">dibujar</a>
          <a href="/galeria" className="font-hand text-base text-gray-400 hover:text-gray-800 transition-colors">galería</a>
          <a href="/perfil"  className="font-hand text-base text-gray-400 hover:text-gray-800 transition-colors">perfil</a>
          <Saludo />
        </div>
      </div>
    </header>
  );
}
