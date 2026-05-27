"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { apiFetch, getUser } from "@/lib/api";
import { InkBlotSVG, BlotData } from "@/app/dibujar/inkblot";

interface User {
  id: string;
  name: string;
}

interface Drawing {
  id: string;
  lines: { id: number; points: number[]; color: string; size: number }[];
  createdAt: string;
  user: User;
  likesCount: number;
  commentsCount: number;
  blot: {
    id: string;
    date: string;
    mainBlot: number[];
    satellites: { x: number; y: number; r: number }[];
    imageUrl: string | null;
  };
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user: User;
}

const radii = [
  "20px 24px 16px 28px",
  "22px 18px 26px 14px",
  "18px 22px 20px 24px",
  "24px 20px 16px 26px",
  "16px 26px 22px 18px",
];

function InkPreview({ lines, blot, className }: { lines: Drawing["lines"]; blot?: Drawing["blot"]; className?: string }) {
  if (!lines || lines.length === 0) {
    return <p className="font-hand text-xs text-gray-500">dibujo vacío</p>;
  }
  const xs = lines.flatMap(l => l.points.filter((_, i) => i % 2 === 0));
  const ys = lines.flatMap(l => l.points.filter((_, i) => i % 2 === 1));
  if (xs.length === 0) return <p className="font-hand text-xs text-gray-500">dibujo vacío</p>;

  const blotImgW = 1001;
  const blotImgH = 1002;

  if (blot?.imageUrl) {
    return (
      <svg viewBox={`0 0 ${blotImgW} ${blotImgH}`} className={className ?? "w-full h-full"}>
        <image href={blot.imageUrl} width={blotImgW} height={blotImgH} />
        {lines.map(line => (
          <polyline
            key={line.id}
            points={line.points.join(",")}
            fill="none"
            stroke={line.color}
            strokeWidth={line.size}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.8}
          />
        ))}
      </svg>
    );
  }

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const w = maxX - minX || 1;
  const h = maxY - minY || 1;
  const pad = 20;

  return (
    <div className={`relative ${className ?? "w-full h-full"}`}>
      {blot?.mainBlot && blot.mainBlot.length > 0 && (
        <InkBlotSVG className="absolute inset-0 w-full h-full pointer-events-none" blot={blot as BlotData} />
      )}
      <svg viewBox={`${minX - pad} ${minY - pad} ${w + pad * 2} ${h + pad * 2}`} className="absolute inset-0 w-full h-full">
        {lines.map(line => (
          <polyline
            key={line.id}
            points={line.points.join(",")}
            fill="none"
            stroke={line.color}
            strokeWidth={line.size}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.8}
          />
        ))}
      </svg>
    </div>
  );
}

