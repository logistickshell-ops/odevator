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

  // Аниме-пропорции: голова 1/5 роста (72px из 360px)
  const CX = 120;
  const Y_TOP = 20;        // Верх головы
  const HEAD_H = 72;       // Высота головы
  const Y_HEAD_CENTER = Y_TOP + HEAD_H / 2; // 56
  const Y_CHIN = Y_TOP + HEAD_H; // 92
  const Y_NECK = 104;      // Шея
  const Y_SHOULDER = 118;  // Плечи (узкие!)
  const Y_CHEST = 148;     // Грудь
  const Y_WAIST = 178;     // Талия
  const Y_HIP = 198;       // Бёдра
  const Y_KNEE = 268;      // Колени
  const Y_ANKLE = 338;     // Щиколотки
  const Y_FOOT = 358;      // Низ стопы

  // Палитра с градиентами для 3D-объёма
  const P = girl
    ? {
        skin: { l: '#FFE4D0', d: '#F4C4A0' },
        hair: { l: '#A0522D', d: '#6B3F22' },
        top: { l: '#87CEEB', d: '#5BA3C9' },
        upper: { l: '#DDA0DD', d: '#BA7FBA' },
        outer: { l: '#FF69B4', d: '#DB4A8A' },
        bottom: { l: '#87CEEB', d: '#5BA3C9' },
        shoes: { l: '#FF6347', d: '#CC4F39' },
        hat: { l: '#87CEEB', d: '#5BA3C9' },
        scarf: { l: '#FF69B4', d: '#DB4A8A' },
        mitt: { l: '#DDA0DD', d: '#BA7FBA' },
        under: { l: '#FFFFFF', d: '#E8E8E8' },
        blush: '#FFB6C1',
        outline: '#5D4037',
      }
    : {
        skin: { l: '#FFE4D0', d: '#F4C4A0' },
        hair: { l: '#7D5A3C', d: '#4A3520' },
        top: { l: '#87CEEB', d: '#5BA3C9' },
        upper: { l: '#6495ED', d: '#4A75C9' },
        outer: { l: '#4169E1', d: '#2E4FA8' },
        bottom: { l: '#4682B4', d: '#2E5A7A' },
        shoes: { l: '#FF6347', d: '#CC4F39' },
        hat: { l: '#4682B4', d: '#2E5A7A' },
        scarf: { l: '#FF6347', d: '#CC4F39' },
        mitt: { l: '#6495ED', d: '#4A75C9' },
        under: { l: '#FFFFFF', d: '#E8E8E8' },
        blush: '#FFB6C1',
        outline: '#5D4037',
      };

  const shortSleeve = hot || zone === 'warm';
  const drawSkirt = girl && !cold && zone !== 'chilly';
  const drawShorts = !girl && (hot || zone === 'warm');

  const uid = girl ? 'g' : 'b';
  const gid = (n: string) => `${uid}-${n}`;

  // ЦЕЛЬНЫЙ СИЛУЭТ ТЕЛА (аниме-пропорции)
  const bodyPath = `
    M ${CX} ${Y_TOP}
    Q ${CX + 36} ${Y_TOP} ${CX + 36} ${Y_HEAD_CENTER}
    Q ${CX + 36} ${Y_CHIN - 8} ${CX + 14} ${Y_CHIN}
    L ${CX + 12} ${Y_NECK}
    Q ${CX + 28} ${Y_SHOULDER - 4} ${CX + 32} ${Y_SHOULDER}
    L ${CX + 38} ${Y_SHOULDER + 8}
    Q ${CX + 44} ${Y_SHOULDER + 16} ${CX + 46} ${Y_CHEST - 10}
    L ${CX + 48} ${Y_CHEST + 20}
    Q ${CX + 50} ${Y_CHEST + 36} ${CX + 44} ${Y_CHEST + 40}
    L ${CX + 38} ${Y_CHEST + 38}
    L ${CX + 34} ${Y_CHEST + 10}
    L ${CX + 30} ${Y_WAIST}
    Q ${CX + 32} ${Y_HIP - 4} ${CX + 28} ${Y_HIP}
    L ${CX + 24} ${Y_KNEE - 8}
    Q ${CX + 22} ${Y_KNEE} ${CX + 20} ${Y_KNEE + 8}
    L ${CX + 18} ${Y_ANKLE}
    Q ${CX + 18} ${Y_FOOT} ${CX + 8} ${Y_FOOT}
    L ${CX + 2} ${Y_FOOT}
    Q ${CX - 2} ${Y_FOOT} ${CX - 2} ${Y_ANKLE}
    L ${CX - 4} ${Y_KNEE + 8}
    Q ${CX - 6} ${Y_KNEE} ${CX - 8} ${Y_KNEE - 8}
    L ${CX - 12} ${Y_HIP}
    Q ${CX - 16} ${Y_HIP - 4} ${CX - 14} ${Y_WAIST}
    L ${CX - 18} ${Y_CHEST + 10}
    L ${CX - 22} ${Y_CHEST + 38}
    L ${CX - 28} ${Y_CHEST + 40}
    Q ${CX - 34} ${Y_CHEST + 36} ${CX - 32} ${Y_CHEST + 20}
    L ${CX - 30} ${Y_CHEST - 10}
    Q ${CX - 28} ${Y_SHOULDER + 16} ${CX - 22} ${Y_SHOULDER + 8}
    L ${CX - 16} ${Y_SHOULDER}
    Q ${CX - 12} ${Y_SHOULDER - 4} ${CX - 12} ${Y_NECK}
    L ${CX - 14} ${Y_CHIN}
    Q ${CX - 36} ${Y_CHIN - 8} ${CX - 36} ${Y_HEAD_CENTER}
    Q ${CX - 36} ${Y_TOP} ${CX} ${Y_TOP}
    Z
  `;

  return (
    <svg viewBox="0 0 240 400" className="h-full w-full select-none" role="img" aria-label="Иллюстрация ребёнка по погоде">
      <defs>
        {/* 3D-тень */}
        <filter id={`${uid}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#5D4037" floodOpacity="0.25" />
        </filter>
        {/* Внутреннее свечение для объёма */}
        <filter id={`${uid}-glow`}>
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
          <feOffset in="blur" dx="0" dy="2" result="offsetBlur" />
          <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
        </filter>

        {/* Градиенты для 3D-объёма */}
        <radialGradient id={gid('aura')} cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="70%" stopColor={girl ? '#FFE1EC' : '#DCEBFF'} stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={gid('ground')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5D4037" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#5D4037" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={gid('blush')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={P.blush} stopOpacity="0.7" />
          <stop offset="100%" stopColor={P.blush} stopOpacity="0" />
        </radialGradient>

        {/* Вертикальные градиенты для каждой детали */}
        {Object.entries(P).filter(([k]) => k !== 'blush' && k !== 'outline').map(([k, v]) => (
          <linearGradient key={k} id={gid(k)} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={(v as any).l} />
            <stop offset="100%" stopColor={(v as any).d} />
          </linearGradient>
        ))}

        {/* Блик сверху */}
        <linearGradient id={gid('hi')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Аура */}
      <ellipse cx={CX} cy={180} rx="110" ry="160" fill={`url(#${gid('aura')})`} />
      {/* Тень под ногами */}
      <ellipse cx={CX} cy={Y_FOOT + 8} rx="45" ry="7" fill={`url(#${gid('ground')})`} />

      {/* Погода */}
      {isSnowy && (
        <g fill="#FFFFFF" opacity="0.9">
          {[30, 70, 110, 150, 190, 220].map((x, i) => (
            <circle key={x} cx={x} cy={25 + i * 52} r={i % 2 ? 3.5 : 4.5} />
          ))}
        </g>
      )}
      {isRainy && (
        <g stroke="#87CEEB" strokeWidth="3" strokeLinecap="round" opacity="0.6">
          {[30, 75, 120, 165, 210].map((x, i) => (
            <line key={x} x1={x} y1={15 + i * 22} x2={x - 7} y2={42 + i * 22} />
          ))}
        </g>
      )}

      <g filter={`url(#${uid}-shadow)`}>
        {/* === ВОЛОСЫ СЗАДИ (девочка) === */}
        {girl && (
          <g>
            <ellipse cx={CX - 40} cy={Y_HEAD_CENTER + 12} rx="14" ry="20" fill={`url(#${gid('hair')})`} stroke={P.outline} strokeWidth="2" />
            <ellipse cx={CX + 40} cy={Y_HEAD_CENTER + 12} rx="14" ry="20" fill={`url(#${gid('hair')})`} stroke={P.outline} strokeWidth="2" />
            <circle cx={CX - 40} cy={Y_HEAD_CENTER - 4} r="5" fill={`url(#${gid('hat')})`} stroke={P.outline} strokeWidth="1.5" />
            <circle cx={CX + 40} cy={Y_HEAD_CENTER - 4} r="5" fill={`url(#${gid('hat')})`} stroke={P.outline} strokeWidth="1.5" />
          </g>
        )}

        {/* === ЦЕЛЬНОЕ ТЕЛО === */}
        <path d={bodyPath} fill={`url(#${gid('skin')})`} stroke={P.outline} strokeWidth="2" />
        {/* Блик на теле */}
        <path d={bodyPath} fill={`url(#${gid('hi')})`} opacity="0.3" />

        {/* === СЛОЙ 1: бельё (низ) === */}
        {show.underwear && (
          <g>
            <path d={`M ${CX - 26} ${Y_WAIST - 2} Q ${CX} ${Y_WAIST - 6} ${CX + 26} ${Y_WAIST - 2} L ${CX + 28} ${Y_HIP + 4} Q ${CX} ${Y_HIP + 8} ${CX - 28} ${Y_HIP + 4} Z`} fill={`url(#${gid('under')})`} stroke={P.outline} strokeWidth="2" />
            {cold && (
              <>
                <line x1={CX - 12} y1={Y_WAIST + 2} x2={CX - 12} y2={Y_HIP} stroke="#C9C9DE" strokeWidth="2" strokeDasharray="3,3" />
                <line x1={CX + 12} y1={Y_WAIST + 2} x2={CX + 12} y2={Y_HIP} stroke="#C9C9DE" strokeWidth="2" strokeDasharray="3,3" />
              </>
            )}
          </g>
        )}

        {/* === СЛОЙ 2: нижний (низ) === */}
        {show.lower && (
          <g>
            {drawSkirt ? (
              <>
                <path d={`M ${CX - 28} ${Y_WAIST - 4} Q ${CX} ${Y_WAIST - 8} ${CX + 28} ${Y_WAIST - 4} L ${CX + 44} ${Y_HIP + 44} Q ${CX} ${Y_HIP + 56} ${CX - 44} ${Y_HIP + 44} Z`} fill={`url(#${gid('bottom')})`} stroke={P.outline} strokeWidth="2" />
                <path d={`M ${CX - 28} ${Y_WAIST - 4} Q ${CX} ${Y_WAIST - 8} ${CX + 28} ${Y_WAIST - 4} L ${CX + 44} ${Y_HIP + 44} Q ${CX} ${Y_HIP + 56} ${CX - 44} ${Y_HIP + 44} Z`} fill={`url(#${gid('hi')})`} opacity="0.25" />
                {[-26, -13, 0, 13, 26].map((dx) => (
                  <line key={dx} x1={CX + dx * 0.55} y1={Y_WAIST} x2={CX + dx} y2={Y_HIP + 42} stroke={P.outline} strokeWidth="1.5" opacity="0.25" />
                ))}
              </>
            ) : drawShorts ? (
              <>
                <path d={`M ${CX - 28} ${Y_WAIST - 4} Q ${CX} ${Y_WAIST - 8} ${CX + 28} ${Y_WAIST - 4} L ${CX + 30} ${Y_HIP + 6} Q ${CX} ${Y_HIP + 10} ${CX - 30} ${Y_HIP + 6} Z`} fill={`url(#${gid('bottom')})`} stroke={P.outline} strokeWidth="2" />
                <rect x={CX - 26} y={Y_HIP - 2} width="24" height="44" rx="11" fill={`url(#${gid('bottom')})`} stroke={P.outline} strokeWidth="2" />
                <rect x={CX + 2} y={Y_HIP - 2} width="24" height="44" rx="11" fill={`url(#${gid('bottom')})`} stroke={P.outline} strokeWidth="2" />
              </>
            ) : (
              <>
                <path d={`M ${CX - 28} ${Y_WAIST - 4} Q ${CX} ${Y_WAIST - 8} ${CX + 28} ${Y_WAIST - 4} L ${CX + 30} ${Y_HIP + 6} Q ${CX} ${Y_HIP + 10} ${CX - 30} ${Y_HIP + 6} Z`} fill={`url(#${gid('bottom')})`} stroke={P.outline} strokeWidth="2" />
                <rect x={CX - 26} y={Y_HIP - 2} width="24" height={Y_ANKLE - Y_HIP + 6} rx="11" fill={`url(#${gid('bottom')})`} stroke={P.outline} strokeWidth="2" />
                <rect x={CX + 2} y={Y_HIP - 2} width="24" height={Y_ANKLE - Y_HIP + 6} rx="11" fill={`url(#${gid('bottom')})`} stroke={P.outline} strokeWidth="2" />
              </>
            )}
          </g>
        )}

        {/* === СЛОЙ 6: обувь === */}
        {show.shoes ? (
          <g>
            {cold ? (
              <>
                <rect x={CX - 28} y={Y_ANKLE - 12} width="26" height="40" rx="12" fill={`url(#${gid('shoes')})`} stroke={P.outline} strokeWidth="2" />
                <rect x={CX + 2} y={Y_ANKLE - 12} width="26" height="40" rx="12" fill={`url(#${gid('shoes')})`} stroke={P.outline} strokeWidth="2" />
                <ellipse cx={CX - 15} cy={Y_ANKLE - 10} rx="13" ry="6" fill="#FFFFFF" opacity="0.85" />
                <ellipse cx={CX + 15} cy={Y_ANKLE - 10} rx="13" ry="6" fill="#FFFFFF" opacity="0.85" />
                <rect x={CX - 30} y={Y_FOOT - 6} width="30" height="8" rx="4" fill="#3B3148" opacity="0.7" />
                <rect x={CX} y={Y_FOOT - 6} width="30" height="8" rx="4" fill="#3B3148" opacity="0.7" />
              </>
            ) : hot ? (
              <>
                <rect x={CX - 26} y={Y_FOOT - 10} width="24" height="11" rx="5.5" fill={`url(#${gid('shoes')})`} stroke={P.outline} strokeWidth="2" />
                <rect x={CX + 2} y={Y_FOOT - 10} width="24" height="11" rx="5.5" fill={`url(#${gid('shoes')})`} stroke={P.outline} strokeWidth="2" />
                <path d={`M ${CX - 20} ${Y_ANKLE + 4} L ${CX - 12} ${Y_FOOT - 8}`} stroke={`url(#${gid('shoes')})`} strokeWidth="5" strokeLinecap="round" />
                <path d={`M ${CX + 12} ${Y_ANKLE + 4} L ${CX + 20} ${Y_FOOT - 8}`} stroke={`url(#${gid('shoes')})`} strokeWidth="5" strokeLinecap="round" />
                <path d={`M ${CX - 20} ${Y_ANKLE + 4} L ${CX - 12} ${Y_FOOT - 8}`} stroke={P.outline} strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d={`M ${CX + 12} ${Y_ANKLE + 4} L ${CX + 20} ${Y_FOOT - 8}`} stroke={P.outline} strokeWidth="2" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                <rect x={CX - 26} y={Y_ANKLE + 2} width="24" height="22" rx="11" fill={`url(#${gid('shoes')})`} stroke={P.outline} strokeWidth="2" />
                <rect x={CX + 2} y={Y_ANKLE + 2} width="24" height="22" rx="11" fill={`url(#${gid('shoes')})`} stroke={P.outline} strokeWidth="2" />
                <rect x={CX - 28} y={Y_FOOT - 6} width="28" height="7" rx="3.5" fill={`url(#${gid('shoes')})`} stroke={P.outline} strokeWidth="1.5" />
                <rect x={CX} y={Y_FOOT - 6} width="28" height="7" rx="3.5" fill={`url(#${gid('shoes')})`} stroke={P.outline} strokeWidth="1.5" />
                <line x1={CX - 20} y1={Y_ANKLE + 12} x2={CX - 10} y2={Y_ANKLE + 12} stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                <line x1={CX + 10} y1={Y_ANKLE + 12} x2={CX + 20} y2={Y_ANKLE + 12} stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              </>
            )}
          </g>
        ) : (
          <g>
            <ellipse cx={CX - 15} cy={Y_FOOT - 4} rx="12" ry="7" fill={`url(#${gid('under')})`} stroke={P.outline} strokeWidth="2" />
            <ellipse cx={CX + 15} cy={Y_FOOT - 4} rx="12" ry="7" fill={`url(#${gid('under')})`} stroke={P.outline} strokeWidth="2" />
          </g>
        )}

        {/* === СЛОЙ 1: бельё (верх) === */}
        {show.underwear && (
          <g>
            <path d={`M ${CX - 30} ${Y_SHOULDER - 2} Q ${CX} ${Y_SHOULDER - 6} ${CX + 30} ${Y_SHOULDER - 2} L ${CX + 32} ${Y_WAIST + 2} Q ${CX} ${Y_WAIST + 6} ${CX - 32} ${Y_WAIST + 2} Z`} fill={`url(#${gid('under')})`} stroke={P.outline} strokeWidth="2" />
            <path d={`M ${CX - 12} ${Y_SHOULDER - 2} Q ${CX} ${Y_SHOULDER + 12} ${CX + 12} ${Y_SHOULDER - 2}`} fill={`url(#${gid('skin')})`} stroke={P.outline} strokeWidth="2" />
            {cold ? (
              <>
                <path d={`M ${CX - 42} ${Y_SHOULDER + 6} Q ${CX - 48} ${Y_SHOULDER + 14} ${CX - 50} ${Y_CHEST + 20} Q ${CX - 52} ${Y_CHEST + 32} ${CX - 44} ${Y_CHEST + 34} L ${CX - 38} ${Y_CHEST + 32} L ${CX - 36} ${Y_SHOULDER + 14} Z`} fill={`url(#${gid('under')})`} stroke={P.outline} strokeWidth="2" />
                <path d={`M ${CX + 42} ${Y_SHOULDER + 6} Q ${CX + 48} ${Y_SHOULDER + 14} ${CX + 50} ${Y_CHEST + 20} Q ${CX + 52} ${Y_CHEST + 32} ${CX + 44} ${Y_CHEST + 34} L ${CX + 38} ${Y_CHEST + 32} L ${CX + 36} ${Y_SHOULDER + 14} Z`} fill={`url(#${gid('under')})`} stroke={P.outline} strokeWidth="2" />
              </>
            ) : (
              <>
                <line x1={CX - 18} y1={Y_SHOULDER - 2} x2={CX - 14} y2={Y_SHOULDER + 8} stroke={`url(#${gid('under')})`} strokeWidth="6" strokeLinecap="round" />
                <line x1={CX + 18} y1={Y_SHOULDER - 2} x2={CX + 14} y2={Y_SHOULDER + 8} stroke={`url(#${gid('under')})`} strokeWidth="6" strokeLinecap="round" />
                <line x1={CX - 18} y1={Y_SHOULDER - 2} x2={CX - 14} y2={Y_SHOULDER + 8} stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
                <line x1={CX + 18} y1={Y_SHOULDER - 2} x2={CX + 14} y2={Y_SHOULDER + 8} stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </g>
        )}

        {/* === СЛОЙ 2: нижний (верх) === */}
        {show.lower && (
          <g>
            {shortSleeve ? (
              <>
                <path d={`M ${CX - 42} ${Y_SHOULDER + 6} Q ${CX - 48} ${Y_SHOULDER + 14} ${CX - 48} ${Y_CHEST - 4} Q ${CX - 48} ${Y_CHEST + 4} ${CX - 42} ${Y_CHEST + 4} L ${CX - 38} ${Y_CHEST + 2} L ${CX - 38} ${Y_SHOULDER + 14} Z`} fill={`url(#${gid('top')})`} stroke={P.outline} strokeWidth="2" />
                <path d={`M ${CX + 42} ${Y_SHOULDER + 6} Q ${CX + 48} ${Y_SHOULDER + 14} ${CX + 48} ${Y_CHEST - 4} Q ${CX + 48} ${Y_CHEST + 4} ${CX + 42} ${Y_CHEST + 4} L ${CX + 38} ${Y_CHEST + 2} L ${CX + 38} ${Y_SHOULDER + 14} Z`} fill={`url(#${gid('top')})`} stroke={P.outline} strokeWidth="2" />
              </>
            ) : (
              <>
                <path d={`M ${CX - 42} ${Y_SHOULDER + 6} Q ${CX - 48} ${Y_SHOULDER + 14} ${CX - 50} ${Y_CHEST + 20} Q ${CX - 52} ${Y_CHEST + 32} ${CX - 44} ${Y_CHEST + 34} L ${CX - 38} ${Y_CHEST + 32} L ${CX - 36} ${Y_SHOULDER + 14} Z`} fill={`url(#${gid('top')})`} stroke={P.outline} strokeWidth="2" />
                <path d={`M ${CX + 42} ${Y_SHOULDER + 6} Q ${CX + 48} ${Y_SHOULDER + 14} ${CX + 50} ${Y_CHEST + 20} Q ${CX + 52} ${Y_CHEST + 32} ${CX + 44} ${Y_CHEST + 34} L ${CX + 38} ${Y_CHEST + 32} L ${CX + 36} ${Y_SHOULDER + 14} Z`} fill={`url(#${gid('top')})`} stroke={P.outline} strokeWidth="2" />
              </>
            )}
            <path d={`M ${CX - 30} ${Y_SHOULDER - 2} Q ${CX} ${Y_SHOULDER - 6} ${CX + 30} ${Y_SHOULDER - 2} L ${CX + 32} ${Y_WAIST + 2} Q ${CX} ${Y_WAIST + 6} ${CX - 32} ${Y_WAIST + 2} Z`} fill={`url(#${gid('top')})`} stroke={P.outline} strokeWidth="2" />
            <path d={`M ${CX - 30} ${Y_SHOULDER - 2} Q ${CX} ${Y_SHOULDER - 6} ${CX + 30} ${Y_SHOULDER - 2} L ${CX + 32} ${Y_WAIST + 2} Q ${CX} ${Y_WAIST + 6} ${CX - 32} ${Y_WAIST + 2} Z`} fill={`url(#${gid('hi')})`} opacity="0.2" />
            <path d={`M ${CX - 12} ${Y_SHOULDER - 2} Q ${CX} ${Y_SHOULDER + 12} ${CX + 12} ${Y_SHOULDER - 2}`} fill={show.underwear ? `url(#${gid('under')})` : `url(#${gid('skin')})`} stroke={P.outline} strokeWidth="2" />
          </g>
        )}

        {/* === СЛОЙ 3: верхний (худи) — СВОБОДНЫЙ, НЕ В ОБЛИПКУ === */}
        {(show.upper && (coolish || zone === 'mild')) && (
          <g>
            <path d={`M ${CX - 44} ${Y_SHOULDER + 4} Q ${CX - 52} ${Y_SHOULDER + 12} ${CX - 54} ${Y_CHEST + 24} Q ${CX - 56} ${Y_CHEST + 38} ${CX - 48} ${Y_CHEST + 40} L ${CX - 42} ${Y_CHEST + 38} L ${CX - 40} ${Y_SHOULDER + 12} Z`} fill={`url(#${gid('upper')})`} stroke={P.outline} strokeWidth="2" />
            <path d={`M ${CX + 44} ${Y_SHOULDER + 4} Q ${CX + 52} ${Y_SHOULDER + 12} ${CX + 54} ${Y_CHEST + 24} Q ${CX + 56} ${Y_CHEST + 38} ${CX + 48} ${Y_CHEST + 40} L ${CX + 42} ${Y_CHEST + 38} L ${CX + 40} ${Y_SHOULDER + 12} Z`} fill={`url(#${gid('upper')})`} stroke={P.outline} strokeWidth="2" />
            <path d={`M ${CX - 34} ${Y_SHOULDER - 6} Q ${CX} ${Y_SHOULDER - 10} ${CX + 34} ${Y_SHOULDER - 6} L ${CX + 38} ${Y_WAIST + 10} Q ${CX} ${Y_WAIST + 16} ${CX - 38} ${Y_WAIST + 10} Z`} fill={`url(#${gid('upper')})`} stroke={P.outline} strokeWidth="2" />
            <path d={`M ${CX - 34} ${Y_SHOULDER - 6} Q ${CX} ${Y_SHOULDER - 10} ${CX + 34} ${Y_SHOULDER - 6} L ${CX + 38} ${Y_WAIST + 10} Q ${CX} ${Y_WAIST + 16} ${CX - 38} ${Y_WAIST + 10} Z`} fill={`url(#${gid('hi')})`} opacity="0.2" />
            <path d={`M ${CX - 14} ${Y_SHOULDER - 6} Q ${CX} ${Y_SHOULDER + 14} ${CX + 14} ${Y_SHOULDER - 6}`} fill={`url(#${gid('top')})`} stroke={P.outline} strokeWidth="2" />
            <line x1={CX - 7} y1={Y_SHOULDER + 8} x2={CX - 7} y2={Y_SHOULDER + 34} stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <line x1={CX + 7} y1={Y_SHOULDER + 8} x2={CX + 7} y2={Y_SHOULDER + 34} stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <circle cx={CX - 7} cy={Y_SHOULDER + 35} r="3" fill="#FFFFFF" stroke={P.outline} strokeWidth="1.5" />
            <circle cx={CX + 7} cy={Y_SHOULDER + 35} r="3" fill="#FFFFFF" stroke={P.outline} strokeWidth="1.5" />
            <path d={`M ${CX - 20} ${Y_WAIST - 12} Q ${CX} ${Y_WAIST - 6} ${CX + 20} ${Y_WAIST - 12} L ${CX + 24} ${Y_WAIST + 12} Q ${CX} ${Y_WAIST + 18} ${CX - 24} ${Y_WAIST + 12} Z`} fill="#000000" opacity="0.12" stroke={P.outline} strokeWidth="1.5" />
          </g>
        )}

        {/* === СЛОЙ 4: верхняя одежда — ОБЪЁМНАЯ === */}
        {show.outer && (
          <g>
            <path d={`M ${CX - 46} ${Y_SHOULDER + 2} Q ${CX - 54} ${Y_SHOULDER + 10} ${CX - 56} ${Y_CHEST + 28} Q ${CX - 58} ${Y_CHEST + 44} ${CX - 50} ${Y_CHEST + 46} L ${CX - 44} ${Y_CHEST + 44} L ${CX - 42} ${Y_SHOULDER + 10} Z`} fill={`url(#${gid('outer')})`} stroke={P.outline} strokeWidth="2" />
            <path d={`M ${CX + 46} ${Y_SHOULDER + 2} Q ${CX + 54} ${Y_SHOULDER + 10} ${CX + 56} ${Y_CHEST + 28} Q ${CX + 58} ${Y_CHEST + 44} ${CX + 50} ${Y_CHEST + 46} L ${CX + 44} ${Y_CHEST + 44} L ${CX + 42} ${Y_SHOULDER + 10} Z`} fill={`url(#${gid('outer')})`} stroke={P.outline} strokeWidth="2" />
            <path d={`M ${CX - 36} ${Y_SHOULDER - 8} Q ${CX} ${Y_SHOULDER - 12} ${CX + 36} ${Y_SHOULDER - 8} L ${CX + 40} ${Y_WAIST + 14} Q ${CX} ${Y_WAIST + 20} ${CX - 40} ${Y_WAIST + 14} Z`} fill={`url(#${gid('outer')})`} stroke={P.outline} strokeWidth="2" />
            <path d={`M ${CX - 36} ${Y_SHOULDER - 8} Q ${CX} ${Y_SHOULDER - 12} ${CX + 36} ${Y_SHOULDER - 8} L ${CX + 40} ${Y_WAIST + 14} Q ${CX} ${Y_WAIST + 20} ${CX - 40} ${Y_WAIST + 14} Z`} fill={`url(#${gid('hi')})`} opacity="0.2" />
            <line x1={CX} y1={Y_SHOULDER - 10} x2={CX} y2={Y_WAIST + 34} stroke={`url(#${gid('hat')})`} strokeWidth="4" strokeLinecap="round" />
            <circle cx={CX} cy={Y_SHOULDER + 2} r="4" fill={`url(#${gid('hat')})`} stroke={P.outline} strokeWidth="1.5" />
            <rect x={CX - 28} y={Y_WAIST - 4} width="17" height="19" rx="6" fill="#000000" opacity="0.15" stroke={P.outline} strokeWidth="1.5" />
            <rect x={CX + 11} y={Y_WAIST - 4} width="17" height="19" rx="6" fill="#000000" opacity="0.15" stroke={P.outline} strokeWidth="1.5" />
            {(zone === 'arctic' || zone === 'winter') && !isRainy && (
              <g stroke={P.outline} strokeWidth="1.5" opacity="0.25" fill="none">
                <line x1={CX - 34} y1={Y_SHOULDER + 18} x2={CX + 34} y2={Y_SHOULDER + 18} />
                <line x1={CX - 35} y1={Y_SHOULDER + 44} x2={CX + 35} y2={Y_SHOULDER + 44} />
                <line x1={CX - 35} y1={Y_SHOULDER + 70} x2={CX + 35} y2={Y_SHOULDER + 70} />
              </g>
            )}
            {zone === 'arctic' && !isRainy && (
              <path d={`M ${CX - 28} ${Y_SHOULDER - 8} Q ${CX} ${Y_SHOULDER + 12} ${CX + 28} ${Y_SHOULDER - 8} Q ${CX} ${Y_SHOULDER - 30} ${CX - 28} ${Y_SHOULDER - 8} Z`} fill="#FAFAF9" stroke={P.outline} strokeWidth="2" />
            )}
          </g>
        )}

        {/* === ВАРЕЖКИ === */}
        {cold && show.accessory && (
          <g>
            <circle cx={CX - 48} cy={Y_CHEST + 38} r="11" fill={`url(#${gid('mitt')})`} stroke={P.outline} strokeWidth="2" />
            <circle cx={CX + 48} cy={Y_CHEST + 38} r="11" fill={`url(#${gid('mitt')})`} stroke={P.outline} strokeWidth="2" />
            <rect x={CX - 56} y={Y_CHEST + 24} width="16" height="8" rx="4" fill="#FFFFFF" stroke={P.outline} strokeWidth="1.5" />
            <rect x={CX + 40} y={Y_CHEST + 24} width="16" height="8" rx="4" fill="#FFFFFF" stroke={P.outline} strokeWidth="1.5" />
          </g>
        )}

        {/* === ШАРФ === */}
        {coolish && show.accessory && (
          <g>
            <path d={`M ${CX - 24} ${Y_SHOULDER - 16} Q ${CX} ${Y_SHOULDER - 20} ${CX + 24} ${Y_SHOULDER - 16} L ${CX + 26} ${Y_SHOULDER - 2} Q ${CX} ${Y_SHOULDER + 2} ${CX - 26} ${Y_SHOULDER - 2} Z`} fill={`url(#${gid('scarf')})`} stroke={P.outline} strokeWidth="2" />
            <path d={isWindy
              ? `M ${CX - 16} ${Y_SHOULDER} Q ${CX - 32} ${Y_SHOULDER + 20} ${CX - 46} ${Y_SHOULDER + 26} L ${CX - 40} ${Y_SHOULDER + 38} Q ${CX - 22} ${Y_SHOULDER + 28} ${CX - 6} ${Y_SHOULDER + 2} Z`
              : `M ${CX - 16} ${Y_SHOULDER} L ${CX - 10} ${Y_SHOULDER + 38} L ${CX} ${Y_SHOULDER + 34} L ${CX - 6} ${Y_SHOULDER} Z`} fill={`url(#${gid('scarf')})`} stroke={P.outline} strokeWidth="2" />
          </g>
        )}

        {/* === ГОЛОВА === */}
        <g>
          <ellipse cx={CX} cy={Y_HEAD_CENTER} rx="36" ry="38" fill={`url(#${gid('skin')})`} stroke={P.outline} strokeWidth="2.5" />
          <ellipse cx={CX} cy={Y_HEAD_CENTER} rx="36" ry="38" fill={`url(#${gid('hi')})`} opacity="0.25" />

          {/* Брови */}
          <g stroke={`url(#${gid('hair')})`} strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d={`M ${CX - 20} ${Y_HEAD_CENTER - 10} Q ${CX - 12} ${Y_HEAD_CENTER - 15} ${CX - 4} ${Y_HEAD_CENTER - 10}`} />
            <path d={`M ${CX + 4} ${Y_HEAD_CENTER - 10} Q ${CX + 12} ${Y_HEAD_CENTER - 15} ${CX + 20} ${Y_HEAD_CENTER - 10}`} />
          </g>

          {/* Глаза */}
          <ellipse cx={CX - 14} cy={Y_HEAD_CENTER + 4} rx="9" ry="10" fill="#FFFFFF" stroke={P.outline} strokeWidth="2" />
          <ellipse cx={CX + 14} cy={Y_HEAD_CENTER + 4} rx="9" ry="10" fill="#FFFFFF" stroke={P.outline} strokeWidth="2" />
          <circle cx={CX - 14} cy={Y_HEAD_CENTER + 6} r="6.5" fill={`url(#${gid('hair')})`} />
          <circle cx={CX + 14} cy={Y_HEAD_CENTER + 6} r="6.5" fill={`url(#${gid('hair')})`} />
          <circle cx={CX - 17} cy={Y_HEAD_CENTER + 2} r="2.8" fill="#FFFFFF" />
          <circle cx={CX + 11} cy={Y_HEAD_CENTER + 2} r="2.8" fill="#FFFFFF" />
          <circle cx={CX - 11} cy={Y_HEAD_CENTER + 9} r="1.4" fill="#FFFFFF" opacity="0.8" />
          <circle cx={CX + 17} cy={Y_HEAD_CENTER + 9} r="1.4" fill="#FFFFFF" opacity="0.8" />
          {girl && (
            <g stroke={P.outline} strokeWidth="2" strokeLinecap="round">
              <line x1={CX - 22} y1={Y_HEAD_CENTER} x2={CX - 26} y2={Y_HEAD_CENTER - 4} />
              <line x1={CX + 22} y1={Y_HEAD_CENTER} x2={CX + 26} y2={Y_HEAD_CENTER - 4} />
            </g>
          )}

          {/* Румянец */}
          <circle cx={CX - 24} cy={Y_HEAD_CENTER + 14} r={cold ? 10 : 8} fill={`url(#${gid('blush')})`} />
          <circle cx={CX + 24} cy={Y_HEAD_CENTER + 14} r={cold ? 10 : 8} fill={`url(#${gid('blush')})`} />

          {/* Нос */}
          <ellipse cx={CX} cy={Y_HEAD_CENTER + 12} rx="3" ry="2.2" fill="#000000" opacity="0.15" />

          {/* Рот */}
          {hot ? (
            <path d={`M ${CX - 8} ${Y_HEAD_CENTER + 20} Q ${CX} ${Y_HEAD_CENTER + 30} ${CX + 8} ${Y_HEAD_CENTER + 20} Z`} fill={`url(#${gid('hair')})`} stroke={P.outline} strokeWidth="2" />
          ) : (
            <path d={`M ${CX - 7} ${Y_HEAD_CENTER + 21} Q ${CX} ${Y_HEAD_CENTER + 28} ${CX + 7} ${Y_HEAD_CENTER + 21}`} fill="none" stroke={P.outline} strokeWidth="3" strokeLinecap="round" />
          )}

          {/* Веснушки */}
          {!girl && (
            <g fill={`url(#${gid('hair')})`} opacity="0.4">
              <circle cx={CX - 22} cy={Y_HEAD_CENTER + 10} r="1.8" /><circle cx={CX - 26} cy={Y_HEAD_CENTER + 15} r="1.8" />
              <circle cx={CX + 22} cy={Y_HEAD_CENTER + 10} r="1.8" /><circle cx={CX + 26} cy={Y_HEAD_CENTER + 15} r="1.8" />
            </g>
          )}

          {/* Дыхание */}
          {cold && (
            <g opacity="0.45" className="animate-float" style={{ animationDuration: '2s' }}>
              <ellipse cx={CX + 18} cy={Y_HEAD_CENTER + 24} rx="6" ry="3" fill="#FFFFFF" />
              <ellipse cx={CX + 26} cy={Y_HEAD_CENTER + 20} rx="4" ry="2" fill="#FFFFFF" />
            </g>
          )}

          {/* Волосы спереди */}
          <g fill={`url(#${gid('hair')})`} stroke={P.outline} strokeWidth="2">
            {girl ? (
              <>
                <path d={`M ${CX - 38} ${Y_HEAD_CENTER - 6} Q ${CX} ${Y_HEAD_CENTER - 30} ${CX + 38} ${Y_HEAD_CENTER - 6} Q ${CX + 42} ${Y_HEAD_CENTER - 38} ${CX} ${Y_HEAD_CENTER - 42} Q ${CX - 42} ${Y_HEAD_CENTER - 38} ${CX - 38} ${Y_HEAD_CENTER - 6} Z`} />
                <path d={`M ${CX - 32} ${Y_HEAD_CENTER - 18} Q ${CX - 20} ${Y_HEAD_CENTER - 6} ${CX - 8} ${Y_HEAD_CENTER - 18} Q ${CX + 4} ${Y_HEAD_CENTER - 6} ${CX + 16} ${Y_HEAD_CENTER - 18} Q ${CX + 28} ${Y_HEAD_CENTER - 6} ${CX + 36} ${Y_HEAD_CENTER - 18} L ${CX + 36} ${Y_HEAD_CENTER - 30} Q ${CX} ${Y_HEAD_CENTER - 38} ${CX - 30} ${Y_HEAD_CENTER - 30} Z`} fill={`url(#${gid('hair')})`} opacity="0.5" />
              </>
            ) : (
              <>
                <path d={`M ${CX - 38} ${Y_HEAD_CENTER - 10} Q ${CX - 22} ${Y_HEAD_CENTER - 34} ${CX} ${Y_HEAD_CENTER - 26} Q ${CX + 22} ${Y_HEAD_CENTER - 38} ${CX + 38} ${Y_HEAD_CENTER - 12} Q ${CX + 44} ${Y_HEAD_CENTER - 42} ${CX} ${Y_HEAD_CENTER - 48} Q ${CX - 44} ${Y_HEAD_CENTER - 42} ${CX - 38} ${Y_HEAD_CENTER - 10} Z`} />
                <path d={`M ${CX - 28} ${Y_HEAD_CENTER - 20} Q ${CX - 12} ${Y_HEAD_CENTER - 30} ${CX + 8} ${Y_HEAD_CENTER - 22} L ${CX + 2} ${Y_HEAD_CENTER - 34} Q ${CX - 20} ${Y_HEAD_CENTER - 36} ${CX - 30} ${Y_HEAD_CENTER - 24} Z`} fill={`url(#${gid('hair')})`} opacity="0.5" />
              </>
            )}
          </g>

          {/* Головной убор */}
          {show.headwear && (
            <g>
              {hot ? (
                <>
                  <ellipse cx={CX} cy={Y_HEAD_CENTER - 26} rx="50" ry="13" fill={`url(#${gid('hat')})`} stroke={P.outline} strokeWidth="2" />
                  <path d={`M ${CX - 32} ${Y_HEAD_CENTER - 26} Q ${CX} ${Y_HEAD_CENTER - 58} ${CX + 32} ${Y_HEAD_CENTER - 26} Z`} fill={`url(#${gid('hat')})`} stroke={P.outline} strokeWidth="2" />
                  <path d={`M ${CX - 32} ${Y_HEAD_CENTER - 26} Q ${CX} ${Y_HEAD_CENTER - 58} ${CX + 32} ${Y_HEAD_CENTER - 26} Z`} fill={`url(#${gid('hi')})`} opacity="0.25" />
                  <rect x={CX - 32} y={Y_HEAD_CENTER - 34} width="64" height="9" rx="4.5" fill={`url(#${gid('hat')})`} stroke={P.outline} strokeWidth="1.5" />
                </>
              ) : zone === 'warm' || zone === 'mild' ? (
                <>
                  <path d={`M ${CX - 40} ${Y_HEAD_CENTER - 14} Q ${CX} ${Y_HEAD_CENTER - 54} ${CX + 40} ${Y_HEAD_CENTER - 14} Z`} fill={`url(#${gid('hat')})`} stroke={P.outline} strokeWidth="2" />
                  <path d={`M ${CX - 40} ${Y_HEAD_CENTER - 14} Q ${CX} ${Y_HEAD_CENTER - 54} ${CX + 40} ${Y_HEAD_CENTER - 14} Z`} fill={`url(#${gid('hi')})`} opacity="0.25" />
                  <path d={`M ${CX + 6} ${Y_HEAD_CENTER - 24} Q ${CX + 34} ${Y_HEAD_CENTER - 30} ${CX + 50} ${Y_HEAD_CENTER - 14} Q ${CX + 30} ${Y_HEAD_CENTER - 6} ${CX + 8} ${Y_HEAD_CENTER - 11} Z`} fill={`url(#${gid('hat')})`} stroke={P.outline} strokeWidth="2" />
                  <circle cx={CX} cy={Y_HEAD_CENTER - 44} r="4" fill={`url(#${gid('hat')})`} stroke={P.outline} strokeWidth="1.5" />
                </>
              ) : (
                <>
                  <path d={`M ${CX - 40} ${Y_HEAD_CENTER - 14} Q ${CX} ${Y_HEAD_CENTER - 58} ${CX + 40} ${Y_HEAD_CENTER - 14} Z`} fill={`url(#${gid('hat')})`} stroke={P.outline} strokeWidth="2" />
                  <path d={`M ${CX - 40} ${Y_HEAD_CENTER - 14} Q ${CX} ${Y_HEAD_CENTER - 58} ${CX + 40} ${Y_HEAD_CENTER - 14} Z`} fill={`url(#${gid('hi')})`} opacity="0.25" />
                  <rect x={CX - 42} y={Y_HEAD_CENTER - 18} width="84" height="16" rx="8" fill={`url(#${gid('hat')})`} stroke={P.outline} strokeWidth="2" />
                  {(zone === 'arctic' || zone === 'winter') && <circle cx={CX} cy={Y_HEAD_CENTER - 52} r="12" fill="#FFFFFF" stroke={P.outline} strokeWidth="2" />}
                </>
              )}
            </g>
          )}

          {/* Очки */}
          {hot && show.accessory && (
            <g>
              <rect x={CX - 24} y={Y_HEAD_CENTER + 1} width="20" height="14" rx="6" fill="#2C3E50" stroke={P.outline} strokeWidth="2" />
              <rect x={CX + 4} y={Y_HEAD_CENTER + 1} width="20" height="14" rx="6" fill="#2C3E50" stroke={P.outline} strokeWidth="2" />
              <line x1={CX - 4} y1={Y_HEAD_CENTER + 6} x2={CX + 4} y2={Y_HEAD_CENTER + 6} stroke={P.outline} strokeWidth="3" />
              <line x1={CX - 20} y1={Y_HEAD_CENTER + 4} x2={CX - 12} y2={Y_HEAD_CENTER + 9} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
              <line x1={CX + 10} y1={Y_HEAD_CENTER + 4} x2={CX + 18} y2={Y_HEAD_CENTER + 9} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            </g>
          )}
        </g>

        {/* Зонт */}
        {isRainy && show.accessory && (
          <g className="animate-float" style={{ animationDuration: '4s' }}>
            <line x1={CX + 48} y1={Y_CHEST + 36} x2={CX + 48} y2={Y_HEAD_CENTER - 48} stroke={P.outline} strokeWidth="4.5" strokeLinecap="round" />
            <path d={`M ${CX - 10} ${Y_HEAD_CENTER - 24} Q ${CX + 48} ${Y_HEAD_CENTER - 76} ${CX + 106} ${Y_HEAD_CENTER - 24} Z`} fill="#FF6347" stroke={P.outline} strokeWidth="2" />
            <path d={`M ${CX - 10} ${Y_HEAD_CENTER - 24} Q ${CX + 8} ${Y_HEAD_CENTER - 34} ${CX + 26} ${Y_HEAD_CENTER - 24} Q ${CX + 44} ${Y_HEAD_CENTER - 34} ${CX + 62} ${Y_HEAD_CENTER - 24} Q ${CX + 80} ${Y_HEAD_CENTER - 34} ${CX + 106} ${Y_HEAD_CENTER - 24}`} fill="none" stroke={P.outline} strokeWidth="2" opacity="0.5" />
          </g>
        )}
      </g>
    </svg>
  );
};
