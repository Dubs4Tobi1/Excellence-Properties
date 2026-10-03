-- Add fields used by the existing property form; preserve existing records.
alter table public.properties
  add column if not exists category text,
  add column if not exists property_type text,
  add column if not exists state text,
  add column if not exists area text,
  add column if not exists locality text,
  add column if not exists amenities text[],
  add column if not exists furnishing text,
  add column if not exists condition text,
  add column if not exists image_url text,
  add column if not exists video_url text,
  add column if not exists agent_name text,
  add column if not exists owner_id uuid references auth.users(id);

create index if not exists properties_owner_id_idx on public.properties(owner_id);
create index if not exists property_images_property_id_idx on public.property_images(property_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('property-images', 'property-images', true, 52428800,
 array['image/jpeg','image/png','image/webp','video/mp4','video/webm'])
on conflict (id) do nothing;

alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.property_types enable row level security;
alter table public.locations enable row level security;
alter table public.favorites enable row level security;
alter table public.messages enable row level security;

grant select on public.properties, public.property_images, public.companies, public.property_types, public.locations to anon, authenticated;
grant insert, update, delete on public.properties, public.property_images to authenticated;
grant select on public.profiles, public.favorites, public.messages to authenticated;
grant insert, delete on public.favorites to authenticated;

create policy properties_public_read on public.properties for select to anon, authenticated using (true);
create policy properties_agent_insert on public.properties for insert to authenticated
 with check (owner_id = (select auth.uid()) and (select auth.jwt())->'app_metadata'->>'role' = 'agent');
create policy properties_owner_update on public.properties for update to authenticated
 using (owner_id = (select auth.uid()) and (select auth.jwt())->'app_metadata'->>'role' = 'agent')
 with check (owner_id = (select auth.uid()) and (select auth.jwt())->'app_metadata'->>'role' = 'agent');
create policy properties_owner_delete on public.properties for delete to authenticated
 using (owner_id = (select auth.uid()) and (select auth.jwt())->'app_metadata'->>'role' = 'agent');
create policy images_public_read on public.property_images for select to anon, authenticated using (true);
create policy images_owner_insert on public.property_images for insert to authenticated
 with check (exists (select 1 from public.properties p where p.id = property_id and p.owner_id = (select auth.uid())) and (select auth.jwt())->'app_metadata'->>'role' = 'agent');
create policy images_owner_delete on public.property_images for delete to authenticated
 using (exists (select 1 from public.properties p where p.id = property_id and p.owner_id = (select auth.uid())) and (select auth.jwt())->'app_metadata'->>'role' = 'agent');
create policy profiles_self_read on public.profiles for select to authenticated using (auth_uid = (select auth.uid()));
create policy companies_public_read on public.companies for select to anon, authenticated using (true);
create policy types_public_read on public.property_types for select to anon, authenticated using (true);
create policy locations_public_read on public.locations for select to anon, authenticated using (true);
create policy favorites_self_read on public.favorites for select to authenticated
 using (exists (select 1 from public.profiles p where p.id = user_id and p.auth_uid = (select auth.uid())));
create policy favorites_self_insert on public.favorites for insert to authenticated
 with check (exists (select 1 from public.profiles p where p.id = user_id and p.auth_uid = (select auth.uid())));
create policy favorites_self_delete on public.favorites for delete to authenticated
 using (exists (select 1 from public.profiles p where p.id = user_id and p.auth_uid = (select auth.uid())));
-- No messages policy: the site uses WhatsApp/telephone; message records stay private.

create policy property_media_agent_insert on storage.objects for insert to authenticated
 with check (bucket_id = 'property-images' and (storage.foldername(name))[1] = 'properties'
 and (storage.foldername(name))[2] = (select auth.uid())::text
 and (select auth.jwt())->'app_metadata'->>'role' = 'agent');
create policy property_media_owner_read on storage.objects for select to authenticated
 using (bucket_id = 'property-images' and (storage.foldername(name))[2] = (select auth.uid())::text);
create policy property_media_owner_delete on storage.objects for delete to authenticated
 using (bucket_id = 'property-images' and (storage.foldername(name))[2] = (select auth.uid())::text
 and (select auth.jwt())->'app_metadata'->>'role' = 'agent');
