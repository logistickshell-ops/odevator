import React, { useState } from 'react';
import { ParentTip } from '../types';
import { CheckSquare, Square, ShieldCheck, Clock, Package, Baby, Lightbulb } from 'lucide-react';

interface ParentTipsSectionProps {
  tips: ParentTip[];
}

export const ParentTipsSection: React.FC<ParentTipsSectionProps> = ({ tips }) => {
  const [activeChecklist, setActiveChecklist] = useState<'before' | 'during' | 'after'>('before');
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const checklists = {
    before: [
      { id: 'b1', text: 'Погода проверена (температура, ветер, осадки)' },
      { id: 'b2', text: 'Одежда выбрана по температуре и активности' },
      { id: 'b3', text: 'Слои готовы (можно легко снять/надеть на улице)' },
      { id: 'b4', text: 'Обувь удобная, сухая и по сезону' },
      { id: 'b5', text: 'Головной убор надет правильно (закрывает уши/от солнца)' },
      { id: 'b6', text: 'Руки защищены (варежки/перчатки по погоде)' },
      { id: 'b7', text: 'Сменка собрана в рюкзак (при необходимости)' },
      { id: 'b8', text: 'Вода взята (обязательно при жаре > +25°C)' },
      { id: 'b9', text: 'Солнцезащитный крем нанесен (при активном солнце)' },
      { id: 'b10', text: 'Дождевик или зонт приготовлен (при вероятности дождя)' },
      { id: 'b11', text: 'Термос с теплым напитком взят (при морозе)' },
    ],
    during: [
      { id: 'd1', text: 'Ребёнку комфортно? (не капризничает от жары/холода)' },
      { id: 'd2', text: 'Шея и спина проверены тыльной стороной ладони (тепло/не потеет)' },
      { id: 'd3', text: 'Ручки тёплые и розовые' },
      { id: 'd4', text: 'Ножки в тепле (проверка по возвращению или при смене обуви)' },
      { id: 'd5', text: 'Голова и уши надежно закрыты / защищены от солнца' },
      { id: 'd6', text: 'Одежда не намокла от снега или луж' },
      { id: 'd7', text: 'Ребёнок пьёт воду каждые 15-20 минут (в жару)' },
      { id: 'd8', text: 'Есть укрытие от внезапного дождя или сильного ветра' },
    ],
    after: [
      { id: 'a1', text: 'Оценка общего состояния ребёнка (не замерз ли, не перегрелся)' },
      { id: 'a2', text: 'Переодеть в сухое (если вспотел или промок)' },
      { id: 'a3', text: 'Обувь поставить на просушку (вынуть стельки)' },
      { id: 'a4', text: 'Варежки и шапку высушить к следующей прогулке' },
      { id: 'a5', text: 'Оценить, была ли выбранная одежда адекватна погоде' },
      { id: 'a6', text: 'Запомнить или записать выводы для завтрашней прогулки' },
    ]
  };

  const getPriorityStyles = (priority: string) => {
    if (priority === 'danger') return 'bg-rose-50 border-rose-200 text-rose-900';
    if (priority === 'warning') return 'bg-amber-50 border-amber-200 text-amber-900';
    return 'bg-blue-50 border-blue-200 text-blue-900';
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'danger') return <span className="bg-rose-500 text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">Критично</span>;
    if (priority === 'warning') return <span className="bg-amber-500 text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">Важно</span>;
    return <span className="bg-blue-500 text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">Совет</span>;
  };

  const getCategoryName = (cat: string) => {
    switch (cat) {
      case 'safety': return 'Безопасность';
      case 'time': return 'Время суток';
      case 'essentials': return 'С собой';
      case 'alerts': return 'Внимание';
      case 'age': return 'По возрасту';
      case 'practical': return 'Лайфхак';
      default: return 'Совет';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. PARENT TIPS LIST */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm space-y-4">
        <div>
          <h3 className="text-base sm:text-xl font-black text-slate-800 flex items-center gap-2">
            <Lightbulb className="text-amber-500 shrink-0" size={22} />
            <span>Умные подсказки родителям</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
            Персональные рекомендации, сформированные на основе погодных условий, возраста и уровня активности вашего ребенка.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {tips.map((tip) => (
            <div key={tip.id} className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all flex items-start gap-3 ${getPriorityStyles(tip.priority)}`}>
              <span className="text-2xl sm:text-3xl leading-none shrink-0 mt-0.5">{tip.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 border border-black/10 text-slate-700">
                    {getCategoryName(tip.category)}
                  </span>
                  {getPriorityBadge(tip.priority)}
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm leading-tight mb-1">{tip.title}</h4>
                <p className="text-[11px] sm:text-xs leading-relaxed opacity-90">{tip.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. INTERACTIVE CHECKLISTS */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm space-y-4">
        <div>
          <h3 className="text-base sm:text-xl font-black text-slate-800 flex items-center gap-2">
            <ShieldCheck className="text-indigo-500 shrink-0" size={22} />
            <span>Чек-листы безопасности прогулки</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
            Отмечайте выполненные пункты для полной уверенности в комфорте малыша на каждом этапе.
          </p>
        </div>

        {/* Checklist Tabs */}
        <div className="flex bg-slate-100 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-slate-200/60">
          <button onClick={() => setActiveChecklist('before')}
            className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 rounded-lg sm:rounded-xl font-extrabold text-[10px] sm:text-xs transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${
              activeChecklist === 'before' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
            }`}>
            <Clock size={14} className="shrink-0" />
            <span className="truncate">Перед выходом</span>
          </button>
          <button onClick={() => setActiveChecklist('during')}
            className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 rounded-lg sm:rounded-xl font-extrabold text-[10px] sm:text-xs transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${
              activeChecklist === 'during' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
            }`}>
            <Baby size={14} className="shrink-0" />
            <span className="truncate">На улице</span>
          </button>
          <button onClick={() => setActiveChecklist('after')}
            className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 rounded-lg sm:rounded-xl font-extrabold text-[10px] sm:text-xs transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${
              activeChecklist === 'after' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
            }`}>
            <Package size={14} className="shrink-0" />
            <span className="truncate">После прогулки</span>
          </button>
        </div>

        {/* Checklist Items */}
        <div className="space-y-2 pt-2">
          {checklists[activeChecklist].map((item) => (
            <button key={item.id} onClick={() => toggleCheck(item.id)}
              className={`w-full text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all flex items-start gap-3 active:scale-[0.99] ${
                checkedItems[item.id]
                  ? 'bg-emerald-50/50 border-emerald-200 text-slate-500'
                  : 'bg-slate-50/50 border-slate-100 hover:border-slate-200 text-slate-700'
              }`}>
              <div className={`mt-0.5 shrink-0 transition-colors ${checkedItems[item.id] ? 'text-emerald-600' : 'text-slate-300'}`}>
                {checkedItems[item.id] ? <CheckSquare size={18} /> : <Square size={18} />}
              </div>
              <span className={`text-[11px] sm:text-xs leading-snug font-bold ${checkedItems[item.id] ? 'line-through decoration-emerald-600/40 opacity-70' : ''}`}>
                {item.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
