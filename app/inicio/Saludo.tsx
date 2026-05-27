"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/api";

export default function Saludo() {
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    const user = getUser();
    if (user) setNombre(user.name);
  }, []);

  if (!nombre) return null;

  return (
    <span className="font-hand text-base text-gray-500 rotate-[0.3deg]">
      hola, <span className="text-black font-semibold">{nombre}</span> 👋
    </span>
  );
}
