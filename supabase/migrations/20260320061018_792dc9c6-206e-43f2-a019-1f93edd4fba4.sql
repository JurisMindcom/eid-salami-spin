
CREATE OR REPLACE FUNCTION public.reset_all_spins()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.spins;
  UPDATE public.spin_stats SET total_spins = 0 WHERE id = 'global';
$$;