function DetailModal({
  drawing,
  onClose,
  currentUser,
  onLike,
  onCommentAdded,
  onCommentDeleted,
}: {
  drawing: Drawing;
  onClose: () => void;
  currentUser: { id: string; name: string } | null;
  onLike: (drawingId: string, liked: boolean) => void;
  onCommentAdded: (drawingId: string) => void;
  onCommentDeleted: (drawingId: string) => void;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoadingComments(true);
    Promise.all([
      apiFetch<{ comments: Comment[] }>(`/gallery/${drawing.id}/comments`).then(data => setComments(data.comments)),
      apiFetch<{ count: number }>(`/gallery/${drawing.id}/likes`).then(() => {}).catch(() => {}),
    ]).finally(() => setLoadingComments(false));
  }, [drawing.id]);

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser || !commentText.trim() || sending) return;
    setSending(true);
    try {
      const newComment = await apiFetch<Comment>(`/gallery/${drawing.id}/comments`, {
        method: "POST",
        body: { content: commentText.trim() },
      });
      setComments(prev => [...prev, newComment]);
      setCommentText("");
      onCommentAdded(drawing.id);
    } catch {}
    setSending(false);
  }

  async function handleDeleteComment(commentId: string) {
    try {
      await apiFetch(`/gallery/${drawing.id}/comments/${commentId}`, { method: "DELETE" });
      setComments(prev => prev.filter(c => c.id !== commentId));
      onCommentDeleted(drawing.id);
    } catch {}
  }

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div className="bg-[#0f0d2e] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10"
        style={{ borderRadius: "24px 28px 20px 26px" }}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="font-hand text-sm text-indigo-300/70">
            {drawing.user.name} · {new Date(drawing.createdAt).toLocaleDateString("es-ES")}
          </span>
          <button onClick={onClose} className="text-white/50 hover:text-white text-xl cursor-pointer">✕</button>
        </div>

        <div className="p-6">
          <div className="w-full aspect-[4/3] bg-black/20 rounded-xl overflow-hidden mb-4">
            <InkPreview lines={drawing.lines} blot={drawing.blot} className="w-full h-full" />
          </div>

          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => {
                onLike(drawing.id, hasLiked);
                setHasLiked(!hasLiked);
              }}
              className="flex items-center gap-1.5 text-sm transition-colors cursor-pointer"
            >
              <span className={`${hasLiked ? "text-red-400" : "text-white/50 hover:text-red-400"}`}>
                {hasLiked ? "❤️" : "♡"}
              </span>
              <span className="font-hand text-white/60">{drawing.likesCount}</span>
            </button>
            <span className="font-hand text-sm text-white/40">💬 {comments.length}</span>
          </div>

          <div className="border-t border-white/10 pt-4">
            <h3 className="font-hand text-sm text-indigo-300/70 mb-3">comentarios</h3>

            {loadingComments && (
              <p className="font-hand text-xs text-indigo-300/40">cargando...</p>
            )}

            {!loadingComments && comments.length === 0 && (
              <p className="font-hand text-xs text-indigo-300/40 mb-4">sin comentarios todavía</p>
            )}

            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {comments.map(c => (
                <div key={c.id} className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="font-hand text-xs text-indigo-300 font-semibold">{c.user.name}</span>
                    <p className="font-hand text-sm text-white/80">{c.content}</p>
                  </div>
                  {currentUser?.id === c.userId && (
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="text-white/30 hover:text-red-400 text-xs cursor-pointer mt-0.5"
                    >
                      🗑
                    </button>
                  )}
                </div>
              ))}
            </div>

            {currentUser && (
              <form onSubmit={handleSubmitComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="escribe un comentario..."
                  className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-indigo-500 font-hand"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim() || sending}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/40 text-white font-hand text-sm px-4 py-2 rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  {sending ? "..." : "enviar"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Galeria() {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);
  const currentUser = getUser();

  useEffect(() => {
    setLoading(true);
    apiFetch<{ drawings: Drawing[]; total: number; page: number; totalPages: number }>(`/gallery/feed?page=${page}&limit=20`)
      .then(data => {
        setDrawings(data.drawings);
        setTotalPages(data.totalPages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  async function toggleLike(drawingId: string, liked: boolean) {
    if (!currentUser) return;
    try {
      if (liked) {
        await apiFetch(`/gallery/${drawingId}/like`, { method: "DELETE" });
      } else {
        await apiFetch(`/gallery/${drawingId}/like`, { method: "POST" });
      }
      setDrawings(prev =>
        prev.map(d =>
          d.id === drawingId ? { ...d, likesCount: liked ? d.likesCount - 1 : d.likesCount + 1 } : d
        )
      );
    } catch {}
  }

  function handleCommentCountChange(drawingId: string, delta: number) {
    setDrawings(prev =>
      prev.map(d =>
        d.id === drawingId ? { ...d, commentsCount: d.commentsCount + delta } : d
      )
    );
  }

  return (
    <div className="min-h-screen bg-[#07051A] pb-16">

      {selectedDrawing && (
        <DetailModal
          drawing={selectedDrawing}
          onClose={() => setSelectedDrawing(null)}
          currentUser={currentUser}
          onLike={toggleLike}
          onCommentAdded={(id) => handleCommentCountChange(id, 1)}
          onCommentDeleted={(id) => handleCommentCountChange(id, -1)}
        />
      )}

      {/* Glow de fondo */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-25"
          style={{ background: "radial-gradient(ellipse, #4F46E5 0%, transparent 70%)", filter: "blur(90px)" }}
        />
        <div
          className="absolute -bottom-40 right-0 w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: "radial-gradient(ellipse, #7C3AED 0%, transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md border-b border-white/[0.06] px-6 md:px-16 lg:px-24 py-4"
        style={{ background: "rgba(7,5,26,0.85)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/inicio"
            className="font-display text-3xl rotate-[-1deg] text-white transition-opacity hover:opacity-70"
            style={{ textShadow: "0 0 20px rgba(99,102,241,0.6)" }}
          >
            PLOP
          </Link>
          <div className="flex items-center gap-4">
            <p className="font-hand text-base text-indigo-300/50">
              {new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </header>

      {/* Título */}
      <div className="relative z-10 px-6 md:px-16 lg:px-24 pt-12 pb-10">
        <div className="max-w-6xl mx-auto">
          <h1
            className="font-display text-4xl md:text-5xl text-white rotate-[-0.5deg]"
            style={{ textShadow: "0 0 30px rgba(99,102,241,0.5)" }}
          >
            galería
          </h1>
          <p className="font-hand text-lg text-indigo-300/60 mt-2">
            lo que otros vieron en la misma mancha
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="relative z-10 text-center py-20">
          <p className="font-hand text-lg text-indigo-300/50">cargando...</p>
        </div>
      )}

      {/* Sin dibujos */}
      {!loading && drawings.length === 0 && (
        <div className="relative z-10 text-center py-20">
          <p className="font-hand text-lg text-indigo-300/50">todavía no hay dibujos</p>
          <Link href="/dibujar" className="font-hand text-base text-indigo-400 hover:text-indigo-300 mt-4 inline-block">
            sé el primero →
          </Link>
        </div>
      )}

      {/* Masonry */}
      {!loading && drawings.length > 0 && (
        <div className="relative z-10 px-6 md:px-16 lg:px-24">
          <div className="max-w-6xl mx-auto columns-2 md:columns-3 lg:columns-4 gap-4">
            {drawings.map((d, i) => (
              <div
                key={d.id}
                onClick={() => setSelectedDrawing(d)}
                className="mb-4 p-4 flex flex-col break-inside-avoid transition-all duration-200 hover:scale-[1.02] hover:rotate-0 cursor-pointer"
                style={{
                  backgroundColor: `hsl(${(i * 47) % 360}, 40%, 85%)`,
                  borderRadius: radii[i % radii.length],
                  transform: `rotate(${((i % 5) - 2) * 0.3}deg)`,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                }}
              >
                <div className="w-full h-32 mb-2 bg-white/30 rounded-lg overflow-hidden pointer-events-none">
                  <InkPreview lines={d.lines} blot={d.blot} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-hand text-xs text-gray-700">{d.user.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-hand text-xs text-white/40">💬 {d.commentsCount}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(d.id, false);
                        }}
                        className="text-xs text-white/60 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        ♡
                      </button>
                      <span className="font-hand text-xs text-white/50">{d.likesCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="font-hand text-sm text-indigo-300/50 hover:text-indigo-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                ← anterior
              </button>
              <span className="font-hand text-sm text-indigo-300/50">{page} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="font-hand text-sm text-indigo-300/50 hover:text-indigo-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                siguiente →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
