"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Saludo from "./Saludo";
import { clearToken, removeUser } from "@/lib/api";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  function handleLogout() {
    clearToken();
    removeUser();
    router.push("/");
  }

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`font-hand text-base transition-colors ${
        pathname === href
          ? "text-indigo-600 font-semibold"
          : "text-gray-400 hover:text-gray-800"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b border-gray-100 px-6 md:px-16 lg:px-24 py-4 transition-shadow duration-200"
      style={{
        background: "rgba(255,253,247,0.92)",
        boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link
          href="/inicio"
          className="font-display text-2xl rotate-[-0.5deg] text-gray-900 select-none hover:opacity-70 transition-opacity"
        >
          PLOP
        </Link>
        <div className="flex items-center gap-5">
          {navLink("/dibujar", "dibujar")}
          {navLink("/galeria", "galería")}
          {navLink("/perfil", "perfil")}
          <Saludo />
          <button
            onClick={handleLogout}
            className="font-hand text-sm text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
          >
            salir
          </button>
        </div>
      </div>
    </header>
  );
}
