import React from 'react';
import { ChildGender, LayerVisibility } from '../types';

interface ChildFigureProps {
  gender: ChildGender;
  effectiveTemp: number;
  isRainy: boolean;
  isSnowy: boolean;
  isWindy: boolean;
  show: LayerVisibility;
}

type Zone = 'arctic' | 'winter' | 'freeze' | 'chilly' | 'cool' | 'mild' | 'warm' | 'hot';
const zoneFromTemp = (t: number): Zone =>
  t <= -15 ? 'arctic' : t <= -5 ? 'winter' : t <= 0 ? 'freeze' : t <= 5 ? 'chilly' :
  t <= 10 ? 'cool' : t <= 15 ? 'mild' : t <= 20 ? 'warm' : 'hot';

export const ChildFigure: React.FC<ChildFigureProps> = ({
  gender, effectiveTemp, isRainy, isSnowy, isWindy, show,
}) => {
  const girl = gender === 'girl';
  const zone = zoneFromTemp(effectiveTemp);
  const cold = ['arctic', 'winter', 'freeze'].includes(zone);
  const coolish = cold || ['chilly', 'cool'].includes(zone);
  const hot = zone === 'hot';

  // Координаты куклы
  const CX = 120;
  const Y_HEAD = 60;       // Центр головы
  const HEAD_R = 42;       // Радиус головы
  const Y_NECK = 102;      // Шея
  const Y_SHOULDER = 118;  // Плечи
  const Y_WAIST = 190;     // Талия
  const Y_HIP = 210;       // Бёдра
  const Y_KNEE = 270;      // Колени
  const Y_ANKLE = 330;     // Щиколотки

  // Палитра
  const C = girl
    ? {
        skin: '#FFDAB9', skinShadow: '#F4C4A0',
        hair: '#8B4513', hairLight: '#A0522D',
        top: '#87CEEB', topShadow: '#6BB5D9',
        upper: '#DDA0DD', upperShadow: '#C48BC4',
        outer: '#FF69B4', outerShadow: '#E0559E',
        bottom: '#87CEEB', bottomShadow: '#6BB5D9',
        shoes: '#FF6347', shoesShadow: '#E04E35',
        hat: '#87CEEB', hatShadow: '#6BB5D9',
        scarf: '#FF69B4', scarfShadow: '#E0559E',
        mitt: '#DDA0DD', mittShadow: '#C48BC4',
        under: '#FFFFFF', underShadow: '#E8E8E8',
        outline: '#5D4037',
        blush: '#FFB6C1',
      }
    : {
        skin: '#FFDAB9', skinShadow: '#F4C4A0',
        hair: '#654321', hairLight: '#7D5A3C',
        top: '#87CEEB', topShadow: '#6BB5D9',
        upper: '#6495ED', upperShadow: '#4A7BD4',
        outer: '#4169E1', outerShadow: '#2E52B8',
        bottom: '#4682B4', bottomShadow: '#2E6A96',
        shoes: '#FF6347', shoesShadow: '#E04E35',
        hat: '#4682B4', hatShadow: '#2E6A96',
        scarf: '#FF6347', scarfShadow: '#E04E35',
        mitt: '#6495ED', mittShadow: '#4A7BD4',
        under: '#FFFFFF', underShadow: '#E8E8E8',
        outline: '#5D4037',
        blush: '#FFB6C1',
      };

  const shortSleeve = hot || zone === 'warm';
  const drawSkirt = girl && !cold && zone !== 'chilly';
  const drawShorts = !girl && (hot || zone === 'warm');

  // ЦЕЛЬНЫЙ СИЛУЭТ КУКЛЫ (один path)
  const dollBody = `
    M ${CX} ${Y_HEAD - HEAD_R}
    Q ${CX + HEAD_R} ${Y_HEAD - HEAD_R} ${CX + HEAD_R} ${Y_HEAD}
    Q ${CX + HEAD_R} ${Y_HEAD + HEAD_R * 0.6} ${CX + 18} ${Y_NECK}
    L ${CX + 18} ${Y_SHOULDER}
    Q ${CX + 50} ${Y_SHOULDER} ${CX + 56} ${Y_SHOULDER + 12}
    L ${CX + 62} ${Y_SHOULDER + 70}
    Q ${CX + 64} ${Y_SHOULDER + 82} ${CX + 54} ${Y_SHOULDER + 84}
    L ${CX + 44} ${Y_SHOULDER + 82}
    L ${CX + 40} ${Y_SHOULDER + 20}
    L ${CX + 36} ${Y_WAIST}
    Q ${CX + 38} ${Y_HIP} ${CX + 32} ${Y_HIP + 8}
    L ${CX + 28} ${Y_KNEE}
    L ${CX + 26} ${Y_ANKLE}
    Q ${CX + 26} ${Y_ANKLE + 12} ${CX + 14} ${Y_ANKLE + 12}
    L ${CX + 6} ${Y_ANKLE + 12}
    Q ${CX + 2} ${Y_ANKLE + 12} ${CX + 2} ${Y_ANKLE}
    L ${CX + 4} ${Y_KNEE}
    L ${CX + 6} ${Y_HIP + 8}
    L ${CX} ${Y_HIP}
    L ${CX - 6} ${Y_HIP + 8}
    L ${CX - 4} ${Y_KNEE}
    L ${CX - 2} ${Y_ANKLE}
    Q ${CX - 2} ${Y_ANKLE + 12} ${CX - 6} ${Y_ANKLE + 12}
    L ${CX - 14} ${Y_ANKLE + 12}
    Q ${CX - 26} ${Y_ANKLE + 12} ${CX - 26} ${Y_ANKLE}
    L ${CX - 28} ${Y_KNEE}
    L ${CX - 32} ${Y_HIP + 8}
    Q ${CX - 38} ${Y_HIP} ${CX - 36} ${Y_WAIST}
    L ${CX - 40} ${Y_SHOULDER + 20}
    L ${CX - 44} ${Y_SHOULDER + 82}
    L ${CX - 54} ${Y_SHOULDER + 84}
    Q ${CX - 64} ${Y_SHOULDER + 82} ${CX - 62} ${Y_SHOULDER + 70}
    L ${CX - 56} ${Y_SHOULDER + 12}
    Q ${CX - 50} ${Y_SHOULDER} ${CX - 18} ${Y_SHOULDER}
    L ${CX - 18} ${Y_NECK}
    Q ${CX - HEAD_R} ${Y_HEAD + HEAD_R * 0.6} ${CX - HEAD_R} ${Y_HEAD}
    Q ${CX - HEAD_R} ${Y_HEAD - HEAD_R} ${CX} ${Y_HEAD - HEAD_R}
    Z
  `;

  return (
    <svg viewBox="0 0 240 400" className="h-full w-full select-none" role="img" aria-label="Иллюстрация ребёнка по погоде">
      <defs>
        <filter id="doll-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#5D4037" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Тень под ногами */}
      <ellipse cx={CX} cy={Y_ANKLE + 20} rx="50" ry="8" fill="#5D4037" opacity="0.15" />

      {/* Погода */}
      {isSnowy && (
        <g fill="#FFFFFF" opacity="0.9">
          {[30, 70, 110, 150, 190, 220].map((x, i) => (
            <circle key={x} cx={x} cy={30 + i * 50} r={i % 2 ? 4 : 5} />
          ))}
        </g>
      )}
      {isRainy && (
        <g stroke="#87CEEB" strokeWidth="3.5" strokeLinecap="round" opacity="0.6">
          {[30, 75, 120, 165, 210].map((x, i) => (
            <line key={x} x1={x} y1={20 + i * 20} x2={x - 8} y2={48 + i * 20} />
          ))}
        </g>
      )}

      <g filter="url(#doll-shadow)">
        {/* === ВОЛОСЫ СЗАДИ (девочка) === */}
        {girl && (
          <g>
            <ellipse cx={CX - 48} cy={Y_HEAD + 16} rx="16" ry="22" fill={C.hair} stroke={C.outline} strokeWidth="2.5" />
            <ellipse cx={CX + 48} cy={Y_HEAD + 16} rx="16" ry="22" fill={C.hair} stroke={C.outline} strokeWidth="2.5" />
            <circle cx={CX - 48} cy={Y_HEAD - 2} r="6" fill={C.hat} stroke={C.outline} strokeWidth="2" />
            <circle cx={CX + 48} cy={Y_HEAD - 2} r="6" fill={C.hat} stroke={C.outline} strokeWidth="2" />
          </g>
        )}

        {/* === ЦЕЛЬНОЕ ТЕЛО КУКЛЫ === */}
        <path d={dollBody} fill={C.skin} stroke={C.outline} strokeWidth="2.5" />

        {/* === СЛОЙ 1: бельё (низ) === */}
        {show.underwear && (
          <g>
            <path d={`M ${CX - 34} ${Y_WAIST - 4} Q ${CX} ${Y_WAIST - 8} ${CX + 34} ${Y_WAIST - 4} L ${CX + 36} ${Y_HIP + 6} Q ${CX} ${Y_HIP + 10} ${CX - 36} ${Y_HIP + 6} Z`} fill={C.under} stroke={C.outline} strokeWidth="2.5" />
            {cold && (
              <>
                <line x1={CX - 16} y1={Y_WAIST + 2} x2={CX - 16} y2={Y_HIP} stroke={C.underShadow} strokeWidth="2.5" strokeDasharray="4,4" />
                <line x1={CX + 16} y1={Y_WAIST + 2} x2={CX + 16} y2={Y_HIP} stroke={C.underShadow} strokeWidth="2.5" strokeDasharray="4,4" />
              </>
            )}
          </g>
        )}

        {/* === СЛОЙ 2: нижний (низ) === */}
        {show.lower && (
          <g>
            {drawSkirt ? (
              <>
                <path d={`M ${CX - 36} ${Y_WAIST - 6} Q ${CX} ${Y_WAIST - 10} ${CX + 36} ${Y_WAIST - 6} L ${CX + 54} ${Y_HIP + 50} Q ${CX} ${Y_HIP + 64} ${CX - 54} ${Y_HIP + 50} Z`} fill={C.bottom} stroke={C.outline} strokeWidth="2.5" />
                {[-30, -15, 0, 15, 30].map((dx) => (
                  <line key={dx} x1={CX + dx * 0.6} y1={Y_WAIST - 2} x2={CX + dx} y2={Y_HIP + 48} stroke={C.outline} strokeWidth="2" opacity="0.3" />
                ))}
              </>
            ) : drawShorts ? (
              <>
                <path d={`M ${CX - 36} ${Y_WAIST - 6} Q ${CX} ${Y_WAIST - 10} ${CX + 36} ${Y_WAIST - 6} L ${CX + 38} ${Y_HIP + 8} Q ${CX} ${Y_HIP + 12} ${CX - 38} ${Y_HIP + 8} Z`} fill={C.bottom} stroke={C.outline} strokeWidth="2.5" />
                <rect x={CX - 34} y={Y_HIP - 4} width="30" height="52" rx="14" fill={C.bottom} stroke={C.outline} strokeWidth="2.5" />
                <rect x={CX + 4} y={Y_HIP - 4} width="30" height="52" rx="14" fill={C.bottom} stroke={C.outline} strokeWidth="2.5" />
              </>
            ) : (
              <>
                <path d={`M ${CX - 36} ${Y_WAIST - 6} Q ${CX} ${Y_WAIST - 10} ${CX + 36} ${Y_WAIST - 6} L ${CX + 38} ${Y_HIP + 8} Q ${CX} ${Y_HIP + 12} ${CX - 38} ${Y_HIP + 8} Z`} fill={C.bottom} stroke={C.outline} strokeWidth="2.5" />
                <rect x={CX - 34} y={Y_HIP - 4} width="30" height={Y_ANKLE - Y_HIP + 8} rx="14" fill={C.bottom} stroke={C.outline} strokeWidth="2.5" />
                <rect x={CX + 4} y={Y_HIP - 4} width="30" height={Y_ANKLE - Y_HIP + 8} rx="14" fill={C.bottom} stroke={C.outline} strokeWidth="2.5" />
              </>
            )}
          </g>
        )}

        {/* === СЛОЙ 6: обувь === */}
        {show.shoes ? (
          <g>
            {cold ? (
              <>
                <rect x={CX - 32} y={Y_ANKLE - 14} width="30" height="44" rx="14" fill={C.shoes} stroke={C.outline} strokeWidth="2.5" />
                <rect x={CX + 2} y={Y_ANKLE - 14} width="30" height="44" rx="14" fill={C.shoes} stroke={C.outline} strokeWidth="2.5" />
                <ellipse cx={CX - 17} cy={Y_ANKLE - 12} rx="15" ry="7" fill="#FFFFFF" opacity="0.9" />
                <ellipse cx={CX + 17} cy={Y_ANKLE - 12} rx="15" ry="7" fill="#FFFFFF" opacity="0.9" />
                <rect x={CX - 34} y={Y_ANKLE + 26} width="34" height="9" rx="4.5" fill={C.shoesShadow} stroke={C.outline} strokeWidth="2" />
                <rect x={CX} y={Y_ANKLE + 26} width="34" height="9" rx="4.5" fill={C.shoesShadow} stroke={C.outline} strokeWidth="2" />
              </>
            ) : hot ? (
              <>
                <rect x={CX - 30} y={Y_ANKLE + 18} width="28" height="13" rx="6.5" fill={C.shoes} stroke={C.outline} strokeWidth="2.5" />
                <rect x={CX + 2} y={Y_ANKLE + 18} width="28" height="13" rx="6.5" fill={C.shoes} stroke={C.outline} strokeWidth="2.5" />
                <path d={`M ${CX - 24} ${Y_ANKLE + 10} L ${CX - 14} ${Y_ANKLE + 20}`} stroke={C.shoes} strokeWidth="6" strokeLinecap="round" />
                <path d={`M ${CX + 14} ${Y_ANKLE + 10} L ${CX + 24} ${Y_ANKLE + 20}`} stroke={C.shoes} strokeWidth="6" strokeLinecap="round" />
                <path d={`M ${CX - 24} ${Y_ANKLE + 10} L ${CX - 14} ${Y_ANKLE + 20}`} stroke={C.outline} strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d={`M ${CX + 14} ${Y_ANKLE + 10} L ${CX + 24} ${Y_ANKLE + 20}`} stroke={C.outline} strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                <rect x={CX - 30} y={Y_ANKLE + 4} width="28" height="24" rx="12" fill={C.shoes} stroke={C.outline} strokeWidth="2.5" />
                <rect x={CX + 2} y={Y_ANKLE + 4} width="28" height="24" rx="12" fill={C.shoes} stroke={C.outline} strokeWidth="2.5" />
                <rect x={CX - 32} y={Y_ANKLE + 24} width="32" height="8" rx="4" fill={C.shoesShadow} stroke={C.outline} strokeWidth="2" />
                <rect x={CX} y={Y_ANKLE + 24} width="32" height="8" rx="4" fill={C.shoesShadow} stroke={C.outline} strokeWidth="2" />
                <line x1={CX - 24} y1={Y_ANKLE + 14} x2={CX - 12} y2={Y_ANKLE + 14} stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                <line x1={CX + 12} y1={Y_ANKLE + 14} x2={CX + 24} y2={Y_ANKLE + 14} stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              </>
            )}
          </g>
        ) : (
          <g>
            <ellipse cx={CX - 17} cy={Y_ANKLE + 16} rx="14" ry="9" fill={C.under} stroke={C.outline} strokeWidth="2.5" />
            <ellipse cx={CX + 17} cy={Y_ANKLE + 16} rx="14" ry="9" fill={C.under} stroke={C.outline} strokeWidth="2.5" />
          </g>
        )}

        {/* === СЛОЙ 1: бельё (верх) === */}
        {show.underwear && (
          <g>
            <path d={`M ${CX - 38} ${Y_SHOULDER - 4} Q ${CX} ${Y_SHOULDER - 8} ${CX + 38} ${Y_SHOULDER - 4} L ${CX + 40} ${Y_WAIST + 4} Q ${CX} ${Y_WAIST + 8} ${CX - 40} ${Y_WAIST + 4} Z`} fill={C.under} stroke={C.outline} strokeWidth="2.5" />
            <path d={`M ${CX - 14} ${Y_SHOULDER - 4} Q ${CX} ${Y_SHOULDER + 14} ${CX + 14} ${Y_SHOULDER - 4}`} fill={C.skin} stroke={C.outline} strokeWidth="2.5" />
            {cold ? (
              <>
                <path d={`M ${CX - 50} ${Y_SHOULDER + 8} Q ${CX - 58} ${Y_SHOULDER + 16} ${CX - 60} ${Y_SHOULDER + 60} Q ${CX - 62} ${Y_SHOULDER + 72} ${CX - 52} ${Y_SHOULDER + 74} L ${CX - 44} ${Y_SHOULDER + 72} L ${CX - 42} ${Y_SHOULDER + 16} Z`} fill={C.under} stroke={C.outline} strokeWidth="2.5" />
                <path d={`M ${CX + 50} ${Y_SHOULDER + 8} Q ${CX + 58} ${Y_SHOULDER + 16} ${CX + 60} ${Y_SHOULDER + 60} Q ${CX + 62} ${Y_SHOULDER + 72} ${CX + 52} ${Y_SHOULDER + 74} L ${CX + 44} ${Y_SHOULDER + 72} L ${CX + 42} ${Y_SHOULDER + 16} Z`} fill={C.under} stroke={C.outline} strokeWidth="2.5" />
              </>
            ) : (
              <>
                <line x1={CX - 22} y1={Y_SHOULDER - 4} x2={CX - 18} y2={Y_SHOULDER + 8} stroke={C.under} strokeWidth="7" strokeLinecap="round" />
                <line x1={CX + 22} y1={Y_SHOULDER - 4} x2={CX + 18} y2={Y_SHOULDER + 8} stroke={C.under} strokeWidth="7" strokeLinecap="round" />
                <line x1={CX - 22} y1={Y_SHOULDER - 4} x2={CX - 18} y2={Y_SHOULDER + 8} stroke={C.outline} strokeWidth="2.5" strokeLinecap="round" />
                <line x1={CX + 22} y1={Y_SHOULDER - 4} x2={CX + 18} y2={Y_SHOULDER + 8} stroke={C.outline} strokeWidth="2.5" strokeLinecap="round" />
              </>
            )}
          </g>
        )}

        {/* === СЛОЙ 2: нижний (верх) === */}
        {show.lower && (
          <g>
            {shortSleeve ? (
              <>
                <path d={`M ${CX - 50} ${Y_SHOULDER + 8} Q ${CX - 58} ${Y_SHOULDER + 16} ${CX - 58} ${Y_SHOULDER + 44} Q ${CX - 58} ${Y_SHOULDER + 52} ${CX - 50} ${Y_SHOULDER + 52} L ${CX - 44} ${Y_SHOULDER + 50} L ${CX - 44} ${Y_SHOULDER + 16} Z`} fill={C.top} stroke={C.outline} strokeWidth="2.5" />
                <path d={`M ${CX + 50} ${Y_SHOULDER + 8} Q ${CX + 58} ${Y_SHOULDER + 16} ${CX + 58} ${Y_SHOULDER + 44} Q ${CX + 58} ${Y_SHOULDER + 52} ${CX + 50} ${Y_SHOULDER + 52} L ${CX + 44} ${Y_SHOULDER + 50} L ${CX + 44} ${Y_SHOULDER + 16} Z`} fill={C.top} stroke={C.outline} strokeWidth="2.5" />
              </>
            ) : (
              <>
                <path d={`M ${CX - 50} ${Y_SHOULDER + 8} Q ${CX - 58} ${Y_SHOULDER + 16} ${CX - 60} ${Y_SHOULDER + 60} Q ${CX - 62} ${Y_SHOULDER + 72} ${CX - 52} ${Y_SHOULDER + 74} L ${CX - 44} ${Y_SHOULDER + 72} L ${CX - 42} ${Y_SHOULDER + 16} Z`} fill={C.top} stroke={C.outline} strokeWidth="2.5" />
                <path d={`M ${CX + 50} ${Y_SHOULDER + 8} Q ${CX + 58} ${Y_SHOULDER + 16} ${CX + 60} ${Y_SHOULDER + 60} Q ${CX + 62} ${Y_SHOULDER + 72} ${CX + 52} ${Y_SHOULDER + 74} L ${CX + 44} ${Y_SHOULDER + 72} L ${CX + 42} ${Y_SHOULDER + 16} Z`} fill={C.top} stroke={C.outline} strokeWidth="2.5" />
              </>
            )}
            <path d={`M ${CX - 38} ${Y_SHOULDER - 4} Q ${CX} ${Y_SHOULDER - 8} ${CX + 38} ${Y_SHOULDER - 4} L ${CX + 40} ${Y_WAIST + 4} Q ${CX} ${Y_WAIST + 8} ${CX - 40} ${Y_WAIST + 4} Z`} fill={C.top} stroke={C.outline} strokeWidth="2.5" />
            <path d={`M ${CX - 14} ${Y_SHOULDER - 4} Q ${CX} ${Y_SHOULDER + 14} ${CX + 14} ${Y_SHOULDER - 4}`} fill={show.underwear ? C.under : C.skin} stroke={C.outline} strokeWidth="2.5" />
          </g>
        )}

        {/* === СЛОЙ 3: верхний (худи) === */}
        {(show.upper && (coolish || zone === 'mild')) && (
          <g>
            <path d={`M ${CX - 52} ${Y_SHOULDER + 6} Q ${CX - 60} ${Y_SHOULDER + 14} ${CX - 62} ${Y_SHOULDER + 64} Q ${CX - 64} ${Y_SHOULDER + 76} ${CX - 54} ${Y_SHOULDER + 78} L ${CX - 46} ${Y_SHOULDER + 76} L ${CX - 44} ${Y_SHOULDER + 14} Z`} fill={C.upper} stroke={C.outline} strokeWidth="2.5" />
            <path d={`M ${CX + 52} ${Y_SHOULDER + 6} Q ${CX + 60} ${Y_SHOULDER + 14} ${CX + 62} ${Y_SHOULDER + 64} Q ${CX + 64} ${Y_SHOULDER + 76} ${CX + 54} ${Y_SHOULDER + 78} L ${CX + 46} ${Y_SHOULDER + 76} L ${CX + 44} ${Y_SHOULDER + 14} Z`} fill={C.upper} stroke={C.outline} strokeWidth="2.5" />
            <path d={`M ${CX - 40} ${Y_SHOULDER - 6} Q ${CX} ${Y_SHOULDER - 10} ${CX + 40} ${Y_SHOULDER - 6} L ${CX + 42} ${Y_WAIST + 8} Q ${CX} ${Y_WAIST + 12} ${CX - 42} ${Y_WAIST + 8} Z`} fill={C.upper} stroke={C.outline} strokeWidth="2.5" />
            <path d={`M ${CX - 16} ${Y_SHOULDER - 6} Q ${CX} ${Y_SHOULDER + 16} ${CX + 16} ${Y_SHOULDER - 6}`} fill={C.top} stroke={C.outline} strokeWidth="2.5" />
            <line x1={CX - 8} y1={Y_SHOULDER + 10} x2={CX - 8} y2={Y_SHOULDER + 38} stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
            <line x1={CX + 8} y1={Y_SHOULDER + 10} x2={CX + 8} y2={Y_SHOULDER + 38} stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx={CX - 8} cy={Y_SHOULDER + 39} r="3.5" fill="#FFFFFF" stroke={C.outline} strokeWidth="1.5" />
            <circle cx={CX + 8} cy={Y_SHOULDER + 39} r="3.5" fill="#FFFFFF" stroke={C.outline} strokeWidth="1.5" />
            <path d={`M ${CX - 22} ${Y_WAIST - 14} Q ${CX} ${Y_WAIST - 8} ${CX + 22} ${Y_WAIST - 14} L ${CX + 26} ${Y_WAIST + 14} Q ${CX} ${Y_WAIST + 20} ${CX - 26} ${Y_WAIST + 14} Z`} fill={C.upperShadow} opacity="0.35" stroke={C.outline} strokeWidth="2" />
          </g>
        )}

        {/* === СЛОЙ 4: верхняя одежда === */}
        {show.outer && (
          <g>
            <path d={`M ${CX - 54} ${Y_SHOULDER + 4} Q ${CX - 62} ${Y_SHOULDER + 12} ${CX - 64} ${Y_SHOULDER + 68} Q ${CX - 66} ${Y_SHOULDER + 80} ${CX - 56} ${Y_SHOULDER + 82} L ${CX - 48} ${Y_SHOULDER + 80} L ${CX - 46} ${Y_SHOULDER + 12} Z`} fill={C.outer} stroke={C.outline} strokeWidth="2.5" />
            <path d={`M ${CX + 54} ${Y_SHOULDER + 4} Q ${CX + 62} ${Y_SHOULDER + 12} ${CX + 64} ${Y_SHOULDER + 68} Q ${CX + 66} ${Y_SHOULDER + 80} ${CX + 56} ${Y_SHOULDER + 82} L ${CX + 48} ${Y_SHOULDER + 80} L ${CX + 46} ${Y_SHOULDER + 12} Z`} fill={C.outer} stroke={C.outline} strokeWidth="2.5" />
            <path d={`M ${CX - 42} ${Y_SHOULDER - 8} Q ${CX} ${Y_SHOULDER - 12} ${CX + 42} ${Y_SHOULDER - 8} L ${CX + 44} ${Y_WAIST + 12} Q ${CX} ${Y_WAIST + 16} ${CX - 44} ${Y_WAIST + 12} Z`} fill={C.outer} stroke={C.outline} strokeWidth="2.5" />
            <line x1={CX} y1={Y_SHOULDER - 10} x2={CX} y2={Y_WAIST + 32} stroke={C.hatShadow} strokeWidth="4.5" strokeLinecap="round" />
            <circle cx={CX} cy={Y_SHOULDER + 4} r="4.5" fill={C.hatShadow} stroke={C.outline} strokeWidth="2" />
            <rect x={CX - 30} y={Y_WAIST - 6} width="19" height="21" rx="7" fill={C.outerShadow} opacity="0.4" stroke={C.outline} strokeWidth="2" />
            <rect x={CX + 11} y={Y_WAIST - 6} width="19" height="21" rx="7" fill={C.outerShadow} opacity="0.4" stroke={C.outline} strokeWidth="2" />
            {(zone === 'arctic' || zone === 'winter') && !isRainy && (
              <g stroke={C.outline} strokeWidth="2" opacity="0.3" fill="none">
                <line x1={CX - 38} y1={Y_SHOULDER + 20} x2={CX + 38} y2={Y_SHOULDER + 20} />
                <line x1={CX - 39} y1={Y_SHOULDER + 48} x2={CX + 39} y2={Y_SHOULDER + 48} />
                <line x1={CX - 39} y1={Y_SHOULDER + 76} x2={CX + 39} y2={Y_SHOULDER + 76} />
              </g>
            )}
            {zone === 'arctic' && !isRainy && (
              <path d={`M ${CX - 30} ${Y_SHOULDER - 8} Q ${CX} ${Y_SHOULDER + 14} ${CX + 30} ${Y_SHOULDER - 8} Q ${CX} ${Y_SHOULDER - 32} ${CX - 30} ${Y_SHOULDER - 8} Z`} fill="#FAFAF9" stroke={C.outline} strokeWidth="2.5" />
            )}
          </g>
        )}

        {/* === ВАРЕЖКИ === */}
        {cold && show.accessory && (
          <g>
            <circle cx={CX - 56} cy={Y_SHOULDER + 78} r="13" fill={C.mitt} stroke={C.outline} strokeWidth="2.5" />
            <circle cx={CX + 56} cy={Y_SHOULDER + 78} r="13" fill={C.mitt} stroke={C.outline} strokeWidth="2.5" />
            <rect x={CX - 66} y={Y_SHOULDER + 62} width="20" height="9" rx="4.5" fill="#FFFFFF" stroke={C.outline} strokeWidth="2" />
            <rect x={CX + 46} y={Y_SHOULDER + 62} width="20" height="9" rx="4.5" fill="#FFFFFF" stroke={C.outline} strokeWidth="2" />
          </g>
        )}

        {/* === ШАРФ === */}
        {coolish && show.accessory && (
          <g>
            <path d={`M ${CX - 26} ${Y_SHOULDER - 18} Q ${CX} ${Y_SHOULDER - 22} ${CX + 26} ${Y_SHOULDER - 18} L ${CX + 28} ${Y_SHOULDER - 2} Q ${CX} ${Y_SHOULDER + 2} ${CX - 28} ${Y_SHOULDER - 2} Z`} fill={C.scarf} stroke={C.outline} strokeWidth="2.5" />
            <path d={isWindy
              ? `M ${CX - 18} ${Y_SHOULDER} Q ${CX - 36} ${Y_SHOULDER + 22} ${CX - 52} ${Y_SHOULDER + 28} L ${CX - 44} ${Y_SHOULDER + 42} Q ${CX - 24} ${Y_SHOULDER + 30} ${CX - 6} ${Y_SHOULDER + 2} Z`
              : `M ${CX - 18} ${Y_SHOULDER} L ${CX - 12} ${Y_SHOULDER + 42} L ${CX} ${Y_SHOULDER + 38} L ${CX - 6} ${Y_SHOULDER} Z`} fill={C.scarf} stroke={C.outline} strokeWidth="2.5" />
          </g>
        )}

        {/* === ГОЛОВА === */}
        <g>
          <circle cx={CX} cy={Y_HEAD} r={HEAD_R} fill={C.skin} stroke={C.outline} strokeWidth="3" />

          {/* Брови */}
          <g stroke={C.hair} strokeWidth="4" strokeLinecap="round" fill="none">
            <path d={`M ${CX - 22} ${Y_HEAD - 10} Q ${CX - 14} ${Y_HEAD - 16} ${CX - 6} ${Y_HEAD - 10}`} />
            <path d={`M ${CX + 6} ${Y_HEAD - 10} Q ${CX + 14} ${Y_HEAD - 16} ${CX + 22} ${Y_HEAD - 10}`} />
          </g>

          {/* Глаза */}
          <ellipse cx={CX - 16} cy={Y_HEAD + 6} rx="10" ry="11" fill="#FFFFFF" stroke={C.outline} strokeWidth="2.5" />
          <ellipse cx={CX + 16} cy={Y_HEAD + 6} rx="10" ry="11" fill="#FFFFFF" stroke={C.outline} strokeWidth="2.5" />
          <circle cx={CX - 16} cy={Y_HEAD + 8} r="7" fill={C.hair} />
          <circle cx={CX + 16} cy={Y_HEAD + 8} r="7" fill={C.hair} />
          <circle cx={CX - 19} cy={Y_HEAD + 4} r="3" fill="#FFFFFF" />
          <circle cx={CX + 13} cy={Y_HEAD + 4} r="3" fill="#FFFFFF" />
          <circle cx={CX - 13} cy={Y_HEAD + 11} r="1.5" fill="#FFFFFF" opacity="0.8" />
          <circle cx={CX + 19} cy={Y_HEAD + 11} r="1.5" fill="#FFFFFF" opacity="0.8" />
          {girl && (
            <g stroke={C.outline} strokeWidth="2.5" strokeLinecap="round">
              <line x1={CX - 25} y1={Y_HEAD + 1} x2={CX - 30} y2={Y_HEAD - 4} />
              <line x1={CX + 25} y1={Y_HEAD + 1} x2={CX + 30} y2={Y_HEAD - 4} />
            </g>
          )}

          {/* Румянец */}
          <circle cx={CX - 28} cy={Y_HEAD + 18} r={cold ? 11 : 9} fill={C.blush} opacity="0.6" />
          <circle cx={CX + 28} cy={Y_HEAD + 18} r={cold ? 11 : 9} fill={C.blush} opacity="0.6" />

          {/* Нос */}
          <ellipse cx={CX} cy={Y_HEAD + 16} rx="3.5" ry="2.5" fill={C.skinShadow} stroke={C.outline} strokeWidth="2" />

          {/* Рот */}
          {hot ? (
            <path d={`M ${CX - 10} ${Y_HEAD + 26} Q ${CX} ${Y_HEAD + 38} ${CX + 10} ${Y_HEAD + 26} Z`} fill={C.hair} stroke={C.outline} strokeWidth="2.5" />
          ) : (
            <path d={`M ${CX - 9} ${Y_HEAD + 27} Q ${CX} ${Y_HEAD + 36} ${CX + 9} ${Y_HEAD + 27}`} fill="none" stroke={C.outline} strokeWidth="3.5" strokeLinecap="round" />
          )}

          {/* Веснушки */}
          {!girl && (
            <g fill={C.hair} opacity="0.5">
              <circle cx={CX - 26} cy={Y_HEAD + 14} r="2" /><circle cx={CX - 31} cy={Y_HEAD + 19} r="2" />
              <circle cx={CX + 26} cy={Y_HEAD + 14} r="2" /><circle cx={CX + 31} cy={Y_HEAD + 19} r="2" />
            </g>
          )}

          {/* Дыхание */}
          {cold && (
            <g opacity="0.5" className="animate-float" style={{ animationDuration: '2s' }}>
              <ellipse cx={CX + 20} cy={Y_HEAD + 32} rx="7" ry="3.5" fill="#FFFFFF" />
              <ellipse cx={CX + 30} cy={Y_HEAD + 27} rx="5" ry="2.5" fill="#FFFFFF" />
            </g>
          )}

          {/* Волосы спереди */}
          <g fill={C.hair} stroke={C.outline} strokeWidth="2.5">
            {girl ? (
              <>
                <path d={`M ${CX - 44} ${Y_HEAD - 4} Q ${CX} ${Y_HEAD - 30} ${CX + 44} ${Y_HEAD - 4} Q ${CX + 48} ${Y_HEAD - 40} ${CX} ${Y_HEAD - 44} Q ${CX - 48} ${Y_HEAD - 40} ${CX - 44} ${Y_HEAD - 4} Z`} />
                <path d={`M ${CX - 36} ${Y_HEAD - 18} Q ${CX - 24} ${Y_HEAD - 6} ${CX - 12} ${Y_HEAD - 18} Q ${CX} ${Y_HEAD - 6} ${CX + 12} ${Y_HEAD - 18} Q ${CX + 24} ${Y_HEAD - 6} ${CX + 36} ${Y_HEAD - 18} L ${CX + 36} ${Y_HEAD - 30} Q ${CX} ${Y_HEAD - 38} ${CX - 34} ${Y_HEAD - 30} Z`} fill={C.hairLight} opacity="0.5" />
              </>
            ) : (
              <>
                <path d={`M ${CX - 44} ${Y_HEAD - 10} Q ${CX - 26} ${Y_HEAD - 36} ${CX} ${Y_HEAD - 28} Q ${CX + 26} ${Y_HEAD - 40} ${CX + 44} ${Y_HEAD - 14} Q ${CX + 50} ${Y_HEAD - 46} ${CX} ${Y_HEAD - 52} Q ${CX - 50} ${Y_HEAD - 46} ${CX - 44} ${Y_HEAD - 10} Z`} />
                <path d={`M ${CX - 32} ${Y_HEAD - 22} Q ${CX - 16} ${Y_HEAD - 32} ${CX + 6} ${Y_HEAD - 24} L ${CX - 2} ${Y_HEAD - 36} Q ${CX - 24} ${Y_HEAD - 38} ${CX - 34} ${Y_HEAD - 26} Z`} fill={C.hairLight} opacity="0.5" />
              </>
            )}
          </g>

          {/* Головной убор */}
          {show.headwear && (
            <g>
              {hot ? (
                <>
                  <ellipse cx={CX} cy={Y_HEAD - 28} rx="54" ry="14" fill={C.hat} stroke={C.outline} strokeWidth="2.5" />
                  <path d={`M ${CX - 34} ${Y_HEAD - 28} Q ${CX} ${Y_HEAD - 64} ${CX + 34} ${Y_HEAD - 28} Z`} fill={C.hat} stroke={C.outline} strokeWidth="2.5" />
                  <rect x={CX - 34} y={Y_HEAD - 36} width="68" height="10" rx="5" fill={C.hatShadow} stroke={C.outline} strokeWidth="2" />
                </>
              ) : zone === 'warm' || zone === 'mild' ? (
                <>
                  <path d={`M ${CX - 42} ${Y_HEAD - 16} Q ${CX} ${Y_HEAD - 60} ${CX + 42} ${Y_HEAD - 16} Z`} fill={C.hat} stroke={C.outline} strokeWidth="2.5" />
                  <path d={`M ${CX + 6} ${Y_HEAD - 26} Q ${CX + 36} ${Y_HEAD - 32} ${CX + 52} ${Y_HEAD - 16} Q ${CX + 32} ${Y_HEAD - 8} ${CX + 8} ${Y_HEAD - 13} Z`} fill={C.hatShadow} stroke={C.outline} strokeWidth="2.5" />
                  <circle cx={CX} cy={Y_HEAD - 48} r="4.5" fill={C.hatShadow} stroke={C.outline} strokeWidth="2" />
                </>
              ) : (
                <>
                  <path d={`M ${CX - 42} ${Y_HEAD - 16} Q ${CX} ${Y_HEAD - 64} ${CX + 42} ${Y_HEAD - 16} Z`} fill={C.hat} stroke={C.outline} strokeWidth="2.5" />
                  <rect x={CX - 44} y={Y_HEAD - 20} width="88" height="17" rx="8.5" fill={C.hatShadow} stroke={C.outline} strokeWidth="2.5" />
                  {(zone === 'arctic' || zone === 'winter') && <circle cx={CX} cy={Y_HEAD - 58} r="13" fill="#FFFFFF" stroke={C.outline} strokeWidth="2.5" />}
                </>
              )}
            </g>
          )}

          {/* Очки */}
          {hot && show.accessory && (
            <g>
              <rect x={CX - 26} y={Y_HEAD + 2} width="22" height="15" rx="6.5" fill="#2C3E50" stroke={C.outline} strokeWidth="2.5" />
              <rect x={CX + 4} y={Y_HEAD + 2} width="22" height="15" rx="6.5" fill="#2C3E50" stroke={C.outline} strokeWidth="2.5" />
              <line x1={CX - 4} y1={Y_HEAD + 8} x2={CX + 4} y2={Y_HEAD + 8} stroke={C.outline} strokeWidth="3.5" />
              <line x1={CX - 22} y1={Y_HEAD + 6} x2={CX - 14} y2={Y_HEAD + 11} stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
              <line x1={CX + 12} y1={Y_HEAD + 6} x2={CX + 20} y2={Y_HEAD + 11} stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
            </g>
          )}
        </g>

        {/* Зонт */}
        {isRainy && show.accessory && (
          <g className="animate-float" style={{ animationDuration: '4s' }}>
            <line x1={CX + 56} y1={Y_SHOULDER + 78} x2={CX + 56} y2={Y_HEAD - 50} stroke={C.outline} strokeWidth="5" strokeLinecap="round" />
            <path d={`M ${CX - 12} ${Y_HEAD - 26} Q ${CX + 56} ${Y_HEAD - 82} ${CX + 124} ${Y_HEAD - 26} Z`} fill="#FF6347" stroke={C.outline} strokeWidth="2.5" />
            <path d={`M ${CX - 12} ${Y_HEAD - 26} Q ${CX + 8} ${Y_HEAD - 36} ${CX + 28} ${Y_HEAD - 26} Q ${CX + 48} ${Y_HEAD - 36} ${CX + 68} ${Y_HEAD - 26} Q ${CX + 88} ${Y_HEAD - 36} ${CX + 124} ${Y_HEAD - 26}`} fill="none" stroke={C.outline} strokeWidth="2.5" opacity="0.5" />
          </g>
        )}
      </g>
    </svg>
  );
};
