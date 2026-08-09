// src/utils/weatherEngine.ts

import {
  WeatherData,
  ActivityLevel,
  ColdSensitivity,
  RecommendedOutfit,
  ClothingItem,
  AgeGroup,
  ParentTip,
  WeatherPeriodType,
  ClothingLayer
} from '../types';

export function interpretWeatherCode(code: number): { description: string; icon: string; isRain: boolean; isSnow: boolean } {
  if (code === 0) return { description: 'Ясно', icon: 'Sun', isRain: false, isSnow: false };
  if (code >= 1 && code <= 3) return { description: 'Переменная облачность', icon: 'CloudSun', isRain: false, isSnow: false };
  if (code === 45 || code === 48) return { description: 'Туман', icon: 'CloudFog', isRain: false, isSnow: false };
  if (code >= 51 && code <= 55) return { description: 'Морось', icon: 'CloudDrizzle', isRain: true, isSnow: false };
  if (code === 56 || code === 57) return { description: 'Ледяная морось', icon: 'CloudSnow', isRain: true, isSnow: true };
  if (code >= 61 && code <= 65) return { description: 'Дождь', icon: 'CloudRain', isRain: true, isSnow: false };
  if (code === 66 || code === 67) return { description: 'Ледяной дождь', icon: 'CloudRain', isRain: true, isSnow: true };
  if (code >= 71 && code <= 75) return { description: 'Снегопад', icon: 'Snowflake', isRain: false, isSnow: true };
  if (code === 77) return { description: 'Снежная крупа', icon: 'Snowflake', isRain: false, isSnow: true };
  if (code >= 80 && code <= 82) return { description: 'Ливневые дожди', icon: 'CloudLightning', isRain: true, isSnow: false };
  if (code === 85 || code === 86) return { description: 'Ливневый снегопад', icon: 'Snowflake', isRain: false, isSnow: true };
  if (code >= 95 && code <= 99) return { description: 'Гроза', icon: 'CloudLightning', isRain: true, isSnow: false };
  return { description: 'Облачно', icon: 'Cloud', isRain: false, isSnow: false };
}

export function calculateEffectiveTemp(
  temp: number, windSpeed: number, humidity: number,
  activity: ActivityLevel, sensitivity: ColdSensitivity, ageGroup: AgeGroup
): number {
  let effTemp = temp;
  if (windSpeed > 10) {
    if (windSpeed <= 20) effTemp -= 2;
    else if (windSpeed <= 30) effTemp -= 4;
    else if (windSpeed <= 40) effTemp -= 6;
    else if (windSpeed <= 50) effTemp -= 8;
    else effTemp -= 10;
  }
  if (humidity > 60) {
    if (humidity <= 80) effTemp -= 1.5;
    else if (humidity <= 90) effTemp -= 3.0;
    else effTemp -= 5.0;
  }
  if (activity === 'quiet') effTemp -= 3.0;
  else if (activity === 'active') {
    if (ageGroup === '1-3y') effTemp += 3.0;
    else if (ageGroup === '3-7y' || ageGroup === '7-12y') effTemp += 5.0;
    else effTemp += 2.0;
  }
  if (ageGroup === '0-3m') effTemp -= 4.0;
  else if (ageGroup === '3-12m') effTemp -= 2.0;
  if (sensitivity === 'sensitive') effTemp -= 2.0;
  else if (sensitivity === 'resistant') effTemp += 2.0;
  return parseFloat(effTemp.toFixed(1));
}

