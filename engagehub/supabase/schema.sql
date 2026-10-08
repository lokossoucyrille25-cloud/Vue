-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Drop existing tables to ensure a clean slate (CAUTION: this deletes existing data!)
drop table if exists disputes cascade;
drop table if exists transactions cascade;
drop table if exists wallets cascade;
drop table if exists proofs cascade;
drop table if exists tasks cascade;
drop table if exists campaign_actions cascade;
drop table if exists campaigns cascade;
drop table if exists follows cascade;
drop table if exists social_accounts cascade;
drop table if exists client_profiles cascade;
drop table if exists profiles cascade;

-- 1. Profiles Table (Extends Supabase Auth)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  phone text unique,
  roles text[] default '{"engageur"}', -- array of roles: client, engageur, admin
  trust_level text default 'nouveau', -- nouveau, fiable, expert
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Client Profiles
create table client_profiles (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references profiles(id) on delete cascade not null,
  public_name text not null,
  description text,
  social_links jsonb,
  is_visible boolean default false,
  moderation_status text default 'pending', -- pending, approved, rejected
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Social Accounts (For engageurs)
create table social_accounts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  network text not null, -- tiktok, instagram, youtube, facebook
  username text not null,
  verification_status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Follows (Engageurs following clients)
create table follows (
  id uuid default uuid_generate_v4() primary key,
  engageur_id uuid references profiles(id) on delete cascade not null,
  client_id uuid references profiles(id) on delete cascade not null,
  notifications_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(engageur_id, client_id)
);

-- 5. Campaigns
create table campaigns (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references profiles(id) on delete cascade not null,
  network text not null,
  content_url text not null,
  status text default 'draft', -- draft, pending, active, paused, completed, cancelled
  total_budget numeric default 0,
  escrow_budget numeric default 0,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Campaign Actions
create table campaign_actions (
  id uuid default uuid_generate_v4() primary key,
  campaign_id uuid references campaigns(id) on delete cascade not null,
  action_type text not null, -- view, like, comment, share, subscribe
  target_quantity integer not null,
  completed_quantity integer default 0,
  unit_price numeric not null,
  unit_reward numeric not null,
  guidelines text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Tasks
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  campaign_action_id uuid references campaign_actions(id) on delete cascade not null,
  engageur_id uuid references profiles(id) on delete cascade not null,
  status text default 'reserved', -- reserved, pending_review, validated, rejected
  reserved_until timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Proofs
create table proofs (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references tasks(id) on delete cascade not null,
  proof_type text not null, -- image, link, text
  proof_url text not null,
  image_hash text, -- For anti-duplication
  status text default 'pending', -- pending, accepted, rejected
  rejection_reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Wallets
create table wallets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null unique,
  available_balance numeric default 0,
  escrow_balance numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Transactions
create table transactions (
  id uuid default uuid_generate_v4() primary key,
  wallet_id uuid references wallets(id) on delete cascade not null,
  type text not null, -- deposit, withdrawal, escrow_lock, reward, commission, refund
  amount numeric not null,
  status text default 'pending', -- pending, completed, failed
  chariow_reference text,
  idempotency_key text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. Disputes
create table disputes (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references tasks(id) on delete cascade not null,
  reason text not null,
  status text default 'open', -- open, resolved_for_engageur, resolved_for_client
  decision text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) setup (Basic Examples)
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

alter table wallets enable row level security;
create policy "Users can view own wallet" on wallets for select using (auth.uid() = user_id);
create policy "Users can insert own wallet" on wallets for insert with check (auth.uid() = user_id);

-- Trigger for auto-creating profiles on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, roles)
  values (new.id, array[coalesce((new.raw_user_meta_data->>'role'), 'engageur')]);

  insert into public.wallets (user_id, available_balance)
  values (new.id, 0);

  if (new.raw_user_meta_data->>'role' = 'client') then
    insert into public.client_profiles (client_id, public_name)
    values (new.id, coalesce((new.raw_user_meta_data->>'full_name'), 'Nouveau Client'));
  else
    insert into public.social_accounts (user_id, network, username)
    values (new.id, 'tiktok', coalesce((new.raw_user_meta_data->>'full_name'), 'Nouveau Engageur'));
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Additional RLS Policies for missing tables
alter table client_profiles enable row level security;
create policy "Users can view own client profile" on client_profiles for select using (auth.uid() = client_id);
create policy "Users can update own client profile" on client_profiles for update using (auth.uid() = client_id);
create policy "Users can insert own client profile" on client_profiles for insert with check (auth.uid() = client_id);

alter table campaigns enable row level security;
create policy "Users can view own campaigns" on campaigns for select using (auth.uid() = client_id);
create policy "Users can insert own campaigns" on campaigns for insert with check (auth.uid() = client_id);
create policy "Users can update own campaigns" on campaigns for update using (auth.uid() = client_id);

alter table campaign_actions enable row level security;
create policy "Users can view own campaign actions" on campaign_actions for select using (true);
create policy "Users can insert own campaign actions" on campaign_actions for insert with check (true);
create policy "Users can update own campaign actions" on campaign_actions for update using (true);
