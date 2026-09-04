import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { LockKeyhole, LogOut, RefreshCw, X } from 'lucide-react';
import { getAdminEmail, isSupabaseConfigured, supabase } from '../lib/supabase';
import { useLanguage } from '../i18n';

type Dashboard = {
  generatedAt: string;
  since: string;
  totals: { events: number; uniqueSessions: number };
  events: Array<{ key: string; count: number }>;
  cities: Array<{ key: string; count: number }>;
  languages: Array<{ key: string; count: number }>;
  daily: Array<{ date: string; count: number }>;
};

const copy = {
  ru: {
    open: 'Открыть служебную панель', login: 'Вход администратора', password: 'Пароль', enter: 'Войти', close: 'Закрыть', logout: 'Выйти', unavailable: 'Supabase ещё не настроен.', invalid: 'Неверный пароль или администратор не настроен.', forbidden: 'Доступ запрещён.', failed: 'Не удалось загрузить статистику.', title: 'Статистика МетеоОдевайки', period: 'Период', days: 'дней', refresh: 'Обновить', events: 'События', sessions: 'Уникальные сессии', daily: 'Активность по дням', popularEvents: 'События', cities: 'Города', languages: 'Языки', noData: 'Пока нет данных', emailMissing: 'Укажите VITE_ADMIN_EMAIL в настройках Render.', supabaseMissing: 'Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в Render.', loading: 'Загрузка…', adminOnly: 'Этот раздел доступен только владельцу проекта.'
  },
  en: {
    open: 'Open service panel', login: 'Administrator sign in', password: 'Password', enter: 'Sign in', close: 'Close', logout: 'Sign out', unavailable: 'Supabase is not configured yet.', invalid: 'Invalid password or administrator is not configured.', forbidden: 'Access denied.', failed: 'Could not load analytics.', title: 'MeteoOdevayka analytics', period: 'Period', days: 'days', refresh: 'Refresh', events: 'Events', sessions: 'Unique sessions', daily: 'Daily activity', popularEvents: 'Events', cities: 'Cities', languages: 'Languages', noData: 'No data yet', emailMissing: 'Set VITE_ADMIN_EMAIL in Render settings.', supabaseMissing: 'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Render.', loading: 'Loading…', adminOnly: 'This section is available only to the project owner.'
  },
} as const;

function formatDate(value: string, language: 'ru' | 'en') {
  return new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-US', { month: 'short', day: 'numeric' }).format(new Date(value));
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-2xl font-black text-slate-800">{value.toLocaleString()}</p></div>;
}

function Ranking({ title, rows, empty }: { title: string; rows: Array<{ key: string; count: number }>; empty: string }) {
  const max = Math.max(...rows.map((row) => row.count), 1);
  return <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm"><h3 className="text-sm font-black text-slate-800">{title}</h3><div className="mt-3 space-y-2">{rows.length ? rows.slice(0, 8).map((row) => <div key={row.key} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 text-xs"><span className="truncate text-slate-600">{row.key}</span><span className="font-black text-slate-800">{row.count}</span><span className="col-span-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-violet-400" style={{ width: `${Math.max(5, (row.count / max) * 100)}%` }} /></span></div>) : <p className="text-xs text-slate-400">{empty}</p>}</div></div>;
}

