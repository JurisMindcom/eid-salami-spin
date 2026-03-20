
-- Spin history table
CREATE TABLE public.spins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Global stats table with a single row
CREATE TABLE public.spin_stats (
  id TEXT PRIMARY KEY DEFAULT 'global',
  total_spins INTEGER NOT NULL DEFAULT 0
);

-- Insert the global counter row
INSERT INTO public.spin_stats (id, total_spins) VALUES ('global', 0);

-- Enable RLS
ALTER TABLE public.spins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spin_stats ENABLE ROW LEVEL SECURITY;

-- Public read/insert for spins (no auth needed)
CREATE POLICY "Anyone can read spins" ON public.spins FOR SELECT USING (true);
CREATE POLICY "Anyone can insert spins" ON public.spins FOR INSERT WITH CHECK (true);

-- Public read/update for spin_stats
CREATE POLICY "Anyone can read stats" ON public.spin_stats FOR SELECT USING (true);
CREATE POLICY "Anyone can update stats" ON public.spin_stats FOR UPDATE USING (true);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.spins;
ALTER PUBLICATION supabase_realtime ADD TABLE public.spin_stats;

-- Function to increment spin count atomically
CREATE OR REPLACE FUNCTION public.increment_spin_count()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.spin_stats SET total_spins = total_spins + 1 WHERE id = 'global';
$$;
