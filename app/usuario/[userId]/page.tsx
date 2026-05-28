"use client";

import { useState, useEffect, useRef, useId } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import NavBar from "@/app/inicio/NavBar";
import { apiFetch, getUser } from "@/lib/api";
import { computeBounds } from "@/app/dibujar/inkblot";

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
  blot: {
    id: string;
    date: string;
    mainBlot: number[];
    satellites: { x: number; y: number; r: number }[];
    imageUrl: string | null;
  };
}

interface UserProfile {
  id: string;
  name: string;
  bio?: string;
  avatarConfig?: {
    headUrl?: string;
    eyesUrl?: string;
    mouthUrl?: string;
    accessoryUrl?: string;
  };
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user: { id: string; name: string };
}

const radii = [
  "20px 24px 16px 28px", "22px 18px 26px 14px",
  "18px 22px 20px 24px", "24px 20px 16px 26px",
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
];

function InkPreview({ lines, blot }: { lines: LineData[]; blot?: Drawing["blot"] }) {
  const uid = useId();
  if (!lines || lines.length === 0) {
    return <p className="font-hand text-xs text-gray-500">vacío</p>;
  }
  const xs = lines.flatMap(l => l.points.filter((_, i) => i % 2 === 0));
  const ys = lines.flatMap(l => l.points.filter((_, i) => i % 2 === 1));
  if (xs.length === 0) return <p className="font-hand text-xs text-gray-500">vacío</p>;

  const penLines = lines.filter(l => !l.tool || l.tool === "pen");
  const eraserLines = lines.filter(l => l.tool === "eraser");
  const maskId = `um-${uid}`;
  const blotImgW = 1001;
  const blotImgH = 1002;

  if (blot?.imageUrl) {
    return (
      <svg viewBox={`0 0 ${blotImgW} ${blotImgH}`} className="w-full h-full">
        {eraserLines.length > 0 && (
          <defs>
            <mask id={maskId}>
              <rect width={blotImgW} height={blotImgH} fill="white" />
              {eraserLines.map(line => (
                <polyline key={line.id} points={line.points.join(",")} stroke="black"
                  strokeWidth={line.size} strokeLinecap="round" strokeLinejoin="round" fill="none" />
              ))}
            </mask>
          </defs>
        )}
        <image href={blot.imageUrl} width={blotImgW} height={blotImgH} opacity={0.3} />
        <g mask={eraserLines.length > 0 ? `url(#${maskId})` : undefined}>
          {penLines.map(line => (
            <polyline key={line.id} points={line.points.join(",")} fill="none"
              stroke={line.color} strokeWidth={line.size} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
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

  const blotBounds = blot?.mainBlot && blot.mainBlot.length > 0 ? computeBounds(blot.mainBlot) : null;
  const blotPathData = blotBounds ? blot!.mainBlot.reduce((acc, p, i, arr) => {
    if (i % 2 === 1) {
      const x = arr[i - 1];
      const y = arr[i];
      return i === 1 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }
    return acc;
  }, "") : "";

  return (
    <div className="relative w-full h-full">
      {blotBounds && (
        <svg viewBox={`${blotBounds.minX - pad} ${blotBounds.minY - pad} ${blotBounds.w + pad * 2} ${blotBounds.h + pad * 2}`}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-30" fill="none">
          <path d={`${blotPathData} Z`} fill="black" opacity={1} />
          {blot!.satellites.map((sat, i) => (
            <circle key={i} cx={sat.x} cy={sat.y} r={sat.r} fill="black" />
          ))}
        </svg>
      )}
      <svg viewBox={`${minX - pad} ${minY - pad} ${w + pad * 2} ${h + pad * 2}`} className="absolute inset-0 w-full h-full">
        {eraserLines.length > 0 && (
          <defs>
            <mask id={maskId}>
              <rect x={minX - pad} y={minY - pad} width={w + pad * 2} height={h + pad * 2} fill="white" />
              {eraserLines.map(line => (
                <polyline key={line.id} points={line.points.join(",")} stroke="black"
                  strokeWidth={line.size} strokeLinecap="round" strokeLinejoin="round" fill="none" />
              ))}
            </mask>
          </defs>
        )}
        <g mask={eraserLines.length > 0 ? `url(#${maskId})` : undefined}>
          {penLines.map(line => (
            <polyline key={line.id} points={line.points.join(",")} fill="none"
              stroke={line.color} strokeWidth={line.size} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          ))}
        </g>
      </svg>
    </div>
  );
}

function UserDetailModal({ drawing, onClose, currentUser }: {
  drawing: Drawing & { user?: { id: string; name: string } };
  onClose: () => void;
  currentUser: { id: string; name: string } | null;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoadingComments(true);
    apiFetch<{ comments: Comment[] }>(`/gallery/${drawing.id}/comments`)
      .then(data => setComments(data.comments))
      .catch(() => {})
      .finally(() => setLoadingComments(false));
  }, [drawing.id]);

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

  async function toggleLike() {
    if (!currentUser) return;
    try {
      if (hasLiked) {
        await apiFetch(`/gallery/${drawing.id}/like`, { method: "DELETE" });
        setLikesCount(prev => prev - 1);
      } else {
        await apiFetch(`/gallery/${drawing.id}/like`, { method: "POST" });
        setLikesCount(prev => prev + 1);
      }
      setHasLiked(!hasLiked);
    } catch {}
  }

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
    } catch {}
    setSending(false);
  }

  async function handleDeleteComment(commentId: string) {
    try {
      await apiFetch(`/gallery/${drawing.id}/comments/${commentId}`, { method: "DELETE" });
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch {}
  }

  return (
    <div ref={overlayRef} onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#FFFDF7] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200"
        style={{ borderRadius: "24px 28px 20px 26px" }}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="font-hand text-sm text-gray-500">
            {new Date(drawing.createdAt).toLocaleDateString("es-ES")}
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl cursor-pointer">✕</button>
        </div>
        <div className="p-6">
          <div className="w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4">
            <InkPreview lines={drawing.lines} blot={drawing.blot} />
          </div>
          <div className="flex items-center gap-4 mb-6">
            {currentUser && (
              <button onClick={toggleLike} className="flex items-center gap-1.5 text-sm transition-colors cursor-pointer">
                <span className={`text-lg transition-transform ${hasLiked ? "text-red-400 scale-110" : "text-gray-400 hover:text-red-400"}`}>
                  {hasLiked ? "❤️" : "♡"}
                </span>
                <span className="font-hand text-gray-500">{likesCount}</span>
              </button>
            )}
            <span className="font-hand text-sm text-gray-400">💬 {comments.length}</span>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <h3 className="font-hand text-sm text-gray-500 mb-3">comentarios</h3>
            {loadingComments && <p className="font-hand text-xs text-gray-400">cargando...</p>}
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
                    <button onClick={() => handleDeleteComment(c.id)}
                      className="text-gray-300 hover:text-red-400 text-xs cursor-pointer mt-0.5">🗑</button>
                  )}
                </div>
              ))}
            </div>
            {currentUser && (
              <form onSubmit={handleSubmitComment} className="flex gap-2">
                <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)}
                  placeholder="escribe un comentario..."
                  className="flex-1 bg-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-1 focus:ring-indigo-400 font-hand" />
                <button type="submit" disabled={!commentText.trim() || sending}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 text-white font-hand text-sm px-4 py-2 rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed">
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

