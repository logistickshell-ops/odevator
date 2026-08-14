import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import {
  ActivityLevel,
  AgeGroup,
  ColdSensitivity,
  ParentTip,
  ParentTipCategory,
  RecommendedOutfit,
  WeatherData,
  WeatherPeriodType,
} from '../types';
import {
  ACTIVITY_LABELS,
  AGE_GROUP_LABELS,
  getChildDisplayName,
  SENSITIVITY_LABELS,
} from '../utils/childProfile';

interface ParentTipsSectionProps {
  tips: ParentTip[];
  weather: WeatherData;
  period: WeatherPeriodType;
  ageGroup: AgeGroup;
  activity: ActivityLevel;
  sensitivity: ColdSensitivity;
  childName: string;
  outfit: RecommendedOutfit;
}

const PERIOD_LABELS: Record<WeatherPeriodType, string> = {
  morning: 'Утро',
  day: 'День',
  evening: 'Вечер',
  night: 'Ночь',
};

const CATEGORY_META: Record<ParentTipCategory, { label: string; icon: string; color: string; badge: string }> = {
  safety: { label: 'Безопасность', icon: '🛡️', badge: '🛡️ Безопасность', color: 'bg-rose-50 border-rose-200 text-rose-950' },
  alerts: { label: 'Риски', icon: '⚠️', badge: '⚠️ Погодный риск', color: 'bg-amber-50 border-amber-200 text-amber-950' },
  time: { label: 'Время', icon: '🕒', badge: '🕒 Время прогулки', color: 'bg-violet-50 border-violet-200 text-violet-950' },
  essentials: { label: 'С собой', icon: '🎒', badge: '🎒 Собрать в рюкзак', color: 'bg-sky-50 border-sky-200 text-sky-950' },
  age: { label: 'Профиль', icon: '👤', badge: '👤 Профиль ребёнка', color: 'bg-pink-50 border-pink-200 text-pink-950' },
  practical: { label: 'Практика', icon: '🧩', badge: '🧩 Практический шаг', color: 'bg-emerald-50 border-emerald-200 text-emerald-950' },
};

const formatTemperature = (value: number) => `${value > 0 ? '+' : ''}${value}°C`;

