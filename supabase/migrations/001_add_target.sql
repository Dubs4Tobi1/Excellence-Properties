-- Add target + published columns if missing
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS target text,
  ADD COLUMN IF NOT EXISTS published boolean DEFAULT false;
