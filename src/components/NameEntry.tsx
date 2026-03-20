import { useState } from 'react';
import logo from '@/assets/logo.jpg';

interface Props {
  onSubmit: (name: string) => void;
}

export default function NameEntry({ onSubmit }: Props) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem('username', trimmed);
    onSubmit(trimmed);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-eid-purple/8 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-eid-blue/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-eid-gold/5 blur-3xl" />
      </div>

      {/* Glassmorphism card */}
      <div className="relative w-[90vw] max-w-sm p-8 rounded-3xl border border-primary/30 bg-card/60 backdrop-blur-xl box-glow-gold text-center">
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-eid-purple/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-5">
          {/* Logo */}
          <img
            src={logo}
            alt="ঈদ সালামি"
            className="w-24 h-24 rounded-2xl shadow-lg object-cover"
          />

          {/* Crescent */}
          <span className="text-5xl" style={{ animation: 'float 3s ease-in-out infinite' }}>🌙</span>

          <h1 className="text-3xl md:text-4xl font-black text-glow text-primary tracking-tight">
            ঈদ মোবারক!
          </h1>
          <p className="text-muted-foreground text-sm">আপনার নাম লিখুন</p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার নাম..."
              className="w-full px-5 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              autoFocus
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-8 py-3 rounded-full font-bold text-lg bg-gradient-to-r from-primary via-eid-gold-dark to-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ✨ শুরু করুন
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
