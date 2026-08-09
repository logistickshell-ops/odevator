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
  const shortSleeve = hot || zone === 'warm'; // Исправлено: добавлена отсутствующая переменная

  // Анатомические пропорции (Обычный ребенок)
  const CX = 120; // Центр
  const CY_HEAD = 68;
  const R_HEAD = 26;
  const CY_NECK = 96;
  const CY_SHOULDER = 108;
  const CY_ELBOW = 158;
  const CY_WRIST = 218;
  const CY_WAIST = 178;
  const CY_HIP = 204;
  const CY_KNEE = 260;
  const CY_ANKLE = 324;

  // Цвета и палитры
  const ink = '#3B3148';
  const skin = { l: '#FFEADF', d: '#F4CDBA' };
  const hair = girl 
    ? { l: '#8B5A2B', d: '#5C3A1B' } 
    : { l: '#5A4A3A', d: '#362B20' };

  const P = girl
    ? {
        top: { l: '#FFD1E0', d: '#FFA5C3' },
        bottom: { l: '#E6D0F5', d: '#CAA1E0' },
        outer: { l: '#FFB8C6', d: '#E57992' },
        shoes: { l: '#FFFFFF', d: '#E8E8F0' },
        shoesD: { l: '#FFA5C3', d: '#E57992' },
        hat: { l: '#FCEA9F', d: '#F2C74D' },
        scarf: { l: '#8EE8D8', d: '#4BC4B0' },
        mitt: { l: '#FFA5C3', d: '#E57992' },
        under: { l: '#FFFFFF', d: '#DCDCE5' },
      }
    : {
        top: { l: '#C2E0FF', d: '#82B5EB' },
        bottom: { l: '#7A8BA0', d: '#516175' },
        outer: { l: '#73A5FF', d: '#4A76D4' },
        shoes: { l: '#FFFFFF', d: '#DCE0E5' },
        shoesD: { l: '#82B5EB', d: '#4A76D4' },
        hat: { l: '#7AD8D0', d: '#36A89F' },
        scarf: { l: '#FFA5C3', d: '#E57992' },
        mitt: { l: '#82B5EB', d: '#4A76D4' },
        under: { l: '#FFFFFF', d: '#DCDCE5' },
      };

  const uid = girl ? 'g' : 'b';
  const gid = (n: string) => `${uid}-${n}`;

  return (
    <svg viewBox="0 0 240 400" className="h-full w-full select-none" role="img" aria-label="Реалистичная фигура ребенка">
      <defs>
        <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor={ink} floodOpacity="0.10" />
        </filter>
        <radialGradient id={gid('blush')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={cold ? '#FF8A8A' : '#FFB5B5'} stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFB5B5" stopOpacity="0" />
        </radialGradient>

        {Object.entries({ ...P, skin, hair }).map(([k, v]) => (
          <linearGradient key={k} id={gid(k)} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={(v as any).l} />
            <stop offset="100%" stopColor={(v as any).d} />
          </linearGradient>
        ))}
      </defs>

      {/* Окружение */}
      <ellipse cx={CX} cy={CY_WAIST} rx="100" ry="110" fill={girl ? '#FFF0F5' : '#F0F5FF'} opacity="0.3" />
      <ellipse cx={CX} cy={CY_ANKLE + 20} rx="70" ry="14" fill={ink} opacity="0.10" />
      {isSnowy && (
        <g fill="#FFFFFF" opacity="0.8" className="animate-float" style={{ animationDuration: '3s' }}>
          {[20, 60, 100, 140, 180, 220].map((x, i) => (
            <circle key={x} cx={x} cy={40 + i * 40} r={i % 2 ? 2 : 3.5} />
          ))}
        </g>
      )}
      {isRainy && (
        <g stroke="#90CAF9" strokeWidth="2.5" strokeLinecap="round" opacity="0.6">
          {[30, 80, 130, 180, 215].map((x, i) => (
            <line key={x} x1={x} y1={20 + i * 30} x2={x - 6} y2={45 + i * 30} />
          ))}
        </g>
      )}

      <g className="animate-breathe">
        
        {/* СЛОЙ 1: КОЖА */}
        <ellipse cx={CX} cy={(CY_SHOULDER + CY_HIP) / 2 + 6} rx="24" ry="46" fill={`url(#${gid('skin')})`} stroke={ink} strokeWidth="2" />
        <g stroke={`url(#${gid('skin')})`} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" filter={`url(#${uid}-soft)`}>
          <path d={`M ${CX - 22} ${CY_SHOULDER + 8} L ${CX - 32} ${CY_ELBOW} L ${CX - 28} ${CY_WRIST}`} />
          <path d={`M ${CX + 22} ${CY_SHOULDER + 8} L ${CX + 32} ${CY_ELBOW} L ${CX + 28} ${CY_WRIST}`} />
        </g>
        <g stroke={`url(#${gid('skin')})`} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" filter={`url(#${uid}-soft)`}>
          <path d={`M ${CX - 14} ${CY_HIP + 6} L ${CX - 16} ${CY_KNEE} L ${CX - 16} ${CY_ANKLE}`} />
          <path d={`M ${CX + 14} ${CY_HIP + 6} L ${CX + 16} ${CY_KNEE} L ${CX + 16} ${CY_ANKLE}`} />
        </g>

        {/* СЛОЙ 2: БЕЛЬЕ */}
        {show.underwear && (
          <g filter={`url(#${uid}-soft)`} stroke={ink} strokeWidth="2" fill={`url(#${gid('under')})`}>
            <path d={`M ${CX - 16} ${CY_HIP - 4} L ${CX - 16} ${CY_HIP + 14} Q ${CX} ${CY_HIP + 20} ${CX + 16} ${CY_HIP + 14} L ${CX + 16} ${CY_HIP - 4} Z`} />
            <path d={`M ${CX - 18} ${CY_SHOULDER - 6} L ${CX - 18} ${CY_WAIST} L ${CX + 18} ${CY_WAIST} L ${CX + 18} ${CY_SHOULDER - 6} Z`} />
            <path d={`M ${CX - 10} ${CY_SHOULDER - 6} Q ${CX} ${CY_SHOULDER + 10} ${CX + 10} ${CY_SHOULDER - 6}`} fill={`url(#${gid('skin')})`} stroke="none" />
          </g>
        )}

        {/* СЛОЙ 3: НИЖНЯЯ ОДЕЖДА */}
        {show.lower && (
          <g filter={`url(#${uid}-soft)`} stroke={ink} strokeWidth="2" strokeLinejoin="round">
            {girl ? (
              <path d={`M ${CX - 18} ${CY_WAIST} L ${CX - 24} ${CY_HIP + 28} Q ${CX} ${CY_HIP + 38} ${CX + 24} ${CY_HIP + 28} L ${CX + 18} ${CY_WAIST} Z`} fill={`url(#${gid('bottom')})`} />
            ) : (hot || zone === 'warm') ? (
              <path d={`M ${CX - 18} ${CY_HIP} L ${CX - 18} ${CY_KNEE - 20} L ${CX + 18} ${CY_KNEE - 20} L ${CX + 18} ${CY_HIP} Z`} fill={`url(#${gid('bottom')})`} />
            ) : (
              <path d={`M ${CX - 18} ${CY_HIP} L ${CX - 18} ${CY_ANKLE + 10} L ${CX - 12} ${CY_ANKLE + 10} L ${CX - 12} ${CY_KNEE} L ${CX + 12} ${CY_KNEE} L ${CX + 12} ${CY_ANKLE + 10} L ${CX + 18} ${CY_ANKLE + 10} L ${CX + 18} ${CY_HIP} Z`} fill={`url(#${gid('bottom')})`} />
            )}
          </g>
        )}

        {/* СЛОЙ 4: ВЕРХНЯЯ ОДЕЖДА (Без разрывов) */}
        {show.lower && (
          <g filter={`url(#${uid}-soft)`} stroke={ink} strokeWidth="2" strokeLinejoin="round">
            {shortSleeve ? (
              <path d={`M ${CX - 24} ${CY_SHOULDER} Q ${CX - 34} ${CY_SHOULDER + 10} ${CX - 28} ${CY_ELBOW} Q ${CX - 22} ${CY_ELBOW} ${CX - 20} ${CY_WAIST} L ${CX + 20} ${CY_WAIST} Q ${CX + 22} ${CY_ELBOW} ${CX + 28} ${CY_ELBOW} Q ${CX + 34} ${CY_SHOULDER + 10} ${CX + 24} ${CY_SHOULDER} Z`} fill={`url(#${gid('top')})`} />
            ) : (
              <path d={`M ${CX - 25} ${CY_SHOULDER} Q ${CX - 40} ${CY_ELBOW - 10} ${CX - 34} ${CY_WRIST} Q ${CX - 26} ${CY_WRIST} ${CX - 22} ${CY_ELBOW} Q ${CX - 20} ${CY_WAIST} ${CX - 20} ${CY_WAIST} L ${CX + 20} ${CY_WAIST} Q ${CX + 20} ${CY_ELBOW} ${CX + 22} ${CY_ELBOW} Q ${CX + 26} ${CY_WRIST} ${CX + 34} ${CY_WRIST} Q ${CX + 40} ${CY_ELBOW - 10} ${CX + 25} ${CY_SHOULDER} Z`} fill={`url(#${gid('top')})`} />
            )}
          </g>
        )}

        {/* Худи / Пальто */}
        {show.upper && coolish && (
          <path d={`M ${CX - 27} ${CY_SHOULDER - 4} Q ${CX - 44} ${CY_ELBOW - 10} ${CX - 36} ${CY_WRIST} Q ${CX - 28} ${CY_WRIST} ${CX - 24} ${CY_ELBOW} Q ${CX - 22} ${CY_WAIST} ${CX - 22} ${CY_WAIST} L ${CX + 22} ${CY_WAIST} Q ${CX + 24} ${CY_ELBOW} ${CX + 28} ${CY_WRIST} Q ${CX + 44} ${CY_ELBOW - 10} ${CX + 27} ${CY_SHOULDER - 4} Z`} 
            fill={`url(#${gid('upper')})`} stroke={ink} strokeWidth="2" strokeLinejoin="round" filter={`url(#${uid}-soft)`} />
        )}
        {show.outer && (
          <path d={`M ${CX - 30} ${CY_SHOULDER - 6} Q ${CX - 48} ${CY_ELBOW - 12} ${CX - 40} ${CY_WRIST + 4} Q ${CX - 32} ${CY_WRIST + 4} ${CX - 26} ${CY_ELBOW} Q ${CX - 24} ${CY_HIP + 12} ${CX - 22} ${CY_HIP + 12} L ${CX + 22} ${CY_HIP + 12} Q ${CX + 24} ${CY_ELBOW} ${CX + 26} ${CY_ELBOW} Q ${CX + 32} ${CY_WRIST + 4} ${CX + 40} ${CY_WRIST + 4} Q ${CX + 48} ${CY_ELBOW - 12} ${CX + 30} ${CY_SHOULDER - 6} Z`} 
            fill={`url(#${gid('outer')})`} stroke={ink} strokeWidth="2" strokeLinejoin="round" filter={`url(#${uid}-soft)`} />
        )}

        {/* Кисти и Варежки */}
        {cold && show.accessory ? (
          <g fill={`url(#${gid('mitt')})`} stroke={ink} strokeWidth="2" filter={`url(#${uid}-soft)`}>
            <circle cx={CX - 30} cy={CY_WRIST + 10} r="12" />
            <circle cx={CX + 30} cy={CY_WRIST + 10} r="12" />
          </g>
        ) : (
          <g fill={`url(#${gid('skin')})`} stroke={ink} strokeWidth="2">
            <circle cx={CX - 28} cy={CY_WRIST + 10} r="8" />
            <circle cx={CX + 28} cy={CY_WRIST + 10} r="8" />
          </g>
        )}

        {/* Обувь */}
        {show.shoes && (
          <g fill={`url(#${gid('shoes')})`} stroke={ink} strokeWidth="2" strokeLinejoin="round" filter={`url(#${uid}-soft)`}>
            <rect x={CX - 24} y={CY_ANKLE + 2} width="16" height="24" rx="8" />
            <rect x={CX + 8} y={CY_ANKLE + 2} width="16" height="24" rx="8" />
            <path d={`M ${CX - 26} ${CY_ANKLE + 18} L ${CX - 6} ${CY_ANKLE + 18} L ${CX - 6} ${CY_ANKLE + 24} L ${CX - 26} ${CY_ANKLE + 24} Z`} fill={`url(#${gid('shoesD')})`} />
            <path d={`M ${CX + 6} ${CY_ANKLE + 18} L ${CX + 26} ${CY_ANKLE + 18} L ${CX + 26} ${CY_ANKLE + 24} L ${CX + 6} ${CY_ANKLE + 24} Z`} fill={`url(#${gid('shoesD')})`} />
          </g>
        )}

        {/* Шарф */}
        {coolish && show.accessory && (
          <g filter={`url(#${uid}-soft)`} stroke={ink} strokeWidth="2" fill={`url(#${gid('scarf')})`}>
            <rect x={CX - 18} y={CY_NECK - 8} width="36" height="16" rx="6" />
            <path d={isWindy
              ? `M ${CX - 14} ${CY_NECK} Q ${CX - 34} ${CY_NECK + 30} ${CX - 48} ${CY_NECK + 40} L ${CX - 40} ${CY_NECK + 50} Q ${CX - 26} ${CY_NECK + 40} ${CX - 8} ${CY_NECK + 6}`
              : `M ${CX - 12} ${CY_NECK} L ${CX - 8} ${CY_NECK + 44} L ${CX} ${CY_NECK + 40} L ${CX - 4} ${CY_NECK}`} 
            />
          </g>
        )}

        {/* СЛОЙ 5: ГОЛОВА И ЛИЦО */}
        <g filter={`url(#${uid}-soft)`}>
          {girl && (
            <path d={`M ${CX + 26} ${CY_HEAD - 8} Q ${CX + 50} ${CY_HEAD - 18} ${CX + 45} ${CY_HEAD + 20} Q ${CX + 40} ${CY_HEAD + 36} ${CX + 28} ${CY_HEAD + 24} Z`} fill={`url(#${gid('hair')})`} stroke={ink} strokeWidth="2" />
          )}
          <circle cx={CX} cy={CY_HEAD} r={R_HEAD} fill={`url(#${gid('skin')})`} stroke={ink} strokeWidth="2.5" />
          
          <g stroke={hair.d} strokeWidth="2.5" strokeLinecap="round" fill="none">
            <path d={`M ${CX - 18} ${CY_HEAD - 4} Q ${CX - 13} ${CY_HEAD - 7} ${CX - 8} ${CY_HEAD - 4}`} />
            <path d={`M ${CX + 8} ${CY_HEAD - 4} Q ${CX + 13} ${CY_HEAD - 7} ${CX + 18} ${CY_HEAD - 4}`} />
          </g>

          <g>
            <ellipse cx={CX - 10} cy={CY_HEAD + 4} rx="5.5" ry="6.5" fill="#FFFFFF" stroke={ink} strokeWidth="1.5" />
            <ellipse cx={CX + 10} cy={CY_HEAD + 4} rx="5.5" ry="6.5" fill="#FFFFFF" stroke={ink} strokeWidth="1.5" />
            <circle cx={CX - 10} cy={CY_HEAD + 5} r="3.5" fill={ink} />
            <circle cx={CX + 10} cy={CY_HEAD + 5} r="3.5" fill={ink} />
            <circle cx={CX - 11.5} cy={CY_HEAD + 3} r="1.2" fill="#FFFFFF" />
            <circle cx={CX + 8.5} cy={CY_HEAD + 3} r="1.2" fill="#FFFFFF" />
            {girl && (
              <g stroke={ink} strokeWidth="1.5" strokeLinecap="round">
                <line x1={CX - 15} y1={CY_HEAD + 1} x2={CX - 18} y2={CY_HEAD - 1} />
                <line x1={CX + 15} y1={CY_HEAD + 1} x2={CX + 18} y2={CY_HEAD - 1} />
              </g>
            )}
          </g>

          <circle cx={CX - 20} cy={CY_HEAD + 14} r={cold ? 8 : 6} fill={`url(#${gid('blush')})`} />
          <circle cx={CX + 20} cy={CY_HEAD + 14} r={cold ? 8 : 6} fill={`url(#${gid('blush')})`} />
          <path d={`M ${CX - 2} ${CY_HEAD + 12} Q ${CX} ${CY_HEAD + 15} ${CX + 2} ${CY_HEAD + 12}`} fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" />
          
          {hot ? (
            <path d={`M ${CX - 6} ${CY_HEAD + 20} Q ${CX} ${CY_HEAD + 28} ${CX + 6} ${CY_HEAD + 20} Z`} fill={ink} />
          ) : (
            <path d={`M ${CX - 6} ${CY_HEAD + 21} Q ${CX} ${CY_HEAD + 26} ${CX + 6} ${CY_HEAD + 21}`} fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
          )}

          {/* Волосы */}
          <g fill={`url(#${gid('hair')})`} stroke={ink} strokeWidth="2" strokeLinejoin="round">
            {girl ? (
              <>
                <path d={`M ${CX - 30} ${CY_HEAD - 6} Q ${CX - 15} ${CY_HEAD - 22} ${CX} ${CY_HEAD - 16} Q ${CX + 20} ${CY_HEAD - 26} ${CX + 30} ${CY_HEAD - 10} Q ${CX + 26} ${CY_HEAD - 34} ${CX} ${CY_HEAD - 36} Q ${CX - 26} ${CY_HEAD - 34} ${CX - 30} ${CY_HEAD - 6} Z`} />
                <path d={`M ${CX - 24} ${CY_HEAD - 10} L ${CX - 16} ${CY_HEAD + 6} Q ${CX - 10} ${CY_HEAD + 10} ${CX - 4} ${CY_HEAD} L ${CX - 4} ${CY_HEAD - 14} Z`} />
                <path d={`M ${CX + 24} ${CY_HEAD - 10} L ${CX + 16} ${CY_HEAD + 6} Q ${CX + 10} ${CY_HEAD + 10} ${CX + 4} ${CY_HEAD} L ${CX + 4} ${CY_HEAD - 14} Z`} />
              </>
            ) : (
              <>
                <path d={`M ${CX - 30} ${CY_HEAD - 8} Q ${CX - 15} ${CY_HEAD - 34} ${CX} ${CY_HEAD - 26} Q ${CX + 20} ${CY_HEAD - 36} ${CX + 30} ${CY_HEAD - 10} Q ${CX + 34} ${CY_HEAD - 32} ${CX} ${CY_HEAD - 40} Q ${CX - 34} ${CY_HEAD - 32} ${CX - 30} ${CY_HEAD - 8} Z`} />
                <path d={`M ${CX - 20} ${CY_HEAD - 16} Q ${CX - 12} ${CY_HEAD - 26} ${CX - 2} ${CY_HEAD - 18} Q ${CX - 2} ${CY_HEAD - 36} ${CX - 26} ${CY_HEAD - 26} Z`} />
                <path d={`M ${CX + 2} ${CY_HEAD - 16} Q ${CX + 12} ${CY_HEAD - 32} ${CX + 24} ${CY_HEAD - 24} Q ${CX + 12} ${CY_HEAD - 34} ${CX + 4} ${CY_HEAD - 26} Z`} />
              </>
            )}
          </g>

          {/* Головные уборы */}
          {show.headwear && (
            <g filter={`url(#${uid}-soft)`} stroke={ink} strokeWidth="2">
              {hot ? (
                <>
                  <ellipse cx={CX} cy={CY_HEAD - 24} rx="38" ry="10" fill={`url(#${gid('hat')})`} />
                  <path d={`M ${CX - 26} ${CY_HEAD - 24} Q ${CX} ${CY_HEAD - 54} ${CX + 26} ${CY_HEAD - 24} Z`} fill={`url(#${gid('hat')})`} />
                </>
              ) : cold ? (
                <>
                  <path d={`M ${CX - 30} ${CY_HEAD - 12} Q ${CX} ${CY_HEAD - 52} ${CX + 30} ${CY_HEAD - 12} Z`} fill={`url(#${gid('hat')})`} />
                  <rect x={CX - 32} y={CY_HEAD - 14} width="64" height="12" rx="6" fill={`url(#${gid('hatD')})`} />
                  {(zone === 'arctic' || zone === 'winter') && <circle cx={CX} cy={CY_HEAD - 44} r="8" fill="#FFFFFF" />}
                </>
              ) : (
                <>
                  <path d={`M ${CX - 32} ${CY_HEAD - 12} Q ${CX} ${CY_HEAD - 46} ${CX + 32} ${CY_HEAD - 12} Z`} fill={`url(#${gid('hat')})`} />
                  <path d={`M ${CX + 4} ${CY_HEAD - 18} Q ${CX + 28} ${CY_HEAD - 22} ${CX + 38} ${CY_HEAD - 8} Q ${CX + 24} ${CY_HEAD - 4} ${CX + 4} ${CY_HEAD - 10} Z`} fill={`url(#${gid('hatD')})`} />
                </>
              )}
            </g>
          )}

          {hot && show.accessory && (
            <g>
              <rect x={CX - 22} y={CY_HEAD - 2} width="18" height="12" rx="4" fill="none" stroke="#0F172A" strokeWidth="2.5" />
              <rect x={CX + 4} y={CY_HEAD - 2} width="18" height="12" rx="4" fill="none" stroke="#0F172A" strokeWidth="2.5" />
              <line x1={CX - 4} y1={CY_HEAD + 4} x2={CX + 4} y2={CY_HEAD + 4} stroke="#0F172A" strokeWidth="2.5" />
            </g>
          )}
        </g>
      </g>
    </svg>
  );
};
