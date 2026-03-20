import { useState, useCallback, useEffect } from 'react';
import SpinningWheel from '@/components/SpinningWheel';
import ResultModal from '@/components/ResultModal';
import SpinCounter from '@/components/SpinCounter';
import NameEntry from '@/components/NameEntry';
import { AdminButton } from '@/components/AdminPanel';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo.jpg';

export default function Index() {
  const [username, setUsername] = useState<string | null>(() => {
    return localStorage.getItem('username');
  });
  const [result, setResult] = useState<number | null>(null);
  const [spinCount, setSpinCount] = useState(0);

  // Load global spin count on mount + realtime
  useEffect(() => {
    const fetchCount = async () => {
      const { data } = await supabase
        .from('spin_stats')
        .select('total_spins')
        .eq('id', 'global')
        .single();
      if (data) setSpinCount(data.total_spins);
    };
    fetchCount();

    const channel = supabase
      .channel('spin_stats_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'spin_stats' }, (payload) => {
        setSpinCount((payload.new as { total_spins: number }).total_spins);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleResult = useCallback(async (value: number) => {
    setResult(value);
    const name = localStorage.getItem('username') || 'Unknown';

    // Insert spin record to database
    await supabase.from('spins').insert({ name, amount: value });

    // Increment global counter
    await supabase.rpc('increment_spin_count');
  }, []);

  if (!username) {
    return <NameEntry onSubmit={(name) => setUsername(name)} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-eid-purple/8 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-eid-blue/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-eid-gold/5 blur-3xl" />
      </div>

      {/* Admin */}
      <AdminButton />

      {/* Header */}
      <header className="pt-6 pb-2 text-center flex flex-col items-center">
        <img src={logo} alt="ঈদ সালামি" className="w-24 h-24 md:w-32 md:h-32 rounded-2xl shadow-lg mb-3 object-cover" />
        <h1 className="text-4xl md:text-5xl font-black text-glow text-primary tracking-tight">
          EidSalami.com
        </h1>
        <p className="text-muted-foreground text-sm mt-2">🌙 ঈদ মোবারক — Spin & Win! 🌙</p>
      </header>

      {/* Username display */}
      <p className="text-sm text-muted-foreground mt-1 mb-2">
        খেলছেন — <span className="text-primary font-semibold">{username}</span>
      </p>

      {/* Wheel */}
      <main className="flex-1 flex items-center justify-center py-4">
        <SpinningWheel onResult={handleResult} />
      </main>

      {/* Counter */}
      <SpinCounter count={spinCount} />

      {/* Result Modal */}
      {result !== null && (
        <ResultModal amount={result} username={username} onClose={() => setResult(null)} />
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
