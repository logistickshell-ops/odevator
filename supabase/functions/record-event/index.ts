import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const allowedEvents = new Set([
  'app_opened', 'weather_loaded', 'weather_error', 'city_changed',
  'outfit_generated', 'weekly_forecast_loaded', 'weekly_forecast_saved',
  'weekly_forecast_shared', 'telegram_share_clicked', 'language_changed',
]);

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('APP_ORIGIN') ?? 'https://childs-dresser.onrender.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  try {
    const payload = await request.json();
    if (!isRecord(payload) || typeof payload.event_name !== 'string' || !allowedEvents.has(payload.event_name)) {
      return json({ error: 'invalid_event' }, 400);
    }
    if (typeof payload.session_id !== 'string' || payload.session_id.length < 1 || payload.session_id.length > 120) {
      return json({ error: 'invalid_session' }, 400);
    }

    const metadata = isRecord(payload.metadata) ? Object.fromEntries(
      Object.entries(payload.metadata).slice(0, 12).map(([key, value]) => [
        key.slice(0, 40),
        typeof value === 'string' ? value.slice(0, 120) : typeof value === 'number' || typeof value === 'boolean' || value === null ? value : null,
      ]),
    ) : {};

    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!serviceKey) return json({ error: 'server_not_configured' }, 503);
    const admin = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey);
    const windowStart = new Date(Date.now() - 60_000).toISOString();
    const { count } = await admin.from('analytics_events').select('id', { count: 'exact', head: true }).eq('session_id', payload.session_id).gte('created_at', windowStart);
    if ((count ?? 0) >= 60) return json({ error: 'rate_limited' }, 429);

    const { error } = await admin.from('analytics_events').insert({
      event_name: payload.event_name,
      session_id: payload.session_id,
      city_key: typeof payload.city_key === 'string' ? payload.city_key.slice(0, 100) : null,
      language: payload.language === 'ru' || payload.language === 'en' ? payload.language : null,
      child_count: typeof payload.child_count === 'number' ? Math.max(0, Math.min(20, Math.round(payload.child_count))) : null,
      metadata,
    });
    if (error) {
      console.error('record-event insert failed', error.message);
      return json({ error: 'storage_failed' }, 500);
    }
    return json({ ok: true });
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }
});
