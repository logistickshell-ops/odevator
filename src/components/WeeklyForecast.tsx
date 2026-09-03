import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Check, Copy, RefreshCw, Send } from 'lucide-react';
import { CityData, ChildProfile, DayForecast, WeatherData, WeatherPeriodType } from '../types';
import { calculateWeatherFeel, generateOutfit, interpretWeatherCode } from '../utils/weatherEngine';
import { copyText, getBotInviteUrl, shareViaTelegram } from '../utils/telegramShare';
import { formatDate, tr, useLanguage } from '../i18n';

const STORAGE_KEY = 'meteo_weekly_forecast_v1';
const PERIODS: Array<[WeatherPeriodType, number]> = [['morning', 8], ['day', 14], ['evening', 18], ['night', 23]];

type WeeklyForecastProps = { city: CityData; child: ChildProfile };
type SavedWeeklyForecast = { cityKey: string; childKey: string; savedAt: string; days: DayForecast[] };

function valueAt(values: Array<number | null> | undefined, index: number, fallback: number) {
  const value = values?.[index];
  return typeof value === 'number' ? value : fallback;
}

function localHour(timestamp: string) {
  const match = timestamp.match(/T(\d{2}):/);
  return match ? Number(match[1]) : -1;
}

function buildPeriodWeather(hourly: NonNullable<NonNullable<import('../types').OpenMeteoForecastResponse['hourly']>>, index: number): WeatherData {
  const temp = valueAt(hourly.temperature_2m, index, 15);
  const windSpeed = valueAt(hourly.wind_speed_10m, index, 5);
  const humidity = valueAt(hourly.relative_humidity_2m, index, 50);
  const weatherCode = valueAt(hourly.weather_code, index, 0);
  const interpreted = interpretWeatherCode(weatherCode);
  return {
    temp,
    feelsLike: valueAt(hourly.apparent_temperature, index, calculateWeatherFeel(temp, windSpeed, humidity)),
    windSpeed,
    humidity,
    precipProb: valueAt(hourly.precipitation_probability, index, 0),
    weatherCode,
    description: interpreted.description,
    icon: interpreted.icon,
    isRainy: interpreted.isRain,
    isSnowy: interpreted.isSnow,
    isWindy: windSpeed > 15,
  };
}

function createDays(response: import('../types').OpenMeteoForecastResponse, child: ChildProfile) {
  const hourly = response.hourly;
  if (!hourly?.time?.length) throw new Error(tr('Не удалось получить недельный прогноз.'));
  const grouped = new Map<string, number[]>();
  hourly.time.forEach((timestamp, index) => {
    const date = timestamp.slice(0, 10);
    const list = grouped.get(date) ?? [];
    list.push(index);
    grouped.set(date, list);
  });
  return [...grouped.entries()].slice(0, 7).map(([date, indices]) => {
    const findIndex = (hour: number) => indices.reduce((best, index) => Math.abs(localHour(hourly.time[index]) - hour) < Math.abs(localHour(hourly.time[best]) - hour) ? index : best, indices[0]);
    const periods = Object.fromEntries(PERIODS.map(([period, hour]) => [period, buildPeriodWeather(hourly, findIndex(hour))])) as DayForecast['periods'];
    return { date, formattedDate: formatDate(`${date}T12:00:00`, { weekday: 'short', day: 'numeric', month: 'short' }), periods };
  });
}

