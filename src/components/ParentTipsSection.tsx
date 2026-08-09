import React, { useState, useMemo, useEffect } from 'react';
import { ShieldCheck, Lightbulb, ChevronLeft, ChevronRight, Clock, Baby, Package, CheckSquare, Square, Filter, RotateCcw } from 'lucide-react';
import { Tip } from '../tips';

interface ParentTipsSectionProps {
  tips: Tip[];
}

export const ParentTipsSection: React.FC<ParentTipsSectionProps> = ({ tips }) => {
  const [activeChecklist, setActiveChecklist] = useState<'before' | 'during' | 'after'>('before');
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const AUTO_CHANGE_INTERVAL = 15000; // 15 секунд

  // ===== ОТЛАДКА =====
  console.log('🔄 Рендер ParentTipsSection, получено советов:', tips.length);
  if (tips.length > 0) {
    console.log(' Первый совет:', tips[0].title);
  }

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Фильтрация по категориям
  const filteredTips = useMemo(() => {
    if (selectedCategory === 'all') return tips;
    return tips.filter(tip => tip.category === selectedCategory);
  }, [tips, selectedCategory]);

  // Сброс индекса при изменении фильтра
  useEffect(() => {
    setCurrentTipIndex(0);
  }, [selectedCategory]);

  // Автоматическая смена совета каждые 15 секунд
  useEffect(() => {
    if (filteredTips.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % filteredTips.length);
    }, AUTO_CHANGE_INTERVAL);

    return () => clearInterval(interval);
  }, [filteredTips]);

  const currentTip = filteredTips[currentTipIndex];

  const handlePrevious = () => {
    setCurrentTipIndex(prev => (prev - 1 + filteredTips.length) % filteredTips.length);
  };

  const handleNext = () => {
    setCurrentTipIndex(prev => (prev + 1) % filteredTips.length);
  };

  const categories = [
    { id: 'all', label: 'Все', icon: '📋', count: tips.length },
    { id: 'health', label: 'Здоровье', icon: '❤️', count: tips.filter(t => t.category === 'health').length },
    { id: 'weather', label: 'Погода', icon: '🌤️', count: tips.filter(t => t.category === 'weather').length },
    { id: 'clothing', label: 'Одежда', icon: '👕', count: tips.filter(t => t.category === 'clothing').length },
    { id: 'general', label: 'Общее', icon: '📝', count: tips.filter(t => t.category === 'general').length },
  ];

  // ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ UI =====
  const getCategoryColor = (category: string) => {
    if (category === 'health') return 'bg-rose-50 border-rose-200 text-rose-900';
    if (category === 'weather') return 'bg-blue-50 border-blue-200 text-blue-900';
    if (category === 'clothing') return 'bg-emerald-50 border-emerald-200 text-emerald-900';
    return 'bg-amber-50 border-amber-200 text-amber-900';
  };

  const getCategoryBadge = (category: string) => {
    if (category === 'health') return '❤️ Здоровье';
    if (category === 'weather') return '🌤️ Погода';
    if (category === 'clothing') return ' Одежда';
    return '📝 Общее';
  };

  // ===== ЧЕК-ЛИСТЫ =====
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

  // ===== UI =====
  return (
    <div className="space-y-6">
      {/* Заголовок с фильтрами */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm">
        {/* Заголовок с управлением */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="text-amber-500 shrink-0" size={22} />
            <h3 className="text-base sm:text-xl font-black text-slate-800">
              Умные подсказки родителям
            </h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded-lg">
            <RotateCcw size={12} />
            <span className="hidden sm:inline">Авто каждые 15 сек</span>
            <span className="sm:hidden">15 сек</span>
          </div>
        </div>

        {/* Фильтры по категориям */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="hidden sm:inline">{cat.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${
                selectedCategory === cat.id ? 'bg-white/20' : 'bg-slate-200'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Один совет с навигацией */}
        {currentTip && (
          <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all ${getCategoryColor(currentTip.category)}`}>
            <div className="flex items-start gap-3 sm:gap-4">
              <span className="text-3xl sm:text-4xl leading-none shrink-0 mt-1">
                {currentTip.icon}
              </span>
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 border border-black/10 text-slate-700">
                    {getCategoryBadge(currentTip.category)}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-500">
                    {currentTipIndex + 1} / {filteredTips.length}
                  </span>
                </div>
                
                <h4 className="font-extrabold text-sm sm:text-base leading-tight mb-2 text-slate-800">
                  {currentTip.title}
                </h4>
                <p className="text-sm sm:text-base leading-relaxed text-slate-700">
                  {currentTip.text}
                </p>
              </div>
            </div>

            {/* Навигация */}
            <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-black/5">
              <button
                onClick={handlePrevious}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/60 hover:bg-white transition-colors text-slate-700 font-bold text-xs sm:text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                title="Предыдущий совет"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Назад</span>
              </button>
              
              <div className="flex items-center gap-1">
                {filteredTips.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTipIndex(idx)}
                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                      idx === currentTipIndex
                        ? 'bg-indigo-600 scale-125'
                        : 'bg-slate-300 hover:bg-slate-400'
                    }`}
                    title={`Совет ${idx + 1}`}
                  />
                ))}
              </div>
              
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/60 hover:bg-white transition-colors text-slate-700 font-bold text-xs sm:text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                title="Следующий совет"
              >
                <span className="hidden sm:inline">Вперед</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Инфо о количестве */}
        <div className="text-center mt-4 text-xs text-slate-400 font-medium">
          Показан совет {currentTipIndex + 1} из {filteredTips.length}
          {selectedCategory !== 'all' && ` (категория: ${categories.find(c => c.id === selectedCategory)?.label})`}
        </div>
      </div>

      {/* Чек-листы */}
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
