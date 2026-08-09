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

/**
 * Интерпретация WMO кодов погоды в человекочитаемые описания и флаги
 */
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

/**
 * Расчет эффективной температуры с учетом активности, возраста и чувствительности
 */
export function calculateEffectiveTemp(
  temp: number,
  windSpeed: number,
  humidity: number,
  activity: ActivityLevel,
  sensitivity: ColdSensitivity,
  ageGroup: AgeGroup
): number {
  let effTemp = temp;

  // 1. Ветровой холод
  if (windSpeed > 10) {
    if (windSpeed <= 20) effTemp -= 2;
    else if (windSpeed <= 30) effTemp -= 4;
    else if (windSpeed <= 40) effTemp -= 6;
    else if (windSpeed <= 50) effTemp -= 8;
    else effTemp -= 10;
  }

  // 2. Влажность
  if (humidity > 60) {
    if (humidity <= 80) effTemp -= 1.5;
    else if (humidity <= 90) effTemp -= 3.0;
    else effTemp -= 5.0;
  }

  // 3. Активность
  if (activity === 'quiet') {
    effTemp -= 3.0;
  } else if (activity === 'active') {
    if (ageGroup === '1-3y') effTemp += 3.0;
    else if (ageGroup === '3-7y' || ageGroup === '7-12y') effTemp += 5.0;
    else effTemp += 2.0;
  }

  // 4. Возраст
  if (ageGroup === '0-3m') effTemp -= 4.0;
  else if (ageGroup === '3-12m') effTemp -= 2.0;

  // 5. Чувствительность к холоду
  if (sensitivity === 'sensitive') effTemp -= 2.0;
  else if (sensitivity === 'resistant') effTemp += 2.0;

  return parseFloat(effTemp.toFixed(1));
}

/**
 * Генерация гардероба по новой системе слоев
 */
