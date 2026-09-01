import React from 'react';
import { ChildGender, LayerVisibility } from '../types';
import { zoneFromTemp } from '../utils/weatherEngine';

interface ChildFigureProps {
  gender: ChildGender;
  effectiveTemp: number;
  isRainy: boolean;
  isSnowy: boolean;
  isWindy: boolean;
  show: LayerVisibility;
}

export const ChildFigure: React.FC<ChildFigureProps> = ({
  gender, effectiveTemp, isRainy, isSnowy, isWindy, show,
}) => {
  const girl = gender === 'girl';
  const zone = zoneFromTemp(effectiveTemp);
  const cold = ['arctic', 'winter', 'freeze'].includes(zone);
  const coolish = cold || ['chilly', 'cool'].includes(zone);
  const hot = zone === 'hot';

  const CX = 120, Y_HEAD = 74, Y_SHOULDER = 126, Y_WAIST = 204, Y_ANKLE = 332;

  // Палитры с градиентами (свет сверху → тень снизу)
  const P = girl
    ? {
        top: { l: '#FFB3D1', d: '#F47FAE' },
        upper: { l: '#C9A8F5', d: '#9B73E0' },
        outer: { l: '#FF9EC4', d: '#E85FA0' },
        bottom: { l: '#B9A0E8', d: '#8E72CC' },
        shoes: { l: '#FFFFFF', d: '#E8D5F0' },
        shoesD: { l: '#FFB3D1', d: '#F47FAE' },
        hat: { l: '#FFE08A', d: '#F5B942' },
        hatD: { l: '#F5C95A', d: '#E0A020' },
        scarf: { l: '#7FE8D8', d: '#3FC9B5' },
        mitt: { l: '#FF9EAE', d: '#F06078' },
        under: { l: '#FFFFFF', d: '#EDEDF5' },
      }
    : {
        top: { l: '#7FE8D8', d: '#3FC9B5' },
        upper: { l: '#8FB8FF', d: '#5B8DEF' },
        outer: { l: '#6C8CFF', d: '#3E63DD' },
        bottom: { l: '#7A8BA0', d: '#52617A' },
        shoes: { l: '#FFFFFF', d: '#DCE8F5' },
        shoesD: { l: '#8FB8FF', d: '#5B8DEF' },
        hat: { l: '#5FD8C5', d: '#2A9D8F' },
        hatD: { l: '#3FBBA8', d: '#1F7A6E' },
        scarf: { l: '#FF9EAE', d: '#F06078' },
        mitt: { l: '#8FB8FF', d: '#5B8DEF' },
        under: { l: '#FFFFFF', d: '#EDEDF5' },
      };

  const skin = { l: '#FFE4D0', d: '#F2B896' };
  const hair = girl ? { l: '#9A6238', d: '#6B3F22' } : { l: '#5A4436', d: '#33241A' };
  const ink = '#3B3148';

  const shortSleeve = hot || zone === 'warm';
  const drawSkirt = girl && !cold && zone !== 'chilly';
  const drawShorts = !girl && (hot || zone === 'warm');

  const uid = girl ? 'g' : 'b';
  const gid = (n: string) => `${uid}-${n}`;

  // Кривые для рук и ног (анатомические, не прямоугольники)
  const armL = `M ${CX - 26} ${Y_SHOULDER + 8} Q ${CX - 44} ${Y_SHOULDER + 18} ${CX - 48} ${Y_SHOULDER + 52} Q ${CX - 50} ${Y_SHOULDER + 78} ${CX - 50} ${Y_SHOULDER + 92}`;
  const armR = `M ${CX + 26} ${Y_SHOULDER + 8} Q ${CX + 44} ${Y_SHOULDER + 18} ${CX + 48} ${Y_SHOULDER + 52} Q ${CX + 50} ${Y_SHOULDER + 78} ${CX + 50} ${Y_SHOULDER + 92}`;
  const legL = `M ${CX - 14} ${Y_WAIST + 16} L ${CX - 18} ${Y_ANKLE}`;
  const legR = `M ${CX + 14} ${Y_WAIST + 16} L ${CX + 18} ${Y_ANKLE}`;

  return (
    <svg viewBox="0 0 240 400" className="h-full w-full select-none" role="img" aria-label="Иллюстрация ребёнка по погоде">
      <defs>
        <filter id={`${uid}-soft`} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#3B3148" floodOpacity="0.16" />
        </filter>
        <radialGradient id={gid('aura')} cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="70%" stopColor={girl ? '#FFE1EC' : '#DCEBFF'} stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={gid('blush')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={cold ? '#F87171' : '#FF9E9E'} stopOpacity="0.75" />
          <stop offset="100%" stopColor="#FF9E9E" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={gid('ground')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B3148" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#3B3148" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={gid('hi')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Градиенты для каждой детали */}
        {Object.entries({ ...P, skin, hair }).map(([k, v]) => (
          <linearGradient key={k} id={gid(k)} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={(v as any).l} />
            <stop offset="100%" stopColor={(v as any).d} />
          </linearGradient>
        ))}
      </defs>

      {/* Фон */}
      <ellipse cx={CX} cy={190} rx="112" ry="150" fill={`url(#${gid('aura')})`} />
      <ellipse cx={CX} cy={Y_ANKLE + 30} rx="70" ry="12" fill={`url(#${gid('ground')})`} />

      {/* Погода */}
      {isSnowy && (
        <g fill="#FFFFFF" opacity="0.9" className="animate-float" style={{ animationDuration: '3s' }}>
          {[30, 70, 110, 150, 190, 220].map((x, i) => (
            <circle key={x} cx={x} cy={40 + i * 50} r={i % 2 ? 2.5 : 3.5} />
          ))}
        </g>
      )}
      {isRainy && (
        <g stroke="#7FB3E8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7">
          {[30, 75, 120, 165, 210].map((x, i) => (
            <line key={x} x1={x} y1={30 + i * 20} x2={x - 6} y2={50 + i * 20} />
          ))}
        </g>
      )}

      <g className="animate-breathe">
        {/* Волосы сзади (девочка) */}
        {girl && (
          <g fill={`url(#${gid('hair')})`} filter={`url(#${uid}-soft)`}>
            <circle cx={CX - 40} cy={Y_HEAD + 8} r="13" />
            <circle cx={CX + 40} cy={Y_HEAD + 8} r="13" />
            <circle cx={CX - 40} cy={Y_HEAD + 22} r="9" />
            <circle cx={CX + 40} cy={Y_HEAD + 22} r="9" />
            <circle cx={CX - 38} cy={Y_HEAD - 2} r="4" fill={`url(#${gid('hat')})`} />
            <circle cx={CX + 38} cy={Y_HEAD - 2} r="4" fill={`url(#${gid('hat')})`} />
          </g>
        )}

        {/* Ноги (кожа) — кривые, не прямоугольники */}
        <g stroke={`url(#${gid('skin')})`} strokeWidth="16" strokeLinecap="round" fill="none" filter={`url(#${uid}-soft)`}>
          <path d={legL} />
          <path d={legR} />
        </g>

        {/* Слой 1: бельё (низ) */}
        {show.underwear && (
          <g filter={`url(#${uid}-soft)`}>
            <rect x={CX - 22} y={Y_WAIST - 6} width="44" height="26" rx="10" fill={`url(#${gid('under')})`} />
            {cold && (
              <>
                <line x1={CX - 14} y1={Y_WAIST} x2={CX - 14} y2={Y_WAIST + 16} stroke="#C9C9DE" strokeWidth="2" strokeDasharray="3,3" />
                <line x1={CX + 14} y1={Y_WAIST} x2={CX + 14} y2={Y_WAIST + 16} stroke="#C9C9DE" strokeWidth="2" strokeDasharray="3,3" />
              </>
            )}
          </g>
        )}

        {/* Слой 2: нижний (низ) */}
        {show.lower && (
          <g filter={`url(#${uid}-soft)`}>
            {drawSkirt ? (
              <>
                <path d={`M ${CX - 22} ${Y_WAIST - 8} L ${CX + 22} ${Y_WAIST - 8} L ${CX + 44} ${Y_WAIST + 58} Q ${CX} ${Y_WAIST + 72} ${CX - 44} ${Y_WAIST + 58} Z`} fill={`url(#${gid('bottom')})`} />
                <path d={`M ${CX - 22} ${Y_WAIST - 8} L ${CX + 22} ${Y_WAIST - 8} L ${CX + 44} ${Y_WAIST + 58} Q ${CX} ${Y_WAIST + 72} ${CX - 44} ${Y_WAIST + 58} Z`} fill={`url(#${gid('hi')})`} />
                {[-30, -15, 0, 15, 30].map((dx) => (
                  <line key={dx} x1={CX + dx * 0.55} y1={Y_WAIST - 4} x2={CX + dx} y2={Y_WAIST + 56} stroke="#00000022" strokeWidth="2" />
                ))}
              </>
            ) : drawShorts ? (
              <>
                <rect x={CX - 24} y={Y_WAIST - 8} width="48" height="28" rx="10" fill={`url(#${gid('bottom')})`} />
                <path d={`M ${CX - 15} ${Y_WAIST + 8} L ${CX - 19} ${Y_WAIST + 46}`} stroke={`url(#${gid('bottom')})`} strokeWidth="26" strokeLinecap="round" />
                <path d={`M ${CX + 15} ${Y_WAIST + 8} L ${CX + 19} ${Y_WAIST + 46}`} stroke={`url(#${gid('bottom')})`} strokeWidth="26" strokeLinecap="round" />
              </>
            ) : (
              <>
                <rect x={CX - 24} y={Y_WAIST - 8} width="48" height="28" rx="10" fill={`url(#${gid('bottom')})`} />
                <path d={legL} stroke={`url(#${gid('bottom')})`} strokeWidth="24" strokeLinecap="round" />
                <path d={legR} stroke={`url(#${gid('bottom')})`} strokeWidth="24" strokeLinecap="round" />
                <path d={`M ${CX - 26} ${Y_ANKLE - 46} Q ${CX - 19} ${Y_ANKLE - 40} ${CX - 12} ${Y_ANKLE - 46}`} fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
                <path d={`M ${CX + 12} ${Y_ANKLE - 46} Q ${CX + 19} ${Y_ANKLE - 40} ${CX + 26} ${Y_ANKLE - 46}`} fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
              </>
            )}
          </g>
        )}

        {/* Слой 6: обувь */}
        {show.shoes ? (
          <g filter={`url(#${uid}-soft)`}>
            {cold ? (
              <>
                <rect x={CX - 33} y={Y_ANKLE - 14} width="27" height="38" rx="12" fill={`url(#${gid('shoesD')})`} />
                <rect x={CX + 6} y={Y_ANKLE - 14} width="27" height="38" rx="12" fill={`url(#${gid('shoesD')})`} />
                <ellipse cx={CX - 19.5} cy={Y_ANKLE - 12} rx="14" ry="6" fill="#FFFFFF" opacity="0.9" />
                <ellipse cx={CX + 19.5} cy={Y_ANKLE - 12} rx="14" ry="6" fill="#FFFFFF" opacity="0.9" />
                <rect x={CX - 35} y={Y_ANKLE + 20} width="31" height="8" rx="4" fill="#3B3148" opacity="0.75" />
                <rect x={CX + 4} y={Y_ANKLE + 20} width="31" height="8" rx="4" fill="#3B3148" opacity="0.75" />
              </>
            ) : hot ? (
              <>
                <path d={`M ${CX - 30} ${Y_ANKLE + 22} L ${CX - 8} ${Y_ANKLE + 22}`} stroke={`url(#${gid('shoesD')})`} strokeWidth="7" strokeLinecap="round" />
                <path d={`M ${CX - 25} ${Y_ANKLE + 8} L ${CX - 15} ${Y_ANKLE + 20}`} stroke={`url(#${gid('shoesD')})`} strokeWidth="4" strokeLinecap="round" />
                <path d={`M ${CX + 8} ${Y_ANKLE + 22} L ${CX + 30} ${Y_ANKLE + 22}`} stroke={`url(#${gid('shoesD')})`} strokeWidth="7" strokeLinecap="round" />
                <path d={`M ${CX + 15} ${Y_ANKLE + 8} L ${CX + 25} ${Y_ANKLE + 20}`} stroke={`url(#${gid('shoesD')})`} strokeWidth="4" strokeLinecap="round" />
              </>
            ) : (
              <>
                <rect x={CX - 31} y={Y_ANKLE + 4} width="25" height="20" rx="10" fill={`url(#${gid('shoes')})`} />
                <rect x={CX + 6} y={Y_ANKLE + 4} width="25" height="20" rx="10" fill={`url(#${gid('shoes')})`} />
                <rect x={CX - 33} y={Y_ANKLE + 20} width="29" height="7" rx="3.5" fill={`url(#${gid('shoesD')})`} />
                <rect x={CX + 4} y={Y_ANKLE + 20} width="29" height="7" rx="3.5" fill={`url(#${gid('shoesD')})`} />
                <line x1={CX - 26} y1={Y_ANKLE + 10} x2={CX - 14} y2={Y_ANKLE + 10} stroke={`url(#${gid('shoesD')})`} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                <line x1={CX + 12} y1={Y_ANKLE + 10} x2={CX + 24} y2={Y_ANKLE + 10} stroke={`url(#${gid('shoesD')})`} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              </>
            )}
          </g>
        ) : (
          <g fill={`url(#${gid('under')})`}>
            <ellipse cx={CX - 18} cy={Y_ANKLE + 14} rx="12" ry="8" />
            <ellipse cx={CX + 18} cy={Y_ANKLE + 14} rx="12" ry="8" />
          </g>
        )}

        {/* Торс (кожа) */}
        <rect x={CX - 22} y={Y_SHOULDER} width="44" height="82" rx="20" fill={`url(#${gid('skin')})`} />

        {/* Руки (кожа) — кривые Безье, не прямоугольники */}
        <g stroke={`url(#${gid('skin')})`} strokeWidth="13" strokeLinecap="round" fill="none" filter={`url(#${uid}-soft)`}>
          <path d={armL} />
          <path d={armR} />
        </g>

        {/* Слой 1: бельё (верх) */}
        {show.underwear && (
          <g filter={`url(#${uid}-soft)`}>
            <rect x={CX - 24} y={Y_SHOULDER - 4} width="48" height="88" rx="18" fill={`url(#${gid('under')})`} />
            <path d={`M ${CX - 12} ${Y_SHOULDER - 4} Q ${CX} ${Y_SHOULDER + 14} ${CX + 12} ${Y_SHOULDER - 4}`} fill={`url(#${gid('skin')})`} />
            {cold ? (
              <>
                <path d={armL} stroke={`url(#${gid('under')})`} strokeWidth="17" strokeLinecap="round" fill="none" />
                <path d={armR} stroke={`url(#${gid('under')})`} strokeWidth="17" strokeLinecap="round" fill="none" />
                <line x1={CX - 10} y1={Y_SHOULDER + 20} x2={CX - 10} y2={Y_WAIST + 60} stroke="#C9C9DE" strokeWidth="2" strokeDasharray="3,3" />
                <line x1={CX + 10} y1={Y_SHOULDER + 20} x2={CX + 10} y2={Y_WAIST + 60} stroke="#C9C9DE" strokeWidth="2" strokeDasharray="3,3" />
              </>
            ) : (
              <>
                <line x1={CX - 16} y1={Y_SHOULDER - 4} x2={CX - 13} y2={Y_SHOULDER + 6} stroke={`url(#${gid('under')})`} strokeWidth="5" strokeLinecap="round" />
                <line x1={CX + 16} y1={Y_SHOULDER - 4} x2={CX + 13} y2={Y_SHOULDER + 6} stroke={`url(#${gid('under')})`} strokeWidth="5" strokeLinecap="round" />
              </>
            )}
          </g>
        )}

        {/* Слой 2: нижний (верх) */}
        {show.lower && (
          <g filter={`url(#${uid}-soft)`}>
            {shortSleeve ? (
              <>
                <path d={`M ${CX - 25} ${Y_SHOULDER + 8} Q ${CX - 36} ${Y_SHOULDER + 18} ${CX - 40} ${Y_SHOULDER + 34}`} stroke={`url(#${gid('top')})`} strokeWidth="20" strokeLinecap="round" fill="none" />
                <path d={`M ${CX + 25} ${Y_SHOULDER + 8} Q ${CX + 36} ${Y_SHOULDER + 18} ${CX + 40} ${Y_SHOULDER + 34}`} stroke={`url(#${gid('top')})`} strokeWidth="20" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                <path d={armL} stroke={`url(#${gid('top')})`} strokeWidth="20" strokeLinecap="round" fill="none" />
                <path d={armR} stroke={`url(#${gid('top')})`} strokeWidth="20" strokeLinecap="round" fill="none" />
              </>
            )}
            <rect x={CX - 25} y={Y_SHOULDER - 5} width="50" height="90" rx="20" fill={`url(#${gid('top')})`} />
            <rect x={CX - 25} y={Y_SHOULDER - 5} width="50" height="90" rx="20" fill={`url(#${gid('hi')})`} />
            <path d={`M ${CX - 12} ${Y_SHOULDER - 5} Q ${CX} ${Y_SHOULDER + 13} ${CX + 12} ${Y_SHOULDER - 5}`} fill={show.underwear ? `url(#${gid('under')})` : `url(#${gid('skin')})`} />
            <circle cx={CX} cy={Y_SHOULDER + 34} r="7" fill="#FFFFFF" opacity="0.35" />
          </g>
        )}

        {/* Слой 3: верхний (худи) */}
        {show.upper && (
          <g filter={`url(#${uid}-soft)`}>
            <path d={armL} stroke={`url(#${gid('upper')})`} strokeWidth="26" strokeLinecap="round" fill="none" />
            <path d={armR} stroke={`url(#${gid('upper')})`} strokeWidth="26" strokeLinecap="round" fill="none" />
            <rect x={CX - 28} y={Y_SHOULDER - 8} width="56" height="96" rx="24" fill={`url(#${gid('upper')})`} />
            <rect x={CX - 28} y={Y_SHOULDER - 8} width="56" height="96" rx="24" fill={`url(#${gid('hi')})`} />
            <path d={`M ${CX - 15} ${Y_SHOULDER - 8} Q ${CX} ${Y_SHOULDER + 16} ${CX + 15} ${Y_SHOULDER - 8}`} fill={`url(#${gid('top')})`} />
            <path d={`M ${CX - 18} ${Y_WAIST - 12} L ${CX + 18} ${Y_WAIST - 12} L ${CX + 24} ${Y_WAIST + 12} L ${CX - 24} ${Y_WAIST + 12} Z`} fill="#FFFFFF" opacity="0.16" />
            <rect x={CX - 26} y={Y_WAIST + 16} width="52" height="6" rx="3" fill="#000000" opacity="0.12" />
            <line x1={CX - 6} y1={Y_SHOULDER + 8} x2={CX - 6} y2={Y_SHOULDER + 26} stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
            <line x1={CX + 6} y1={Y_SHOULDER + 8} x2={CX + 6} y2={Y_SHOULDER + 26} stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
          </g>
        )}

        {/* Слой 4: верхняя одежда */}
        {show.outer && (
          <g filter={`url(#${uid}-soft)`}>
            <path d={armL} stroke={`url(#${gid('outer')})`} strokeWidth="32" strokeLinecap="round" fill="none" />
            <path d={armR} stroke={`url(#${gid('outer')})`} strokeWidth="32" strokeLinecap="round" fill="none" />
            <rect x={CX - 32} y={Y_SHOULDER - 10} width="64" height="106" rx="28" fill={`url(#${gid('outer')})`} />
            <rect x={CX - 32} y={Y_SHOULDER - 10} width="64" height="106" rx="28" fill={`url(#${gid('hi')})`} />
            <line x1={CX} y1={Y_SHOULDER - 8} x2={CX} y2={Y_WAIST + 26} stroke={`url(#${gid('hatD')})`} strokeWidth="3.5" strokeLinecap="round" />
            <circle cx={CX} cy={Y_SHOULDER + 2} r="3" fill={`url(#${gid('hatD')})`} />
            <rect x={CX - 26} y={Y_WAIST - 4} width="15" height="17" rx="5" fill={`url(#${gid('hatD')})`} opacity="0.5" />
            <rect x={CX + 11} y={Y_WAIST - 4} width="15" height="17" rx="5" fill={`url(#${gid('hatD')})`} opacity="0.5" />
            {(zone === 'arctic' || zone === 'winter') && !isRainy && (
              <g stroke={`url(#${gid('hatD')})`} strokeWidth="2" opacity="0.4" fill="none" strokeLinecap="round">
                <line x1={CX - 30} y1={Y_SHOULDER + 16} x2={CX + 30} y2={Y_SHOULDER + 16} />
                <line x1={CX - 31} y1={Y_SHOULDER + 42} x2={CX + 31} y2={Y_SHOULDER + 42} />
                <line x1={CX - 31} y1={Y_SHOULDER + 68} x2={CX + 31} y2={Y_SHOULDER + 68} />
              </g>
            )}
            {isRainy && !coolish && (
              <path d={`M ${CX - 24} ${Y_SHOULDER} Q ${CX - 14} ${Y_SHOULDER + 24} ${CX - 24} ${Y_SHOULDER + 62}`} fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
            )}
            {zone === 'arctic' && !isRainy && (
              <path d={`M ${CX - 25} ${Y_SHOULDER - 10} Q ${CX} ${Y_SHOULDER + 10} ${CX + 25} ${Y_SHOULDER - 10} Q ${CX} ${Y_SHOULDER - 30} ${CX - 25} ${Y_SHOULDER - 10} Z`} fill="#FAFAF9" />
            )}
          </g>
        )}

        {/* Варежки / кисти */}
        {cold && show.accessory ? (
          <g filter={`url(#${uid}-soft)`}>
            <circle cx={CX - 50} cy={Y_SHOULDER + 95} r="12" fill={`url(#${gid('mitt')})`} />
            <circle cx={CX + 50} cy={Y_SHOULDER + 95} r="12" fill={`url(#${gid('mitt')})`} />
            <rect x={CX - 58} y={Y_SHOULDER + 80} width="16" height="7" rx="3.5" fill="#FFFFFF" opacity="0.9" />
            <rect x={CX + 42} y={Y_SHOULDER + 80} width="16" height="7" rx="3.5" fill="#FFFFFF" opacity="0.9" />
          </g>
        ) : (
          <g fill={`url(#${gid('skin')})`}>
            <circle cx={CX - 50} cy={Y_SHOULDER + 95} r="8" />
            <circle cx={CX + 50} cy={Y_SHOULDER + 95} r="8" />
          </g>
        )}

        {/* Шарф */}
        {coolish && show.accessory && (
          <g filter={`url(#${uid}-soft)`}>
            <rect x={CX - 22} y={Y_SHOULDER - 18} width="44" height="17" rx="8" fill={`url(#${gid('scarf')})`} />
            <path d={isWindy
              ? `M ${CX - 14} ${Y_SHOULDER} Q ${CX - 30} ${Y_SHOULDER + 20} ${CX - 44} ${Y_SHOULDER + 26} L ${CX - 38} ${Y_SHOULDER + 36} Q ${CX - 20} ${Y_SHOULDER + 28} ${CX - 4} ${Y_SHOULDER + 2} Z`
              : `M ${CX - 15} ${Y_SHOULDER} L ${CX - 10} ${Y_SHOULDER + 36} L ${CX} ${Y_SHOULDER + 33} L ${CX - 5} ${Y_SHOULDER} Z`} fill={`url(#${gid('scarf')})`} />
            <line x1={CX - 38} y1={Y_SHOULDER + 34} x2={CX - 44} y2={Y_SHOULDER + 26} stroke={`url(#${gid('scarf')})`} strokeWidth="4" strokeDasharray="2,2" />
          </g>
        )}

        {/* Шея — ВСЕГДА (фикс «отлетающей головы»), удлинена до торса */}
        <rect x={CX - 8} y={Y_HEAD + 25} width="16" height="28" fill={`url(#${gid('skin')})`} />

        {/* Голова */}
        <g filter={`url(#${uid}-soft)`}>
          <circle cx={CX} cy={Y_HEAD} r="35" fill={`url(#${gid('skin')})`} />
          <path d={`M ${CX - 35} ${Y_HEAD} A 35 35 0 0 0 ${CX + 35} ${Y_HEAD} A 60 60 0 0 1 ${CX - 35} ${Y_HEAD} Z`} fill="#000000" opacity="0.06" />

          {/* Брови */}
          <g stroke={hair.d} strokeWidth="2.5" strokeLinecap="round" fill="none">
            <path d={`M ${CX - 17} ${Y_HEAD - 4} Q ${CX - 12} ${Y_HEAD - 7} ${CX - 7} ${Y_HEAD - 4}`} />
            <path d={`M ${CX + 7} ${Y_HEAD - 4} Q ${CX + 12} ${Y_HEAD - 7} ${CX + 17} ${Y_HEAD - 4}`} />
          </g>

          {/* Глаза: белок + радужка + блики */}
          <ellipse cx={CX - 12} cy={Y_HEAD + 5} rx="6" ry="6.5" fill="#FFFFFF" />
          <ellipse cx={CX + 12} cy={Y_HEAD + 5} rx="6" ry="6.5" fill="#FFFFFF" />
          <circle cx={CX - 12} cy={Y_HEAD + 6} r="4.2" fill={ink} />
          <circle cx={CX + 12} cy={Y_HEAD + 6} r="4.2" fill={ink} />
          <circle cx={CX - 13.5} cy={Y_HEAD + 4} r="1.7" fill="#FFFFFF" />
          <circle cx={CX + 10.5} cy={Y_HEAD + 4} r="1.7" fill="#FFFFFF" />
          <circle cx={CX - 10} cy={Y_HEAD + 8} r="0.8" fill="#FFFFFF" opacity="0.8" />
          <circle cx={CX + 14} cy={Y_HEAD + 8} r="0.8" fill="#FFFFFF" opacity="0.8" />
          {girl && (
            <g stroke={ink} strokeWidth="1.6" strokeLinecap="round">
              <line x1={CX - 17} y1={Y_HEAD + 2} x2={CX - 20} y2={Y_HEAD} />
              <line x1={CX + 17} y1={Y_HEAD + 2} x2={CX + 20} y2={Y_HEAD} />
            </g>
          )}

          {/* Румянец */}
          <circle cx={CX - 20} cy={Y_HEAD + 13} r={cold ? 9 : 7} fill={`url(#${gid('blush')})`} />
          <circle cx={CX + 20} cy={Y_HEAD + 13} r={cold ? 9 : 7} fill={`url(#${gid('blush')})`} />

          {/* Нос */}
          <circle cx={CX} cy={Y_HEAD + 12} r="2" fill="#000000" opacity="0.12" />

          {/* Рот */}
          {hot ? (
            <path d={`M ${CX - 7} ${Y_HEAD + 19} Q ${CX} ${Y_HEAD + 30} ${CX + 7} ${Y_HEAD + 19} Z`} fill={ink} />
          ) : (
            <path d={`M ${CX - 6} ${Y_HEAD + 20} Q ${CX} ${Y_HEAD + 27} ${CX + 6} ${Y_HEAD + 20}`} fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
          )}

          {/* Веснушки */}
          {!girl && (
            <g fill="#C9936A" opacity="0.7">
              <circle cx={CX - 18} cy={Y_HEAD + 10} r="1" /><circle cx={CX - 22} cy={Y_HEAD + 14} r="1" />
              <circle cx={CX + 18} cy={Y_HEAD + 10} r="1" /><circle cx={CX + 22} cy={Y_HEAD + 14} r="1" />
            </g>
          )}

          {/* Дыхание */}
          {cold && (
            <g opacity="0.4" className="animate-float" style={{ animationDuration: '2s' }}>
              <ellipse cx={CX + 16} cy={Y_HEAD + 26} rx="6" ry="3" fill="#FFFFFF" />
              <ellipse cx={CX + 24} cy={Y_HEAD + 22} rx="4" ry="2" fill="#FFFFFF" />
            </g>
          )}

          {/* Волосы спереди */}
          <g fill={`url(#${gid('hair')})`}>
            {girl ? (
              <>
                <path d={`M ${CX - 35} ${Y_HEAD - 5} Q ${CX} ${Y_HEAD - 25} ${CX + 35} ${Y_HEAD - 5} Q ${CX + 38} ${Y_HEAD - 35} ${CX} ${Y_HEAD - 38} Q ${CX - 38} ${Y_HEAD - 35} ${CX - 35} ${Y_HEAD - 5} Z`} />
                <path d={`M ${CX - 30} ${Y_HEAD - 14} Q ${CX - 22} ${Y_HEAD - 6} ${CX - 14} ${Y_HEAD - 14} Q ${CX - 6} ${Y_HEAD - 6} ${CX + 2} ${Y_HEAD - 14} Q ${CX + 10} ${Y_HEAD - 6} ${CX + 18} ${Y_HEAD - 14} L ${CX + 20} ${Y_HEAD - 24} Q ${CX} ${Y_HEAD - 32} ${CX - 28} ${Y_HEAD - 24} Z`} fill={hair.l} opacity="0.45" />
              </>
            ) : (
              <>
                <path d={`M ${CX - 35} ${Y_HEAD - 10} Q ${CX - 20} ${Y_HEAD - 30} ${CX} ${Y_HEAD - 25} Q ${CX + 20} ${Y_HEAD - 35} ${CX + 35} ${Y_HEAD - 15} Q ${CX + 40} ${Y_HEAD - 40} ${CX} ${Y_HEAD - 45} Q ${CX - 40} ${Y_HEAD - 40} ${CX - 35} ${Y_HEAD - 10} Z`} />
                <path d={`M ${CX - 28} ${Y_HEAD - 18} Q ${CX - 14} ${Y_HEAD - 28} ${CX + 2} ${Y_HEAD - 22} L ${CX - 2} ${Y_HEAD - 32} Q ${CX - 20} ${Y_HEAD - 34} ${CX - 30} ${Y_HEAD - 24} Z`} fill={hair.l} opacity="0.45" />
              </>
            )}
          </g>

          {/* Головной убор */}
          {show.headwear && (
            <g filter={`url(#${uid}-soft)`}>
              {hot ? (
                <>
                  <ellipse cx={CX} cy={Y_HEAD - 24} rx="46" ry="12" fill={`url(#${gid('hat')})`} />
                  <path d={`M ${CX - 28} ${Y_HEAD - 24} Q ${CX} ${Y_HEAD - 56} ${CX + 28} ${Y_HEAD - 24} Z`} fill={`url(#${gid('hat')})`} />
                  <path d={`M ${CX - 28} ${Y_HEAD - 24} Q ${CX} ${Y_HEAD - 56} ${CX + 28} ${Y_HEAD - 24} Z`} fill={`url(#${gid('hi')})`} />
                  <rect x={CX - 28} y={Y_HEAD - 30} width="56" height="7" rx="3.5" fill={`url(#${gid('hatD')})`} />
                </>
              ) : zone === 'warm' || zone === 'mild' ? (
                <>
                  <path d={`M ${CX - 34} ${Y_HEAD - 14} Q ${CX} ${Y_HEAD - 52} ${CX + 34} ${Y_HEAD - 14} Z`} fill={`url(#${gid('hat')})`} />
                  <path d={`M ${CX - 34} ${Y_HEAD - 14} Q ${CX} ${Y_HEAD - 52} ${CX + 34} ${Y_HEAD - 14} Z`} fill={`url(#${gid('hi')})`} />
                  <path d={`M ${CX + 4} ${Y_HEAD - 22} Q ${CX + 30} ${Y_HEAD - 26} ${CX + 44} ${Y_HEAD - 14} Q ${CX + 26} ${Y_HEAD - 8} ${CX + 6} ${Y_HEAD - 12} Z`} fill={`url(#${gid('hatD')})`} />
                  <circle cx={CX} cy={Y_HEAD - 40} r="3" fill={`url(#${gid('hatD')})`} />
                </>
              ) : (
                <>
                  <path d={`M ${CX - 34} ${Y_HEAD - 14} Q ${CX} ${Y_HEAD - 56} ${CX + 34} ${Y_HEAD - 14} Z`} fill={`url(#${gid('hat')})`} />
                  <path d={`M ${CX - 34} ${Y_HEAD - 14} Q ${CX} ${Y_HEAD - 56} ${CX + 34} ${Y_HEAD - 14} Z`} fill={`url(#${gid('hi')})`} />
                  <rect x={CX - 36} y={Y_HEAD - 18} width="72" height="14" rx="7" fill={`url(#${gid('hatD')})`} />
                  {(zone === 'arctic' || zone === 'winter') && <circle cx={CX} cy={Y_HEAD - 50} r="11" fill="#FFFFFF" />}
                </>
              )}
            </g>
          )}

          {/* Очки */}
          {hot && show.accessory && (
            <g>
              <rect x={CX - 22} y={Y_HEAD} width="18" height="12" rx="5" fill="#0F172A" />
              <rect x={CX + 4} y={Y_HEAD} width="18" height="12" rx="5" fill="#0F172A" />
              <line x1={CX - 4} y1={Y_HEAD + 5} x2={CX + 4} y2={Y_HEAD + 5} stroke="#0F172A" strokeWidth="2.5" />
              <line x1={CX - 18} y1={Y_HEAD + 3} x2={CX - 10} y2={Y_HEAD + 8} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
              <line x1={CX + 8} y1={Y_HEAD + 3} x2={CX + 16} y2={Y_HEAD + 8} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
            </g>
          )}
        </g>

        {/* Зонт */}
        {isRainy && show.accessory && (
          <g className="animate-float" style={{ animationDuration: '4s' }} filter={`url(#${uid}-soft)`}>
            <line x1={CX + 50} y1={Y_SHOULDER + 90} x2={CX + 50} y2={Y_HEAD - 42} stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <path d={`M ${CX - 10} ${Y_HEAD - 22} Q ${CX + 50} ${Y_HEAD - 74} ${CX + 110} ${Y_HEAD - 22} Z`} fill="#EF4444" />
            <path d={`M ${CX - 10} ${Y_HEAD - 22} Q ${CX + 10} ${Y_HEAD - 30} ${CX + 30} ${Y_HEAD - 22} Q ${CX + 50} ${Y_HEAD - 30} ${CX + 70} ${Y_HEAD - 22} Q ${CX + 90} ${Y_HEAD - 30} ${CX + 110} ${Y_HEAD - 22}`} fill="none" stroke="#B91C1C" strokeWidth="2" opacity="0.5" />
          </g>
        )}
      </g>
    </svg>
  );
};
