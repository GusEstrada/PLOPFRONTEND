"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Stage, Layer, Line, Circle, Group } from "react-konva";
import { blotPoints, satelliteBlots, generateBlotStageData } from "./inkblot";
import type { KonvaEventObject } from "konva/lib/Node";

interface LineData {
  id: number;
  points: number[];
  color: string;
  size: number;
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
}: {
  width: number;
  height: number;
  toolColor: string;
  toolSize: number;
  undoRef: React.MutableRefObject<(() => void) | null>;
  clearRef: React.MutableRefObject<(() => void) | null>;
}) {
  const [lines, setLines] = useState<LineData[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const isDrawing = useRef(false);
  const lineIdRef = useRef(0);
  const particleIdRef = useRef(0);
  const clickCountRef = useRef(0);
  const lastParticleTime = useRef(0);
  const stageRef = useRef<any>(null);

  const blot = generateBlotStageData(width, height);

  const addParticles = useCallback((x: number, y: number, count: number) => {
    const now = Date.now();
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

  // particle update loop
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

  // undo / clear refs
  useEffect(() => {
    undoRef.current = () => {
      setLines((prev) => prev.slice(0, -1));
    };
    clearRef.current = () => {
      setLines([]);
      setParticles([]);
    };
  }, [undoRef, clearRef]);

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
      {/* Ink blot layer */}
      <Layer>
        <Group x={0} y={0}>
          <Line
            points={blot.mainBlot}
            closed
            tension={0.4}
            fill="rgba(0,0,0,0.12)"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth={1}
          />
          {blot.satellites.map((s, i) => (
            <Circle key={i} x={s.x} y={s.y} radius={s.r} fill="rgba(0,0,0,0.12)" />
          ))}
        </Group>
      </Layer>

      {/* Drawing layer */}
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

      {/* Particles layer */}
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
