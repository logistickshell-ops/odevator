import React from 'react';
import { ChildGender } from '../types';

interface ChildFigureProps {
  gender: ChildGender;
  effectiveTemp: number;
  isRainy: boolean;
  isSnowy: boolean;
  isWindy: boolean;
  showOuter: boolean;
  showMiddle: boolean;
}

type WeatherZone = 'arctic' | 'winter' | 'freeze' | 'chilly' | 'cool' | 'mild' | 'warm' | 'hot';

const zoneFromTemp = (temp: number): WeatherZone => {
  if (temp <= -15) return 'arctic';
  if (temp <= -5) return 'winter';
  if (temp <= 0) return 'freeze';
  if (temp <= 5) return 'chilly';
  if (temp <= 10) return 'cool';
  if (temp <= 15) return 'mild';
  if (temp <= 20) return 'warm';
  return 'hot';
};

export const ChildFigure: React.FC<ChildFigureProps> = ({
  gender, effectiveTemp, isRainy, isSnowy, isWindy, showOuter, showMiddle,
}) => {
  const girl = gender === 'girl';
  const zone = zoneFromTemp(effectiveTemp);
  const cold = ['arctic', 'winter', 'freeze'].includes(zone);
  const cool = ['arctic', 'winter', 'freeze', 'chilly', 'cool'].includes(zone);
  const hot = zone === 'hot';
  const warm = zone === 'warm' || hot;
  
  const rainShell = isRainy && !['arctic', 'winter', 'freeze', 'chilly', 'cool'].includes(zone);
  const needsOuter = ['arctic', 'winter', 'freeze', 'chilly', 'cool', 'mild'].includes(zone) || rainShell;
  const needsMiddle = ['arctic', 'winter', 'freeze', 'chilly', 'cool', 'mild', 'warm'].includes(zone) && !rainShell;
  
  const drawOuter = needsOuter && (showOuter || rainShell);
  const drawMiddle = needsMiddle && showMiddle;
  
  const drawSkirt = girl && (warm || zone === 'mild');
  const drawShorts = !girl && hot;
  const showBaseLongSleeve = !warm;
  const drawBoots = cool || isSnowy || (isRainy && !hot);
  const drawSandals = hot && !isRainy;

  // Modern, beautiful color palettes
  const C = (() => {
    if (zone === 'arctic') return {
      top: girl ? '#FFAFCC' : '#BAE6FD',
      mid: girl ? '#C084FC' : '#60A5FA', 
      outer: girl ? '#E11D48' : '#1E3A8A', outerDetail: girl ? '#BE123C' : '#172554',
      bottom: girl ? '#FBCFE8' : '#7DD3FC',
      shoes: '#44403C', shoesDetail: '#292524', hat: girl ? '#E11D48' : '#1E3A8A', scarf: '#FBBF24',
    };
    if (zone === 'winter') return {
      top: girl ? '#FCE7F3' : '#E0F2FE',
      mid: girl ? '#E9D5FF' : '#93C5FD',
      outer: girl ? '#F43F5E' : '#2563EB', outerDetail: girl ? '#E11D48' : '#1D4ED8',
      bottom: girl ? '#F9A8D4' : '#BFDBFE',
      shoes: '#57534E', shoesDetail: '#44403C', hat: girl ? '#F43F5E' : '#2563EB', scarf: '#F59E0B',
    };
    if (zone === 'freeze') return {
      top: girl ? '#FEF2F2' : '#F0FDF4',
      mid: girl ? '#FDBA74' : '#6EE7B7',
      outer: girl ? '#D946EF' : '#0EA5E9', outerDetail: girl ? '#C084FC' : '#0284C7',
      bottom: girl ? '#E9D5FF' : '#A7F3D0',
      shoes: '#78350F', shoesDetail: '#451A03', hat: girl ? '#D946EF' : '#0EA5E9', scarf: '#FB923C',
    };
    if (zone === 'chilly') return {
      top: girl ? '#FFF1F2' : '#F0FDFA',
      mid: girl ? '#FDA4AF' : '#5EEAD4',
      outer: girl ? '#FB7185' : '#14B8A6', outerDetail: girl ? '#F43F5E' : '#0D9488',
      bottom: '#64748B', shoes: '#292524', shoesDetail: '#1C1917', hat: girl ? '#FB7185' : '#14B8A6', scarf: '#F59E0B',
    };
    if (zone === 'cool') return {
      top: girl ? '#FDF2F8' : '#F0FDF4',
      mid: girl ? '#F9A8D4' : '#86EFAC',
      outer: girl ? '#FBBF24' : '#10B981', outerDetail: girl ? '#F59E0B' : '#059669',
      bottom: '#475569', shoes: '#475569', shoesDetail: '#334155', hat: girl ? '#FBBF24' : '#10B981', scarf: '',
    };
    if (zone === 'mild') return {
      top: girl ? '#FFF7ED' : '#F0FDF4',
      mid: girl ? '#FDE68A' : '#A7F3D0',
      outer: girl ? '#FCD34D' : '#34D399', outerDetail: girl ? '#F59E0B' : '#10B981',
      bottom: girl ? '#C084FC' : '#64748B', shoes: '#94A3B8', shoesDetail: '#64748B', hat: '', scarf: '',
    };
    if (zone === 'warm') return {
      top: girl ? '#FBCFE8' : '#FEF08A',
      mid: girl ? '#F9A8D4' : '#FDE047',
      outer: '', outerDetail: '',
      bottom: girl ? '#F472B6' : '#7DD3FC',
      shoes: '#F59E0B', shoesDetail: '#D97706', hat: '', scarf: '',
    };
    return { // hot
      top: girl ? '#FDE047' : '#BAE6FD',
      mid: '', outer: '', outerDetail: '',
      bottom: girl ? '#FCD34D' : '#38BDF8',
      shoes: '#FBBF24', shoesDetail: '#F59E0B', hat: '#FDE047', scarf: '',
    };
  })();

  const shellMain = rainShell ? '#38BDF8' : C.outer;
  const shellDetail = rainShell ? '#0284C7' : C.outerDetail;

  const skin = '#FDE0C4';
  const skinShadow = '#E6C2A1';
  const blush = '#FFB7B2';
  const hair = girl ? '#9E5C41' : '#6B4C3A';
  const ink = '#4A3B32';

  // Layout Constants for perfect symmetrical alignment
  const CX = 120; // Center X
  const Y_HEAD = 75;
  const Y_SHOULDER = 120;
  const Y_WAIST = 190;
  const Y_ANKLE = 330;
  
  // Bezier curve definitions for limbs (L = Left, R = Right)
  const armL = `M ${CX - 25} ${Y_SHOULDER + 10} Q ${CX - 55} ${Y_SHOULDER + 40} ${CX - 50} ${Y_SHOULDER + 90}`;
  const armR = `M ${CX + 25} ${Y_SHOULDER + 10} Q ${CX + 55} ${Y_SHOULDER + 40} ${CX + 50} ${Y_SHOULDER + 90}`;
  const legL = `M ${CX - 15} ${Y_WAIST + 10} L ${CX - 20} ${Y_ANKLE}`;
  const legR = `M ${CX + 15} ${Y_WAIST + 10} L ${CX + 20} ${Y_ANKLE}`;

  return (
    <svg viewBox="0 0 240 400" className="h-full w-full select-none" role="img" aria-label="Иллюстрация ребенка по погоде">
      <defs>
        <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0F172A" floodOpacity="0.12" />
        </filter>
        <filter id="inner-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* --- BACKGROUND WEATHER EFFECTS --- */}
      <g className="animate-breathe" style={{ animationDuration: '4s' }}>
        <ellipse cx={CX} cy="370" rx="70" ry="10" fill="#CBD5E1" opacity="0.3" />
        {isSnowy && <ellipse cx={CX} cy="365" rx="100" ry="15" fill="#FFFFFF" opacity="0.6" />}
      </g>
      
      {hot && !isRainy && (
        <g className="animate-float" style={{ animationDuration: '6s' }} opacity="0.4">
          <circle cx="200" cy="40" r="18" fill="#FBBF24" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const r = (a * Math.PI) / 180;
            return <line key={a} x1={200 + 24 * Math.cos(r)} y1={40 + 24 * Math.sin(r)} x2={200 + 32 * Math.cos(r)} y2={40 + 32 * Math.sin(r)} stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />;
          })}
        </g>
      )}

      {isWindy && !isRainy && (
        <g opacity="0.3" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M -10 140 Q 50 120 120 150 T 250 130" className="animate-wind-1" />
          <path d="M 20 250 Q 80 270 150 240 T 260 260" className="animate-wind-2" />
        </g>
      )}

      {isRainy && (
        <g opacity="0.4" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round">
          {[20, 60, 100, 140, 180, 220].map((x, i) => (
            <line key={x} x1={x} y1="-10" x2={x - 15} y2="410">
              <animate attributeName="stroke-dasharray" values="0, 400; 400, 0" dur={`${0.6 + i * 0.1}s`} repeatCount="indefinite" />
            </line>
          ))}
        </g>
      )}

      {isSnowy && (
        <g fill="#FFFFFF" opacity="0.8">
          {[30, 70, 110, 150, 190, 220].map((x, i) => (
            <circle key={x} cx={x} cy="-10" r={i % 2 === 0 ? 3 : 2}>
              <animate attributeName="cy" from="-10" to="410" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
              <animate attributeName="cx" values={`${x}; ${x - 10}; ${x}`} dur={`${2 + i % 3}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      )}

      {/* --- CHARACTER --- */}
      <g className="animate-breathe">
        {/* HAIR (BACK) */}
        {girl && (
          <g fill={hair}>
            <path d={`M ${CX} ${Y_HEAD} Q ${CX - 50} ${Y_HEAD + 20} ${CX - 45} ${Y_HEAD + 80} Q ${CX - 20} ${Y_HEAD + 90} ${CX} ${Y_HEAD + 50}`} />
            <path d={`M ${CX} ${Y_HEAD} Q ${CX + 50} ${Y_HEAD + 20} ${CX + 45} ${Y_HEAD + 80} Q ${CX + 20} ${Y_HEAD + 90} ${CX} ${Y_HEAD + 50}`} />
          </g>
        )}

        {/* LEGS (SKIN) */}
        <path d={legL} stroke={skin} strokeWidth="18" strokeLinecap="round" />
        <path d={legR} stroke={skin} strokeWidth="18" strokeLinecap="round" />

        {/* BOTTOMS */}
        {drawSkirt ? (
          <path d={`M ${CX - 22} ${Y_WAIST - 10} L ${CX + 22} ${Y_WAIST - 10} L ${CX + 45} ${Y_WAIST + 60} Q ${CX} ${Y_WAIST + 75} ${CX - 45} ${Y_WAIST + 60} Z`} fill={C.bottom} filter="url(#soft-shadow)" />
        ) : drawShorts ? (
          <g filter="url(#soft-shadow)">
            <rect x={CX - 24} y={Y_WAIST - 10} width="48" height="30" rx="10" fill={C.bottom} />
            <path d={`M ${CX - 15} ${Y_WAIST + 10} L ${CX - 20} ${Y_WAIST + 50}`} stroke={C.bottom} strokeWidth="26" strokeLinecap="round" />
            <path d={`M ${CX + 15} ${Y_WAIST + 10} L ${CX + 20} ${Y_WAIST + 50}`} stroke={C.bottom} strokeWidth="26" strokeLinecap="round" />
          </g>
        ) : (
          <g filter="url(#soft-shadow)">
            <rect x={CX - 24} y={Y_WAIST - 10} width="48" height="30" rx="10" fill={C.bottom} />
            <path d={legL} stroke={C.bottom} strokeWidth="26" strokeLinecap="round" />
            <path d={legR} stroke={C.bottom} strokeWidth="26" strokeLinecap="round" />
            {/* Knee wrinkles */}
            <path d={`M ${CX - 26} ${Y_ANKLE - 50} Q ${CX - 20} ${Y_ANKLE - 45} ${CX - 14} ${Y_ANKLE - 50}`} fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
            <path d={`M ${CX + 14} ${Y_ANKLE - 50} Q ${CX + 20} ${Y_ANKLE - 45} ${CX + 26} ${Y_ANKLE - 50}`} fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
          </g>
        )}

        {/* SHOES */}
        <g filter="url(#soft-shadow)">
          {drawBoots ? (
            <>
              {/* Left Boot */}
              <rect x={CX - 32} y={Y_ANKLE - 10} width="26" height="35" rx="12" fill={C.shoes} />
              <rect x={CX - 34} y={Y_ANKLE + 20} width="30" height="8" rx="3" fill={C.shoesDetail} />
              {cold && <ellipse cx={CX - 19} cy={Y_ANKLE - 10} rx="15" ry="6" fill="#FFFFFF" opacity="0.9" />}
              {/* Right Boot */}
              <rect x={CX + 6} y={Y_ANKLE - 10} width="26" height="35" rx="12" fill={C.shoes} />
              <rect x={CX + 4} y={Y_ANKLE + 20} width="30" height="8" rx="3" fill={C.shoesDetail} />
              {cold && <ellipse cx={CX + 19} cy={Y_ANKLE - 10} rx="15" ry="6" fill="#FFFFFF" opacity="0.9" />}
            </>
          ) : drawSandals ? (
            <>
              {/* Left Sandal */}
              <path d={`M ${CX - 30} ${Y_ANKLE + 20} L ${CX - 10} ${Y_ANKLE + 20}`} stroke={C.shoes} strokeWidth="8" strokeLinecap="round" />
              <path d={`M ${CX - 25} ${Y_ANKLE + 10} L ${CX - 15} ${Y_ANKLE + 20}`} stroke={C.shoes} strokeWidth="4" strokeLinecap="round" />
              {/* Right Sandal */}
              <path d={`M ${CX + 10} ${Y_ANKLE + 20} L ${CX + 30} ${Y_ANKLE + 20}`} stroke={C.shoes} strokeWidth="8" strokeLinecap="round" />
              <path d={`M ${CX + 15} ${Y_ANKLE + 10} L ${CX + 25} ${Y_ANKLE + 20}`} stroke={C.shoes} strokeWidth="4" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Left Sneaker */}
              <rect x={CX - 30} y={Y_ANKLE + 5} width="24" height="20" rx="10" fill={C.shoes} />
              <rect x={CX - 32} y={Y_ANKLE + 20} width="28" height="6" rx="3" fill="#FFFFFF" />
              <line x1={CX - 26} y1={Y_ANKLE + 10} x2={CX - 16} y2={Y_ANKLE + 10} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <line x1={CX - 25} y1={Y_ANKLE + 14} x2={CX - 15} y2={Y_ANKLE + 14} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              {/* Right Sneaker */}
              <rect x={CX + 6} y={Y_ANKLE + 5} width="24" height="20" rx="10" fill={C.shoes} />
              <rect x={CX + 4} y={Y_ANKLE + 20} width="28" height="6" rx="3" fill="#FFFFFF" />
              <line x1={CX + 16} y1={Y_ANKLE + 10} x2={CX + 26} y2={Y_ANKLE + 10} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <line x1={CX + 15} y1={Y_ANKLE + 14} x2={CX + 25} y2={Y_ANKLE + 14} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            </>
          )}
        </g>

        {/* TORSO (SKIN) */}
        <rect x={CX - 22} y={Y_SHOULDER} width="44" height="80" rx="20" fill={skin} />

        {/* BASE TOP */}
        <g filter="url(#soft-shadow)">
          {/* Base Sleeves */}
          {showBaseLongSleeve ? (
            <>
              <path d={armL} stroke={C.top} strokeWidth="22" strokeLinecap="round" fill="none" />
              <path d={armR} stroke={C.top} strokeWidth="22" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <path d={`M ${CX - 25} ${Y_SHOULDER + 10} Q ${CX - 35} ${Y_SHOULDER + 20} ${CX - 40} ${Y_SHOULDER + 35}`} stroke={C.top} strokeWidth="22" strokeLinecap="round" fill="none" />
              <path d={`M ${CX + 25} ${Y_SHOULDER + 10} Q ${CX + 35} ${Y_SHOULDER + 20} ${CX + 40} ${Y_SHOULDER + 35}`} stroke={C.top} strokeWidth="22" strokeLinecap="round" fill="none" />
            </>
          )}
          {/* Base Torso */}
          <rect x={CX - 25} y={Y_SHOULDER - 5} width="50" height="90" rx="20" fill={C.top} />
          {/* Neckline */}
          <path d={`M ${CX - 12} ${Y_SHOULDER - 5} Q ${CX} ${Y_SHOULDER + 15} ${CX + 12} ${Y_SHOULDER - 5}`} fill={skin} />
          {/* Dress details */}
          {drawSkirt && (
            <path d={`M ${CX - 25} ${Y_WAIST - 15} Q ${CX} ${Y_WAIST - 5} ${CX + 25} ${Y_WAIST - 15}`} fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.5" />
          )}
        </g>

        {/* MIDDLE LAYER (HOODIE/SWEATER) */}
        {drawMiddle && (
          <g filter="url(#soft-shadow)">
            <path d={armL} stroke={C.mid} strokeWidth="28" strokeLinecap="round" fill="none" />
            <path d={armR} stroke={C.mid} strokeWidth="28" strokeLinecap="round" fill="none" />
            <rect x={CX - 28} y={Y_SHOULDER - 8} width="56" height="96" rx="24" fill={C.mid} />
            {/* Neckline / Hood strings */}
            <path d={`M ${CX - 15} ${Y_SHOULDER - 8} Q ${CX} ${Y_SHOULDER + 20} ${CX + 15} ${Y_SHOULDER - 8}`} fill={C.top} />
            {cold && (
              <>
                <line x1={CX - 6} y1={Y_SHOULDER + 10} x2={CX - 6} y2={Y_SHOULDER + 30} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                <line x1={CX + 6} y1={Y_SHOULDER + 10} x2={CX + 6} y2={Y_SHOULDER + 30} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              </>
            )}
            {/* Kangaroo pocket */}
            <path d={`M ${CX - 18} ${Y_WAIST - 10} L ${CX + 18} ${Y_WAIST - 10} L ${CX + 24} ${Y_WAIST + 15} L ${CX - 24} ${Y_WAIST + 15} Z`} fill="#FFFFFF" opacity="0.15" />
            {/* Ribbed hem */}
            <rect x={CX - 26} y={Y_WAIST + 18} width="52" height="6" rx="3" fill="#000000" opacity="0.1" />
          </g>
        )}

        {/* OUTER LAYER (JACKET) */}
        {drawOuter && (
          <g filter="url(#soft-shadow)">
            <path d={armL} stroke={shellMain} strokeWidth="34" strokeLinecap="round" fill="none" />
            <path d={armR} stroke={shellMain} strokeWidth="34" strokeLinecap="round" fill="none" />
            <rect x={CX - 32} y={Y_SHOULDER - 10} width="64" height="106" rx="28" fill={shellMain} />
            
            {/* Zipper */}
            <line x1={CX} y1={Y_SHOULDER - 10} x2={CX} y2={Y_WAIST + 26} stroke={shellDetail} strokeWidth="3" strokeLinecap="round" />
            
            {/* Pockets */}
            <rect x={CX - 26} y={Y_WAIST - 5} width="16" height="18" rx="4" fill={shellDetail} opacity="0.4" />
            <rect x={CX + 10} y={Y_WAIST - 5} width="16" height="18" rx="4" fill={shellDetail} opacity="0.4" />

            {/* Puffer quilting lines */}
            {(zone === 'arctic' || zone === 'winter') && !rainShell && (
              <g stroke={shellDetail} strokeWidth="2" opacity="0.3" fill="none" strokeLinecap="round">
                <line x1={CX - 30} y1={Y_SHOULDER + 15} x2={CX + 30} y2={Y_SHOULDER + 15} />
                <line x1={CX - 31} y1={Y_SHOULDER + 40} x2={CX + 31} y2={Y_SHOULDER + 40} />
                <line x1={CX - 31} y1={Y_SHOULDER + 65} x2={CX + 31} y2={Y_SHOULDER + 65} />
                {/* Arm quilting */}
                <path d={`M ${CX - 50} ${Y_SHOULDER + 20} L ${CX - 30} ${Y_SHOULDER + 30}`} />
                <path d={`M ${CX + 50} ${Y_SHOULDER + 20} L ${CX + 30} ${Y_SHOULDER + 30}`} />
                <path d={`M ${CX - 55} ${Y_SHOULDER + 50} L ${CX - 35} ${Y_SHOULDER + 60}`} />
                <path d={`M ${CX + 55} ${Y_SHOULDER + 50} L ${CX + 35} ${Y_SHOULDER + 60}`} />
              </g>
            )}

            {/* Rain shell highlight */}
            {rainShell && (
              <path d={`M ${CX - 24} ${Y_SHOULDER} Q ${CX - 15} ${Y_SHOULDER + 20} ${CX - 24} ${Y_SHOULDER + 60}`} fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
            )}

            {/* Winter Collar/Fur */}
            {zone === 'arctic' && !rainShell && (
              <path d={`M ${CX - 25} ${Y_SHOULDER - 10} Q ${CX} ${Y_SHOULDER + 10} ${CX + 25} ${Y_SHOULDER - 10} Q ${CX} ${Y_SHOULDER - 30} ${CX - 25} ${Y_SHOULDER - 10} Z`} fill="#FAFAF9" filter="url(#inner-shadow)" />
            )}
          </g>
        )}

        {/* ARMS (SKIN) - drawn over clothes if short sleeves */}
        {!showBaseLongSleeve && !drawMiddle && !drawOuter && (
          <g>
            <path d={`M ${CX - 40} ${Y_SHOULDER + 35} Q ${CX - 55} ${Y_SHOULDER + 45} ${CX - 50} ${Y_SHOULDER + 90}`} stroke={skin} strokeWidth="14" strokeLinecap="round" fill="none" />
            <path d={`M ${CX + 40} ${Y_SHOULDER + 35} Q ${CX + 55} ${Y_SHOULDER + 45} ${CX + 50} ${Y_SHOULDER + 90}`} stroke={skin} strokeWidth="14" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* HANDS & MITTENS */}
        {cold ? (
          <g filter="url(#soft-shadow)">
            <circle cx={CX - 50} cy={Y_SHOULDER + 95} r="12" fill={C.hat} />
            <circle cx={CX + 50} cy={Y_SHOULDER + 95} r="12" fill={C.hat} />
          </g>
        ) : (
          <g>
            <circle cx={CX - 50} cy={Y_SHOULDER + 95} r="8" fill={skin} />
            <circle cx={CX + 50} cy={Y_SHOULDER + 95} r="8" fill={skin} />
          </g>
        )}

        {/* UMBRELLA */}
        {isRainy && (
          <g className="animate-float" style={{ animationDuration: '4s' }} filter="url(#soft-shadow)">
            <line x1={CX + 50} y1={Y_SHOULDER + 90} x2={CX + 50} y2={Y_HEAD - 40} stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <path d={`M ${CX - 10} ${Y_HEAD - 20} Q ${CX + 50} ${Y_HEAD - 70} ${CX + 110} ${Y_HEAD - 20} Z`} fill="#EF4444" />
            <path d={`M ${CX + 50} ${Y_HEAD - 60} L ${CX + 50} ${Y_HEAD - 20}`} stroke="#B91C1C" strokeWidth="2" opacity="0.5" />
          </g>
        )}

        {/* SCARF */}
        {cold && (
          <g filter="url(#soft-shadow)">
            <rect x={CX - 22} y={Y_SHOULDER - 18} width="44" height="18" rx="8" fill={C.scarf} />
            <path d={`M ${CX - 15} ${Y_SHOULDER} L ${CX - 10} ${Y_SHOULDER + 35} L ${CX} ${Y_SHOULDER + 32} L ${CX - 5} ${Y_SHOULDER} Z`} fill={C.scarf} />
            <line x1={CX - 10} y1={Y_SHOULDER + 35} x2={CX} y2={Y_SHOULDER + 32} stroke={C.scarf} strokeWidth="4" strokeDasharray="2,2" />
          </g>
        )}

        {/* NECK (SKIN) */}
        {!cold && <rect x={CX - 8} y={Y_HEAD + 25} width="16" height="20" fill={skinShadow} />}

        {/* HEAD */}
        <g>
          {/* Base Face */}
          <circle cx={CX} cy={Y_HEAD} r="35" fill={skin} />
          
          {/* Eyes */}
          <circle cx={CX - 12} cy={Y_HEAD + 5} r="4.5" fill={ink} />
          <circle cx={CX - 13.5} cy={Y_HEAD + 3.5} r="1.5" fill="#FFFFFF" />
          <circle cx={CX + 12} cy={Y_HEAD + 5} r="4.5" fill={ink} />
          <circle cx={CX + 10.5} cy={Y_HEAD + 3.5} r="1.5" fill="#FFFFFF" />
          {girl && (
            <g stroke={ink} strokeWidth="1.5" strokeLinecap="round">
              <line x1={CX - 17} y1={Y_HEAD + 3} x2={CX - 19} y2={Y_HEAD} />
              <line x1={CX + 17} y1={Y_HEAD + 3} x2={CX + 19} y2={Y_HEAD} />
            </g>
          )}

          {/* Blush */}
          <circle cx={CX - 20} cy={Y_HEAD + 12} r={cold ? 8 : 6} fill={cold ? '#EF4444' : blush} opacity={cold ? 0.5 : 0.6} filter="url(#inner-shadow)" />
          <circle cx={CX + 20} cy={Y_HEAD + 12} r={cold ? 8 : 6} fill={cold ? '#EF4444' : blush} opacity={cold ? 0.5 : 0.6} filter="url(#inner-shadow)" />
          
          {/* Nose */}
          <circle cx={CX} cy={Y_HEAD + 12} r="2" fill={skinShadow} />

          {/* Smile */}
          <path d={`M ${CX - 6} ${Y_HEAD + 20} Q ${CX} ${Y_HEAD + 28} ${CX + 6} ${Y_HEAD + 20}`} fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />

          {/* Freckles (Boy) */}
          {!girl && (
            <g fill={skinShadow} opacity="0.8">
              <circle cx={CX - 18} cy={Y_HEAD + 10} r="1" />
              <circle cx={CX - 22} cy={Y_HEAD + 14} r="1" />
              <circle cx={CX + 18} cy={Y_HEAD + 10} r="1" />
              <circle cx={CX + 22} cy={Y_HEAD + 14} r="1" />
            </g>
          )}

          {/* Cold Breath */}
          {cold && (
            <g opacity="0.4" className="animate-float" style={{ animationDuration: '2s' }}>
              <ellipse cx={CX + 15} cy={Y_HEAD + 25} rx="6" ry="3" fill="#FFFFFF" />
              <ellipse cx={CX + 22} cy={Y_HEAD + 22} rx="4" ry="2" fill="#FFFFFF" />
            </g>
          )}

          {/* Hair (Front) */}
          <g fill={hair}>
            {girl ? (
              <path d={`M ${CX - 35} ${Y_HEAD - 5} Q ${CX} ${Y_HEAD - 25} ${CX + 35} ${Y_HEAD - 5} Q ${CX + 38} ${Y_HEAD - 35} ${CX} ${Y_HEAD - 38} Q ${CX - 38} ${Y_HEAD - 35} ${CX - 35} ${Y_HEAD - 5} Z`} />
            ) : (
              <path d={`M ${CX - 35} ${Y_HEAD - 10} Q ${CX - 20} ${Y_HEAD - 30} ${CX} ${Y_HEAD - 25} Q ${CX + 20} ${Y_HEAD - 35} ${CX + 35} ${Y_HEAD - 15} Q ${CX + 40} ${Y_HEAD - 40} ${CX} ${Y_HEAD - 45} Q ${CX - 40} ${Y_HEAD - 40} ${CX - 35} ${Y_HEAD - 10} Z`} />
            )}
          </g>

          {/* HAT / SUNGLASSES */}
          {cool || (hot && !isRainy) ? (
            <g filter="url(#soft-shadow)">
              {hot ? (
                <>
                  {/* Sunhat */}
                  <ellipse cx={CX} cy={Y_HEAD - 25} rx="45" ry="12" fill={C.hat} />
                  <path d={`M ${CX - 28} ${Y_HEAD - 25} Q ${CX} ${Y_HEAD - 55} ${CX + 28} ${Y_HEAD - 25} Z`} fill={C.hat} />
                  {/* Sunglasses */}
                  <rect x={CX - 22} y={Y_HEAD} width="18" height="12" rx="4" fill="#0F172A" />
                  <rect x={CX + 4} y={Y_HEAD} width="18" height="12" rx="4" fill="#0F172A" />
                  <line x1={CX - 4} y1={Y_HEAD + 4} x2={CX + 4} y2={Y_HEAD + 4} stroke="#0F172A" strokeWidth="2" />
                  <line x1={CX - 18} y1={Y_HEAD + 2} x2={CX - 10} y2={Y_HEAD + 8} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
                  <line x1={CX + 8} y1={Y_HEAD + 2} x2={CX + 16} y2={Y_HEAD + 8} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
                </>
              ) : (
                <>
                  {/* Beanie */}
                  <path d={`M ${CX - 34} ${Y_HEAD - 15} Q ${CX} ${Y_HEAD - 55} ${CX + 34} ${Y_HEAD - 15} Z`} fill={C.hat} />
                  <rect x={CX - 36} y={Y_HEAD - 18} width="72" height="14" rx="6" fill={C.hat} />
                  {zone === 'arctic' && (
                    <circle cx={CX} cy={Y_HEAD - 48} r="12" fill="#FFFFFF" />
                  )}
                </>
              )}
            </g>
          ) : null}
        </g>
      </g>
    </svg>
  );
};
