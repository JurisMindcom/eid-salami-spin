import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type SpinRecord = {
  id: string;
  name: string;
  amount: number;
  created_at: string;
};

const ADMIN_PASSWORD = '77889';
const LOCAL_KEYS_TO_CLEAR = ['username', 'spinHistory', 'eidSpinCount', 'eidLastSpin'] as const;

export function AdminButton() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [history, setHistory] = useState<SpinRecord[]>([]);
  const [loadError, setLoadError] = useState('');

  const clearStoredAppData = () => {
    LOCAL_KEYS_TO_CLEAR.forEach((key) => localStorage.removeItem(key));
  };

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    setLoadError('');

    const { data, error } = await supabase
      .from('spins')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) {
      setLoadError('Failed to load spin history.');
      setHistory([]);
      setIsLoadingHistory(false);
      return;
    }

    setHistory(data ?? []);
    setIsLoadingHistory(false);
  };

  const handleResetAll = async () => {
    const confirmed = window.confirm('⚠️ Are you sure? This will delete all spin history, reset the total spins to 0, and clear saved app data everywhere.');
    if (!confirmed) return;

    setIsResetting(true);
    setLoadError('');

    const { error } = await supabase.rpc('reset_all_spins');

    if (error) {
      setLoadError('Failed to clear data. Please try again.');
      setIsResetting(false);
      return;
    }

    clearStoredAppData();
    setHistory([]);
    setIsAdminOpen(false);
    setShowPrompt(false);
    setPassword('');
    setIsResetting(false);
    window.location.reload();
  };

  const handleSubmit = async () => {
    if (password !== ADMIN_PASSWORD) {
      setError(true);
      setTimeout(() => setError(false), 1500);
      return;
    }

    setPassword('');
    setShowPrompt(false);
    setIsAdminOpen(true);
    await loadHistory();
  };

  const handleClose = () => {
    setShowPrompt(false);
    setIsAdminOpen(false);
    setPassword('');
    setLoadError('');
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-3">
      {!showPrompt && !isAdminOpen ? (
        <button
          onClick={() => setShowPrompt(true)}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-muted/60 border border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          Admin
        </button>
      ) : null}

      {showPrompt ? (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-card/90 backdrop-blur border border-border shadow-lg">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void handleSubmit()}
            placeholder="Password"
            className={`w-28 px-3 py-1.5 text-sm rounded-lg bg-muted border ${error ? 'border-destructive' : 'border-border'} text-foreground focus:outline-none`}
            autoFocus
          />
          <button onClick={() => void handleSubmit()} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-primary text-primary-foreground">
            Go
          </button>
          <button onClick={handleClose} className="px-2 py-1.5 text-xs text-muted-foreground">
            ✕
          </button>
        </div>
      ) : null}

      {isAdminOpen ? (
        <div className="w-[min(92vw,420px)] rounded-2xl border border-border bg-card/95 backdrop-blur shadow-lg overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <h2 className="text-sm font-bold text-foreground">🌙 Admin Panel</h2>
              <p className="text-xs text-muted-foreground">Spin history and full reset</p>
            </div>
            <button onClick={handleClose} className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
              ✕
            </button>
          </div>

          <div className="p-4 space-y-3">
            <p className="text-xs text-muted-foreground">Total Records: {history.length}</p>

            <div className="max-h-80 overflow-auto rounded-xl border border-border bg-background/60">
              {isLoadingHistory ? (
                <div className="p-4 text-sm text-muted-foreground">Loading history...</div>
              ) : history.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground">No spins recorded yet.</div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                    <tr className="text-muted-foreground">
                      <th className="px-3 py-2 font-medium">#</th>
                      <th className="px-3 py-2 font-medium">Name</th>
                      <th className="px-3 py-2 font-medium">Amount</th>
                      <th className="px-3 py-2 font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record, index) => (
                      <tr key={record.id} className="border-t border-border/70 text-foreground">
                        <td className="px-3 py-2">{index + 1}</td>
                        <td className="px-3 py-2">{record.name}</td>
                        <td className="px-3 py-2">৳{record.amount.toLocaleString()}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{new Date(record.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {loadError ? <p className="text-xs text-destructive">{loadError}</p> : null}

            <button
              onClick={() => void handleResetAll()}
              disabled={isResetting}
              className="w-full rounded-xl bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isResetting ? 'Resetting...' : '🗑️ Delete All Data & Reset'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
