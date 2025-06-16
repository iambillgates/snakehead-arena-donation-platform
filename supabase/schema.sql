-- Create users table with auth integration
create table public.users (
  id uuid references auth.users on delete cascade,
  email text unique,
  name text,
  role text default 'user',
  total_points bigint default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Create payments table
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id),
  amount bigint not null,
  type text not null check (type in ('points', 'subscription')),
  status text not null check (status in ('pending', 'completed', 'failed')),
  reward_status text not null check (reward_status in ('pending', 'delivered', 'failed')),
  points_amount bigint,
  subscription_months int,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create subscriptions table
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id),
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
alter table public.users enable row level security;
alter table public.payments enable row level security;
alter table public.subscriptions enable row level security;

-- Users policies
create policy "Users can view their own data" on public.users
  for select using (auth.uid() = id);

create policy "Admin can view all users" on public.users
  for select using (
    exists (
      select 1 from public.users where id = auth.uid() and role = 'admin'
    )
  );

-- Payments policies
create policy "Users can view their own payments" on public.payments
  for select using (auth.uid() = user_id);

create policy "Admin can view all payments" on public.payments
  for select using (
    exists (
      select 1 from public.users where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admin can update payment status" on public.payments
  for update using (
    exists (
      select 1 from public.users where id = auth.uid() and role = 'admin'
    )
  );

-- Subscriptions policies
create policy "Users can view their own subscriptions" on public.subscriptions
  for select using (auth.uid() = user_id);

create policy "Admin can view all subscriptions" on public.subscriptions
  for select using (
    exists (
      select 1 from public.users where id = auth.uid() and role = 'admin'
    )
  );

-- Functions
create or replace function public.get_leaderboard(time_period text)
returns table (
  user_id uuid,
  name text,
  total_points bigint,
  total_donations bigint,
  status text
)
language plpgsql
security definer
as $$
begin
  return query
  select 
    u.id as user_id,
    u.name,
    u.total_points,
    coalesce(sum(p.amount), 0)::bigint as total_donations,
    case 
      when u.total_points >= 5000000 then 'VIP'
      when u.total_points >= 1000000 then 'Premium'
      else 'Regular'
    end as status
  from public.users u
  left join public.payments p on u.id = p.user_id
  where 
    case 
      when time_period = 'week' then p.created_at >= now() - interval '7 days'
      when time_period = 'month' then p.created_at >= now() - interval '30 days'
      else true
    end
  group by u.id, u.name, u.total_points
  order by total_donations desc
  limit 100;
end;
$$;
