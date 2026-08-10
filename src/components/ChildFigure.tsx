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
const getZone = (t: number): Zone => 
  t <= -15 ? 'arctic' : t <= -5 ? 'winter' : t <= 0 ? 'freeze' : t <= 5 ? 'chilly' : 
  t <= 10 ? 'cool' : t <= 15 ? 'mild' : t <= 20 ? 'warm' : 'hot';

export const ChildFigure: React.FC<ChildFigureProps> = ({ 
  gender, effectiveTemp, isRainy, isSnowy, isWindy, show 
}) => {
  const girl = gender === 'girl';
  const zone = getZone(effectiveTemp);
  
  const isCold = ['arctic', 'winter', 'freeze'].includes(zone);
  const isCool = isCold || ['chilly', 'cool'].includes(zone);
  const isHot = zone === 'hot';
  
  const CX = 120, Y_HEAD = 74, Y_SHOULDER = 126, Y_WAIST = 204, Y_ANKLE = 332;
  const uid = girl ? 'g' : 'b';
  const gid = (n: string) => `${uid}-${n}`;
  
  const P = girl 
    ? { top: '#FFB3D1', upper: '#C9A8F5', outer: '#FF9EC4', bottom: '#B9A0E8', shoes: '#FFFFFF', hat: '#FFE08A', scarf: '#7FE8D8', mitt: '#FF9EAE', under: '#FFFFFF' }
    : { top: '#7FE8D8', upper: '#8FB8FF', outer: '#6C8CFF', bottom: '#7A8BA0', shoes: '#FFFFFF', hat: '#5FD8C5', scarf: '#FF9EAE', mitt: '#8FB8FF', under: '#FFFFFF' };

  const skin = '#FFE4D0';
  const hairColor = girl ? '#9A6238' : '#5A4436';
  const ink = '#3B3148';

  // БЕЗОПАСНЫЕ ПУТИ ДЛЯ RENDER (конкатенация вместо template literals)
  const armL = "M " + (CX-26) + " " + (Y_SHOULDER+8) + " Q " + (CX-44) + " " + (Y_SHOULDER+18) + " " + (CX-48) + " " + (Y_SHOULDER+52) + " Q " + (CX-50) + " " + (Y_SHOULDER+78) + " " + (CX-50) + " " + (Y_SHOULDER+92);
  const armR = "M " + (CX+26) + " " + (Y_SHOULDER+8) + " Q " + (CX+44) + " " + (Y_SHOULDER+18) + " " + (CX+48) + " " + (Y_SHOULDER+52) + " Q " + (CX+50) + " " + (Y_SHOULDER+78) + " " + (CX+50) + " " + (Y_SHOULDER+92);
  const legL = "M " + (CX-14) + " " + (Y_WAIST+16) + " L " + (CX-18) + " " + Y_ANKLE;
  const legR = "M " + (CX+14) + " " + (Y_WAIST+16) + " L " + (CX+18) + " " + Y_ANKLE;

  return (
    <svg viewBox="0 0 240 400" className="h-full w-full select-none">
      <defs>
        <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.1"/>
        </filter>
        <radialGradient id={gid('aura')} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFF" stopOpacity="0.9"/>
          <stop offset="100%" stopColor={girl ? '#FFE1EC' : '#DCEBFF'} stopOpacity="0.4"/>
        </radialGradient>
      </defs>

      {/* ФОНОВЫЙ СЛОЙ: Аура */}
      <ellipse cx={CX} cy={190} rx="110" ry="140" fill={`url(#${gid('aura')})`} />

      <g className="animate-breathe">
        {/* ВОЛОСЫ (задняя часть) */}
        {girl && <g fill={hairColor}><circle cx={CX-40} cy={Y_HEAD+8} r="12"/><circle cx={CX+40} cy={Y_HEAD+8} r="12"/></g>}

        {/* СЛОЙ КОЖИ: Ноги */}
        <g stroke={skin} strokeWidth="16" strokeLinecap="round" fill="none"><path d={legL}/><path d={legR}/></g>

        {/* СЛОЙ 3: НИЖНЯЯ ОДЕЖДА */}
        {show.lower && (
          <g filter={`url(#${uid}-soft)`}>
            {girl && !isCold ? (
              <path d={"M " + (CX-22) + " " + (Y_WAIST-8) + " L " + (CX+22) + " " + (Y_WAIST-8) + " L " + (CX+44) + " " + (Y_WAIST+58) + " Q " + CX + " " + (Y_WAIST+72) + " " + (CX-44) + " " + (Y_WAIST+58) + " Z"} fill={P.bottom} />
            ) : (
              <>
                <rect x={CX-24} y={Y_WAIST-8} width="48" height="28" rx="10" fill={P.bottom} />
                <path d={legL} stroke={P.bottom} strokeWidth="24" strokeLinecap="round" />
                <path d={legR} stroke={P.bottom} strokeWidth="24" strokeLinecap="round" />
              </>
            )}
          </g>
        )}

        {/* СЛОЙ 6: ОБУВЬ */}
        {show.shoes && (
          <g filter={`url(#${uid}-soft)`}>
            {isRainy && !isCold ? (
              <>
                <rect x={CX-33} y={Y_ANKLE-14} width="27" height="38" rx="12" fill="#FBBF24" />
                <rect x={CX+6} y={Y_ANKLE-14} width="27" height="38" rx="12" fill="#FBBF24" />
                <rect x={CX-35} y={Y_ANKLE+20} width="31" height="8" rx="4" fill="#92400E" opacity="0.8" />
                <rect x={CX+4} y={Y_ANKLE+20} width="31" height="8" rx="4" fill="#92400E" opacity="0.8" />
              </>
            ) : isCold ? (
              <>
                <rect x={CX-33} y={Y_ANKLE-14} width="27" height="38" rx="12" fill="#4B5563" />
                <rect x={CX+6} y={Y_ANKLE-14} width="27" height="38" rx="12" fill="#4B5563" />
                <ellipse cx={CX-19.5} cy={Y_ANKLE-12} rx="14" ry="6" fill="#FFF" opacity="0.9" />
                <ellipse cx={CX+19.5} cy={Y_ANKLE-12} rx="14" ry="6" fill="#FFF" opacity="0.9" />
                <rect x={CX-35} y={Y_ANKLE+20} width="31" height="8" rx="4" fill="#1F2937" />
                <rect x={CX+4} y={Y_ANKLE+20} width="31" height="8" rx="4" fill="#1F2937" />
              </>
            ) : isHot ? (
              <>
                <path d={"M " + (CX-32) + " " + (Y_ANKLE+20) + " L " + (CX-6) + " " + (Y_ANKLE+20)} stroke={P.shoesD} strokeWidth="8" strokeLinecap="round" />
                <path d={"M " + (CX-26) + " " + (Y_ANKLE+8) + " L " + (CX-14) + " " + (Y_ANKLE+20)} stroke={P.shoesD} strokeWidth="5" strokeLinecap="round" />
                <path d={"M " + (CX+6) + " " + (Y_ANKLE+20) + " L " + (CX+32) + " " + (Y_ANKLE+20)} stroke={P.shoesD} strokeWidth="8" strokeLinecap="round" />
                <path d={"M " + (CX+14) + " " + (Y_ANKLE+8) + " L " + (CX+26) + " " + (Y_ANKLE+20)} stroke={P.shoesD} strokeWidth="5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <rect x={CX-31} y={Y_ANKLE+4} width="25" height="20" rx="10" fill={P.shoes} />
                <rect x={CX+6} y={Y_ANKLE+4} width="25" height="20" rx="10" fill={P.shoes} />
                <rect x={CX-33} y={Y_ANKLE+20} width="29" height="7" rx="3.5" fill="#9CA3AF" />
                <rect x={CX+4} y={Y_ANKLE+20} width="29" height="7" rx="3.5" fill="#9CA3AF" />
              </>
            )}
          </g>
        )}

        {/* СЛОЙ 1: НАТЕЛЬное БЕЛЬЕ */}
        {show.underwear && (
          <g filter={`url(#${uid}-soft)`}>
            <rect x={CX-24} y={Y_SHOULDER-4} width="48" height="88" rx="18" fill={P.under} />
            {!isCold && <line x1={CX-16} y1={Y_SHOULDER-4} x2={CX-13} y2={Y_SHOULDER+6} stroke={P.under} strokeWidth="5" strokeLinecap="round" />}
            {!isCold && <line x1={CX+16} y1={Y_SHOULDER-4} x2={CX+13} y2={Y_SHOULDER+6} stroke={P.under} strokeWidth="5" strokeLinecap="round" />}
          </g>
        )}

        {/* СЛОЙ 2: ВЕРХНИЙ СЛОЙ */}
        {(show.upper && (isCool || zone === 'mild')) && (
          <g filter={`url(#${uid}-soft)`}>
            <path d={armL} stroke={P.upper} strokeWidth="26" strokeLinecap="round" fill="none" />
            <path d={armR} stroke={P.upper} strokeWidth="26" strokeLinecap="round" fill="none" />
            <rect x={CX-28} y={Y_SHOULDER-8} width="56" height="96" rx="24" fill={P.upper} />
            <path d={"M " + (CX-15) + " " + (Y_SHOULDER-8) + " Q " + CX + " " + (Y_SHOULDER+16) + " " + (CX+15) + " " + (Y_SHOULDER-8)} fill={P.top} />
          </g>
        )}

        {/* СЛОЙ 4: ВЕРХНЯЯ ОДЕЖДА */}
        {show.outer && (
          <g filter={`url(#${uid}-soft)`}>
            <path d={armL} stroke={P.outer} strokeWidth="32" strokeLinecap="round" fill="none" />
            <path d={armR} stroke={P.outer} strokeWidth="32" strokeLinecap="round" fill="none" />
            <rect x={CX-32} y={Y_SHOULDER-10} width="64" height="106" rx="28" fill={P.outer} />
            <line x1={CX} y1={Y_SHOULDER-8} x2={CX} y2={Y_WAIST+26} stroke="#000" strokeWidth="2" opacity="0.1" />
          </g>
        )}

        {/* СЛОЙ КОЖИ: Торс и руки */}
        <rect x={CX-22} y={Y_SHOULDER} width="44" height="82" rx="20" fill={skin} />
        <g stroke={skin} strokeWidth="13" strokeLinecap="round" fill="none"><path d={armL}/><path d={armR}/></g>

        {/* ГОЛОВА И ЛИЦО */}
        <g>
          <circle cx={CX} cy={Y_HEAD} r="35" fill={skin} />
          {/* Волосы спереди (БЕЗОПАСНЫЙ ФОРМАТ) */}
          <g fill={hairColor}>
            {girl ? (
              <path d={"M " + (CX-35) + " " + (Y_HEAD-5) + " Q " + CX + " " + (Y_HEAD-25) + " " + (CX+35) + " " + (Y_HEAD-5) + " Q " + (CX+38) + " " + (Y_HEAD-35) + " " + CX + " " + (Y_HEAD-38) + " Q " + (CX-38) + " " + (Y_HEAD-35) + " " + (CX-35) + " " + (Y_HEAD-5) + " Z"} />
            ) : (
              <path d={"M " + (CX-35) + " " + (Y_HEAD-10) + " Q " + (CX-20) + " " + (Y_HEAD-30) + " " + CX + " " + (Y_HEAD-25) + " Q " + (CX+20) + " " + (Y_HEAD-35) + " " + (CX+35) + " " + (Y_HEAD-15) + " Q " + (CX+40) + " " + (Y_HEAD-40) + " " + CX + " " + (Y_HEAD-45) + " Q " + (CX-40) + " " + (Y_HEAD-40) + " " + (CX-35) + " " + (Y_HEAD-10) + " Z"} />
            )}
          </g>
          {/* Глаза */}
          <ellipse cx={CX-12} cy={Y_HEAD+5} rx="6" ry="6.5" fill="#FFF" /><circle cx={CX-12} cy={Y_HEAD+6} r="4" fill={ink} />
          <ellipse cx={CX+12} cy={Y_HEAD+5} rx="6" ry="6.5" fill="#FFF" /><circle cx={CX+12} cy={Y_HEAD+6} r="4" fill={ink} />
          {/* Румянец */}
          <circle cx={CX-20} cy={Y_HEAD+13} r={isCold ? 8 : 6} fill="#FF9E9E" opacity="0.6" />
          <circle cx={CX+20} cy={Y_HEAD+13} r={isCold ? 8 : 6} fill="#FF9E9E" opacity="0.6" />
          {/* Рот */}
          {isHot ? <path d={"M " + (CX-7) + " " + (Y_HEAD+19) + " Q " + CX + " " + (Y_HEAD+30) + " " + (CX+7) + " " + (Y_HEAD+19) + " Z"} fill={ink} />
                 : <path d={"M " + (CX-6) + " " + (Y_HEAD+20) + " Q " + CX + " " + (Y_HEAD+27) + " " + (CX+6) + " " + (Y_HEAD+20)} fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />}
        </g>

        {/* СЛОЙ 5: ГОЛОВНОЙ УБОР */}
        {show.headwear && (
          <g>
            {isHot ? <ellipse cx={CX} cy={Y_HEAD-24} rx="46" ry="12" fill={P.hat} />
                   : <path d={"M " + (CX-34) + " " + (Y_HEAD-14) + " Q " + CX + " " + (Y_HEAD-56) + " " + (CX+34) + " " + (Y_HEAD-14) + " Z"} fill={P.hat} />}
          </g>
        )}

        {/* СЛОЙ 7: АКСЕССУАРЫ */}
        {isCold && show.accessory && <g><circle cx={CX-50} cy={Y_SHOULDER+95} r="12" fill={P.mitt} /><circle cx={CX+50} cy={Y_SHOULDER+95} r="12" fill={P.mitt} /></g>}
        {isCool && show.accessory && <rect x={CX-22} y={Y_SHOULDER-18} width="44" height="17" rx="8" fill={P.scarf} />}
      </g>
    </svg>
  );
};
