export const blotPoints = [
  200, 30,
  230, 32,
  255, 40,
  275, 55,
  290, 72,
  300, 92,
  305, 115,
  306, 135,
  302, 155,
  295, 172,
  285, 188,
  275, 205,
  265, 220,
  255, 235,
  245, 248,
  232, 258,
  218, 265,
  205, 270,
  195, 272,
  185, 270,
  170, 265,
  155, 255,
  140, 242,
  128, 225,
  120, 210,
  115, 195,
  108, 178,
  100, 160,
  95, 142,
  92, 125,
  88, 108,
  82, 92,
  72, 78,
  65, 68,
  58, 60,
  50, 55,
  42, 52,
  35, 50,
  28, 48,
  20, 48,
  15, 52,
  10, 58,
  7, 65,
  5, 75,
  6, 85,
  10, 95,
  18, 102,
  28, 106,
  38, 108,
  48, 108,
  58, 105,
  68, 100,
  78, 95,
  90, 92,
  102, 90,
  115, 88,
  130, 82,
  145, 75,
  160, 65,
  175, 55,
  190, 44,
  200, 35,
];

export const satelliteBlots = [
  { x: 340, y: 80, r: 18 },
  { x: 355, y: 60, r: 8 },
  { x: 320, y: 160, r: 12 },
  { x: 40, y: 180, r: 15 },
  { x: 25, y: 200, r: 7 },
  { x: 150, y: 290, r: 10 },
  { x: 120, y: 300, r: 6 },
];

export function InkBlotSVG({ className }: { className?: string }) {
  const pointsStr = blotPoints.map((p, i) => (i % 2 === 0 ? `${p},` : `${p}`)).join(" ").replace(/, /g, ",");

  const pathData = blotPoints.reduce((acc, p, i, arr) => {
    if (i % 2 === 1) {
      const x = arr[i - 1];
      const y = arr[i];
      if (i === 1) return `M ${x} ${y}`;
      return `${acc} L ${x} ${y}`;
    }
    return acc;
  }, "");

  return (
    <svg viewBox="0 0 400 340" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={`${pathData} Z`} fill="black" opacity="1" />
      {satelliteBlots.map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r={b.r} fill="black" />
      ))}
    </svg>
  );
}

export function generateBlotStageData(width: number, height: number) {
  const scaleX = width / 400;
  const scaleY = height / 340;
  const s = Math.min(scaleX, scaleY) * 0.6;
  const cx = width / 2 - (200 * s);
  const cy = height / 2 - (150 * s);

  const scaled = blotPoints.map((p, i) => (i % 2 === 0 ? p * s + cx : p * s + cy));
  const satellites = satelliteBlots.map((b) => ({
    x: b.x * s + cx,
    y: b.y * s + cy,
    r: b.r * s,
  }));

  return { mainBlot: scaled, satellites };
}
