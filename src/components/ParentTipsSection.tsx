import React, { useState, useEffect } from 'react';
import { ParentTip } from '../types';
import { Lightbulb, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

interface ParentTipsSectionProps {
  tips: ParentTip[];
}

export const ParentTipsSection: React.FC<ParentTipsSectionProps> = ({ tips }) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isAutoRotate, setIsAutoRotate] = useState(true);

  // Функция для получения случайного индекса (не равного текущему)
  const getRandomIndex = (currentIdx: number) => {
    if (tips.length <= 1) return 0;
    let newIdx;
    do {
      newIdx = Math.floor(Math.random() * tips.length);
    } while (newIdx === currentIdx);
    return newIdx;
  };

  // Функция смены совета
  const rotateTip = () => {
    setCurrentTipIndex(prev => getRandomIndex(prev));
  };

  // Переключение на следующий/предыдущий совет (по кругу)
  const nextTip = () => {
    setCurrentTipIndex(prev => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTipIndex(prev => (prev - 1 + tips.length) % tips.length);
  };

  // При монтировании — случайный совет
  useEffect(() => {
    if (tips.length > 0) {
      setCurrentTipIndex(Math.floor(Math.random() * tips.length));
    }
  }, [tips]);

  // Автосмена каждые 15 секунд (если включена)
  useEffect(() => {
    if (!isAutoRotate || tips.length <= 1) return;
    
    const interval = setInterval(() => {
      rotateTip();
    }, 15000); // 15 секунд

    return () => clearInterval(interval);
  }, [isAutoRotate, tips, currentTipIndex]);

  // Если нет советов — показываем заглушку
  if (tips.length === 0) {
    return (
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-100 shadow-sm text-center">
        <Lightbulb className="text-slate-300 mx-auto mb-2" size={32} />
        <p className="text-slate-500 text-sm">Скоро здесь появятся полезные советы</p>
      </div>
    );
  }

  const currentTip = tips[currentTipIndex];

  // Функция для определения цвета иконки в зависимости от приоритета
  const getPriorityColor = (priority: string) => {
    if (priority === 'danger') return 'text-rose-500 bg-rose-50 border-rose-200';
    if (priority === 'warning') return 'text-amber-500 bg-amber-50 border-amber-200';
    return 'text-blue-500 bg-blue-50 border-blue-200';
  };

  return (
    <div className="space-y-6">
      {/* Динамическая карточка совета */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm">
        {/* Заголовок с управлением */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="text-amber-500 shrink-0" size={22} />
            <h3 className="text-base sm:text-xl font-black text-slate-800">
              Умные подсказки родителям
            </h3>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Кнопка автосмены */}
            <button
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              className={`p-1.5 sm:p-2 rounded-lg transition-all text-xs font-bold ${
                isAutoRotate 
                  ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200' 
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
              title={isAutoRotate ? 'Выключить автосмену' : 'Включить автосмену'}
            >
              {isAutoRotate ? '🔄 Авто' : '⏸️ Стоп'}
            </button>

            {/* Кнопка обновления */}
            <button
              onClick={rotateTip}
              className="p-1.5 sm:p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all"
              title="Случайный совет"
            >
              <RefreshCw size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </div>

        {/* Основной контент */}
        <div className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all ${getPriorityColor(currentTip.priority)}`}>
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="text-3xl sm:text-4xl leading-none shrink-0 mt-0.5">
              {currentTip.icon}
            </span>
            
            <div className="min-w-0 flex-1">
              <h4 className="font-extrabold text-sm sm:text-base leading-tight mb-1.5 text-slate-800">
                {currentTip.title}
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                {currentTip.text}
              </p>
              
              {/* Индикатор приоритета (заменяет категорию) */}
              <div className="mt-2 flex items-center gap-2">
                <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 border border-black/10 text-slate-700`}>
                  {currentTip.priority === 'danger' && '⚠️ Критично'}
                  {currentTip.priority === 'warning' && '⚡ Важно'}
                  {currentTip.priority === 'info' && '💡 Совет'}
                </span>
                
                <span className="text-[9px] sm:text-[10px] text-slate-400">
                  {currentTipIndex + 1} / {tips.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Навигация (стрелки) */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={prevTip}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
            title="Предыдущий совет"
          >
            <ChevronLeft size={18} className="sm:w-[20px] sm:h-[20px]" />
          </button>
          
          <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
            {isAutoRotate ? 'Автосмена каждые 15 сек' : 'Ручной режим'}
          </span>
          
          <button
            onClick={nextTip}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
            title="Следующий совет"
          >
            <ChevronRight size={18} className="sm:w-[20px] sm:h-[20px]" />
          </button>
        </div>
      </div>

      {/* Чек-листы (оставляем как есть, они не связаны с советами) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="text-indigo-500 shrink-0" size={22} />
          <h3 className="text-base sm:text-xl font-black text-slate-800">
            Чек-листы безопасности прогулки
          </h3>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 mb-4 leading-relaxed">
          Отмечайте выполненные пункты для полной уверенности в комфорте малыша на каждом этапе.
        </p>

        {/* ... остальной код чек-листов без изменений ... */}
        {/* (оставь все что ниже, оно не трогается) */}
      </div>
    </div>
  );
};
