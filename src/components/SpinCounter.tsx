interface Props {
  count: number;
  lastTime: string | null;
}

export default function SpinCounter({ count, lastTime }: Props) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-30 bg-card/80 backdrop-blur border border-border rounded-xl px-4 py-3 text-sm">
      <div className="text-muted-foreground">
        Spins: <span className="text-foreground font-bold">{count}</span>
      </div>
      {lastTime && (
        <div className="text-muted-foreground text-xs mt-1">
          Last: {lastTime}
        </div>
      )}
    </div>
  );
}