export function AdminModal({ onClose }: { onClose: () => void }) {
  const language = useLanguage();
  const text = copy[language];
  const [password, setPassword] = useState('');
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [days, setDays] = useState(30);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [signedIn, setSignedIn] = useState(false);
  const configured = isSupabaseConfigured && Boolean(getAdminEmail()) && Boolean(supabase);

  const loadDashboard = async (period = days) => {
    if (!supabase) return;
    setBusy(true); setMessage('');
    const { data, error } = await supabase.functions.invoke(`admin-dashboard?days=${period}`, { method: 'GET' });
    if (error || !data || data.error) setMessage(data?.error === 'forbidden' ? text.forbidden : text.failed);
    else setDashboard(data as Dashboard);
    setBusy(false);
  };

  const login = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || !getAdminEmail()) { setMessage(!getAdminEmail() ? text.emailMissing : text.supabaseMissing); return; }
    setBusy(true); setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email: getAdminEmail(), password });
    if (error) { setMessage(text.invalid); setBusy(false); return; }
    setSignedIn(true); setPassword(''); await loadDashboard();
  };

  useEffect(() => { if (supabase) void supabase.auth.getSession().then(({ data }) => { if (data.session) { setSignedIn(true); void loadDashboard(); } }); }, []);

  const logout = async () => { await supabase?.auth.signOut(); setSignedIn(false); setDashboard(null); };
  const maxDaily = useMemo(() => Math.max(...(dashboard?.daily ?? []).map((row) => row.count), 1), [dashboard]);

  return <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/35 p-2 backdrop-blur-sm sm:items-center sm:p-6">
    <section role="dialog" aria-modal="true" aria-labelledby="admin-title" className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/70 bg-slate-50 p-4 shadow-2xl sm:p-6">
      <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><LockKeyhole className="text-violet-600" size={20} /><h2 id="admin-title" className="text-lg font-black text-slate-800">{signedIn ? text.title : text.login}</h2></div><button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-white" aria-label={text.close}><X size={18} /></button></div>
      {!configured && !signedIn && <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold leading-relaxed text-amber-800">{isSupabaseConfigured ? text.emailMissing : text.supabaseMissing}</p>}
      {!signedIn ? <form onSubmit={login} className="mx-auto mt-6 max-w-sm space-y-3"><p className="text-xs leading-relaxed text-slate-500">{text.adminOnly}</p><label className="block"><span className="mb-1 block text-xs font-bold text-slate-600">{text.password}</span><input autoFocus type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-violet-200 focus:ring-4" autoComplete="current-password" /></label>{message && <p className="text-xs font-bold text-rose-600">{message}</p>}<button type="submit" disabled={busy || !configured || !password} className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-50">{busy && <RefreshCw className="animate-spin" size={14} />}{text.enter}</button></form> : <div className="mt-5 space-y-5"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><select value={days} onChange={(event) => setDays(Number(event.target.value))} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold"><option value={7}>7 {text.days}</option><option value={30}>30 {text.days}</option><option value={90}>90 {text.days}</option></select><button type="button" onClick={() => void loadDashboard()} disabled={busy} className="inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-white px-3 py-2 text-xs font-black text-violet-700">{busy ? <RefreshCw className="animate-spin" size={14} /> : <RefreshCw size={14} />}{text.refresh}</button></div><button type="button" onClick={() => void logout()} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black text-slate-500 hover:bg-white"><LogOut size={14} />{text.logout}</button></div>{message && <p className="rounded-xl border border-rose-200 bg-rose-50 p-2 text-xs font-bold text-rose-700">{message}</p>}{dashboard && <><div className="grid gap-3 sm:grid-cols-2"><Metric label={text.events} value={dashboard.totals.events} /><Metric label={text.sessions} value={dashboard.totals.uniqueSessions} /></div><div className="grid gap-4 lg:grid-cols-2"><div className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm"><h3 className="text-sm font-black text-slate-800">{text.daily}</h3><div className="mt-4 flex h-32 items-end gap-1 overflow-hidden">{dashboard.daily.length ? dashboard.daily.map((row) => <div key={row.date} className="group flex h-full flex-1 flex-col justify-end" title={`${formatDate(row.date, language)}: ${row.count}`}><div className="min-h-1 rounded-t bg-violet-400" style={{ height: `${Math.max(3, (row.count / maxDaily) * 100)}%` }} /></div>) : <p className="self-center text-xs text-slate-400">{text.noData}</p>}</div></div><Ranking title={text.popularEvents} rows={dashboard.events} empty={text.noData} /><Ranking title={text.cities} rows={dashboard.cities} empty={text.noData} /><Ranking title={text.languages} rows={dashboard.languages} empty={text.noData} /></div></>}</div>}
    </section>
  </div>;
}
