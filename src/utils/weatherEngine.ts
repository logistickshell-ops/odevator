import {
  ActivityLevel, AgeGroup, ChildGender, ClothingItem, ColdSensitivity,
  ParentTip, RecommendedOutfit, WeatherData,
} from '../types';

export const interpretWeatherCode = (code: number) => {
  const r = { description: 'Ясно', icon: 'Sun', isRain: false, isSnow: false };
  if (code === 0) return r;
  if (code <= 2) return { ...r, description: 'Переменная облачность', icon: 'CloudSun' };
  if (code === 3) return { ...r, description: 'Пасмурно', icon: 'Cloud' };
  if (code === 45 || code === 48) return { ...r, description: 'Туман', icon: 'CloudFog' };
  if (code >= 51 && code <= 57) return { ...r, description: 'Морось', icon: 'CloudRain', isRain: true };
  if (code >= 61 && code <= 67) return { ...r, description: 'Дождь', icon: 'CloudRain', isRain: true };
  if (code >= 71 && code <= 77) return { ...r, description: 'Снегопад', icon: 'Snowflake', isSnow: true };
  if (code >= 80 && code <= 82) return { ...r, description: 'Ливень', icon: 'CloudRain', isRain: true };
  if (code === 85 || code === 86) return { ...r, description: 'Снегопад', icon: 'Snowflake', isSnow: true };
  if (code >= 95) return { ...r, description: 'Гроза', icon: 'CloudLightning', isRain: true };
  return r;
};

export const calculateEffectiveTemp = (
  temp: number, wind: number, humidity: number,
  activity: ActivityLevel, sensitivity: ColdSensitivity, age: AgeGroup,
): number => {
  const windChill = wind > 10 ? (wind - 10) * 0.3 : 0;
  const dampCold = temp <= 10 && humidity > 80 ? 1.5 : 0;
  const muggy = temp >= 25 && humidity > 70 ? 2 : 0;
  let t = temp - windChill - dampCold + muggy;
  t += activity === 'active' ? 2 : activity === 'quiet' ? -2 : 0;
  t += sensitivity === 'sensitive' ? -2 : sensitivity === 'resistant' ? 2 : 0;
  t += age === '0-3m' ? -3 : age === '3-12m' ? -2 : age === '1-3y' ? -1 : 0;
  return Math.round(t * 10) / 10;
};

type Zone = 'arctic' | 'winter' | 'freeze' | 'chilly' | 'cool' | 'mild' | 'warm' | 'hot';
const zoneFromTemp = (t: number): Zone =>
  t <= -15 ? 'arctic' : t <= -5 ? 'winter' : t <= 0 ? 'freeze' : t <= 5 ? 'chilly' :
  t <= 10 ? 'cool' : t <= 15 ? 'mild' : t <= 20 ? 'warm' : 'hot';

const it = (
  id: string, name: string, category: ClothingItem['category'], emoji: string,
  color: string, layerIndex: number, description: string, tips?: string,
): ClothingItem => ({ id, name, category, emoji, color, layerIndex, description, tips });

