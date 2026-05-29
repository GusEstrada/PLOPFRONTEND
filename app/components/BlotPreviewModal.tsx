"use client";

import { useEffect, useRef } from "react";
import { computeBounds } from "@/app/dibujar/inkblot";

interface BlotData {
  id: string;
  date: string;
  mainBlot: number[];
  satellites: { x: number; y: number; r: number }[];
  imageUrl: string | null;
}

export function BlotPreviewModal({ blot, onClose }: { blot: BlotData; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div
        className="bg-[#FFFDF7] rounded-3xl w-full max-w-lg shadow-2xl border border-gray-200 overflow-hidden"
        style={{ borderRadius: "24px 28px 20px 26px" }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="font-hand text-sm text-gray-500">mancha del {blot.date}</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl cursor-pointer">✕</button>
        </div>
        <div className="p-6">
          <div className="w-full aspect-square bg-gray-100 rounded-xl overflow-hidden">
            {blot.imageUrl ? (
              <img src={blot.imageUrl} alt="mancha" className="w-full h-full object-contain" />
            ) : blot.mainBlot && blot.mainBlot.length > 0 ? (
              <BlotSVG points={blot.mainBlot} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-hand text-sm text-gray-400">sin imagen</span>
              </div>
            )}
          </div>
          <p className="font-hand text-sm text-gray-500 text-center mt-4">
            mancha usada para este dibujo
          </p>
        </div>
      </div>
    </div>
  );
}

function BlotSVG({ points }: { points: number[] }) {
  const b = computeBounds(points);
  const path = points.reduce((acc, p, i, arr) => {
    if (i % 2 === 1) {
      return i === 1 ? `M ${arr[i - 1]} ${arr[i]}` : `${acc} L ${arr[i - 1]} ${arr[i]}`;
    }
    return acc;
  }, "");
  const pad = 20;
  return (
    <svg viewBox={`${b.minX - pad} ${b.minY - pad} ${b.w + pad * 2} ${b.h + pad * 2}`} className="w-full h-full">
      <path d={`${path} Z`} fill="black" opacity={0.8} />
    </svg>
  );
}
