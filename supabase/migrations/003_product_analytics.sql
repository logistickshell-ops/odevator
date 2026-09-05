-- Product analytics expansion: funnel, technical monitoring, payments, Telegram, retention and item details.
-- Run once after 001_analytics.sql and 002_analytics_enhancements.sql.

alter table public.analytics_events
  drop constraint if exists analytics_events_event_name_check;

alter table public.analytics_events
  add constraint analytics_events_event_name_check check (event_name in (
    'app_opened', 'weather_loaded', 'weather_error', 'city_changed',
    'outfit_generated', 'weekly_forecast_loaded', 'weekly_forecast_saved',
    'weekly_forecast_shared', 'telegram_share_clicked', 'language_changed',
    'session_ended', 'funnel_city_selected', 'funnel_weather_loaded',
    'funnel_outfit_viewed', 'funnel_outfit_generated', 'funnel_weekly_forecast_opened',
    'funnel_share_started', 'funnel_share_completed', 'technical_metric',
    'telegram_app_opened', 'telegram_share_started', 'telegram_share_completed',
    'telegram_share_cancelled', 'telegram_payment_started', 'telegram_invoice_created',
    'telegram_payment_completed', 'telegram_payment_cancelled', 'telegram_payment_failed',
    'telegram_entitlement_checked', 'pricing_viewed', 'payment_started',
    'payment_completed', 'payment_cancelled', 'payment_failed', 'outfit_item_opened'
  ));

create index if not exists analytics_events_metadata_metric_idx
  on public.analytics_events ((metadata->>'metric'), created_at desc);

create index if not exists analytics_events_metadata_item_idx
  on public.analytics_events ((metadata->>'item_id'), created_at desc);

create index if not exists analytics_events_metadata_source_idx
  on public.analytics_events ((metadata->>'source'), created_at desc);
