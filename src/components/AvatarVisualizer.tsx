import React, { useState } from 'react';
import { RecommendedOutfit, ClothingItem, ChildGender, LayerVisibility } from '../types';
// ТОЛЬКО БЕЗОПАСНЫЕ ИКОНКИ ДЛЯ lucide-react@0.469.0
import { Info, Layers, Shirt, Footprints, User, Package, Wind } from 'lucide-react';
import { ChildFigure } from './ChildFigure';
import { LayerToggles } from './LayerToggles';

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
  const [vis, setVis] = useState<LayerVisibility>({
    underwear: true, lower: true, upper: true, outer: true, 
    shoes: true, headwear: true, accessory: true,
  });

  const [selected, setSelected] = useState<string | null>(null);

  const has = {
    outer: (outfit.layers?.outerwear?.length ?? 0) > 0,
    upper: (outfit.layers?.upper_layer?.length ?? 0) > 0,
    lower: (outfit.layers?.lower_layer?.length ?? 0) > 0,
    under: (outfit.layers?.underwear?.length ?? 0) > 0,
    shoes: (outfit.layers?.shoes?.length ?? 0) > 0,
    head: (outfit.layers?.headwear?.length ?? 0) > 0,
    acc: (outfit.layers?.accessories?.length ?? 0) > 0,
  };

  const toggle = (k: keyof LayerVisibility) => setVis(p => ({ ...p, [k]: !p[k] }));
  const selectItem = (item: ClothingItem) => {
    setSelected(item.layer);
    onItemSelect?.(item);
  };

  const getItems = (layer: string) => (outfit.layers as any)?.[layer] || [];

  const Card = ({ title, Icon, layer, active, num }: any) => {
    const items = getItems(layer);
    if (!items.length) return null;
    const color = num === 3 ? 'bg-rose-500' : num === 2 ? 'bg-violet-500' : num === 1 ? 'bg-sky-500' : 'bg-amber-500';
    
    return (
      <div className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${active ? 'bg-white border-indigo-200 shadow-sm' : 'bg-slate-50/50 border-slate-100 opacity-60'}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-white font-bold text-xs ${color}`}><Icon size={14} /></span>
          <h4 className="font-bold text-slate-800 text-sm truncate">{title}</h4>
        </div>
        <div className="space-y-2">
          {items.map((i: ClothingItem) => (
            <div key={i.id} onClick={() => selectItem(i)} className={`group cursor-pointer p-3 rounded-xl border-2 transition-all ${selected === i.layer ? 'border-indigo-400 bg-indigo-50/40' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
              <div className="flex items-start gap-3">
                <span className="text-3xl leading-none shrink-0 p-2 bg-slate-50 rounded-xl border border-slate-100">{i.emoji}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800 text-sm truncate group-hover:text-indigo-600">{i.name}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{i.description}</p>
                  {i.tips && <div className="mt-2 flex gap-1 text-[10px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-100"><Info size={10} className="shrink-0 mt-0.5" /><span>{i.tips}</span></div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const bg = effectiveTemp <= -15 ? 'from-blue-200 via-blue-100 to-indigo-50' : 
             effectiveTemp <= 0 ? 'from-cyan-100 via-sky-50 to-slate-50' : 
             effectiveTemp <= 15 ? 'from-amber-100 via-yellow-50 to-emerald-50' : 
             'from-yellow-200 via-amber-100 to-orange-50';

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-8 items-start">
      <div className="w-full lg:col-span-5 space-y-3">
        <div className={`bg-gradient-to-b ${bg} rounded-3xl p-5 border-4 border-white shadow-xl relative flex flex-col items-center overflow-hidden`}>
          <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur px-3 py-1.5 rounded-2xl text-xs font-bold text-slate-700 border border-white/80 shadow-sm">
            {effectiveTemp > 0 ? '+' : ''}{effectiveTemp}°C
          </div>
          <button onClick={() => setVis({ underwear: true, lower: true, upper: true, outer: true, shoes: true, headwear: true, accessory: true })} className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur p-2 rounded-xl text-slate-500 shadow-sm"><Layers size={14} /></button>
          
          <div className="w-full max-w-[280px] aspect-[11/20] pt-8 pb-2">
            <ChildFigure gender={gender} effectiveTemp={effectiveTemp} isRainy={!!isRainy} isSnowy={!!isSnowy} isWindy={!!isWindy} show={vis} />
          </div>
          
          <div className="mt-2 flex items-center gap-2 text-sm font-bold">
            <span className={gender === 'girl' ? 'text-pink-600' : 'text-blue-600'}>{gender === 'girl' ? '👧 Девочка' : '👦 Мальчик'}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">{effectiveTemp > 15 ? '☀️ Лето' : effectiveTemp > 0 ? ' Демисезон' : '❄️ Зима'}</span>
          </div>
        </div>
        <LayerToggles visibility={vis} onToggle={toggle} />
      </div>

      <div className="w-full lg:col-span-7 space-y-4">
        <div className="hidden sm:block">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><Layers size={22} className="text-indigo-500" /><span>Полный гардероб на прогулку</span></h3>
          <p className="text-sm text-slate-500 mt-1">Собираем ребенка слой за слоем.</p>
        </div>
        
        <div className="space-y-3">
          {/* БЕЗОПАСНЫЕ ИКОНКИ ДЛЯ 0.469.0 */}
          <Card title="Нательное белье" Icon={Shirt} layer="underwear" active={vis.underwear && has.under} num={1} />
          <Card title="Нижний слой" Icon={User} layer="lower_layer" active={vis.lower && has.lower} num={2} />
          <Card title="Верхний слой" Icon={Shirt} layer="upper_layer" active={vis.upper && has.upper} num={2} />
          <Card title="Верхняя одежда" Icon={Wind} layer="outerwear" active={vis.outer && has.outer} num={3} />
          <Card title="Головной убор" Icon={User} layer="headwear" active={vis.headwear && has.head} num={0} />
          <Card title="Обувь" Icon={Footprints} layer="shoes" active={vis.shoes && has.shoes} num={0} />
          <Card title="Аксессуары" Icon={Package} layer="accessories" active={vis.accessory && has.acc} num={0} />
        </div>

        {outfit.specialAdvice?.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 space-y-2">
            <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2"><span className="text-base">️</span> Важные рекомендации</h4>
            <ul className="space-y-1">{outfit.specialAdvice.map((a, i) => <li key={i} className="text-xs text-amber-800 flex gap-2"><span className="shrink-0 text-amber-500"></span><span>{a}</span></li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
};
