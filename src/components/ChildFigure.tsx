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

// Градиентная пара для 3D-объёма
const shade = (light: string, dark: string) => ({ light, dark });

export const ChildFigure: React.FC<ChildFigureProps> = ({
  gender, effectiveTemp, isRainy, isSnowy, isWindy, show,
}) => {
  const girl = gender === 'girl';
  const zone = zoneFromTemp(effectiveTemp);
  const cold = ['arctic', 'winter', 'freeze'].includes(zone);
  const coolish = cold || ['chilly', 'cool'].includes(zone);
  const hot = zone === 'hot';

  // АНИМЕ-ПРОПОРЦИИ (по референсу)
  const CX = 120;
  const Y_HEAD = 52;        // Центр головы
  const HEAD_R = 32;        // Радиус головы (1/5 от 320)
  const Y_NECK = 84;        // Шея
  const Y_SHOULDER = 96;    // Плечи (узкие!)
  const Y_CHEST = 128;      // Грудь
  const Y_WAIST = 160;      // Талия
  const Y_HIP = 180;        // Бёдра
  const Y_KNEE = 260;       // Колени (середина ног)
  const Y_ANKLE = 340;      // Щиколотки
  const SHOULDER_W = 28;    // Ширина плеч (узкие, недоразвитые)

  // 3D-палитры с градиентами
  const P = girl
    ? {
        skin: shade('#FFE4D6', '#F4C4B0'),
        hair: shade('#A0522D', '#6B3410'),
        top: shade('#87CEEB', '#5BA3C9'),
        upper: shade('#DDA0DD', '#BA7FBA'),
        outer: shade('#FF69B4', '#DB4A8A'),
        bottom: shade('#87CEEB', '#5BA3C9'),
        shoes: shade('#FF6347', '#CC4F39'),
        hat: shade('#87CEEB', '#5BA3C9'),
        scarf: shade('#FF69B4', '#DB4A8A'),
        mitt: shade('#DDA0DD', '#BA7FBA'),
        under: shade('#FFFFFF', '#E8E8E8'),
      }
    : {
        skin: shade('#FFE4D6', '#F4C4B0'),
        hair: shade('#654321', '#3E2710'),
        top: shade('#87CEEB', '#5BA3C9'),
        upper: shade('#6495ED', '#4A75C9'),
        outer: shade('#4169E1', '#2E4FA8'),
        bottom: shade('#4682B4', '#2E5A7A'),
        shoes: shade('#FF6347', '#CC4F39'),
        hat: shade('#4682B4', '#2E5A7A'),
        scarf: shade('#FF6347', '#CC4F39'),
        mitt: shade('#6495ED', '#4A75C9'),
        under: shade('#FFFFFF', '#E8E8E8'),
      };

  const ink = '#3B2F2F';
  const shortSleeve = hot || zone === 'warm';
  const drawSkirt = girl && !cold && zone !== 'chilly';
  const drawShorts = !girl && (hot || zone === 'warm');

  const uid = girl ? 'g' : 'b';
  const gid = (n: string) => `${uid}-${n}`;

  return (
    <svg viewBox="0 0 240 400" className="h-full w-full select-none" role="img" aria-label="Иллюстрация ребёнка по погоде">
      <defs>
        {/* Мягкая тень */}
        <filter id={`${uid}-soft`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#3B2F2F" floodOpacity="0.2" />
        </filter>

        {/* Градиенты для 3D-объёма */}
        {Object.entries({ ...P, skin: P.skin, hair: P.hair }).map(([k, v]) => (
          <linearGradient key={k} id={gid(k)} x1="0.3" y1="0" x2="0.7" y2="1">
            <stop offset="0%" stopColor={(v as any).light} />
            <stop offset="100%" stopColor={(v as any).dark} />
          </linearGradient>
        ))}

        {/* Радиальный градиент для лица */}
        <radialGradient id={gid('face')} cx="0.4" cy="0.35" r="0.6">
          <stop offset="0%" stopColor={P.skin.light} />
          <stop offset="100%" stopColor={P.skin.dark} />
        </radialGradient>

        {/* Румянец */}
        <radialGradient id={gid('blush')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={cold ? '#F87171' : '#FFB6C1'} stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFB6C1" stopOpacity="0" />
        </radialGradient>

        {/* Тень под ногами */}
        <radialGradient id={gid('ground')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#3B2F2F" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3B2F2F" stopOpacity="0" />
        </radialGradient>

        {/* Блик */}
        <linearGradient id={gid('hi')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Тень под ногами */}
      <ellipse cx={CX} cy={Y_ANKLE + 18} rx="45" ry="7" fill={`url(#${gid('ground')})`} />

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

      <g filter={`url(#${uid}-soft)`}>
        {/* === ВОЛОСЫ СЗАДИ (девочка: хвостики) === */}
        {girl && (
          <g>
            <ellipse cx={CX - 38} cy={Y_HEAD + 12} rx="12" ry="18" fill={`url(#${gid('hair')})`} />
            <ellipse cx={CX + 38} cy={Y_HEAD + 12} rx="12" ry="18" fill={`url(#${gid('hair')})`} />
            <circle cx={CX - 38} cy={Y_HEAD - 2} r="4.5" fill={`url(#${gid('hat')})`} />
            <circle cx={CX + 38} cy={Y_HEAD - 2} r="4.5" fill={`url(#${gid('hat')})`} />
          </g>
        )}

        {/* === НОГИ (кожа) — ТОНКИЕ, ДЛИННЫЕ (3/5 роста) === */}
        <g>
          {/* Левая нога */}
          <path d={`M ${CX - 14} ${Y_HIP + 4} Q ${CX - 16} ${Y_KNEE} ${CX - 15} ${Y_ANKLE}`} stroke={`url(#${gid('skin')})`} strokeWidth="14" strokeLinecap="round" fill="none" />
          <path d={`M ${CX - 14} ${Y_HIP + 4} Q ${CX - 16} ${Y_KNEE} ${CX - 15} ${Y_ANKLE}`} stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.25" />
          {/* Правая нога */}
          <path d={`M ${CX + 14} ${Y_HIP + 4} Q ${CX + 16} ${Y_KNEE} ${CX + 15} ${Y_ANKLE}`} stroke={`url(#${gid('skin')})`} strokeWidth="14" strokeLinecap="round" fill="none" />
          <path d={`M ${CX + 14} ${Y_HIP + 4} Q ${CX + 16} ${Y_KNEE} ${CX + 15} ${Y_ANKLE}`} stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.25" />
        </g>

        {/* === СЛОЙ 1: бельё (низ) === */}
        {show.underwear && (
          <g>
            <path d={`M ${CX - 20} ${Y_WAIST - 2} Q ${CX} ${Y_WAIST - 6} ${CX + 20} ${Y_WAIST - 2} L ${CX + 22} ${Y_HIP + 6} Q ${CX} ${Y_HIP + 10} ${CX - 22} ${Y_HIP + 6} Z`} fill={`url(#${gid('under')})`} />
            {cold && (
              <>
                <line x1={CX - 10} y1={Y_WAIST + 2} x2={CX - 10} y2={Y_HIP + 2} stroke="#C9C9DE" strokeWidth="2" strokeDasharray="3,3" />
                <line x1={CX + 10} y1={Y_WAIST + 2} x2={CX + 10} y2={Y_HIP + 2} stroke="#C9C9DE" strokeWidth="2" strokeDasharray="3,3" />
              </>
            )}
          </g>
        )}

        {/* === СЛОЙ 2: нижний (низ) === */}
        {show.lower && (
          <g>
            {drawSkirt ? (
              <>
                <path d={`M ${CX - 22} ${Y_WAIST - 4} Q ${CX} ${Y_WAIST - 8} ${CX + 22} ${Y_WAIST - 4} L ${CX + 38} ${Y_HIP + 44} Q ${CX} ${Y_HIP + 56} ${CX - 38} ${Y_HIP + 44} Z`} fill={`url(#${gid('bottom')})`} />
                <path d={`M ${CX - 22} ${Y_WAIST - 4} Q ${CX} ${Y_WAIST - 8} ${CX + 22} ${Y_WAIST - 4} L ${CX + 38} ${Y_HIP + 44} Q ${CX} ${Y_HIP + 56} ${CX - 38} ${Y_HIP + 44} Z`} fill={`url(#${gid('hi')})`} />
                {[-24, -12, 0, 12, 24].map((dx) => (
                  <line key={dx} x1={CX + dx * 0.55} y1={Y_WAIST} x2={CX + dx} y2={Y_HIP + 42} stroke="#00000020" strokeWidth="2" />
                ))}
              </>
            ) : drawShorts ? (
              <>
                <path d={`M ${CX - 22} ${Y_WAIST - 4} Q ${CX} ${Y_WAIST - 8} ${CX + 22} ${Y_WAIST - 4} L ${CX + 24} ${Y_HIP + 8} Q ${CX} ${Y_HIP + 12} ${CX - 24} ${Y_HIP + 8} Z`} fill={`url(#${gid('bottom')})`} />
                <path d={`M ${CX - 16} ${Y_HIP} Q ${CX - 18} ${Y_HIP + 24} ${CX - 17} ${Y_HIP + 44}`} stroke={`url(#${gid('bottom')})`} strokeWidth="16" strokeLinecap="round" fill="none" />
                <path d={`M ${CX + 16} ${Y_HIP} Q ${CX + 18} ${Y_HIP + 24} ${CX + 17} ${Y_HIP + 44}`} stroke={`url(#${gid('bottom')})`} strokeWidth="16" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                <path d={`M ${CX - 22} ${Y_WAIST - 4} Q ${CX} ${Y_WAIST - 8} ${CX + 22} ${Y_WAIST - 4} L ${CX + 24} ${Y_HIP + 8} Q ${CX} ${Y_HIP + 12} ${CX - 24} ${Y_HIP + 8} Z`} fill={`url(#${gid('bottom')})`} />
                <path d={`M ${CX - 16} ${Y_HIP} Q ${CX - 18} ${Y_KNEE} ${CX - 17} ${Y_ANKLE}`} stroke={`url(#${gid('bottom')})`} strokeWidth="16" strokeLinecap="round" fill="none" />
                <path d={`M ${CX + 16} ${Y_HIP} Q ${CX + 18} ${Y_KNEE} ${CX + 17} ${Y_ANKLE}`} stroke={`url(#${gid('bottom')})`} strokeWidth="16" strokeLinecap="round" fill="none" />
              </>
            )}
          </g>
        )}

        {/* === СЛОЙ 6: обувь === */}
        {show.shoes ? (
          <g>
            {cold ? (
              <>
                <rect x={CX - 26} y={Y_ANKLE - 12} width="22" height="36" rx="10" fill={`url(#${gid('shoes')})`} />
                <rect x={CX + 4} y={Y_ANKLE - 12} width="22" height="36" rx="10" fill={`url(#${gid('shoes')})`} />
                <ellipse cx={CX - 15} cy={Y_ANKLE - 10} rx="11" ry="5" fill="#FFFFFF" opacity="0.85" />
                <ellipse cx={CX + 15} cy={Y_ANKLE - 10} rx="11" ry="5" fill="#FFFFFF" opacity="0.85" />
                <rect x={CX - 28} y={Y_ANKLE + 20} width="26" height="7" rx="3.5" fill="#3B2F2F" opacity="0.6" />
                <rect x={CX + 2} y={Y_ANKLE + 20} width="26" height="7" rx="3.5" fill="#3B2F2F" opacity="0.6" />
              </>
            ) : hot ? (
              <>
                <rect x={CX - 24} y={Y_ANKLE + 14} width="20" height="10" rx="5" fill={`url(#${gid('shoes')})`} />
                <rect x={CX + 4} y={Y_ANKLE + 14} width="20" height="10" rx="5" fill={`url(#${gid('shoes')})`} />
                <path d={`M ${CX - 20} ${Y_ANKLE + 6} L ${CX - 12} ${Y_ANKLE + 16}`} stroke={`url(#${gid('shoes')})`} strokeWidth="5" strokeLinecap="round" />
                <path d={`M ${CX + 12} ${Y_ANKLE + 6} L ${CX + 20} ${Y_ANKLE + 16}`} stroke={`url(#${gid('shoes')})`} strokeWidth="5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <rect x={CX - 24} y={Y_ANKLE + 2} width="20" height="18" rx="9" fill={`url(#${gid('shoes')})`} />
                <rect x={CX + 4} y={Y_ANKLE + 2} width="20" height="18" rx="9" fill={`url(#${gid('shoes')})`} />
                <rect x={CX - 26} y={Y_ANKLE + 17} width="24" height="6" rx="3" fill={`url(#${gid('shoes')})`} opacity="0.7" />
                <rect x={CX + 2} y={Y_ANKLE + 17} width="24" height="6" rx="3" fill={`url(#${gid('shoes')})`} opacity="0.7" />
                <line x1={CX - 20} y1={Y_ANKLE + 9} x2={CX - 10} y2={Y_ANKLE + 9} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                <line x1={CX + 10} y1={Y_ANKLE + 9} x2={CX + 20} y2={Y_ANKLE + 9} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              </>
            )}
          </g>
        ) : (
          <g>
            <ellipse cx={CX - 15} cy={Y_ANKLE + 12} rx="10" ry="7" fill={`url(#${gid('under')})`} />
            <ellipse cx={CX + 15} cy={Y_ANKLE + 12} rx="10" ry="7" fill={`url(#${gid('under')})`} />
          </g>
        )}

        {/* === ТОРС (кожа) — УЗКИЙ, АНИМЕ-ПРОПОРЦИИ === */}
        <path d={`M ${CX - 18} ${Y_SHOULDER} Q ${CX - 22} ${Y_CHEST} ${CX - 20} ${Y_WAIST} Q ${CX - 22} ${Y_HIP} ${CX - 18} ${Y_HIP + 4} L ${CX + 18} ${Y_HIP + 4} Q ${CX + 22} ${Y_HIP} ${CX + 20} ${Y_WAIST} Q ${CX + 22} ${Y_CHEST} ${CX + 18} ${Y_SHOULDER} Z`} fill={`url(#${gid('skin')})`} />
        <path d={`M ${CX - 12} ${Y_SHOULDER + 4} Q ${CX - 14} ${Y_CHEST} ${CX - 12} ${Y_WAIST}`} stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.2" />

        {/* === РУКИ (кожа) — ТОНКИЕ, ДО СЕРЕДИНЫ БЁДЕР === */}
        <g>
          {/* Левая рука */}
          <path d={`M ${CX - SHOULDER_W} ${Y_SHOULDER + 4} Q ${CX - 34} ${Y_CHEST + 10} ${CX - 32} ${Y_HIP + 20}`} stroke={`url(#${gid('skin')})`} strokeWidth="11" strokeLinecap="round" fill="none" />
          <path d={`M ${CX - SHOULDER_W} ${Y_SHOULDER + 4} Q ${CX - 34} ${Y_CHEST + 10} ${CX - 32} ${Y_HIP + 20}`} stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.2" />
          <circle cx={CX - 32} cy={Y_HIP + 22} r="6" fill={`url(#${gid('skin')})`} />
          {/* Правая рука */}
          <path d={`M ${CX + SHOULDER_W} ${Y_SHOULDER + 4} Q ${CX + 34} ${Y_CHEST + 10} ${CX + 32} ${Y_HIP + 20}`} stroke={`url(#${gid('skin')})`} strokeWidth="11" strokeLinecap="round" fill="none" />
          <path d={`M ${CX + SHOULDER_W} ${Y_SHOULDER + 4} Q ${CX + 34} ${Y_CHEST + 10} ${CX + 32} ${Y_HIP + 20}`} stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.2" />
          <circle cx={CX + 32} cy={Y_HIP + 22} r="6" fill={`url(#${gid('skin')})`} />
        </g>

        {/* === СЛОЙ 1: бельё (верх) === */}
        {show.underwear && (
          <g>
            <path d={`M ${CX - 20} ${Y_SHOULDER - 2} Q ${CX} ${Y_SHOULDER - 6} ${CX + 20} ${Y_SHOULDER - 2} L ${CX + 22} ${Y_WAIST + 2} Q ${CX} ${Y_WAIST + 6} ${CX - 22} ${Y_WAIST + 2} Z`} fill={`url(#${gid('under')})`} />
            <path d={`M ${CX - 10} ${Y_SHOULDER - 2} Q ${CX} ${Y_SHOULDER + 12} ${CX + 10} ${Y_SHOULDER - 2}`} fill={`url(#${gid('skin')})`} />
            {cold ? (
              <>
                <path d={`M ${CX - SHOULDER_W - 2} ${Y_SHOULDER + 2} Q ${CX - 36} ${Y_CHEST + 8} ${CX - 34} ${Y_HIP + 16}`} stroke={`url(#${gid('under')})`} strokeWidth="13" strokeLinecap="round" fill="none" />
                <path d={`M ${CX + SHOULDER_W + 2} ${Y_SHOULDER + 2} Q ${CX + 36} ${Y_CHEST + 8} ${CX + 34} ${Y_HIP + 16}`} stroke={`url(#${gid('under')})`} strokeWidth="13" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                <line x1={CX - 16} y1={Y_SHOULDER - 2} x2={CX - 13} y2={Y_SHOULDER + 8} stroke={`url(#${gid('under')})`} strokeWidth="5" strokeLinecap="round" />
                <line x1={CX + 16} y1={Y_SHOULDER - 2} x2={CX + 13} y2={Y_SHOULDER + 8} stroke={`url(#${gid('under')})`} strokeWidth="5" strokeLinecap="round" />
              </>
            )}
          </g>
        )}

        {/* === СЛОЙ 2: нижний (верх) === */}
        {show.lower && (
          <g>
            {shortSleeve ? (
              <>
                <path d={`M ${CX - SHOULDER_W - 2} ${Y_SHOULDER + 2} Q ${CX - 36} ${Y_CHEST + 6} ${CX - 34} ${Y_CHEST + 28}`} stroke={`url(#${gid('top')})`} strokeWidth="13" strokeLinecap="round" fill="none" />
                <path d={`M ${CX + SHOULDER_W + 2} ${Y_SHOULDER + 2} Q ${CX + 36} ${Y_CHEST + 6} ${CX + 34} ${Y_CHEST + 28}`} stroke={`url(#${gid('top')})`} strokeWidth="13" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                <path d={`M ${CX - SHOULDER_W - 2} ${Y_SHOULDER + 2} Q ${CX - 36} ${Y_CHEST + 8} ${CX - 34} ${Y_HIP + 16}`} stroke={`url(#${gid('top')})`} strokeWidth="13" strokeLinecap="round" fill="none" />
                <path d={`M ${CX + SHOULDER_W + 2} ${Y_SHOULDER + 2} Q ${CX + 36} ${Y_CHEST + 8} ${CX + 34} ${Y_HIP + 16}`} stroke={`url(#${gid('top')})`} strokeWidth="13" strokeLinecap="round" fill="none" />
              </>
            )}
            <path d={`M ${CX - 20} ${Y_SHOULDER - 2} Q ${CX} ${Y_SHOULDER - 6} ${CX + 20} ${Y_SHOULDER - 2} L ${CX + 22} ${Y_WAIST + 2} Q ${CX} ${Y_WAIST + 6} ${CX - 22} ${Y_WAIST + 2} Z`} fill={`url(#${gid('top')})`} />
            <path d={`M ${CX - 20} ${Y_SHOULDER - 2} Q ${CX} ${Y_SHOULDER - 6} ${CX + 20} ${Y_SHOULDER - 2} L ${CX + 22} ${Y_WAIST + 2} Q ${CX} ${Y_WAIST + 6} ${CX - 22} ${Y_WAIST + 2} Z`} fill={`url(#${gid('hi')})`} />
            <path d={`M ${CX - 10} ${Y_SHOULDER - 2} Q ${CX} ${Y_SHOULDER + 12} ${CX + 10} ${Y_SHOULDER - 2}`} fill={show.underwear ? `url(#${gid('under')})` : `url(#${gid('skin')})`} />
          </g>
        )}

        {/* === СЛОЙ 3: верхний (худи) === */}
        {(show.upper && (coolish || zone === 'mild')) && (
          <g>
            <path d={`M ${CX - SHOULDER_W - 4} ${Y_SHOULDER} Q ${CX - 38} ${Y_CHEST + 6} ${CX - 36} ${Y_HIP + 18}`} stroke={`url(#${gid('upper')})`} strokeWidth="15" strokeLinecap="round" fill="none" />
            <path d={`M ${CX + SHOULDER_W + 4} ${Y_SHOULDER} Q ${CX + 38} ${Y_CHEST + 6} ${CX + 36} ${Y_HIP + 18}`} stroke={`url(#${gid('upper')})`} strokeWidth="15" strokeLinecap="round" fill="none" />
            <path d={`M ${CX - 22} ${Y_SHOULDER - 4} Q ${CX} ${Y_SHOULDER - 8} ${CX + 22} ${Y_SHOULDER - 4} L ${CX + 24} ${Y_WAIST + 6} Q ${CX} ${Y_WAIST + 10} ${CX - 24} ${Y_WAIST + 6} Z`} fill={`url(#${gid('upper')})`} />
            <path d={`M ${CX - 22} ${Y_SHOULDER - 4} Q ${CX} ${Y_SHOULDER - 8} ${CX + 22} ${Y_SHOULDER - 4} L ${CX + 24} ${Y_WAIST + 6} Q ${CX} ${Y_WAIST + 10} ${CX - 24} ${Y_WAIST + 6} Z`} fill={`url(#${gid('hi')})`} />
            <path d={`M ${CX - 12} ${Y_SHOULDER - 4} Q ${CX} ${Y_SHOULDER + 14} ${CX + 12} ${Y_SHOULDER - 4}`} fill={`url(#${gid('top')})`} />
            <line x1={CX - 5} y1={Y_SHOULDER + 8} x2={CX - 5} y2={Y_SHOULDER + 28} stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            <line x1={CX + 5} y1={Y_SHOULDER + 8} x2={CX + 5} y2={Y_SHOULDER + 28} stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            <circle cx={CX - 5} cy={Y_SHOULDER + 29} r="2" fill="#FFFFFF" opacity="0.8" />
            <circle cx={CX + 5} cy={Y_SHOULDER + 29} r="2" fill="#FFFFFF" opacity="0.8" />
            <path d={`M ${CX - 14} ${Y_WAIST - 10} Q ${CX} ${Y_WAIST - 6} ${CX + 14} ${Y_WAIST - 10} L ${CX + 16} ${Y_WAIST + 8} Q ${CX} ${Y_WAIST + 12} ${CX - 16} ${Y_WAIST + 8} Z`} fill="#000000" opacity="0.1" />
          </g>
        )}

        {/* === СЛОЙ 4: верхняя одежда === */}
        {show.outer && (
          <g>
            <path d={`M ${CX - SHOULDER_W - 6} ${Y_SHOULDER - 2} Q ${CX - 40} ${Y_CHEST + 4} ${CX - 38} ${Y_HIP + 20}`} stroke={`url(#${gid('outer')})`} strokeWidth="17" strokeLinecap="round" fill="none" />
            <path d={`M ${CX + SHOULDER_W + 6} ${Y_SHOULDER - 2} Q ${CX + 40} ${Y_CHEST + 4} ${CX + 38} ${Y_HIP + 20}`} stroke={`url(#${gid('outer')})`} strokeWidth="17" strokeLinecap="round" fill="none" />
            <path d={`M ${CX - 24} ${Y_SHOULDER - 6} Q ${CX} ${Y_SHOULDER - 10} ${CX + 24} ${Y_SHOULDER - 6} L ${CX + 26} ${Y_WAIST + 10} Q ${CX} ${Y_WAIST + 14} ${CX - 26} ${Y_WAIST + 10} Z`} fill={`url(#${gid('outer')})`} />
            <path d={`M ${CX - 24} ${Y_SHOULDER - 6} Q ${CX} ${Y_SHOULDER - 10} ${CX + 24} ${Y_SHOULDER - 6} L ${CX + 26} ${Y_WAIST + 10} Q ${CX} ${Y_WAIST + 14} ${CX - 26} ${Y_WAIST + 10} Z`} fill={`url(#${gid('hi')})`} />
            <line x1={CX} y1={Y_SHOULDER - 8} x2={CX} y2={Y_WAIST + 24} stroke={`url(#${gid('hat')})`} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
            <circle cx={CX} cy={Y_SHOULDER + 2} r="2.5" fill={`url(#${gid('hat')})`} opacity="0.7" />
            <rect x={CX - 18} y={Y_WAIST - 4} width="12" height="14" rx="4" fill="#000000" opacity="0.12" />
            <rect x={CX + 6} y={Y_WAIST - 4} width="12" height="14" rx="4" fill="#000000" opacity="0.12" />
            {(zone === 'arctic' || zone === 'winter') && !isRainy && (
              <g stroke="#FFFFFF" strokeWidth="1.5" opacity="0.3" fill="none">
                <line x1={CX - 22} y1={Y_SHOULDER + 14} x2={CX + 22} y2={Y_SHOULDER + 14} />
                <line x1={CX - 23} y1={Y_SHOULDER + 36} x2={CX + 23} y2={Y_SHOULDER + 36} />
                <line x1={CX - 23} y1={Y_SHOULDER + 58} x2={CX + 23} y2={Y_SHOULDER + 58} />
              </g>
            )}
            {zone === 'arctic' && !isRainy && (
              <path d={`M ${CX - 18} ${Y_SHOULDER - 6} Q ${CX} ${Y_SHOULDER + 10} ${CX + 18} ${Y_SHOULDER - 6} Q ${CX} ${Y_SHOULDER - 22} ${CX - 18} ${Y_SHOULDER - 6} Z`} fill="#FAFAF9" opacity="0.9" />
            )}
          </g>
        )}

        {/* === ВАРЕЖКИ === */}
        {cold && show.accessory && (
          <g>
            <circle cx={CX - 33} cy={Y_HIP + 24} r="8" fill={`url(#${gid('mitt')})`} />
            <circle cx={CX + 33} cy={Y_HIP + 24} r="8" fill={`url(#${gid('mitt')})`} />
            <rect x={CX - 40} y={Y_HIP + 14} width="14" height="6" rx="3" fill="#FFFFFF" opacity="0.85" />
            <rect x={CX + 26} y={Y_HIP + 14} width="14" height="6" rx="3" fill="#FFFFFF" opacity="0.85" />
          </g>
        )}

        {/* === ШАРФ === */}
        {coolish && show.accessory && (
          <g>
            <path d={`M ${CX - 18} ${Y_SHOULDER - 14} Q ${CX} ${Y_SHOULDER - 18} ${CX + 18} ${Y_SHOULDER - 14} L ${CX + 20} ${Y_SHOULDER - 2} Q ${CX} ${Y_SHOULDER + 2} ${CX - 20} ${Y_SHOULDER - 2} Z`} fill={`url(#${gid('scarf')})`} />
            <path d={isWindy
              ? `M ${CX - 12} ${Y_SHOULDER} Q ${CX - 26} ${Y_SHOULDER + 16} ${CX - 38} ${Y_SHOULDER + 20} L ${CX - 32} ${Y_SHOULDER + 30} Q ${CX - 16} ${Y_SHOULDER + 22} ${CX - 4} ${Y_SHOULDER + 2} Z`
              : `M ${CX - 12} ${Y_SHOULDER} L ${CX - 8} ${Y_SHOULDER + 30} L ${CX} ${Y_SHOULDER + 27} L ${CX - 4} ${Y_SHOULDER} Z`} fill={`url(#${gid('scarf')})`} />
          </g>
        )}

        {/* === ШЕЯ === */}
        {!coolish && <rect x={CX - 6} y={Y_HEAD + 22} width="12" height="14" rx="4" fill={`url(#${gid('skin')})`} />}

        {/* === ГОЛОВА (1/5 роста) === */}
        <g>
          <circle cx={CX} cy={Y_HEAD} r={HEAD_R} fill={`url(#${gid('face')})`} />

          {/* Брови */}
          <g stroke={P.hair.dark} strokeWidth="2.5" strokeLinecap="round" fill="none">
            <path d={`M ${CX - 16} ${Y_HEAD - 6} Q ${CX - 10} ${Y_HEAD - 10} ${CX - 4} ${Y_HEAD - 6}`} />
            <path d={`M ${CX + 4} ${Y_HEAD - 6} Q ${CX + 10} ${Y_HEAD - 10} ${CX + 16} ${Y_HEAD - 6}`} />
          </g>

          {/* Глаза: большие, аниме */}
          <ellipse cx={CX - 11} cy={Y_HEAD + 4} rx="7" ry="8" fill="#FFFFFF" />
          <ellipse cx={CX + 11} cy={Y_HEAD + 4} rx="7" ry="8" fill="#FFFFFF" />
          <circle cx={CX - 11} cy={Y_HEAD + 5} r="5" fill={ink} />
          <circle cx={CX + 11} cy={Y_HEAD + 5} r="5" fill={ink} />
          <circle cx={CX - 13} cy={Y_HEAD + 2} r="2" fill="#FFFFFF" />
          <circle cx={CX + 9} cy={Y_HEAD + 2} r="2" fill="#FFFFFF" />
          <circle cx={CX - 9} cy={Y_HEAD + 7} r="1" fill="#FFFFFF" opacity="0.7" />
          <circle cx={CX + 13} cy={Y_HEAD + 7} r="1" fill="#FFFFFF" opacity="0.7" />
          {girl && (
            <g stroke={ink} strokeWidth="1.5" strokeLinecap="round">
              <line x1={CX - 17} y1={Y_HEAD + 1} x2={CX - 20} y2={Y_HEAD - 2} />
              <line x1={CX + 17} y1={Y_HEAD + 1} x2={CX + 20} y2={Y_HEAD - 2} />
            </g>
          )}

          {/* Румянец */}
          <circle cx={CX - 18} cy={Y_HEAD + 12} r={cold ? 8 : 6} fill={`url(#${gid('blush')})`} />
          <circle cx={CX + 18} cy={Y_HEAD + 12} r={cold ? 8 : 6} fill={`url(#${gid('blush')})`} />

          {/* Нос */}
          <circle cx={CX} cy={Y_HEAD + 10} r="1.5" fill={P.skin.dark} opacity="0.5" />

          {/* Рот */}
          {hot ? (
            <path d={`M ${CX - 5} ${Y_HEAD + 16} Q ${CX} ${Y_HEAD + 24} ${CX + 5} ${Y_HEAD + 16} Z`} fill={ink} />
          ) : (
            <path d={`M ${CX - 4} ${Y_HEAD + 17} Q ${CX} ${Y_HEAD + 22} ${CX + 4} ${Y_HEAD + 17}`} fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" />
          )}

          {/* Веснушки */}
          {!girl && (
            <g fill={P.hair.dark} opacity="0.4">
              <circle cx={CX - 16} cy={Y_HEAD + 9} r="1" /><circle cx={CX - 19} cy={Y_HEAD + 12} r="1" />
              <circle cx={CX + 16} cy={Y_HEAD + 9} r="1" /><circle cx={CX + 19} cy={Y_HEAD + 12} r="1" />
            </g>
          )}

          {/* Дыхание */}
          {cold && (
            <g opacity="0.4" className="animate-float" style={{ animationDuration: '2s' }}>
              <ellipse cx={CX + 12} cy={Y_HEAD + 20} rx="5" ry="2.5" fill="#FFFFFF" />
              <ellipse cx={CX + 19} cy={Y_HEAD + 17} rx="3.5" ry="1.8" fill="#FFFFFF" />
            </g>
          )}

          {/* Волосы спереди */}
          <g fill={`url(#${gid('hair')})`}>
            {girl ? (
              <>
                <path d={`M ${CX - 32} ${Y_HEAD - 2} Q ${CX} ${Y_HEAD - 22} ${CX + 32} ${Y_HEAD - 2} Q ${CX + 35} ${Y_HEAD - 30} ${CX} ${Y_HEAD - 33} Q ${CX - 35} ${Y_HEAD - 30} ${CX - 32} ${Y_HEAD - 2} Z`} />
                <path d={`M ${CX - 26} ${Y_HEAD - 12} Q ${CX - 16} ${Y_HEAD - 4} ${CX - 8} ${Y_HEAD - 12} Q ${CX} ${Y_HEAD - 4} ${CX + 8} ${Y_HEAD - 12} Q ${CX + 16} ${Y_HEAD - 4} ${CX + 26} ${Y_HEAD - 12} L ${CX + 26} ${Y_HEAD - 22} Q ${CX} ${Y_HEAD - 28} ${CX - 24} ${Y_HEAD - 22} Z`} fill={P.hair.light} opacity="0.4" />
              </>
            ) : (
              <>
                <path d={`M ${CX - 32} ${Y_HEAD - 6} Q ${CX - 18} ${Y_HEAD - 26} ${CX} ${Y_HEAD - 20} Q ${CX + 18} ${Y_HEAD - 28} ${CX + 32} ${Y_HEAD - 10} Q ${CX + 36} ${Y_HEAD - 34} ${CX} ${Y_HEAD - 38} Q ${CX - 36} ${Y_HEAD - 34} ${CX - 32} ${Y_HEAD - 6} Z`} />
                <path d={`M ${CX - 24} ${Y_HEAD - 16} Q ${CX - 10} ${Y_HEAD - 24} ${CX + 4} ${Y_HEAD - 18} L ${CX - 2} ${Y_HEAD - 28} Q ${CX - 18} ${Y_HEAD - 30} ${CX - 26} ${Y_HEAD - 20} Z`} fill={P.hair.light} opacity="0.4" />
              </>
            )}
          </g>

          {/* Головной убор */}
          {show.headwear && (
            <g>
              {hot ? (
                <>
                  <ellipse cx={CX} cy={Y_HEAD - 22} rx="40" ry="10" fill={`url(#${gid('hat')})`} />
                  <path d={`M ${CX - 24} ${Y_HEAD - 22} Q ${CX} ${Y_HEAD - 48} ${CX + 24} ${Y_HEAD - 22} Z`} fill={`url(#${gid('hat')})`} />
                  <path d={`M ${CX - 24} ${Y_HEAD - 22} Q ${CX} ${Y_HEAD - 48} ${CX + 24} ${Y_HEAD - 22} Z`} fill={`url(#${gid('hi')})`} />
                  <rect x={CX - 24} y={Y_HEAD - 27} width="48" height="6" rx="3" fill={`url(#${gid('hat')})`} opacity="0.7" />
                </>
              ) : zone === 'warm' || zone === 'mild' ? (
                <>
                  <path d={`M ${CX - 30} ${Y_HEAD - 12} Q ${CX} ${Y_HEAD - 44} ${CX + 30} ${Y_HEAD - 12} Z`} fill={`url(#${gid('hat')})`} />
                  <path d={`M ${CX - 30} ${Y_HEAD - 12} Q ${CX} ${Y_HEAD - 44} ${CX + 30} ${Y_HEAD - 12} Z`} fill={`url(#${gid('hi')})`} />
                  <path d={`M ${CX + 4} ${Y_HEAD - 20} Q ${CX + 26} ${Y_HEAD - 24} ${CX + 38} ${Y_HEAD - 12} Q ${CX + 22} ${Y_HEAD - 6} ${CX + 6} ${Y_HEAD - 10} Z`} fill={`url(#${gid('hat')})`} opacity="0.7" />
                  <circle cx={CX} cy={Y_HEAD - 36} r="3" fill={`url(#${gid('hat')})`} opacity="0.7" />
                </>
              ) : (
                <>
                  <path d={`M ${CX - 30} ${Y_HEAD - 12} Q ${CX} ${Y_HEAD - 48} ${CX + 30} ${Y_HEAD - 12} Z`} fill={`url(#${gid('hat')})`} />
                  <path d={`M ${CX - 30} ${Y_HEAD - 12} Q ${CX} ${Y_HEAD - 48} ${CX + 30} ${Y_HEAD - 12} Z`} fill={`url(#${gid('hi')})`} />
                  <rect x={CX - 32} y={Y_HEAD - 15} width="64" height="12" rx="6" fill={`url(#${gid('hat')})`} opacity="0.7" />
                  {(zone === 'arctic' || zone === 'winter') && <circle cx={CX} cy={Y_HEAD - 42} r="9" fill="#FFFFFF" opacity="0.9" />}
                </>
              )}
            </g>
          )}

          {/* Очки */}
          {hot && show.accessory && (
            <g>
              <rect x={CX - 18} y={Y_HEAD + 1} width="15" height="10" rx="4" fill="#2C3E50" />
              <rect x={CX + 3} y={Y_HEAD + 1} width="15" height="10" rx="4" fill="#2C3E50" />
              <line x1={CX - 3} y1={Y_HEAD + 5} x2={CX + 3} y2={Y_HEAD + 5} stroke="#2C3E50" strokeWidth="2" />
              <line x1={CX - 15} y1={Y_HEAD + 3} x2={CX - 9} y2={Y_HEAD + 7} stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
              <line x1={CX + 7} y1={Y_HEAD + 3} x2={CX + 13} y2={Y_HEAD + 7} stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
            </g>
          )}
        </g>

        {/* Зонт */}
        {isRainy && show.accessory && (
          <g className="animate-float" style={{ animationDuration: '4s' }}>
            <line x1={CX + 33} y1={Y_HIP + 22} x2={CX + 33} y2={Y_HEAD - 38} stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            <path d={`M ${CX - 8} ${Y_HEAD - 18} Q ${CX + 33} ${Y_HEAD - 62} ${CX + 74} ${Y_HEAD - 18} Z`} fill="#EF4444" />
            <path d={`M ${CX - 8} ${Y_HEAD - 18} Q ${CX + 6} ${Y_HEAD - 26} ${CX + 20} ${Y_HEAD - 18} Q ${CX + 34} ${Y_HEAD - 26} ${CX + 48} ${Y_HEAD - 18} Q ${CX + 62} ${Y_HEAD - 26} ${CX + 74} ${Y_HEAD - 18}`} fill="none" stroke="#B91C1C" strokeWidth="1.5" opacity="0.5" />
          </g>
        )}
      </g>
    </svg>
  );
};
