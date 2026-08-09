import React from 'react';
import { LayerVisibility } from '../types';

type LayerKey = keyof LayerVisibility;

interface LayerTogglesProps {
  visibility: LayerVisibility;
  onToggle: (layer: LayerKey) => void;
}

const LAYER_CONFIG: { key: LayerKey; label: string; icon: string }[] = [
  { key: 'outer', label: 'Верхняя одежда', icon: '🧥' },
  { key: 'upper', label: 'Верхний слой', icon: '🧶' },
  { key: 'lower', label: 'Нижний слой', icon: '👖' },
  { key: 'underwear', label: 'Нательное белье', icon: '👕' },
  { key: 'headwear', label: 'Головной убор', icon: '🧢' },
  { key: 'shoes', label: 'Обувь', icon: '👟' },
  { key: 'accessory', label: 'Аксессуары', icon: '🧣' },
];

export const LayerToggles: React.FC<LayerTogglesProps> = ({ visibility, onToggle }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-white rounded-2xl shadow-sm">
      {LAYER_CONFIG.map((layer) => (
        <button
          key={layer.key}
          onClick={() => onToggle(layer.key)}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
            visibility[layer.key]
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
              : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-lg">{layer.icon}</span>
          <span className="text-xs font-bold">{layer.label}</span>
        </button>
      ))}
    </div>
  );
};
