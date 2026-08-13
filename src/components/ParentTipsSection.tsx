import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, Lightbulb, RotateCcw } from 'lucide-react';
import {
  AgeGroup,
  ParentTip,
  ParentTipCategory,
  RecommendedOutfit,
  WeatherData,
  WeatherPeriodType,
} from '../types';

interface ParentTipsSectionProps {
  tips: ParentTip[];
  weather: WeatherData;
  period: WeatherPeriodType;
  ageGroup: AgeGroup;
  outfit: RecommendedOutfit;
}

const PERIOD_LABELS: Record<WeatherPeriodType, string> = {
  morning: 'утро',
  day: 'день',
  evening: 'вечер',
  night: 'ночь',
};

const CATEGORY_META: Record<ParentTipCategory, { label: string; icon: string; color: string; badge: string }> = {
  safety: { label: 'Безопасность', icon: '🛡️', badge: '🛡️ Безопасность', color: 'bg-rose-50 border-rose-200 text-rose-950' },
  alerts: { label: 'Риски', icon: '⚠️', badge: '⚠️ Погодный риск', color: 'bg-amber-50 border-amber-200 text-amber-950' },
  time: { label: 'Время', icon: '🕒', badge: '🕒 Время прогулки', color: 'bg-violet-50 border-violet-200 text-violet-950' },
  essentials: { label: 'С собой', icon: '🎒', badge: '🎒 Собрать в рюкзак', color: 'bg-sky-50 border-sky-200 text-sky-950' },
  age: { label: 'Возраст', icon: '👶', badge: '👶 Особенность возраста', color: 'bg-pink-50 border-pink-200 text-pink-950' },
  practical: { label: 'Практика', icon: '🧩', badge: '🧩 Практический шаг', color: 'bg-emerald-50 border-emerald-200 text-emerald-950' },
};

const AGE_LABELS: Record<AgeGroup, string> = {
  '0-3m': 'новорождённый',
  '3-12m': 'младенец',
  '1-3y': 'ребёнок 1–3 лет',
  '3-7y': 'дошкольник',
  '7-12y': 'школьник',
};

export const ParentTipsSection: React.FC<ParentTipsSectionProps> = ({ tips, weather, period, ageGroup, outfit }) => {
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

  useEffect(() => {
    if (filteredTips.length <= 1) return;
    const interval = window.setInterval(() => {
      setCurrentTipIndex((previous) => (previous + 1) % filteredTips.length);
    }, 12000);
    return () => window.clearInterval(interval);
  }, [filteredTips.length]);

  const currentTip = filteredTips[currentTipIndex];
  const moveTip = (direction: -1 | 1) => {
    if (filteredTips.length <= 1) return;
    setCurrentTipIndex((previous) => (previous + direction + filteredTips.length) % filteredTips.length);
  };

  const weatherRisks = [
    weather.isRainy ? 'осадки' : null,
    weather.isSnowy ? 'снег' : null,
    weather.windSpeed >= 15 ? 'ветер' : null,
    weather.precipProb >= 50 ? `${weather.precipProb}% осадков` : null,
  ].filter(Boolean).join(' · ');

  return (
    <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
        <div className="flex items-start gap-2.5">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0"><Lightbulb size={20} /></div>
          <div>
            <h3 className="text-base sm:text-xl font-black text-slate-800">Карусель полезных подсказок</h3>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
              {PERIOD_LABELS[period][0].toUpperCase() + PERIOD_LABELS[period].slice(1)} · ощущается как {weather.feelsLike > 0 ? '+' : ''}{weather.feelsLike}°C · {weather.description.toLowerCase()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
          <RotateCcw size={13} /> Обновление каждые 12 сек
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5"><span className="text-[9px] uppercase tracking-wider font-black text-slate-400">Риски</span><p className="mt-0.5 text-[11px] sm:text-xs font-bold text-slate-700">{weatherRisks || 'Без выраженных погодных рисков'}</p></div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5"><span className="text-[9px] uppercase tracking-wider font-black text-slate-400">Ребёнок</span><p className="mt-0.5 text-[11px] sm:text-xs font-bold text-slate-700">{AGE_LABELS[ageGroup]}</p></div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5"><span className="text-[9px] uppercase tracking-wider font-black text-slate-400">Главное в комплекте</span><p className="mt-0.5 text-[11px] sm:text-xs font-bold text-slate-700 truncate">{outfit.outer[0]?.name || outfit.upper[0]?.name || outfit.lower[0]?.name}</p></div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4" aria-label="Фильтр подсказок">
        {categories.map((category) => (
          <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${selectedCategory === category.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            <span>{category.icon}</span><span className="hidden sm:inline">{category.label}</span><span className={`px-1.5 py-0.5 rounded-full text-[9px] ${selectedCategory === category.id ? 'bg-white/20' : 'bg-slate-200'}`}>{category.count}</span>
          </button>
        ))}
      </div>

      {currentTip ? (
        <div className={`p-4 sm:p-6 rounded-2xl border-2 ${CATEGORY_META[currentTip.category].color}`}>
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="text-3xl sm:text-4xl leading-none shrink-0 mt-1">{currentTip.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-2"><span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 border border-black/10 text-slate-700">{CATEGORY_META[currentTip.category].badge}</span><span className="text-xs sm:text-sm font-bold text-slate-500">{currentTipIndex + 1} / {filteredTips.length}</span></div>
              <h4 className="font-extrabold text-sm sm:text-base leading-tight mb-2 text-slate-800">{currentTip.title}</h4>
              <p className="text-sm sm:text-base leading-relaxed text-slate-700">{currentTip.text}</p>
            </div>
          </div>
          {filteredTips.length > 1 && <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-black/5"><button onClick={() => moveTip(-1)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/60 hover:bg-white text-slate-700 font-bold text-xs sm:text-sm"><ChevronLeft size={16} /> Назад</button><div className="flex items-center gap-1">{filteredTips.map((tip, index) => <button key={tip.id} onClick={() => setCurrentTipIndex(index)} className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${index === currentTipIndex ? 'bg-indigo-600 scale-125' : 'bg-slate-300 hover:bg-slate-400'}`} aria-label={`Совет ${index + 1}`} />)}</div><button onClick={() => moveTip(1)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/60 hover:bg-white text-slate-700 font-bold text-xs sm:text-sm">Вперёд <ChevronRight size={16} /></button></div>}
        </div>
      ) : <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">Для этой категории пока нет отдельных подсказок.</div>}

      <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/60 px-4 py-3 flex gap-2.5 text-[11px] sm:text-xs text-amber-800 leading-relaxed"><AlertTriangle size={16} className="mt-0.5 shrink-0" /><p>Подсказки помогают подготовиться к прогулке, но не заменяют оценку самочувствия ребёнка. При вялости, ознобе, перегреве или промокшей одежде измените план прогулки.</p></div>
    </section>
  );
};
