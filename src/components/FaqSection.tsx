import React, { useMemo, useState } from 'react';
import { ChevronDown, CircleHelp, HeartPulse, Layers3, Umbrella, Wind } from 'lucide-react';
import { WeatherData, WeatherPeriodType } from '../types';

interface FaqSectionProps {
  weather: WeatherData;
  period: WeatherPeriodType;
}

type FaqCategory = 'before' | 'comfort' | 'weather' | 'layers';

interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
  action: string;
}

const CATEGORY_META: Record<FaqCategory, { label: string; icon: React.ReactNode }> = {
  before: { label: 'Перед выходом', icon: <CircleHelp size={15} /> },
  comfort: { label: 'Комфорт', icon: <HeartPulse size={15} /> },
  weather: { label: 'Осадки и ветер', icon: <Umbrella size={15} /> },
  layers: { label: 'Слои и вещи', icon: <Layers3 size={15} /> },
};

const PERIOD_LABELS: Record<WeatherPeriodType, string> = {
  morning: 'утром',
  day: 'днём',
  evening: 'вечером',
  night: 'ночью',
};

export const FaqSection: React.FC<FaqSectionProps> = ({ weather, period }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | FaqCategory>('all');
  const [openId, setOpenId] = useState<string | null>('comfort-check');

  const items = useMemo<FaqItem[]>(() => [
    {
      id: 'before-check',
      category: 'before',
      question: 'Что проверить за минуту до выхода?',
      answer: 'Смотрите не только на температуру: важны ветер, осадки и ощущаемая температура. Затем проверьте обувь, возможность снять слой и то, комфортно ли ребёнку двигаться.',
      action: 'Сейчас: ощущается как ' + `${weather.feelsLike > 0 ? '+' : ''}${weather.feelsLike}°C` + (weather.windSpeed >= 15 ? ', ветер заметно усиливает охлаждение.' : '.'),
    },
    {
      id: 'comfort-check',
      category: 'comfort',
      question: 'Как понять, ребёнку жарко или холодно?',
      answer: 'Оцените шею и верх спины через 10–15 минут после выхода. Тёплая и сухая кожа — комфортно; влажная и горячая — снимите слой; холодная — добавьте утепление. Нос и ладони на ветру не показательны.',
      action: 'Если ребёнок вялый, дрожит, сильно потеет или говорит, что ему плохо, меняйте план прогулки сразу.',
    },
    {
      id: 'rain-plan',
      category: 'weather',
      question: 'Что важнее при дожде и слякоти?',
      answer: 'Сухие ноги и возможность быстро переодеться. Непромокаемый внешний слой работает только вместе с подходящей обувью и запасными носками. Не стоит продолжать прогулку в мокрой одежде.',
      action: weather.isRainy || weather.precipProb >= 50 ? 'Для выбранного периода есть риск осадков: добавьте защиту от луж и запасные носки.' : 'Риск осадков сейчас низкий, но для долгой прогулки полезна лёгкая защита от дождя.',
    },
    {
      id: 'wind-plan',
      category: 'weather',
      question: 'Почему при ветре нужен другой комплект?',
      answer: 'Ветер уносит тёплый воздух вокруг тела. Лучше добавить непродуваемый внешний слой, закрыть шею и уши, но не перекрывать обзор ребёнку капюшоном.',
      action: weather.windSpeed >= 15 ? `Сейчас ветер ${weather.windSpeed} км/ч: приоритет — ветровка или мембрана, шапка и защита шеи.` : `Сейчас ветер ${weather.windSpeed} км/ч: достаточно обычной защиты по температуре.`,
    },
    {
      id: 'layers-rule',
      category: 'layers',
      question: 'Как работает правило слоёв без лишнего утепления?',
      answer: 'Первый слой управляет влагой, следующий удерживает тепло, а внешний защищает от ветра и воды. Чем активнее ребёнок, тем легче должен быть утепляющий слой. Слои важнее одной очень тёплой вещи, потому что их можно регулировать.',
      action: 'Главное правило: на прогулке должно быть легко снять один слой до того, как ребёнок вспотеет.',
    },
    {
      id: 'night-safety',
      category: 'before',
      question: 'Что добавить для вечерней или ночной прогулки?',
      answer: 'В темноте ребёнка должно быть видно со стороны дороги и велодорожки. Световозвращатель лучше расположить на верхнем слое или рюкзаке, а не прятать под курткой.',
      action: period === 'evening' || period === 'night' ? 'Для выбранного времени добавьте светоотражатель и учтите вечернее похолодание.' : 'Для дневной прогулки заранее положите светоотражатель в карман на случай задержки.',
    },
  ], [period, weather]);

  const filteredItems = selectedCategory === 'all' ? items : items.filter((item) => item.category === selectedCategory);

  return (
    <section className="space-y-4 sm:space-y-5">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm">
        <div className="flex items-start gap-2.5 mb-4">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0"><CircleHelp size={20} /></div>
          <div>
            <h3 className="text-base sm:text-xl font-black text-slate-800">FAQ для прогулки</h3>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">Короткие ответы на вопросы, которые возникают перед выходом и на улице {PERIOD_LABELS[period]}.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Категории FAQ">
          <button onClick={() => setSelectedCategory('all')} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${selectedCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Все</button>
          {(Object.keys(CATEGORY_META) as FaqCategory[]).map((category) => (
            <button key={category} onClick={() => setSelectedCategory(category)} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${selectedCategory === category ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {CATEGORY_META[category].icon}<span>{CATEGORY_META[category].label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        {filteredItems.map((item) => {
          const isOpen = openId === item.id;
          return (
            <article key={item.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
              <button onClick={() => setOpenId(isOpen ? null : item.id)} className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3 hover:bg-slate-50/60 transition">
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className="mt-0.5 text-indigo-500">{CATEGORY_META[item.category].icon}</span>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-black text-slate-400">{CATEGORY_META[item.category].label}</span>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-800 leading-snug mt-0.5">{item.question}</h4>
                  </div>
                </div>
                <ChevronDown size={18} className={`text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 animate-fadeIn">
                  <p className="text-[12px] sm:text-sm text-slate-600 leading-relaxed">{item.answer}</p>
                  <div className="mt-3 rounded-xl bg-indigo-50/70 border border-indigo-100 px-3 py-2.5 flex gap-2 text-[11px] sm:text-xs text-indigo-900 leading-relaxed">
                    <Wind size={15} className="shrink-0 mt-0.5 text-indigo-600" /><p><strong>Что делать:</strong> {item.action}</p>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-[11px] sm:text-xs text-slate-600 leading-relaxed">
        <strong className="text-slate-800">Важно:</strong> рекомендации помогают подготовиться к обычной прогулке. При болезни, выраженном переохлаждении, перегреве или тревожном самочувствии ребёнка ориентируйтесь на состояние ребёнка и обращайтесь за медицинской помощью при необходимости.
      </div>
    </section>
  );
};