export default function UsuarioPage() {
  const params = useParams();
  const userId = params.userId as string;
  const currentUser = getUser();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    Promise.all([
      apiFetch<UserProfile>(`/profile/${userId}`),
      apiFetch<Drawing[]>(`/drawings/user/${userId}`),
    ])
      .then(([p, d]) => {
        setProfile(p);
        setDrawings(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="min-h-screen bg-[#FFFDF7]">
      {selectedDrawing && (
        <UserDetailModal
          drawing={selectedDrawing}
          onClose={() => setSelectedDrawing(null)}
          currentUser={currentUser}
        />
      )}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse,#fde68a 0%,transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: "radial-gradient(ellipse,#ddd6fe 0%,transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <NavBar />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-16 lg:px-24 py-10">
        {loading ? (
          <p className="font-hand text-lg text-gray-400 text-center py-20">cargando...</p>
        ) : !profile ? (
          <p className="font-hand text-lg text-gray-400 text-center py-20">usuario no encontrado</p>
        ) : (
          <div className="space-y-6">
            <Link href="/galeria" className="font-hand text-base text-gray-400 hover:text-gray-700 transition-colors inline-block">
              ← galería
            </Link>

            <div className="rounded-3xl p-7 md:p-9 bg-white"
              style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                {profile.avatarConfig && (profile.avatarConfig.headUrl || profile.avatarConfig.eyesUrl || profile.avatarConfig.mouthUrl || profile.avatarConfig.accessoryUrl) && (
                  <div className="relative shrink-0" style={{ width: 120, height: 120 }}>
                    {profile.avatarConfig.headUrl && <img src={profile.avatarConfig.headUrl} alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />}
                    {profile.avatarConfig.eyesUrl && <img src={profile.avatarConfig.eyesUrl} alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />}
                    {profile.avatarConfig.mouthUrl && <img src={profile.avatarConfig.mouthUrl} alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />}
                    {profile.avatarConfig.accessoryUrl && <img src={profile.avatarConfig.accessoryUrl} alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />}
                  </div>
                )}
                <div className="shrink-0">
                  <span className="inline-block font-hand text-xs text-indigo-500 px-3 py-1 rounded-full mb-4"
                    style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)" }}>
                    ✦ artista plop
                  </span>
                  <h1 className="font-display text-4xl md:text-6xl text-gray-900 leading-tight mb-1">{profile.name}</h1>
                </div>
                {profile.bio && (
                  <>
                    <div className="hidden md:block w-px self-stretch bg-gray-100" />
                    <div className="flex-1">
                      <p className="font-hand text-lg text-gray-600 leading-relaxed whitespace-pre-line">{profile.bio}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <h2 className="font-display text-3xl md:text-4xl text-gray-900">dibujos</h2>
              <span className="font-hand text-base text-gray-400">
                {drawings.length} mancha{drawings.length !== 1 ? "s" : ""}
              </span>
            </div>

            {drawings.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {drawings.map((d, i) => (
                  <div key={d.id}
                    onClick={() => setSelectedDrawing(d)}
                    className="relative flex flex-col items-center justify-center bg-white rounded-2xl p-4 transition-all duration-200 hover:scale-[1.03] cursor-pointer"
                    style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                    <div className="w-full h-28 pointer-events-none">
                      <InkPreview lines={d.lines} blot={d.blot} />
                    </div>
                    <span className="font-hand text-sm mt-2 text-gray-500">
                      {new Date(d.createdAt).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-hand text-base text-gray-400 py-10 text-center">todavía no hay dibujos</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
