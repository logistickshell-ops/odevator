-- Расширение аналитики: завершение сессии и быстрый анализ visitor_id/gender.
-- Запускать один раз в Supabase SQL Editor после 001_analytics.sql.

alter table public.analytics_events
  drop constraint if exists analytics_events_event_name_check;

alter table public.analytics_events
  add constraint analytics_events_event_name_check check (event_name in (
    'app_opened', 'weather_loaded', 'weather_error', 'city_changed',
    'outfit_generated', 'weekly_forecast_loaded', 'weekly_forecast_saved',
    'weekly_forecast_shared', 'telegram_share_clicked', 'language_changed',
    'session_ended'
  ));

create index if not exists analytics_events_visitor_idx
  on public.analytics_events ((metadata->>'visitor_id'), created_at desc);

create index if not exists analytics_events_gender_idx
  on public.analytics_events ((metadata->>'gender'), created_at desc);

create index if not exists analytics_events_session_event_idx
  on public.analytics_events (session_id, event_name, created_at desc);
