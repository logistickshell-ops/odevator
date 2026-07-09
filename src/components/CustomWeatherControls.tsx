import React from 'react';
import { ActivityLevel, ColdSensitivity } from '../types';
import { Thermometer, Wind, Droplets, ShieldAlert, Sparkles } from 'lucide-react';

import { AgeGroup } from '../types';

interface CustomWeatherControlsProps {
  isManual: boolean;
  setIsManual: (manual: boolean) => void;
  temp: number;
  setTemp: (t: number) => void;
  windSpeed: number;
  setWindSpeed: (w: number) => void;
  humidity: number;
  setHumidity: (h: number) => void;
  weatherCondition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  setWeatherCondition: (cond: 'sunny' | 'cloudy' | 'rainy' | 'snowy') => void;
  activity: ActivityLevel;
  setActivity: (act: ActivityLevel) => void;
  sensitivity: ColdSensitivity;
  setSensitivity: (sens: ColdSensitivity) => void;
  ageGroup: AgeGroup;
  setAgeGroup: (age: AgeGroup) => void;
}

export const CustomWeatherControls: React.FC<CustomWeatherControlsProps> = ({
  isManual, setIsManual, temp, setTemp, windSpeed, setWindSpeed,
  humidity, setHumidity, weatherCondition, setWeatherCondition,
  activity, setActivity, sensitivity, setSensitivity, ageGroup, setAgeGroup
}) => {

  const activityOptions: { value: ActivityLevel; label: string; icon: string; desc: string }[] = [
    { value: 'quiet', label: 'Малоподвижная', icon: '👶', desc: 'Спит в коляске / сидит в песочнице' },
    { value: 'normal', label: 'Умеренная', icon: '🚶', desc: 'Спокойная прогулка, пешком' },
    { value: 'active', label: 'Активная', icon: '🏃', desc: 'Бегает, катается на горках, спорт' }
  ];

  const sensitivityOptions: { value: ColdSensitivity; label: string; icon: string; desc: string }[] = [
    { value: 'sensitive', label: 'Мерзляк', icon: '❄️', desc: 'Быстро замерзают руки и ножки' },
    { value: 'normal', label: 'Обычный', icon: '😊', desc: 'Стандартное теплоощущение' },
    { value: 'resistant', label: 'Жаркий ребенок', icon: '🔥', desc: 'Редко мерзнет, сильно потеет' }
  ];

  const ageOptions: { value: AgeGroup; label: string; icon: string; desc: string }[] = [
    { value: '0-3m', label: 'Новорождённый', icon: '🐣', desc: '0-3 месяца (лежат в коляске)' },
    { value: '3-12m', label: 'Младенец', icon: '🧸', desc: '3-12 месяцев (сидят, ползают)' },
    { value: '1-3y', label: 'Ясельный', icon: '🍼', desc: '1-3 года (очень активные)' },
    { value: '3-7y', label: 'Дошкольник', icon: '🎒', desc: '3-7 лет (бегают, играют)' },
    { value: '7-12y', label: 'Школьник', icon: '🏫', desc: '7-12 лет (самостоятельные)' }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm">
      
      {/* Mode Switcher + Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-100">
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-1.5 sm:gap-2">
            <Sparkles className="text-indigo-500 shrink-0" size={16} />
            <span>Настройки симулятора прогулки</span>
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate">
            Настройте погоду вручную или адаптируйте под активность вашего ребенка
          </p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50 self-start shrink-0">
          <button onClick={() => setIsManual(false)}
            className={`py-1.5 px-3 rounded-lg text-[10px] sm:text-xs font-bold transition ${!isManual ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>
            🌎 API
          </button>
          <button onClick={() => setIsManual(true)}
            className={`py-1.5 px-3 rounded-lg text-[10px] sm:text-xs font-bold transition ${isManual ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>
            🎛️ Ручной
          </button>
        </div>
      </div>

      {/* Manual Weather Adjusters */}
      {isManual && (
        <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-indigo-50/30 rounded-xl sm:rounded-2xl border border-indigo-100/50 animate-fadeIn">
          <div className="flex items-center gap-1.5 text-indigo-700">
            <ShieldAlert size={13} />
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider">Режим ручного тестирования</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Temperature slider */}
            <div className="space-y-1.5 sm:space-y-2 bg-white p-2.5 sm:p-3 rounded-xl border border-slate-100">
              <div className="flex justify-between text-[10px] sm:text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1"><Thermometer size={12} className="text-rose-500"/>Темп:</span>
                <span className="text-indigo-600 text-xs sm:text-sm">{temp > 0 ? `+${temp}` : temp}°C</span>
              </div>
              <input type="range" min="-30" max="40" value={temp} onChange={(e) => setTemp(parseInt(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer" />
              <div className="flex justify-between text-[7px] sm:text-[9px] font-bold text-slate-400">
                <span>-30°</span><span>0°</span><span>+40°</span>
              </div>
            </div>

            {/* Wind */}
            <div className="space-y-1.5 sm:space-y-2 bg-white p-2.5 sm:p-3 rounded-xl border border-slate-100">
              <div className="flex justify-between text-[10px] sm:text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1"><Wind size={12} className="text-slate-500"/>Ветер:</span>
                <span className="text-indigo-600 text-xs sm:text-sm">{windSpeed} км/ч</span>
              </div>
              <input type="range" min="0" max="50" value={windSpeed} onChange={(e) => setWindSpeed(parseInt(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer" />
              <div className="flex justify-between text-[7px] sm:text-[9px] font-bold text-slate-400">
                <span>0</span><span>Умер.</span><span>50</span>
              </div>
            </div>

            {/* Humidity */}
            <div className="space-y-1.5 sm:space-y-2 bg-white p-2.5 sm:p-3 rounded-xl border border-slate-100">
              <div className="flex justify-between text-[10px] sm:text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1"><Droplets size={12} className="text-blue-500"/>Влаж:</span>
                <span className="text-indigo-600 text-xs sm:text-sm">{humidity}%</span>
              </div>
              <input type="range" min="10" max="100" value={humidity} onChange={(e) => setHumidity(parseInt(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer" />
              <div className="flex justify-between text-[7px] sm:text-[9px] font-bold text-slate-400">
                <span>10%</span><span>50%</span><span>100%</span>
              </div>
            </div>
          </div>

          {/* Weather Condition toggles */}
          <div className="space-y-1.5 bg-white p-2.5 sm:p-3.5 rounded-xl border border-slate-100">
            <span className="text-[10px] sm:text-xs font-bold text-slate-600 block mb-1 sm:mb-0">Состояние неба:</span>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {(['sunny', 'cloudy', 'rainy', 'snowy'] as const).map((cond) => (
                <button key={cond} onClick={() => setWeatherCondition(cond)}
                  className={`py-2 px-1 sm:px-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold border transition flex flex-col items-center gap-0.5 sm:gap-1 active:scale-95 ${
                    weatherCondition === cond
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 active:bg-slate-100'
                  }`}>
                  <span className="text-base sm:text-lg">
                    {cond === 'sunny' ? '☀️' : cond === 'cloudy' ? '☁️' : cond === 'rainy' ? '🌧️' : '❄️'}
                  </span>
                  <span className="text-[9px] sm:text-[10px]">
                    {cond === 'sunny' ? 'Ясно' : cond === 'cloudy' ? 'Облачно' : cond === 'rainy' ? 'Дождь' : 'Снег'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Age Group Selector */}
      <div className="space-y-2 sm:space-y-3 border-t border-slate-100 pt-4 sm:pt-6">
        <label className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-wider block">
          🎂 Возрастная группа ребенка
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {ageOptions.map((option) => (
            <button key={option.value} onClick={() => setAgeGroup(option.value)}
              className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1 active:scale-[0.98] ${
                ageGroup === option.value
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-100'
                  : 'border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white text-slate-700'
              }`}>
              <span className="text-2xl sm:text-3xl leading-none mb-0.5">{option.icon}</span>
              <span className="font-extrabold text-[11px] sm:text-xs leading-tight block">{option.label}</span>
              <span className={`text-[9px] sm:text-[10px] leading-tight block opacity-80 ${ageGroup === option.value ? 'text-indigo-100' : 'text-slate-400'}`}>{option.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Child Customization: Activity and Sensitivity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 border-t border-slate-100 pt-4 sm:pt-6">
        {/* Activity Level */}
        <div className="space-y-2 sm:space-y-3">
          <label className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-wider block">
            🏃 Уровень активности
          </label>
          <div className="space-y-1.5 sm:space-y-2">
            {activityOptions.map((option) => (
              <button key={option.value} onClick={() => setActivity(option.value)}
                className={`w-full text-left p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border-2 transition-all flex items-start gap-2 sm:gap-3 active:scale-[0.98] ${
                  activity === option.value
                    ? 'bg-white border-indigo-500 shadow-sm ring-1 sm:ring-2 ring-indigo-50'
                    : 'border-slate-100 bg-slate-50/40 active:border-slate-200 active:bg-white'
                }`}>
                <span className="text-xl sm:text-2xl p-1.5 sm:p-2 bg-white rounded-lg sm:rounded-xl border border-slate-100 shadow-xs leading-none shrink-0">
                  {option.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-slate-800 text-[11px] sm:text-xs block">{option.label}</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 leading-tight mt-0.5 block">{option.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cold Sensitivity */}
        <div className="space-y-2 sm:space-y-3">
          <label className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-wider block">
            🌡️ Индивидуальная мерзлявость
          </label>
          <div className="space-y-1.5 sm:space-y-2">
            {sensitivityOptions.map((option) => (
              <button key={option.value} onClick={() => setSensitivity(option.value)}
                className={`w-full text-left p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border-2 transition-all flex items-start gap-2 sm:gap-3 active:scale-[0.98] ${
                  sensitivity === option.value
                    ? 'bg-white border-indigo-500 shadow-sm ring-1 sm:ring-2 ring-indigo-50'
                    : 'border-slate-100 bg-slate-50/40 active:border-slate-200 active:bg-white'
                }`}>
                <span className="text-xl sm:text-2xl p-1.5 sm:p-2 bg-white rounded-lg sm:rounded-xl border border-slate-100 shadow-xs leading-none shrink-0">
                  {option.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-slate-800 text-[11px] sm:text-xs block">{option.label}</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 leading-tight mt-0.5 block">{option.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
