-- Enable RLS and create sensible policies for listings
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert rows, requiring owner_id = auth.uid()
CREATE POLICY "Allow inserts for authenticated" ON public.listings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Allow selecting published rows or rows owned by the requester
CREATE POLICY "Allow select published or owner" ON public.listings
  FOR SELECT
  USING (published = true OR auth.uid() = owner_id);

-- Allow owners to update/delete their own rows
CREATE POLICY "Allow modify by owner" ON public.listings
  FOR UPDATE, DELETE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);
