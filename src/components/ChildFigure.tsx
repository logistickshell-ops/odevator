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

  // Новые пропорции (стиль Чиби)
  const CX = 120;         // Центр по X
  const R_HEAD = 42;      // Радиус головы
  const CY_HEAD = 80;     // Центр головы по Y
  const CY_NECK = 115;    // Шея
  const CY_SHOULDER = 125;// Плечи
  const CY_WAIST = 185;   // Талия
  const CY_HIP = 205;     // Бедра
  const CY_ANKLE = 290;   // Лодыжки

  // Цвета (Инк + палитры)
  const ink = '#3B3148';
  const skin = { l: '#FFEADF', d: '#F1C9B8' };
  const hair = girl 
    ? { l: '#8B5A2B', d: '#5C3A1B' } 
    : { l: '#5A4A3A', d: '#362B20' };

  // Палитра одежды зависит от пола
  const P = girl
    ? {
        top: { l: '#FFD1E0', d: '#FFA5C3' },   // Свитер
        bottom: { l: '#E6D0F5', d: '#CAA1E0' }, // Юбка
        outer: { l: '#FFB8C6', d: '#E57992' },  // Куртка
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

  // Идентификаторы для SVG
  const uid = girl ? 'g' : 'b';
  const gid = (n: string) => `${uid}-${n}`;

  // Пути для рук (опущены вниз, спокойная поза)
  const armL = `M ${CX - 28} ${CY_SHOULDER + 8} Q ${CX - 46} ${CY_SHOULDER + 50} ${CX - 42} ${CY_WAIST + 40}`;
  const armR = `M ${CX + 28} ${CY_SHOULDER + 8} Q ${CX + 46} ${CY_SHOULDER + 50} ${CX + 42} ${CY_WAIST + 40}`;

  return (
    <svg viewBox="0 0 240 400" className="h-full w-full select-none" role="img" aria-label="Иллюстрация ребёнка">
      <defs>
        {/* Тени и свечение */}
        <filter id={`${uid}-soft`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor={ink} floodOpacity="0.12" />
        </filter>
        <radialGradient id={gid('blush')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={cold ? '#FF8A8A' : '#FFB5B5'} stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFB5B5" stopOpacity="0" />
        </radialGradient>
        
        {/* Градиенты для всех слоев */}
        {Object.entries({ ...P, skin, hair }).map(([k, v]) => (
          <linearGradient key={k} id={gid(k)} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={(v as any).l} />
            <stop offset="100%" stopColor={(v as any).d} />
          </linearGradient>
        ))}
      </defs>

      {/* Фон и атмосфера */}
      <ellipse cx={CX} cy={CY_WAIST} rx="100" ry="120" fill={girl ? '#FFF0F5' : '#F0F5FF'} opacity="0.4" />
      <ellipse cx={CX} cy={CY_ANKLE + 15} rx="65" ry="14" fill={ink} opacity="0.12" />

      {/* Погодные эффекты */}
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
        
        {/* === НИЖНЯЯ ЧАСТЬ ТЕЛА === */}
        
        {/* Ноги (кожа) */}
        <g stroke={`url(#${gid('skin')})`} strokeWidth="22" strokeLinecap="round" fill="none" filter={`url(#${uid}-soft)`}>
          <path d={`M ${CX - 16} ${CY_HIP + 12} L ${CX - 16} ${CY_ANKLE}`} />
          <path d={`M ${CX + 16} ${CY_HIP + 12} L ${CX + 16} ${CY_ANKLE}`} />
        </g>

        {/* Белье (низ) */}
        {show.underwear && (
          <g filter={`url(#${uid}-soft)`}>
            <rect x={CX - 22} y={CY_WAIST - 6} width="44" height="26" rx="12" fill={`url(#${gid('under')})`} stroke={ink} strokeWidth="1.5" />
            {cold && (
              <>
                <line x1={CX - 12} y1={CY_WAIST} x2={CX - 12} y2={CY_WAIST + 15} stroke="#B0B0C0" strokeWidth="2" strokeDasharray="2,2" />
                <line x1={CX + 12} y1={CY_WAIST} x2={CX + 12} y2={CY_WAIST + 15} stroke="#B0B0C0" strokeWidth="2" strokeDasharray="2,2" />
              </>
            )}
          </g>
        )}

        {/* Одежда низ (Юбка/Шорты/Штаны) */}
        {show.lower && (
          <g filter={`url(#${uid}-soft)`}>
            {girl ? (
              // Юбка (для девочки)
              <path 
                d={`M ${CX - 24} ${CY_WAIST - 6} L ${CX + 24} ${CY_WAIST - 6} L ${CX + 42} ${CY_WAIST + 48} Q ${CX} ${CY_WAIST + 62} ${CX - 42} ${CY_WAIST + 48} Z`} 
                fill={`url(#${gid('bottom')})`} stroke={ink} strokeWidth="2" strokeLinejoin="round"
              />
            ) : hot || zone === 'warm' ? (
              // Шорты (для мальчика в теплую погоду)
              <rect x={CX - 22} y={CY_WAIST - 8} width="44" height="30" rx="12" fill={`url(#${gid('bottom')})`} stroke={ink} strokeWidth="2" />
            ) : (
              // Штаны (для мальчика)
              <path 
                d={`M ${CX - 24} ${CY_WAIST - 6} L ${CX + 24} ${CY_WAIST - 6} L ${CX + 24} ${CY_WAIST + 62} L ${CX - 24} ${CY_WAIST + 62} Z`} 
                fill={`url(#${gid('bottom')})`} stroke={ink} strokeWidth="2" strokeLinejoin="round"
              />
            )}
          </g>
        )}

        {/* Обувь */}
        {show.shoes ? (
          <g filter={`url(#${uid}-soft)`}>
            {cold ? (
              // Теплые зимние сапоги
              <>
                <rect x={CX - 30} y={CY_ANKLE - 10} width="28" height="34" rx="14" fill={`url(#${gid('shoesD')})`} stroke={ink} strokeWidth="2" />
                <rect x={CX + 2} y={CY_ANKLE - 10} width="28" height="34" rx="14" fill={`url(#${gid('shoesD')})`} stroke={ink} strokeWidth="2" />
                <ellipse cx={CX - 16} cy={CY_ANKLE - 4} rx="16" ry="6" fill="#FFFFFF" />
                <ellipse cx={CX + 16} cy={CY_ANKLE - 4} rx="16" ry="6" fill="#FFFFFF" />
              </>
            ) : (
              // Обычные кеды/туфельки
              <>
                <rect x={CX - 28} y={CY_ANKLE + 2} width="24" height="22" rx="10" fill={`url(#${gid('shoes')})`} stroke={ink} strokeWidth="2" />
                <rect x={CX + 4} y={CY_ANKLE + 2} width="24" height="22" rx="10" fill={`url(#${gid('shoes')})`} stroke={ink} strokeWidth="2" />
                <rect x={CX - 30} y={CY_ANKLE + 20} width="28" height="8" rx="4" fill={`url(#${gid('shoesD')})`} stroke={ink} strokeWidth="1.5" />
                <rect x={CX + 2} y={CY_ANKLE + 20} width="28" height="8" rx="4" fill={`url(#${gid('shoesD')})`} stroke={ink} strokeWidth="1.5" />
              </>
            )}
          </g>
        ) : null}

        {/* === ВЕРХНЯЯ ЧАСТЬ ТЕЛА === */}
        
        {/* Торс (кожа) */}
        <rect x={CX - 24} y={CY_SHOULDER - 4} width="48" height="90" rx="22" fill={`url(#${gid('skin')})`} stroke={ink} strokeWidth="2" />

        {/* Руки (кожа) */}
        <g stroke={`url(#${gid('skin')})`} strokeWidth="18" strokeLinecap="round" fill="none" filter={`url(#${uid}-soft)`}>
          <path d={armL} />
          <path d={armR} />
        </g>

        {/* Белье (верх) */}
        {show.underwear && (
          <g filter={`url(#${uid}-soft)`}>
            <rect x={CX - 26} y={CY_SHOULDER - 6} width="52" height="94" rx="20" fill={`url(#${gid('under')})`} stroke={ink} strokeWidth="2" />
            <path d={`M ${CX - 14} ${CY_SHOULDER - 6} Q ${CX} ${CY_SHOULDER + 14} ${CX + 14} ${CY_SHOULDER - 6}`} fill={`url(#${gid('skin')})`} stroke={ink} strokeWidth="2" />
          </g>
        )}

        {/* Верхняя одежда (Свитер) */}
        {show.lower && (
          <g filter={`url(#${uid}-soft)`}>
            <path d={armL} stroke={`url(#${gid('top')})`} strokeWidth="22" strokeLinecap="round" fill="none" stroke={ink} strokeWidth="2" />
            <path d={armR} stroke={`url(#${gid('top')})`} strokeWidth="22" strokeLinecap="round" fill="none" stroke={ink} strokeWidth="2" />
            <rect x={CX - 28} y={CY_SHOULDER - 6} width="56" height="96" rx="24" fill={`url(#${gid('top')})`} stroke={ink} strokeWidth="2" />
            <path d={`M ${CX - 15} ${CY_SHOULDER - 6} Q ${CX} ${CY_SHOULDER + 16} ${CX + 15} ${CY_SHOULDER - 6}`} fill={`url(#${gid('skin')})`} stroke={ink} strokeWidth="2" />
            {/* Горловина свитера */}
            <path d={`M ${CX - 18} ${CY_SHOULDER - 6} Q ${CX} ${CY_SHOULDER + 20} ${CX + 18} ${CY_SHOULDER - 6}`} fill="none" stroke={ink} strokeWidth="4" opacity="0.4" />
          </g>
        )}

        {/* Худи / Кофта (для прохлады) */}
        {show.upper && coolish && (
          <g filter={`url(#${uid}-soft)`}>
            <path d={armL} stroke={`url(#${gid('upper')})`} strokeWidth="26" strokeLinecap="round" fill="none" stroke={ink} strokeWidth="2" />
            <path d={armR} stroke={`url(#${gid('upper')})`} strokeWidth="26" strokeLinecap="round" fill="none" stroke={ink} strokeWidth="2" />
            <rect x={CX - 32} y={CY_SHOULDER - 8} width="64" height="102" rx="28" fill={`url(#${gid('upper')})`} stroke={ink} strokeWidth="2" />
            <path d={`M ${CX - 16} ${CY_SHOULDER - 8} Q ${CX} ${CY_SHOULDER + 18} ${CX + 16} ${CY_SHOULDER - 8}`} fill={`url(#${gid('top')})`} stroke={ink} strokeWidth="2" />
          </g>
        )}

        {/* Пальто/Куртка (для холода) */}
        {show.outer && (
          <g filter={`url(#${uid}-soft)`}>
            <path d={armL} stroke={`url(#${gid('outer')})`} strokeWidth="30" strokeLinecap="round" fill="none" stroke={ink} strokeWidth="2" />
            <path d={armR} stroke={`url(#${gid('outer')})`} strokeWidth="30" strokeLinecap="round" fill="none" stroke={ink} strokeWidth="2" />
            <rect x={CX - 34} y={CY_SHOULDER - 10} width="68" height="112" rx="30" fill={`url(#${gid('outer')})`} stroke={ink} strokeWidth="2" />
            <line x1={CX} y1={CY_SHOULDER - 8} x2={CX} y2={CY_WAIST + 26} stroke={ink} strokeWidth="4" strokeLinecap="round" opacity="0.5" />
            <circle cx={CX} cy={CY_SHOULDER + 4} r="4" fill={ink} opacity="0.6" />
          </g>
        )}

        {/* Варежки / Кисти рук */}
        {cold && show.accessory ? (
          <g filter={`url(#${uid}-soft)`}>
            <circle cx={CX - 44} cy={CY_WAIST + 36} r="14" fill={`url(#${gid('mitt')})`} stroke={ink} strokeWidth="2" />
            <circle cx={CX + 44} cy={CY_WAIST + 36} r="14" fill={`url(#${gid('mitt')})`} stroke={ink} strokeWidth="2" />
          </g>
        ) : (
          <g fill={`url(#${gid('skin')})`} stroke={ink} strokeWidth="2">
            <circle cx={CX - 42} cy={CY_WAIST + 36} r="9" />
            <circle cx={CX + 42} cy={CY_WAIST + 36} r="9" />
          </g>
        )}

        {/* Шарф */}
        {coolish && show.accessory && (
          <g filter={`url(#${uid}-soft)`}>
            <rect x={CX - 22} y={CY_NECK - 12} width="44" height="18" rx="9" fill={`url(#${gid('scarf')})`} stroke={ink} strokeWidth="2" />
            <path d={isWindy
              ? `M ${CX - 18} ${CY_NECK} Q ${CX - 40} ${CY_NECK + 30} ${CX - 54} ${CY_NECK + 40} L ${CX - 44} ${CY_NECK + 52} Q ${CX - 28} ${CY_NECK + 42} ${CX - 8} ${CY_NECK + 6}`
              : `M ${CX - 16} ${CY_NECK} L ${CX - 10} ${CY_NECK + 50} L ${CX} ${CY_NECK + 46} L ${CX - 6} ${CY_NECK}`} 
              fill={`url(#${gid('scarf')})`} stroke={ink} strokeWidth="2" />
          </g>
        )}

        {/* === ГОЛОВА И ЛИЦО === */}

        {/* Задние волосы (Девочка) */}
        {girl && (
          <g fill={`url(#${gid('hair')})`} stroke={ink} strokeWidth="2">
            <circle cx={CX - 34} cy={CY_HEAD + 8} r="16" />
            <circle cx={CX + 34} cy={CY_HEAD + 8} r="16" />
            {/* Хвостик */}
            <path d={`M ${CX + 34} ${CY_HEAD - 10} Q ${CX + 60} ${CY_HEAD - 20} ${CX + 55} ${CY_HEAD + 30} Q ${CX + 50} ${CY_HEAD + 50} ${CX + 35} ${CY_HEAD + 34} Z`} />
          </g>
        )}

        {/* Голова (кожа) */}
        <g filter={`url(#${uid}-soft)`}>
          <circle cx={CX} cy={CY_HEAD} r={R_HEAD} fill={`url(#${gid('skin')})`} stroke={ink} strokeWidth="2.5" />
          <path d={`M ${CX - R_HEAD} ${CY_HEAD} A ${R_HEAD} ${R_HEAD} 0 0 0 ${CX + R_HEAD} ${CY_HEAD} A 60 60 0 0 1 ${CX - R_HEAD} ${CY_HEAD} Z`} fill={ink} opacity="0.06" />

          {/* Брови */}
          <g stroke={hair.d} strokeWidth="3" strokeLinecap="round" fill="none">
            <path d={`M ${CX - 22} ${CY_HEAD - 4} Q ${CX - 16} ${CY_HEAD - 8} ${CX - 10} ${CY_HEAD - 4}`} />
            <path d={`M ${CX + 10} ${CY_HEAD - 4} Q ${CX + 16} ${CY_HEAD - 8} ${CX + 22} ${CY_HEAD - 4}`} />
          </g>

          {/* ГЛАЗА (Открытые у обоих, как просили) */}
          <g>
            {/* Левый глаз */}
            <ellipse cx={CX - 14} cy={CY_HEAD + 6} rx="9" ry="10" fill="#FFFFFF" stroke={ink} strokeWidth="2" />
            <circle cx={CX - 14} cy={CY_HEAD + 8} r="6" fill={ink} />
            <circle cx={CX - 16} cy={CY_HEAD + 5} r="2.2" fill="#FFFFFF" />
            <circle cx={CX - 12} cy={CY_HEAD + 10} r="1" fill="#FFFFFF" opacity="0.7" />
            
            {/* Правый глаз */}
            <ellipse cx={CX + 14} cy={CY_HEAD + 6} rx="9" ry="10" fill="#FFFFFF" stroke={ink} strokeWidth="2" />
            <circle cx={CX + 14} cy={CY_HEAD + 8} r="6" fill={ink} />
            <circle cx={CX + 12} cy={CY_HEAD + 5} r="2.2" fill="#FFFFFF" />
            <circle cx={CX + 16} cy={CY_HEAD + 10} r="1" fill="#FFFFFF" opacity="0.7" />
            
            {/* Ресницы для девочки */}
            {girl && (
              <g stroke={ink} strokeWidth="2" strokeLinecap="round">
                <line x1={CX - 22} y1={CY_HEAD + 2} x2={CX - 26} y2={CY_HEAD - 2} />
                <line x1={CX + 22} y1={CY_HEAD + 2} x2={CX + 26} y2={CY_HEAD - 2} />
              </g>
            )}
          </g>

          {/* Румянец */}
          <circle cx={CX - 24} cy={CY_HEAD + 16} r={cold ? 10 : 8} fill={`url(#${gid('blush')})`} />
          <circle cx={CX + 24} cy={CY_HEAD + 16} r={cold ? 10 : 8} fill={`url(#${gid('blush')})`} />

          {/* Носик */}
          <circle cx={CX} cy={CY_HEAD + 14} r="2.5" fill={ink} opacity="0.15" />

          {/* Ротик */}
          {hot ? (
            <path d={`M ${CX - 8} ${CY_HEAD + 24} Q ${CX} ${CY_HEAD + 36} ${CX + 8} ${CY_HEAD + 24} Z`} fill={ink} />
          ) : (
            <path d={`M ${CX - 7} ${CY_HEAD + 25} Q ${CX} ${CY_HEAD + 32} ${CX + 7} ${CY_HEAD + 25}`} fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
          )}

          {/* Веснушки (мальчик) */}
          {!girl && (
            <g fill={ink} opacity="0.4">
              <circle cx={CX - 22} cy={CY_HEAD + 14} r="1.5" />
              <circle cx={CX - 26} cy={CY_HEAD + 18} r="1.5" />
              <circle cx={CX + 22} cy={CY_HEAD + 14} r="1.5" />
              <circle cx={CX + 26} cy={CY_HEAD + 18} r="1.5" />
            </g>
          )}

          {/* Пар изо рта в холод */}
          {cold && (
            <g opacity="0.4" className="animate-float" style={{ animationDuration: '2s' }}>
              <ellipse cx={CX + 18} cy={CY_HEAD + 28} rx="8" ry="4" fill="#FFFFFF" />
              <ellipse cx={CX + 28} cy={CY_HEAD + 24} rx="5" ry="2.5" fill="#FFFFFF" />
            </g>
          )}

          {/* Волосы (Передняя часть) */}
          <g fill={`url(#${gid('hair')})`} stroke={ink} strokeWidth="2">
            {girl ? (
              // Девочка: аккуратная челка и боковые пряди
              <>
                <path d={`M ${CX - 40} ${CY_HEAD - 6} Q ${CX - 10} ${CY_HEAD - 26} ${CX + 8} ${CY_HEAD - 14} Q ${CX + 28} ${CY_HEAD - 32} ${CX + 40} ${CY_HEAD - 16} Q ${CX + 34} ${CY_HEAD - 42} ${CX} ${CY_HEAD - 46} Q ${CX - 34} ${CY_HEAD - 42} ${CX - 40} ${CY_HEAD - 6} Z`} />
                <path d={`M ${CX - 30} ${CY_HEAD - 14} L ${CX - 20} ${CY_HEAD + 10} Q ${CX - 12} ${CY_HEAD + 16} ${CX - 6} ${CY_HEAD + 2} L ${CX - 6} ${CY_HEAD - 22} Z`} />
                <path d={`M ${CX + 30} ${CY_HEAD - 14} L ${CX + 20} ${CY_HEAD + 10} Q ${CX + 12} ${CY_HEAD + 16} ${CX + 6} ${CY_HEAD + 2} L ${CX + 6} ${CY_HEAD - 22} Z`} />
              </>
            ) : (
              // Мальчик: короткая, с вихрами
              <>
                <path d={`M ${CX - 40} ${CY_HEAD - 8} Q ${CX - 20} ${CY_HEAD - 42} ${CX} ${CY_HEAD - 34} Q ${CX + 20} ${CY_HEAD - 44} ${CX + 40} ${CY_HEAD - 12} Q ${CX + 44} ${CY_HEAD - 40} ${CX} ${CY_HEAD - 50} Q ${CX - 44} ${CY_HEAD - 40} ${CX - 40} ${CY_HEAD - 8} Z`} />
                <path d={`M ${CX - 28} ${CY_HEAD - 20} Q ${CX - 20} ${CY_HEAD - 32} ${CX - 6} ${CY_HEAD - 24} Q ${CX - 6} ${CY_HEAD - 44} ${CX - 34} ${CY_HEAD - 34} Z`} />
                <path d={`M ${CX - 2} ${CY_HEAD - 22} Q ${CX + 10} ${CY_HEAD - 40} ${CX + 24} ${CY_HEAD - 30} Q ${CX + 10} ${CY_HEAD - 44} ${CX - 4} ${CY_HEAD - 34} Z`} />
              </>
            )}
          </g>
        </g>

        {/* === ГОЛОВНЫЕ УБОРЫ === */}
        
        {show.headwear && (
          <g filter={`url(#${uid}-soft)`}>
            {hot ? (
              // Панама/Шляпа
              <>
                <ellipse cx={CX} cy={CY_HEAD - 28} rx="48" ry="14" fill={`url(#${gid('hat')})`} stroke={ink} strokeWidth="2" />
                <path d={`M ${CX - 32} ${CY_HEAD - 28} Q ${CX} ${CY_HEAD - 70} ${CX + 32} ${CY_HEAD - 28} Z`} fill={`url(#${gid('hat')})`} stroke={ink} strokeWidth="2" />
              </>
            ) : zone === 'warm' || zone === 'mild' ? (
              // Кепка/Бейсболка
              <>
                <path d={`M ${CX - 36} ${CY_HEAD - 16} Q ${CX} ${CY_HEAD - 56} ${CX + 36} ${CY_HEAD - 16} Z`} fill={`url(#${gid('hat')})`} stroke={ink} strokeWidth="2" />
                <path d={`M ${CX + 6} ${CY_HEAD - 22} Q ${CX + 34} ${CY_HEAD - 26} ${CX + 46} ${CY_HEAD - 12} Q ${CX + 28} ${CY_HEAD - 6} ${CX + 6} ${CY_HEAD - 14} Z`} fill={`url(#${gid('hatD')})`} stroke={ink} strokeWidth="2" />
              </>
            ) : (
              // Теплая зимняя шапка
              <>
                <path d={`M ${CX - 38} ${CY_HEAD - 16} Q ${CX} ${CY_HEAD - 62} ${CX + 38} ${CY_HEAD - 16} Z`} fill={`url(#${gid('hat')})`} stroke={ink} strokeWidth="2" />
                <rect x={CX - 40} y={CY_HEAD - 18} width="80" height="16" rx="8" fill={`url(#${gid('hatD')})`} stroke={ink} strokeWidth="2" />
                {(zone === 'arctic' || zone === 'winter') && <circle cx={CX} cy={CY_HEAD - 56} r="12" fill="#FFFFFF" stroke={ink} strokeWidth="1.5" />}
              </>
            )}
          </g>
        )}
        
        {/* Очки (для жары) */}
        {hot && show.accessory && (
          <g>
            <rect x={CX - 26} y={CY_HEAD - 4} width="22" height="14" rx="6" fill="none" stroke="#0F172A" strokeWidth="3" />
            <rect x={CX + 4} y={CY_HEAD - 4} width="22" height="14" rx="6" fill="none" stroke="#0F172A" strokeWidth="3" />
            <line x1={CX - 4} y1={CY_HEAD + 3} x2={CX + 4} y2={CY_HEAD + 3} stroke="#0F172A" strokeWidth="3" />
            <line x1={CX - 12} y1={CY_HEAD + 2} x2={CX - 8} y2={CY_HEAD + 10} stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
            <line x1={CX + 16} y1={CY_HEAD + 2} x2={CX + 20} y2={CY_HEAD + 10} stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
          </g>
        )}
      </g>
    </svg>
  );
};
