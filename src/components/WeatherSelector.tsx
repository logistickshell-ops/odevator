import React from 'react';
import { DayForecast, WeatherPeriodType, WeatherData } from '../types';
import * as Icons from 'lucide-react';

interface WeatherSelectorProps {
  todayForecast: DayForecast | null;
  tomorrowForecast: DayForecast | null;
  selectedDay: 'today' | 'tomorrow';
  selectedPeriod: WeatherPeriodType;
  onSelect: (day: 'today' | 'tomorrow', period: WeatherPeriodType) => void;
}

export const WeatherSelector: React.FC<WeatherSelectorProps> = ({
  todayForecast,
  tomorrowForecast,
  selectedDay,
  selectedPeriod,
  onSelect
}) => {
  // Helper to render the Lucide icon dynamically
  const renderWeatherIcon = (iconName: string, size: number = 24, className: string = '') => {
    const IconComponent = (Icons as any)[iconName] || Icons.Cloud;
    return <IconComponent size={size} className={className} />;
  };

  // Period key mappings
  const periodNames: { [key in WeatherPeriodType]: { label: string; time: string; color: string } } = {
    morning: { label: 'Утро', time: '08:00', color: 'from-amber-400/10 to-sky-400/10 text-amber-700 border-amber-100' },
    day: { label: 'День', time: '14:00', color: 'from-sky-400/15 to-blue-400/10 text-sky-700 border-sky-200' },
    evening: { label: 'Вечер', time: '18:00', color: 'from-indigo-400/10 to-purple-400/10 text-indigo-700 border-indigo-100' },
    night: { label: 'Ночь', time: '23:00', color: 'from-slate-700/10 to-slate-900/10 text-slate-700 border-slate-200' }
  };

  const renderPeriodCard = (dayKey: 'today' | 'tomorrow', periodKey: WeatherPeriodType, data: WeatherData) => {
    const isSelected = selectedDay === dayKey && selectedPeriod === periodKey;
    const config = periodNames[periodKey];
    
    return (
      <button
        key={periodKey}
        onClick={() => onSelect(dayKey, periodKey)}
        className={`w-full text-left p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group active:scale-[0.98] ${
          isSelected
            ? 'bg-gradient-to-br border-indigo-500 bg-white shadow-md sm:scale-[1.02] ring-1 sm:ring-2 ring-indigo-100'
            : 'border-slate-100 bg-white/60 hover:border-slate-200 hover:bg-white shadow-sm'
        }`}
      >
        {isSelected && (
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-100 rounded-full filter blur-xl opacity-70 pointer-events-none" />
        )}

        <div className="flex items-center justify-between gap-1">
          <div className="min-w-0">
            <span className={`text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-md bg-gradient-to-r ${config.color} border whitespace-nowrap`}>
              {config.label} <span className="font-normal text-[7px] sm:text-[9px] opacity-80">({config.time})</span>
            </span>
            <h4 className="text-lg sm:text-2xl font-black text-slate-800 mt-1 sm:mt-2 tracking-tight">
              {data.temp > 0 ? `+${data.temp}` : data.temp}°C
            </h4>
            <p className="text-[9px] sm:text-[11px] font-medium text-slate-400 mt-0.5 truncate">
              Ощущ. <span className="text-slate-600 font-semibold">{data.feelsLike > 0 ? `+${data.feelsLike}` : data.feelsLike}°</span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-1 sm:gap-2 shrink-0">
            <div className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-50 group-hover:scale-110 transition-transform duration-300 ${
              isSelected ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'
            }`}>
              {renderWeatherIcon(data.icon, 20)}
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-600 text-right max-w-[60px] sm:max-w-[90px] truncate">
              {data.description}
            </span>
          </div>
        </div>

        {/* Mini Weather details bar */}
        <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-100/70 flex items-center justify-between text-[8px] sm:text-[10px] font-bold text-slate-500 gap-1">
          <span className="flex items-center gap-0.5 sm:gap-1">
            <Icons.Droplets size={10} className="text-blue-400" />
            <span className="hidden xs:inline">💧</span> {data.precipProb}%
          </span>
          <span className="flex items-center gap-0.5 sm:gap-1">
            <Icons.Wind size={10} className="text-slate-400" />
            <span className="hidden xs:inline">💨</span> {data.windSpeed}
          </span>
          <span className="flex items-center gap-0.5 sm:gap-1">
            <Icons.Thermometer size={10} className="text-amber-400" />
            <span className="hidden xs:inline">🌡️</span> {data.humidity}%
          </span>
        </div>
      </button>
    );
  };

  const activeForecast = selectedDay === 'today' ? todayForecast : tomorrowForecast;

  if (!todayForecast || !tomorrowForecast) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center flex flex-col items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent mb-3" />
        <p className="text-slate-500 font-semibold">Загружаем прогноз погоды...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Day tabs */}
      <div className="flex bg-slate-100 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-slate-200/60">
        <button
          onClick={() => onSelect('today', selectedPeriod)}
          className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-extrabold text-[11px] sm:text-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
            selectedDay === 'today'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
          }`}
        >
          <Icons.CalendarDays size={14} />
          <div>
            <span>Сегодня</span>
            <span className="block text-[8px] sm:text-[10px] font-normal text-slate-400 mt-0.5 truncate max-w-[80px] sm:max-w-none">
              {todayForecast.formattedDate}
            </span>
          </div>
        </button>

        <button
          onClick={() => onSelect('tomorrow', selectedPeriod)}
          className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-extrabold text-[11px] sm:text-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
            selectedDay === 'tomorrow'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
          }`}
        >
          <Icons.CalendarDays size={14} />
          <div>
            <span>Завтра</span>
            <span className="block text-[8px] sm:text-[10px] font-normal text-slate-400 mt-0.5 truncate max-w-[80px] sm:max-w-none">
              {tomorrowForecast.formattedDate}
            </span>
          </div>
        </button>
      </div>

      {/* Forecast periods grid — 2 cols on mobile */}
      <div>
        <h3 className="text-[10px] sm:text-sm font-black text-slate-500 uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-1 sm:gap-1.5">
          <Icons.Clock size={12} />
          <span>Выберите время для прогулки</span>
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {activeForecast && (
            <>
              {renderPeriodCard(selectedDay, 'morning', activeForecast.periods.morning)}
              {renderPeriodCard(selectedDay, 'day', activeForecast.periods.day)}
              {renderPeriodCard(selectedDay, 'evening', activeForecast.periods.evening)}
              {renderPeriodCard(selectedDay, 'night', activeForecast.periods.night)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
