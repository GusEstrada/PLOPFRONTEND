"use client";

import { useState, useEffect, useRef, useMemo, useId } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/app/inicio/NavBar";
import { apiFetch, getUser } from "@/lib/api";
import { computeBounds } from "@/app/dibujar/inkblot";

interface CatalogItem {
  type: "head" | "eyes" | "mouth" | "acc";
  label: string;
  url: string;
}

interface AvatarConfig {
  headUrl: string;
  eyesUrl: string;
  mouthUrl: string;
  accessoryUrl: string;
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
  user: { id: string; name: string };
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
  user: { id: string; name: string };
}

function SafeImg({ src, className }: { src: string; className?: string }) {
  const [failKey, setFailKey] = useState(0);
  if (!src) return <div className={className} />;
  return (
    <img
      key={src + failKey}
      src={src}
      alt=""
      className={className}
      onError={() => setFailKey(k => k + 1)}
    />
  );
}

function Selector({ label, items, currentIdx, onPrev, onNext }: {
  label: string;
  items: { url: string; label: string }[];
  currentIdx: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const current = items[currentIdx];
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <span className="font-hand text-sm text-gray-400 w-20 shrink-0">{label}</span>
      <div className="flex items-center gap-2 flex-1 justify-between">
        <button onClick={onPrev} className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 transition-colors text-lg bg-gray-50 border border-gray-200">‹</button>
        {current && (
          <div className="flex items-center gap-2 flex-1 justify-center">
            {current.url && <SafeImg src={current.url} className="w-8 h-8 object-contain shrink-0" />}
            <span className="font-hand text-base text-gray-800 font-medium">{current.label}</span>
          </div>
        )}
        <button onClick={onNext} className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 transition-colors text-lg bg-gray-50 border border-gray-200">›</button>
      </div>
    </div>
  );
}

function InkPreview({ lines, className }: { lines: LineData[]; className?: string }) {
  const uid = useId();
  if (!lines || lines.length === 0) {
    return <p className="font-hand text-xs text-gray-500">vacío</p>;
  }
  const xs = lines.flatMap(l => l.points.filter((_, i) => i % 2 === 0));
  const ys = lines.flatMap(l => l.points.filter((_, i) => i % 2 === 1));
  if (xs.length === 0) return <p className="font-hand text-xs text-gray-500">vacío</p>;

  const penLines = lines.filter(l => !l.tool || l.tool === "pen");
  const eraserLines = lines.filter(l => l.tool === "eraser");
  const maskId = `pm-${uid}`;

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const w = maxX - minX || 1;
  const h = maxY - minY || 1;
  const pad = 20;

  return (
    <svg viewBox={`${minX - pad} ${minY - pad} ${w + pad * 2} ${h + pad * 2}`} className={className ?? "w-full h-full"}>
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
  );
}

function BlotBadge({ blot }: { blot?: Drawing["blot"] }) {
  if (!blot) return null;
  if (blot.imageUrl) {
    return (
      <div className="absolute top-1 right-1 w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-sm">
        <img src={blot.imageUrl} alt="" className="w-full h-full object-cover" />
      </div>
    );
  }
  if (blot.mainBlot && blot.mainBlot.length > 0) {
    const b = computeBounds(blot.mainBlot);
    const path = blot.mainBlot.reduce((acc, p, i, arr) => {
      if (i % 2 === 1) {
        return i === 1 ? `M ${arr[i - 1]} ${arr[i]}` : `${acc} L ${arr[i - 1]} ${arr[i]}`;
      }
      return acc;
    }, "");
    const pad = 4;
    return (
      <div className="absolute top-1 right-1 w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white">
        <svg viewBox={`${b.minX - pad} ${b.minY - pad} ${b.w + pad * 2} ${b.h + pad * 2}`} className="w-full h-full">
          <path d={`${path} Z`} fill="black" />
        </svg>
      </div>
    );
  }
  return null;
}

