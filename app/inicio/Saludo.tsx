"use client";

import { useEffect, useState } from "react";

export default function Saludo() {
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    const n = localStorage.getItem("plop_nombre");
    if (n) setNombre(n);
  }, []);

  if (!nombre) return null;

  return (
    <span className="font-hand text-base text-gray-500 rotate-[0.3deg]">
      hola, <span className="text-black font-semibold">{nombre}</span> 👋
    </span>
  );
}
