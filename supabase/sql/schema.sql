-- Supabase SQL schema for Excellence Property Agencies

-- Enable extensions
create extension if not exists "uuid-ossp";

-- Users (supabase auth will manage core users, this table extends profiles)
create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  auth_uid uuid references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  company_id uuid,
  created_at timestamptz default now()
);

-- Companies
create table if not exists companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique,
  description text,
  created_at timestamptz default now()
);

-- Property types
create table if not exists property_types (
  id serial primary key,
  name text not null
);

-- Locations
create table if not exists locations (
  id serial primary key,
  state text,
  city text,
  address text
);

-- Properties
create table if not exists properties (
  id uuid primary key default uuid_generate_v4(),
  title text,
  description text,
  price numeric,
  negotiable boolean default false,
  category text,
  property_type text,
  state text,
  area text,
  locality text,
  amenities text[],
  furnishing text,
  condition text,
  image_url text,
  video_url text,
  agent_name text,
  company_id uuid references companies(id),
  agent_id uuid references profiles(id),
  type_id int references property_types(id),
  location_id int references locations(id),
  status text,
  bedrooms int,
  bathrooms int,
  toilets int,
  parking int,
  sqm int,
  is_featured boolean default false,
  date_available date,
  reference text,
  created_at timestamptz default now()
);

-- Property images
create table if not exists property_images (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid references properties(id) on delete cascade,
  url text,
  is_primary boolean default false,
  created_at timestamptz default now()
);

-- Favorites
create table if not exists favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  property_id uuid references properties(id) on delete cascade,
  created_at timestamptz default now()
);

-- Messages
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid references properties(id) on delete cascade,
  sender_name text,
  sender_phone text,
  sender_email text,
  message text,
  created_at timestamptz default now()
);

-- RLS examples: restrict profiles to their auth uid
-- Note: Supabase Auth triggers and policies need to be configured in the project dashboard

/* Example policy - allow users to insert their profile */
-- alter table profiles enable row level security;
-- create policy "profiles_insert_own" on profiles for insert using (auth.uid() = auth_uid);

-- Storage bucket note: create a bucket named 'property-images' using Supabase UI or the Storage API