function ViewModal({ drawing, onClose, currentUser, onDrawingDeleted }: {
  drawing: Drawing;
  onClose: () => void;
  currentUser: { id: string; name: string } | null;
  onDrawingDeleted: (drawingId: string) => void;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(drawing.likesCount);
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div
        className="bg-[#FFFDF7] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200"
        style={{ borderRadius: "24px 28px 20px 26px" }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="font-hand text-sm text-gray-500">
            {new Date(drawing.createdAt).toLocaleDateString("es-ES")}
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
          <div className="w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
            <InkPreview lines={drawing.lines} className="w-full h-full" />
            <BlotBadge blot={drawing.blot} />
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

const BIO_DEFAULT = "dibujante de manchas. veo cosas raras.\na veces un pato, a veces una nube.";

export default function Perfil() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("plop_token")) router.replace("/");
  }, [router]);

  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [headIdx,  setHeadIdx]  = useState(0);
  const [eyesIdx,  setEyesIdx]  = useState(0);
  const [mouthIdx, setMouthIdx] = useState(0);
  const [accIdx,   setAccIdx]   = useState(0);

  const [savedHeadIdx,  setSavedHeadIdx]  = useState(0);
  const [savedEyesIdx,  setSavedEyesIdx]  = useState(0);
  const [savedMouthIdx, setSavedMouthIdx] = useState(0);
  const [savedAccIdx,   setSavedAccIdx]   = useState(0);

  const [nombre,     setNombre]     = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [totalLikes,  setTotalLikes]  = useState<number>(0);
  const [bio,        setBio]        = useState(BIO_DEFAULT);
  const [editingBio, setEditingBio] = useState(false);
  const [userDrawings, setUserDrawings] = useState<Drawing[]>([]);
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const user = useMemo(() => getUser(), []);

  const heads    = catalog.filter(i => i.type === "head");
  const eyesList = catalog.filter(i => i.type === "eyes");
  const mouths   = catalog.filter(i => i.type === "mouth");
  const accs     = [{ type: "acc" as const, label: "nada", url: "" }, ...catalog.filter(i => i.type === "acc")];

  const headUrl      = heads[headIdx]?.url ?? "";
  const eyesUrl      = eyesList[eyesIdx]?.url ?? "";
  const mouthUrl     = mouths[mouthIdx]?.url ?? "";
  const accessoryUrl = accs[accIdx]?.url ?? "";

  const hasChanges =
    headIdx  !== savedHeadIdx  ||
    eyesIdx  !== savedEyesIdx  ||
    mouthIdx !== savedMouthIdx ||
    accIdx   !== savedAccIdx;

  useEffect(() => {
    if (!user) return;

    Promise.all([
      apiFetch<{ items: CatalogItem[] }>("/avatar-catalog"),
      apiFetch<{ name: string; bio: string; avatarConfig?: AvatarConfig; createdAt?: string; totalLikes?: number }>("/auth/me"),
    ]).then(([cat, me]) => {
      setCatalog(cat.items);
      setNombre(me.name);
      if (me.bio) setBio(me.bio);
      if (me.createdAt) {
        setMemberSince(new Date(me.createdAt).toLocaleDateString("es-MX", { month: "long", year: "numeric" }));
      }
      if (me.totalLikes !== undefined) setTotalLikes(me.totalLikes);
      if (me.avatarConfig) {
        const { headUrl, eyesUrl, mouthUrl, accessoryUrl } = me.avatarConfig;
        const h = cat.items.filter(i => i.type === "head");
        const e = cat.items.filter(i => i.type === "eyes");
        const m = cat.items.filter(i => i.type === "mouth");
        const a = [{ type: "acc" as const, label: "nada", url: "" }, ...cat.items.filter(i => i.type === "acc")];

        const hi = h.findIndex(i => i.url === headUrl);
        if (hi >= 0) { setHeadIdx(hi); setSavedHeadIdx(hi); }
        const ei = e.findIndex(i => i.url === eyesUrl);
        if (ei >= 0) { setEyesIdx(ei); setSavedEyesIdx(ei); }
        const mi = m.findIndex(i => i.url === mouthUrl);
        if (mi >= 0) { setMouthIdx(mi); setSavedMouthIdx(mi); }
        const ai = a.findIndex(i => i.url === accessoryUrl);
        if (ai >= 0) { setAccIdx(ai); setSavedAccIdx(ai); }
      }
    }).catch(() => {});

    apiFetch<Drawing[]>(`/drawings/user/${user.id}`)
      .then(setUserDrawings)
      .catch(() => {});

  }, [user]);

  useEffect(() => {
    if (editingBio) textareaRef.current?.focus();
  }, [editingBio]);

  async function saveAvatar() {
    setSavedHeadIdx(headIdx);
    setSavedEyesIdx(eyesIdx);
    setSavedMouthIdx(mouthIdx);
    setSavedAccIdx(accIdx);
    try {
      await apiFetch("/profile/avatar", {
        method: "PUT",
        body: {
          headUrl: heads[headIdx]?.url ?? "",
          eyesUrl: eyesList[eyesIdx]?.url ?? "",
          mouthUrl: mouths[mouthIdx]?.url ?? "",
          accessoryUrl: accs[accIdx]?.url ?? "",
        },
      });
    } catch {}
  }

  function cancelAvatar() {
    setHeadIdx(savedHeadIdx);
    setEyesIdx(savedEyesIdx);
    setMouthIdx(savedMouthIdx);
    setAccIdx(savedAccIdx);
  }

  async function saveBio() {
    const trimmed = bio.trim() || BIO_DEFAULT;
    setBio(trimmed);
    setEditingBio(false);
    try {
      await apiFetch("/profile", {
        method: "PUT",
        body: { bio: trimmed },
      });
    } catch {}
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7]">

      {/* Decoración de fondo */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse,#fde68a 0%,transparent 70%)", filter: "blur(80px)" }}/>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: "radial-gradient(ellipse,#ddd6fe 0%,transparent 70%)", filter: "blur(80px)" }}/>
      </div>

      <NavBar />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-16 lg:px-24 py-10 space-y-6">

        {/* ── FILA 1a: Bio card ── */}
        <div className="w-full rounded-3xl p-7 md:p-9 bg-white"
          style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">

            {/* Izquierda: badge + nombre + fecha */}
            <div className="shrink-0">
              <span className="inline-block font-hand text-xs text-indigo-500 px-3 py-1 rounded-full mb-4"
                style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)" }}>
                ✦ artista plop
              </span>
              <h1 className="font-display text-4xl md:text-6xl text-gray-900 leading-tight mb-1">{nombre}</h1>
              <p className="font-hand text-sm text-gray-400">
                {memberSince ? `miembro desde ${memberSince}` : "artista de manchas"}
              </p>
            </div>

            {/* Separador vertical */}
            <div className="hidden md:block w-px self-stretch bg-gray-100" />

            {/* Derecha: bio editable */}
            <div className="flex-1">
              {editingBio ? (
                <div className="space-y-2">
                  <textarea
                    ref={textareaRef}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && e.metaKey) saveBio(); }}
                    rows={2}
                    className="w-full font-hand text-base text-gray-700 leading-relaxed resize-none outline-none rounded-xl p-3"
                    style={{ background: "#FFFDF7", border: "1.5px solid rgba(99,102,241,0.35)" }}
                  />
                  <div className="flex items-center gap-2">
                    <button onClick={saveBio}
                      className="font-hand text-sm text-white px-4 py-1.5 rounded-xl hover:opacity-90 transition-opacity"
                      style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
                      guardar
                    </button>
                    <button onClick={() => setEditingBio(false)}
                      className="font-hand text-sm text-gray-400 hover:text-gray-600 transition-colors">
                      cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setEditingBio(true)}
                  className="group text-left rounded-xl px-3 py-2 -ml-3 transition-all hover:bg-gray-50 w-full">
                  <p className="font-hand text-lg text-gray-600 leading-relaxed whitespace-pre-line">{bio}</p>
                  <span className="text-sm opacity-0 group-hover:opacity-40 transition-opacity mt-1 block">✏️</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── FILA 1b: Stats en 3 cards ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: userDrawings.length, label: "dibujos", style: { color: "#059669" } },
            { value: totalLikes || "—", label: "likes recibidos", style: { background: "linear-gradient(135deg,#4f46e5,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } },
            { value: userDrawings.length > 0 ? "✓" : "—", label: "mancha de hoy", style: { color: "#f59e0b" } },
          ].map(({ value, label, style }) => (
            <div key={label} className="text-center rounded-3xl py-6 bg-white"
              style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              <p className="font-display text-5xl" style={style}>{value}</p>
              <p className="font-hand text-sm text-gray-400 mt-2">{label}</p>
            </div>
          ))}
        </div>

        {/* ── FILA 2: Avatar | Menú ── */}
        <div className="flex flex-col sm:flex-row gap-6">

          {/* Avatar preview */}
          <div className="flex items-center justify-center rounded-3xl p-6 bg-white shrink-0"
            style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <div className="relative" style={{ width: 220, height: 220 }}>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-6 opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(ellipse,#6366f1 0%,transparent 70%)", filter: "blur(8px)" }}/>
              {headUrl && <SafeImg src={headUrl} className="absolute inset-0 w-full h-full object-contain pointer-events-none" />}
              {eyesUrl && <SafeImg src={eyesUrl} className="absolute inset-0 w-full h-full object-contain pointer-events-none" />}
              {mouthUrl && <SafeImg src={mouthUrl} className="absolute inset-0 w-full h-full object-contain pointer-events-none" />}
              {accessoryUrl && <SafeImg src={accessoryUrl} className="absolute inset-0 w-full h-full object-contain pointer-events-none" />}
            </div>
          </div>

          {/* Panel personalización */}
          <div className="flex-1 rounded-3xl p-6 bg-white flex flex-col"
            style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
            <p className="font-hand text-xs text-gray-400 uppercase tracking-widest mb-4">personaliza tu avatar</p>

            <div className="flex-1">
              {heads.length > 0 ? (
                <>
                  <Selector label="cara" items={heads} currentIdx={headIdx}
                    onPrev={() => setHeadIdx(i => (i - 1 + heads.length) % heads.length)}
                    onNext={() => setHeadIdx(i => (i + 1) % heads.length)} />
                  <Selector label="ojos" items={eyesList} currentIdx={eyesIdx}
                    onPrev={() => setEyesIdx(i => (i - 1 + eyesList.length) % eyesList.length)}
                    onNext={() => setEyesIdx(i => (i + 1) % eyesList.length)} />
                  <Selector label="boca" items={mouths} currentIdx={mouthIdx}
                    onPrev={() => setMouthIdx(i => (i - 1 + mouths.length) % mouths.length)}
                    onNext={() => setMouthIdx(i => (i + 1) % mouths.length)} />
                  <Selector label="accesorio" items={accs} currentIdx={accIdx}
                    onPrev={() => setAccIdx(i => (i - 1 + accs.length) % accs.length)}
                    onNext={() => setAccIdx(i => (i + 1) % accs.length)} />
                </>
              ) : (
                <p className="font-hand text-sm text-gray-400 py-8 text-center">cargando...</p>
              )}
            </div>

            {/* Botones guardar / cancelar — solo si hay cambios */}
            <div className={`mt-5 pt-4 border-t border-gray-100 flex items-center gap-3 transition-all duration-200 ${hasChanges ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
              <button onClick={saveAvatar}
                className="font-hand text-base text-white px-6 py-2.5 rounded-2xl transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", boxShadow: "0 4px 16px rgba(79,70,229,0.35)" }}>
                guardar cambios
              </button>
              <button onClick={cancelAvatar}
                className="font-hand text-base text-gray-400 hover:text-gray-700 transition-colors px-3 py-2.5">
                cancelar
              </button>
              <span className="font-hand text-xs text-indigo-400/60 ml-auto">cambios sin guardar</span>
            </div>
          </div>
        </div>

        {/* ── FILA 3: Mis dibujos ── */}
        <div>
          <div className="flex items-baseline gap-3 mb-6">
            <h2 className="font-display text-3xl md:text-4xl text-gray-900">mis dibujos</h2>
            <span className="font-hand text-base text-gray-400">{userDrawings.length} mancha{userDrawings.length !== 1 ? "s" : ""}</span>
          </div>
          {userDrawings.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {userDrawings.map((d) => (
                <div key={d.id}
                  onClick={() => setSelectedDrawing(d)}
                  className="relative flex flex-col items-center justify-center bg-white rounded-2xl p-4 transition-all duration-200 hover:scale-[1.03] cursor-pointer"
                  style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                  <div className="w-full h-28 pointer-events-none relative">
                    <InkPreview lines={d.lines} />
                    <BlotBadge blot={d.blot} />
                  </div>
                  <span className="font-hand text-sm mt-2 text-gray-500">
                    {new Date(d.createdAt).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-hand text-base text-gray-400 py-10 text-center">todavía no has creado ningún dibujo</p>
          )}
        </div>

        {/* ── FILA 4: Logros ── */}
        <div>
          <div className="flex items-baseline gap-3 mb-6">
            <h2 className="font-display text-3xl md:text-4xl text-gray-900">✦ logros</h2>
            <span className="font-hand text-base text-gray-400">pronto...</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl p-5 bg-white/60"
                style={{ border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}
              >
                <span className="text-3xl opacity-20">🏆</span>
                <span className="font-hand text-xs text-gray-300">???</span>
              </div>
            ))}
          </div>
          <p className="font-hand text-sm text-gray-300 mt-4 text-center">
            pronto habrá logros por aquí...
          </p>
        </div>

      </div>

      {selectedDrawing && (
        <ViewModal
          drawing={selectedDrawing}
          onClose={() => setSelectedDrawing(null)}
          currentUser={user}
          onDrawingDeleted={(id) => setUserDrawings(prev => prev.filter(d => d.id !== id))}
        />
      )}
    </div>
  );
}