export function generateOutfit(
  gender: 'boy' | 'girl', weather: WeatherData, activity: ActivityLevel,
  sensitivity: ColdSensitivity, ageGroup: AgeGroup, selectedPeriod: WeatherPeriodType = 'day'
): RecommendedOutfit {
  const effTemp = calculateEffectiveTemp(weather.temp, weather.windSpeed, weather.humidity, activity, sensitivity, ageGroup);
  
  // Инициализируем массивы для каждого из 7 слоев
  const items: Record<ClothingLayer, ClothingItem[]> = {
    outerwear: [], upper_layer: [], lower_layer: [], underwear: [],
    headwear: [], shoes: [], accessories: []
  };

  const specialAdvice: string[] = [];
  const isRainy = weather.isRainy || weather.precipProb > 40;
  const isSnowy = weather.isSnowy;
  const isWindy = weather.windSpeed > 15;

  // --- МАТРИЦА ОДЕЖДЫ ---
  if (effTemp <= -20) {
    items.underwear.push({ id: 'base_thermal_merino', name: 'Термобелье (шерсть)', layer: 'underwear', description: 'Комплект из 100% шерсти мериноса.', emoji: '👔', tips: 'Идеально сохраняет тепло.' });
    items.upper_layer.push({ id: 'mid_fleece_heavy', name: 'Флисовый костюм', layer: 'upper_layer', description: 'Кофта и штаны из плотного флиса.', emoji: '🧥' });
    items.outerwear.push({ id: 'outer_winter_300g', name: gender === 'girl' ? 'Зимний комбинезон (300г)' : 'Мембранный комплект (300г)', layer: 'outerwear', description: 'Максимально утепленная одежда.', emoji: '🧥' });
    items.shoes.push({ id: 'shoes_valenki_kuoma', name: 'Валенки или сноубутсы', layer: 'shoes', description: 'Обувь на натуральной овчине.', emoji: '🥾' });
    items.headwear.push({ id: 'acc_helmet_hat', name: 'Шапка-шлем', layer: 'headwear', description: 'Плотная зимняя шапка.', emoji: '👤' });
    items.accessories.push({ id: 'acc_mittens_kragi', name: 'Варежки-краги', layer: 'accessories', description: 'Непромокаемые варежки.', emoji: '🧤' });
    if (ageGroup === '0-3m') {
      items.accessories.push({ id: 'acc_fur_bag', name: 'Меховой конверт', layer: 'accessories', description: 'Теплый конверт в коляску.', emoji: '🛌' });
      specialAdvice.push('⚠️ НЕ выходить с новорожденным ниже -15°C!');
    }
  } 
  else if (effTemp > -20 && effTemp <= -10) {
    items.underwear.push({ id: 'base_thermal_synthetic', name: 'Термобелье', layer: 'underwear', description: 'Функциональное термобелье.', emoji: '👕' });
    items.upper_layer.push({ id: 'mid_sweater_wool', name: 'Шерстяной свитер', layer: 'upper_layer', description: 'Теплый средний слой.', emoji: '🧶' });
    items.lower_layer.push({ id: 'lower_thermal_pants', name: 'Термоштаны', layer: 'lower_layer', description: 'Утепленный низ.', emoji: '👖' });
    items.outerwear.push({ id: 'outer_winter_250g', name: gender === 'girl' ? 'Зимний пуховик' : 'Мембранный комбинезон', layer: 'outerwear', description: 'Сверхтеплый комплект.', emoji: '🧥' });
    items.shoes.push({ id: 'shoes_winter_boots_gore', name: 'Зимние ботинки Gore-Tex', layer: 'shoes', description: 'Непромокаемые теплые ботинки.', emoji: '🥾' });
    items.headwear.push({ id: 'acc_winter_hat_scarf', name: 'Зимняя шапка + снуд', layer: 'headwear', description: 'Вязаная шапка на флисе.', emoji: '🧣' });
    items.accessories.push({ id: 'acc_mittens_warm', name: 'Теплые варежки', layer: 'accessories', description: 'Шерстяные рукавички.', emoji: '🧤' });
  }
  else if (effTemp > -10 && effTemp <= -5) {
    items.underwear.push({ id: 'base_long_sleeve_cotton', name: 'Хлопковый лонгслив', layer: 'underwear', description: 'Плотная кофточка.', emoji: '👕' });
    items.upper_layer.push({ id: 'mid_fleece_jacket', name: 'Флисовая кофта', layer: 'upper_layer', description: 'Легкий утепляющий слой.', emoji: '🧥' });
    items.lower_layer.push({ id: 'lower_tights_warm', name: 'Махровые колготки', layer: 'lower_layer', description: 'Утепленный низ.', emoji: '👖' });
    items.outerwear.push({ id: 'outer_demi_heavy', name: gender === 'girl' ? 'Демисезонный комбинезон' : 'Куртка + полукомбинезон', layer: 'outerwear', description: 'Утепленная демисезонная одежда.', emoji: '🧥' });
    items.shoes.push({ id: 'shoes_demi_boots', name: 'Осенне-зимние ботинки', layer: 'shoes', description: 'Ботинки на байке или мембране.', emoji: '🥾' });
    items.headwear.push({ id: 'acc_hat_warm', name: 'Теплая вязаная шапка', layer: 'headwear', description: 'Плотно закрывает уши.', emoji: '👤' });
    items.accessories.push({ id: 'acc_gloves_thick', name: 'Плотные перчатки', layer: 'accessories', description: 'Защита рук от холода.', emoji: '🧤' });
  }
  else if (effTemp > -5 && effTemp <= 0) {
    items.underwear.push({ id: 'base_body_long', name: 'Боди с длинным рукавом', layer: 'underwear', description: 'Базовый хлопковый слой.', emoji: '👶' });
    items.upper_layer.push({ id: 'mid_sweatshirt', name: 'Свитшот или кардиган', layer: 'upper_layer', description: 'Трикотажный свитшот.', emoji: '🧥' });
    items.lower_layer.push({ id: 'lower_jeans_warm', name: 'Джинсы / плотные брюки', layer: 'lower_layer', description: 'Верх для прохладной погоды.', emoji: '👖' });
    items.outerwear.push({ id: 'outer_demi_medium', name: gender === 'girl' ? 'Демисезонное пальто' : 'Демисезонная куртка', layer: 'outerwear', description: 'Куртка с легким утеплителем.', emoji: '🧥' });
    items.shoes.push({ id: 'shoes_demi_heavy', name: 'Демисезонные ботинки', layer: 'shoes', description: 'Высокие ботинки с пропиткой.', emoji: '🥾' });
    items.headwear.push({ id: 'acc_hat_demi', name: 'Вязаная шапка', layer: 'headwear', description: 'Двухслойная трикотажная.', emoji: '👤' });
    items.accessories.push({ id: 'acc_gloves_soft', name: 'Мягкие перчатки', layer: 'accessories', description: 'Трикотажные перчатки.', emoji: '🧤' });
    if (isRainy || isSnowy) specialAdvice.push('При околонулевой температуре слякоть быстро промачивает ткань — мембрана обязательна.');
  }
  else if (effTemp > 0 && effTemp <= 5) {
    items.underwear.push({ id: 'base_cotton_slip', name: 'Хлопковый слип / лонгслив', layer: 'underwear', description: 'Приятный к телу базовый слой.', emoji: '👕' });
    items.upper_layer.push({ id: 'mid_hoodie', name: 'Утепленный худи', layer: 'upper_layer', description: 'Плотный худи на молнии.', emoji: '👚' });
    items.lower_layer.push({ id: 'lower_pants_cotton', name: 'Хлопковые штаны / джинсы', layer: 'lower_layer', description: 'Комфортный низ.', emoji: '👖' });
    items.outerwear.push({ id: 'outer_demi_light', name: gender === 'girl' ? 'Демисезонное пальто (100г)' : 'Куртка Softshell', layer: 'outerwear', description: 'Легкая куртка.', emoji: '🧥' });
    items.shoes.push({ id: 'shoes_demi_leather', name: 'Кожаные ботинки на байке', layer: 'shoes', description: 'Ботинки из натуральной кожи.', emoji: '🥾' });
    items.headwear.push({ id: 'acc_beanie', name: 'Трикотажная шапка-бини', layer: 'headwear', description: 'Плотная однослойная.', emoji: '👤' });
  }
  else if (effTemp > 5 && effTemp <= 15) {
    items.underwear.push({ id: 'base_tshirt_long', name: 'Футболка / лонгслив', layer: 'underwear', description: 'Хлопковая футболка.', emoji: '👕' });
    if (activity !== 'active' || effTemp < 12) {
      items.upper_layer.push({ id: 'mid_sweatshirt_light', name: 'Толстовка или бомбер', layer: 'upper_layer', description: 'Трикотажный свитшот.', emoji: '🧥' });
    }
    items.lower_layer.push({ id: 'lower_jeans_regular', name: 'Джинсы / плотные брюки', layer: 'lower_layer', description: 'Стандартный низ.', emoji: '👖' });
    items.outerwear.push({ id: 'outer_windbreaker', name: gender === 'girl' ? 'Ветровка / плащ' : 'Ветровка / легкая куртка', layer: 'outerwear', description: 'Легкая куртка без утеплителя.', emoji: '🧥' });
    items.shoes.push({ id: 'shoes_sneakers', name: 'Кроссовки или кеды', layer: 'shoes', description: 'Удобная обувь на плотной подошве.', emoji: '👟' });
    if (effTemp < 12 || isWindy) {
      items.headwear.push({ id: 'acc_headband', name: 'Тонкая шапочка / повязка', layer: 'headwear', description: 'Защита ушей от ветра.', emoji: '👤' });
    }
  }
  else if (effTemp > 15 && effTemp <= 20) {
    items.underwear.push({ id: 'base_tshirt_short', name: 'Футболка с коротким рукавом', layer: 'underwear', description: 'Легкий хлопок.', emoji: '👕' });
    items.upper_layer.push({ id: 'mid_denim_jacket', name: gender === 'girl' ? 'Джинсовка / кардиган' : 'Джинсовая куртка', layer: 'upper_layer', description: 'Легкая кофта на случай ветра.', emoji: '🧥', tips: 'Легко снять.' });
    items.lower_layer.push({ id: 'lower_leggings', name: 'Леггинсы / тонкие брюки', layer: 'lower_layer', description: 'Комфортный летний низ.', emoji: '👖' });
    items.shoes.push({ id: 'shoes_light_sneakers', name: 'Легкие кроссовки / слипоны', layer: 'shoes', description: 'Текстильная дышащая обувь.', emoji: '👟' });
    if (weather.weatherCode <= 3) {
      items.headwear.push({ id: 'acc_panama', name: 'Панама или кепка', layer: 'headwear', description: 'Головной убор от солнца.', emoji: '👒' });
    }
  }
  else { // ЖАРКО: > +20°C
    items.underwear.push({ id: 'base_summer_outfit', name: gender === 'girl' ? 'Легкое платье / топ' : 'Майка / футболка', layer: 'underwear', description: 'Натуральный лен или 100% хлопок.', emoji: '👗' });
    items.lower_layer.push({ id: 'lower_shorts', name: 'Шорты / юбка', layer: 'lower_layer', description: 'Открытый низ.', emoji: '🩳' });
    items.shoes.push({ id: isRainy ? 'shoes_water_sandals' : 'shoes_sandals', name: isRainy ? 'Резиновые сандалии' : 'Открытые сандалии', layer: 'shoes', description: 'Легкая моющаяся обувь.', emoji: isRainy ? '👢' : '👡' });
    
    if (isRainy) {
      items.outerwear.push({ id: 'outer_rain_poncho', name: 'Легкий дождевик-пончо', layer: 'outerwear', description: 'Тонкий непромокаемый плащ.', emoji: '🧥' });
      items.accessories.push({ id: 'acc_umbrella_hot', name: 'Зонт', layer: 'accessories', description: 'Защита от теплого дождя.', emoji: '☂️' });
    } else {
      items.headwear.push({ id: 'acc_sun_protection', name: 'Бейсболка / панама', layer: 'headwear', description: 'Обязательный головной убор.', emoji: '👒' });
      items.accessories.push({ id: 'acc_sunglasses', name: 'Солнцезащитные очки', layer: 'accessories', description: 'Детские очки с защитой UV400.', emoji: '🕶️' });
    }
    if (effTemp > 25) specialAdvice.push('Ищите тень и избегайте нахождения на солнце в пик жары (12:00-16:00).');
    specialAdvice.push('Обязательно возьмите с собой бутылочку чистой воды.');
  }

  // --- ГЛОБАЛЬНЫЕ ПЕРЕОПРЕДЕЛЕНИЯ ДЛЯ ДОЖДЯ ---
  if (isRainy && effTemp > -5 && effTemp <= 20) {
    items.shoes = [{
      id: 'shoes_rubber_boots', name: 'Резиновые сапоги', layer: 'shoes',
      description: effTemp < 5 ? 'Утепленные резиновые сапоги.' : 'Резиновые сапоги для луж.',
      emoji: '👢', tips: 'Надевайте на плотный носок.'
    }];
    const hasRaincoat = items.outerwear.some(a => a.id.includes('rain')) || items.accessories.some(a => a.id.includes('rain'));
    if (!hasRaincoat) {
      items.accessories.push({ id: 'acc_raincoat', name: 'Дождевик', layer: 'accessories', description: 'Непромокаемый плащ.', emoji: '🧥', tips: 'Снимите в помещении.' });
    }
  }

  // --- ГЕНЕРАЦИЯ СОВЕТОВ ---
  const parentTips: ParentTip[] = [
    { id: 'tip_a1', category: 'safety', title: 'Проверка: Руки и ноги', text: 'Тёплые ли ручки? Не мёрзнут ли ножки?', priority: 'danger', icon: '🛡️' },
    { id: 'tip_a2', category: 'safety', title: 'Проверка: Шея и спина', text: 'Горячая+мокрая = вспотел. Холодная = добавить слой.', priority: 'danger', icon: '🖐️' },
    { id: 'tip_a3', category: 'safety', title: 'Проверка: Лицо и уши', text: 'Носик не белый/синий. Щёки розовые = норма.', priority: 'warning', icon: '😊' },
    { id: 'tip_a4', category: 'safety', title: 'Проверка: Обувь', text: 'Не тесная? Не мокрая? Тёплая ли стелька?', priority: 'warning', icon: '🥾' }
  ];

  if (selectedPeriod === 'morning') parentTips.push({ id: 'tip_b_morning', category: 'time', title: 'Утренние часы (🌅)', text: 'Утром холоднее. Наденьте куртку сразу.', priority: 'info', icon: '🌅' });
  else if (selectedPeriod === 'day') {
    if (effTemp > 22) parentTips.push({ id: 'tip_b_day_hot', category: 'time', title: 'Дневной зной (☀️)', text: 'Пик жары. Ищите тень, предлагайте воду.', priority: 'warning', icon: '☀️' });
    else parentTips.push({ id: 'tip_b_day', category: 'time', title: 'Дневная прогулка (☀️)', text: 'Солнце активно. Снимите слой, если жарко.', priority: 'info', icon: '☀️' });
  }

  if (effTemp < 5) parentTips.push({ id: 'tip_c_cold', category: 'essentials', title: 'С собой в холод (🎒)', text: 'Запасные варежки, шарф, тёплый напиток.', priority: 'warning', icon: '🎒' });
  else if (effTemp > 25) parentTips.push({ id: 'tip_c_hot', category: 'essentials', title: 'С собой в жару (💧)', text: 'Вода, SPF 30+, панама.', priority: 'warning', icon: '💧' });
  
  if (isRainy) parentTips.push({ id: 'tip_c_rain', category: 'essentials', title: 'С собой в дождь (☂️)', text: 'Зонт, сменная обувь, сухие носки.', priority: 'warning', icon: '☂️' });

  if (effTemp > 28) parentTips.push({ id: 'tip_d_hot_alert', category: 'alerts', title: '⚠️ ОПАСНОСТЬ ПЕРЕГРЕВА', text: 'Срочно в тень!', priority: 'danger', icon: '⚠️' });
  else if (effTemp < -15) parentTips.push({ id: 'tip_d_cold_alert', category: 'alerts', title: '❄️ ОПАСНОСТЬ ПЕРЕОХЛАЖДЕНИЯ', text: 'Срочно в тепло!', priority: 'danger', icon: '❄️' });

  if (isWindy) parentTips.push({ id: 'tip_d_wind', category: 'alerts', title: '💨 СИЛЬНЫЙ ВЕТЕР', text: 'Ветер выдувает тепло. Защитите шею и лицо.', priority: 'warning', icon: '💨' });

  if (ageGroup === '0-3m') parentTips.push({ id: 'tip_e_newborn', category: 'age', title: 'Новорождённые (0-3 мес)', text: 'Терморегуляция незрелая. Проверяйте шею каждые 15 мин.', priority: 'danger', icon: '👶' });
  else if (ageGroup === '1-3y') parentTips.push({ id: 'tip_e_toddler', category: 'age', title: 'Ясельный возраст (1-3 года)', text: 'Бегает 90% времени. Не одевайте слишком тепло.', priority: 'warning', icon: '🏃' });
  
  parentTips.push({ id: 'tip_f_practical', category: 'practical', title: 'Практический совет (💡)', text: '"Капустный" принцип работает всегда! Обувь: запас +1см.', priority: 'info', icon: '💡' });

  parentTips.sort((a, b) => {
    const pWeight = { danger: 1, warning: 2, info: 3 };
    return pWeight[a.priority] - pWeight[b.priority];
  });

  // 🔥 ВОТ ЭТО САМОЕ ГЛАВНОЕ: возвращаем и старые поля (для совместимости), и новый объект layers!
  return {
    summary: `Для ${weather.temp}°C (ощущается как ${effTemp}°C) рекомендуется многослойная одежда.`,
    base: items.underwear,
    middle: items.upper_layer,
    outer: items.outerwear,
    shoes: items.shoes,
    accessories: items.accessories,
    specialAdvice,
    parentTips,
    items: Object.values(items).flat(),
    layers: items // <-- ЭТО ТО, ЧЕГО НЕ ХВАТАЛО!
  };
}
