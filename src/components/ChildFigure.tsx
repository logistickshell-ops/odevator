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

  const CX = 120, Y_HEAD = 78, Y_SHOULDER = 132, Y_WAIST = 208, Y_ANKLE = 328;

  // Cartoon-палитра: тёплые, насыщенные, плоские цвета
  const C = girl
    ? {
        skin: '#FFDAB9', skinShadow: '#F4C4A0',
        hair: '#8B4513', hairLight: '#A0522D',
        top: '#87CEEB', topDark: '#5BA3C9',
        upper: '#DDA0DD', upperDark: '#BA7FBA',
        outer: '#FF69B4', outerDark: '#DB4A8A',
        bottom: '#87CEEB', bottomDark: '#5BA3C9',
        shoes: '#FF6347', shoesDark: '#CC4F39',
        hat: '#87CEEB', hatDark: '#5BA3C9',
        scarf: '#FF69B4', scarfDark: '#DB4A8A',
        mitt: '#DDA0DD', mittDark: '#BA7FBA',
        under: '#FFFFFF', underDark: '#E8E8E8',
        outline: '#5D4037',
      }
    : {
        skin: '#FFDAB9', skinShadow: '#F4C4A0',
        hair: '#654321', hairLight: '#7D5A3C',
        top: '#87CEEB', topDark: '#5BA3C9',
        upper: '#6495ED', upperDark: '#4A75C9',
        outer: '#4169E1', outerDark: '#2E4FA8',
        bottom: '#4682B4', bottomDark: '#2E5A7A',
        shoes: '#FF6347', shoesDark: '#CC4F39',
        hat: '#4682B4', hatDark: '#2E5A7A',
        scarf: '#FF6347', scarfDark: '#CC4F39',
        mitt: '#6495ED', mittDark: '#4A75C9',
        under: '#FFFFFF', underDark: '#E8E8E8',
        outline: '#5D4037',
      };

  const shortSleeve = hot || zone === 'warm';
  const drawSkirt = girl && !cold && zone !== 'chilly';
  const drawShorts = !girl && (hot || zone === 'warm');

  // Кривые для рук и ног
  const armL = `M ${CX - 28} ${Y_SHOULDER + 10} Q ${CX - 46} ${Y_SHOULDER + 22} ${CX - 50} ${Y_SHOULDER + 56} Q ${CX - 52} ${Y_SHOULDER + 82} ${CX - 52} ${Y_SHOULDER + 96}`;
  const armR = `M ${CX + 28} ${Y_SHOULDER + 10} Q ${CX + 46} ${Y_SHOULDER + 22} ${CX + 50} ${Y_SHOULDER + 56} Q ${CX + 52} ${Y_SHOULDER + 82} ${CX + 52} ${Y_SHOULDER + 96}`;
  const legL = `M ${CX - 15} ${Y_WAIST + 18} L ${CX - 19} ${Y_ANKLE}`;
  const legR = `M ${CX + 15} ${Y_WAIST + 18} L ${CX + 19} ${Y_ANKLE}`;

  return (
    <svg viewBox="0 0 240 400" className="h-full w-full select-none" role="img" aria-label="Иллюстрация ребёнка по погоде">
      <defs>
        {/* Мягкая тень под персонажем */}
        <filter id="cartoon-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#5D4037" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Тень под ногами */}
      <ellipse cx={CX} cy={Y_ANKLE + 32} rx="55" ry="8" fill="#5D4037" opacity="0.12" />

      {/* Погода */}
      {isSnowy && (
        <g fill="#FFFFFF" opacity="0.9">
          {[35, 75, 115, 155, 195, 225].map((x, i) => (
            <circle key={x} cx={x} cy={35 + i * 48} r={i % 2 ? 3 : 4} />
          ))}
        </g>
      )}
      {isRainy && (
        <g stroke="#87CEEB" strokeWidth="3" strokeLinecap="round" opacity="0.6">
          {[35, 80, 125, 170, 215].map((x, i) => (
            <line key={x} x1={x} y1={25 + i * 18} x2={x - 7} y2={48 + i * 18} />
          ))}
        </g>
      )}

      <g filter="url(#cartoon-shadow)">
        {/* === ВОЛОСЫ СЗАДИ (девочка: хвостики) === */}
        {girl && (
          <g>
            <ellipse cx={CX - 42} cy={Y_HEAD + 18} rx="14" ry="18" fill={C.hair} stroke={C.outline} strokeWidth="2" />
            <ellipse cx={CX + 42} cy={Y_HEAD + 18} rx="14" ry="18" fill={C.hair} stroke={C.outline} strokeWidth="2" />
            {/* Резинки */}
            <circle cx={CX - 42} cy={Y_HEAD + 2} r="5" fill={C.hat} stroke={C.outline} strokeWidth="1.5" />
            <circle cx={CX + 42} cy={Y_HEAD + 2} r="5" fill={C.hat} stroke={C.outline} strokeWidth="1.5" />
          </g>
        )}

        {/* === НОГИ (кожа) === */}
        <g stroke={C.outline} strokeWidth="2" fill="none">
          <path d={legL} stroke={C.skin} strokeWidth="18" strokeLinecap="round" />
          <path d={legR} stroke={C.skin} strokeWidth="18" strokeLinecap="round" />
        </g>

        {/* === СЛОЙ 1: бельё (низ) === */}
        {show.underwear && (
          <g>
            <rect x={CX - 24} y={Y_WAIST - 6} width="48" height="28" rx="12" fill={C.under} stroke={C.outline} strokeWidth="2" />
            {cold && (
              <>
                <line x1={CX - 14} y1={Y_WAIST + 2} x2={CX - 14} y2={Y_WAIST + 18} stroke={C.underDark} strokeWidth="2" strokeDasharray="3,3" />
                <line x1={CX + 14} y1={Y_WAIST + 2} x2={CX + 14} y2={Y_WAIST + 18} stroke={C.underDark} strokeWidth="2" strokeDasharray="3,3" />
              </>
            )}
          </g>
        )}

        {/* === СЛОЙ 2: нижний (низ) === */}
        {show.lower && (
          <g>
            {drawSkirt ? (
              <>
                <path d={`M ${CX - 24} ${Y_WAIST - 8} L ${CX + 24} ${Y_WAIST - 8} L ${CX + 46} ${Y_WAIST + 62} Q ${CX} ${Y_WAIST + 76} ${CX - 46} ${Y_WAIST + 62} Z`} fill={C.bottom} stroke={C.outline} strokeWidth="2" />
                {/* Складки */}
                {[-28, -14, 0, 14, 28].map((dx) => (
                  <line key={dx} x1={CX + dx * 0.5} y1={Y_WAIST - 4} x2={CX + dx} y2={Y_WAIST + 58} stroke={C.bottomDark} strokeWidth="2" opacity="0.4" />
                ))}
              </>
            ) : drawShorts ? (
              <>
                <rect x={CX - 26} y={Y_WAIST - 8} width="52" height="30" rx="12" fill={C.bottom} stroke={C.outline} strokeWidth="2" />
                <path d={`M ${CX - 16} ${Y_WAIST + 10} L ${CX - 20} ${Y_WAIST + 48}`} stroke={C.bottom} strokeWidth="28" strokeLinecap="round" />
                <path d={`M ${CX + 16} ${Y_WAIST + 10} L ${CX + 20} ${Y_WAIST + 48}`} stroke={C.bottom} strokeWidth="28" strokeLinecap="round" />
                <path d={`M ${CX - 16} ${Y_WAIST + 10} L ${CX - 20} ${Y_WAIST + 48}`} stroke={C.outline} strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d={`M ${CX + 16} ${Y_WAIST + 10} L ${CX + 20} ${Y_WAIST + 48}`} stroke={C.outline} strokeWidth="2" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                <rect x={CX - 26} y={Y_WAIST - 8} width="52" height="30" rx="12" fill={C.bottom} stroke={C.outline} strokeWidth="2" />
                <path d={legL} stroke={C.bottom} strokeWidth="26" strokeLinecap="round" />
                <path d={legR} stroke={C.bottom} strokeWidth="26" strokeLinecap="round" />
                <path d={legL} stroke={C.outline} strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d={legR} stroke={C.outline} strokeWidth="2" strokeLinecap="round" fill="none" />
              </>
            )}
          </g>
        )}

        {/* === СЛОЙ 6: обувь === */}
        {show.shoes ? (
          <g>
            {cold ? (
              <>
                <rect x={CX - 35} y={Y_ANKLE - 16} width="30" height="42" rx="14" fill={C.shoes} stroke={C.outline} strokeWidth="2" />
                <rect x={CX + 5} y={Y_ANKLE - 16} width="30" height="42" rx="14" fill={C.shoes} stroke={C.outline} strokeWidth="2" />
                <ellipse cx={CX - 20} cy={Y_ANKLE - 14} rx="15" ry="7" fill="#FFFFFF" opacity="0.9" />
                <ellipse cx={CX + 20} cy={Y_ANKLE - 14} rx="15" ry="7" fill="#FFFFFF" opacity="0.9" />
                <rect x={CX - 37} y={Y_ANKLE + 22} width="34" height="9" rx="4" fill={C.shoesDark} stroke={C.outline} strokeWidth="1.5" />
                <rect x={CX + 3} y={Y_ANKLE + 22} width="34" height="9" rx="4" fill={C.shoesDark} stroke={C.outline} strokeWidth="1.5" />
              </>
            ) : hot ? (
              <>
                <rect x={CX - 34} y={Y_ANKLE + 18} width="28" height="12" rx="6" fill={C.shoes} stroke={C.outline} strokeWidth="2" />
                <rect x={CX + 6} y={Y_ANKLE + 18} width="28" height="12" rx="6" fill={C.shoes} stroke={C.outline} strokeWidth="2" />
                <path d={`M ${CX - 28} ${Y_ANKLE + 10} L ${CX - 18} ${Y_ANKLE + 20}`} stroke={C.shoes} strokeWidth="5" strokeLinecap="round" />
                <path d={`M ${CX + 18} ${Y_ANKLE + 10} L ${CX + 28} ${Y_ANKLE + 20}`} stroke={C.shoes} strokeWidth="5" strokeLinecap="round" />
                <path d={`M ${CX - 28} ${Y_ANKLE + 10} L ${CX - 18} ${Y_ANKLE + 20}`} stroke={C.outline} strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d={`M ${CX + 18} ${Y_ANKLE + 10} L ${CX + 28} ${Y_ANKLE + 20}`} stroke={C.outline} strokeWidth="2" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                <rect x={CX - 33} y={Y_ANKLE + 4} width="28" height="22" rx="11" fill={C.shoes} stroke={C.outline} strokeWidth="2" />
                <rect x={CX + 5} y={Y_ANKLE + 4} width="28" height="22" rx="11" fill={C.shoes} stroke={C.outline} strokeWidth="2" />
                <rect x={CX - 35} y={Y_ANKLE + 22} width="32" height="8" rx="4" fill={C.shoesDark} stroke={C.outline} strokeWidth="1.5" />
                <rect x={CX + 3} y={Y_ANKLE + 22} width="32" height="8" rx="4" fill={C.shoesDark} stroke={C.outline} strokeWidth="1.5" />
                {/* Шнурки */}
                <line x1={CX - 27} y1={Y_ANKLE + 12} x2={CX - 15} y2={Y_ANKLE + 12} stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                <line x1={CX + 13} y1={Y_ANKLE + 12} x2={CX + 25} y2={Y_ANKLE + 12} stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              </>
            )}
          </g>
        ) : (
          <g>
            <ellipse cx={CX - 19} cy={Y_ANKLE + 16} rx="13" ry="9" fill={C.under} stroke={C.outline} strokeWidth="2" />
            <ellipse cx={CX + 19} cy={Y_ANKLE + 16} rx="13" ry="9" fill={C.under} stroke={C.outline} strokeWidth="2" />
          </g>
        )}

        {/* === ТОРС (кожа) === */}
        <rect x={CX - 24} y={Y_SHOULDER} width="48" height="84" rx="22" fill={C.skin} stroke={C.outline} strokeWidth="2" />

        {/* === РУКИ (кожа) === */}
        <g>
          <path d={armL} stroke={C.skin} strokeWidth="15" strokeLinecap="round" fill="none" />
          <path d={armR} stroke={C.skin} strokeWidth="15" strokeLinecap="round" fill="none" />
          <path d={armL} stroke={C.outline} strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d={armR} stroke={C.outline} strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>

        {/* === СЛОЙ 1: бельё (верх) === */}
        {show.underwear && (
          <g>
            <rect x={CX - 26} y={Y_SHOULDER - 4} width="52" height="90" rx="22" fill={C.under} stroke={C.outline} strokeWidth="2" />
            <path d={`M ${CX - 13} ${Y_SHOULDER - 4} Q ${CX} ${Y_SHOULDER + 15} ${CX + 13} ${Y_SHOULDER - 4}`} fill={C.skin} stroke={C.outline} strokeWidth="2" />
            {cold ? (
              <>
                <path d={armL} stroke={C.under} strokeWidth="18" strokeLinecap="round" fill="none" />
                <path d={armR} stroke={C.under} strokeWidth="18" strokeLinecap="round" fill="none" />
                <path d={armL} stroke={C.outline} strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d={armR} stroke={C.outline} strokeWidth="2" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                <line x1={CX - 18} y1={Y_SHOULDER - 4} x2={CX - 14} y2={Y_SHOULDER + 8} stroke={C.under} strokeWidth="6" strokeLinecap="round" />
                <line x1={CX + 18} y1={Y_SHOULDER - 4} x2={CX + 14} y2={Y_SHOULDER + 8} stroke={C.under} strokeWidth="6" strokeLinecap="round" />
                <line x1={CX - 18} y1={Y_SHOULDER - 4} x2={CX - 14} y2={Y_SHOULDER + 8} stroke={C.outline} strokeWidth="2" strokeLinecap="round" />
                <line x1={CX + 18} y1={Y_SHOULDER - 4} x2={CX + 14} y2={Y_SHOULDER + 8} stroke={C.outline} strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </g>
        )}

        {/* === СЛОЙ 2: нижний (верх) === */}
        {show.lower && (
          <g>
            {shortSleeve ? (
              <>
                <path d={`M ${CX - 27} ${Y_SHOULDER + 10} Q ${CX - 38} ${Y_SHOULDER + 20} ${CX - 42} ${Y_SHOULDER + 36}`} stroke={C.top} strokeWidth="22" strokeLinecap="round" fill="none" />
                <path d={`M ${CX + 27} ${Y_SHOULDER + 10} Q ${CX + 38} ${Y_SHOULDER + 20} ${CX + 42} ${Y_SHOULDER + 36}`} stroke={C.top} strokeWidth="22" strokeLinecap="round" fill="none" />
                <path d={`M ${CX - 27} ${Y_SHOULDER + 10} Q ${CX - 38} ${Y_SHOULDER + 20} ${CX - 42} ${Y_SHOULDER + 36}`} stroke={C.outline} strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d={`M ${CX + 27} ${Y_SHOULDER + 10} Q ${CX + 38} ${Y_SHOULDER + 20} ${CX + 42} ${Y_SHOULDER + 36}`} stroke={C.outline} strokeWidth="2" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                <path d={armL} stroke={C.top} strokeWidth="22" strokeLinecap="round" fill="none" />
                <path d={armR} stroke={C.top} strokeWidth="22" strokeLinecap="round" fill="none" />
                <path d={armL} stroke={C.outline} strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d={armR} stroke={C.outline} strokeWidth="2" strokeLinecap="round" fill="none" />
              </>
            )}
            <rect x={CX - 27} y={Y_SHOULDER - 5} width="54" height="92" rx="22" fill={C.top} stroke={C.outline} strokeWidth="2" />
            <path d={`M ${CX - 13} ${Y_SHOULDER - 5} Q ${CX} ${Y_SHOULDER + 14} ${CX + 13} ${Y_SHOULDER - 5}`} fill={show.underwear ? C.under : C.skin} stroke={C.outline} strokeWidth="2" />
          </g>
        )}

        {/* === СЛОЙ 3: верхний (худи) === */}
        {(show.upper && (coolish || zone === 'mild')) && (
          <g>
            <path d={armL} stroke={C.upper} strokeWidth="28" strokeLinecap="round" fill="none" />
            <path d={armR} stroke={C.upper} strokeWidth="28" strokeLinecap="round" fill="none" />
            <path d={armL} stroke={C.outline} strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d={armR} stroke={C.outline} strokeWidth="2" strokeLinecap="round" fill="none" />
            <rect x={CX - 30} y={Y_SHOULDER - 8} width="60" height="98" rx="26" fill={C.upper} stroke={C.outline} strokeWidth="2" />
            <path d={`M ${CX - 16} ${Y_SHOULDER - 8} Q ${CX} ${Y_SHOULDER + 17} ${CX + 16} ${Y_SHOULDER - 8}`} fill={C.top} stroke={C.outline} strokeWidth="2" />
            {/* Шнурки */}
            <line x1={CX - 7} y1={Y_SHOULDER + 9} x2={CX - 7} y2={Y_SHOULDER + 32} stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <line x1={CX + 7} y1={Y_SHOULDER + 9} x2={CX + 7} y2={Y_SHOULDER + 32} stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <circle cx={CX - 7} cy={Y_SHOULDER + 33} r="3" fill="#FFFFFF" stroke={C.outline} strokeWidth="1" />
            <circle cx={CX + 7} cy={Y_SHOULDER + 33} r="3" fill="#FFFFFF" stroke={C.outline} strokeWidth="1" />
            {/* Карман */}
            <path d={`M ${CX - 20} ${Y_WAIST - 14} Q ${CX} ${Y_WAIST - 8} ${CX + 20} ${Y_WAIST - 14} L ${CX + 24} ${Y_WAIST + 14} Q ${CX} ${Y_WAIST + 20} ${CX - 24} ${Y_WAIST + 14} Z`} fill={C.upperDark} opacity="0.3" stroke={C.outline} strokeWidth="1.5" />
          </g>
        )}

        {/* === СЛОЙ 4: верхняя одежда === */}
        {show.outer && (
          <g>
            <path d={armL} stroke={C.outer} strokeWidth="34" strokeLinecap="round" fill="none" />
            <path d={armR} stroke={C.outer} strokeWidth="34" strokeLinecap="round" fill="none" />
            <path d={armL} stroke={C.outline} strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d={armR} stroke={C.outline} strokeWidth="2" strokeLinecap="round" fill="none" />
            <rect x={CX - 34} y={Y_SHOULDER - 10} width="68" height="108" rx="30" fill={C.outer} stroke={C.outline} strokeWidth="2" />
            {/* Молния */}
            <line x1={CX} y1={Y_SHOULDER - 8} x2={CX} y2={Y_WAIST + 28} stroke={C.hatDark} strokeWidth="4" strokeLinecap="round" />
            <circle cx={CX} cy={Y_SHOULDER + 3} r="4" fill={C.hatDark} stroke={C.outline} strokeWidth="1.5" />
            {/* Карманы */}
            <rect x={CX - 28} y={Y_WAIST - 4} width="17" height="19" rx="6" fill={C.outerDark} opacity="0.4" stroke={C.outline} strokeWidth="1.5" />
            <rect x={CX + 11} y={Y_WAIST - 4} width="17" height="19" rx="6" fill={C.outerDark} opacity="0.4" stroke={C.outline} strokeWidth="1.5" />
            {/* Стежка */}
            {(zone === 'arctic' || zone === 'winter') && !isRainy && (
              <g stroke={C.outline} strokeWidth="1.5" opacity="0.3" fill="none">
                <line x1={CX - 32} y1={Y_SHOULDER + 18} x2={CX + 32} y2={Y_SHOULDER + 18} />
                <line x1={CX - 33} y1={Y_SHOULDER + 44} x2={CX + 33} y2={Y_SHOULDER + 44} />
                <line x1={CX - 33} y1={Y_SHOULDER + 70} x2={CX + 33} y2={Y_SHOULDER + 70} />
              </g>
            )}
            {/* Мех */}
            {zone === 'arctic' && !isRainy && (
              <path d={`M ${CX - 27} ${Y_SHOULDER - 10} Q ${CX} ${Y_SHOULDER + 12} ${CX + 27} ${Y_SHOULDER - 10} Q ${CX} ${Y_SHOULDER - 32} ${CX - 27} ${Y_SHOULDER - 10} Z`} fill="#FAFAF9" stroke={C.outline} strokeWidth="2" />
            )}
          </g>
        )}

        {/* === ВАРЕЖКИ / КИСТИ === */}
        {cold && show.accessory ? (
          <g>
            <circle cx={CX - 52} cy={Y_SHOULDER + 98} r="13" fill={C.mitt} stroke={C.outline} strokeWidth="2" />
            <circle cx={CX + 52} cy={Y_SHOULDER + 98} r="13" fill={C.mitt} stroke={C.outline} strokeWidth="2" />
            <rect x={CX - 61} y={Y_SHOULDER + 82} width="18" height="9" rx="4" fill="#FFFFFF" stroke={C.outline} strokeWidth="1.5" />
            <rect x={CX + 43} y={Y_SHOULDER + 82} width="18" height="9" rx="4" fill="#FFFFFF" stroke={C.outline} strokeWidth="1.5" />
          </g>
        ) : (
          <g>
            <circle cx={CX - 52} cy={Y_SHOULDER + 98} r="9" fill={C.skin} stroke={C.outline} strokeWidth="2" />
            <circle cx={CX + 52} cy={Y_SHOULDER + 98} r="9" fill={C.skin} stroke={C.outline} strokeWidth="2" />
          </g>
        )}

        {/* === ШАРФ === */}
        {coolish && show.accessory && (
          <g>
            <rect x={CX - 24} y={Y_SHOULDER - 20} width="48" height="19" rx="9" fill={C.scarf} stroke={C.outline} strokeWidth="2" />
            <path d={isWindy
              ? `M ${CX - 16} ${Y_SHOULDER - 2} Q ${CX - 32} ${Y_SHOULDER + 20} ${CX - 46} ${Y_SHOULDER + 26} L ${CX - 40} ${Y_SHOULDER + 38} Q ${CX - 22} ${Y_SHOULDER + 28} ${CX - 6} ${Y_SHOULDER} Z`
              : `M ${CX - 16} ${Y_SHOULDER - 2} L ${CX - 11} ${Y_SHOULDER + 38} L ${CX - 1} ${Y_SHOULDER + 34} L ${CX - 6} ${Y_SHOULDER - 2} Z`} fill={C.scarf} stroke={C.outline} strokeWidth="2" />
          </g>
        )}

        {/* === ШЕЯ === */}
        {!coolish && <rect x={CX - 9} y={Y_HEAD + 27} width="18" height="20" fill={C.skin} stroke={C.outline} strokeWidth="2" />}

        {/* === ГОЛОВА === */}
        <g>
          {/* Лицо */}
          <circle cx={CX} cy={Y_HEAD} r="38" fill={C.skin} stroke={C.outline} strokeWidth="2.5" />

          {/* Брови */}
          <g stroke={C.hair} strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d={`M ${CX - 20} ${Y_HEAD - 8} Q ${CX - 14} ${Y_HEAD - 13} ${CX - 8} ${Y_HEAD - 8}`} />
            <path d={`M ${CX + 8} ${Y_HEAD - 8} Q ${CX + 14} ${Y_HEAD - 13} ${CX + 20} ${Y_HEAD - 8}`} />
          </g>

          {/* Глаза: большие, мультяшные */}
          <ellipse cx={CX - 14} cy={Y_HEAD + 6} rx="8" ry="9" fill="#FFFFFF" stroke={C.outline} strokeWidth="2" />
          <ellipse cx={CX + 14} cy={Y_HEAD + 6} rx="8" ry="9" fill="#FFFFFF" stroke={C.outline} strokeWidth="2" />
          <circle cx={CX - 14} cy={Y_HEAD + 7} r="5.5" fill={C.hair} />
          <circle cx={CX + 14} cy={Y_HEAD + 7} r="5.5" fill={C.hair} />
          {/* Блики */}
          <circle cx={CX - 16} cy={Y_HEAD + 4} r="2.5" fill="#FFFFFF" />
          <circle cx={CX + 12} cy={Y_HEAD + 4} r="2.5" fill="#FFFFFF" />
          <circle cx={CX - 12} cy={Y_HEAD + 9} r="1.2" fill="#FFFFFF" opacity="0.8" />
          <circle cx={CX + 16} cy={Y_HEAD + 9} r="1.2" fill="#FFFFFF" opacity="0.8" />
          {/* Ресницы (девочка) */}
          {girl && (
            <g stroke={C.outline} strokeWidth="2" strokeLinecap="round">
              <line x1={CX - 21} y1={Y_HEAD + 2} x2={CX - 25} y2={Y_HEAD - 2} />
              <line x1={CX + 21} y1={Y_HEAD + 2} x2={CX + 25} y2={Y_HEAD - 2} />
            </g>
          )}

          {/* Румянец */}
          <circle cx={CX - 24} cy={Y_HEAD + 16} r={cold ? 10 : 8} fill="#FFB6C1" opacity="0.6" />
          <circle cx={CX + 24} cy={Y_HEAD + 16} r={cold ? 10 : 8} fill="#FFB6C1" opacity="0.6" />

          {/* Нос */}
          <ellipse cx={CX} cy={Y_HEAD + 14} rx="3" ry="2.5" fill={C.skinShadow} stroke={C.outline} strokeWidth="1.5" />

          {/* Рот: широкая улыбка */}
          {hot ? (
            <path d={`M ${CX - 9} ${Y_HEAD + 22} Q ${CX} ${Y_HEAD + 34} ${CX + 9} ${Y_HEAD + 22} Z`} fill={C.hair} stroke={C.outline} strokeWidth="2" />
          ) : (
            <path d={`M ${CX - 8} ${Y_HEAD + 23} Q ${CX} ${Y_HEAD + 32} ${CX + 8} ${Y_HEAD + 23}`} fill="none" stroke={C.outline} strokeWidth="3" strokeLinecap="round" />
          )}

          {/* Веснушки (мальчик) */}
          {!girl && (
            <g fill={C.hair} opacity="0.5">
              <circle cx={CX - 22} cy={Y_HEAD + 12} r="1.5" /><circle cx={CX - 26} cy={Y_HEAD + 16} r="1.5" />
              <circle cx={CX + 22} cy={Y_HEAD + 12} r="1.5" /><circle cx={CX + 26} cy={Y_HEAD + 16} r="1.5" />
            </g>
          )}

          {/* Дыхание на морозе */}
          {cold && (
            <g opacity="0.5" className="animate-float" style={{ animationDuration: '2s' }}>
              <ellipse cx={CX + 18} cy={Y_HEAD + 28} rx="7" ry="3.5" fill="#FFFFFF" />
              <ellipse cx={CX + 27} cy={Y_HEAD + 24} rx="5" ry="2.5" fill="#FFFFFF" />
            </g>
          )}

          {/* Волосы спереди */}
          <g fill={C.hair} stroke={C.outline} strokeWidth="2">
            {girl ? (
              <>
                <path d={`M ${CX - 38} ${Y_HEAD - 4} Q ${CX} ${Y_HEAD - 28} ${CX + 38} ${Y_HEAD - 4} Q ${CX + 41} ${Y_HEAD - 38} ${CX} ${Y_HEAD - 41} Q ${CX - 41} ${Y_HEAD - 38} ${CX - 38} ${Y_HEAD - 4} Z`} />
                {/* Чёлка */}
                <path d={`M ${CX - 32} ${Y_HEAD - 16} Q ${CX - 22} ${Y_HEAD - 6} ${CX - 12} ${Y_HEAD - 16} Q ${CX - 2} ${Y_HEAD - 6} ${CX + 8} ${Y_HEAD - 16} Q ${CX + 18} ${Y_HEAD - 6} ${CX + 28} ${Y_HEAD - 16} L ${CX + 28} ${Y_HEAD - 28} Q ${CX} ${Y_HEAD - 36} ${CX - 30} ${Y_HEAD - 28} Z`} fill={C.hairLight} opacity="0.6" />
              </>
            ) : (
              <>
                <path d={`M ${CX - 38} ${Y_HEAD - 10} Q ${CX - 22} ${Y_HEAD - 33} ${CX} ${Y_HEAD - 27} Q ${CX + 22} ${Y_HEAD - 38} ${CX + 38} ${Y_HEAD - 15} Q ${CX + 43} ${Y_HEAD - 43} ${CX} ${Y_HEAD - 48} Q ${CX - 43} ${Y_HEAD - 43} ${CX - 38} ${Y_HEAD - 10} Z`} />
                {/* Прядь */}
                <path d={`M ${CX - 30} ${Y_HEAD - 20} Q ${CX - 14} ${Y_HEAD - 31} ${CX + 4} ${Y_HEAD - 24} L ${CX - 2} ${Y_HEAD - 35} Q ${CX - 22} ${Y_HEAD - 37} ${CX - 32} ${Y_HEAD - 26} Z`} fill={C.hairLight} opacity="0.6" />
              </>
            )}
          </g>

          {/* === ГОЛОВНОЙ УБОР === */}
          {show.headwear && (
            <g>
              {hot ? (
                <>
                  <ellipse cx={CX} cy={Y_HEAD - 26} rx="50" ry="13" fill={C.hat} stroke={C.outline} strokeWidth="2" />
                  <path d={`M ${CX - 30} ${Y_HEAD - 26} Q ${CX} ${Y_HEAD - 60} ${CX + 30} ${Y_HEAD - 26} Z`} fill={C.hat} stroke={C.outline} strokeWidth="2" />
                  <rect x={CX - 30} y={Y_HEAD - 33} width="60" height="9" rx="4" fill={C.hatDark} stroke={C.outline} strokeWidth="1.5" />
                </>
              ) : zone === 'warm' || zone === 'mild' ? (
                <>
                  <path d={`M ${CX - 37} ${Y_HEAD - 15} Q ${CX} ${Y_HEAD - 56} ${CX + 37} ${Y_HEAD - 15} Z`} fill={C.hat} stroke={C.outline} strokeWidth="2" />
                  <path d={`M ${CX + 5} ${Y_HEAD - 24} Q ${CX + 32} ${Y_HEAD - 29} ${CX + 48} ${Y_HEAD - 15} Q ${CX + 28} ${Y_HEAD - 9} ${CX + 7} ${Y_HEAD - 13} Z`} fill={C.hatDark} stroke={C.outline} strokeWidth="2" />
                  <circle cx={CX} cy={Y_HEAD - 44} r="4" fill={C.hatDark} stroke={C.outline} strokeWidth="1.5" />
                </>
              ) : (
                <>
                  <path d={`M ${CX - 37} ${Y_HEAD - 15} Q ${CX} ${Y_HEAD - 60} ${CX + 37} ${Y_HEAD - 15} Z`} fill={C.hat} stroke={C.outline} strokeWidth="2" />
                  <rect x={CX - 39} y={Y_HEAD - 19} width="78" height="16" rx="8" fill={C.hatDark} stroke={C.outline} strokeWidth="2" />
                  {(zone === 'arctic' || zone === 'winter') && <circle cx={CX} cy={Y_HEAD - 54} r="12" fill="#FFFFFF" stroke={C.outline} strokeWidth="2" />}
                </>
              )}
            </g>
          )}

          {/* Очки */}
          {hot && show.accessory && (
            <g>
              <rect x={CX - 24} y={Y_HEAD + 2} width="20" height="14" rx="6" fill="#2C3E50" stroke={C.outline} strokeWidth="2" />
              <rect x={CX + 4} y={Y_HEAD + 2} width="20" height="14" rx="6" fill="#2C3E50" stroke={C.outline} strokeWidth="2" />
              <line x1={CX - 4} y1={Y_HEAD + 7} x2={CX + 4} y2={Y_HEAD + 7} stroke={C.outline} strokeWidth="3" />
              <line x1={CX - 20} y1={Y_HEAD + 5} x2={CX - 12} y2={Y_HEAD + 10} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
              <line x1={CX + 10} y1={Y_HEAD + 5} x2={CX + 18} y2={Y_HEAD + 10} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            </g>
          )}
        </g>

        {/* === ЗОНТ === */}
        {isRainy && show.accessory && (
          <g className="animate-float" style={{ animationDuration: '4s' }}>
            <line x1={CX + 52} y1={Y_SHOULDER + 94} x2={CX + 52} y2={Y_HEAD - 46} stroke={C.outline} strokeWidth="4" strokeLinecap="round" />
            <path d={`M ${CX - 12} ${Y_HEAD - 24} Q ${CX + 52} ${Y_HEAD - 78} ${CX + 116} ${Y_HEAD - 24} Z`} fill="#FF6347" stroke={C.outline} strokeWidth="2" />
            <path d={`M ${CX - 12} ${Y_HEAD - 24} Q ${CX + 8} ${Y_HEAD - 33} ${CX + 28} ${Y_HEAD - 24} Q ${CX + 48} ${Y_HEAD - 33} ${CX + 68} ${Y_HEAD - 24} Q ${CX + 88} ${Y_HEAD - 33} ${CX + 116} ${Y_HEAD - 24}`} fill="none" stroke={C.outline} strokeWidth="2" opacity="0.5" />
          </g>
        )}
      </g>
    </svg>
  );
};
