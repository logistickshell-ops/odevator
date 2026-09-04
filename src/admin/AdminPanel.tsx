import { FormEvent, useEffect, useMemo, useState } from 'react';
import { LockKeyhole, LogOut, RefreshCw, X } from 'lucide-react';
import { getAdminEmail, isSupabaseConfigured, supabase } from '../lib/supabase';

type CountRow = { key: string; count: number };
type DailyRow = { date: string; count: number; visits: number };
type Dashboard = {
  generatedAt: string;
  since: string;
  totals: {
    events: number;
    uniqueSessions: number;
    uniqueVisitors: number;
    visits: number;
    newUsers: number;
    returningUsers: number;
    averageSessionSeconds: number;
  };
  events: CountRow[];
  cities: CountRow[];
  languages: CountRow[];
  genders: CountRow[];
  daily: DailyRow[];
};

const ru = {
  login: 'Вход администратора',
  password: 'Пароль',
  enter: 'Войти',
  close: 'Закрыть',
  logout: 'Выйти',
  invalid: 'Неверный пароль или администратор не настроен.',
  forbidden: 'Доступ запрещён.',
  failed: 'Не удалось загрузить статистику.',
  title: 'Статистика МетеоОдевайки',
  days: 'дней',
  refresh: 'Обновить',
  events: 'События',
  visitors: 'Посетители',
  visits: 'Визиты',
  newUsers: 'Новые пользователи',
  returningUsers: 'Повторные входы',
  averageTime: 'Среднее время на сайте',
  daily: 'Динамика по дням',
  popularEvents: 'Популярные действия',
  cities: 'Города',
  genders: 'Пол детей',
  languages: 'Языки',
  noData: 'Пока нет данных',
  emailMissing: 'Укажите VITE_ADMIN_EMAIL в настройках Render.',
  supabaseMissing: 'Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в Render.',
  loading: 'Загрузка…',
  adminOnly: 'Этот раздел доступен только владельцу проекта.',
  eventsLine: 'события',
  visitsLine: 'визиты',
  girl: 'Девочки',
  boy: 'Мальчики',
  unknownGender: 'Не указан',
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short' }).format(new Date(`${value}T12:00:00`));
}

function formatDuration(seconds: number) {
  if (!seconds) return '—';
  if (seconds < 60) return `${seconds} с`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest ? `${minutes} мин ${rest} с` : `${minutes} мин`;
}

function displayCity(value: string) {
  if (!value) return 'Не указан';
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function displayGender(value: string) {
  if (value === 'girl') return ru.girl;
  if (value === 'boy') return ru.boy;
  return ru.unknownGender;
}

function Metric({ label, value, accent = 'text-slate-800' }: { label: string; value: string | number; accent?: string }) {
  return <div className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className={`mt-1 text-2xl font-black ${accent}`}>{typeof value === 'number' ? value.toLocaleString('ru-RU') : value}</p></div>;
}

function Ranking({ title, rows, empty, label = displayCity }: { title: string; rows: CountRow[]; empty: string; label?: (value: string) => string }) {
  const max = Math.max(...rows.map((row) => row.count), 1);
  return <div className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm"><h3 className="text-sm font-black text-slate-800">{title}</h3><div className="mt-3 space-y-3">{rows.length ? rows.slice(0, 8).map((row) => <div key={row.key} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 text-xs"><span className="truncate text-slate-600">{label(row.key)}</span><span className="font-black text-slate-800">{row.count.toLocaleString('ru-RU')}</span><span className="col-span-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-violet-400" style={{ width: `${Math.max(5, (row.count / max) * 100)}%` }} /></span></div>) : <p className="text-xs text-slate-400">{empty}</p>}</div></div>;
}

function DailyChart({ rows }: { rows: DailyRow[] }) {
  const width = 720;
  const height = 220;
  const padX = 28;
  const padY = 24;
  const max = Math.max(...rows.flatMap((row) => [row.count, row.visits]), 1);
  const x = (index: number) => rows.length <= 1 ? width / 2 : padX + (index * (width - padX * 2)) / (rows.length - 1);
  const y = (value: number) => height - padY - (value / max) * (height - padY * 2);
  const path = (field: 'count' | 'visits') => rows.map((row, index) => `${index ? 'L' : 'M'} ${x(index).toFixed(1)} ${y(row[field]).toFixed(1)}`).join(' ');
  const labels = rows.length > 12 ? rows.filter((_, index) => index % Math.ceil(rows.length / 8) === 0) : rows;

  if (!rows.length) return <p className="py-12 text-center text-xs text-slate-400">{ru.noData}</p>;
  return <div className="overflow-x-auto"><svg viewBox={`0 0 ${width} ${height}`} className="h-56 min-w-[620px] w-full" role="img" aria-label="График активности по дням"><line x1={padX} y1={height - padY} x2={width - padX} y2={height - padY} stroke="#e2e8f0" /><line x1={padX} y1={padY} x2={width - padX} y2={padY} stroke="#f1f5f9" /><path d={path('count')} fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><path d={path('visits')} fill="none" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{rows.map((row, index) => <g key={row.date}><circle cx={x(index)} cy={y(row.count)} r="3.5" fill="#8b5cf6" /><circle cx={x(index)} cy={y(row.visits)} r="3.5" fill="#14b8a6" /></g>)}{labels.map((row) => { const index = rows.indexOf(row); return <text key={`label-${row.date}`} x={x(index)} y={height - 6} textAnchor="middle" fontSize="10" fill="#64748b">{formatDate(row.date)}</text>; })}</svg><div className="mt-1 flex gap-4 text-[11px] font-bold text-slate-500"><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-violet-500" />{ru.eventsLine}</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-teal-500" />{ru.visitsLine}</span></div></div>;
}

