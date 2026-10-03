-- Excellence Properties standalone app tables.
-- The connected Supabase project already has a different public.properties schema,
-- so this app uses ep_* names to avoid changing or colliding with that schema.
create table if not exists public.ep_user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.ep_properties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null default 'excellence' check (company in ('excellence','zylus','blue-earth')),
  location text not null,
  price text not null,
  description text not null default '',
  bedrooms integer check (bedrooms is null or bedrooms >= 0),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ep_property_media (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.ep_properties(id) on delete cascade,
  media_type text not null check (media_type in ('image','video')),
  media_url text not null,
  storage_path text not null unique,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists ep_property_media_property_order_idx on public.ep_property_media(property_id, display_order);
create index if not exists ep_properties_public_created_idx on public.ep_properties(published, created_at desc);

create or replace function public.is_ep_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.ep_user_roles where user_id = (select auth.uid()) and role = 'admin') $$;
revoke all on function public.is_ep_admin() from public;
grant execute on function public.is_ep_admin() to anon, authenticated;

alter table public.ep_user_roles enable row level security;
alter table public.ep_properties enable row level security;
alter table public.ep_property_media enable row level security;

drop policy if exists "ep admins read roles" on public.ep_user_roles;
create policy "ep admins read roles" on public.ep_user_roles for select to authenticated
using (user_id = (select auth.uid()) or public.is_ep_admin());
drop policy if exists "ep public read published properties" on public.ep_properties;
create policy "ep public read published properties" on public.ep_properties for select to anon, authenticated
using (published or public.is_ep_admin());
drop policy if exists "ep admins manage properties" on public.ep_properties;
create policy "ep admins manage properties" on public.ep_properties for all to authenticated
using (public.is_ep_admin()) with check (public.is_ep_admin());
drop policy if exists "ep public read published media" on public.ep_property_media;
create policy "ep public read published media" on public.ep_property_media for select to anon, authenticated
using (exists (select 1 from public.ep_properties p where p.id = property_id and (p.published or public.is_ep_admin())));
drop policy if exists "ep admins manage property media" on public.ep_property_media;
create policy "ep admins manage property media" on public.ep_property_media for all to authenticated
using (public.is_ep_admin()) with check (public.is_ep_admin());

grant select on public.ep_properties, public.ep_property_media to anon, authenticated;
grant insert, update, delete on public.ep_properties, public.ep_property_media to authenticated;
grant select on public.ep_user_roles to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('ep-property-media', 'ep-property-media', true, 52428800,
  array['image/jpeg','image/png','image/webp','image/avif','video/mp4','video/webm','video/quicktime'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "ep public read media objects" on storage.objects;
create policy "ep public read media objects" on storage.objects for select to anon, authenticated
using (bucket_id = 'ep-property-media');
drop policy if exists "ep admins upload media objects" on storage.objects;
create policy "ep admins upload media objects" on storage.objects for insert to authenticated
with check (bucket_id = 'ep-property-media' and public.is_ep_admin());
drop policy if exists "ep admins update media objects" on storage.objects;
create policy "ep admins update media objects" on storage.objects for update to authenticated
using (bucket_id = 'ep-property-media' and public.is_ep_admin())
with check (bucket_id = 'ep-property-media' and public.is_ep_admin());
drop policy if exists "ep admins delete media objects" on storage.objects;
create policy "ep admins delete media objects" on storage.objects for delete to authenticated
using (bucket_id = 'ep-property-media' and public.is_ep_admin());
