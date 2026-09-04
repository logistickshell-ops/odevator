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
  | 'language_changed'
  | 'session_ended';

export type AnalyticsEvent = {
  eventName: AnalyticsEventName;
  cityKey?: string;
  language?: string;
  childCount?: number;
  metadata?: Record<string, string | number | boolean | null>;
};

const VISITOR_KEY = 'meteo_analytics_visitor_v2';
const SESSION_KEY = 'meteo_analytics_session_v2';
const SESSION_STARTED_KEY = 'meteo_analytics_started_v2';
const MAX_METADATA_KEYS = 12;
const MAX_METADATA_VALUE = 120;

function randomId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `visitor-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

function getVisitorId() {
  try {
    const current = localStorage.getItem(VISITOR_KEY);
    if (current) return current;
    const value = randomId();
    localStorage.setItem(VISITOR_KEY, value);
    return value;
  } catch {
    return 'anonymous-visitor';
  }
}

function getSessionId() {
  try {
    const current = sessionStorage.getItem(SESSION_KEY);
    if (current) return current;
    const value = randomId();
    sessionStorage.setItem(SESSION_KEY, value);
    sessionStorage.setItem(SESSION_STARTED_KEY, String(Date.now()));
    return value;
  } catch {
    return randomId();
  }
}

export function getSessionDurationSeconds() {
  try {
    const started = Number(sessionStorage.getItem(SESSION_STARTED_KEY));
    if (!Number.isFinite(started) || started <= 0) return 0;
    return Math.max(0, Math.min(86400, Math.round((Date.now() - started) / 1000)));
  } catch {
    return 0;
  }
}

function cleanMetadata(metadata?: AnalyticsEvent['metadata']) {
  const value = metadata ?? {};
  const entries = Object.entries(value).slice(0, MAX_METADATA_KEYS).map(([key, item]) => [
    key.slice(0, 40),
    typeof item === 'string' ? item.slice(0, MAX_METADATA_VALUE) : item,
  ] as const);
  return Object.fromEntries(entries);
}

export async function trackEvent(event: AnalyticsEvent) {
  const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
  const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();
  if (!url || !anonKey) return;
  try {
    const sessionId = getSessionId();
    await fetch(`${url}/functions/v1/record-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: anonKey },
      body: JSON.stringify({
        event_name: event.eventName,
        session_id: sessionId,
        city_key: event.cityKey?.slice(0, 100),
        language: event.language?.slice(0, 10),
        child_count: typeof event.childCount === 'number' ? Math.max(0, Math.min(20, Math.round(event.childCount))) : undefined,
        metadata: cleanMetadata({ ...event.metadata, visitor_id: getVisitorId() }),
      }),
      keepalive: true,
    });
  } catch {
    // Аналитика никогда не должна блокировать приложение.
  }
}

declare global {
  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL?: string;
    readonly VITE_SUPABASE_ANON_KEY?: string;
  }
}

export {};
