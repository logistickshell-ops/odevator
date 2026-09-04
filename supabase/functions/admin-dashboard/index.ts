import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('APP_ORIGIN') ?? 'https://childs-dresser.onrender.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

function startOfPeriod(days: number) {
  const safeDays = Math.max(1, Math.min(90, Math.round(days)));
  return new Date(Date.now() - safeDays * 86400000).toISOString();
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'GET') return json({ error: 'method_not_allowed' }, 405);

  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) return json({ error: 'unauthorized' }, 401);

  const userClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!,
    { global: { headers: { Authorization: authorization } } },
  );
  const { data: userData, error: userError } = await userClient.auth.getUser();
  const adminEmail = (Deno.env.get('ADMIN_EMAIL') ?? '').trim().toLowerCase();
  if (userError || !userData.user || !adminEmail || userData.user.email?.toLowerCase() !== adminEmail) {
    return json({ error: 'forbidden' }, 403);
  }

  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!serviceKey) return json({ error: 'server_not_configured' }, 503);
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey);
  const url = new URL(request.url);
  const since = startOfPeriod(Number(url.searchParams.get('days') ?? 30));
  const { data: events, error } = await admin
    .from('analytics_events')
    .select('event_name, session_id, city_key, language, child_count, metadata, created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(10000);
  if (error) {
    console.error('dashboard query failed', error.message);
    return json({ error: 'storage_failed' }, 500);
  }

  const rows = events ?? [];
  const countBy = (field: 'event_name' | 'city_key' | 'language') => {
    const result: Record<string, number> = {};
    for (const row of rows) {
      const value = row[field];
      if (typeof value === 'string' && value) result[value] = (result[value] ?? 0) + 1;
    }
    return Object.entries(result).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([key, count]) => ({ key, count }));
  };
  const uniqueSessions = new Set(rows.map((row) => row.session_id)).size;
  const daysMap: Record<string, number> = {};
  for (const row of rows) {
    const day = row.created_at.slice(0, 10);
    daysMap[day] = (daysMap[day] ?? 0) + 1;
  }

  return json({
    generatedAt: new Date().toISOString(),
    since,
    totals: { events: rows.length, uniqueSessions },
    events: countBy('event_name'),
    cities: countBy('city_key'),
    languages: countBy('language'),
    daily: Object.entries(daysMap).sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => ({ date, count })),
  });
});
