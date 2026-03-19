import { useRef, useState, useCallback, useEffect } from 'react';
import { segments, getWeightedRandomIndex } from '@/lib/wheelConfig';
import { playTickSound, playWinSound } from '@/lib/sounds';

interface Props {
  onResult: (value: number) => void;
}

const SEGMENT_COUNT = segments.length;
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT;

export default function SpinningWheel({ onResult }: Props) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const tickRef = useRef<number | null>(null);
  const lastTickAngle = useRef(0);

  const spin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);

    const winIndex = getWeightedRandomIndex();
    // Calculate target: land on the middle of the winning segment
    // The pointer is at the top (0°/360°). Segment 0 starts at 0°.
    // We need the winning segment's center to align with the top pointer.
    const segmentCenter = winIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const extraRotations = (3 + Math.random() * 3) * 360; // 3-6 full rotations
    const targetRotation = rotation + extraRotations + (360 - segmentCenter - (rotation % 360) + 360) % 360;

    const duration = 3000 + Math.random() * 2000;
    const startTime = performance.now();
    const startRotation = rotation;
    const totalDelta = targetRotation - startRotation;

    lastTickAngle.current = startRotation;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startRotation + totalDelta * eased;
      setRotation(current);

      // Tick sound every segment
      if (Math.abs(current - lastTickAngle.current) >= SEGMENT_ANGLE) {
        playTickSound();
        lastTickAngle.current = current;
      }

      if (progress < 1) {
        tickRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        playWinSound();
        onResult(segments[winIndex].value);
      }
    };

    tickRef.current = requestAnimationFrame(animate);
  }, [spinning, rotation, onResult]);

  useEffect(() => {
    return () => {
      if (tickRef.current) cancelAnimationFrame(tickRef.current);
    };
  }, []);

  const radius = 170;
  const cx = 200;
  const cy = 200;

  return (
    <div className="relative flex flex-col items-center gap-6">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
        <svg width="36" height="40" viewBox="0 0 36 40">
          <defs>
            <linearGradient id="pointerGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          <polygon points="18,40 4,0 32,0" fill="url(#pointerGrad)" stroke="#92400e" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Wheel */}
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-[-12px] rounded-full bg-gradient-to-br from-eid-blue via-eid-purple to-eid-blue opacity-60 blur-sm" />
        <div className="absolute inset-[-8px] rounded-full border-4 border-eid-gold/60" />

        <svg
          width="400"
          height="400"
          viewBox="0 0 400 400"
          className="relative z-10 drop-shadow-2xl max-w-[85vw] max-h-[85vw]"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <defs>
            <filter id="wheelShadow">
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#000" floodOpacity="0.4" />
            </filter>
            {segments.map((seg, i) => (
              <linearGradient key={`grad-${i}`} id={`segGrad${i}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={seg.color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={seg.color} stopOpacity="0.5" />
              </linearGradient>
            ))}
          </defs>

          {/* Outer ring */}
          <circle cx={cx} cy={cy} r={radius + 18} fill="none" stroke="url(#outerRing)" strokeWidth="8" />
          <defs>
            <linearGradient id="outerRing" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <circle cx={cx} cy={cy} r={radius + 12} fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.6" />

          {segments.map((seg, i) => {
            const startAngle = (i * SEGMENT_ANGLE - 90) * (Math.PI / 180);
            const endAngle = ((i + 1) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
            const x1 = cx + radius * Math.cos(startAngle);
            const y1 = cy + radius * Math.sin(startAngle);
            const x2 = cx + radius * Math.cos(endAngle);
            const y2 = cy + radius * Math.sin(endAngle);

            const midAngle = ((i + 0.5) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
            const textR = radius * 0.65;
            const tx = cx + textR * Math.cos(midAngle);
            const ty = cy + textR * Math.sin(midAngle);
            const textRotation = (i + 0.5) * SEGMENT_ANGLE;

            return (
              <g key={i}>
                <path
                  d={`M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} Z`}
                  fill={`url(#segGrad${i})`}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1"
                />
                <text
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontWeight="700"
                  fontSize={seg.value >= 1000 ? '13' : seg.value >= 100 ? '14' : '16'}
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                  transform={`rotate(${textRotation}, ${tx}, ${ty})`}
                >
                  {seg.label}
                </text>
              </g>
            );
          })}

          {/* Center hub */}
          <circle cx={cx} cy={cy} r="22" fill="url(#hubGrad)" stroke="#fbbf24" strokeWidth="2" />
          <defs>
            <radialGradient id="hubGrad">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r="8" fill="#fbbf24" opacity="0.8" />
        </svg>
      </div>

      {/* Spin Button */}
      <button
        onClick={spin}
        disabled={spinning}
        className={`
          mt-4 px-10 py-4 rounded-full text-lg font-bold uppercase tracking-wider
          bg-gradient-to-r from-eid-gold via-eid-gold-dark to-eid-gold
          text-primary-foreground
          transition-all duration-200
          ${spinning
            ? 'opacity-50 cursor-not-allowed scale-95'
            : 'hover:scale-105 hover:shadow-[0_0_30px_hsl(45_100%_60%/0.4)] active:scale-95'
          }
        `}
      >
        {spinning ? '🎡 Spinning...' : '✨ SPIN NOW ✨'}
      </button>
    </div>
  );
}
