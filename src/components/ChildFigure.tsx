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

// Пара "свет → тень" для объёма глиняной скульптуры
const shade = (light: string, dark: string) => ({ light, dark });

export const ChildFigure: React.FC<ChildFigureProps> = ({
  gender, effectiveTemp, isRainy, isSnowy, isWindy, show,
}) => {
  const girl = gender === 'girl';
  const zone = zoneFromTemp(effectiveTemp);
  const cold = ['arctic', 'winter', 'freeze'].includes(zone);
  const coolish = cold || ['chilly', 'cool'].includes(zone);
  const hot = zone === 'hot';

  // Геометрия (единая сетка для обоих полов)
  const CX = 120, Y_HEAD = 70, Y_SHOULDER = 128, Y_WAIST = 206, Y_ANKLE = 330;

  // Палитры с градиентами для каждого слоя
  const P = girl
    ? {
        top: shade('#FFB3D1', '#F47FAE'),
        upper: shade('#C9A8F5', '#9B73E0'),
        outer: shade('#FF9EC4', '#E85FA0'),
        bottom: shade('#B9A0E8', '#8E72CC'),
        shoes: shade('#FFFFFF', '#E8D5F0'),
        shoesD: shade('#FFB3D1', '#F47FAE'),
        hat: shade('#FFE08A', '#F5B942'),
        hatD: shade('#F5C95A', '#E0A020'),
        scarf: shade('#7FE8D8', '#3FC9B5'),
        mitt: shade('#FF9EAE', '#F06078'),
        under: shade('#FFFFFF', '#EDEDF5'),
      }
    : {
        top: shade('#7FE8D8', '#3FC9B5'),
        upper: shade('#8FB8FF', '#5B8DEF'),
        outer: shade('#6C8CFF', '#3E63DD'),
        bottom: shade('#7A8BA0', '#52617A'),
        shoes: shade('#FFFFFF', '#DCE8F5'),
        shoesD: shade('#8FB8FF', '#5B8DEF'),
        hat: shade('#5FD8C5', '#2A9D8F'),
        hatD: shade('#3FBBA8', '#1F7A6E'),
        scarf: shade('#FF9EAE', '#F06078'),
        mitt: shade('#8FB8FF', '#5B8DEF'),
        under: shade('#FFFFFF', '#EDEDF5'),
      };

  const skin = shade('#FFE4D0', '#F2B896');
  const hair = girl ? shade('#9A6238', '#6B3F22') : shade('#5A4436', '#33241A');
  const ink = '#3B3148';

  const shortSleeve = hot || zone === 'warm';
  const drawSkirt = girl && !cold && zone !== 'chilly';
  const drawShorts = !girl && (hot || zone === 'warm');

  // Уникальные id градиентов на инстанс (мальчик/девочка не конфликтуют)
  const uid = girl ? 'g' : 'b';
  const gid = (name: string) => `${uid}-${name}`;

  return (
    <svg viewBox="0 0 240 400" className="h-full w-full select-none" role="img" aria-label="Иллюстрация ребёнка по погоде">
      <defs>
        {/* Мягкая падающая тень */}
        <filter id={`${uid}-soft`} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#3B3148" floodOpacity="0.18" />
        </filter>
        {/* Размытие для погодных частиц (глубина) */}
        <filter id={`${uid}-blur`}>
          <feGaussianBlur stdDeviation="2.5" />
        </filter>

        {/* Аура-ореол за спиной */}
        <radialGradient id={gid('aura')} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="65%" stopColor={girl ? '#FFE1EC' : '#DCEBFF'} stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>

        {/* Контактная тень под ногами */}
        <radialGradient id={gid('ground')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3B3148" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#3B3148" stopOpacity="0" />
        </radialGradient>

        {/* Румянец SSS (мягкое свечение щёк) */}
        <radialGradient id={gid('blush')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={cold ? '#F87171' : '#FF9E9E'} stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FF9E9E" stopOpacity="0" />
        </radialGradient>

        {/* Вертикальные градиенты "глины" для каждой детали */}
        {([
          ['top', P.top], ['upper', P.upper], ['outer', P.outer], ['bottom', P.bottom],
          ['shoes', P.shoes], ['shoesD', P.shoesD], ['hat', P.hat], ['hatD', P.hatD],
          ['scarf', P.scarf], ['mitt', P.mitt], ['under', P.under],
          ['skin', skin], ['hair', hair],
        ] as [string, { light: string; dark: string }][]).map(([key, c]) => (
          <linearGradient key={key} id={gid(key)} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.light} />
            <stop offset="100%" stopColor={c.dark} />
          </linearGradient>
        ))}

        {/* Универсальный верхний блик */}
        <linearGradient id={gid('hi')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* === ФОН: аура + тень под ногами === */}
      <ellipse cx={CX} cy={185} rx="108" ry="150" fill={`url(#${gid('aura')})`} />
      <ellipse cx={CX} cy={Y_ANKLE + 34} rx="62" ry="11" fill={`url(#${gid('ground')})`} />

      {/* === ПОГОДА === */}
      {isSnowy && (
        <g fill="#FFFFFF" opacity="0.92">
          {[28, 64, 100, 150, 188, 214].map((x, i) => (
            <circle key={x} cx={x} cy={30 + i * 48} r={i % 2 ? 2.4 : 3.4} filter={`url(#${uid}-blur)`} />
          ))}
        </g>
      )}
      {isRainy && (
        <g stroke="#7FB3E8" strokeWidth="2.6" strokeLinecap="round" opacity="0.65">
          {[30, 72, 116, 162, 206].map((x, i) => (
            <line key={x} x1={x} y1={20 + i * 18} x2={x - 8} y2={42 + i * 18} />
          ))}
        </g>
      )}

      <g className="animate-breathe">
        {/* === ВОЛОСЫ (задние хвостики у девочки) === */}
        {girl && (
          <g filter={`url(#${uid}-soft)`}>
            <ellipse cx={CX - 41} cy={Y_HEAD + 14} rx="12" ry="15" fill={`url(#${gid('hair')})`} />
            <ellipse cx={CX + 41} cy={Y_HEAD + 14} rx="12" ry="15" fill={`url(#${gid('hair')})`} />
            <circle cx={CX - 41} cy={Y_HEAD + 2} r="4.5" fill={`url(#${gid('hat')})`} />
            <circle cx={CX + 41} cy={Y_HEAD + 2} r="4.5" fill={`url(#${gid('hat')})`} />
          </g>
        )}

        {/* === НОГИ (кожа) === */}
        <g filter={`url(#${uid}-soft)`}>
          <rect x={CX - 26} y={Y_WAIST + 30} width="20" height={Y_ANKLE - Y_WAIST - 26} rx="10" fill={`url(#${gid('skin')})`} />
          <rect x={CX + 6} y={Y_WAIST + 30} width="20" height={Y_ANKLE - Y_WAIST - 26} rx="10" fill={`url(#${gid('skin')})`} />
        </g>

        {/* === СЛОЙ 1: нательное бельё (низ) === */}
        {show.underwear && (
          <g filter={`url(#${uid}-soft)`}>
            <rect x={CX - 27} y={Y_WAIST - 4} width="54" height="34" rx="12" fill={`url(#${gid('under')})`} />
            {cold && (
              <>
                <line x1={CX - 13} y1={Y_WAIST + 2} x2={CX - 13} y2={Y_WAIST + 26} stroke="#C9C9DE" strokeWidth="2" strokeDasharray="3,3" />
                <line x1={CX + 13} y1={Y_WAIST + 2} x2={CX + 13} y2={Y_WAIST + 26} stroke="#C9C9DE" strokeWidth="2" strokeDasharray="3,3" />
              </>
            )}
          </g>
        )}

        {/* === СЛОЙ 2: нижний слой (низ) === */}
        {show.lower && (
          <g filter={`url(#${uid}-soft)`}>
            {drawSkirt ? (
              <>
                <path d={`M ${CX - 24} ${Y_WAIST - 6} L ${CX + 24} ${Y_WAIST - 6} L ${CX + 46} ${Y_WAIST + 60} Q ${CX} ${Y_WAIST + 74} ${CX - 46} ${Y_WAIST + 60} Z`} fill={`url(#${gid('bottom')})`} />
                {[-32, -16, 0, 16, 32].map((dx) => (
                  <line key={dx} x1={CX + dx * 0.5} y1={Y_WAIST - 2} x2={CX + dx} y2={Y_WAIST + 58} stroke="#00000018" strokeWidth="2.5" />
                ))}
                <path d={`M ${CX - 24} ${Y_WAIST - 6} L ${CX + 24} ${Y_WAIST - 6} L ${CX + 30} ${Y_WAIST + 14} Q ${CX} ${Y_WAIST + 22} ${CX - 30} ${Y_WAIST + 14} Z`} fill={`url(#${gid('hi')})`} />
              </>
            ) : drawShorts ? (
              <>
                <rect x={CX - 27} y={Y_WAIST - 6} width="54" height="34" rx="12" fill={`url(#${gid('bottom')})`} />
                <rect x={CX - 28} y={Y_WAIST + 6} width="24" height="44" rx="11" fill={`url(#${gid('bottom')})`} />
                <rect x={CX + 4} y={Y_WAIST + 6} width="24" height="44" rx="11" fill={`url(#${gid('bottom')})`} />
              </>
            ) : (
              <>
                <rect x={CX - 27} y={Y_WAIST - 6} width="54" height="34" rx="12" fill={`url(#${gid('bottom')})`} />
                <rect x={CX - 28} y={Y_WAIST + 6} width="23" height={Y_ANKLE - Y_WAIST - 4} rx="11" fill={`url(#${gid('bottom')})`} />
                <rect x={CX + 5} y={Y_WAIST + 6} width="23" height={Y_ANKLE - Y_WAIST - 4} rx="11" fill={`url(#${gid('bottom')})`} />
                <ellipse cx={CX - 16} cy={Y_ANKLE - 50} rx="6" ry="4" fill="#FFFFFF" opacity="0.18" />
                <ellipse cx={CX + 16} cy={Y_ANKLE - 50} rx="6" ry="4" fill="#FFFFFF" opacity="0.18" />
              </>
            )}
          </g>
        )}

        {/* === СЛОЙ 6: обувь === */}
        {show.shoes ? (
          <g filter={`url(#${uid}-soft)`}>
            {cold ? (
              <>
                <rect x={CX - 34} y={Y_ANKLE - 16} width="28" height="42" rx="13" fill={`url(#${gid('shoesD')})`} />
                <rect x={CX + 6} y={Y_ANKLE - 16} width="28" height="42" rx="13" fill={`url(#${gid('shoesD')})`} />
                <ellipse cx={CX - 20} cy={Y_ANKLE - 14} rx="14" ry="6" fill="#FFFFFF" opacity="0.92" />
                <ellipse cx={CX + 20} cy={Y_ANKLE - 14} rx="14" ry="6" fill="#FFFFFF" opacity="0.92" />
                <rect x={CX - 36} y={Y_ANKLE + 22} width="32" height="9" rx="4.5" fill="#3B3148" opacity="0.7" />
                <rect x={CX + 4} y={Y_ANKLE + 22} width="32" height="9" rx="4.5" fill="#3B3148" opacity="0.7" />
              </>
            ) : hot ? (
              <>
                <rect x={CX - 32} y={Y_ANKLE + 16} width="26" height="11" rx="5.5" fill={`url(#${gid('shoesD')})`} />
                <rect x={CX + 6} y={Y_ANKLE + 16} width="26" height="11" rx="5.5" fill={`url(#${gid('shoesD')})`} />
                <path d={`M ${CX - 26} ${Y_ANKLE + 8} L ${CX - 16} ${Y_ANKLE + 18}`} stroke={`url(#${gid('shoesD')})`} strokeWidth="4" strokeLinecap="round" />
                <path d={`M ${CX + 16} ${Y_ANKLE + 8} L ${CX + 26} ${Y_ANKLE + 18}`} stroke={`url(#${gid('shoesD')})`} strokeWidth="4" strokeLinecap="round" />
              </>
            ) : (
              <>
                <rect x={CX - 33} y={Y_ANKLE + 2} width="27" height="24" rx="11" fill={`url(#${gid('shoes')})`} />
                <rect x={CX + 6} y={Y_ANKLE + 2} width="27" height="24" rx="11" fill={`url(#${gid('shoes')})`} />
                <rect x={CX - 35} y={Y_ANKLE + 22} width="31" height="8" rx="4" fill={`url(#${gid('shoesD')})`} />
                <rect x={CX + 4} y={Y_ANKLE + 22} width="31" height="8" rx="4" fill={`url(#${gid('shoesD')})`} />
                <line x1={CX - 27} y1={Y_ANKLE + 11} x2={CX - 14} y2={Y_ANKLE + 11} stroke={`url(#${gid('shoesD')})`} strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
                <line x1={CX + 14} y1={Y_ANKLE + 11} x2={CX + 27} y2={Y_ANKLE + 11} stroke={`url(#${gid('shoesD')})`} strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
                <ellipse cx={CX - 22} cy={Y_ANKLE + 8} rx="6" ry="3" fill="#FFFFFF" opacity="0.4" />
                <ellipse cx={CX + 18} cy={Y_ANKLE + 8} rx="6" ry="3" fill="#FFFFFF" opacity="0.4" />
              </>
            )}
          </g>
        ) : (
          <g>
            <ellipse cx={CX - 16} cy={Y_ANKLE + 16} rx="12" ry="8" fill={`url(#${gid('under')})`} />
            <ellipse cx={CX + 16} cy={Y_ANKLE + 16} rx="12" ry="8" fill={`url(#${gid('under')})`} />
          </g>
        )}

        {/* === ТОРС (кожа) === */}
        <rect x={CX - 24} y={Y_SHOULDER} width="48" height="86" rx="22" fill={`url(#${gid('skin')})`} />

        {/* === РУКИ (кожа) — плечо + предплечье + кисть === */}
        <g filter={`url(#${uid}-soft)`}>
          <rect x={CX - 44} y={Y_SHOULDER + 4} width="18" height="58" rx="9" fill={`url(#${gid('skin')})`} transform={`rotate(8 ${CX - 35} ${Y_SHOULDER + 4})`} />
          <rect x={CX - 47} y={Y_SHOULDER + 52} width="17" height="44" rx="8.5" fill={`url(#${gid('skin')})`} transform={`rotate(4 ${CX - 38} ${Y_SHOULDER + 52})`} />
          <circle cx={CX - 41} cy={Y_SHOULDER + 98} r="9" fill={`url(#${gid('skin')})`} />
          <rect x={CX + 26} y={Y_SHOULDER + 4} width="18" height="58" rx="9" fill={`url(#${gid('skin')})`} transform={`rotate(-8 ${CX + 35} ${Y_SHOULDER + 4})`} />
          <rect x={CX + 30} y={Y_SHOULDER + 52} width="17" height="44" rx="8.5" fill={`url(#${gid('skin')})`} transform={`rotate(-4 ${CX + 38} ${Y_SHOULDER + 52})`} />
          <circle cx={CX + 41} cy={Y_SHOULDER + 98} r="9" fill={`url(#${gid('skin')})`} />
        </g>

        {/* === СЛОЙ 1: нательное бельё (верх) === */}
        {show.underwear && (
          <g filter={`url(#${uid}-soft)`}>
            <rect x={CX - 27} y={Y_SHOULDER - 4} width="54" height="92" rx="22" fill={`url(#${gid('under')})`} />
            <path d={`M ${CX - 13} ${Y_SHOULDER - 4} Q ${CX} ${Y_SHOULDER + 15} ${CX + 13} ${Y_SHOULDER - 4}`} fill={`url(#${gid('skin')})`} />
            {cold ? (
              <>
                <rect x={CX - 46} y={Y_SHOULDER + 2} width="20" height="62" rx="10" fill={`url(#${gid('under')})`} transform={`rotate(8 ${CX - 36} ${Y_SHOULDER + 2})`} />
                <rect x={CX + 26} y={Y_SHOULDER + 2} width="20" height="62" rx="10" fill={`url(#${gid('under')})`} transform={`rotate(-8 ${CX + 36} ${Y_SHOULDER + 2})`} />
              </>
            ) : (
              <>
                <line x1={CX - 17} y1={Y_SHOULDER - 4} x2={CX - 13} y2={Y_SHOULDER + 8} stroke={`url(#${gid('under')})`} strokeWidth="6" strokeLinecap="round" />
                <line x1={CX + 17} y1={Y_SHOULDER - 4} x2={CX + 13} y2={Y_SHOULDER + 8} stroke={`url(#${gid('under')})`} strokeWidth="6" strokeLinecap="round" />
              </>
            )}
          </g>
        )}

        {/* === СЛОЙ 2: нижний слой (верх) === */}
        {show.lower && (
          <g filter={`url(#${uid}-soft)`}>
            {shortSleeve ? (
              <>
                <rect x={CX - 47} y={Y_SHOULDER + 2} width="21" height="40" rx="10.5" fill={`url(#${gid('top')})`} transform={`rotate(8 ${CX - 36} ${Y_SHOULDER + 2})`} />
                <rect x={CX + 26} y={Y_SHOULDER + 2} width="21" height="40" rx="10.5" fill={`url(#${gid('top')})`} transform={`rotate(-8 ${CX + 36} ${Y_SHOULDER + 2})`} />
              </>
            ) : (
              <>
                <rect x={CX - 47} y={Y_SHOULDER + 2} width="21" height="62" rx="10.5" fill={`url(#${gid('top')})`} transform={`rotate(8 ${CX - 36} ${Y_SHOULDER + 2})`} />
                <rect x={CX + 26} y={Y_SHOULDER + 2} width="21" height="62" rx="10.5" fill={`url(#${gid('top')})`} transform={`rotate(-8 ${CX + 36} ${Y_SHOULDER + 2})`} />
              </>
            )}
            <rect x={CX - 28} y={Y_SHOULDER - 5} width="56" height="94" rx="22" fill={`url(#${gid('top')})`} />
            <rect x={CX - 28} y={Y_SHOULDER - 5} width="56" height="46" rx="22" fill={`url(#${gid('hi')})`} />
            <path d={`M ${CX - 13} ${Y_SHOULDER - 5} Q ${CX} ${Y_SHOULDER + 14} ${CX + 13} ${Y_SHOULDER - 5}`} fill={show.underwear ? `url(#${gid('under')})` : `url(#${gid('skin')})`} />
          </g>
        )}

        {/* === СЛОЙ 3: верхний слой (худи/свитер) === */}
        {(show.upper && (coolish || zone === 'mild')) && (
          <g filter={`url(#${uid}-soft)`}>
            <rect x={CX - 49} y={Y_SHOULDER} width="23" height="66" rx="11.5" fill={`url(#${gid('upper')})`} transform={`rotate(8 ${CX - 37} ${Y_SHOULDER})`} />
            <rect x={CX + 26} y={Y_SHOULDER} width="23" height="66" rx="11.5" fill={`url(#${gid('upper')})`} transform={`rotate(-8 ${CX + 37} ${Y_SHOULDER})`} />
            {/* Капюшон сзади */}
            <path d={`M ${CX - 30} ${Y_SHOULDER - 6} Q ${CX} ${Y_SHOULDER - 26} ${CX + 30} ${Y_SHOULDER - 6} Q ${CX + 26} ${Y_SHOULDER + 10} ${CX} ${Y_SHOULDER + 6} Q ${CX - 26} ${Y_SHOULDER + 10} ${CX - 30} ${Y_SHOULDER - 6} Z`} fill={`url(#${gid('upper')})`} />
            <rect x={CX - 31} y={Y_SHOULDER - 8} width="62" height="100" rx="26" fill={`url(#${gid('upper')})`} />
            <rect x={CX - 31} y={Y_SHOULDER - 8} width="62" height="48" rx="26" fill={`url(#${gid('hi')})`} />
            {/* Вырез */}
            <path d={`M ${CX - 15} ${Y_SHOULDER - 8} Q ${CX} ${Y_SHOULDER + 16} ${CX + 15} ${Y_SHOULDER - 8}`} fill={`url(#${gid('top')})`} />
            {/* Шнурки */}
            <line x1={CX - 6} y1={Y_SHOULDER + 8} x2={CX - 6} y2={Y_SHOULDER + 30} stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
            <line x1={CX + 6} y1={Y_SHOULDER + 8} x2={CX + 6} y2={Y_SHOULDER + 30} stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
            <circle cx={CX - 6} cy={Y_SHOULDER + 31} r="2.5" fill="#FFFFFF" opacity="0.9" />
            <circle cx={CX + 6} cy={Y_SHOULDER + 31} r="2.5" fill="#FFFFFF" opacity="0.9" />
            {/* Карман-кенгуру */}
            <path d={`M ${CX - 19} ${Y_WAIST - 14} Q ${CX} ${Y_WAIST - 8} ${CX + 19} ${Y_WAIST - 14} L ${CX + 23} ${Y_WAIST + 12} Q ${CX} ${Y_WAIST + 18} ${CX - 23} ${Y_WAIST + 12} Z`} fill="#000000" opacity="0.08" />
            {/* Манжета низа */}
            <rect x={CX - 29} y={Y_WAIST + 16} width="58" height="7" rx="3.5" fill="#000000" opacity="0.1" />
          </g>
        )}

        {/* === СЛОЙ 4: верхняя одежда === */}
        {show.outer && (
          <g filter={`url(#${uid}-soft)`}>
            <rect x={CX - 51} y={Y_SHOULDER - 2} width="25" height="70" rx="12.5" fill={`url(#${gid('outer')})`} transform={`rotate(8 ${CX - 38} ${Y_SHOULDER})`} />
            <rect x={CX + 26} y={Y_SHOULDER - 2} width="25" height="70" rx="12.5" fill={`url(#${gid('outer')})`} transform={`rotate(-8 ${CX + 38} ${Y_SHOULDER})`} />
            <rect x={CX - 34} y={Y_SHOULDER - 10} width="68" height="108" rx="30" fill={`url(#${gid('outer')})`} />
            <rect x={CX - 34} y={Y_SHOULDER - 10} width="68" height="50" rx="30" fill={`url(#${gid('hi')})`} />
            {/* Молния */}
            <line x1={CX} y1={Y_SHOULDER - 8} x2={CX} y2={Y_WAIST + 28} stroke={`url(#${gid('hatD')})`} strokeWidth="3.5" strokeLinecap="round" />
            <circle cx={CX} cy={Y_SHOULDER + 2} r="3.2" fill={`url(#${gid('hatD')})`} />
            {/* Карманы */}
            <rect x={CX - 28} y={Y_WAIST - 4} width="16" height="18" rx="5" fill="#000000" opacity="0.12" />
            <rect x={CX + 12} y={Y_WAIST - 4} width="16" height="18" rx="5" fill="#000000" opacity="0.12" />
            {/* Стежка пуховика */}
            {(zone === 'arctic' || zone === 'winter') && !isRainy && (
              <g stroke="#FFFFFF" strokeWidth="2" opacity="0.25" fill="none" strokeLinecap="round">
                <line x1={CX - 32} y1={Y_SHOULDER + 18} x2={CX + 32} y2={Y_SHOULDER + 18} />
                <line x1={CX - 33} y1={Y_SHOULDER + 44} x2={CX + 33} y2={Y_SHOULDER + 44} />
                <line x1={CX - 33} y1={Y_SHOULDER + 70} x2={CX + 33} y2={Y_SHOULDER + 70} />
              </g>
            )}
            {/* Блик дождевика */}
            {isRainy && !coolish && (
              <path d={`M ${CX - 26} ${Y_SHOULDER} Q ${CX - 16} ${Y_SHOULDER + 26} ${CX - 26} ${Y_SHOULDER + 64}`} fill="none" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" opacity="0.5" />
            )}
            {/* Меховой воротник */}
            {zone === 'arctic' && !isRainy && (
              <path d={`M ${CX - 27} ${Y_SHOULDER - 10} Q ${CX} ${Y_SHOULDER + 12} ${CX + 27} ${Y_SHOULDER - 10} Q ${CX} ${Y_SHOULDER - 32} ${CX - 27} ${Y_SHOULDER - 10} Z`} fill="#FAFAF9" />
            )}
          </g>
        )}

        {/* === ВАРЕЖКИ === */}
        {cold && show.accessory && (
          <g filter={`url(#${uid}-soft)`}>
            <circle cx={CX - 41} cy={Y_SHOULDER + 100} r="12" fill={`url(#${gid('mitt')})`} />
            <circle cx={CX + 41} cy={Y_SHOULDER + 100} r="12" fill={`url(#${gid('mitt')})`} />
            <rect x={CX - 50} y={Y_SHOULDER + 84} width="18" height="8" rx="4" fill="#FFFFFF" opacity="0.9" />
            <rect x={CX + 32} y={Y_SHOULDER + 84} width="18" height="8" rx="4" fill="#FFFFFF" opacity="0.9" />
          </g>
        )}

        {/* === ШАРФ === */}
        {coolish && show.accessory && (
          <g filter={`url(#${uid}-soft)`}>
            <rect x={CX - 25} y={Y_SHOULDER - 20} width="50" height="19" rx="9" fill={`url(#${gid('scarf')})`} />
            <path d={isWindy
              ? `M ${CX - 16} ${Y_SHOULDER - 2} Q ${CX - 32} ${Y_SHOULDER + 20} ${CX - 46} ${Y_SHOULDER + 26} L ${CX - 40} ${Y_SHOULDER + 38} Q ${CX - 22} ${Y_SHOULDER + 28} ${CX - 6} ${Y_SHOULDER} Z`
              : `M ${CX - 16} ${Y_SHOULDER - 2} L ${CX - 11} ${Y_SHOULDER + 38} L ${CX - 1} ${Y_SHOULDER + 34} L ${CX - 6} ${Y_SHOULDER - 2} Z`} fill={`url(#${gid('scarf')})`} />
          </g>
        )}

        {/* === ШЕЯ === */}
        {!coolish && <rect x={CX - 9} y={Y_HEAD + 26} width="18" height="20" fill={`url(#${gid('skin')})`} />}

        {/* === ГОЛОВА === */}
        <g filter={`url(#${uid}-soft)`}>
          <circle cx={CX} cy={Y_HEAD} r="37" fill={`url(#${gid('skin')})`} />
          {/* Тень снизу лица */}
          <path d={`M ${CX - 37} ${Y_HEAD + 4} A 37 37 0 0 0 ${CX + 37} ${Y_HEAD + 4} A 56 56 0 0 1 ${CX - 37} ${Y_HEAD + 4} Z`} fill="#000000" opacity="0.06" />

          {/* Брови */}
          <g stroke={hair.dark} strokeWidth="3" strokeLinecap="round" fill="none">
            <path d={`M ${CX - 19} ${Y_HEAD - 6} Q ${CX - 13} ${Y_HEAD - 10} ${CX - 7} ${Y_HEAD - 6}`} />
            <path d={`M ${CX + 7} ${Y_HEAD - 6} Q ${CX + 13} ${Y_HEAD - 10} ${CX + 19} ${Y_HEAD - 6}`} />
          </g>

          {/* Глаза: белок + радужка + 2 блика */}
          <ellipse cx={CX - 13} cy={Y_HEAD + 5} rx="6.5" ry="7" fill="#FFFFFF" />
          <ellipse cx={CX + 13} cy={Y_HEAD + 5} rx="6.5" ry="7" fill="#FFFFFF" />
          <circle cx={CX - 13} cy={Y_HEAD + 6} r="4.6" fill={ink} />
          <circle cx={CX + 13} cy={Y_HEAD + 6} r="4.6" fill={ink} />
          <circle cx={CX - 14.5} cy={Y_HEAD + 4} r="1.9" fill="#FFFFFF" />
          <circle cx={CX + 11.5} cy={Y_HEAD + 4} r="1.9" fill="#FFFFFF" />
          <circle cx={CX - 11} cy={Y_HEAD + 8} r="0.9" fill="#FFFFFF" opacity="0.8" />
          <circle cx={CX + 15} cy={Y_HEAD + 8} r="0.9" fill="#FFFFFF" opacity="0.8" />
          {girl && (
            <g stroke={ink} strokeWidth="1.8" strokeLinecap="round">
              <line x1={CX - 19} y1={Y_HEAD + 2} x2={CX - 22} y2={Y_HEAD - 1} />
              <line x1={CX + 19} y1={Y_HEAD + 2} x2={CX + 22} y2={Y_HEAD - 1} />
            </g>
          )}

          {/* Румянец SSS */}
          <circle cx={CX - 22} cy={Y_HEAD + 14} r={cold ? 10 : 8} fill={`url(#${gid('blush')})`} />
          <circle cx={CX + 22} cy={Y_HEAD + 14} r={cold ? 10 : 8} fill={`url(#${gid('blush')})`} />

          {/* Нос с тенью */}
          <ellipse cx={CX} cy={Y_HEAD + 13} rx="2.6" ry="2" fill="#000000" opacity="0.12" />

          {/* Рот */}
          {hot ? (
            <path d={`M ${CX - 7} ${Y_HEAD + 20} Q ${CX} ${Y_HEAD + 31} ${CX + 7} ${Y_HEAD + 20} Z`} fill={ink} />
          ) : (
            <path d={`M ${CX - 7} ${Y_HEAD + 21} Q ${CX} ${Y_HEAD + 29} ${CX + 7} ${Y_HEAD + 21}`} fill="none" stroke={ink} strokeWidth="2.8" strokeLinecap="round" />
          )}

          {/* Веснушки у мальчика */}
          {!girl && (
            <g fill="#C9936A" opacity="0.7">
              <circle cx={CX - 20} cy={Y_HEAD + 11} r="1.1" /><circle cx={CX - 24} cy={Y_HEAD + 15} r="1.1" />
              <circle cx={CX + 20} cy={Y_HEAD + 11} r="1.1" /><circle cx={CX + 24} cy={Y_HEAD + 15} r="1.1" />
            </g>
          )}

          {/* Дыхание на морозе */}
          {cold && (
            <g opacity="0.45" className="animate-float" style={{ animationDuration: '2s' }}>
              <ellipse cx={CX + 17} cy={Y_HEAD + 27} rx="6" ry="3" fill="#FFFFFF" />
              <ellipse cx={CX + 25} cy={Y_HEAD + 23} rx="4" ry="2" fill="#FFFFFF" />
            </g>
          )}

          {/* Волосы (передние) */}
          <g fill={`url(#${gid('hair')})`}>
            {girl ? (
              <>
                <path d={`M ${CX - 37} ${Y_HEAD - 4} Q ${CX} ${Y_HEAD - 26} ${CX + 37} ${Y_HEAD - 4} Q ${CX + 40} ${Y_HEAD - 37} ${CX} ${Y_HEAD - 40} Q ${CX - 40} ${Y_HEAD - 37} ${CX - 37} ${Y_HEAD - 4} Z`} />
                <path d={`M ${CX - 31} ${Y_HEAD - 14} Q ${CX - 22} ${Y_HEAD - 5} ${CX - 13} ${Y_HEAD - 14} Q ${CX - 4} ${Y_HEAD - 5} ${CX + 5} ${Y_HEAD - 14} Q ${CX + 14} ${Y_HEAD - 5} ${CX + 22} ${Y_HEAD - 14} L ${CX + 22} ${Y_HEAD - 26} Q ${CX} ${Y_HEAD - 34} ${CX - 29} ${Y_HEAD - 26} Z`} fill={hair.light} opacity="0.45" />
              </>
            ) : (
              <>
                <path d={`M ${CX - 37} ${Y_HEAD - 9} Q ${CX - 21} ${Y_HEAD - 31} ${CX} ${Y_HEAD - 26} Q ${CX + 21} ${Y_HEAD - 37} ${CX + 37} ${Y_HEAD - 14} Q ${CX + 42} ${Y_HEAD - 42} ${CX} ${Y_HEAD - 47} Q ${CX - 42} ${Y_HEAD - 42} ${CX - 37} ${Y_HEAD - 9} Z`} />
                <path d={`M ${CX - 29} ${Y_HEAD - 18} Q ${CX - 14} ${Y_HEAD - 29} ${CX + 3} ${Y_HEAD - 22} L ${CX - 2} ${Y_HEAD - 33} Q ${CX - 21} ${Y_HEAD - 35} ${CX - 31} ${Y_HEAD - 24} Z`} fill={hair.light} opacity="0.45" />
              </>
            )}
          </g>

          {/* === СЛОЙ 5: головной убор === */}
          {show.headwear && (
            <g filter={`url(#${uid}-soft)`}>
              {hot ? (
                <>
                  <ellipse cx={CX} cy={Y_HEAD - 24} rx="48" ry="12" fill={`url(#${gid('hat')})`} />
                  <path d={`M ${CX - 29} ${Y_HEAD - 24} Q ${CX} ${Y_HEAD - 58} ${CX + 29} ${Y_HEAD - 24} Z`} fill={`url(#${gid('hat')})`} />
                  <path d={`M ${CX - 29} ${Y_HEAD - 24} Q ${CX} ${Y_HEAD - 58} ${CX + 29} ${Y_HEAD - 24} Z`} fill={`url(#${gid('hi')})`} />
                  <rect x={CX - 29} y={Y_HEAD - 31} width="58" height="8" rx="4" fill={`url(#${gid('hatD')})`} />
                </>
              ) : zone === 'warm' || zone === 'mild' ? (
                <>
                  <path d={`M ${CX - 36} ${Y_HEAD - 13} Q ${CX} ${Y_HEAD - 54} ${CX + 36} ${Y_HEAD - 13} Z`} fill={`url(#${gid('hat')})`} />
                  <path d={`M ${CX - 36} ${Y_HEAD - 13} Q ${CX} ${Y_HEAD - 54} ${CX + 36} ${Y_HEAD - 13} Z`} fill={`url(#${gid('hi')})`} />
                  <path d={`M ${CX + 4} ${Y_HEAD - 22} Q ${CX + 31} ${Y_HEAD - 27} ${CX + 46} ${Y_HEAD - 13} Q ${CX + 27} ${Y_HEAD - 7} ${CX + 6} ${Y_HEAD - 11} Z`} fill={`url(#${gid('hatD')})`} />
                  <circle cx={CX} cy={Y_HEAD - 42} r="3.5" fill={`url(#${gid('hatD')})`} />
                </>
              ) : (
                <>
                  <path d={`M ${CX - 36} ${Y_HEAD - 13} Q ${CX} ${Y_HEAD - 58} ${CX + 36} ${Y_HEAD - 13} Z`} fill={`url(#${gid('hat')})`} />
                  <path d={`M ${CX - 36} ${Y_HEAD - 13} Q ${CX} ${Y_HEAD - 58} ${CX + 36} ${Y_HEAD - 13} Z`} fill={`url(#${gid('hi')})`} />
                  <rect x={CX - 38} y={Y_HEAD - 17} width="76" height="15" rx="7.5" fill={`url(#${gid('hatD')})`} />
                  {(zone === 'arctic' || zone === 'winter') && <circle cx={CX} cy={Y_HEAD - 52} r="11" fill="#FFFFFF" />}
                </>
              )}
            </g>
          )}

          {/* Очки на жаре */}
          {hot && show.accessory && (
            <g>
              <rect x={CX - 23} y={Y_HEAD + 1} width="19" height="13" rx="5.5" fill="#0F172A" />
              <rect x={CX + 4} y={Y_HEAD + 1} width="19" height="13" rx="5.5" fill="#0F172A" />
              <line x1={CX - 4} y1={Y_HEAD + 6} x2={CX + 4} y2={Y_HEAD + 6} stroke="#0F172A" strokeWidth="2.6" />
              <line x1={CX - 19} y1={Y_HEAD + 4} x2={CX - 11} y2={Y_HEAD + 9} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
              <line x1={CX + 8} y1={Y_HEAD + 4} x2={CX + 16} y2={Y_HEAD + 9} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            </g>
          )}
        </g>

        {/* === ЗОНТ === */}
        {isRainy && show.accessory && (
          <g className="animate-float" style={{ animationDuration: '4s' }} filter={`url(#${uid}-soft)`}>
            <line x1={CX + 41} y1={Y_SHOULDER + 95} x2={CX + 41} y2={Y_HEAD - 44} stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <path d={`M ${CX - 14} ${Y_HEAD - 22} Q ${CX + 41} ${Y_HEAD - 76} ${CX + 96} ${Y_HEAD - 22} Z`} fill="#EF4444" />
            <path d={`M ${CX - 14} ${Y_HEAD - 22} Q ${CX + 6} ${Y_HEAD - 31} ${CX + 26} ${Y_HEAD - 22} Q ${CX + 46} ${Y_HEAD - 31} ${CX + 66} ${Y_HEAD - 22} Q ${CX + 82} ${Y_HEAD - 30} ${CX + 96} ${Y_HEAD - 22}`} fill="none" stroke="#B91C1C" strokeWidth="2" opacity="0.5" />
          </g>
        )}
      </g>
    </svg>
  );
};
