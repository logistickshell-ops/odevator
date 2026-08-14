import React from 'react';
import {
  Baby,
  CircleAlert,
  CloudRain,
  Clock3,
  Droplets,
  Eye,
  Layers3,
  ListChecks,
  PersonStanding,
  ShieldCheck,
  Thermometer,
  Wind,
} from 'lucide-react';
import {
  ActivityLevel,
  AgeGroup,
  ColdSensitivity,
  RecommendedOutfit,
  WeatherData,
  WeatherPeriodType,
} from '../types';
import { ACTIVITY_LABELS, AGE_GROUP_LABELS, getChildDisplayName, SENSITIVITY_LABELS } from '../utils/childProfile';

interface AnalysisSectionProps {
  weather: WeatherData;
  period: WeatherPeriodType;
  ageGroup: AgeGroup;
  activity: ActivityLevel;
  sensitivity: ColdSensitivity;
  effectiveTemp: number;
  outfit: RecommendedOutfit;
  childName: string;
}

const PERIOD_LABELS: Record<WeatherPeriodType, string> = {
  morning: 'Утро',
  day: 'День',
  evening: 'Вечер',
  night: 'Ночь',
};

export const AnalysisSection: React.FC<AnalysisSectionProps> = ({
  weather,
  period,
  ageGroup,
  activity,
  sensitivity,
  effectiveTemp,
  outfit,
  childName,
}) => {
  const displayName = getChildDisplayName(childName);
  const profileSummary = `${AGE_GROUP_LABELS[ageGroup]} · ${ACTIVITY_LABELS[activity]} · ${SENSITIVITY_LABELS[sensitivity]}`;
  const factors = [
    { icon: <Thermometer size={18} />, label: 'Температура', value: `${weather.temp > 0 ? '+' : ''}${weather.temp}°C`, note: `прогноз: ${weather.feelsLike > 0 ? '+' : ''}${weather.feelsLike}°C · для профиля: ${effectiveTemp > 0 ? '+' : ''}${effectiveTemp}°C`, tone: 'bg-rose-50 text-rose-700 border-rose-100' },
    { icon: <Wind size={18} />, label: 'Ветер', value: `${weather.windSpeed} км/ч`, note: weather.windSpeed >= 15 ? 'влияет на охлаждение' : 'умеренное влияние', tone: 'bg-sky-50 text-sky-700 border-sky-100' },
    { icon: <Droplets size={18} />, label: 'Влажность', value: `${weather.humidity}%`, note: weather.humidity >= 80 ? 'усиливает сырой холод' : 'обычный уровень', tone: 'bg-cyan-50 text-cyan-700 border-cyan-100' },
    { icon: <CloudRain size={18} />, label: 'Осадки', value: `${weather.precipProb}%`, note: weather.isRainy ? 'дождь учтён в комплекте' : weather.isSnowy ? 'снег учтён в комплекте' : 'сухой сценарий', tone: 'bg-violet-50 text-violet-700 border-violet-100' },
    { icon: <Clock3 size={18} />, label: 'Время', value: PERIOD_LABELS[period], note: 'температура и видимость меняются', tone: 'bg-amber-50 text-amber-700 border-amber-100' },
    { icon: <Baby size={18} />, label: 'Профиль', value: displayName || AGE_GROUP_LABELS[ageGroup], note: displayName ? profileSummary : `${ACTIVITY_LABELS[activity]} · ${SENSITIVITY_LABELS[sensitivity]}`, tone: 'bg-pink-50 text-pink-700 border-pink-100' },
  ];

  const outfitItems = [
    ...outfit.underwear,
    ...outfit.lower,
    ...outfit.upper,
    ...outfit.outer,
    ...outfit.headwear,
    ...outfit.shoes,
    ...outfit.accessories,
  ].slice(0, 8);

  return (
    <section className="space-y-4 sm:space-y-5">
      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-600 rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-lg shadow-indigo-100">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-white/15 rounded-xl shrink-0"><Eye size={22} /></div>
          <div>
            <h3 className="text-lg sm:text-2xl font-black">Как сформирована рекомендация</h3>
            <p className="text-[12px] sm:text-sm leading-relaxed text-indigo-100 mt-1 max-w-2xl">Сервис складывает погоду, время прогулки и профиль ребёнка, чтобы собрать регулируемый комплект, а не выбрать одежду только по цифре на термометре.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4"><ListChecks size={20} className="text-indigo-600" /><h3 className="text-base sm:text-xl font-black text-slate-800">Что учтено сейчас</h3></div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
          {factors.map((factor) => (
            <div key={factor.label} className={`rounded-2xl border p-3 sm:p-4 ${factor.tone}`}>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-wide opacity-80">{factor.icon}{factor.label}</div>
              <p className="text-base sm:text-lg font-black text-slate-800 mt-2 leading-tight">{factor.value}</p>
              <p className="text-[10px] sm:text-xs leading-snug text-slate-600 mt-1">{factor.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5">
        <div className="lg:col-span-3 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm">
          <div className="flex items-start gap-2.5 mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0"><Layers3 size={19} /></div>
            <div><h3 className="text-base sm:text-xl font-black text-slate-800">Почему выбран этот комплект</h3><p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">{outfit.summary}</p></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {outfitItems.map((item) => (
              <div key={item.id} className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5 flex items-center gap-2.5">
                <span className="text-xl shrink-0">{item.emoji}</span>
                <div className="min-w-0"><p className="text-[11px] sm:text-xs font-extrabold text-slate-800 truncate">{item.name}</p><p className="text-[10px] text-slate-500 leading-snug line-clamp-2">{item.description}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-emerald-50/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-emerald-100">
          <div className="flex items-start gap-2.5"><div className="p-2 bg-white text-emerald-600 rounded-xl shrink-0"><ShieldCheck size={19} /></div><div><h3 className="text-base font-black text-emerald-950">Как использовать совет</h3><p className="text-[11px] sm:text-xs text-emerald-800 mt-1 leading-relaxed">Подбор — это стартовый вариант. Оцените ребёнка через 10–15 минут и снимите или добавьте один слой до того, как станет некомфортно.</p></div></div>
          <div className="mt-4 pt-4 border-t border-emerald-200/70 space-y-2 text-[11px] sm:text-xs text-emerald-900">
            <p className="flex gap-2"><PersonStanding size={14} className="shrink-0 mt-0.5" />Свобода движения важнее «идеальной» толщины одежды.</p>
            <p className="flex gap-2"><CircleAlert size={14} className="shrink-0 mt-0.5" />При ознобе, перегреве, вялости или мокрой одежде остановите или измените прогулку.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-amber-50/70 border border-amber-100 p-4 flex items-start gap-2.5 text-[11px] sm:text-xs leading-relaxed text-amber-900">
        <CircleAlert size={16} className="shrink-0 mt-0.5 text-amber-600" />
        <p><strong>Ограничение:</strong> алгоритм не является медицинской рекомендацией и не знает состояние здоровья ребёнка, качество конкретной одежды или длительность прогулки. Используйте его как ориентир, а не как замену наблюдению за ребёнком.</p>
      </div>
    </section>
  );
};