export function generateOutfit(
  gender: 'boy' | 'girl',
  weather: WeatherData,
  activity: ActivityLevel,
  sensitivity: ColdSensitivity,
  ageGroup: AgeGroup,
  selectedPeriod: WeatherPeriodType = 'day'
): RecommendedOutfit {
  const effTemp = calculateEffectiveTemp(weather.temp, weather.windSpeed, weather.humidity, activity, sensitivity, ageGroup);
  
  // Инициализируем массивы для каждого слоя
  const items: Record<ClothingLayer, ClothingItem[]> = {
    outerwear: [],
    upper_layer: [],
    lower_layer: [],
    underwear: [],
    headwear: [],
    shoes: [],
    accessories: []
  };

  const specialAdvice: string[] = [];
  const isRainy = weather.isRainy || weather.precipProb > 40;
  const isSnowy = weather.isSnowy;
  const isWindy = weather.windSpeed > 15;

  // --- МАТРИЦА ОДЕЖДЫ ПО ТЕМПЕРАТУРНЫМ ЗОНАМ ---

  // 1. ЭКСТРЕМАЛЬНЫЙ МОРОЗ: <= -20°C
  if (effTemp <= -20) {
    items.underwear.push({ id: 'base_thermal_merino', name: 'Термобелье (шерсть мериноса)', layer: 'underwear', description: 'Комплект из 100% шерсти мериноса.', emoji: '👔', tips: 'Шерсть идеально сохраняет тепло даже во влажном состоянии.' });
    items.upper_layer.push({ id: 'mid_fleece_heavy', name: 'Флисовый костюм (плотный)', layer: 'upper_layer', description: 'Кофта и штаны из плотного флиса (300г/м²).', emoji: '🧥' });
    items.outerwear.push({ id: 'outer_winter_300g', name: gender === 'girl' ? 'Зимний комбинезон (300г)' : 'Утепленный мембранный комплект (300г)', layer: 'outerwear', description: 'Максимально утепленная верхняя одежда.', emoji: '🧥' });
    items.shoes.push({ id: 'shoes_valenki_kuoma', name: 'Валенки или сноубутсы (Kuoma)', layer: 'shoes', description: 'Обувь на натуральной овчине или термопластике.', emoji: '🥾' });
    items.headwear.push({ id: 'acc_helmet_hat', name: 'Шапка-шлем + подшлемник', layer: 'headwear', description: 'Плотная зимняя шапка, закрывающая шею и лоб.', emoji: '👤' });
    items.accessories.push({ id: 'acc_mittens_kragi', name: 'Варежки-краги', layer: 'accessories', description: 'Высокие непромокаемые варежки поверх рукавов.', emoji: '🧤' });
    
    if (ageGroup === '0-3m') {
      items.accessories.push({ id: 'acc_fur_bag', name: 'Меховой конверт в коляску', layer: 'accessories', description: 'Теплый конверт на овчине или пуху.', emoji: '🛌' });
      specialAdvice.push('⚠️ НЕ выходить на улицу с новорожденным без крайней необходимости при температуре ниже -15°C!');
    } else {
      specialAdvice.push('При сильном морозе ограничьте прогулку 20-30 минутами.');
    }
  }
  
  // 2. СИЛЬНЫЙ МОРОЗ: -20°C ... -10°C
  else if (effTemp > -20 && effTemp <= -10) {
    items.underwear.push({ id: 'base_thermal_synthetic', name: 'Термобелье (синтетика/смесь)', layer: 'underwear', description: 'Функциональное термобелье для активного отвода влаги.', emoji: '' });
    items.upper_layer.push({ id: 'mid_sweater_wool', name: 'Шерстяной свитер или флис', layer: 'upper_layer', description: 'Теплый средний слой для сохранения тепла.', emoji: '🧶' });
    items.lower_layer.push({ id: 'lower_thermal_pants', name: 'Термоштаны или кальсоны', layer: 'lower_layer', description: 'Утепленный низ под основную одежду.', emoji: '👖' });
    items.outerwear.push({ id: 'outer_winter_250g', name: gender === 'girl' ? 'Зимний пуховик / полукомбинезон (250г)' : 'Мембранный комбинезон (250г)', layer: 'outerwear', description: 'Сверхтеплый зимний комплект.', emoji: '🧥' });
    items.shoes.push({ id: 'shoes_winter_boots_gore', name: 'Зимние ботинки Gore-Tex', layer: 'shoes', description: 'Непромокаемые теплые ботинки на мембране.', emoji: '🥾' });
    items.headwear.push({ id: 'acc_winter_hat_scarf', name: 'Зимняя шапка + шарф/снуд', layer: 'headwear', description: 'Вязаная шапка на флисе и удобный снуд.', emoji: '🧣' });
    items.accessories.push({ id: 'acc_mittens_warm', name: 'Теплые варежки', layer: 'accessories', description: 'Шерстяные или непромокаемые рукавички.', emoji: '🧤' });
  }

  // 3. ХОЛОД: -10°C ... -5°C
  else if (effTemp > -10 && effTemp <= -5) {
    items.underwear.push({ id: 'base_long_sleeve_cotton', name: 'Хлопковый лонгслив', layer: 'underwear', description: 'Плотная кофточка с длинным рукавом.', emoji: '👕' });
    items.upper_layer.push({ id: 'mid_fleece_jacket', name: 'Флисовая кофта', layer: 'upper_layer', description: 'Легкий утепляющий слой.', emoji: '' });
    items.lower_layer.push({ id: 'lower_tights_warm', name: 'Махровые колготки / брюки', layer: 'lower_layer', description: 'Утепленный низ.', emoji: '👖' });
    items.outerwear.push({ id: 'outer_demi_heavy', name: gender === 'girl' ? 'Демисезонный комбинезон (180г)' : 'Куртка + полукомбинезон (180г)', layer: 'outerwear', description: 'Утепленная демисезонная одежда.', emoji: '' });
    items.shoes.push({ id: 'shoes_demi_boots', name: 'Осенне-зимние ботинки', layer: 'shoes', description: 'Ботинки на байке или мембране.', emoji: '' });
    items.headwear.push({ id: 'acc_hat_warm', name: 'Теплая вязаная шапка', layer: 'headwear', description: 'Шапка, плотно закрывающая уши.', emoji: '' });
    items.accessories.push({ id: 'acc_gloves_thick', name: 'Плотные перчатки / варежки', layer: 'accessories', description: 'Защита рук от холода.', emoji: '🧤' });
  }

  // 4. ПРОХОЛАДНО: -5°C ... 0°C
  else if (effTemp > -5 && effTemp <= 0) {
    items.underwear.push({ id: 'base_body_long', name: 'Боди с длинным рукавом', layer: 'underwear', description: 'Базовый хлопковый слой.', emoji: '👶' });
    items.upper_layer.push({ id: 'mid_sweatshirt', name: 'Свитшот или кардиган', layer: 'upper_layer', description: 'Трикотажный свитшот с начесом.', emoji: '🧥' });
    items.lower_layer.push({ id: 'lower_jeans_warm', name: 'Джинсы / плотные брюки', layer: 'lower_layer', description: 'Верхний низ для прохладной погоды.', emoji: '' });
    items.outerwear.push({ id: 'outer_demi_medium', name: gender === 'girl' ? 'Демисезонное пальто / куртка (140г)' : 'Демисезонная куртка (140г)', layer: 'outerwear', description: 'Куртка из мембраны с легким утеплителем.', emoji: '🧥' });
    items.shoes.push({ id: 'shoes_demi_heavy', name: 'Демисезонные ботинки', layer: 'shoes', description: 'Высокие ботинки с водоотталкивающей пропиткой.', emoji: '🥾' });
    items.headwear.push({ id: 'acc_hat_demi', name: 'Вязаная шапка', layer: 'headwear', description: 'Двухслойная трикотажная шапочка.', emoji: '' });
    items.accessories.push({ id: 'acc_gloves_soft', name: 'Мягкие перчатки', layer: 'accessories', description: 'Трикотажные перчатки.', emoji: '🧤' });
    
    if (isRainy || isSnowy) specialAdvice.push('При околонулевой температуре слякоть быстро промачивает ткань — мембрана обязательна.');
  }

  // 5. СВЕЖО: 0°C ... +5°C
  else if (effTemp > 0 && effTemp <= 5) {
    items.underwear.push({ id: 'base_cotton_slip', name: 'Хлопковый слип / лонгслив', layer: 'underwear', description: 'Приятный к телу базовый слой.', emoji: '👕' });
    items.upper_layer.push({ id: 'mid_hoodie', name: 'Утепленный худи', layer: 'upper_layer', description: 'Плотный худи на молнии.', emoji: '👚' });
    items.lower_layer.push({ id: 'lower_pants_cotton', name: 'Хлопковые штаны / джинсы', layer: 'lower_layer', description: 'Комфортный низ.', emoji: '👖' });
    items.outerwear.push({ id: 'outer_demi_light', name: gender === 'girl' ? 'Демисезонное пальто (100г)' : 'Куртка Softshell (100г)', layer: 'outerwear', description: 'Легкая куртка с непродуваемыми штанами.', emoji: '🧥' });
    items.shoes.push({ id: 'shoes_demi_leather', name: 'Кожаные ботинки на байке', layer: 'shoes', description: 'Ботинки из натуральной кожи с байковой подкладкой.', emoji: '🥾' });
    items.headwear.push({ id: 'acc_beanie', name: 'Трикотажная шапка-бини', layer: 'headwear', description: 'Плотная однослойная шапочка.', emoji: '👤' });
  }

  // 6. УМЕРЕННО: +5°C ... +15°C
  else if (effTemp > 5 && effTemp <= 15) {
    items.underwear.push({ id: 'base_tshirt_long', name: 'Футболка / лонгслив', layer: 'underwear', description: 'Хлопковая футболка.', emoji: '👕' });
    if (activity !== 'active' || effTemp < 12) {
      items.upper_layer.push({ id: 'mid_sweatshirt_light', name: 'Толстовка или бомбер', layer: 'upper_layer', description: 'Трикотажный свитшот.', emoji: '🧥' });
    }
    items.lower_layer.push({ id: 'lower_jeans_regular', name: 'Джинсы / плотные брюки', layer: 'lower_layer', description: 'Стандартный низ.', emoji: '👖' });
    items.outerwear.push({ id: 'outer_windbreaker', name: gender === 'girl' ? 'Ветровка / плащ' : 'Ветровка / легкая куртка', layer: 'outerwear', description: 'Легкая куртка без утеплителя.', emoji: '' });
    items.shoes.push({ id: 'shoes_sneakers', name: 'Кроссовки или кеды', layer: 'shoes', description: 'Удобная обувь на плотной подошве.', emoji: '👟' });
    if (effTemp < 12 || isWindy) {
      items.headwear.push({ id: 'acc_headband', name: 'Тонкая шапочка / повязка', layer: 'headwear', description: 'Защита ушей от ветра.', emoji: '👤' });
    }
  }

  // 7. ТЕПЛО: +15°C ... +20°C
  else if (effTemp > 15 && effTemp <= 20) {
    items.underwear.push({ id: 'base_tshirt_short', name: 'Футболка с коротким рукавом', layer: 'underwear', description: 'Легкий хлопок.', emoji: '👕' });
    items.upper_layer.push({ id: 'mid_denim_jacket', name: gender === 'girl' ? 'Джинсовка / кардиган' : 'Джинсовая куртка', layer: 'upper_layer', description: 'Легкая кофта на случай тени или ветра.', emoji: '🧥', tips: 'Легко снять и повязать на пояс.' });
    items.lower_layer.push({ id: 'lower_leggings', name: 'Леггинсы / тонкие брюки', layer: 'lower_layer', description: 'Комфортный летний низ.', emoji: '👖' });
    items.shoes.push({ id: 'shoes_light_sneakers', name: 'Легкие кроссовки / слипоны', layer: 'shoes', description: 'Текстильная дышащая обувь.', emoji: '👟' });
    if (weather.weatherCode <= 3) {
      items.headwear.push({ id: 'acc_panama', name: 'Панама или кепка', layer: 'headwear', description: 'Головной убор от солнца.', emoji: '👒' });
    }
  }

  // 8. ЖАРКО: > +20°C
  else {
    items.underwear.push({ id: 'base_summer_outfit', name: gender === 'girl' ? 'Легкое платье / топ' : 'Майка / футболка', layer: 'underwear', description: 'Натуральный лен или 100% хлопок.', emoji: '👗' });
    items.lower_layer.push({ id: 'lower_shorts', name: 'Шорты / юбка', layer: 'lower_layer', description: 'Открытый низ.', emoji: '' });
    items.shoes.push({ id: isRainy ? 'shoes_water_sandals' : 'shoes_sandals', name: isRainy ? 'Резиновые сандалии' : 'Открытые сандалии', layer: 'shoes', description: 'Легкая моющаяся обувь.', emoji: '' });
    
    if (isRainy) {
      items.outerwear.push({ id: 'outer_rain_poncho', name: 'Легкий дождевик-пончо', layer: 'outerwear', description: 'Тонкий непромокаемый плащ.', emoji: '' });
      items.accessories.push({ id: 'acc_umbrella_hot', name: 'Зонт', layer: 'accessories', description: 'Защита от теплого дождя.', emoji: '☂️' });
    } else {
      items.headwear.push({ id: 'acc_sun_protection', name: 'Бейсболка / панама', layer: 'headwear', description: 'Обязательный головной убор.', emoji: '👒' });
      items.accessories.push({ id: 'acc_sunglasses', name: 'Солнцезащитные очки', layer: 'accessories', description: 'Детские очки с защитой UV400.', emoji: '🕶️' });
    }
    
    if (effTemp > 25) specialAdvice.push('Ищите тень и избегайте нахождения на открытом солнце в пик жары (12:00-16:00).');
    specialAdvice.push('Обязательно возьмите с собой бутылочку чистой воды.');
  }

  // --- ГЛОБАЛЬНЫЕ ПЕРЕОПРЕДЕЛЕНИЯ ДЛЯ ДОЖДЯ ---
  if (isRainy && effTemp > -5 && effTemp <= 20) {
    // Заменяем обычную обувь на резиновую
    items.shoes = [{
      id: 'shoes_rubber_boots',
      name: 'Резиновые сапоги',
      layer: 'shoes',
      description: effTemp < 5 ? 'Утепленные резиновые сапоги со вкладышем.' : 'Резиновые сапоги для защиты от луж.',
      emoji: '',
      tips: 'Надевайте их на плотный носок.'
    }];
    
    // Добавляем дождевик если его нет
    const hasRaincoat = items.outerwear.some(a => a.id.includes('rain')) || items.accessories.some(a => a.id.includes('rain'));
    if (!hasRaincoat) {
      items.accessories.push({
        id: 'acc_raincoat',
        name: 'Дождевик',
        layer: 'accessories',
        description: 'Непромокаемый плащ поверх одежды.',
        emoji: '🧥',
        tips: 'Снимите дождевик в помещении, чтобы ребенок не перегрелся.'
      });
    }
  }

  // --- ГЕНЕРАЦИЯ РОДИТЕЛЬСКИХ СОВЕТОВ ---
  const parentTips: ParentTip[] = [
    { id: 'tip_a1', category: 'safety', title: 'Проверка: Руки и ноги', text: 'Тёплые ли ручки? Не мёрзнут ли ножки? Индикатор: тёплые, розовые = хорошо.', priority: 'danger', icon: '🛡️' },
    { id: 'tip_a2', category: 'safety', title: 'Проверка: Шея и спина', text: 'Проверьте тыльной стороной ладони. Горячая+мокрая = вспотел. Холодная = добавить слой.', priority: 'danger', icon: '🖐️' },
    { id: 'tip_a3', category: 'safety', title: 'Проверка: Лицо и уши', text: 'Носик не белый/синий. Щёки розовые = норма. Уши плотно закрыты.', priority: 'warning', icon: '😊' },
    { id: 'tip_a4', category: 'safety', title: 'Проверка: Обувь', text: 'Не тесная? Не мокрая? Тёплая ли стелька?', priority: 'warning', icon: '🥾' }
  ];

  // Советы по времени суток
  if (selectedPeriod === 'morning') {
    parentTips.push({ id: 'tip_b_morning', category: 'time', title: 'Утренние часы (🌅)', text: 'Утром обычно холоднее. Наденьте куртку сразу, к обеду потеплеет.', priority: 'info', icon: '🌅' });
  } else if (selectedPeriod === 'day') {
    if (effTemp > 22) {
      parentTips.push({ id: 'tip_b_day_hot', category: 'time', title: 'Дневной зной (☀️)', text: 'Пик жары. Ищите тень, предлагайте воду каждые 15 минут.', priority: 'warning', icon: '☀️' });
    } else {
      parentTips.push({ id: 'tip_b_day', category: 'time', title: 'Дневная прогулка (☀️)', text: 'Солнце активно. Если станет жарко — снимите верхний слой.', priority: 'info', icon: '☀️' });
    }
  } else if (selectedPeriod === 'evening') {
    parentTips.push({ id: 'tip_b_evening', category: 'time', title: 'Вечерняя прохлада (🌆)', text: 'Станет ощущаться холоднее. Приготовьте кофту заранее.', priority: 'info', icon: '🌆' });
  } else if (selectedPeriod === 'night') {
    parentTips.push({ id: 'tip_b_night', category: 'time', title: 'Поздний вечер / Ночь (🌙)', text: 'Темнее и прохладнее. Используйте светоотражающие элементы.', priority: 'info', icon: '🌙' });
  }

  // Советы по essentials
  if (effTemp < 5) {
    parentTips.push({ id: 'tip_c_cold', category: 'essentials', title: 'С собой в холод (🎒)', text: 'Запасные варежки, шарф, запасной слой, тёплый напиток.', priority: 'warning', icon: '🎒' });
  } else if (effTemp > 25) {
    parentTips.push({ id: 'tip_c_hot', category: 'essentials', title: 'С собой в жару ()', text: 'Бутылка воды (500мл+), SPF 30+, запасная панама.', priority: 'warning', icon: '💧' });
  } else {
    parentTips.push({ id: 'tip_c_mild', category: 'essentials', title: 'С собой в демисезон (🎒)', text: 'Лёгкая куртка в рюкзаке, компактный зонт.', priority: 'info', icon: '🎒' });
  }

  if (isRainy) {
    parentTips.push({ id: 'tip_c_rain', category: 'essentials', title: 'С собой в дождь (☂️)', text: 'Зонт, сменная обувь, сухие носки.', priority: 'warning', icon: '☂️' });
  }

  // Алерты
  if (effTemp > 28) {
    parentTips.push({ id: 'tip_d_hot_alert', category: 'alerts', title: '⚠️ ОПАСНОСТЬ ПЕРЕГРЕВА', text: 'Критическая жара! Признаки: горячая кожа, вялость. Срочно в тень!', priority: 'danger', icon: '⚠️' });
  } else if (effTemp < -15) {
    parentTips.push({ id: 'tip_d_cold_alert', category: 'alerts', title: '️ ОПАСНОСТЬ ПЕРЕОХЛАЖДЕНИЯ', text: 'Сильный мороз! Признаки: бледность, дрожь. Срочно в тепло!', priority: 'danger', icon: '️' });
  }

  if (isWindy) {
    parentTips.push({ id: 'tip_d_wind', category: 'alerts', title: '💨 ПРЕДУПРЕЖДЕНИЕ: Сильный ветер', text: 'Ветер выдувает тепло. Найти укрытие, защитить шею и лицо.', priority: 'warning', icon: '' });
  }

  // Возрастные советы
  if (ageGroup === '0-3m') {
    parentTips.push({ id: 'tip_e_newborn', category: 'age', title: 'Новорождённые (0-3 мес)', text: 'Терморегуляция незрелая. Проверяйте шею каждые 15 минут.', priority: 'danger', icon: '👶' });
  } else if (ageGroup === '3-12m') {
    parentTips.push({ id: 'tip_e_infant', category: 'age', title: 'Младенцы (3-12 мес)', text: 'Больше движений = больше тепла. Одевайте на 1 слой меньше.', priority: 'warning', icon: '🧸' });
  } else if (ageGroup === '1-3y') {
    parentTips.push({ id: 'tip_e_toddler', category: 'age', title: 'Ясельный возраст (1-3 года)', text: 'Бегает 90% времени. Не одевайте слишком тепло — вспотеет и замёрзнет.', priority: 'warning', icon: '🏃' });
  } else if (ageGroup === '3-7y') {
    parentTips.push({ id: 'tip_e_preschool', category: 'age', title: 'Дошкольники (3-7 лет)', text: 'Может сам снимать/надевать одежду. Давайте выбор.', priority: 'info', icon: '🎒' });
  } else if (ageGroup === '7-12y') {
    parentTips.push({ id: 'tip_e_school', category: 'age', title: 'Школьники (7-12 лет)', text: 'Одевается сам. Учитывайте, что тяжёлый рюкзак даёт тепло.', priority: 'info', icon: '🏫' });
  }

  // Практический совет
  parentTips.push({ id: 'tip_f_practical', category: 'practical', title: 'Практический совет (💡)', text: '"Капустный" принцип работает всегда! Мембрана дышит. Обувь: запас +1см к ноге.', priority: 'info', icon: '' });

  // Сортировка советов по приоритету
  parentTips.sort((a, b) => {
    const pWeight = { danger: 1, warning: 2, info: 3 };
    return pWeight[a.priority] - pWeight[b.priority];
  });

  // Формирование итогового объекта (с обратной совместимостью для старых компонентов)
  return {
    summary: `Для температуры ${weather.temp}°C (ощущается как ${effTemp}°C) рекомендуется многослойная одежда.`,
    base: items.underwear,       // DEPRECATED mapping
    middle: items.upper_layer,   // DEPRECATED mapping
    outer: items.outerwear,      // DEPRECATED mapping
    shoes: items.shoes,          // DEPRECATED mapping
    accessories: items.accessories, // DEPRECATED mapping
    specialAdvice,
    parentTips,
    // Новые поля для полной поддержки слоев
    items: Object.values(items).flat(),
    layers: items
  };
}
