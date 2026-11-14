-- Ahatab Foundation database. Already applied to the Supabase project "ahatab-foundation"
-- (migration: foundation_schema). Kept here so the setup can be reproduced.

-- ===== Admins =====
create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.admins where user_id = (select auth.uid())); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- The first signed-in user can claim admin once; after that it is closed.
create or replace function public.claim_admin()
returns boolean language plpgsql security definer set search_path = ''
as $$
begin
  if (select auth.uid()) is null then return false; end if;
  if exists (select 1 from public.admins) then return false; end if;
  insert into public.admins (user_id) values ((select auth.uid()));
  return true;
end;
$$;
revoke all on function public.claim_admin() from public, anon;
grant execute on function public.claim_admin() to authenticated;

create policy "admins read own row" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));

-- ===== Site settings =====
create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
create policy "settings public read" on public.site_settings for select to anon, authenticated using (true);
create policy "settings admin write" on public.site_settings for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- ===== Programs =====
create table public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title_en text not null check (char_length(title_en) between 1 and 160),
  title_bn text, summary_en text, summary_bn text, body_en text, body_bn text,
  icon text not null default 'heart',
  image_url text check (image_url is null or image_url ~* '^(https?://|/[^/])'),
  sort int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.programs enable row level security;
create policy "programs public read" on public.programs for select to anon, authenticated
  using (published or (select public.is_admin()));
create policy "programs admin write" on public.programs for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- ===== Stories / updates =====
create table public.stories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title_en text not null check (char_length(title_en) between 1 and 200),
  title_bn text, excerpt_en text, excerpt_bn text, body_en text, body_bn text,
  category text not null default 'update',
  image_url text check (image_url is null or image_url ~* '^(https?://|/[^/])'),
  is_sample boolean not null default false,
  published boolean not null default false,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table public.stories enable row level security;
create policy "stories public read" on public.stories for select to anon, authenticated
  using ((published and published_at <= now()) or (select public.is_admin()));
create policy "stories admin write" on public.stories for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- ===== Events =====
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title_en text not null check (char_length(title_en) between 1 and 200),
  title_bn text, description_en text, description_bn text, location text,
  starts_at timestamptz not null,
  image_url text check (image_url is null or image_url ~* '^(https?://|/[^/])'),
  is_sample boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.events enable row level security;
create policy "events public read" on public.events for select to anon, authenticated
  using (published or (select public.is_admin()));
create policy "events admin write" on public.events for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- ===== Inbox: visitors can insert, only admins can read or change =====
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text check (email is null or char_length(email) <= 200),
  phone text check (phone is null or char_length(phone) <= 40),
  subject text check (subject is null or char_length(subject) <= 200),
  body text not null check (char_length(body) between 1 and 5000),
  status text not null default 'new' check (status in ('new','read','archived')),
  created_at timestamptz not null default now()
);
alter table public.messages enable row level security;
create policy "messages public insert" on public.messages for insert to anon, authenticated with check (status = 'new');
create policy "messages admin all" on public.messages for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create table public.volunteers (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text check (email is null or char_length(email) <= 200),
  phone text not null check (char_length(phone) between 5 and 40),
  area text check (area is null or char_length(area) <= 120),
  message text check (message is null or char_length(message) <= 3000),
  status text not null default 'new' check (status in ('new','contacted','archived')),
  created_at timestamptz not null default now()
);
alter table public.volunteers enable row level security;
create policy "volunteers public insert" on public.volunteers for insert to anon, authenticated with check (status = 'new');
create policy "volunteers admin all" on public.volunteers for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create table public.donations (
  id uuid primary key default gen_random_uuid(),
  donor_name text not null check (char_length(donor_name) between 1 and 120),
  phone text check (phone is null or char_length(phone) <= 40),
  email text check (email is null or char_length(email) <= 200),
  amount numeric(12,2) not null check (amount > 0 and amount < 100000000),
  method text not null check (char_length(method) between 1 and 60),
  trx_id text check (trx_id is null or char_length(trx_id) <= 80),
  message text check (message is null or char_length(message) <= 1000),
  status text not null default 'pending' check (status in ('pending','verified','rejected')),
  created_at timestamptz not null default now()
);
alter table public.donations enable row level security;
create policy "donations public insert" on public.donations for insert to anon, authenticated with check (status = 'pending');
create policy "donations admin all" on public.donations for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- ===== Storage: public image bucket, admin-only writes =====
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do nothing;
create policy "media admin insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));
create policy "media admin update" on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
create policy "media admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));

-- Starter content (site_settings, five programs, one story) was seeded by the migration.
-- Sample content (6 stories incl. flood / rising prices / safe water, 5 events, program pictures)
-- was added by the later migration "sample_content_and_images". Every sample row has is_sample = true,
-- so the admin overview's "Remove sample content" button deletes only those rows.
