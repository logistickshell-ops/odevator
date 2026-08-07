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

  // Chibi-пропорции: большая голова, короткое тело
  const CX = 120;
  const Y_HEAD = 68;      // Центр головы
  const HEAD_R = 48;      // Радиус головы (огромная!)
  const Y_SHOULDER = 128; // Плечи
  const Y_WAIST = 198;    // Талия (короткое тело)
  const Y_ANKLE = 310;    // Щиколотки

  // Палитра: тёплые, мягкие цвета
  const C = girl
    ? {
        skin: '#FFDAB9', skinShadow: '#F4C4A0', skinHighlight: '#FFE8D6',
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
        skin: '#FFDAB9', skinShadow: '#F4C4A0', skinHighlight: '#FFE8D6',
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

  return (
    <svg viewBox="0 0 240 400" className="h-full w-full select-none" role="img" aria-label="Иллюстрация ребёнка по погоде">
      <defs>
        {/* Мягкая тень под персонажем */}
        <filter id="cute-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#5D4037" floodOpacity="0.2" />
        </filter>
        {/* Внутренняя тень для объёма */}
        <filter id="inner-glow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
          <feOffset in="blur" dx="0" dy="2" result="offsetBlur" />
          <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
        </filter>
      </defs>

      {/* Тень под ногами */}
      <ellipse cx={CX} cy={Y_ANKLE + 38} rx="60" ry="10" fill="#5D4037" opacity="0.15" />

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

      <g filter="url(#cute-shadow)">
        {/* === ВОЛОСЫ СЗАДИ (девочка: хвостики) === */}
        {girl && (
          <g>
            {/* Левый хвостик */}
            <ellipse cx={CX - 52} cy={Y_HEAD + 20} rx="18" ry="24" fill={C.hair} stroke={C.outline} strokeWidth="2.5" />
            <ellipse cx={CX - 52} cy={Y_HEAD + 20} rx="12" ry="18" fill={C.hairLight} opacity="0.4" />
            {/* Правый хвостик */}
            <ellipse cx={CX + 52} cy={Y_HEAD + 20} rx="18" ry="24" fill={C.hair} stroke={C.outline} strokeWidth="2.5" />
            <ellipse cx={CX + 52} cy={Y_HEAD + 20} rx="12" ry="18" fill={C.hairLight} opacity="0.4" />
            {/* Резинки */}
            <circle cx={CX - 52} cy={Y_HEAD} r="7" fill={C.hat} stroke={C.outline} strokeWidth="2" />
            <circle cx={CX + 52} cy={Y_HEAD} r="7" fill={C.hat} stroke={C.outline} strokeWidth="2" />
          </g>
        )}

        {/* === НОГИ (кожа) — ТОЛСТЫЕ, КОРОТКИЕ === */}
        <g>
          {/* Левая нога */}
          <rect x={CX - 28} y={Y_WAIST + 20} width="24" height={Y_ANKLE - Y_WAIST - 16} rx="12" fill={C.skin} stroke={C.outline} strokeWidth="2.5" />
          <rect x={CX - 24} y={Y_WAIST + 24} width="10" height={Y_ANKLE - Y_WAIST - 28} rx="5" fill={C.skinHighlight} opacity="0.5" />
          {/* Правая нога */}
          <rect x={CX + 4} y={Y_WAIST + 20} width="24" height={Y_ANKLE - Y_WAIST - 16} rx="12" fill={C.skin} stroke={C.outline} strokeWidth="2.5" />
          <rect x={CX + 8} y={Y_WAIST + 24} width="10" height={Y_ANKLE - Y_WAIST - 28} rx="5" fill={C.skinHighlight} opacity="0.5" />
        </g>

        {/* === СЛОЙ 1: бельё (низ) === */}
        {show.underwear && (
          <g>
            <rect x={CX - 30} y={Y_WAIST - 8} width="60" height="32" rx="14" fill={C.under} stroke={C.outline} strokeWidth="2.5" />
            {cold && (
              <>
                <line x1={CX - 16} y1={Y_WAIST} x2={CX - 16} y2={Y_WAIST + 20} stroke={C.underShadow} strokeWidth="2.5" strokeDasharray="4,4" />
                <line x1={CX + 16} y1={Y_WAIST} x2={CX + 16} y2={Y_WAIST + 20} stroke={C.underShadow} strokeWidth="2.5" strokeDasharray="4,4" />
              </>
            )}
          </g>
        )}

        {/* === СЛОЙ 2: нижний (низ) === */}
        {show.lower && (
          <g>
            {drawSkirt ? (
              <>
                <path d={`M ${CX - 30} ${Y_WAIST - 10} L ${CX + 30} ${Y_WAIST - 10} L ${CX + 52} ${Y_WAIST + 68} Q ${CX} ${Y_WAIST + 82} ${CX - 52} ${Y_WAIST + 68} Z`} fill={C.bottom} stroke={C.outline} strokeWidth="2.5" />
                <path d={`M ${CX - 30} ${Y_WAIST - 10} L ${CX + 30} ${Y_WAIST - 10} L ${CX + 52} ${Y_WAIST + 68} Q ${CX} ${Y_WAIST + 82} ${CX - 52} ${Y_WAIST + 68} Z`} fill={C.bottomShadow} opacity="0.3" />
                {/* Складки */}
                {[-32, -16, 0, 16, 32].map((dx) => (
                  <line key={dx} x1={CX + dx * 0.55} y1={Y_WAIST - 6} x2={CX + dx} y2={Y_WAIST + 64} stroke={C.outline} strokeWidth="2" opacity="0.3" />
                ))}
              </>
            ) : drawShorts ? (
              <>
                <rect x={CX - 32} y={Y_WAIST - 10} width="64" height="36" rx="16" fill={C.bottom} stroke={C.outline} strokeWidth="2.5" />
                {/* Левая штанина */}
                <rect x={CX - 30} y={Y_WAIST + 10} width="28" height="48" rx="14" fill={C.bottom} stroke={C.outline} strokeWidth="2.5" />
                <rect x={CX - 26} y={Y_WAIST + 14} width="12" height="36" rx="6" fill={C.bottomShadow} opacity="0.3" />
                {/* Правая штанина */}
                <rect x={CX + 2} y={Y_WAIST + 10} width="28" height="48" rx="14" fill={C.bottom} stroke={C.outline} strokeWidth="2.5" />
                <rect x={CX + 6} y={Y_WAIST + 14} width="12" height="36" rx="6" fill={C.bottomShadow} opacity="0.3" />
              </>
            ) : (
              <>
                <rect x={CX - 32} y={Y_WAIST - 10} width="64" height="36" rx="16" fill={C.bottom} stroke={C.outline} strokeWidth="2.5" />
                {/* Левая штанина */}
                <rect x={CX - 30} y={Y_WAIST + 10} width="28" height={Y_ANKLE - Y_WAIST - 6} rx="14" fill={C.bottom} stroke={C.outline} strokeWidth="2.5" />
                <rect x={CX - 26} y={Y_WAIST + 14} width="12" height={Y_ANKLE - Y_WAIST - 18} rx="6" fill={C.bottomShadow} opacity="0.3" />
                {/* Правая штанина */}
                <rect x={CX + 2} y={Y_WAIST + 10} width="28" height={Y_ANKLE - Y_WAIST - 6} rx="14" fill={C.bottom} stroke={C.outline} strokeWidth="2.5" />
                <rect x={CX + 6} y={Y_WAIST + 14} width="12" height={Y_ANKLE - Y_WAIST - 18} rx="6" fill={C.bottomShadow} opacity="0.3" />
              </>
            )}
          </g>
        )}

        {/* === СЛОЙ 6: обувь === */}
        {show.shoes ? (
          <g>
            {cold ? (
              <>
                <rect x={CX - 38} y={Y_ANKLE - 18} width="34" height="48" rx="16" fill={C.shoes} stroke={C.outline} strokeWidth="2.5" />
                <rect x={CX + 4} y={Y_ANKLE - 18} width="34" height="48" rx="16" fill={C.shoes} stroke={C.outline} strokeWidth="2.5" />
                <ellipse cx={CX - 21} cy={Y_ANKLE - 16} rx="17" ry="8" fill="#FFFFFF" opacity="0.9" />
                <ellipse cx={CX + 21} cy={Y_ANKLE - 16} rx="17" ry="8" fill="#FFFFFF" opacity="0.9" />
                <rect x={CX - 40} y={Y_ANKLE + 26} width="38" height="10" rx="5" fill={C.shoesShadow} stroke={C.outline} strokeWidth="2" />
                <rect x={CX + 2} y={Y_ANKLE + 26} width="38" height="10" rx="5" fill={C.shoesShadow} stroke={C.outline} strokeWidth="2" />
              </>
            ) : hot ? (
              <>
                <rect x={CX - 36} y={Y_ANKLE + 20} width="32" height="14" rx="7" fill={C.shoes} stroke={C.outline} strokeWidth="2.5" />
                <rect x={CX + 4} y={Y_ANKLE + 20} width="32" height="14" rx="7" fill={C.shoes} stroke={C.outline} strokeWidth="2.5" />
                <path d={`M ${CX - 30} ${Y_ANKLE + 12} L ${CX - 18} ${Y_ANKLE + 22}`} stroke={C.shoes} strokeWidth="6" strokeLinecap="round" />
                <path d={`M ${CX + 18} ${Y_ANKLE + 12} L ${CX + 30} ${Y_ANKLE + 22}`} stroke={C.shoes} strokeWidth="6" strokeLinecap="round" />
                <path d={`M ${CX - 30} ${Y_ANKLE + 12} L ${CX - 18} ${Y_ANKLE + 22}`} stroke={C.outline} strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d={`M ${CX + 18} ${Y_ANKLE + 12} L ${CX + 30} ${Y_ANKLE + 22}`} stroke={C.outline} strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                <rect x={CX - 36} y={Y_ANKLE + 4} width="32" height="26" rx="13" fill={C.shoes} stroke={C.outline} strokeWidth="2.5" />
                <rect x={CX + 4} y={Y_ANKLE + 4} width="32" height="26" rx="13" fill={C.shoes} stroke={C.outline} strokeWidth="2.5" />
                <rect x={CX - 38} y={Y_ANKLE + 26} width="36" height="9" rx="4.5" fill={C.shoesShadow} stroke={C.outline} strokeWidth="2" />
                <rect x={CX + 2} y={Y_ANKLE + 26} width="36" height="9" rx="4.5" fill={C.shoesShadow} stroke={C.outline} strokeWidth="2" />
                {/* Шнурки */}
                <line x1={CX - 30} y1={Y_ANKLE + 14} x2={CX - 16} y2={Y_ANKLE + 14} stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                <line x1={CX + 14} y1={Y_ANKLE + 14} x2={CX + 28} y2={Y_ANKLE + 14} stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              </>
            )}
          </g>
        ) : (
          <g>
            <ellipse cx={CX - 21} cy={Y_ANKLE + 18} rx="15" ry="10" fill={C.under} stroke={C.outline} strokeWidth="2.5" />
            <ellipse cx={CX + 21} cy={Y_ANKLE + 18} rx="15" ry="10" fill={C.under} stroke={C.outline} strokeWidth="2.5" />
          </g>
        )}

        {/* === ТОРС (кожа) — ПУХЛЫЙ === */}
        <rect x={CX - 32} y={Y_SHOULDER} width="64" height={Y_WAIST - Y_SHOULDER + 10} rx="28" fill={C.skin} stroke={C.outline} strokeWidth="2.5" />
        <rect x={CX - 24} y={Y_SHOULDER + 8} width="20" height={Y_WAIST - Y_SHOULDER - 10} rx="10" fill={C.skinHighlight} opacity="0.4" />

        {/* === РУКИ (кожа) — ТОЛСТЫЕ, КОРОТКИЕ === */}
        <g>
          {/* Левая рука */}
          <rect x={CX - 52} y={Y_SHOULDER + 8} width="22" height="64" rx="11" fill={C.skin} stroke={C.outline} strokeWidth="2.5" transform={`rotate(12 ${CX - 41} ${Y_SHOULDER + 8})`} />
          <rect x={CX - 48} y={Y_SHOULDER + 14} width="10" height="48" rx="5" fill={C.skinHighlight} opacity="0.4" transform={`rotate(12 ${CX - 41} ${Y_SHOULDER + 8})`} />
          {/* Кисть */}
          <circle cx={CX - 54} cy={Y_SHOULDER + 76} r="11" fill={C.skin} stroke={C.outline} strokeWidth="2.5" />
          {/* Правая рука */}
          <rect x={CX + 30} y={Y_SHOULDER + 8} width="22" height="64" rx="11" fill={C.skin} stroke={C.outline} strokeWidth="2.5" transform={`rotate(-12 ${CX + 41} ${Y_SHOULDER + 8})`} />
          <rect x={CX + 34} y={Y_SHOULDER + 14} width="10" height="48" rx="5" fill={C.skinHighlight} opacity="0.4" transform={`rotate(-12 ${CX + 41} ${Y_SHOULDER + 8})`} />
          {/* Кисть */}
          <circle cx={CX + 54} cy={Y_SHOULDER + 76} r="11" fill={C.skin} stroke={C.outline} strokeWidth="2.5" />
        </g>

        {/* === СЛОЙ 1: бельё (верх) === */}
        {show.underwear && (
          <g>
            <rect x={CX - 34} y={Y_SHOULDER - 6} width="68" height={Y_WAIST - Y_SHOULDER + 16} rx="28" fill={C.under} stroke={C.outline} strokeWidth="2.5" />
            <path d={`M ${CX - 15} ${Y_SHOULDER - 6} Q ${CX} ${Y_SHOULDER + 16} ${CX + 15} ${Y_SHOULDER - 6}`} fill={C.skin} stroke={C.outline} strokeWidth="2.5" />
            {cold ? (
              <>
                <rect x={CX - 54} y={Y_SHOULDER + 6} width="24" height="68" rx="12" fill={C.under} stroke={C.outline} strokeWidth="2.5" transform={`rotate(12 ${CX - 42} ${Y_SHOULDER + 6})`} />
                <rect x={CX + 30} y={Y_SHOULDER + 6} width="24" height="68" rx="12" fill={C.under} stroke={C.outline} strokeWidth="2.5" transform={`rotate(-12 ${CX + 42} ${Y_SHOULDER + 6})`} />
              </>
            ) : (
              <>
                <line x1={CX - 20} y1={Y_SHOULDER - 6} x2={CX - 16} y2={Y_SHOULDER + 8} stroke={C.under} strokeWidth="7" strokeLinecap="round" />
                <line x1={CX + 20} y1={Y_SHOULDER - 6} x2={CX + 16} y2={Y_SHOULDER + 8} stroke={C.under} strokeWidth="7" strokeLinecap="round" />
                <line x1={CX - 20} y1={Y_SHOULDER - 6} x2={CX - 16} y2={Y_SHOULDER + 8} stroke={C.outline} strokeWidth="2.5" strokeLinecap="round" />
                <line x1={CX + 20} y1={Y_SHOULDER - 6} x2={CX + 16} y2={Y_SHOULDER + 8} stroke={C.outline} strokeWidth="2.5" strokeLinecap="round" />
              </>
            )}
          </g>
        )}

        {/* === СЛОЙ 2: нижний (верх) === */}
        {show.lower && (
          <g>
            {shortSleeve ? (
              <>
                <rect x={CX - 54} y={Y_SHOULDER + 6} width="24" height="44" rx="12" fill={C.top} stroke={C.outline} strokeWidth="2.5" transform={`rotate(12 ${CX - 42} ${Y_SHOULDER + 6})`} />
                <rect x={CX + 30} y={Y_SHOULDER + 6} width="24" height="44" rx="12" fill={C.top} stroke={C.outline} strokeWidth="2.5" transform={`rotate(-12 ${CX + 42} ${Y_SHOULDER + 6})`} />
              </>
            ) : (
              <>
                <rect x={CX - 54} y={Y_SHOULDER + 6} width="24" height="68" rx="12" fill={C.top} stroke={C.outline} strokeWidth="2.5" transform={`rotate(12 ${CX - 42} ${Y_SHOULDER + 6})`} />
                <rect x={CX - 50} y={Y_SHOULDER + 12} width="10" height="52" rx="5" fill={C.topShadow} opacity="0.3" transform={`rotate(12 ${CX - 42} ${Y_SHOULDER + 6})`} />
                <rect x={CX + 30} y={Y_SHOULDER + 6} width="24" height="68" rx="12" fill={C.top} stroke={C.outline} strokeWidth="2.5" transform={`rotate(-12 ${CX + 42} ${Y_SHOULDER + 6})`} />
                <rect x={CX + 34} y={Y_SHOULDER + 12} width="10" height="52" rx="5" fill={C.topShadow} opacity="0.3" transform={`rotate(-12 ${CX + 42} ${Y_SHOULDER + 6})`} />
              </>
            )}
            <rect x={CX - 34} y={Y_SHOULDER - 6} width="68" height={Y_WAIST - Y_SHOULDER + 16} rx="28" fill={C.top} stroke={C.outline} strokeWidth="2.5" />
            <rect x={CX - 26} y={Y_SHOULDER + 2} width="22" height={Y_WAIST - Y_SHOULDER - 4} rx="11" fill={C.topShadow} opacity="0.25" />
            <path d={`M ${CX - 15} ${Y_SHOULDER - 6} Q ${CX} ${Y_SHOULDER + 16} ${CX + 15} ${Y_SHOULDER - 6}`} fill={show.underwear ? C.under : C.skin} stroke={C.outline} strokeWidth="2.5" />
          </g>
        )}

        {/* === СЛОЙ 3: верхний (худи) === */}
        {(show.upper && (coolish || zone === 'mild')) && (
          <g>
            <rect x={CX - 56} y={Y_SHOULDER + 4} width="26" height="72" rx="13" fill={C.upper} stroke={C.outline} strokeWidth="2.5" transform={`rotate(12 ${CX - 43} ${Y_SHOULDER + 4})`} />
            <rect x={CX + 30} y={Y_SHOULDER + 4} width="26" height="72" rx="13" fill={C.upper} stroke={C.outline} strokeWidth="2.5" transform={`rotate(-12 ${CX + 43} ${Y_SHOULDER + 4})`} />
            <rect x={CX - 36} y={Y_SHOULDER - 10} width="72" height={Y_WAIST - Y_SHOULDER + 22} rx="30" fill={C.upper} stroke={C.outline} strokeWidth="2.5" />
            <rect x={CX - 28} y={Y_SHOULDER} width="24" height={Y_WAIST - Y_SHOULDER - 2} rx="12" fill={C.upperShadow} opacity="0.25" />
            <path d={`M ${CX - 17} ${Y_SHOULDER - 10} Q ${CX} ${Y_SHOULDER + 18} ${CX + 17} ${Y_SHOULDER - 10}`} fill={C.top} stroke={C.outline} strokeWidth="2.5" />
            {/* Шнурки */}
            <line x1={CX - 8} y1={Y_SHOULDER + 10} x2={CX - 8} y2={Y_SHOULDER + 36} stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
            <line x1={CX + 8} y1={Y_SHOULDER + 10} x2={CX + 8} y2={Y_SHOULDER + 36} stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx={CX - 8} cy={Y_SHOULDER + 37} r="3.5" fill="#FFFFFF" stroke={C.outline} strokeWidth="1.5" />
            <circle cx={CX + 8} cy={Y_SHOULDER + 37} r="3.5" fill="#FFFFFF" stroke={C.outline} strokeWidth="1.5" />
            {/* Карман */}
            <path d={`M ${CX - 22} ${Y_WAIST - 16} Q ${CX} ${Y_WAIST - 10} ${CX + 22} ${Y_WAIST - 16} L ${CX + 26} ${Y_WAIST + 16} Q ${CX} ${Y_WAIST + 22} ${CX - 26} ${Y_WAIST + 16} Z`} fill={C.upperShadow} opacity="0.35" stroke={C.outline} strokeWidth="2" />
          </g>
        )}

        {/* === СЛОЙ 4: верхняя одежда === */}
        {show.outer && (
          <g>
            <rect x={CX - 58} y={Y_SHOULDER + 2} width="28" height="76" rx="14" fill={C.outer} stroke={C.outline} strokeWidth="2.5" transform={`rotate(12 ${CX - 44} ${Y_SHOULDER + 2})`} />
            <rect x={CX + 30} y={Y_SHOULDER + 2} width="28" height="76" rx="14" fill={C.outer} stroke={C.outline} strokeWidth="2.5" transform={`rotate(-12 ${CX + 44} ${Y_SHOULDER + 2})`} />
            <rect x={CX - 38} y={Y_SHOULDER - 12} width="76" height={Y_WAIST - Y_SHOULDER + 26} rx="32" fill={C.outer} stroke={C.outline} strokeWidth="2.5" />
            <rect x={CX - 30} y={Y_SHOULDER - 2} width="26" height={Y_WAIST - Y_SHOULDER + 4} rx="13" fill={C.outerShadow} opacity="0.25" />
            {/* Молния */}
            <line x1={CX} y1={Y_SHOULDER - 10} x2={CX} y2={Y_WAIST + 30} stroke={C.hatShadow} strokeWidth="4.5" strokeLinecap="round" />
            <circle cx={CX} cy={Y_SHOULDER + 4} r="4.5" fill={C.hatShadow} stroke={C.outline} strokeWidth="2" />
            {/* Карманы */}
            <rect x={CX - 30} y={Y_WAIST - 6} width="19" height="21" rx="7" fill={C.outerShadow} opacity="0.4" stroke={C.outline} strokeWidth="2" />
            <rect x={CX + 11} y={Y_WAIST - 6} width="19" height="21" rx="7" fill={C.outerShadow} opacity="0.4" stroke={C.outline} strokeWidth="2" />
            {/* Стежка */}
            {(zone === 'arctic' || zone === 'winter') && !isRainy && (
              <g stroke={C.outline} strokeWidth="2" opacity="0.3" fill="none">
                <line x1={CX - 36} y1={Y_SHOULDER + 20} x2={CX + 36} y2={Y_SHOULDER + 20} />
                <line x1={CX - 37} y1={Y_SHOULDER + 48} x2={CX + 37} y2={Y_SHOULDER + 48} />
                <line x1={CX - 37} y1={Y_SHOULDER + 76} x2={CX + 37} y2={Y_SHOULDER + 76} />
              </g>
            )}
            {/* Мех */}
            {zone === 'arctic' && !isRainy && (
              <path d={`M ${CX - 30} ${Y_SHOULDER - 12} Q ${CX} ${Y_SHOULDER + 14} ${CX + 30} ${Y_SHOULDER - 12} Q ${CX} ${Y_SHOULDER - 36} ${CX - 30} ${Y_SHOULDER - 12} Z`} fill="#FAFAF9" stroke={C.outline} strokeWidth="2.5" />
            )}
          </g>
        )}

        {/* === ВАРЕЖКИ / КИСТИ === */}
        {cold && show.accessory ? (
          <g>
            <circle cx={CX - 56} cy={Y_SHOULDER + 80} r="14" fill={C.mitt} stroke={C.outline} strokeWidth="2.5" />
            <circle cx={CX + 56} cy={Y_SHOULDER + 80} r="14" fill={C.mitt} stroke={C.outline} strokeWidth="2.5" />
            <rect x={CX - 66} y={Y_SHOULDER + 62} width="20" height="10" rx="5" fill="#FFFFFF" stroke={C.outline} strokeWidth="2" />
            <rect x={CX + 46} y={Y_SHOULDER + 62} width="20" height="10" rx="5" fill="#FFFFFF" stroke={C.outline} strokeWidth="2" />
          </g>
        ) : null}

        {/* === ШАРФ === */}
        {coolish && show.accessory && (
          <g>
            <rect x={CX - 28} y={Y_SHOULDER - 22} width="56" height="22" rx="11" fill={C.scarf} stroke={C.outline} strokeWidth="2.5" />
            <path d={isWindy
              ? `M ${CX - 18} ${Y_SHOULDER - 2} Q ${CX - 36} ${Y_SHOULDER + 22} ${CX - 52} ${Y_SHOULDER + 28} L ${CX - 44} ${Y_SHOULDER + 42} Q ${CX - 24} ${Y_SHOULDER + 30} ${CX - 6} ${Y_SHOULDER + 2} Z`
              : `M ${CX - 18} ${Y_SHOULDER - 2} L ${CX - 12} ${Y_SHOULDER + 42} L ${CX} ${Y_SHOULDER + 38} L ${CX - 6} ${Y_SHOULDER - 2} Z`} fill={C.scarf} stroke={C.outline} strokeWidth="2.5" />
          </g>
        )}

        {/* === ШЕЯ === */}
        {!coolish && <rect x={CX - 11} y={Y_HEAD + 30} width="22" height="22" rx="8" fill={C.skin} stroke={C.outline} strokeWidth="2.5" />}

        {/* === ГОЛОВА (ОГРОМНАЯ!) === */}
        <g>
          {/* Лицо */}
          <circle cx={CX} cy={Y_HEAD} r={HEAD_R} fill={C.skin} stroke={C.outline} strokeWidth="3" />
          {/* Блик на лице */}
          <ellipse cx={CX - 16} cy={Y_HEAD - 14} rx="18" ry="12" fill={C.skinHighlight} opacity="0.5" />

          {/* Брови */}
          <g stroke={C.hair} strokeWidth="4" strokeLinecap="round" fill="none">
            <path d={`M ${CX - 24} ${Y_HEAD - 12} Q ${CX - 16} ${Y_HEAD - 18} ${CX - 8} ${Y_HEAD - 12}`} />
            <path d={`M ${CX + 8} ${Y_HEAD - 12} Q ${CX + 16} ${Y_HEAD - 18} ${CX + 24} ${Y_HEAD - 12}`} />
          </g>

          {/* Глаза: ОГРОМНЫЕ, мультяшные */}
          <ellipse cx={CX - 17} cy={Y_HEAD + 6} rx="11" ry="12" fill="#FFFFFF" stroke={C.outline} strokeWidth="2.5" />
          <ellipse cx={CX + 17} cy={Y_HEAD + 6} rx="11" ry="12" fill="#FFFFFF" stroke={C.outline} strokeWidth="2.5" />
          <circle cx={CX - 17} cy={Y_HEAD + 8} r="7.5" fill={C.hair} />
          <circle cx={CX + 17} cy={Y_HEAD + 8} r="7.5" fill={C.hair} />
          {/* Блики в глазах */}
          <circle cx={CX - 20} cy={Y_HEAD + 4} r="3.5" fill="#FFFFFF" />
          <circle cx={CX + 14} cy={Y_HEAD + 4} r="3.5" fill="#FFFFFF" />
          <circle cx={CX - 14} cy={Y_HEAD + 11} r="1.8" fill="#FFFFFF" opacity="0.8" />
          <circle cx={CX + 20} cy={Y_HEAD + 11} r="1.8" fill="#FFFFFF" opacity="0.8" />
          {/* Ресницы (девочка) */}
          {girl && (
            <g stroke={C.outline} strokeWidth="2.5" strokeLinecap="round">
              <line x1={CX - 27} y1={Y_HEAD + 1} x2={CX - 32} y2={Y_HEAD - 4} />
              <line x1={CX + 27} y1={Y_HEAD + 1} x2={CX + 32} y2={Y_HEAD - 4} />
            </g>
          )}

          {/* Румянец */}
          <circle cx={CX - 30} cy={Y_HEAD + 18} r={cold ? 12 : 10} fill={C.blush} opacity="0.6" />
          <circle cx={CX + 30} cy={Y_HEAD + 18} r={cold ? 12 : 10} fill={C.blush} opacity="0.6" />

          {/* Нос */}
          <ellipse cx={CX} cy={Y_HEAD + 16} rx="4" ry="3" fill={C.skinShadow} stroke={C.outline} strokeWidth="2" />

          {/* Рот: широкая улыбка */}
          {hot ? (
            <path d={`M ${CX - 11} ${Y_HEAD + 26} Q ${CX} ${Y_HEAD + 40} ${CX + 11} ${Y_HEAD + 26} Z`} fill={C.hair} stroke={C.outline} strokeWidth="2.5" />
          ) : (
            <path d={`M ${CX - 10} ${Y_HEAD + 27} Q ${CX} ${Y_HEAD + 38} ${CX + 10} ${Y_HEAD + 27}`} fill="none" stroke={C.outline} strokeWidth="3.5" strokeLinecap="round" />
          )}

          {/* Веснушки (мальчик) */}
          {!girl && (
            <g fill={C.hair} opacity="0.5">
              <circle cx={CX - 28} cy={Y_HEAD + 14} r="2" /><circle cx={CX - 33} cy={Y_HEAD + 19} r="2" />
              <circle cx={CX + 28} cy={Y_HEAD + 14} r="2" /><circle cx={CX + 33} cy={Y_HEAD + 19} r="2" />
            </g>
          )}

          {/* Дыхание на морозе */}
          {cold && (
            <g opacity="0.5" className="animate-float" style={{ animationDuration: '2s' }}>
              <ellipse cx={CX + 22} cy={Y_HEAD + 32} rx="8" ry="4" fill="#FFFFFF" />
              <ellipse cx={CX + 32} cy={Y_HEAD + 27} rx="6" ry="3" fill="#FFFFFF" />
            </g>
          )}

          {/* Волосы спереди */}
          <g fill={C.hair} stroke={C.outline} strokeWidth="2.5">
            {girl ? (
              <>
                <path d={`M ${CX - 48} ${Y_HEAD - 6} Q ${CX} ${Y_HEAD - 34} ${CX + 48} ${Y_HEAD - 6} Q ${CX + 52} ${Y_HEAD - 44} ${CX} ${Y_HEAD - 48} Q ${CX - 52} ${Y_HEAD - 44} ${CX - 48} ${Y_HEAD - 6} Z`} />
                {/* Чёлка */}
                <path d={`M ${CX - 40} ${Y_HEAD - 20} Q ${CX - 28} ${Y_HEAD - 8} ${CX - 14} ${Y_HEAD - 20} Q ${CX} ${Y_HEAD - 8} ${CX + 14} ${Y_HEAD - 20} Q ${CX + 28} ${Y_HEAD - 8} ${CX + 40} ${Y_HEAD - 20} L ${CX + 40} ${Y_HEAD - 34} Q ${CX} ${Y_HEAD - 42} ${CX - 38} ${Y_HEAD - 34} Z`} fill={C.hairLight} opacity="0.5" />
              </>
            ) : (
              <>
                <path d={`M ${CX - 48} ${Y_HEAD - 12} Q ${CX - 28} ${Y_HEAD - 40} ${CX} ${Y_HEAD - 32} Q ${CX + 28} ${Y_HEAD - 44} ${CX + 48} ${Y_HEAD - 18} Q ${CX + 54} ${Y_HEAD - 50} ${CX} ${Y_HEAD - 56} Q ${CX - 54} ${Y_HEAD - 50} ${CX - 48} ${Y_HEAD - 12} Z`} />
                {/* Прядь */}
                <path d={`M ${CX - 36} ${Y_HEAD - 24} Q ${CX - 18} ${Y_HEAD - 36} ${CX + 6} ${Y_HEAD - 28} L ${CX - 2} ${Y_HEAD - 40} Q ${CX - 26} ${Y_HEAD - 42} ${CX - 38} ${Y_HEAD - 30} Z`} fill={C.hairLight} opacity="0.5" />
              </>
            )}
          </g>

          {/* === ГОЛОВНОЙ УБОР === */}
          {show.headwear && (
            <g>
              {hot ? (
                <>
                  <ellipse cx={CX} cy={Y_HEAD - 30} rx="58" ry="15" fill={C.hat} stroke={C.outline} strokeWidth="2.5" />
                  <path d={`M ${CX - 36} ${Y_HEAD - 30} Q ${CX} ${Y_HEAD - 68} ${CX + 36} ${Y_HEAD - 30} Z`} fill={C.hat} stroke={C.outline} strokeWidth="2.5" />
                  <rect x={CX - 36} y={Y_HEAD - 38} width="72" height="11" rx="5.5" fill={C.hatShadow} stroke={C.outline} strokeWidth="2" />
                </>
              ) : zone === 'warm' || zone === 'mild' ? (
                <>
                  <path d={`M ${CX - 44} ${Y_HEAD - 18} Q ${CX} ${Y_HEAD - 64} ${CX + 44} ${Y_HEAD - 18} Z`} fill={C.hat} stroke={C.outline} strokeWidth="2.5" />
                  <path d={`M ${CX + 6} ${Y_HEAD - 28} Q ${CX + 38} ${Y_HEAD - 34} ${CX + 56} ${Y_HEAD - 18} Q ${CX + 34} ${Y_HEAD - 10} ${CX + 8} ${Y_HEAD - 15} Z`} fill={C.hatShadow} stroke={C.outline} strokeWidth="2.5" />
                  <circle cx={CX} cy={Y_HEAD - 52} r="5" fill={C.hatShadow} stroke={C.outline} strokeWidth="2" />
                </>
              ) : (
                <>
                  <path d={`M ${CX - 44} ${Y_HEAD - 18} Q ${CX} ${Y_HEAD - 68} ${CX + 44} ${Y_HEAD - 18} Z`} fill={C.hat} stroke={C.outline} strokeWidth="2.5" />
                  <rect x={CX - 46} y={Y_HEAD - 22} width="92" height="18" rx="9" fill={C.hatShadow} stroke={C.outline} strokeWidth="2.5" />
                  {(zone === 'arctic' || zone === 'winter') && <circle cx={CX} cy={Y_HEAD - 62} r="14" fill="#FFFFFF" stroke={C.outline} strokeWidth="2.5" />}
                </>
              )}
            </g>
          )}

          {/* Очки */}
          {hot && show.accessory && (
            <g>
              <rect x={CX - 28} y={Y_HEAD + 2} width="24" height="16" rx="7" fill="#2C3E50" stroke={C.outline} strokeWidth="2.5" />
              <rect x={CX + 4} y={Y_HEAD + 2} width="24" height="16" rx="7" fill="#2C3E50" stroke={C.outline} strokeWidth="2.5" />
              <line x1={CX - 4} y1={Y_HEAD + 8} x2={CX + 4} y2={Y_HEAD + 8} stroke={C.outline} strokeWidth="3.5" />
              <line x1={CX - 24} y1={Y_HEAD + 6} x2={CX - 14} y2={Y_HEAD + 12} stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
              <line x1={CX + 12} y1={Y_HEAD + 6} x2={CX + 22} y2={Y_HEAD + 12} stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
            </g>
          )}
        </g>

        {/* === ЗОНТ === */}
        {isRainy && show.accessory && (
          <g className="animate-float" style={{ animationDuration: '4s' }}>
            <line x1={CX + 56} y1={Y_SHOULDER + 76} x2={CX + 56} y2={Y_HEAD - 52} stroke={C.outline} strokeWidth="5" strokeLinecap="round" />
            <path d={`M ${CX - 14} ${Y_HEAD - 28} Q ${CX + 56} ${Y_HEAD - 86} ${CX + 126} ${Y_HEAD - 28} Z`} fill="#FF6347" stroke={C.outline} strokeWidth="2.5" />
            <path d={`M ${CX - 14} ${Y_HEAD - 28} Q ${CX + 8} ${Y_HEAD - 38} ${CX + 30} ${Y_HEAD - 28} Q ${CX + 52} ${Y_HEAD - 38} ${CX + 74} ${Y_HEAD - 28} Q ${CX + 96} ${Y_HEAD - 38} ${CX + 126} ${Y_HEAD - 28}`} fill="none" stroke={C.outline} strokeWidth="2.5" opacity="0.5" />
          </g>
        )}
      </g>
    </svg>
  );
};
