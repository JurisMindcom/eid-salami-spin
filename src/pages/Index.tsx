import { useState, useEffect, useCallback } from 'react';
import SpinningWheel from '@/components/SpinningWheel';
import ResultModal from '@/components/ResultModal';
import SpinCounter from '@/components/SpinCounter';
import logo from '@/assets/logo.jpg';

export default function Index() {
  const [result, setResult] = useState<number | null>(null);
  const [spinCount, setSpinCount] = useState(() => {
    return parseInt(localStorage.getItem('eidSpinCount') || '0', 10);
  });
  const [lastSpinTime, setLastSpinTime] = useState<string | null>(() => {
    return localStorage.getItem('eidLastSpin');
  });

  const handleResult = useCallback((value: number) => {
    setResult(value);
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setSpinCount((c) => {
      const next = c + 1;
      localStorage.setItem('eidSpinCount', String(next));
      return next;
    });
    setLastSpinTime(now);
    localStorage.setItem('eidLastSpin', now);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-eid-purple/8 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-eid-blue/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-eid-gold/5 blur-3xl" />
      </div>

      {/* Header */}
      <header className="pt-6 pb-4 text-center flex flex-col items-center">
        <img src={logo} alt="ঈদ সালামি" className="w-24 h-24 md:w-32 md:h-32 rounded-2xl shadow-lg mb-3 object-cover" />
        <h1 className="text-4xl md:text-5xl font-black text-glow text-primary tracking-tight">
          EidSalami.com
        </h1>
        <p className="text-muted-foreground text-sm mt-2">🌙 ঈদ মোবারক — Spin & Win! 🌙</p>
      </header>

      {/* Wheel */}
      <main className="flex-1 flex items-center justify-center py-4">
        <SpinningWheel onResult={handleResult} />
      </main>

      {/* Counter */}
      <SpinCounter count={spinCount} lastTime={lastSpinTime} />

      {/* Result Modal */}
      {result !== null && (
        <ResultModal amount={result} onClose={() => setResult(null)} />
      )}

      {/* Footer */}
      <footer className="pb-6 text-center">
        <a
          href="https://www.facebook.com/share/1Lq4eRNpiL/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 text-xs font-semibold rounded-full bg-gradient-to-r from-eid-gold to-eid-blue text-primary-foreground hover:scale-105 transition-transform"
        >
          Made by Rony
        </a>
      </footer>
    </div>
  );
}
