import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface Props {
  amount: number;
  onClose: () => void;
}

export default function ResultModal({ amount, onClose }: Props) {
  useEffect(() => {
    const end = Date.now() + 2000;
    const fire = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#fbbf24', '#3b82f6', '#ec4899', '#8b5cf6'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#fbbf24', '#3b82f6', '#ec4899', '#8b5cf6'],
      });
      if (Date.now() < end) requestAnimationFrame(fire);
    };
    fire();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-card border border-border rounded-2xl p-8 max-w-sm w-[90vw] text-center shadow-2xl animate-in zoom-in-90 duration-300">
        {/* Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-eid-gold/10 via-transparent to-eid-purple/10" />

        <div className="relative z-10">
          <p className="text-3xl mb-2">🎉</p>
          <h2 className="text-xl font-bold text-foreground mb-1">অভিনন্দন!</h2>
          <p className="text-muted-foreground text-sm mb-4">আপনার ঈদ সালামি</p>

          <div className="text-5xl font-black text-glow text-primary my-4">
            ৳{amount.toLocaleString()}
          </div>
          <p className="text-muted-foreground text-sm mb-6">টাকা</p>

          <button
            onClick={onClose}
            className="px-8 py-3 rounded-full font-bold bg-gradient-to-r from-eid-blue to-eid-purple text-foreground hover:scale-105 transition-transform"
          >
            🔄 Spin Again
          </button>
        </div>
      </div>
    </div>
  );
}
