import React, { useState } from 'react';
import { Check, X, AlertCircle, ChevronDown, ChevronUp, ShieldCheck, Sparkles } from 'lucide-react';

export const AnalysisSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  const competitors = [
    {
      name: 'Классические таблицы (Lassie, Reima)',
      description: 'Статические печатные таблицы подбора детской одежды по температурным диапазонам.',
      pros: ['Понятны и знакомы родителям.', 'Хорошо описывают температурные интервалы.', 'Дают стандарты по плотности утеплителя.'],
      cons: ['Не учитывают силу ветра и влажность.', 'Абсолютно статичны — нет учета активности ребенка.', 'Не обновляются в реальном времени.']
    },
    {
      name: 'Стандартные погодные виджеты',
      description: 'Обычные погодные приложения (iOS Weather, Яндекс.Погода и т.д.).',
      pros: ['Точный прогноз погоды по часам.', 'Всегда под рукой на телефоне.', 'Показывают ощущаемую температуру.'],
      cons: ['Никаких рекомендаций по одежде.', 'Родителю приходится самому угадывать.', 'Нет разделения на слои и специфику для детей.']
    },
    {
      name: 'Узкие калькуляторы одежды',
      description: 'Простые скрипты на форумах молодых мам.',
      pros: ['Дают текстовые подсказки.', 'Показывают примерный набор вещей.'],
      cons: ['Нет визуализации на манекене.', 'Нельзя посмотреть слои под курткой.', 'Нет авто-геопозиционирования и API погоды.']
    }
  ];

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-6 flex items-center justify-between bg-gradient-to-r from-indigo-50/40 to-sky-50/40 active:bg-indigo-50/60 transition">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="p-2 sm:p-2.5 bg-indigo-100 text-indigo-600 rounded-xl sm:rounded-2xl shrink-0">
            <Sparkles size={18} />
          </div>
          <div className="text-left min-w-0">
            <h3 className="text-sm sm:text-lg font-black text-slate-800 truncate">Анализ рынка и преимуществ</h3>
            <p className="text-[10px] sm:text-xs text-slate-500 font-semibold truncate">
              Как наш сервис решает проблемы классических калькуляторов
            </p>
          </div>
        </div>
        {isOpen ? <ChevronUp size={18} className="text-slate-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
      </button>

      {isOpen && (
        <div className="p-4 sm:p-6 border-t border-slate-100 space-y-5 sm:space-y-8 animate-fadeIn">
          <div className="bg-amber-50/50 border border-amber-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
            <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={16} />
            <div>
              <h4 className="font-bold text-amber-900 text-[11px] sm:text-sm">Почему обычные советы часто не работают?</h4>
              <p className="text-[10px] sm:text-xs text-amber-700 mt-0.5 sm:mt-1 leading-relaxed">
                При +5°С в тихий солнечный день и при той же температуре с ледяным ветром 12 м/с и дождем ребенку нужны совершенно разные комплекты. Простые таблицы не умеют объединять влажность, ветер и активность. <strong>Наш алгоритм рассчитывает «детскую эффективную температуру»</strong>, чтобы свести к нулю риск простуд и перегрева.
              </p>
            </div>
          </div>

          {/* Competitive cards — stack on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
            {competitors.map((comp, i) => (
              <div key={i} className="border border-slate-100 rounded-xl sm:rounded-2xl p-3 sm:p-5 bg-slate-50/50 active:bg-white transition duration-300 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-[11px] sm:text-sm flex items-center gap-1.5 sm:gap-2">
                    <span className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-slate-200 text-slate-600 text-[8px] sm:text-[10px] font-extrabold shrink-0">{i + 1}</span>
                    <span className="truncate">{comp.name}</span>
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 leading-relaxed mb-3 sm:mb-4">{comp.description}</p>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="space-y-1">
                      <span className="text-[8px] sm:text-[10px] font-extrabold text-emerald-600 tracking-wider uppercase block">Плюсы:</span>
                      {comp.pros.map((pro, idx) => (
                        <div key={idx} className="flex items-start gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-slate-600">
                          <Check className="text-emerald-500 shrink-0 mt-0.5" size={11} />
                          <span>{pro}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1 pt-1 sm:pt-2">
                      <span className="text-[8px] sm:text-[10px] font-extrabold text-rose-600 tracking-wider uppercase block">Минусы:</span>
                      {comp.cons.map((con, idx) => (
                        <div key={idx} className="flex items-start gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-slate-600">
                          <X className="text-rose-400 shrink-0 mt-0.5" size={11} />
                          <span>{con}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Our advantages — 2x2 on mobile */}
          <div className="pt-3 sm:pt-4 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 text-[11px] sm:text-sm mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2 text-indigo-600">
              <ShieldCheck size={16} />
              <span>Почему «МетеоОдевайка» — идеальный выбор?</span>
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              <div className="p-2.5 sm:p-4 bg-indigo-50/40 border border-indigo-100/50 rounded-xl sm:rounded-2xl">
                <div className="text-base sm:text-lg mb-0.5 sm:mb-1">🌪️</div>
                <h5 className="font-bold text-slate-800 text-[10px] sm:text-xs">Ветро- и влаго-индекс</h5>
                <p className="text-[9px] sm:text-[11px] text-slate-500 mt-0.5 sm:mt-1 leading-relaxed">Корректирует выбор куртки, брюк и аксессуаров при дожде или сильном ветре.</p>
              </div>
              <div className="p-2.5 sm:p-4 bg-sky-50/40 border border-sky-100/50 rounded-xl sm:rounded-2xl">
                <div className="text-base sm:text-lg mb-0.5 sm:mb-1">🏃</div>
                <h5 className="font-bold text-slate-800 text-[10px] sm:text-xs">Учет активности</h5>
                <p className="text-[9px] sm:text-[11px] text-slate-500 mt-0.5 sm:mt-1 leading-relaxed">Убирает слой для активных детей и добавляет для малышей в коляске.</p>
              </div>
              <div className="p-2.5 sm:p-4 bg-purple-50/40 border border-purple-100/50 rounded-xl sm:rounded-2xl">
                <div className="text-base sm:text-lg mb-0.5 sm:mb-1">🧑‍🤝‍🧑</div>
                <h5 className="font-bold text-slate-800 text-[10px] sm:text-xs">Мальчики & Девочки</h5>
                <p className="text-[9px] sm:text-[11px] text-slate-500 mt-0.5 sm:mt-1 leading-relaxed">Раздельные, стильные и удобные рекомендации для юных леди и джентльменов.</p>
              </div>
              <div className="p-2.5 sm:p-4 bg-teal-50/40 border border-teal-100/50 rounded-xl sm:rounded-2xl">
                <div className="text-base sm:text-lg mb-0.5 sm:mb-1">🧅</div>
                <h5 className="font-bold text-slate-800 text-[10px] sm:text-xs">Луковый разбор</h5>
                <p className="text-[9px] sm:text-[11px] text-slate-500 mt-0.5 sm:mt-1 leading-relaxed">Интерактивный манекен позволяет поочередно снимать слои, видя всё под ними.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
