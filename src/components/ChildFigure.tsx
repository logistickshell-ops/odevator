import React from 'react';
import { ChildGender, LayerVisibility } from '../types';

export interface ChildFigureProps {
  gender: ChildGender;
  effectiveTemp: number;
  isRainy: boolean;
  isSnowy: boolean;
  isWindy: boolean;
  showOuter: boolean;   // ИСПРАВЛЕНО: добавлено
  showMiddle: boolean; // ИСПРАВЛЕНО: добавлено
}

export const ChildFigure: React.FC<ChildFigureProps> = ({
  gender,
  effectiveTemp,
  isRainy,
  isSnowy,
  isWindy,
  showOuter,
  showMiddle,
}) => {
  // Определяем цвета и элементы на основе погоды
  const skinColor = '#FFD5B8';
  const hairColor = gender === 'girl' ? '#8B4513' : '#4A3728';
  
  // Логика одежды по температуре
  const hasBase = true;
  const hasMiddle = showMiddle && effectiveTemp <= 15;
  const hasOuter = showOuter && effectiveTemp <= 5;
  const hasHat = effectiveTemp <= 10 || isWindy;
  const hasScarf = effectiveTemp <= 0;
  const hasGloves = effectiveTemp <= -5;
  const hasUmbrella = isRainy;
  const hasBoots = isRainy || isSnowy || effectiveTemp <= 0;

  return (
    <svg viewBox="0 0 200 400" className="w-full h-full drop-shadow-lg">
      {/* Тело */}
      <ellipse cx="100" cy="180" rx="35" ry="50" fill={skinColor} />
      
      {/* Голова */}
      <circle cx="100" cy="90" r="35" fill={skinColor} />
      
      {/* Волосы */}
      {gender === 'girl' ? (
        <path d="M65 80 Q60 40 100 35 Q140 40 135 80 L140 120 Q130 110 120 120 L115 90 Q100 95 85 90 L80 120 Q70 110 60 120 Z" fill={hairColor} />
      ) : (
        <path d="M70 75 Q70 45 100 40 Q130 45 130 75 L125 85 Q100 80 75 85 Z" fill={hairColor} />
      )}
      
      {/* Глаза */}
      <circle cx="88" cy="88" r="3" fill="#333" />
      <circle cx="112" cy="88" r="3" fill="#333" />
      
      {/* Рот */}
      <path d="M92 102 Q100 108 108 102" stroke="#E88B8B" strokeWidth="2" fill="none" strokeLinecap="round" />
      
      {/* Нательное бельё (база) */}
      {hasBase && (
        <g>
          <rect x="72" y="140" width="56" height="70" rx="8" fill="#87CEEB" opacity="0.9" />
          <rect x="78" y="210" width="20" height="60" rx="5" fill="#87CEEB" opacity="0.9" />
          <rect x="102" y="210" width="20" height="60" rx="5" fill="#87CEEB" opacity="0.9" />
        </g>
      )}
      
      {/* Средний слой */}
      {hasMiddle && (
        <g>
          <rect x="68" y="138" width="64" height="75" rx="10" fill="#9B59B6" opacity="0.85" />
          <rect x="40" y="145" width="30" height="50" rx="8" fill="#9B59B6" opacity="0.85" />
          <rect x="130" y="145" width="30" height="50" rx="8" fill="#9B59B6" opacity="0.85" />
        </g>
      )}
      
      {/* Верхняя одежда */}
      {hasOuter && (
        <g>
          <rect x="64" y="135" width="72" height="80" rx="12" fill="#E74C3C" opacity="0.9" />
          <rect x="35" y="142" width="32" height="55" rx="10" fill="#E74C3C" opacity="0.9" />
          <rect x="133" y="142" width="32" height="55" rx="10" fill="#E74C3C" opacity="0.9" />
          {/* Молния */}
          <line x1="100" y1="140" x2="100" y2="215" stroke="#C0392B" strokeWidth="2" />
        </g>
      )}
      
      {/* Обувь */}
      <g>
        <ellipse cx="88" cy="278" rx="14" ry="8" fill={hasBoots ? "#2C3E50" : "#F39C12"} />
        <ellipse cx="112" cy="278" rx="14" ry="8" fill={hasBoots ? "#2C3E50" : "#F39C12"} />
      </g>
      
      {/* Шапка */}
      {hasHat && (
        <path d="M68 78 Q68 50 100 45 Q132 50 132 78 L130 85 Q100 82 70 85 Z" fill="#E67E22" />
      )}
      
      {/* Шарф */}
      {hasScarf && (
        <rect x="75" y="120" width="50" height="15" rx="7" fill="#27AE60" />
      )}
      
      {/* Перчатки */}
      {hasGloves && (
        <g>
          <circle cx="38" cy="200" r="10" fill="#3498DB" />
          <circle cx="162" cy="200" r="10" fill="#3498DB" />
        </g>
      )}
      
      {/* Зонт */}
      {hasUmbrella && (
        <g transform="translate(155, 120) rotate(15)">
          <line x1="0" y1="0" x2="0" y2="80" stroke="#555" strokeWidth="3" />
          <path d="M-30 0 Q0 -30 30 0 Z" fill="#F1C40F" />
        </g>
      )}
    </svg>
  );
};
