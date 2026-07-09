import React, { useState } from 'react';
import { RecommendedOutfit, ClothingItem, ChildGender } from '../types';
import { Info, Eye, EyeOff, Layers, Shirt, Footprints } from 'lucide-react';
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

export const AvatarVisualizer: React.FC<AvatarVisualizerProps> = ({
  gender, outfit, effectiveTemp, isRainy = false, isSnowy = false, isWindy = false, onItemSelect
}) => {
  const [showOuter, setShowOuter] = useState(true);
  const [showMiddle, setShowMiddle] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const hasBase = outfit.base.length > 0;
  const hasMiddle = outfit.middle.length > 0;
  const hasOuter = outfit.outer.length > 0;
  const hasShoes = outfit.shoes.length > 0;

  const handleItemClick = (item: ClothingItem) => {
    setSelectedCategory(item.category);
    if (onItemSelect) onItemSelect(item);
  };

  const climateLabel = (() => {
    if (effectiveTemp <= -15) return { text: 'Мороз', emoji: '🥶', color: 'bg-blue-600' };
    if (effectiveTemp <= -5) return { text: 'Зима', emoji: '❄️', color: 'bg-blue-500' };
    if (effectiveTemp <= 0) return { text: 'Около нуля', emoji: '🌨️', color: 'bg-cyan-500' };
    if (effectiveTemp <= 5) return { text: 'Прохладно', emoji: '🌥️', color: 'bg-cyan-400' };
    if (effectiveTemp <= 10) return { text: 'Свежо', emoji: '🍃', color: 'bg-teal-400' };
    if (effectiveTemp <= 15) return { text: 'Умеренно', emoji: '🌤️', color: 'bg-amber-400' };
    if (effectiveTemp <= 20) return { text: 'Тепло', emoji: '☀️', color: 'bg-orange-400' };
    return { text: 'Жарко', emoji: '🔥', color: 'bg-red-500' };
  })();

  const bgGradient = (() => {
    if (effectiveTemp <= -15) return 'from-blue-200 via-blue-100 to-indigo-50';
    if (effectiveTemp <= -5) return 'from-sky-200 via-blue-50 to-indigo-50';
    if (effectiveTemp <= 0) return 'from-cyan-100 via-sky-50 to-slate-50';
    if (effectiveTemp <= 5) return 'from-teal-100 via-cyan-50 to-sky-50';
    if (effectiveTemp <= 10) return 'from-emerald-100 via-teal-50 to-cyan-50';
    if (effectiveTemp <= 15) return 'from-amber-100 via-yellow-50 to-emerald-50';
    if (effectiveTemp <= 20) return 'from-orange-100 via-amber-50 to-yellow-50';
    return 'from-yellow-200 via-amber-100 to-orange-50';
  })();

  const renderLayerCard = (
    title: string,
    icon: React.ReactNode,
    items: ClothingItem[],
    isActive: boolean,
    layerNum: number,
    onToggle?: () => void,
    toggleState?: boolean
  ) => {
    if (items.length === 0) return null;
    const layerColor = layerNum === 3 ? 'bg-rose-500' : layerNum === 2 ? 'bg-violet-500' : layerNum === 1 ? 'bg-sky-500' : 'bg-amber-500';

    return (
      <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
        isActive ? 'bg-white border-indigo-200/80 shadow-sm' : 'bg-slate-50/50 border-slate-100 opacity-60'
      }`}>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <span className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl text-white font-extrabold text-[10px] sm:text-xs shrink-0 ${layerColor}`}>
              {icon}
            </span>
            <h4 className="font-bold text-slate-800 text-[11px] sm:text-sm leading-tight truncate">{title}</h4>
          </div>
          {onToggle && (
            <button onClick={onToggle} className={`flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl border transition-all shrink-0 ml-2 ${
              toggleState
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm active:bg-indigo-700'
                : 'bg-slate-100 text-slate-500 border-slate-200 active:bg-slate-200'
            }`}>
              {toggleState ? <EyeOff size={11} /> : <Eye size={11} />}
              <span className="hidden xs:inline">{toggleState ? 'Снять' : 'Надеть'}</span>
            </button>
          )}
        </div>
        <div className="space-y-1.5 sm:space-y-2.5">
          {items.map((item) => {
            const isHl = selectedCategory === item.category;
            return (
              <div key={item.id} onClick={() => handleItemClick(item)}
                className={`group cursor-pointer p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl border-2 transition-all duration-200 active:scale-[0.98] ${
                  isHl ? 'border-indigo-400 bg-indigo-50/40 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'
                }`}>
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="text-2xl sm:text-3xl select-none leading-none shrink-0 mt-0.5 p-1 sm:p-1.5 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-100">
                    {item.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-slate-800 text-[11px] sm:text-sm group-hover:text-indigo-600 transition truncate">{item.name}</span>
                      <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{item.description}</p>
                    {item.tips && (
                      <div className="mt-1.5 sm:mt-2 flex items-start gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] text-amber-700 bg-amber-50 p-1.5 sm:p-2 rounded-lg border border-amber-100/70">
                        <Info size={10} className="mt-0.5 shrink-0 text-amber-500" />
                        <span className="leading-relaxed">{item.tips}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-8 items-start">

      {/* ===== AVATAR PANEL ===== */}
      <div className="w-full lg:col-span-5 space-y-3 sm:space-y-4">
        <div className={`bg-gradient-to-b ${bgGradient} rounded-2xl sm:rounded-3xl p-3 sm:p-5 border-3 sm:border-4 border-white shadow-lg sm:shadow-xl relative flex flex-col items-center overflow-hidden`}>

          {/* Temp badge */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
            <div className="bg-white/90 backdrop-blur px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-extrabold text-slate-700 border border-white/80 shadow-sm flex items-center gap-1.5 sm:gap-2">
              <span>{climateLabel.emoji}</span>
              <span className="hidden sm:inline">{climateLabel.text}</span>
              <span className={`px-2 py-0.5 rounded-lg text-white text-[10px] sm:text-[11px] ${climateLabel.color}`}>
                {effectiveTemp > 0 ? '+' : ''}{effectiveTemp}°
              </span>
            </div>
          </div>

          {/* Reset */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
            <button onClick={() => { setShowOuter(true); setShowMiddle(true); }}
              className="bg-white/90 backdrop-blur p-2 rounded-xl text-slate-500 active:text-indigo-600 active:bg-white transition border border-white/80 shadow-sm">
              <Layers size={14} />
            </button>
          </div>

          {/* SVG child */}
          <div className="w-full max-w-[230px] sm:max-w-[280px] aspect-[11/20] pt-6 sm:pt-8 pb-1 sm:pb-2">
            <ChildFigure gender={gender} effectiveTemp={effectiveTemp} isRainy={isRainy} isSnowy={isSnowy} isWindy={isWindy} showOuter={showOuter} showMiddle={showMiddle} />
          </div>

          {/* Gender + season label */}
          <div className="mb-1 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
            <span className={`text-xs sm:text-sm font-extrabold ${gender === 'girl' ? 'text-pink-600' : 'text-blue-600'}`}>
              {gender === 'girl' ? '👧 Девочка' : '👦 Мальчик'}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-400">•</span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-500">
              {effectiveTemp <= 0 ? '❄️ Зима' : effectiveTemp <= 10 ? '🍂 Демисезон' : '☀️ Лето'}
            </span>
          </div>
        </div>

        {/* Layer control panel */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100 shadow-sm space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base">🧅</span>
            <div className="min-w-0">
              <h4 className="text-[11px] sm:text-sm font-extrabold text-slate-700">Луковый разбор</h4>
              <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">Снимайте слои чтобы увидеть что под курткой</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button disabled={!hasOuter} onClick={() => setShowOuter(!showOuter)}
              className={`flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-extrabold border-2 transition-all active:scale-95 ${
                !hasOuter ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' :
                showOuter ? 'bg-rose-500 text-white border-rose-600 shadow-md active:bg-rose-600' :
                'bg-white text-rose-500 border-rose-200 active:bg-rose-50'
              }`}>
              {showOuter ? <EyeOff size={12} /> : <Eye size={12} />}
              <span>Куртка {showOuter ? '✓' : '✗'}</span>
            </button>
            <button disabled={!hasMiddle} onClick={() => setShowMiddle(!showMiddle)}
              className={`flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-extrabold border-2 transition-all active:scale-95 ${
                !hasMiddle ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' :
                showMiddle ? 'bg-violet-500 text-white border-violet-600 shadow-md active:bg-violet-600' :
                'bg-white text-violet-500 border-violet-200 active:bg-violet-50'
              }`}>
              {showMiddle ? <EyeOff size={12} /> : <Eye size={12} />}
              <span>Кофта {showMiddle ? '✓' : '✗'}</span>
            </button>
          </div>
          {/* Layer indicators */}
          <div className="flex items-center gap-1 pt-0.5">
            <span className="text-[9px] font-bold text-slate-400 mr-0.5">Слои:</span>
            {hasOuter && <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold transition-all ${showOuter ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-400 line-through'}`}>Внеш</span>}
            {hasMiddle && <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold transition-all ${showMiddle ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-400 line-through'}`}>Сред</span>}
            {hasBase && <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-sky-100 text-sky-700">Нател</span>}
          </div>
        </div>
      </div>

      {/* ===== CLOTHING CHECKLIST ===== */}
      <div className="w-full lg:col-span-7 space-y-3 sm:space-y-5">
        <div className="hidden sm:block">
          <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <Layers size={22} className="text-indigo-500" />
            <span>Полный гардероб на прогулку</span>
          </h3>
          <p className="text-sm text-slate-500 mt-1">Собираем ребенка слой за слоем — от нательного белья до аксессуаров.</p>
        </div>
        <div className="sm:hidden text-center">
          <h3 className="text-sm font-extrabold text-slate-800">📋 Чек-лист гардероба</h3>
        </div>

        <div className="space-y-2 sm:space-y-4">
          {renderLayerCard('Верхняя одежда', <Shirt size={13} />, outfit.outer, showOuter && hasOuter, 3, hasOuter ? () => setShowOuter(!showOuter) : undefined, showOuter)}
          {renderLayerCard('Утепляющий слой', <Layers size={13} />, outfit.middle, showMiddle && hasMiddle, 2, hasMiddle ? () => setShowMiddle(!showMiddle) : undefined, showMiddle)}
          {renderLayerCard('Нательное бельё', <Shirt size={13} />, outfit.base, hasBase, 1)}
          {renderLayerCard('Обувь', <Footprints size={13} />, outfit.shoes, hasShoes, 0)}
          {renderLayerCard('Аксессуары', <span className="text-xs">🧤</span>, outfit.accessories, outfit.accessories.length > 0, 0)}
        </div>

        {/* Advice */}
        {outfit.specialAdvice.length > 0 && (
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50/80 border border-amber-200/70 space-y-1.5 sm:space-y-2">
            <h4 className="font-extrabold text-amber-900 text-[11px] sm:text-sm flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-base">⚠️</span> Важные рекомендации
            </h4>
            <ul className="space-y-1">
              {outfit.specialAdvice.map((advice, i) => (
                <li key={i} className="text-[10px] sm:text-xs text-amber-800 leading-relaxed flex items-start gap-1.5 sm:gap-2">
                  <span className="mt-0.5 shrink-0 text-amber-500">▸</span>
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
};