export function AdminModal({ onClose }: { onClose: () => void }) {
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
    if (error || !data || data.error) setMessage(data?.error === 'forbidden' ? ru.forbidden : ru.failed);
    else setDashboard(data as Dashboard);
    setBusy(false);
  };

  const login = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || !getAdminEmail()) { setMessage(!getAdminEmail() ? ru.emailMissing : ru.supabaseMissing); return; }
    setBusy(true); setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email: getAdminEmail(), password });
    if (error) { setMessage(ru.invalid); setBusy(false); return; }
    setSignedIn(true); setPassword(''); await loadDashboard();
  };

  useEffect(() => { if (supabase) void supabase.auth.getSession().then(({ data }) => { if (data.session) { setSignedIn(true); void loadDashboard(); } }); }, []);
  const logout = async () => { await supabase?.auth.signOut(); setSignedIn(false); setDashboard(null); };
  const totalRows = useMemo(() => dashboard?.daily.length ?? 0, [dashboard]);

  return <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/35 p-2 backdrop-blur-sm sm:items-center sm:p-6"><section role="dialog" aria-modal="true" aria-labelledby="admin-title" className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-white/70 bg-slate-50 p-4 shadow-2xl sm:p-6"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><LockKeyhole className="text-violet-600" size={20} /><h2 id="admin-title" className="text-lg font-black text-slate-800">{signedIn ? ru.title : ru.login}</h2></div><button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-white" aria-label={ru.close}><X size={18} /></button></div>{!configured && !signedIn && <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold leading-relaxed text-amber-800">{isSupabaseConfigured ? ru.emailMissing : ru.supabaseMissing}</p>}{!signedIn ? <form onSubmit={login} className="mx-auto mt-6 max-w-sm space-y-3"><p className="text-xs leading-relaxed text-slate-500">{ru.adminOnly}</p><label className="block"><span className="mb-1 block text-xs font-bold text-slate-600">{ru.password}</span><input autoFocus type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-violet-200 focus:ring-4" autoComplete="current-password" /></label>{message && <p className="text-xs font-bold text-rose-600">{message}</p>}<button type="submit" disabled={busy || !configured || !password} className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-50">{busy && <RefreshCw className="animate-spin" size={14} />}{ru.enter}</button></form> : <div className="mt-5 space-y-5"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><select value={days} onChange={(event) => { const next = Number(event.target.value); setDays(next); void loadDashboard(next); }} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold"><option value={7}>7 {ru.days}</option><option value={30}>30 {ru.days}</option><option value={90}>90 {ru.days}</option></select><button type="button" onClick={() => void loadDashboard()} disabled={busy} className="inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-white px-3 py-2 text-xs font-black text-violet-700">{busy ? <RefreshCw className="animate-spin" size={14} /> : <RefreshCw size={14} />}{ru.refresh}</button></div><button type="button" onClick={() => void logout()} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black text-slate-500 hover:bg-white"><LogOut size={14} />{ru.logout}</button></div>{message && <p className="rounded-xl border border-rose-200 bg-rose-50 p-2 text-xs font-bold text-rose-700">{message}</p>}{dashboard && <><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><Metric label={ru.events} value={dashboard.totals.events} /><Metric label={ru.visitors} value={dashboard.totals.uniqueVisitors} accent="text-violet-700" /><Metric label={ru.visits} value={dashboard.totals.visits} accent="text-teal-700" /><Metric label={ru.newUsers} value={dashboard.totals.newUsers} accent="text-emerald-700" /><Metric label={ru.returningUsers} value={dashboard.totals.returningUsers} accent="text-amber-700" /><Metric label={ru.averageTime} value={formatDuration(dashboard.totals.averageSessionSeconds)} accent="text-sky-700" /></div><div className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm"><div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-black text-slate-800">{ru.daily}</h3><span className="text-[11px] text-slate-400">{totalRows} дней с активностью</span></div><DailyChart rows={dashboard.daily} /></div><div className="grid gap-4 lg:grid-cols-2"><Ranking title={ru.popularEvents} rows={dashboard.events} empty={ru.noData} label={(value) => value.replace(/_/g, ' ')} /><Ranking title={ru.cities} rows={dashboard.cities} empty={ru.noData} /><Ranking title={ru.genders} rows={dashboard.genders} empty={ru.noData} label={displayGender} /><Ranking title={ru.languages} rows={dashboard.languages} empty={ru.noData} /></div></>}</div>}</section></div>;
}