export const ParentTipsSection: React.FC<ParentTipsSectionProps> = ({
  tips,
  weather,
  period,
  ageGroup,
  activity,
  sensitivity,
  childName,
  outfit,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | ParentTipCategory>('all');
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const filteredTips = useMemo(() => {
    if (selectedCategory === 'all') return tips;
    return tips.filter((tip) => tip.category === selectedCategory);
  }, [tips, selectedCategory]);

  const categories = useMemo(() => {
    const available = (Object.keys(CATEGORY_META) as ParentTipCategory[])
      .map((id) => ({ id, ...CATEGORY_META[id], count: tips.filter((tip) => tip.category === id).length }))
      .filter((category) => category.count > 0);
    return [{ id: 'all' as const, label: 'Все', icon: '📋', count: tips.length, color: '', badge: '' }, ...available];
  }, [tips]);

  useEffect(() => {
    setCurrentTipIndex(0);
  }, [selectedCategory, tips]);

  const currentTip = filteredTips[currentTipIndex];
  const moveTip = (direction: -1 | 1) => {
    if (filteredTips.length <= 1) return;
    setCurrentTipIndex((previous) => (previous + direction + filteredTips.length) % filteredTips.length);
  };

  const weatherRisks = [
    weather.isRainy ? 'осадки' : null,
    weather.isSnowy ? 'снег' : null,
    weather.windSpeed >= 15 ? 'сильный ветер' : null,
    weather.precipProb >= 50 ? `${weather.precipProb}% осадков` : null,
  ].filter(Boolean).join(' · ');
  const displayName = getChildDisplayName(childName);
  const profileLabel = `${AGE_GROUP_LABELS[ageGroup]} · ${ACTIVITY_LABELS[activity].toLowerCase()} · ${SENSITIVITY_LABELS[sensitivity].toLowerCase()}`;
  const mainItem = outfit.outer[0]?.name || outfit.upper[0]?.name || outfit.lower[0]?.name || 'Базовый комплект';

  return (
    <section className="rounded-2xl sm:rounded-3xl border border-slate-100 bg-white p-4 sm:p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-2.5">
          <div className="shrink-0 rounded-xl bg-amber-50 p-2.5 text-amber-600"><Lightbulb size={20} /></div>
          <div>
            <h3 className="text-base sm:text-xl font-black text-slate-800">Подсказки к этой прогулке</h3>
            <p className="mt-0.5 text-[11px] sm:text-xs leading-relaxed text-slate-500">
              {PERIOD_LABELS[period]} · ощущается как {formatTemperature(weather.feelsLike)} · {weather.description.toLowerCase()}
              {displayName ? ` · для ${displayName}` : ''}
            </p>
          </div>
        </div>
        <span className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-[10px] sm:text-xs font-bold text-slate-500">
          Листайте важное для текущего сценария
        </span>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5"><span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Погода</span><p className="mt-0.5 text-[11px] sm:text-xs font-bold text-slate-700">{weatherRisks || 'Без выраженных погодных рисков'}</p></div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5"><span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Профиль</span><p className="mt-0.5 text-[11px] sm:text-xs font-bold leading-relaxed text-slate-700">{profileLabel}</p></div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5"><span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Главное в комплекте</span><p className="mt-0.5 truncate text-[11px] sm:text-xs font-bold text-slate-700">{mainItem}</p></div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2" aria-label="Фильтр подсказок">
        {categories.map((category) => (
          <button key={category.id} type="button" onClick={() => setSelectedCategory(category.id)} className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${selectedCategory === category.id ? 'bg-sky-100 text-sky-800 shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            <span>{category.icon}</span><span className="hidden sm:inline">{category.label}</span><span className={`rounded-full px-1.5 py-0.5 text-[9px] ${selectedCategory === category.id ? 'bg-white/70' : 'bg-slate-200'}`}>{category.count}</span>
          </button>
        ))}
      </div>

      {currentTip ? (
        <div className={`rounded-2xl border-2 p-4 sm:p-6 ${CATEGORY_META[currentTip.category].color}`}>
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="mt-1 shrink-0 text-3xl leading-none sm:text-4xl">{currentTip.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><span className="rounded border border-black/10 bg-white/80 px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-700">{CATEGORY_META[currentTip.category].badge}</span><span className="text-xs sm:text-sm font-bold text-slate-500">{currentTipIndex + 1} / {filteredTips.length}</span></div>
              <h4 className="mb-2 text-sm sm:text-base font-extrabold leading-tight text-slate-800">{currentTip.title}</h4>
              <p className="text-sm sm:text-base leading-relaxed text-slate-700">{currentTip.text}</p>
            </div>
          </div>
          {filteredTips.length > 1 && <div className="mt-4 flex items-center justify-between gap-2 border-t border-black/5 pt-4"><button type="button" onClick={() => moveTip(-1)} className="flex items-center gap-1.5 rounded-lg bg-white/60 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-white"><ChevronLeft size={16} /> Назад</button><div className="flex items-center gap-1">{filteredTips.map((tip, index) => <button type="button" key={tip.id} onClick={() => setCurrentTipIndex(index)} className={`h-2 w-2 rounded-full transition-all sm:h-2.5 sm:w-2.5 ${index === currentTipIndex ? 'scale-125 bg-sky-600' : 'bg-slate-300 hover:bg-slate-400'}`} aria-label={`Совет ${index + 1}`} />)}</div><button type="button" onClick={() => moveTip(1)} className="flex items-center gap-1.5 rounded-lg bg-white/60 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-white">Вперёд <ChevronRight size={16} /></button></div>}
        </div>
      ) : <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">Для этой категории пока нет отдельных подсказок.</div>}

      <div className="mt-4 flex gap-2.5 rounded-2xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-[11px] sm:text-xs leading-relaxed text-amber-800"><AlertTriangle size={16} className="mt-0.5 shrink-0" /><p>Подсказки помогают подготовиться, но не заменяют наблюдение за ребёнком. При вялости, ознобе, перегреве или мокрой одежде измените план прогулки.</p></div>
    </section>
  );
};
