import React from 'react';
import { Thermometer, Wind, Droplets, SlidersHorizontal } from 'lucide-react';

interface CustomWeatherControlsProps {
  isManual: boolean;
  setIsManual: (manual: boolean) => void;
  temp: number;
  setTemp: (temperature: number) => void;
  windSpeed: number;
  setWindSpeed: (speed: number) => void;
  humidity: number;
  setHumidity: (humidity: number) => void;
  weatherCondition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  setWeatherCondition: (condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy') => void;
}

export const CustomWeatherControls: React.FC<CustomWeatherControlsProps> = ({
  isManual,
  setIsManual,
  temp,
  setTemp,
  windSpeed,
  setWindSpeed,
  humidity,
  setHumidity,
  weatherCondition,
  setWeatherCondition,
}) => (
  <section className="space-y-4 rounded-2xl sm:rounded-3xl border border-sky-100 bg-white p-4 sm:p-6 shadow-sm">
    <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:pb-4">
      <div className="min-w-0">
        <h3 className="flex items-center gap-2 text-sm sm:text-base font-black text-slate-800">
          <SlidersHorizontal className="shrink-0 text-sky-600" size={16} />
          Погода для рекомендации
        </h3>
        <p className="mt-0.5 text-[10px] sm:text-xs text-slate-400">
          Обычно мы используем погоду выбранного города. При необходимости её можно задать вручную.
        </p>
      </div>
      <div className="flex shrink-0 rounded-xl border border-sky-100 bg-sky-50 p-1 self-start">
        <button
          type="button"
          onClick={() => setIsManual(false)}
          className={`rounded-lg px-3 py-1.5 text-[10px] sm:text-xs font-extrabold transition ${!isManual ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-500'}`}
        >
          Погода города
        </button>
        <button
          type="button"
          onClick={() => setIsManual(true)}
          className={`rounded-lg px-3 py-1.5 text-[10px] sm:text-xs font-extrabold transition ${isManual ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-500'}`}
        >
          Вручную
        </button>
      </div>
    </div>

    {isManual && (
      <div className="space-y-4 rounded-2xl border border-rose-100 bg-rose-50/55 p-3 sm:p-4 animate-fadeIn">
        <p className="text-[10px] sm:text-xs font-bold text-rose-700">Изменения влияют только на текущий просмотр и не сохраняют погоду города.</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <label className="space-y-2 rounded-xl border border-slate-100 bg-white p-3">
            <span className="flex justify-between text-[10px] sm:text-xs font-bold text-slate-600"><span className="flex items-center gap-1"><Thermometer size={12} className="text-rose-500" />Температура</span><span className="text-sky-700">{temp > 0 ? `+${temp}` : temp}°C</span></span>
            <input type="range" min="-30" max="40" value={temp} onChange={(event) => setTemp(parseInt(event.target.value, 10))} className="w-full accent-sky-600" />
            <span className="flex justify-between text-[9px] font-bold text-slate-400"><span>-30°</span><span>0°</span><span>+40°</span></span>
          </label>
          <label className="space-y-2 rounded-xl border border-slate-100 bg-white p-3">
            <span className="flex justify-between text-[10px] sm:text-xs font-bold text-slate-600"><span className="flex items-center gap-1"><Wind size={12} className="text-slate-500" />Ветер</span><span className="text-sky-700">{windSpeed} км/ч</span></span>
            <input type="range" min="0" max="50" value={windSpeed} onChange={(event) => setWindSpeed(parseInt(event.target.value, 10))} className="w-full accent-sky-600" />
            <span className="flex justify-between text-[9px] font-bold text-slate-400"><span>0</span><span>Умеренный</span><span>50</span></span>
          </label>
          <label className="space-y-2 rounded-xl border border-slate-100 bg-white p-3">
            <span className="flex justify-between text-[10px] sm:text-xs font-bold text-slate-600"><span className="flex items-center gap-1"><Droplets size={12} className="text-sky-500" />Влажность</span><span className="text-sky-700">{humidity}%</span></span>
            <input type="range" min="10" max="100" value={humidity} onChange={(event) => setHumidity(parseInt(event.target.value, 10))} className="w-full accent-sky-600" />
            <span className="flex justify-between text-[9px] font-bold text-slate-400"><span>10%</span><span>50%</span><span>100%</span></span>
          </label>
        </div>
        <div className="rounded-xl border border-slate-100 bg-white p-3">
          <span className="mb-2 block text-[10px] sm:text-xs font-bold text-slate-600">Погода</span>
          <div className="grid grid-cols-4 gap-2">
            {(['sunny', 'cloudy', 'rainy', 'snowy'] as const).map((condition) => (
              <button
                type="button"
                key={condition}
                onClick={() => setWeatherCondition(condition)}
                className={`rounded-xl border px-1 py-2 text-[9px] sm:text-[10px] font-extrabold transition ${
                  weatherCondition === condition
                    ? 'border-sky-200 bg-sky-100 text-sky-800'
                    : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="block text-base sm:text-lg">{condition === 'sunny' ? '☀️' : condition === 'cloudy' ? '☁️' : condition === 'rainy' ? '🌧️' : '❄️'}</span>
                <span>{condition === 'sunny' ? 'Ясно' : condition === 'cloudy' ? 'Облачно' : condition === 'rainy' ? 'Дождь' : 'Снег'}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )}
  </section>
);
