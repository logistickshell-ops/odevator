export type AnalyticsEventName =
  | 'app_opened'
  | 'weather_loaded'
  | 'weather_error'
  | 'city_changed'
  | 'outfit_generated'
  | 'weekly_forecast_loaded'
  | 'weekly_forecast_saved'
  | 'weekly_forecast_shared'
  | 'telegram_share_clicked'
  | 'language_changed';

export type AnalyticsEvent = {
  eventName: AnalyticsEventName;
  cityKey?: string;
  language?: string;
  childCount?: number;
  metadata?: Record<string, string | number | boolean | null>;
};

const SESSION_KEY = 'meteo_analytics_session_v1';
const MAX_METADATA_KEYS = 12;
const MAX_METADATA_VALUE = 120;

function getSessionId() {
  try {
    const current = localStorage.getItem(SESSION_KEY);
    if (current) return current;
    const value = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, value);
    return value;
  } catch {
    return 'ephemeral';
  }
}

function cleanMetadata(metadata?: AnalyticsEvent['metadata']) {
  if (!metadata) return {};
  return Object.fromEntries(
    Object.entries(metadata).slice(0, MAX_METADATA_KEYS).map(([key, value]) => [
      key.slice(0, 40),
      typeof value === 'string' ? value.slice(0, MAX_METADATA_VALUE) : value,
    ]),
  );
}

export async function trackEvent(event: AnalyticsEvent) {
  const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
  const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();
  if (!url || !anonKey) return;
  try {
    await fetch(`${url}/functions/v1/record-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: anonKey },
      body: JSON.stringify({
        event_name: event.eventName,
        session_id: getSessionId(),
        city_key: event.cityKey?.slice(0, 100),
        language: event.language?.slice(0, 10),
        child_count: typeof event.childCount === 'number' ? Math.max(0, Math.min(20, Math.round(event.childCount))) : undefined,
        metadata: cleanMetadata(event.metadata),
      }),
      keepalive: true,
    });
  } catch {
    // Analytics must never block or break the weather product.
  }
}

declare global {
  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL?: string;
    readonly VITE_SUPABASE_ANON_KEY?: string;
  }
}

export {};
