import React from 'react';
import { ClothingLayer } from '../types';

interface LayerTogglesProps {
  visibility: Record<ClothingLayer, boolean>;
  onToggle: (layer: ClothingLayer) => void;
}

const LAYER_CONFIG: { key: ClothingLayer; label: string; icon: string }[] = [
  { key: 'outerwear', label: 'Верхняя одежда', icon: '🧥' },
  { key: 'upper_layer', label: 'Верхний слой', icon: '🧶' },
  { key: 'lower_layer', label: 'Нижний слой', icon: '👖' },
  { key: 'underwear', label: 'Нательное белье', icon: '👕' },
  { key: 'headwear', label: 'Головной убор', icon: '' },
  { key: 'shoes', label: 'Обувь', icon: '' },
  { key: 'accessories', label: 'Аксессуары', icon: '🧣' },
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
