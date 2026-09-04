create extension if not exists pgcrypto;

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null check (event_name in (
    'app_opened', 'weather_loaded', 'weather_error', 'city_changed',
    'outfit_generated', 'weekly_forecast_loaded', 'weekly_forecast_saved',
    'weekly_forecast_shared', 'telegram_share_clicked', 'language_changed'
  )),
  session_id text not null check (char_length(session_id) between 1 and 120),
  city_key text check (city_key is null or char_length(city_key) <= 100),
  language text check (language is null or language in ('ru', 'en')),
  child_count integer check (child_count is null or child_count between 0 and 20),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index if not exists analytics_events_event_name_idx on public.analytics_events (event_name, created_at desc);
create index if not exists analytics_events_city_idx on public.analytics_events (city_key, created_at desc);

alter table public.analytics_events enable row level security;
revoke all on table public.analytics_events from anon, authenticated;

-- Browser roles have no direct table access. The public record-event Edge Function
-- validates and rate-limits payloads, then inserts with the server-only service role.

-- No SELECT/INSERT/UPDATE/DELETE policies are intentionally granted to browser roles.
-- Admin reads happen only inside the protected Edge Function with service role.
