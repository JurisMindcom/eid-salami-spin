import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const ADMIN_PASSWORD = '77889';
const LOCAL_KEYS_TO_CLEAR = ['username', 'spinHistory', 'eidSpinCount', 'eidLastSpin'] as const;

type ResettableWindow = Window & typeof globalThis & {
  __eidResetAllData?: () => Promise<void>;
};

export function AdminButton() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleResetAll = async () => {
    const { error } = await supabase.rpc('reset_all_spins');
    if (error) {
      throw error;
    }

    LOCAL_KEYS_TO_CLEAR.forEach((key) => localStorage.removeItem(key));
  };

  const handleSubmit = async () => {
    if (password === ADMIN_PASSWORD) {
      const { data: history } = await supabase
        .from('spins')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      const records = history || [];
      const openerWindow = window as ResettableWindow;
      openerWindow.__eidResetAllData = handleResetAll;

      const win = window.open('', '_blank');
      if (!win) return;

      win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Admin Panel - Spin History</title>
          <style>
            body { font-family: 'Poppins', sans-serif; background: #111827; color: #fef3c7; padding: 24px; }
            h1 { text-align: center; color: #fbbf24; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 10px 16px; text-align: left; border-bottom: 1px solid #374151; }
            th { background: #1f2937; color: #fbbf24; font-weight: 700; }
            tr:hover { background: #1f2937; }
            .empty { text-align: center; padding: 40px; color: #6b7280; }
            .stats { text-align: center; margin-bottom: 20px; color: #9ca3af; }
            .reset-btn { display: block; margin: 20px auto 0; padding: 10px 24px; background: #dc2626; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 14px; }
            .reset-btn:hover { background: #b91c1c; }
            .reset-btn:disabled { opacity: 0.7; cursor: wait; }
          </style>
        </head>
        <body>
          <h1>🌙 Admin Panel - Spin History</h1>
          <p class="stats">Total Records: ${records.length}</p>
          ${records.length === 0 ? '<p class="empty">No spins recorded yet</p>' : `
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Amount</th><th>Time</th></tr></thead>
            <tbody>
              ${records.map((r: { name: string; amount: number; created_at: string }, i: number) => `<tr><td>${i + 1}</td><td>${r.name}</td><td>৳${r.amount.toLocaleString()}</td><td>${new Date(r.created_at).toLocaleString()}</td></tr>`).join('')}
            </tbody>
          </table>`}
          <button id="resetButton" class="reset-btn" onclick="resetAllData()">🗑️ Delete All Data & Reset</button>
          <script>
            async function resetAllData() {
              if (!window.opener || !window.opener.__eidResetAllData) {
                alert('Reset action is unavailable. Please reopen the admin panel.');
                return;
              }

              const confirmed = window.confirm('⚠️ Are you sure? This will delete all spin history, reset the total spins to 0, and clear saved app data.');
              if (!confirmed) return;

              const button = document.getElementById('resetButton');
              if (button) {
                button.disabled = true;
                button.textContent = 'Resetting...';
              }

              try {
                await window.opener.__eidResetAllData();
                if (window.opener && !window.opener.closed) {
                  window.opener.location.reload();
                }
                window.alert('✅ All data cleared. The app is now back to a fresh state.');
                window.close();
              } catch (error) {
                console.error(error);
                window.alert('❌ Failed to clear data. Please try again.');
                if (button) {
                  button.disabled = false;
                  button.textContent = '🗑️ Delete All Data & Reset';
                }
              }
            }
          </script>
        </body>
        </html>
      `);
      win.document.close();
      setShowPrompt(false);
      setPassword('');
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {!showPrompt ? (
        <button
          onClick={() => setShowPrompt(true)}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-muted/60 border border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          Admin
        </button>
      ) : (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-card/90 backdrop-blur border border-border shadow-lg">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Password"
            className={`w-28 px-3 py-1.5 text-sm rounded-lg bg-muted border ${error ? 'border-destructive' : 'border-border'} text-foreground focus:outline-none`}
            autoFocus
          />
          <button onClick={handleSubmit} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-primary text-primary-foreground">
            Go
          </button>
          <button onClick={() => { setShowPrompt(false); setPassword(''); }} className="px-2 py-1.5 text-xs text-muted-foreground">
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