export const generateOutfit = (
  gender: ChildGender, w: WeatherData, activity: ActivityLevel,
  sensitivity: ColdSensitivity, age: AgeGroup,
): RecommendedOutfit => {
  const girl = gender === 'girl';
  const eff = calculateEffectiveTemp(w.temp, w.windSpeed, w.humidity, activity, sensitivity, age);
  const zone = zoneFromTemp(eff);
  const cold = ['arctic', 'winter', 'freeze'].includes(zone);
  const coolish = cold || ['chilly', 'cool'].includes(zone);

  const underwear = [
    cold
      ? it('uw-thermo', 'Термобельё (лонгслив + штаны)', 'underwear', '🩱', '#E8E8F0', 1,
        'Отводит влагу и держит тепло. Влажное тело остывает в 25 раз быстрее сухого.',
        'Берите шерсть мериноса или синтетику — хлопок на морозе опасен.')
      : it('uw-cotton', 'Хлопковая майка и трусики', 'underwear', '🩱', '#FFFFFF', 1,
        'Дышащая база из хлопка — комфорт при любой активности.'),
  ];

  const lower: ClothingItem[] = [];
  if (zone === 'hot') {
    lower.push(girl
      ? it('lw-skirt', 'Лёгкая юбка', 'lower', '👗', '#B9A7E6', 2, 'Свободный крой — тело дышит в жару.')
      : it('lw-shorts', 'Шорты', 'lower', '🩳', '#7FB069', 2, 'Лёгкие шорты для жаркой прогулки.'));
    lower.push(it('lw-tee-s', 'Футболка с коротким рукавом', 'lower', '👕', girl ? '#FF8FB1' : '#4ECDC4', 2, 'Светлая футболка из хлопка.'));
  } else if (zone === 'warm' || zone === 'mild') {
    lower.push(girl
      ? it('lw-skirt-m', 'Юбка с легинсами', 'lower', '👗', '#B9A7E6', 2, 'Юбка + тонкие легинсы — красиво и тепло.')
      : it('lw-pants-m', 'Лёгкие брюки', 'lower', '👖', '#5A6B7F', 2, 'Дышащие брюки на каждый день.'));
    lower.push(it('lw-tee', 'Футболка', 'lower', '👕', girl ? '#FF8FB1' : '#4ECDC4', 2, 'Хлопковая футболка — базовый нижний слой.'));
  } else {
    lower.push(it('lw-pants-c', girl ? 'Утеплённые легинсы' : 'Тёплые брюки', 'lower', '👖', '#5A6B7F', 2, 'Плотный нижний слой на ноги.'));
    lower.push(it('lw-longsleeve', 'Лонгслив', 'lower', '👕', girl ? '#FF8FB1' : '#4ECDC4', 2, 'Футболка с длинным рукавом — второй после белья слой.'));
  }

  const upper: ClothingItem[] = [];
  if (zone === 'arctic' || zone === 'winter') upper.push(it('up-fleece', 'Флисовая кофта', 'upper', '🧶', '#B79CED', 3, 'Флис держит воздушную прослойку — главный утеплитель многослойности.'));
  else if (zone === 'freeze' || zone === 'chilly') upper.push(it('up-sweater', girl ? 'Свитер' : 'Худи', 'upper', '🧥', '#B79CED', 3, 'Шерсть или плотный трикотаж — изоляция в околонулевую температуру.'));
  else if (zone === 'cool') upper.push(it('up-hoodie', 'Толстовка', 'upper', '🧥', '#B79CED', 3, 'Лёгкий утепляющий слой для прохладной погоды.'));
  else if (zone === 'mild') upper.push(it('up-cardigan', girl ? 'Кардиган' : 'Лёгкое худи', 'upper', '🧥', '#B79CED', 3, 'На случай вечернего похолодания — легко снять.'));

  const outer: ClothingItem[] = [];
  if (w.isRainy && !cold) outer.push(it('ot-rain', 'Мембранный дождевик', 'outer', '☔', '#FFD166', 4, 'Не промокает и дышит. Обычный плащ создаст парник.', 'Ищите проклеенные швы.'));
  else if (zone === 'arctic') outer.push(it('ot-combi', 'Зимний комбинезон', 'outer', '🧥', girl ? '#F472B6' : '#3E63DD', 4, 'Комбинезон не оставляет щелей на спине — для самых маленьких и сильных морозов.'));
  else if (zone === 'winter' || zone === 'freeze') outer.push(it('ot-puffer', 'Пуховик', 'outer', '🧥', girl ? '#F472B6' : '#3E63DD', 4, 'Пух/синтетический утеплитель 200+ г/м² для стабильного минуса.'));
  else if (zone === 'chilly') outer.push(it('ot-jacket', 'Утеплённая куртка', 'outer', '🧥', girl ? '#F472B6' : '#3E63DD', 4, 'Демисезонная куртка на лёгком утеплителе.'));
  else if (zone === 'cool') outer.push(it('ot-wind', 'Ветровка', 'outer', '🧥', girl ? '#F472B6' : '#3E63DD', 4, 'Блокирует ветер — главный вор тепла при +10…+15.'));

  const headwear: ClothingItem[] = [];
  if (zone === 'hot') headwear.push(it('hw-panama', 'Панама', 'headwear', '👒', '#FFD166', 0, 'Широкие поля защищают лицо и шею от солнца.', 'Светлый цвет отражает солнце.'));
  else if (zone === 'warm' || zone === 'mild') headwear.push(it('hw-cap', girl ? 'Панамка' : 'Кепка', 'headwear', '🧢', girl ? '#FFD166' : '#2A9D8F', 0, 'Лёгкий головной убор от солнца.'));
  else if (zone === 'cool' || zone === 'chilly') headwear.push(it('hw-beanie-l', 'Тонкая шапка', 'headwear', '🧢', '#2A9D8F', 0, 'Однослойная шапка: голова потеет меньше, но не мёрзнет.'));
  else headwear.push(it('hw-beanie-w', 'Шапка с помпоном', 'headwear', '🧶', girl ? '#F472B6' : '#2A9D8F', 0, 'Двухслойная шапка с подкладом. Помпон — дополнительная воздушная подушка.'));

  const shoes: ClothingItem[] = [];
  if (w.isRainy && !cold) shoes.push(it('sh-rain', 'Резиновые сапоги', 'shoes', '🥾', '#FFD166', 0, 'Толстая подошва изолирует от холодной земли и луж.', 'Надевайте с тёплым носком.'));
  else if (zone === 'hot') shoes.push(it('sh-sandals', 'Сандалии', 'shoes', '👡', '#FFFFFF', 0, 'Открытая обувь с жёстким задником.'));
  else if (zone === 'warm' || zone === 'mild') shoes.push(it('sh-sneak', 'Кроссовки', 'shoes', '👟', '#FFFFFF', 0, 'Дышащие кроссовки для сухой погоды.'));
  else if (zone === 'cool' || zone === 'chilly') shoes.push(it('sh-boots', 'Ботинки', 'shoes', '🥾', '#8B5E3C', 0, 'Закрытые ботинки на плотной подошве.'));
  else shoes.push(it('sh-winter', 'Утеплённые сапоги', 'shoes', '🥾', '#8B5E3C', 0, 'Мембрана или шерсть внутри, размер с запасом под носок.'));

  const accessories: ClothingItem[] = [];
  if (cold) {
    accessories.push(it('ac-mitt', 'Варежки', 'accessory', '🧤', girl ? '#FF6B6B' : '#5B8DEF', 0, 'Варежки теплее перчаток: пальцы греют друг друга.'));
    accessories.push(it('ac-scarf', 'Шарф', 'accessory', '🧣', '#4ECDC4', 0, 'Закрывает шею и ворот — мостик холода.'));
  } else if (coolish) {
    accessories.push(it('ac-gloves', 'Перчатки', 'accessory', '🧤', '#5B8DEF', 0, 'Лёгкие перчатки для околонулевой погоды.'));
  }
  if (w.isWindy) accessories.push(it('ac-scarf-w', 'Шарф-труба', 'accessory', '🧣', '#4ECDC4', 0, 'При ветре шея теряет тепло первой.'));
  if (zone === 'hot') accessories.push(it('ac-sun', 'Солнечные очки', 'accessory', '🕶️', '#0F172A', 0, 'Детские линзы с UV400 — сетчатка ребёнка вдвое чувствительнее.'));
  if (w.isRainy) accessories.push(it('ac-umb', 'Зонт', 'accessory', '☂️', '#EF4444', 0, 'Яркий зонт: ребёнка видно издалека.'));

  const parentTips: ParentTip[] = [];
  if (eff <= -10) parentTips.push({ id: 't-frost', category: 'safety', title: 'Риск обморожения', text: 'Проверяйте нос и щёки каждые 15 минут: побеление — срочно греться.', priority: 'danger', icon: '❄️' });
  if (eff >= 27) parentTips.push({ id: 't-heat', category: 'safety', title: 'Риск перегрева', text: 'Светлая одежда, панамка и вода обязательны. Гуляйте до 11:00 и после 17:00.', priority: 'danger', icon: '☀️' });
  if (w.windSpeed > 15) parentTips.push({ id: 't-wind', category: 'alerts', title: 'Сильный ветер', text: 'Ветровка важнее тёплой кофты: ветер выдувает воздушную прослойку.', priority: 'warning', icon: '💨' });
  if (w.isRainy) parentTips.push({ id: 't-rain', category: 'practical', title: 'Влажно', text: 'Мембрана и резиновые сапоги. Хлопок намок = ребёнок замёрз.', priority: 'warning', icon: '☔' });
  parentTips.push({ id: 't-neck', category: 'practical', title: 'Тест по загривку', text: 'Шея сзади тёплая и сухая — одето правильно. Влажная — перегрев, холодная — добавить слой.', priority: 'info', icon: '💡' });
  if (age === '0-3m' || age === '3-12m') parentTips.push({ id: 't-baby', category: 'age', title: 'Малыш в коляске', text: 'Неподвижный ребёнок мёрзнет: добавьте один слой сверх рекомендации.', priority: 'warning', icon: '👶' });

  const specialAdvice: string[] = [];
  if (coolish) specialAdvice.push('Правило трёх слоёв: влагоотвод → изоляция → защита.');
  if (activity === 'active') specialAdvice.push('Ребёнок будет бегать: снимите верхний слой до выхода со двора, чтобы не вспотел.');
  if (activity === 'quiet') specialAdvice.push('Спокойная прогулка: тело греет меньше, добавьте изоляции.');

  return {
    summary: `На улице ${w.temp > 0 ? '+' : ''}${w.temp}° (ощущается ${eff > 0 ? '+' : ''}${eff}°), ${w.description.toLowerCase()}. ${girl ? 'Девочке' : 'Мальчику'}: ${outer[0]?.name ?? upper[0]?.name ?? lower[0]?.name}, ${shoes[0]?.name}, ${headwear[0]?.name}.`,
    underwear, lower, upper, outer, headwear, shoes, accessories, specialAdvice, parentTips,
  };
};
