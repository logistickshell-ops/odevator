import React, { useState } from 'react';
// Импортируем типы и константы из актуального types.ts
import { RecommendedOutfit, ClothingItem, ChildGender, LayerId, LayerVisibility, LAYER_ORDER, LAYER_LABELS } from '../types';
import { Eye, EyeOff, Shirt, Layers, Footprints } from 'lucide-react';
import { ChildFigure } from './ChildFigure';

interface AvatarVisualizerProps {
  gender: ChildGender;
  outfit: RecommendedOutfit;
  effectiveTemp: number;
  isRainy?: boolean;
  isSnowy?: boolean;
  isWindy?: boolean;
  onItemSelect?: (item: ClothingItem) => void;
}

// Эмодзи для кнопок переключения слоев
const LAYER_EMOJI: Record<LayerId, string> = {
  outer: '🧥', upper: '🧶', lower: '👖', underwear: '', headwear: '🧢', shoes: '👟', accessory: '🧤',
};

export const AvatarVisualizer: React.FC<AvatarVisualizerProps> = ({
  gender, outfit, effectiveTemp, isRainy = false, isSnowy = false, isWindy = false, onItemSelect,
}) => {
  // Состояние видимости слоев (по умолчанию все включены)
  const [hidden, setHidden] = useState<LayerVisibility>({
    underwear: false, lower: false, upper: false, outer: false, headwear: false, shoes: false, accessory: false,
  });

  // ИСПРАВЛЕННАЯ ФУНКЦИЯ: читаем данные напрямую из полей outfit
  const itemsOf = (l: LayerId): ClothingItem[] => {
    if (!outfit) return [];
    
    switch (l) {
      case 'underwear': return outfit.underwear || [];
      case 'lower': return outfit.lower || [];
      case 'upper': return outfit.upper || [];
      case 'outer': return outfit.outer || [];
      case 'headwear': return outfit.headwear || [];
      case 'shoes': return outfit.shoes || [];
      case 'accessory': return outfit.accessories || []; // Обрати внимание: accessories (множественное число)
      default: return [];
    }
  };

  const has = (l: LayerId) => itemsOf(l).length > 0;
  
  // Вычисляем реальную видимость: слой есть в гардеробе И не скрыт пользователем
  const show: LayerVisibility = {
    underwear: has('underwear') && !hidden.underwear,
    lower: has('lower') && !hidden.lower,
    upper: has('upper') && !hidden.upper,
    outer: has('outer') && !hidden.outer,
    headwear: has('headwear') && !hidden.headwear,
    shoes: has('shoes') && !hidden.shoes,
    accessory: has('accessory') && !hidden.accessory,
  };

  const toggle = (l: LayerId) => setHidden((s) => ({ ...s, [l]: !s[l] }));

  // Градиент фона в зависимости от температуры
  const bgGradient = effectiveTemp <= 0 ? 'from-sky-100 to-indigo-50' : effectiveTemp <= 15 ? 'from-indigo-100 to-sky-50' : 'from-amber-100 to-rose-50';

  // Рендер карточки отдельного слоя одежды
  const renderLayerCard = (layer: LayerId, layerNum: number) => {
    const items = itemsOf(layer);
    if (items.length === 0) return null;
    const visible = show[layer];
    
    return (
      <div key={layer} className={`bg-white/85 backdrop-blur rounded-2xl sm:rounded-3xl border p-3 sm:p-4 shadow-xs transition ${visible ? 'border-indigo-100/70' : 'border-slate-100 opacity-60'}`}>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base">{LAYER_EMOJI[layer]}</span>
            <h3 className="text-[11px] sm:text-sm font-black text-slate-800 truncate">{LAYER_LABELS[layer]}</h3>
            {layerNum > 0 && (
              <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md shrink-0">СЛОЙ {layerNum}</span>
            )}
          </div>
          <button onClick={() => toggle(layer)} className="p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:text-indigo-600 transition shrink-0" aria-label={`Переключить: ${LAYER_LABELS[layer]}`}>
            {visible ? <Eye size={13} /> : <EyeOff size={13} />}
          </button>
        </div>
        <div className="space-y-1.5">
          {items.map((item) => (
            <button key={item.id} onClick={() => onItemSelect?.(item)} className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/70 hover:bg-indigo-50/60 border border-slate-100/60 text-left transition active:scale-[0.98]">
              <span className="text-xl leading-none">{item.emoji}</span>
              <span className="min-w-0">
                <span className="block text-[11px] sm:text-xs font-extrabold text-slate-700 truncate">{item.name}</span>
                <span className="block text-[9px] sm:text-[10px] text-slate-400 font-medium truncate">{item.description}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-8 items-start">
      {/* Левая колонка: Аватар и кнопки управления */}
      <div className="w-full lg:col-span-5 space-y-3 sm:space-y-4">
        <div className={`bg-gradient-to-b ${bgGradient} rounded-2xl sm:rounded-3xl p-3 sm:p-5 border-3 sm:border-4 border-white shadow-lg sm:shadow-xl relative flex flex-col items-center overflow-hidden`}>
          
          {/* Компонент ребенка */}
          <div className="w-full max-w-[230px] sm:max-w-[280px] aspect-[3/5] pt-6 sm:pt-8 pb-1 sm:pb-2">
            <ChildFigure
              gender={gender}
              effectiveTemp={effectiveTemp}
              isRainy={isRainy}
              isSnowy={isSnowy}
              isWindy={isWindy}
              show={show}
              outfit={outfit}
            />
          </div>

          {/* Панель управления слоями */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100 shadow-sm w-full mt-4">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {LAYER_ORDER.map((l) => (
                <button
                  key={l}
                  disabled={!has(l)}
                  onClick={() => toggle(l)}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-extrabold border-2 transition-all active:scale-95 ${
                    !has(l) ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                    : show[l] ? 'bg-indigo-500 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-indigo-500 border-indigo-200'
                  }`}
                >
                  <span>{LAYER_EMOJI[l]}</span>
                  <span className="hidden sm:inline">{LAYER_LABELS[l]}</span>
                  <span className="sm:hidden">{show[l] ? '✓' : '✗'}</span>
                </button>
              ))}
            </div>
            
            {/* Индикаторы основных слоев одежды */}
            <div className="flex items-center justify-center gap-1 pt-2">
              <span className="text-[9px] font-bold text-slate-400">Слои:</span>
              {(['outer', 'upper', 'lower', 'underwear'] as LayerId[]).map((l, i) =>
                has(l) ? (
                  <span key={l} className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition ${show[l] ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400 line-through'}`}>
                    {4 - i}
                  </span>
                ) : null,
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Правая колонка: Детальный чек-лист гардероба */}
      <div className="w-full lg:col-span-7 space-y-2 sm:space-y-4">
        {renderLayerCard('outer', 4)}
        {renderLayerCard('upper', 3)}
        {renderLayerCard('lower', 2)}
        {renderLayerCard('underwear', 1)}
        {renderLayerCard('headwear', 0)}
        {renderLayerCard('shoes', 0)}
        {renderLayerCard('accessory', 0)}
      </div>
    </div>
  );
};
