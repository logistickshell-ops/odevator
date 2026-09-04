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

function visitorId(row: any) {
  const value = row?.metadata?.visitor_id;
  return typeof value === 'string' && value ? value : row.session_id;
}

function addCount(result: Record<string, number>, key: unknown) {
  if (typeof key === 'string' && key) result[key] = (result[key] ?? 0) + 1;
}

function sortedCounts(result: Record<string, number>, limit = 20) {
  return Object.entries(result)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }));
}

function round(value: number) {
  return Math.round(value * 10) / 10;
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
    .order('created_at', { ascending: true })
    .limit(10000);
  if (error) {
    console.error('dashboard query failed', error.message);
    return json({ error: 'storage_failed' }, 500);
  }

  // Нужна история app_opened, чтобы отличить нового посетителя от вернувшегося.
  const { data: allOpens, error: opensError } = await admin
    .from('analytics_events')
    .select('event_name, session_id, metadata, created_at')
    .eq('event_name', 'app_opened')
    .order('created_at', { ascending: true })
    .limit(50000);
  if (opensError) {
    console.error('dashboard visitor query failed', opensError.message);
    return json({ error: 'storage_failed' }, 500);
  }

  const rows = events ?? [];
  const opens = rows.filter((row) => row.event_name === 'app_opened');
  const visitorFirstSeen = new Map<string, string>();
  for (const row of allOpens ?? []) {
    const id = visitorId(row);
    if (!visitorFirstSeen.has(id)) visitorFirstSeen.set(id, row.created_at);
  }

  const periodVisitors = new Set(opens.map(visitorId));
  let newUsers = 0;
  for (const id of periodVisitors) {
    const firstSeen = visitorFirstSeen.get(id);
    if (firstSeen && firstSeen >= since) newUsers += 1;
  }

  const eventCounts: Record<string, number> = {};
  const cityCounts: Record<string, number> = {};
  const languageCounts: Record<string, number> = {};
  const genderCounts: Record<string, number> = {};
  const dailyCounts: Record<string, number> = {};
  const dailyVisits: Record<string, Set<string>> = {};
  const sessionDurations: number[] = [];

  for (const row of rows) {
    addCount(eventCounts, row.event_name);
    addCount(cityCounts, row.city_key);
    addCount(languageCounts, row.language);
    const day = row.created_at.slice(0, 10);
    dailyCounts[day] = (dailyCounts[day] ?? 0) + 1;
    if (row.event_name === 'app_opened') {
      dailyVisits[day] ??= new Set<string>();
      dailyVisits[day].add(visitorId(row));
      addCount(genderCounts, row.metadata?.gender);
    }
    if (row.event_name === 'session_ended') {
      const seconds = Number(row.metadata?.duration_seconds);
      if (Number.isFinite(seconds) && seconds >= 0 && seconds <= 86400) sessionDurations.push(seconds);
    }
  }

  const allDays = new Set([...Object.keys(dailyCounts), ...Object.keys(dailyVisits)]);
  const daily = [...allDays].sort().map((date) => ({
    date,
    count: dailyCounts[date] ?? 0,
    visits: dailyVisits[date]?.size ?? 0,
  }));

  const uniqueSessions = new Set(rows.map((row) => row.session_id)).size;
  const uniqueVisitors = periodVisitors.size;
  const returningUsers = Math.max(0, uniqueVisitors - newUsers);
  const averageSessionSeconds = sessionDurations.length
    ? Math.round(sessionDurations.reduce((sum, value) => sum + value, 0) / sessionDurations.length)
    : 0;

  return json({
    generatedAt: new Date().toISOString(),
    since,
    totals: {
      events: rows.length,
      uniqueSessions,
      uniqueVisitors,
      visits: opens.length,
      newUsers,
      returningUsers,
      averageSessionSeconds,
    },
    events: sortedCounts(eventCounts),
    cities: sortedCounts(cityCounts),
    languages: sortedCounts(languageCounts),
    genders: sortedCounts(genderCounts),
    daily,
  });
});