export function WeeklyForecast({ city, child }: WeeklyForecastProps) {
  useLanguage();
  const [days, setDays] = useState<DayForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [savedAt, setSavedAt] = useState<string>();
  const [copied, setCopied] = useState(false);
  const cityKey = `${city.lat}:${city.lon}`;
  const childKey = `${child.id}:${child.ageGroup}:${child.activityLevel}:${child.coldSensitivity}`;
  const inviteUrl = useMemo(getBotInviteUrl, []);

  const loadSaved = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as SavedWeeklyForecast | null;
      if (saved?.cityKey === cityKey && saved.childKey === childKey) {
        setDays(saved.days); setSavedAt(saved.savedAt);
      }
    } catch { /* corrupted local cache is ignored */ }
  };

  const loadForecast = async () => {
    setLoading(true); setError(undefined);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m&forecast_days=7&timezone=auto`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(tr('Сервис погоды временно недоступен.'));
      const data = await response.json() as import('../types').OpenMeteoForecastResponse;
      const nextDays = createDays(data, child);
      const now = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ cityKey, childKey, savedAt: now, days: nextDays } satisfies SavedWeeklyForecast));
      setDays(nextDays); setSavedAt(now);
    } catch (e) {
      setError(e instanceof Error ? e.message : tr('Не удалось загрузить прогноз.'));
      loadSaved();
    } finally { setLoading(false); }
  };

  useEffect(() => { loadSaved(); void loadForecast(); }, [cityKey, childKey]);

  const shareText = useMemo(() => {
    if (!days.length) return '';
    const lines = [`📅 ${tr('Прогноз гардероба на 7 дней')} · ${city.name}`, `${tr('Профиль')}: ${child.name || tr('Ребёнок')}`];
    days.forEach((day) => {
      const weather = day.periods.day;
      const outfit = generateOutfit(child.gender, weather, child.activityLevel, child.coldSensitivity, child.ageGroup, 'day');
      const items = [...outfit.outer, ...outfit.upper, ...outfit.lower, ...outfit.headwear, ...outfit.shoes].map((item) => item.name).slice(0, 6).join(', ');
      lines.push(`${day.formattedDate}: ${weather.temp > 0 ? '+' : ''}${Math.round(weather.temp)}°C · ${items}`);
    });
    return lines.join('\n');
  }, [days, city.name, child]);

  const share = () => shareViaTelegram({ title: tr('Прогноз гардероба на 7 дней'), text: `${shareText}\n\n${inviteUrl}`, url: inviteUrl });
  const copy = async () => { setCopied(await copyText(`${shareText}\n\n${inviteUrl}`)); window.setTimeout(() => setCopied(false), 2200); };

  return <section className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50/80 via-white to-sky-50/70 p-4 shadow-sm sm:p-6">
    <div className="flex items-start justify-between gap-3"><div className="flex items-start gap-3"><div className="rounded-2xl bg-violet-100 p-3 text-violet-700"><CalendarDays size={22} /></div><div><h2 className="text-base font-black text-slate-800 sm:text-xl">{tr('Прогноз гардероба на 7 дней')}</h2><p className="mt-1 text-[11px] leading-relaxed text-slate-500 sm:text-xs">{tr('Бесплатный план одежды по дням для выбранного ребёнка и города.')}</p></div></div><button type="button" onClick={() => void loadForecast()} disabled={loading} className="rounded-xl bg-white p-2 text-violet-600 shadow-sm disabled:opacity-50" aria-label={tr('Обновить прогноз')}>{loading ? <RefreshCw className="animate-spin" size={16} /> : <RefreshCw size={16} />}</button></div>
    {error && <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-2 text-xs font-bold text-rose-700">{error}</p>}
    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{days.map((day) => { const weather = day.periods.day; const outfit = generateOutfit(child.gender, weather, child.activityLevel, child.coldSensitivity, child.ageGroup, 'day'); const items = [...outfit.outer, ...outfit.upper, ...outfit.lower, ...outfit.headwear, ...outfit.shoes].map((item) => item.name).slice(0, 5); return <article key={day.date} className="rounded-2xl border border-white bg-white/80 p-3"><div className="flex items-center justify-between gap-2"><h3 className="text-xs font-black capitalize text-slate-800">{day.formattedDate}</h3><span className="text-sm font-black text-sky-700">{weather.temp > 0 ? '+' : ''}{Math.round(weather.temp)}°C</span></div><p className="mt-1 text-[10px] font-semibold text-slate-500">{weather.description} · {tr('ощущается')} {Math.round(weather.feelsLike)}°C</p><p className="mt-2 text-[10px] leading-relaxed text-slate-600">{items.join(' · ')}</p></article>; })}</div>
    <div className="mt-4 flex flex-wrap items-center gap-2"><button type="button" onClick={share} disabled={!days.length} className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-3 py-2 text-[10px] font-black text-white disabled:opacity-50"><Send size={14} />{tr('Отправить в Telegram')}</button><button type="button" onClick={copy} disabled={!days.length} className="inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-white px-3 py-2 text-[10px] font-black text-violet-700 disabled:opacity-50">{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? tr('Скопировано') : tr('Скопировать прогноз')}</button>{savedAt && <span className="text-[10px] text-slate-400">{tr('Сохранено')} · {formatDate(savedAt, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>}</div>
  </section>;
}
