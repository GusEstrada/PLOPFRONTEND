"use client";

import { useEffect, useState } from "react";

interface Achievement {
  code: string;
  title: string;
  description: string;
  iconUrl?: string;
  icon?: string;
}

interface ToastItem extends Achievement {
  id: number;
}

let nextId = 0;

export function useAchievementToast() {
  const [queue, setQueue] = useState<ToastItem[]>([]);

  function push(ach: Achievement) {
    const id = ++nextId;
    setQueue(prev => [...prev, { ...ach, id }]);
    setTimeout(() => {
      setQueue(prev => prev.filter(a => a.id !== id));
    }, 4500);
  }

  function dismiss(id: number) {
    setQueue(prev => prev.filter(a => a.id !== id));
  }

  return { queue, push, dismiss };
}

export function AchievementToast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const isImage = item.iconUrl && item.iconUrl.startsWith("/");
  const iconSrc = item.iconUrl || item.icon;

  return (
    <div
      onClick={() => onDismiss(item.id)}
      className={`fixed top-6 right-6 z-[200] flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-xl border border-gray-100 cursor-pointer transition-all duration-300 ${
        visible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
      }`}
    >
      {isImage && iconSrc ? (
        <img src={iconSrc} alt="" className="w-8 h-8 object-contain shrink-0" />
      ) : iconSrc ? (
        <span className="text-2xl shrink-0">{iconSrc}</span>
      ) : (
        <span className="text-2xl shrink-0">🏆</span>
      )}
      <div className="min-w-0">
        <p className="font-hand text-sm font-semibold text-gray-800">{item.title}</p>
        <p className="font-hand text-xs text-gray-500">{item.description}</p>
      </div>
    </div>
  );
}
