"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Stage, Layer, Line, Circle, Image as KonvaImage } from "react-konva";
import { generateBlotStageData, defaultBlotData } from "./inkblot";
import type { BlotData } from "./inkblot";
import type { KonvaEventObject } from "konva/lib/Node";

interface LineData {
  id: number;
  points: number[];
  color: string;
  size: number;
}

export interface ImageTransform {
  offsetX: number;
  offsetY: number;
  scale: number;
  imgW: number;
  imgH: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

export default function KonvaCanvas({
  width,
  height,
  toolColor,
  toolSize,
  undoRef,
  clearRef,
  blot,
  linesRef,
  imageUrl,
  imageTransformRef,
}: {
  width: number;
  height: number;
  toolColor: string;
  toolSize: number;
  undoRef: React.MutableRefObject<(() => void) | null>;
  clearRef: React.MutableRefObject<(() => void) | null>;
  blot?: BlotData;
  linesRef?: React.MutableRefObject<LineData[]>;
  imageUrl?: string;
  imageTransformRef?: React.MutableRefObject<ImageTransform>;
}) {
  const [lines, setLines] = useState<LineData[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const isDrawing = useRef(false);
  const lineIdRef = useRef(0);
  const particleIdRef = useRef(0);
  const clickCountRef = useRef(0);
  const lastParticleTime = useRef(0);
  const stageRef = useRef<any>(null);

  useEffect(() => {
    if (!imageUrl) { setBgImage(null); return; }
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => setBgImage(img);
    img.onerror = () => setBgImage(null);
  }, [imageUrl]);

  const imageTransform = useMemo(() => {
    if (!bgImage) return { offsetX: 0, offsetY: 0, scale: 1, imgW: width, imgH: height };
    const s = Math.min(width / bgImage.naturalWidth, height / bgImage.naturalHeight);
    return {
      scale: s,
      offsetX: (width - bgImage.naturalWidth * s) / 2,
      offsetY: (height - bgImage.naturalHeight * s) / 2,
      imgW: bgImage.naturalWidth * s,
      imgH: bgImage.naturalHeight * s,
    };
  }, [bgImage, width, height]);

  useEffect(() => {
    if (imageTransformRef) imageTransformRef.current = imageTransform;
  }, [imageTransform, imageTransformRef]);

  const blotData = !imageUrl ? generateBlotStageData(width, height, blot || defaultBlotData) : { mainBlot: [], satellites: [] };

  const addParticles = useCallback((x: number, y: number, count: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: particleIdRef.current++,
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        size: 1.5 + Math.random() * 4,
        opacity: 0.6 + Math.random() * 0.4,
        color: Math.random() > 0.5 ? "#000000" : "#2563EB",
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  }, []);

  const splatter = useCallback((x: number, y: number) => {
    const newParticles: Particle[] = [];
    const count = 6 + Math.floor(Math.random() * 8);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 1 + Math.random() * 4;
      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 5,
        opacity: 1,
        color: Math.random() > 0.4 ? "#000000" : "#2563EB",
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  }, []);

  const handleMouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
      isDrawing.current = true;
      clickCountRef.current += 1;
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;
      const id = lineIdRef.current++;
      const newLine: LineData = { id, points: [pos.x, pos.y], color: toolColor, size: toolSize };
      setLines((prev) => [...prev, newLine]);

      if (clickCountRef.current % 5 === 0) {
        splatter(pos.x, pos.y);
      }
    },
    [toolColor, toolSize, splatter]
  );

  const handleMouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (!isDrawing.current) return;
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;
      setLines((prev) => {
        const last = prev[prev.length - 1];
        if (!last) return prev;
        const updated = { ...last, points: [...last.points, pos.x, pos.y] };
        return [...prev.slice(0, -1), updated];
      });

      const now = Date.now();
      if (now - lastParticleTime.current > 80) {
        lastParticleTime.current = now;
        addParticles(pos.x, pos.y, 1);
      }
    },
    [addParticles]
  );

  const handleMouseUp = useCallback(() => {
    isDrawing.current = false;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            opacity: p.opacity - 0.015,
            vx: p.vx * 0.96,
            vy: p.vy * 0.96,
          }))
          .filter((p) => p.opacity > 0)
      );
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    undoRef.current = () => {
      setLines((prev) => prev.slice(0, -1));
    };
    clearRef.current = () => {
      setLines([]);
      setParticles([]);
    };
  }, [undoRef, clearRef]);

  useEffect(() => {
    if (linesRef) linesRef.current = lines;
  }, [lines, linesRef]);

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
      style={{ background: "#FAFAFA", cursor: "crosshair" }}
    >
      <Layer>
        {bgImage ? (
          <KonvaImage image={bgImage} x={imageTransform.offsetX} y={imageTransform.offsetY}
            width={imageTransform.imgW} height={imageTransform.imgH} />
        ) : (
          <>
            <Line
              points={blotData.mainBlot}
              closed
              tension={0.4}
              fill="rgba(0,0,0,0.12)"
              stroke="rgba(0,0,0,0.15)"
              strokeWidth={1}
            />
            {blotData.satellites.map((s, i) => (
              <Circle key={i} x={s.x} y={s.y} radius={s.r} fill="rgba(0,0,0,0.12)" />
            ))}
          </>
        )}
      </Layer>

      <Layer>
        {lines.map((line) => (
          <Line
            key={line.id}
            points={line.points}
            stroke={line.color}
            strokeWidth={line.size}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
            globalCompositeOperation="source-over"
          />
        ))}
      </Layer>

      <Layer>
        {particles.map((p) => (
          <Circle
            key={p.id}
            x={p.x}
            y={p.y}
            radius={p.size}
            fill={p.color}
            opacity={p.opacity}
          />
        ))}
      </Layer>
    </Stage>
  );
}
