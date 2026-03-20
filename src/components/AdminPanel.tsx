import { useState } from 'react';

const ADMIN_PASSWORD = '77889';

interface SpinRecord {
  name: string;
  amount: number;
  time: string;
}

export function AdminButton() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      const history: SpinRecord[] = JSON.parse(localStorage.getItem('spinHistory') || '[]');
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
          </style>
        </head>
        <body>
          <h1>🌙 Admin Panel - Spin History</h1>
          ${history.length === 0 ? '<p class="empty">No spins recorded yet</p>' : `
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Amount</th><th>Time</th></tr></thead>
            <tbody>
              ${history.map((r, i) => `<tr><td>${i + 1}</td><td>${r.name}</td><td>৳${r.amount.toLocaleString()}</td><td>${r.time}</td></tr>`).join('')}
            </tbody>
          </table>`}
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
