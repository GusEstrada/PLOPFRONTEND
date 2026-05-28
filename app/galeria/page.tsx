"use client";

import { useEffect, useState, useRef, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavBar from "../inicio/NavBar";
import { apiFetch, getUser } from "@/lib/api";
import { InkBlotSVG, BlotData } from "@/app/dibujar/inkblot";

interface User {
  id: string;
  name: string;
}

interface LineData {
  id: number;
  points: number[];
  color: string;
  size: number;
  tool?: "pen" | "eraser";
}

interface Drawing {
  id: string;
  lines: LineData[];
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

const cardColors = [
  "#FFF9C4", "#FFCDD2", "#C8E6C9", "#DBEAFE", "#E8E0FF",
  "#FFE0B2", "#F0F4C3", "#F8BBD0", "#B2EBF2", "#FFF9C4",
  "#E8E0FF", "#FFCDD2", "#C8E6C9", "#DBEAFE", "#FFE0B2",
  "#F0F4C3", "#F8BBD0", "#B2EBF2",
];

const cardRots = [
  "-0.8deg", "0.6deg", "-0.5deg", "0.4deg", "-0.7deg",
  "0.3deg", "-0.6deg", "0.5deg", "-0.4deg", "0.7deg",
  "-0.5deg", "0.4deg", "-0.6deg", "0.3deg", "-0.7deg",
  "0.5deg", "-0.4deg", "0.6deg",
];

function InkPreview({ lines, blot, className }: { lines: LineData[]; blot?: Drawing["blot"]; className?: string }) {
  const uid = useId();

  if (!lines || lines.length === 0) {
    return <p className="font-hand text-xs text-gray-500">dibujo vacío</p>;
  }

  const xs = lines.flatMap(l => l.points.filter((_, i) => i % 2 === 0));
  const ys = lines.flatMap(l => l.points.filter((_, i) => i % 2 === 1));
  if (xs.length === 0) return <p className="font-hand text-xs text-gray-500">dibujo vacío</p>;

  const penLines = lines.filter(l => !l.tool || l.tool === "pen");
  const eraserLines = lines.filter(l => l.tool === "eraser");
  const maskId = `em-${uid}`;
  const blotImgW = 1001;
  const blotImgH = 1002;

  if (blot?.imageUrl) {
    return (
      <svg viewBox={`0 0 ${blotImgW} ${blotImgH}`} className={className ?? "w-full h-full"}>
        {eraserLines.length > 0 && (
          <defs>
            <mask id={maskId}>
              <rect width={blotImgW} height={blotImgH} fill="white" />
              {eraserLines.map(line => (
                <polyline
                  key={line.id}
                  points={line.points.join(",")}
                  stroke="black"
                  strokeWidth={line.size}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ))}
            </mask>
          </defs>
        )}
        <image href={blot.imageUrl} width={blotImgW} height={blotImgH} opacity={0.3} />
        <g mask={eraserLines.length > 0 ? `url(#${maskId})` : undefined}>
          {penLines.map(line => (
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
        </g>
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
        <InkBlotSVG className="absolute inset-0 w-full h-full pointer-events-none opacity-30" blot={blot as BlotData} />
      )}
      <svg viewBox={`${minX - pad} ${minY - pad} ${w + pad * 2} ${h + pad * 2}`} className="absolute inset-0 w-full h-full">
        {eraserLines.length > 0 && (
          <defs>
            <mask id={maskId}>
              <rect x={minX - pad} y={minY - pad} width={w + pad * 2} height={h + pad * 2} fill="white" />
              {eraserLines.map(line => (
                <polyline
                  key={line.id}
                  points={line.points.join(",")}
                  stroke="black"
                  strokeWidth={line.size}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ))}
            </mask>
          </defs>
        )}
        <g mask={eraserLines.length > 0 ? `url(#${maskId})` : undefined}>
          {penLines.map(line => (
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
        </g>
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
  onDrawingDeleted,
  isLiked,
}: {
  drawing: Drawing;
  onClose: () => void;
  currentUser: { id: string; name: string } | null;
  onLike: (drawingId: string, liked: boolean) => void;
  onCommentAdded: (drawingId: string) => void;
  onCommentDeleted: (drawingId: string) => void;
  onDrawingDeleted: (drawingId: string) => void;
  isLiked: boolean;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const [hasLiked, setHasLiked] = useState(isLiked);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasLiked(isLiked);
  }, [isLiked]);

  useEffect(() => {
    setLoadingComments(true);
    apiFetch<{ comments: Comment[] }>(`/gallery/${drawing.id}/comments`)
      .then(data => setComments(data.comments))
      .catch(() => {})
      .finally(() => setLoadingComments(false));
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

  async function handleDeleteDrawing() {
    if (!confirm("¿Estás seguro de borrar este dibujo?")) return;
    try {
      await apiFetch(`/drawings/${drawing.id}`, { method: "DELETE" });
      onDrawingDeleted(drawing.id);
      onClose();
    } catch {}
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div className="bg-[#FFFDF7] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200"
        style={{ borderRadius: "24px 28px 20px 26px" }}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="font-hand text-sm text-gray-500">
            {drawing.user.name} · {new Date(drawing.createdAt).toLocaleDateString("es-ES")}
          </span>
          <div className="flex items-center gap-3">
            {currentUser?.id === drawing.user.id && (
              <button onClick={handleDeleteDrawing} className="text-gray-300 hover:text-red-400 text-sm cursor-pointer">
                🗑
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl cursor-pointer">✕</button>
          </div>
        </div>

        <div className="p-6">
          <div className="w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4">
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
              <span className={`text-lg transition-transform ${hasLiked ? "text-red-400 scale-110" : "text-gray-400 hover:text-red-400"}`}>
                {hasLiked ? "❤️" : "♡"}
              </span>
              <span className="font-hand text-gray-500">{drawing.likesCount}</span>
            </button>
            <span className="font-hand text-sm text-gray-400">💬 {comments.length}</span>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="font-hand text-sm text-gray-500 mb-3">comentarios</h3>

            {loadingComments && (
              <p className="font-hand text-xs text-gray-400">cargando...</p>
            )}

            {!loadingComments && comments.length === 0 && (
              <p className="font-hand text-xs text-gray-400 mb-4">sin comentarios todavía</p>
            )}

            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {comments.map(c => (
                <div key={c.id} className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="font-hand text-xs text-indigo-500 font-semibold">{c.user.name}</span>
                    <p className="font-hand text-sm text-gray-700">{c.content}</p>
                  </div>
                  {currentUser?.id === c.userId && (
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="text-gray-300 hover:text-red-400 text-xs cursor-pointer mt-0.5"
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
                  className="flex-1 bg-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-1 focus:ring-indigo-400 font-hand"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim() || sending}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 text-white font-hand text-sm px-4 py-2 rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
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
  const router = useRouter();
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const currentUser = getUser();

  // Derive the selected drawing reactively from the drawings array
  const selectedDrawing = drawings.find(d => d.id === selectedId) ?? null;

  useEffect(() => {
    if (!localStorage.getItem("plop_token")) router.replace("/");
  }, [router]);

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
        setLikedIds(prev => { const s = new Set(prev); s.delete(drawingId); return s; });
      } else {
        await apiFetch(`/gallery/${drawingId}/like`, { method: "POST" });
        setLikedIds(prev => new Set(prev).add(drawingId));
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

  function handleDrawingDeleted(drawingId: string) {
    setDrawings(prev => prev.filter(d => d.id !== drawingId));
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] pb-16">

      {selectedDrawing && (
        <DetailModal
          drawing={selectedDrawing}
          onClose={() => setSelectedId(null)}
          currentUser={currentUser}
          onLike={toggleLike}
          onCommentAdded={(id) => handleCommentCountChange(id, 1)}
          onCommentDeleted={(id) => handleCommentCountChange(id, -1)}
          onDrawingDeleted={handleDrawingDeleted}
          isLiked={likedIds.has(selectedDrawing.id)}
        />
      )}

      {/* Fondo decorativo */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse,#fde68a 0%,transparent 65%)", filter: "blur(90px)" }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse,#ddd6fe 0%,transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse,#fca5a5 0%,transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      <NavBar />

      {/* Título */}
      <div className="relative z-10 px-6 md:px-16 lg:px-24 pt-12 pb-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl text-gray-900 rotate-[-0.5deg]">
            galería
          </h1>
          <p className="font-hand text-lg text-gray-400 mt-2">
            lo que otros vieron en la misma mancha
          </p>
        </div>
      </div>

      {loading && (
        <div className="relative z-10 text-center py-20">
          <p className="font-hand text-lg text-gray-400">cargando...</p>
        </div>
      )}

      {!loading && drawings.length === 0 && (
        <div className="relative z-10 text-center py-20">
          <p className="font-hand text-lg text-gray-400">todavía no hay dibujos</p>
          <Link href="/dibujar" className="font-hand text-base text-indigo-400 hover:text-indigo-500 mt-4 inline-block">
            sé el primero →
          </Link>
        </div>
      )}

      {!loading && drawings.length > 0 && (
        <div className="relative z-10 px-6 md:px-16 lg:px-24">
          <div className="max-w-6xl mx-auto columns-2 md:columns-3 lg:columns-4 gap-4">
            {drawings.map((d, i) => {
              const liked = likedIds.has(d.id);
              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedId(d.id)}
                  className="mb-4 p-4 flex flex-col break-inside-avoid transition-all duration-200 hover:scale-[1.02] hover:rotate-0 cursor-pointer"
                  style={{
                    backgroundColor: cardColors[i % cardColors.length],
                    borderRadius: radii[i % radii.length],
                    transform: `rotate(${cardRots[i % cardRots.length]})`,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                  }}
                >
                  <div className="w-full h-32 mb-2 bg-white/40 rounded-lg overflow-hidden pointer-events-none">
                    <InkPreview lines={d.lines} blot={d.blot} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-hand text-xs text-gray-700">{d.user.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-hand text-xs text-gray-500">💬 {d.commentsCount}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(d.id, liked);
                          }}
                          className={`text-sm transition-colors cursor-pointer ${liked ? "text-red-400" : "text-gray-400 hover:text-red-400"}`}
                        >
                          {liked ? "❤️" : "♡"}
                        </button>
                        <span className="font-hand text-xs text-gray-500">{d.likesCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="font-hand text-sm text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                ← anterior
              </button>
              <span className="font-hand text-sm text-gray-400">{page} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="font-hand text-sm text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
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
