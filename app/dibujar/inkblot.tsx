export interface BlotData {
  mainBlot: number[];
  satellites: { x: number; y: number; r: number }[];
}

const hardcodedPoints = [
  200, 30, 230, 32, 255, 40, 275, 55, 290, 72, 300, 92, 305, 115,
  306, 135, 302, 155, 295, 172, 285, 188, 275, 205, 265, 220, 255, 235,
  245, 248, 232, 258, 218, 265, 205, 270, 195, 272, 185, 270, 170, 265,
  155, 255, 140, 242, 128, 225, 120, 210, 115, 195, 108, 178, 100, 160,
  95, 142, 92, 125, 88, 108, 82, 92, 72, 78, 65, 68, 58, 60, 50, 55,
  42, 52, 35, 50, 28, 48, 20, 48, 15, 52, 10, 58, 7, 65, 5, 75, 6, 85,
  10, 95, 18, 102, 28, 106, 38, 108, 48, 108, 58, 105, 68, 100, 78, 95,
  90, 92, 102, 90, 115, 88, 130, 82, 145, 75, 160, 65, 175, 55, 190, 44,
  200, 35,
];

const hardcodedSatellites = [
  { x: 340, y: 80, r: 18 }, { x: 355, y: 60, r: 8 },
  { x: 320, y: 160, r: 12 }, { x: 40, y: 180, r: 15 },
  { x: 25, y: 200, r: 7 }, { x: 150, y: 290, r: 10 },
  { x: 120, y: 300, r: 6 },
];

export const defaultBlotData: BlotData = {
  mainBlot: hardcodedPoints,
  satellites: hardcodedSatellites,
};

export function computeBounds(mainBlot: number[]) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < mainBlot.length; i += 2) {
    const x = mainBlot[i], y = mainBlot[i + 1];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY };
}

export function generateBlotStageData(width: number, height: number, blot?: BlotData) {
  const data = blot || defaultBlotData;
  if (data.mainBlot.length < 4) return { mainBlot: [], satellites: [] };

  const bounds = computeBounds(data.mainBlot);
  const s = Math.min(width / bounds.w, height / bounds.h) * 0.6;
  const cx = width / 2 - ((bounds.minX + bounds.maxX) / 2) * s;
  const cy = height / 2 - ((bounds.minY + bounds.maxY) / 2) * s;

  const scaled = data.mainBlot.map((p, i) => (i % 2 === 0 ? p * s + cx : p * s + cy));
  const satellites = data.satellites.map((b) => ({
    x: b.x * s + cx,
    y: b.y * s + cy,
    r: b.r * s,
  }));

  return { mainBlot: scaled, satellites };
}

export function InkBlotSVG({ className, blot }: { className?: string; blot?: BlotData }) {
  const data = blot || defaultBlotData;

  const bounds = computeBounds(data.mainBlot);
  const pad = 60;
  const viewBox = `${bounds.minX - pad} ${bounds.minY - pad} ${bounds.w + pad * 2} ${bounds.h + pad * 2}`;

  const pathData = data.mainBlot.reduce((acc, p, i, arr) => {
    if (i % 2 === 1) {
      const x = arr[i - 1];
      const y = arr[i];
      return i === 1 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }
    return acc;
  }, "");

  return (
    <svg viewBox={viewBox} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={`${pathData} Z`} fill="black" opacity="1" />
      {data.satellites.map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r={b.r} fill="black" />
      ))}
    </svg>
  );
}
