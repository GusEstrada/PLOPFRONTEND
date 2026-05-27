"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);

  return count;
}

function formatNumber(n: number) {
  return n.toLocaleString("es-MX");
}

function Contador({
  target,
  label,
  color = "text-black",
  active,
  duration,
}: {
  target: number;
  label: string;
  color?: string;
  active: boolean;
  duration?: number;
}) {
  const value = useCountUp(target, duration, active);
  return (
    <div>
      <p className={`font-display text-5xl md:text-6xl ${color}`}>
        {formatNumber(value)}
      </p>
      <p className="font-hand text-lg text-gray-500 mt-2">{label}</p>
    </div>
  );
}

export default function Contadores() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="py-20 md:py-28 px-6 md:px-16 lg:px-24 bg-white"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-4xl md:text-5xl mb-12 rotate-[0.5deg]">
          PLOP en números
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="hand-border rounded-[18px_22px_14px_26px] bg-[#FDFBF7] p-8 rotate-[-0.7deg]">
            <Contador target={12458} label="dibujos creados" active={active} duration={2000} />
          </div>
          <div className="hand-border rounded-[22px_16px_26px_18px] bg-[#FDFBF7] p-8 rotate-[0.5deg]">
            <Contador target={342} label="dibujados hoy" color="text-blue-600" active={active} duration={1400} />
          </div>
          <div className="hand-border rounded-[20px_24px_16px_28px] bg-[#FDFBF7] p-8 rotate-[-0.4deg]">
            <Contador target={1} label="mancha nueva cada día" active={active} duration={800} />
          </div>
        </div>
      </div>
    </section>
  );
}
