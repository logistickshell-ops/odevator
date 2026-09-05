import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('APP_ORIGIN') ?? 'https://childs-dresser.onrender.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

function json(body: unknown, status = 200) { return new Response(JSON.stringify(body), { status, headers: corsHeaders }); }
function startOfPeriod(days: number) { const safeDays = Math.max(1, Math.min(90, Math.round(days))); return new Date(Date.now() - safeDays * 86400000).toISOString(); }
function visitorId(row: any) { const value = row?.metadata?.visitor_id; return typeof value === 'string' && value ? value : row.session_id; }
function addCount(result: Record<string, number>, key: unknown) { if (typeof key === 'string' && key) result[key] = (result[key] ?? 0) + 1; }
function sortedCounts(result: Record<string, number>, limit = 20) { return Object.entries(result).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([key, count]) => ({ key, count })); }
function dayKey(value: string) { return value.slice(0, 10); }
function dateDiff(a: string, b: string) { return Math.floor((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000); }
function visitorSets(rows: any[], names: string[]) { const result = new Set<string>(); for (const row of rows) if (names.includes(row.event_name)) result.add(visitorId(row)); return result; }
function conversion(from: number, to: number) { return from ? Math.round((to / from) * 1000) / 10 : 0; }

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'GET') return json({ error: 'method_not_allowed' }, 405);
  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) return json({ error: 'unauthorized' }, 401);

  const userClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!, { global: { headers: { Authorization: authorization } } });
  const { data: userData, error: userError } = await userClient.auth.getUser();
  const adminEmail = (Deno.env.get('ADMIN_EMAIL') ?? '').trim().toLowerCase();
  if (userError || !userData.user || !adminEmail || userData.user.email?.toLowerCase() !== adminEmail) return json({ error: 'forbidden' }, 403);
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!serviceKey) return json({ error: 'server_not_configured' }, 503);

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey);
  const url = new URL(request.url);
  const since = startOfPeriod(Number(url.searchParams.get('days') ?? 30));
  const { data: events, error } = await admin.from('analytics_events').select('event_name, session_id, city_key, language, child_count, metadata, created_at').gte('created_at', since).order('created_at', { ascending: true }).limit(20000);
  if (error) { console.error('dashboard query failed', error.message); return json({ error: 'storage_failed' }, 500); }
  const { data: allOpens, error: opensError } = await admin.from('analytics_events').select('event_name, session_id, metadata, created_at').eq('event_name', 'app_opened').order('created_at', { ascending: true }).limit(100000);
  if (opensError) { console.error('dashboard visitor query failed', opensError.message); return json({ error: 'storage_failed' }, 500); }

  const rows = events ?? [];
  const opens = rows.filter((row) => row.event_name === 'app_opened');
  const allOpenRows = allOpens ?? [];
  const periodVisitors = new Set(opens.map(visitorId));
  const firstSeen = new Map<string, string>();
  const visitorDays = new Map<string, Set<string>>();
  for (const row of allOpenRows) {
    const id = visitorId(row);
    if (!firstSeen.has(id)) firstSeen.set(id, dayKey(row.created_at));
    const days = visitorDays.get(id) ?? new Set<string>(); days.add(dayKey(row.created_at)); visitorDays.set(id, days);
  }
  let newUsers = 0;
  for (const id of periodVisitors) if ((firstSeen.get(id) ?? '') >= dayKey(since)) newUsers += 1;
  const returningUsers = Math.max(0, periodVisitors.size - newUsers);

  const eventCounts: Record<string, number> = {}, cityCounts: Record<string, number> = {}, languageCounts: Record<string, number> = {}, genderCounts: Record<string, number> = {}, dailyCounts: Record<string, number> = {};
  const dailyVisits: Record<string, Set<string>> = {}, technicalValues: Record<string, number[]> = {}, itemCounts: Record<string, number> = {}, itemNames: Record<string, string> = {}, itemCategories: Record<string, string> = {};
  const durations: number[] = [];
  for (const row of rows) {
    addCount(eventCounts, row.event_name); addCount(cityCounts, row.city_key); addCount(languageCounts, row.language);
    const day = dayKey(row.created_at); dailyCounts[day] = (dailyCounts[day] ?? 0) + 1;
    if (row.event_name === 'app_opened') { dailyVisits[day] ??= new Set<string>(); dailyVisits[day].add(visitorId(row)); addCount(genderCounts, row.metadata?.gender); }
    if (row.event_name === 'session_ended') { const seconds = Number(row.metadata?.duration_seconds); if (Number.isFinite(seconds) && seconds >= 0 && seconds <= 86400) durations.push(seconds); }
    if (row.event_name === 'technical_metric') { const metric = typeof row.metadata?.metric === 'string' ? row.metadata.metric : 'unknown'; const value = Number(row.metadata?.value); if (Number.isFinite(value)) (technicalValues[metric] ??= []).push(value); }
    if (row.event_name === 'outfit_item_opened') { const id = typeof row.metadata?.item_id === 'string' ? row.metadata.item_id : 'unknown'; addCount(itemCounts, id); if (typeof row.metadata?.item_name === 'string') itemNames[id] = row.metadata.item_name; if (typeof row.metadata?.item_category === 'string') itemCategories[id] = row.metadata.item_category; }
  }
  const allDays = new Set([...Object.keys(dailyCounts), ...Object.keys(dailyVisits)]);
  const daily = [...allDays].sort().map((date) => ({ date, count: dailyCounts[date] ?? 0, visits: dailyVisits[date]?.size ?? 0 }));
  const uniqueSessions = new Set(rows.map((row) => row.session_id)).size;
  const averageSessionSeconds = durations.length ? Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length) : 0;

  const funnelDefinitions: Array<[string, string[]]> = [['Открыли приложение', ['app_opened']], ['Выбрали город', ['city_changed', 'funnel_city_selected']], ['Получили погоду', ['weather_loaded', 'funnel_weather_loaded']], ['Увидели комплект', ['funnel_outfit_viewed', 'funnel_outfit_generated', 'outfit_generated']], ['Открыли недельный прогноз', ['weekly_forecast_loaded', 'funnel_weekly_forecast_opened']], ['Начали отправку', ['weekly_forecast_shared', 'telegram_share_started', 'funnel_share_started']], ['Завершили отправку', ['telegram_share_completed', 'funnel_share_completed']]];
  const funnel = funnelDefinitions.map(([label, names]) => { const visitors = visitorSets(rows, names).size; return { key: label, visitors, conversion: conversion(periodVisitors.size, visitors) }; });

  const monetizationNames = ['pricing_viewed', 'payment_started', 'telegram_invoice_created', 'payment_completed', 'telegram_payment_completed', 'payment_cancelled', 'telegram_payment_cancelled', 'payment_failed', 'telegram_payment_failed'];
  const monetizationCounts: Record<string, number> = {};
  for (const row of rows) if (monetizationNames.includes(row.event_name)) addCount(monetizationCounts, row.event_name);
  const paymentStarted = (monetizationCounts.payment_started ?? 0) + (monetizationCounts.telegram_payment_started ?? 0);
  const paymentCompleted = (monetizationCounts.payment_completed ?? 0) + (monetizationCounts.telegram_payment_completed ?? 0);
  const telegramCounts: Record<string, number> = {};
  for (const row of rows) if (row.event_name.startsWith('telegram_') || row.metadata?.source === 'telegram') addCount(telegramCounts, row.event_name);
  const technical = Object.entries(technicalValues).map(([metric, values]) => ({ metric, count: values.length, average: Math.round(values.reduce((a, b) => a + b, 0) / values.length), min: Math.min(...values), max: Math.max(...values) }));
  const items = Object.entries(itemCounts).sort((a, b) => b[1] - a[1]).slice(0, 30).map(([itemId, count]) => ({ itemId, name: itemNames[itemId] ?? itemId, category: itemCategories[itemId] ?? 'unknown', count }));

  const cohortMap: Record<string, { users: number; d1: number; d7: number; d30: number }> = {};
  for (const id of periodVisitors) { const cohort = firstSeen.get(id); const days = visitorDays.get(id) ?? new Set<string>(); if (!cohort) continue; cohortMap[cohort] ??= { users: 0, d1: 0, d7: 0, d30: 0 }; cohortMap[cohort].users += 1; if ([...days].some((day) => dateDiff(cohort, day) >= 1)) cohortMap[cohort].d1 += 1; if ([...days].some((day) => dateDiff(cohort, day) >= 7)) cohortMap[cohort].d7 += 1; if ([...days].some((day) => dateDiff(cohort, day) >= 30)) cohortMap[cohort].d30 += 1; }
  const retention = Object.entries(cohortMap).sort((a, b) => a[0].localeCompare(b[0])).map(([cohort, value]) => ({ cohort, users: value.users, d1: conversion(value.users, value.d1), d7: conversion(value.users, value.d7), d30: conversion(value.users, value.d30) }));

  return json({ generatedAt: new Date().toISOString(), since, totals: { events: rows.length, uniqueSessions, uniqueVisitors: periodVisitors.size, visits: opens.length, newUsers, returningUsers, averageSessionSeconds }, events: sortedCounts(eventCounts), cities: sortedCounts(cityCounts), languages: sortedCounts(languageCounts), genders: sortedCounts(genderCounts), daily, funnel, monetization: { counts: sortedCounts(monetizationCounts), paymentStarted, paymentCompleted, conversion: conversion(paymentStarted, paymentCompleted) }, telegram: { counts: sortedCounts(telegramCounts), visitors: visitorSets(rows, ['telegram_app_opened']).size }, technical, items, retention });
});
