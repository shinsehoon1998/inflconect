-- Create a table for public profiles
create table if not exists user_profiles (
  id uuid references auth.users on delete cascade,
  role text check (role in ('advertiser', 'influencer', 'admin')),
  name text,
  phone text,
  point_balance integer default 0,
  followers_count integer default 0,
  blog_score decimal(3,1) default 0.0,
  bio text,
  categories text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Campaigns Table (updated for 6-step registration)
create table if not exists campaigns (
  id uuid default gen_random_uuid() primary key,
  advertiser_id uuid references auth.users not null,
  title text not null,
  thumbnail_url text,
  contact_phone text,
  promotion_type text check (promotion_type in ('visit', 'takeout', 'delivery', 'purchase')),
  category text check (category in ('food', 'grocery', 'beauty', 'travel', 'digital', 'pet', 'other')),
  channel text check (channel in ('blog', 'instagram', 'blog_clip', 'clip', 'reels', 'youtube', 'shorts', 'tiktok')),
  address text,
  available_days text[],
  start_time text,
  end_time text,
  is_24_hours boolean default false,
  same_day_booking boolean default false,
  booking_notes text,
  mission text,
  keywords text[],
  target_visits integer default 0,
  target_dwell_time integer default 0,
  target_roas integer default 0,
  campaign_start_date date,
  campaign_end_date date,
  provided_items text,
  provided_value integer default 0,
  influencer_points integer default 0,
  recruit_count integer default 1,
  phase text default 'review' check (phase in ('review', 'recruiting', 'experience', 'completed')),
  status text default 'active' check (status in ('active', 'completed', 'draft')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Campaign Proposals Table (advertiser to influencer)
create table if not exists campaign_proposals (
  id uuid default gen_random_uuid() primary key,
  campaign_id uuid references campaigns on delete cascade not null,
  influencer_id uuid references auth.users not null,
  message text,
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(campaign_id, influencer_id)
);

-- Point Transactions Table
create table if not exists point_transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  amount integer not null,
  type text check (type in ('charge', 'spend', 'earn', 'refund')),
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table user_profiles enable row level security;
alter table campaigns enable row level security;
alter table campaign_proposals enable row level security;
alter table point_transactions enable row level security;

-- Policies for user_profiles
create policy "Users can view own profile" on user_profiles for select using (auth.uid() = id);
create policy "Users can view all profiles" on user_profiles for select using (true);
create policy "Users can insert own profile" on user_profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on user_profiles for update using (auth.uid() = id);

-- Policies for campaigns
create policy "Any auth user can view campaigns" on campaigns for select using (auth.role() = 'authenticated');
create policy "Advertisers can insert campaigns" on campaigns for insert with check (auth.uid() = advertiser_id);
create policy "Advertisers can update own campaigns" on campaigns for update using (auth.uid() = advertiser_id);

-- Policies for campaign_proposals
create policy "Advertisers can view proposals for own campaigns" on campaign_proposals for select using (
  exists (
    select 1 from campaigns
    where campaigns.id = campaign_proposals.campaign_id
    and campaigns.advertiser_id = auth.uid()
  )
);
create policy "Influencers can view own proposals" on campaign_proposals for select using (auth.uid() = influencer_id);
create policy "Advertisers can insert proposals" on campaign_proposals for insert with check (
  exists (
    select 1 from campaigns
    where campaigns.id = campaign_proposals.campaign_id
    and campaigns.advertiser_id = auth.uid()
  )
);
create policy "Influencers can update own proposals" on campaign_proposals for update using (auth.uid() = influencer_id);

-- Policies for point_transactions
create policy "Users can view own transactions" on point_transactions for select using (auth.uid() = user_id);
create policy "Users can insert own transactions" on point_transactions for insert with check (auth.uid() = user_id);
