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

  const CX = 120;
  // Chibi-пропорции (2,5 головы): голова 40%, тело 30%, ноги 30%
  const HEAD_CY = 95, HEAD_R = 60;
  const TORSO_TOP = 162, TORSO_BOT = 256;
  const HAND_Y = 256, ANKLE_Y = 348;

  const C = girl
    ? { skin: '#FFDAB9', skinSh: '#F0B896', hair: '#8B4513', hairHi: '#B06A2C',
        top: '#87CEEB', topSh: '#5BA3C9', upper: '#DDA0DD', upperSh: '#B77FBA',
        outer: '#FF69B4', outerSh: '#D14E93', bottom: '#87CEEB', bottomSh: '#5BA3C9',
        shoes: '#FF6347', shoesSh: '#C74A32', hat: '#87CEEB', hatSh: '#5BA3C9',
        scarf: '#FF69B4', scarfSh: '#D14E93', mitt: '#DDA0DD', mittSh: '#B77FBA',
        under: '#FFFFFF', underSh: '#DDDDDD', outline: '#4A3728', blush: '#FFAFBE' }
    : { skin: '#FFDAB9', skinSh: '#F0B896', hair: '#5B3A1E', hairHi: '#7D5226',
        top: '#87CEEB', topSh: '#5BA3C9', upper: '#6495ED', upperSh: '#4677C9',
        outer: '#4169E1', outerSh: '#2C4EB8', bottom: '#4682B4', bottomSh: '#2E6091',
        shoes: '#FF6347', shoesSh: '#C74A32', hat: '#4682B4', hatSh: '#2E6091',
        scarf: '#FF6347', scarfSh: '#C74A32', mitt: '#6495ED', mittSh: '#4677C9',
        under: '#FFFFFF', underSh: '#DDDDDD', outline: '#4A3728', blush: '#FFAFBE' };

  const shortSleeve = hot || zone === 'warm';
  const drawSkirt = girl && !cold && zone !== 'chilly';
  const drawShorts = !girl && (hot || zone === 'warm');

  // Центр-линии конечностей (для double-stroke)
  const armL = `M 86 174 Q 70 196 66 226 Q 64 246 68 ${HAND_Y}`;
  const armR = `M 154 174 Q 170 196 174 226 Q 176 246 172 ${HAND_Y}`;
  const slvL = `M 86 174 Q 70 196 66 226 Q 65 240 67 248`;
  const slvR = `M 154 174 Q 170 196 174 226 Q 175 240 173 248`;
  const shrL = `M 86 174 Q 74 188 70 204`;
  const shrR = `M 154 174 Q 166 188 170 204`;
  const legL = `M 106 254 L 103 ${ANKLE_Y}`;
  const legR = `M 134 254 L 137 ${ANKLE_Y}`;

  // Торс-«трапеция» с параметрами ширины
  const torso = (ht: number, hb: number, ty: number, by: number) =>
    `M ${CX - ht} ${ty} Q ${CX} ${ty - 10} ${CX + ht} ${ty} L ${CX + hb + 2} ${(ty + by) / 2} Q ${CX + hb} ${by} ${CX} ${by + 8} Q ${CX - hb} ${by} ${CX - hb - 2} ${(ty + by) / 2} Z`;

  // Double-stroke: контур + заливка
  const limb = (d: string, fill: string, w: number, outline = C.outline) => (
    <>
      <path d={d} stroke={outline} strokeWidth={w + 5} strokeLinecap="round" fill="none" />
      <path d={d} stroke={fill} strokeWidth={w} strokeLinecap="round" fill="none" />
    </>
  );

  return (
    <svg viewBox="0 0 240 400" className="h-full w-full select-none" role="img" aria-label="Иллюстрация ребёнка по погоде">
      {/* Тень под ногами */}
      <ellipse cx={CX} cy={ANKLE_Y + 22} rx="52" ry="8" fill={C.outline} opacity="0.14" />

      {/* Погода */}
      {isSnowy && (
        <g fill="#FFFFFF" opacity="0.9">
          {[28, 68, 108, 148, 188, 218].map((x, i) => (
            <circle key={x} cx={x} cy={26 + i * 52} r={i % 2 ? 3.5 : 4.5} />
          ))}
        </g>
      )}
      {isRainy && (
        <g stroke="#7FB3E8" strokeWidth="3" strokeLinecap="round" opacity="0.6">
          {[28, 74, 120, 166, 212].map((x, i) => (
            <line key={x} x1={x} y1={16 + i * 22} x2={x - 7} y2={44 + i * 22} />
          ))}
        </g>
      )}

      <g>
        {/* === ВОЛОСЫ СЗАДИ (девочка: хвостики) === */}
        {girl && (
          <g>
            <ellipse cx={CX - 66} cy={HEAD_CY + 16} rx="15" ry="22" fill={C.hair} stroke={C.outline} strokeWidth="2.5" />
            <ellipse cx={CX + 66} cy={HEAD_CY + 16} rx="15" ry="22" fill={C.hair} stroke={C.outline} strokeWidth="2.5" />
            <ellipse cx={CX - 62} cy={HEAD_CY + 10} rx="6" ry="10" fill={C.hairHi} opacity="0.5" />
            <ellipse cx={CX + 62} cy={HEAD_CY + 10} rx="6" ry="10" fill={C.hairHi} opacity="0.5" />
            <circle cx={CX - 62} cy={HEAD_CY - 4} r="5" fill={C.hat} stroke={C.outline} strokeWidth="2" />
            <circle cx={CX + 62} cy={HEAD_CY - 4} r="5" fill={C.hat} stroke={C.outline} strokeWidth="2" />
          </g>
        )}

        {/* === КАПЮШОН (за головой, если надет верхний слой) === */}
        {show.upper && (coolish || zone === 'mild') && (
          <path d={`M 78 150 Q 58 172 74 188 Q ${CX} 202 ${CX + 46} 188 Q ${CX + 62} 172 ${CX + 42} 150 Q ${CX} 170 78 150 Z`} fill={C.upperSh} stroke={C.outline} strokeWidth="2.5" />
        )}

        {/* === НОГИ (кожа) === */}
        {limb(legL, C.skin, 20)}
        {limb(legR, C.skin, 20)}

        {/* === СЛОЙ 1: бельё (низ) === */}
        {show.underwear && (
          <path d={`M 84 240 Q ${CX} 234 ${CX + 36} 240 L ${CX + 38} 262 Q ${CX} 272 ${CX - 38} 262 Z`} fill={C.under} stroke={C.outline} strokeWidth="2.5" />
        )}

        {/* === СЛОЙ 2: нижний (низ) === */}
        {show.lower && (
          <g>
            {drawSkirt ? (
              <>
                <path d={`M 82 238 L ${CX + 38} 238 L ${CX + 56} 306 Q ${CX} 318 ${CX - 56} 306 Z`} fill={C.bottom} stroke={C.outline} strokeWidth="2.5" />
                {[-30, -15, 0, 15, 30].map((dx) => (
                  <line key={dx} x1={CX + dx * 0.6} y1={242} x2={CX + dx} y2={302} stroke={C.outline} strokeWidth="1.8" opacity="0.3" />
                ))}
              </>
            ) : drawShorts ? (
              <>
                <path d={`M 82 238 Q ${CX} 232 ${CX + 38} 238 L ${CX + 40} 262 Q ${CX} 272 ${CX - 40} 262 Z`} fill={C.bottom} stroke={C.outline} strokeWidth="2.5" />
                {limb(`M 106 252 L 104 296`, C.bottom, 24)}
                {limb(`M 134 252 L 136 296`, C.bottom, 24)}
              </>
            ) : (
              <>
                <path d={`M 82 238 Q ${CX} 232 ${CX + 38} 238 L ${CX + 40} 262 Q ${CX} 272 ${CX - 40} 262 Z`} fill={C.bottom} stroke={C.outline} strokeWidth="2.5" />
                {limb(`M 106 252 L 103 344`, C.bottom, 24)}
                {limb(`M 134 252 L 137 344`, C.bottom, 24)}
              </>
            )}
          </g>
        )}

        {/* === СЛОЙ 6: обувь === */}
        {show.shoes ? (
          <g>
            {cold ? (
              <>
                <rect x={87} y={326} width="32" height="40" rx="13" fill={C.shoes} stroke={C.outline} strokeWidth="2.5" />
                <rect x={121} y={326} width="32" height="40" rx="13" fill={C.shoes} stroke={C.outline} strokeWidth="2.5" />
                <ellipse cx={103} cy={328} rx="15" ry="6" fill="#FFFFFF" stroke={C.outline} strokeWidth="2" />
                <ellipse cx={137} cy={328} rx="15" ry="6" fill="#FFFFFF" stroke={C.outline} strokeWidth="2" />
                <rect x={85} y={360} width="36" height="8" rx="4" fill={C.shoesSh} stroke={C.outline} strokeWidth="2" />
                <rect x={119} y={360} width="36" height="8" rx="4" fill={C.shoesSh} stroke={C.outline} strokeWidth="2" />
              </>
            ) : hot ? (
              <>
                <rect x={87} y={352} width="32" height="12" rx="6" fill={C.shoes} stroke={C.outline} strokeWidth="2.5" />
                <rect x={121} y={352} width="32" height="12" rx="6" fill={C.shoes} stroke={C.outline} strokeWidth="2.5" />
                <path d={`M 95 344 L 105 354 M 109 344 L 101 354`} stroke={C.shoes} strokeWidth="4" strokeLinecap="round" />
                <path d={`M 129 344 L 139 354 M 143 344 L 135 354`} stroke={C.shoes} strokeWidth="4" strokeLinecap="round" />
              </>
            ) : (
              <>
                <rect x={87} y={344} width="32" height="20" rx="10" fill={C.shoes} stroke={C.outline} strokeWidth="2.5" />
                <rect x={121} y={344} width="32" height="20" rx="10" fill={C.shoes} stroke={C.outline} strokeWidth="2.5" />
                <rect x={85} y={360} width="36" height="8" rx="4" fill={C.shoesSh} stroke={C.outline} strokeWidth="2" />
                <rect x={119} y={360} width="36" height="8" rx="4" fill={C.shoesSh} stroke={C.outline} strokeWidth="2" />
                <line x1={95} y1={352} x2={109} y2={352} stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                <line x1={129} y1={352} x2={143} y2={352} stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              </>
            )}
          </g>
        ) : (
          <g>
            <ellipse cx={103} cy={ANKLE_Y + 12} rx="14" ry="9" fill={C.under} stroke={C.outline} strokeWidth="2.5" />
            <ellipse cx={137} cy={ANKLE_Y + 12} rx="14" ry="9" fill={C.under} stroke={C.outline} strokeWidth="2.5" />
          </g>
        )}

        {/* === РУКИ (кожа) + кисти === */}
        {limb(armL, C.skin, 16)}
        {limb(armR, C.skin, 16)}
        <circle cx={68} cy={HAND_Y} r="10" fill={C.skin} stroke={C.outline} strokeWidth="2.5" />
        <circle cx={172} cy={HAND_Y} r="10" fill={C.skin} stroke={C.outline} strokeWidth="2.5" />

        {/* === ШЕЯ === */}
        <rect x={108} y={142} width="24" height="24" rx="8" fill={C.skin} />

        {/* === ТОРС (кожа) === */}
        <path d={torso(32, 36, TORSO_TOP, TORSO_BOT)} fill={C.skin} stroke={C.outline} strokeWidth="2.5" />

        {/* === СЛОЙ 1: бельё (верх) === */}
        {show.underwear && (
          <g>
            {cold ? (
              <>
                {limb(slvL, C.under, 18)}
                {limb(slvR, C.under, 18)}
              </>
            ) : (
              <>
                <line x1={102} y1={160} x2={106} y2={172} stroke={C.under} strokeWidth="6" strokeLinecap="round" />
                <line x1={138} y1={160} x2={134} y2={172} stroke={C.under} strokeWidth="6" strokeLinecap="round" />
              </>
            )}
            <path d={torso(34, 38, 160, 258)} fill={C.under} stroke={C.outline} strokeWidth="2.5" />
            <path d={`M 108 160 Q ${CX} 176 ${CX + 12} 160`} fill={C.skin} stroke={C.outline} strokeWidth="2" />
          </g>
        )}

        {/* === СЛОЙ 2: нижний (верх) === */}
        {show.lower && (
          <g>
            {shortSleeve ? (
              <>
                {limb(shrL, C.top, 20)}
                {limb(shrR, C.top, 20)}
              </>
            ) : (
              <>
                {limb(slvL, C.top, 20)}
                {limb(slvR, C.top, 20)}
              </>
            )}
            <path d={torso(36, 40, 158, 260)} fill={C.top} stroke={C.outline} strokeWidth="2.5" />
            <path d={`M 106 158 Q ${CX} 176 ${CX + 14} 158`} fill={show.underwear ? C.under : C.skin} stroke={C.outline} strokeWidth="2" />
            <path d={`M 96 170 Q 92 200 96 236`} stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.25" />
          </g>
        )}

        {/* === СЛОЙ 3: верхний (худи) === */}
        {show.upper && (coolish || zone === 'mild') && (
          <g>
            {limb(slvL, C.upper, 23)}
            {limb(slvR, C.upper, 23)}
            <path d={torso(38, 42, 156, 262)} fill={C.upper} stroke={C.outline} strokeWidth="2.5" />
            <path d={`M 104 156 Q ${CX} 178 ${CX + 16} 156`} fill={C.top} stroke={C.outline} strokeWidth="2" />
            <line x1={114} y1={170} x2={114} y2={192} stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <line x1={126} y1={170} x2={126} y2={192} stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <circle cx={114} cy={193} r="2.5" fill="#FFFFFF" />
            <circle cx={126} cy={193} r="2.5" fill="#FFFFFF" />
            <path d={`M 102 236 Q ${CX} 230 ${CX + 18} 236 L ${CX + 22} 256 Q ${CX} 262 ${CX - 22} 256 Z`} fill={C.upperSh} opacity="0.5" stroke={C.outline} strokeWidth="2" />
          </g>
        )}

        {/* === СЛОЙ 4: верхняя одежда === */}
        {show.outer && (
          <g>
            {limb(slvL, C.outer, 26)}
            {limb(slvR, C.outer, 26)}
            <path d={torso(40, 44, 154, 264)} fill={C.outer} stroke={C.outline} strokeWidth="2.5" />
            <line x1={CX} y1={152} x2={CX} y2={268} stroke={C.hatSh} strokeWidth="3.5" strokeLinecap="round" />
            <circle cx={CX} cy={164} r="3" fill={C.hatSh} />
            <rect x={94} y={234} width="14" height="16" rx="5" fill={C.outerSh} opacity="0.6" stroke={C.outline} strokeWidth="1.8" />
            <rect x={132} y={234} width="14" height="16" rx="5" fill={C.outerSh} opacity="0.6" stroke={C.outline} strokeWidth="1.8" />
            {(zone === 'arctic' || zone === 'winter') && !isRainy && (
              <g stroke={C.outline} strokeWidth="1.8" opacity="0.3" fill="none">
                <line x1={84} y1={182} x2={156} y2={182} />
                <line x1={82} y1={210} x2={158} y2={210} />
                <line x1={82} y1={238} x2={158} y2={238} />
              </g>
            )}
            {zone === 'arctic' && !isRainy && (
              <path d={`M 96 154 Q ${CX} 176 ${CX + 24} 154 Q ${CX} 132 96 154 Z`} fill="#FAFAF9" stroke={C.outline} strokeWidth="2.5" />
            )}
          </g>
        )}

        {/* === ВАРЕЖКИ === */}
        {cold && show.accessory && (
          <g>
            <circle cx={68} cy={HAND_Y} r="12" fill={C.mitt} stroke={C.outline} strokeWidth="2.5" />
            <circle cx={172} cy={HAND_Y} r="12" fill={C.mitt} stroke={C.outline} strokeWidth="2.5" />
            <rect x={58} y={240} width="20" height="8" rx="4" fill="#FFFFFF" stroke={C.outline} strokeWidth="2" />
            <rect x={162} y={240} width="20" height="8" rx="4" fill="#FFFFFF" stroke={C.outline} strokeWidth="2" />
          </g>
        )}

        {/* === ШАРФ === */}
        {coolish && show.accessory && (
          <g>
            <rect x={94} y={146} width="52" height="20" rx="10" fill={C.scarf} stroke={C.outline} strokeWidth="2.5" />
            <path d={isWindy
              ? `M 104 164 Q 88 186 72 192 L 78 204 Q 96 196 112 168 Z`
              : `M 104 164 L 108 200 L 118 197 L 114 164 Z`} fill={C.scarf} stroke={C.outline} strokeWidth="2.5" />
          </g>
        )}

        {/* === ГОЛОВА === */}
        <g>
          <circle cx={CX} cy={HEAD_CY} r={HEAD_R} fill={C.skin} stroke={C.outline} strokeWidth="3" />

          {/* Брови */}
          <g stroke={C.hair} strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d={`M 84 78 Q 92 72 100 78`} />
            <path d={`M 140 78 Q 148 72 156 78`} />
          </g>

          {/* Глаза: большие, с бликами */}
          <ellipse cx={98} cy={100} rx="11" ry="13" fill="#FFFFFF" stroke={C.outline} strokeWidth="2.5" />
          <ellipse cx={142} cy={100} rx="11" ry="13" fill="#FFFFFF" stroke={C.outline} strokeWidth="2.5" />
          <circle cx={98} cy={102} r="7.5" fill={C.hair} />
          <circle cx={142} cy={102} r="7.5" fill={C.hair} />
          <circle cx={95} cy={98} r="3" fill="#FFFFFF" />
          <circle cx={139} cy={98} r="3" fill="#FFFFFF" />
          <circle cx={101} cy={106} r="1.4" fill="#FFFFFF" opacity="0.8" />
          <circle cx={145} cy={106} r="1.4" fill="#FFFFFF" opacity="0.8" />
          {girl && (
            <g stroke={C.outline} strokeWidth="2.5" strokeLinecap="round">
              <line x1={87} y1={92} x2={82} y2={88} />
              <line x1={153} y1={92} x2={158} y2={88} />
            </g>
          )}

          {/* Румянец */}
          <circle cx={82} cy={116} r={cold ? 10 : 8} fill={C.blush} opacity="0.6" />
          <circle cx={158} cy={116} r={cold ? 10 : 8} fill={C.blush} opacity="0.6" />

          {/* Нос */}
          <circle cx={CX} cy={112} r="2" fill={C.skinSh} />

          {/* Рот */}
          {hot ? (
            <path d={`M 110 124 Q ${CX} 138 ${CX + 10} 124 Z`} fill={C.hair} stroke={C.outline} strokeWidth="2.5" />
          ) : (
            <path d={`M 111 126 Q ${CX} 134 ${CX + 9} 126`} fill="none" stroke={C.outline} strokeWidth="3" strokeLinecap="round" />
          )}

          {/* Веснушки */}
          {!girl && (
            <g fill={C.hair} opacity="0.45">
              <circle cx={84} cy={110} r="1.6" /><circle cx={79} cy={115} r="1.6" />
              <circle cx={156} cy={110} r="1.6" /><circle cx={161} cy={115} r="1.6" />
            </g>
          )}

          {/* Дыхание на морозе */}
          {cold && (
            <g opacity="0.5" className="animate-float" style={{ animationDuration: '2s' }}>
              <ellipse cx={140} cy={132} rx="7" ry="3.5" fill="#FFFFFF" />
              <ellipse cx={150} cy={127} rx="5" ry="2.5" fill="#FFFFFF" />
            </g>
          )}

          {/* Волосы спереди */}
          <g fill={C.hair} stroke={C.outline} strokeWidth="2.5">
            {girl ? (
              <path d={`M 60 100 Q 56 36 ${CX} 32 Q 184 36 180 100 Q 172 78 160 84 Q 152 68 140 80 Q 130 66 ${CX} 80 Q 110 66 100 80 Q 88 68 80 84 Q 68 78 60 100 Z`} />
            ) : (
              <path d={`M 62 96 Q 58 34 ${CX} 30 Q 182 34 178 96 Q 174 70 162 76 Q 166 58 150 66 Q 148 50 134 62 Q 126 46 114 62 Q 104 50 98 68 Q 86 58 88 76 Q 74 68 76 84 Q 66 80 62 96 Z`} />
            )}
            <path d={girl
              ? `M 74 62 Q 90 48 108 54 Q 96 44 82 50 Z`
              : `M 78 56 Q 96 42 116 48 Q 100 38 84 46 Z`} fill={C.hairHi} opacity="0.6" />
          </g>

          {/* === ГОЛОВНОЙ УБОР === */}
          {show.headwear && (
            <g>
              {hot ? (
                <>
                  <ellipse cx={CX} cy={70} rx="56" ry="13" fill={C.hat} stroke={C.outline} strokeWidth="2.5" />
                  <path d={`M 78 68 Q 80 32 ${CX} 30 Q 160 32 162 68 Z`} fill={C.hat} stroke={C.outline} strokeWidth="2.5" />
                  <rect x={78} y={58} width="84" height="10" rx="5" fill={C.hatSh} stroke={C.outline} strokeWidth="2" />
                </>
              ) : zone === 'warm' || zone === 'mild' ? (
                <>
                  <path d={`M 64 74 Q 64 28 ${CX} 26 Q 176 28 176 74 Z`} fill={C.hat} stroke={C.outline} strokeWidth="2.5" />
                  <path d={`M 60 74 Q ${CX} 92 180 74 Q 186 84 ${CX} 98 Q 54 84 60 74 Z`} fill={C.hatSh} stroke={C.outline} strokeWidth="2.5" />
                  <circle cx={CX} cy={26} r="4" fill={C.hatSh} stroke={C.outline} strokeWidth="2" />
                </>
              ) : (
                <>
                  <path d={`M 62 78 Q 60 26 ${CX} 22 Q 180 26 178 78 Q ${CX} 60 62 78 Z`} fill={C.hat} stroke={C.outline} strokeWidth="2.5" />
                  <rect x={58} y={68} width="124" height="16" rx="8" fill={C.hatSh} stroke={C.outline} strokeWidth="2.5" />
                  {(zone === 'arctic' || zone === 'winter') && <circle cx={CX} cy={20} r="11" fill="#FFFFFF" stroke={C.outline} strokeWidth="2.5" />}
                </>
              )}
            </g>
          )}

          {/* Очки */}
          {hot && show.accessory && (
            <g>
              <rect x={84} y={94} width="24" height="16" rx="7" fill="#2C3E50" stroke={C.outline} strokeWidth="2.5" />
              <rect x={132} y={94} width="24" height="16" rx="7" fill="#2C3E50" stroke={C.outline} strokeWidth="2.5" />
              <line x1={108} y1={100} x2={132} y2={100} stroke={C.outline} strokeWidth="3" />
              <line x1={90} y1={98} x2={98} y2={104} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
              <line x1={138} y1={98} x2={146} y2={104} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            </g>
          )}
        </g>

        {/* === ЗОНТ === */}
        {isRainy && show.accessory && (
          <g className="animate-float" style={{ animationDuration: '4s' }}>
            <line x1={172} y1={HAND_Y} x2={172} y2={20} stroke={C.outline} strokeWidth="4" strokeLinecap="round" />
            <path d={`M 108 26 Q 172 -22 236 26 Z`} fill="#EF4444" stroke={C.outline} strokeWidth="2.5" />
            <path d={`M 108 26 Q 124 18 140 26 Q 156 18 172 26 Q 188 18 204 26 Q 220 18 236 26`} fill="none" stroke={C.outline} strokeWidth="2" opacity="0.5" />
          </g>
        )}
      </g>
    </svg>
  );
};
