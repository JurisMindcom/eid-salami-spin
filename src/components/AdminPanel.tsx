import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const ADMIN_PASSWORD = '77889';

export function AdminButton() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async () => {
    if (password === ADMIN_PASSWORD) {
      // Fetch spin history from database
      const { data: history } = await supabase
        .from('spins')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      const records = history || [];
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
            .reset-btn { display: block; margin: 20px auto; padding: 10px 24px; background: #dc2626; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 14px; }
            .reset-btn:hover { background: #b91c1c; }
          </style>
        </head>
        <body>
          <h1>🌙 Admin Panel - Spin History</h1>
          <p class="stats">Total Records: ${records.length}</p>
          ${records.length === 0 ? '<p class="empty">No spins recorded yet</p>' : `
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Amount</th><th>Time</th></tr></thead>
            <tbody>
              ${records.map((r: any, i: number) => `<tr><td>${i + 1}</td><td>${r.name}</td><td>৳${r.amount.toLocaleString()}</td><td>${new Date(r.created_at).toLocaleString()}</td></tr>`).join('')}
            </tbody>
          </table>`}
          <button class="reset-btn" onclick="if(confirm('⚠️ Are you sure? This will DELETE ALL spin history and reset the counter to 0!')){fetch('${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/reset_all_spins',{method:'POST',headers:{'apikey':'${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}','Content-Type':'application/json'}}).then(()=>{alert('✅ All data cleared!');location.reload()}).catch(()=>alert('❌ Error clearing data'))}">🗑️ Delete All Data & Reset</button>
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
