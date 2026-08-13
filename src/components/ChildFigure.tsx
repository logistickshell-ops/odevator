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

type TemperatureZone = 'arctic' | 'winter' | 'freeze' | 'chilly' | 'cool' | 'mild' | 'warm' | 'hot';

const temperatureZone = (temperature: number): TemperatureZone => {
  if (temperature <= -15) return 'arctic';
  if (temperature <= -5) return 'winter';
  if (temperature <= 0) return 'freeze';
  if (temperature <= 5) return 'chilly';
  if (temperature <= 10) return 'cool';
  if (temperature <= 15) return 'mild';
  if (temperature <= 20) return 'warm';
  return 'hot';
};

/**
 * Премиальная векторная иллюстрация ребёнка. Каждый предмет одежды остаётся
 * независимым SVG-слоем, поэтому панель видимости в AvatarVisualizer работает
 * без изменений.
 */
export const ChildFigure: React.FC<ChildFigureProps> = ({
  gender,
  effectiveTemp,
  isRainy,
  isSnowy,
  isWindy,
  show,
}) => {
  const isGirl = gender === 'girl';
  const zone = temperatureZone(effectiveTemp);
  const isCold = ['arctic', 'winter', 'freeze'].includes(zone);
  const isCool = isCold || ['chilly', 'cool'].includes(zone);
  const isHot = zone === 'hot';
  const isWarm = zone === 'warm';
  const shortSleeve = isHot || isWarm;
  const uid = isGirl ? 'girl' : 'boy';
  const id = (name: string) => `${uid}-${name}`;

  const palette = isGirl
    ? {
        hair: ['#9A5539', '#5D2F2B'],
        shirt: ['#A7E5D0', '#53B99B'],
        knit: ['#BEB1F2', '#806FD0'],
        coat: ['#FFB3D1', '#E56EAB'],
        bottom: ['#B7A1EA', '#7960C3'],
        hat: ['#FFD993', '#E9A936'],
        scarf: ['#78D6D0', '#35ABA9'],
        mittens: ['#FFB1BF', '#E76582'],
        shoe: ['#FFFFFF', '#C7D7EE'],
      }
    : {
        hair: ['#694F3D', '#37281F'],
        shirt: ['#9FE0D9', '#48AEAC'],
        knit: ['#A4C3FF', '#5C85DE'],
        coat: ['#8DA7FF', '#4E65D8'],
        bottom: ['#8595B3', '#53637E'],
        hat: ['#7DE0C7', '#2C9E96'],
        scarf: ['#FFAEB8', '#E56883'],
        mittens: ['#9FC3FF', '#5E83D7'],
        shoe: ['#FFFFFF', '#C9DCF1'],
      };

  const C = 150;
  const shoulderY = 164;
  const waistY = 254;
  const ankleY = 381;
  const armLeft = `M ${C - 32} ${shoulderY + 14} C ${C - 58} ${shoulderY + 30}, ${C - 59} ${shoulderY + 73}, ${C - 53} ${shoulderY + 101}`;
  const armRight = `M ${C + 32} ${shoulderY + 14} C ${C + 58} ${shoulderY + 30}, ${C + 59} ${shoulderY + 73}, ${C + 53} ${shoulderY + 101}`;
  const legLeft = `M ${C - 18} ${waistY + 12} C ${C - 25} 303, ${C - 25} 346, ${C - 24} ${ankleY}`;
  const legRight = `M ${C + 18} ${waistY + 12} C ${C + 25} 303, ${C + 25} 346, ${C + 24} ${ankleY}`;

  const gradient = (name: string, colors: string[]) => (
    <linearGradient id={id(name)} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={colors[0]} />
      <stop offset="100%" stopColor={colors[1]} />
    </linearGradient>
  );

  return (
    <svg viewBox="0 0 300 450" className="h-full w-full select-none" role="img" aria-label="Ребёнок, одетый по погоде">
      <defs>
        <filter id={id('shadow')} x="-40%" y="-40%" width="180%" height="190%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#312E5B" floodOpacity="0.16" />
        </filter>
        <filter id={id('soft')} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <radialGradient id={id('halo')} cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.96" />
          <stop offset="65%" stopColor={isGirl ? '#FFE2F1' : '#DDECFF'} stopOpacity="0.72" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id('cheek')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={isCold ? '#F26E79' : '#FFABB1'} stopOpacity="0.78" />
          <stop offset="100%" stopColor="#FFABB1" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id('skin')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE9D8" />
          <stop offset="100%" stopColor="#F3B993" />
        </linearGradient>
        <linearGradient id={id('light')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.38" />
          <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id('ground')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#312E5B" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#312E5B" stopOpacity="0" />
        </linearGradient>
        {gradient('hair', palette.hair)}
        {gradient('shirt', palette.shirt)}
        {gradient('knit', palette.knit)}
        {gradient('coat', palette.coat)}
        {gradient('bottom', palette.bottom)}
        {gradient('hat', palette.hat)}
        {gradient('scarf', palette.scarf)}
        {gradient('mittens', palette.mittens)}
        {gradient('shoe', palette.shoe)}
        <linearGradient id={id('underwear')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E7EAF4" />
        </linearGradient>
      </defs>

      <ellipse cx={C} cy="224" rx="137" ry="194" fill={`url(#${id('halo')})`} />
      <ellipse cx={C} cy="414" rx="89" ry="13" fill={`url(#${id('ground')})`} />

      {(isSnowy || isRainy) && (
        <g aria-hidden="true" opacity="0.8">
          {Array.from({ length: 7 }, (_, index) => {
            const x = 28 + index * 41;
            const y = 56 + (index % 3) * 57;
            return isSnowy ? (
              <g key={x} className="animate-float" style={{ animationDuration: `${2.8 + index * 0.15}s` }}>
                <circle cx={x} cy={y} r={index % 2 === 0 ? 3 : 2} fill="#FFFFFF" />
                <path d={`M ${x - 5} ${y} H ${x + 5} M ${x} ${y - 5} V ${y + 5}`} stroke="#DDF4FF" strokeWidth="1.1" strokeLinecap="round" />
              </g>
            ) : (
              <path key={x} d={`M ${x} ${y} l -8 20`} stroke="#6FADE3" strokeWidth="3" strokeLinecap="round" />
            );
          })}
        </g>
      )}

      <g className="animate-breathe">
        {/* Волосы за головой для объёмного силуэта */}
        {isGirl && (
          <g fill={`url(#${id('hair')})`} filter={`url(#${id('shadow')})`}>
            <ellipse cx="99" cy="108" rx="21" ry="37" />
            <ellipse cx="201" cy="108" rx="21" ry="37" />
            <circle cx="93" cy="137" r="15" />
            <circle cx="207" cy="137" r="15" />
            <path d="M 83 124 Q 70 147 86 158 Q 103 147 100 125 Z" opacity="0.88" />
            <path d="M 217 124 Q 230 147 214 158 Q 197 147 200 125 Z" opacity="0.88" />
          </g>
        )}

        {/* Ноги и базовые кисти: всегда находятся под одеждой */}
        <g fill="none" stroke={`url(#${id('skin')})`} strokeWidth="21" strokeLinecap="round" filter={`url(#${id('shadow')})`}>
          <path d={legLeft} />
          <path d={legRight} />
        </g>

        {show.underwear && (
          <g filter={`url(#${id('shadow')})`}>
            <path d={`M ${C - 28} ${waistY - 8} Q ${C} ${waistY + 6} ${C + 28} ${waistY - 8} L ${C + 24} ${waistY + 24} Q ${C} ${waistY + 35} ${C - 24} ${waistY + 24} Z`} fill={`url(#${id('underwear')})`} />
            <rect x={C - 29} y={shoulderY - 4} width="58" height="94" rx="24" fill={`url(#${id('underwear')})`} />
            <path d={`M ${C - 16} ${shoulderY - 4} Q ${C} ${shoulderY + 17} ${C + 16} ${shoulderY - 4}`} fill={`url(#${id('skin')})`} />
            {isCold && (
              <g stroke="#C7CCDB" strokeWidth="2" strokeDasharray="3 4" opacity="0.9">
                <path d={legLeft} /><path d={legRight} />
              </g>
            )}
          </g>
        )}

        {/* Нижний слой: юбка с легинсами или брюки/шорты */}
        {show.lower && (
          <g filter={`url(#${id('shadow')})`}>
            {isGirl && !isCold && !['chilly', 'cool'].includes(zone) ? (
              <>
                <path d={`M ${C - 28} ${waistY - 9} L ${C + 28} ${waistY - 9} L ${C + 47} ${waistY + 61} Q ${C} ${waistY + 79} ${C - 47} ${waistY + 61} Z`} fill={`url(#${id('bottom')})`} />
                <path d={`M ${C - 28} ${waistY - 9} L ${C + 28} ${waistY - 9} L ${C + 47} ${waistY + 61} Q ${C} ${waistY + 79} ${C - 47} ${waistY + 61} Z`} fill={`url(#${id('light')})`} />
                {[-25, -12, 0, 12, 25].map((offset) => <path key={offset} d={`M ${C + offset * 0.65} ${waistY} L ${C + offset} ${waistY + 57}`} stroke="#433060" strokeOpacity="0.17" strokeWidth="2" />)}
                <path d={legLeft} stroke={`url(#${id('bottom')})`} strokeWidth="27" strokeLinecap="round" fill="none" />
                <path d={legRight} stroke={`url(#${id('bottom')})`} strokeWidth="27" strokeLinecap="round" fill="none" />
              </>
            ) : isHot && !isGirl ? (
              <>
                <rect x={C - 30} y={waistY - 9} width="60" height="33" rx="11" fill={`url(#${id('bottom')})`} />
                <path d={`M ${C - 18} ${waistY + 15} L ${C - 21} ${waistY + 54}`} stroke={`url(#${id('bottom')})`} strokeWidth="29" strokeLinecap="round" />
                <path d={`M ${C + 18} ${waistY + 15} L ${C + 21} ${waistY + 54}`} stroke={`url(#${id('bottom')})`} strokeWidth="29" strokeLinecap="round" />
              </>
            ) : (
              <>
                <rect x={C - 30} y={waistY - 9} width="60" height="33" rx="11" fill={`url(#${id('bottom')})`} />
                <path d={legLeft} stroke={`url(#${id('bottom')})`} strokeWidth="29" strokeLinecap="round" fill="none" />
                <path d={legRight} stroke={`url(#${id('bottom')})`} strokeWidth="29" strokeLinecap="round" fill="none" />
                <path d={`M ${C - 26} ${waistY + 29} L ${C - 25} ${ankleY - 16} M ${C + 26} ${waistY + 29} L ${C + 25} ${ankleY - 16}`} stroke="#FFFFFF" strokeOpacity="0.2" strokeWidth="2.3" strokeLinecap="round" />
              </>
            )}
          </g>
        )}

        {/* Обувь */}
        {show.shoes ? (
          <g filter={`url(#${id('shadow')})`}>
            {isCold ? (
              <>
                <path d={`M ${C - 39} ${ankleY - 16} Q ${C - 22} ${ankleY - 25} ${C - 7} ${ankleY - 12} L ${C - 6} ${ankleY + 27} L ${C - 42} ${ankleY + 27} Z`} fill={`url(#${id('shoe')})`} />
                <path d={`M ${C + 39} ${ankleY - 16} Q ${C + 22} ${ankleY - 25} ${C + 7} ${ankleY - 12} L ${C + 6} ${ankleY + 27} L ${C + 42} ${ankleY + 27} Z`} fill={`url(#${id('shoe')})`} />
                <path d={`M ${C - 43} ${ankleY + 25} H ${C - 5} M ${C + 5} ${ankleY + 25} H ${C + 43}`} stroke="#3C4969" strokeWidth="6" strokeLinecap="round" />
              </>
            ) : (
              <>
                <path d={`M ${C - 42} ${ankleY + 15} Q ${C - 29} ${ankleY - 3} ${C - 10} ${ankleY + 10} L ${C - 3} ${ankleY + 27} Q ${C - 24} ${ankleY + 35} ${C - 45} ${ankleY + 29} Z`} fill={`url(#${id('shoe')})`} />
                <path d={`M ${C + 42} ${ankleY + 15} Q ${C + 29} ${ankleY - 3} ${C + 10} ${ankleY + 10} L ${C + 3} ${ankleY + 27} Q ${C + 24} ${ankleY + 35} ${C + 45} ${ankleY + 29} Z`} fill={`url(#${id('shoe')})`} />
                <path d={`M ${C - 35} ${ankleY + 10} L ${C - 16} ${ankleY + 18} M ${C - 35} ${ankleY + 17} L ${C - 14} ${ankleY + 24} M ${C + 35} ${ankleY + 10} L ${C + 16} ${ankleY + 18} M ${C + 35} ${ankleY + 17} L ${C + 14} ${ankleY + 24}`} stroke={palette.shoe[1]} strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </g>
        ) : (
          <g fill={`url(#${id('skin')})`}>
            <ellipse cx={C - 24} cy={ankleY + 17} rx="15" ry="9" /><ellipse cx={C + 24} cy={ankleY + 17} rx="15" ry="9" />
          </g>
        )}

        {/* Тело и руки */}
        <rect x={C - 28} y={shoulderY} width="56" height="94" rx="25" fill={`url(#${id('skin')})`} />
        <g fill="none" stroke={`url(#${id('skin')})`} strokeWidth="16" strokeLinecap="round" filter={`url(#${id('shadow')})`}>
          <path d={armLeft} /><path d={armRight} />
        </g>

        {/* Повседневный верх */}
        {show.lower && (
          <g filter={`url(#${id('shadow')})`}>
            <path d={shortSleeve ? `M ${C - 29} ${shoulderY + 14} Q ${C - 42} ${shoulderY + 24} ${C - 43} ${shoulderY + 43}` : armLeft} stroke={`url(#${id('shirt')})`} strokeWidth={shortSleeve ? 22 : 23} strokeLinecap="round" fill="none" />
            <path d={shortSleeve ? `M ${C + 29} ${shoulderY + 14} Q ${C + 42} ${shoulderY + 24} ${C + 43} ${shoulderY + 43}` : armRight} stroke={`url(#${id('shirt')})`} strokeWidth={shortSleeve ? 22 : 23} strokeLinecap="round" fill="none" />
            <rect x={C - 31} y={shoulderY - 5} width="62" height="98" rx="25" fill={`url(#${id('shirt')})`} />
            <rect x={C - 31} y={shoulderY - 5} width="62" height="98" rx="25" fill={`url(#${id('light')})`} />
            <path d={`M ${C - 18} ${shoulderY - 5} Q ${C} ${shoulderY + 19} ${C + 18} ${shoulderY - 5}`} fill={show.underwear ? `url(#${id('underwear')})` : `url(#${id('skin')})`} />
            <path d={`M ${C - 15} ${shoulderY + 74} Q ${C} ${shoulderY + 82} ${C + 15} ${shoulderY + 74}`} stroke="#FFFFFF" strokeWidth="3" strokeOpacity="0.24" strokeLinecap="round" />
          </g>
        )}

        {/* Утепляющий слой */}
        {show.upper && (isCool || zone === 'mild') && (
          <g filter={`url(#${id('shadow')})`}>
            <path d={armLeft} stroke={`url(#${id('knit')})`} strokeWidth="30" strokeLinecap="round" fill="none" />
            <path d={armRight} stroke={`url(#${id('knit')})`} strokeWidth="30" strokeLinecap="round" fill="none" />
            <rect x={C - 35} y={shoulderY - 10} width="70" height="105" rx="29" fill={`url(#${id('knit')})`} />
            <rect x={C - 35} y={shoulderY - 10} width="70" height="105" rx="29" fill={`url(#${id('light')})`} />
            <path d={`M ${C - 23} ${shoulderY - 10} Q ${C} ${shoulderY + 24} ${C + 23} ${shoulderY - 10} L ${C + 15} ${shoulderY + 3} Q ${C} ${shoulderY + 17} ${C - 15} ${shoulderY + 3} Z`} fill={`url(#${id('shirt')})`} />
            <path d={`M ${C - 20} ${waistY - 8} H ${C + 20} L ${C + 28} ${waistY + 20} H ${C - 28} Z`} fill="#FFFFFF" fillOpacity="0.14" />
            <path d={`M ${C - 9} ${shoulderY + 11} v 21 M ${C + 9} ${shoulderY + 11} v 21`} stroke="#FFFFFF" strokeOpacity="0.85" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {/* Верхняя одежда */}
        {show.outer && (
          <g filter={`url(#${id('shadow')})`}>
            <path d={armLeft} stroke={`url(#${id('coat')})`} strokeWidth="37" strokeLinecap="round" fill="none" />
            <path d={armRight} stroke={`url(#${id('coat')})`} strokeWidth="37" strokeLinecap="round" fill="none" />
            <rect x={C - 41} y={shoulderY - 13} width="82" height="116" rx="34" fill={`url(#${id('coat')})`} />
            <rect x={C - 41} y={shoulderY - 13} width="82" height="116" rx="34" fill={`url(#${id('light')})`} />
            <path d={`M ${C} ${shoulderY - 8} V ${waistY + 31}`} stroke="#5B466B" strokeOpacity="0.36" strokeWidth="3" strokeLinecap="round" />
            <circle cx={C} cy={shoulderY + 8} r="3" fill="#FFF7D8" /><circle cx={C} cy={shoulderY + 29} r="3" fill="#FFF7D8" />
            <rect x={C - 33} y={waistY - 2} width="20" height="20" rx="7" fill="#5B466B" fillOpacity="0.15" />
            <rect x={C + 13} y={waistY - 2} width="20" height="20" rx="7" fill="#5B466B" fillOpacity="0.15" />
            {isRainy && <path d={`M ${C - 28} ${shoulderY + 7} Q ${C - 11} ${shoulderY + 43} ${C - 27} ${shoulderY + 78}`} stroke="#FFFFFF" strokeWidth="4" strokeOpacity="0.4" strokeLinecap="round" fill="none" />}
            {['arctic', 'winter'].includes(zone) && !isRainy && <path d={`M ${C - 30} ${shoulderY - 12} Q ${C} ${shoulderY - 40} ${C + 30} ${shoulderY - 12} Q ${C} ${shoulderY + 5} ${C - 30} ${shoulderY - 12} Z`} fill="#FFFDF7" />}
          </g>
        )}

        {/* Шарф и варежки */}
        {isCool && show.accessory && (
          <g filter={`url(#${id('shadow')})`}>
            <rect x={C - 30} y={shoulderY - 23} width="60" height="20" rx="10" fill={`url(#${id('scarf')})`} />
            <path d={isWindy ? `M ${C - 15} ${shoulderY - 4} Q ${C - 37} ${shoulderY + 22} ${C - 67} ${shoulderY + 30} L ${C - 57} ${shoulderY + 44} Q ${C - 27} ${shoulderY + 34} ${C - 3} ${shoulderY + 1} Z` : `M ${C - 15} ${shoulderY - 4} L ${C - 9} ${shoulderY + 40} L ${C + 7} ${shoulderY + 37} L ${C + 2} ${shoulderY - 4} Z`} fill={`url(#${id('scarf')})`} />
            <path d={`M ${C - 28} ${shoulderY - 14} H ${C + 28}`} stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.35" strokeDasharray="3 3" />
          </g>
        )}
        {isCold && show.accessory ? (
          <g filter={`url(#${id('shadow')})`}>
            <circle cx={C - 55} cy={shoulderY + 108} r="13" fill={`url(#${id('mittens')})`} />
            <circle cx={C + 55} cy={shoulderY + 108} r="13" fill={`url(#${id('mittens')})`} />
            <path d={`M ${C - 63} ${shoulderY + 99} H ${C - 47} M ${C + 47} ${shoulderY + 99} H ${C + 63}`} stroke="#FFFFFF" strokeOpacity="0.78" strokeWidth="3" strokeLinecap="round" />
          </g>
        ) : (
          <g fill={`url(#${id('skin')})`}><circle cx={C - 53} cy={shoulderY + 105} r="9" /><circle cx={C + 53} cy={shoulderY + 105} r="9" /></g>
        )}

        {/* Шея и голова */}
        <rect x={C - 10} y="119" width="20" height="35" rx="8" fill={`url(#${id('skin')})`} />
        <g filter={`url(#${id('shadow')})`}>
          <ellipse cx={C} cy="91" rx="48" ry="50" fill={`url(#${id('skin')})`} />
          <path d="M 104 65 Q 150 38 196 65 Q 208 47 189 31 Q 152 7 111 31 Q 91 48 104 65 Z" fill={`url(#${id('hair')})`} />
          {isGirl ? (
            <>
              <path d="M 107 73 Q 126 46 148 64 Q 159 49 187 66 Q 183 42 151 33 Q 112 38 107 73 Z" fill={palette.hair[0]} fillOpacity="0.55" />
              <path d="M 106 68 Q 116 81 128 68 Q 139 84 151 67 Q 163 82 177 66 Q 188 78 195 65" stroke={palette.hair[1]} strokeWidth="2" strokeOpacity="0.32" fill="none" />
            </>
          ) : (
            <>
              <path d="M 103 71 Q 113 43 135 55 Q 150 37 164 56 Q 183 40 198 68 Q 194 37 158 26 Q 116 28 103 71 Z" fill={palette.hair[0]} />
              <path d="M 111 57 Q 124 44 137 56 Q 149 45 161 56 Q 175 45 190 61" stroke="#C7966D" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          )}

          <g stroke={palette.hair[1]} strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 119 85 Q 127 80 136 85" /><path d="M 164 85 Q 173 80 181 85" />
          </g>
          <g fill="#FFFFFF"><ellipse cx="128" cy="100" rx="9" ry="10" /><ellipse cx="172" cy="100" rx="9" ry="10" /></g>
          <g fill="#453241"><circle cx="129" cy="101" r="6" /><circle cx="171" cy="101" r="6" /></g>
          <g fill="#FFFFFF"><circle cx="127" cy="98" r="2.5" /><circle cx="169" cy="98" r="2.5" /></g>
          {isGirl && <g stroke="#453241" strokeWidth="1.8" strokeLinecap="round"><path d="M 118 96 l -4 -3 M 181 96 l 4 -3" /></g>}
          <circle cx="150" cy="112" r="2.7" fill="#D68E79" fillOpacity="0.48" />
          <circle cx="119" cy="119" r={isCold ? 10 : 8} fill={`url(#${id('cheek')})`} /><circle cx="181" cy="119" r={isCold ? 10 : 8} fill={`url(#${id('cheek')})`} />
          <path d={isHot ? 'M 140 127 Q 150 144 160 127 Z' : 'M 140 128 Q 150 139 160 128'} fill={isHot ? '#4B3340' : 'none'} stroke="#4B3340" strokeWidth="2.8" strokeLinecap="round" />
          {!isGirl && <g fill="#C58B73" fillOpacity="0.65"><circle cx="116" cy="114" r="1.3" /><circle cx="121" cy="117" r="1.2" /><circle cx="184" cy="114" r="1.3" /><circle cx="179" cy="117" r="1.2" /></g>}
          {isCold && <g className="animate-float" opacity="0.48" style={{ animationDuration: '2.2s' }}><ellipse cx="178" cy="137" rx="9" ry="4" fill="#FFFFFF" /><ellipse cx="192" cy="129" rx="6" ry="3" fill="#FFFFFF" /></g>}
        </g>

        {/* Головной убор */}
        {show.headwear && (
          <g filter={`url(#${id('shadow')})`}>
            {isHot ? (
              <>
                <ellipse cx={C} cy="49" rx="62" ry="15" fill={`url(#${id('hat')})`} />
                <path d={`M ${C - 35} 49 Q ${C} 4 ${C + 35} 49 Z`} fill={`url(#${id('hat')})`} />
                <path d={`M ${C - 28} 44 H ${C + 28}`} stroke={palette.hat[1]} strokeWidth="8" strokeLinecap="round" />
              </>
            ) : zone === 'warm' || zone === 'mild' ? (
              <>
                <path d={`M ${C - 43} 59 Q ${C} 12 ${C + 43} 59 Z`} fill={`url(#${id('hat')})`} />
                <path d={`M ${C + 2} 53 Q ${C + 40} 46 ${C + 58} 63 Q ${C + 25} 72 ${C + 2} 63 Z`} fill={palette.hat[1]} />
                <circle cx={C - 4} cy="36" r="4" fill="#FFFFFF" fillOpacity="0.55" />
              </>
            ) : (
              <>
                <path d={`M ${C - 45} 62 Q ${C} 6 ${C + 45} 62 Z`} fill={`url(#${id('hat')})`} />
                <rect x={C - 47} y="57" width="94" height="18" rx="9" fill={palette.hat[1]} />
                {['arctic', 'winter'].includes(zone) && <circle cx={C} cy="17" r="14" fill="#FFFDF7" />}
                <path d={`M ${C - 30} 58 H ${C + 30}`} stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="4 3" />
              </>
            )}
          </g>
        )}

        {isHot && show.accessory && (
          <g stroke="#27334E" strokeWidth="3" fill="#33415F" filter={`url(#${id('shadow')})`}>
            <rect x="109" y="92" width="28" height="17" rx="7" /><rect x="163" y="92" width="28" height="17" rx="7" />
            <path d="M 137 100 H 163" /><path d="M 114 95 L 128 106 M 168 95 L 182 106" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="2" />
          </g>
        )}

        {isRainy && show.accessory && (
          <g className="animate-float" style={{ animationDuration: '3.6s' }} filter={`url(#${id('shadow')})`}>
            <path d="M 231 236 V 85" stroke="#4B5970" strokeWidth="5" strokeLinecap="round" />
            <path d="M 164 102 Q 231 35 298 102 Z" fill="#F45B6F" />
            <path d="M 164 102 Q 186 88 208 102 Q 231 88 253 102 Q 276 88 298 102" fill="none" stroke="#B73C55" strokeWidth="2.5" />
            <path d="M 231 236 q 0 16 -11 16 q -8 0 -8 -8" fill="none" stroke="#4B5970" strokeWidth="5" strokeLinecap="round" />
          </g>
        )}
      </g>
    </svg>
  );
};
