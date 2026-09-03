import { tr } from '../i18n';
import React, { useMemo, useState } from 'react';
import { Baby, CheckSquare, Clock3, MapPin, Package, ShieldCheck, Square } from 'lucide-react';
import { ActivityLevel, AgeGroup, WeatherData, WeatherPeriodType } from '../types';
import { AGE_GROUP_LABELS } from '../utils/childProfile';

interface WalkChecklistProps {
  weather: WeatherData;
  period: WeatherPeriodType;
  ageGroup: AgeGroup;
  activity: ActivityLevel;
}

type ChecklistStep = 'before' | 'during' | 'after';

export const WalkChecklist: React.FC<WalkChecklistProps> = ({ weather, period, ageGroup, activity }) => {
  const [activeStep, setActiveStep] = useState<ChecklistStep>('before');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const checklists = useMemo(() => {
    const before = [
      { id: 'weather', text: tr("Сверить температуру, ветер и осадки для выбранного времени.") },
      { id: 'layers', text: tr("Проверить, что один слой можно снять или добавить на улице.") },
      { id: 'shoes', text: tr("Убедиться, что обувь сухая, не тесная и подходит к покрытию.") },
      { id: 'comfort', text: tr("Спросить ребёнка, удобно ли ему двигаться в выбранном комплекте.") },
    ];
    const during = [
      { id: 'neck', text: tr("Через 10–15 минут проверить шею и спину: они должны быть тёплыми и сухими.") },
      { id: 'movement', text: tr("Следить, что ребёнок свободно двигается, а одежда не намокает и не сползает.") },
    ];
    const after = [
      { id: 'change', text: tr("Снять мокрый или вспотевший слой и переодеть ребёнка в сухое.") },
      { id: 'dry', text: tr("Просушить обувь, варежки и верхний слой до следующей прогулки.") },
      { id: 'learn', text: tr("Отметить для себя: было жарко, холодно или комфортно — это улучшит следующий выбор.") },
    ];

    if (weather.isRainy || weather.precipProb >= 50) {
      before.push({ id: 'rain', text: tr("Положить запасные носки и защиту от луж; проверить непромокаемость обуви.") });
      during.push({ id: 'wet', text: tr("Сразу реагировать на мокрые носки, перчатки или брюки.") });
    }
    if (weather.isSnowy) before.push({ id: 'snow', text: tr("Взять запасные варежки и проверить, что снег не попадает в обувь.") });
    if (weather.windSpeed >= 15) before.push({ id: 'wind', text: tr("Защитить уши и шею, но оставить ребёнку хороший обзор.") });
    if (weather.feelsLike >= 25) {
      before.push({ id: 'heat', text: tr("Взять воду, головной убор и при необходимости SPF; выбрать тень.") });
      during.push({ id: 'water', text: tr("Предлагать воду регулярно и делать паузы в тени.") });
    }
    if (period === 'evening' || period === 'night') before.push({ id: 'reflective', text: tr("Добавить светоотражающий элемент на верхнюю одежду или рюкзак.") });
    if (activity === 'quiet' || ageGroup === '0-3m' || ageGroup === '3-12m') before.push({ id: 'still', text: tr("Для спокойной прогулки или коляски подготовить дополнительный утепляющий слой.") });
    if (ageGroup === '12-16y') {
      before.push({ id: 'teen-plan', text: tr("Согласовать с подростком, какой регулируемый слой и защита от погоды будут в рюкзаке.") });
      during.push({ id: 'teen-feedback', text: tr("Попросить подростка сообщить, если стало жарко или холодно, и скорректировать слой до дискомфорта.") });
    }

    return { before, during, after };
  }, [activity, ageGroup, period, weather]);

  const toggleCheck = (id: string) => setCheckedItems((previous) => ({ ...previous, [id]: !previous[id] }));

  const steps = [
    ['before', tr("Перед выходом"), Clock3],
    ['during', tr("На улице"), MapPin],
    ['after', tr("После"), Package],
  ] as const;

  return (
    <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm space-y-4">
      <div className="flex items-start gap-2.5">
        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0"><ShieldCheck size={20} /></div>
        <div><h3 className="text-base sm:text-xl font-black text-slate-800">{tr("Чек-лист прогулки")}</h3><p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">{tr("Профиль:")} {AGE_GROUP_LABELS[ageGroup]}{tr(". Отмечайте готовность до выхода, на улице и после возвращения. Пункты меняются по погоде.")}</p></div>
      </div>
      <div className="flex bg-slate-100 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-slate-200/60">
        {steps.map(([step, label, Icon]) => (
          <button key={step} onClick={() => setActiveStep(step)} className={`flex-1 py-2 sm:py-2.5 px-2 rounded-lg sm:rounded-xl font-extrabold text-[10px] sm:text-xs transition-all flex items-center justify-center gap-1 ${activeStep === step ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}><Icon size={14} className="shrink-0" /><span className="truncate">{label}</span></button>
        ))}
      </div>
      <div className="space-y-2 pt-1">
        {checklists[activeStep].map((item) => {
          const itemId = `${activeStep}-${item.id}`;
          const isChecked = checkedItems[itemId];
          return <button key={item.id} onClick={() => toggleCheck(itemId)} className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${isChecked ? 'bg-emerald-50/50 border-emerald-200 text-slate-500' : 'bg-slate-50/50 border-slate-100 hover:border-slate-200 text-slate-700'}`}><div className={`mt-0.5 shrink-0 ${isChecked ? 'text-emerald-600' : 'text-slate-300'}`}>{isChecked ? <CheckSquare size={18} /> : <Square size={18} />}</div><span className={`text-[11px] sm:text-xs leading-snug font-bold ${isChecked ? 'line-through decoration-emerald-600/40 opacity-70' : ''}`}>{item.text}</span></button>;
        })}
      </div>
      {(activity === 'quiet' || ageGroup === '0-3m' || ageGroup === '3-12m') && <div className="rounded-xl bg-pink-50 border border-pink-100 px-3 py-2.5 flex gap-2 text-[11px] sm:text-xs text-pink-900"><Baby size={15} className="shrink-0 mt-0.5" /><p>{tr("Для спокойной прогулки и малышей в коляске особенно важно заранее подготовить дополнительный утепляющий слой.")}</p></div>}
    </section>
  );
};
