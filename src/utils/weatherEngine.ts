import { WeatherData, ActivityLevel, ColdSensitivity, RecommendedOutfit, ClothingItem, AgeGroup, ParentTip, WeatherPeriodType } from '../types';

// Map WMO Weather Codes to Russian descriptions and styling
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

// Calculate effective temperature tailored for kids, incorporating wind chill, humidity, activity, sensitivity, and age group
export function calculateEffectiveTemp(
  temp: number,
  windSpeed: number,
  humidity: number,
  activity: ActivityLevel,
  sensitivity: ColdSensitivity,
  ageGroup: AgeGroup
): number {
  let effTemp = temp;

  // 1. Wind chill penalty (Section 2.2 of spec)
  if (windSpeed > 10) {
    if (windSpeed <= 20) effTemp -= 2;
    else if (windSpeed <= 30) effTemp -= 4;
    else if (windSpeed <= 40) effTemp -= 6;
    else if (windSpeed <= 50) effTemp -= 8;
    else effTemp -= 10;
  }

  // 2. Humidity penalty (Section 2.3 of spec)
  if (humidity > 60) {
    if (humidity <= 80) effTemp -= 1.5;
    else if (humidity <= 90) effTemp -= 3.0;
    else effTemp -= 5.0;
  }

  // 3. Activity level adjustment (Section 2.6 of spec)
  // Active child produces heat -> effectively feels warmer for clothing selection (needs fewer layers)
  // Stroller/quiet child produces no heat -> effectively feels colder (needs more layers)
  if (activity === 'quiet') {
    effTemp -= 3.0;
  } else if (activity === 'active') {
    // Older active kids generate significant heat
    if (ageGroup === '1-3y') effTemp += 3.0;
    else if (ageGroup === '3-7y' || ageGroup === '7-12y') effTemp += 5.0;
    else effTemp += 2.0;
  }

  // 4. Age Group baseline adjustments (Section 1 of spec)
  if (ageGroup === '0-3m') {
    effTemp -= 4.0; // Newborns have immature thermoregulation, need warmer clothing baseline
  } else if (ageGroup === '3-12m') {
    effTemp -= 2.0;
  }

  // 5. Cold sensitivity adjustment
  if (sensitivity === 'sensitive') {
    effTemp -= 2.0;
  } else if (sensitivity === 'resistant') {
    effTemp += 2.0;
  }

  return parseFloat(effTemp.toFixed(1));
}

// Generate custom outfits and parent tips based on effective temperature, rain/snow, wind, activity, sensitivity, and age group
export function generateOutfit(
  gender: 'boy' | 'girl',
  weather: WeatherData,
  activity: ActivityLevel,
  sensitivity: ColdSensitivity,
  ageGroup: AgeGroup,
  selectedPeriod: WeatherPeriodType = 'day'
): RecommendedOutfit {
  const effTemp = calculateEffectiveTemp(weather.temp, weather.windSpeed, weather.humidity, activity, sensitivity, ageGroup);
  
  const base: ClothingItem[] = [];
  const middle: ClothingItem[] = [];
  const outer: ClothingItem[] = [];
  const shoes: ClothingItem[] = [];
  const accessories: ClothingItem[] = [];
  const specialAdvice: string[] = [];

  const isRainy = weather.isRainy || weather.precipProb > 40;
  const isSnowy = weather.isSnowy;
  const isWindy = weather.windSpeed > 15;

  // --- CLOTHING SELECTION MATRIX BY 10 TEMPERATURE ZONES & AGE GROUPS ---

  // 1. FREEZING: <= -20°C
  if (effTemp <= -20) {
    if (ageGroup === '0-3m') {
      base.push({ id: 'base_thermal_merino', name: 'Термобелье (шерсть мериноса)', category: 'base', description: 'Мягкий слип из 100% шерсти мериноса на голое тело.', color: 'bg-pink-100 border-pink-300', emoji: '👔', layerIndex: 1, tips: 'Шерсть мериноса идеально сохраняет тепло и отводит влагу.' });
      middle.push({ id: 'mid_fleece_slip', name: 'Флисовый слип', category: 'middle', description: 'Плотный комбинезон из качественного флиса.', color: 'bg-purple-100 border-purple-300', emoji: '🧥', layerIndex: 2 });
      outer.push({ id: 'outer_winter_300g', name: 'Зимний комбинезон (300г утеплителя)', category: 'outer', description: 'Максимально утепленный зимний комбинезон-мешок.', color: 'bg-rose-500 text-white border-rose-600', emoji: '🧥', layerIndex: 3 });
      accessories.push({ id: 'acc_helmet_hat', name: 'Шапка-шлем + подшальник', category: 'accessory', description: 'Плотная зимняя шапка-шлем, закрывающая шею и лоб.', color: 'bg-cyan-100 border-cyan-300', emoji: '👤', layerIndex: 3 });
      accessories.push({ id: 'acc_fur_bag', name: 'Меховой конверт в коляску', category: 'accessory', description: 'Теплый конверт на овчине или пуху в коляску.', color: 'bg-amber-100 border-amber-300', emoji: '🛌', layerIndex: 3 });
      specialAdvice.push('НЕ выходить на улицу с новорожденным без крайней необходимости при температуре ниже -15°C!');
    } else if (ageGroup === '3-12m') {
      base.push({ id: 'base_thermal', name: 'Термобелье для малышей', category: 'base', description: 'Двухслойное термобелье (хлопок+шерсть).', color: 'bg-blue-100 border-blue-300', emoji: '👚', layerIndex: 1 });
      middle.push({ id: 'mid_fleece_suit', name: 'Флисовый комбинезон', category: 'middle', description: 'Плотная флисовая поддева.', color: 'bg-purple-100 border-purple-300', emoji: '🧥', layerIndex: 2 });
      outer.push({ id: 'outer_winter_300g', name: 'Зимний комбинезон (300г утеплителя)', category: 'outer', description: 'Теплый мембранный комбинезон.', color: 'bg-indigo-500 text-white border-indigo-600', emoji: '🧥', layerIndex: 3 });
      accessories.push({ id: 'acc_helmet_hat', name: 'Шапка-шлем', category: 'accessory', description: 'Зимняя шапка-шлем с ветрозащитными вставками.', color: 'bg-cyan-100 border-cyan-300', emoji: '👤', layerIndex: 3 });
      accessories.push({ id: 'acc_mittens_kragi', name: 'Варежки-краги', category: 'accessory', description: 'Высокие непромокаемые варежки поверх рукавов.', color: 'bg-teal-100 border-teal-300', emoji: '🧤', layerIndex: 3 });
      shoes.push({ id: 'shoes_warm_booties', name: 'Теплые пинетки / валенки', category: 'shoes', description: 'Меховые пинетки или валенки на теплый носок.', color: 'bg-slate-700 text-white border-slate-800', emoji: '🥾', layerIndex: 3 });
      specialAdvice.push('Обязательно используйте теплый плед или чехол в коляске.');
    } else {
      base.push({ id: 'base_thermal_active', name: 'Термобелье (шерсть/полиэстер)', category: 'base', description: 'Комплект термобелья с длинным рукавом и кальсонами.', color: 'bg-slate-100 border-slate-300', emoji: '👕', layerIndex: 1 });
      base.push({ id: 'base_socks_merino', name: 'Термоноски / шерстяные носки', category: 'base', description: 'Плотные шерстяные носки поверх базовых.', color: 'bg-amber-100 border-amber-300', emoji: '🧦', layerIndex: 1 });
      middle.push({ id: 'mid_fleece_heavy', name: 'Флисовый костюм (плотность 200-300г)', category: 'middle', description: 'Теплая кофта и штаны из плотного флиса.', color: 'bg-purple-100 border-purple-300', emoji: '🧥', layerIndex: 2 });
      outer.push({ id: 'outer_heavy_winter', name: gender === 'girl' ? 'Зимний пуховик / полукомбинезон (250-300г)' : 'Утепленный мембранный комбинезон (250-300г)', category: 'outer', description: 'Сверхтеплый зимний комбинезон или комплект куртка+штаны.', color: gender === 'girl' ? 'bg-rose-500 text-white border-rose-600' : 'bg-indigo-500 text-white border-indigo-600', emoji: '🧥', layerIndex: 3 });
      shoes.push({ id: 'shoes_winter_heavy', name: 'Валенки / мембранные зимние сапоги', category: 'shoes', description: 'Сапоги на натуральной овчине или сноубутсы (Куома).', color: 'bg-slate-700 text-white border-slate-800', emoji: '🥾', layerIndex: 3 });
      accessories.push({ id: 'acc_helmet_hat', name: 'Утепленная шапка-шлем', category: 'accessory', description: 'Шапка-шлем, закрывающая шею и уши.', color: 'bg-cyan-100 border-cyan-300', emoji: '👤', layerIndex: 3 });
      accessories.push({ id: 'acc_mittens_kragi', name: 'Варежки-краги', category: 'accessory', description: 'Непромокаемые краги на молнии или липучке.', color: 'bg-teal-100 border-teal-300', emoji: '🧤', layerIndex: 3 });
      specialAdvice.push('При сильном морозе ограничьте прогулку 20-30 минутами.');
    }
  }
  
  // 2. VERY COLD: -20°C to -10°C
  else if (effTemp > -20 && effTemp <= -10) {
    if (ageGroup === '0-3m') {
      base.push({ id: 'base_cotton_slip', name: 'Хлопковый слип', category: 'base', description: 'Слип из плотного хлопка с закрытыми ручками и ножками.', color: 'bg-pink-50 border-pink-200', emoji: '👶', layerIndex: 1 });
      middle.push({ id: 'mid_fleece_slip', name: 'Флисовый комбинезон', category: 'middle', description: 'Мягкий комбинезон из флиса или велсофта.', color: 'bg-purple-50 border-purple-200', emoji: '🧥', layerIndex: 2 });
      outer.push({ id: 'outer_winter_200g', name: 'Зимний комбинезон (200-250г)', category: 'outer', description: 'Утепленный комбинезон с капюшоном.', color: 'bg-rose-400 text-white border-rose-500', emoji: '🧥', layerIndex: 3 });
      accessories.push({ id: 'acc_warm_hat_double', name: 'Двухслойная теплая шапка', category: 'accessory', description: 'Шапочка на флисовой подкладке.', color: 'bg-cyan-50 border-cyan-200', emoji: '👤', layerIndex: 3 });
      shoes.push({ id: 'shoes_wool_socks', name: 'Шерстяные носочки / пинетки', category: 'shoes', description: 'Теплые пинетки поверх слипа.', color: 'bg-slate-600 text-white border-slate-700', emoji: '🧦', layerIndex: 3 });
    } else if (ageGroup === '3-12m' || ageGroup === '1-3y') {
      base.push({ id: 'base_thermal_tights', name: 'Термобелье / боди + колготки', category: 'base', description: 'Хлопковое боди с длинным рукавом и теплые колготки.', color: 'bg-blue-50 border-blue-200', emoji: '👚', layerIndex: 1 });
      middle.push({ id: 'mid_fleece_suit', name: 'Флисовый костюм', category: 'middle', description: 'Раздельный или слитный флисовый костюм.', color: 'bg-purple-100 border-purple-200', emoji: '🧥', layerIndex: 2 });
      outer.push({ id: 'outer_winter_200g', name: 'Зимний комбинезон (200-250г)', category: 'outer', description: 'Мембранный комбинезон, защищающий от ветра.', color: 'bg-indigo-500 text-white border-indigo-600', emoji: '🧥', layerIndex: 3 });
      accessories.push({ id: 'acc_helmet_hat', name: 'Шапка-шлем', category: 'accessory', description: 'Шерстяная шапка-шлем с хлопковым подкладом.', color: 'bg-cyan-100 border-cyan-200', emoji: '👤', layerIndex: 3 });
      accessories.push({ id: 'acc_mittens', name: 'Теплые варежки', category: 'accessory', description: 'Шерстяные варежки или непромокаемые рукавички.', color: 'bg-teal-50 border-teal-200', emoji: '🧤', layerIndex: 3 });
      shoes.push({ id: 'shoes_winter_boots', name: 'Зимние мембранные ботинки', category: 'shoes', description: 'Ботинки с шерстяным мехом или сноубутсы.', color: 'bg-slate-700 text-white border-slate-800', emoji: '👢', layerIndex: 3 });
    } else {
      base.push({ id: 'base_thermal', name: 'Термобелье (синтетика/шерсть)', category: 'base', description: 'Комплект функционального термобелья.', color: 'bg-slate-100 border-slate-200', emoji: '👕', layerIndex: 1 });
      middle.push({ id: 'mid_sweater_fleece', name: 'Флисовая кофта или свитер', category: 'middle', description: 'Кофта из флиса или полушерстяной свитер.', color: 'bg-purple-50 border-purple-200', emoji: '🧶', layerIndex: 2 });
      outer.push({ id: 'outer_winter_jacket', name: 'Зимняя куртка и теплые штаны (200-250г)', category: 'outer', description: 'Куртка и полукомбинезон из мембранной ткани.', color: gender === 'girl' ? 'bg-pink-500 text-white border-pink-600' : 'bg-blue-600 text-white border-blue-700', emoji: '🧥', layerIndex: 3 });
      shoes.push({ id: 'shoes_winter_boots', name: 'Зимние ботинки Gore-Tex', category: 'shoes', description: 'Теплые непромокаемые ботинки на мембране.', color: 'bg-zinc-700 text-white border-zinc-800', emoji: '🥾', layerIndex: 3 });
      accessories.push({ id: 'acc_winter_hat', name: 'Зимняя шапка + шарф/снуд', category: 'accessory', description: 'Вязаная шапка на флисе и удобный снуд.', color: 'bg-yellow-100 border-yellow-200', emoji: '🧣', layerIndex: 3 });
      accessories.push({ id: 'acc_mittens', name: 'Варежки', category: 'accessory', description: 'Теплые варежки с высокими манжетами.', color: 'bg-teal-100 border-teal-200', emoji: '🧤', layerIndex: 3 });
    }
  }

  // 3. COLD: -10°C to -5°C
  else if (effTemp > -10 && effTemp <= -5) {
    if (ageGroup === '0-3m') {
      base.push({ id: 'base_cotton_slip', name: 'Хлопковый слип', category: 'base', description: 'Слип из 100% хлопка.', color: 'bg-pink-50 border-pink-100', emoji: '👶', layerIndex: 1 });
      middle.push({ id: 'mid_fleece_slip', name: 'Флисовый комбинезон', category: 'middle', description: 'Мягкий флисовый человечек.', color: 'bg-purple-50 border-purple-100', emoji: '🧥', layerIndex: 2 });
      outer.push({ id: 'outer_demi_winter', name: 'Демисезонный комбинезон (зимний вариант 180-200г)', category: 'outer', description: 'Комбинезон с капюшоном.', color: 'bg-rose-300 text-white border-rose-400', emoji: '🧥', layerIndex: 3 });
      accessories.push({ id: 'acc_warm_hat', name: 'Теплая шапочка + капюшон', category: 'accessory', description: 'Шапочка, плотно закрывающая ушки.', color: 'bg-cyan-50 border-cyan-100', emoji: '👤', layerIndex: 3 });
      shoes.push({ id: 'shoes_warm_socks', name: 'Теплые носочки / пинетки', category: 'shoes', description: 'Пинетки от комбинезона.', color: 'bg-slate-500 text-white border-slate-600', emoji: '🧦', layerIndex: 3 });
    } else if (ageGroup === '3-12m' || ageGroup === '1-3y') {
      base.push({ id: 'base_body_tights', name: 'Боди с длинным рукавом + колготки', category: 'base', description: 'Плотное боди и махровые колготки.', color: 'bg-blue-50 border-blue-100', emoji: '👚', layerIndex: 1 });
      middle.push({ id: 'mid_fleece_jacket', name: 'Флисовая кофточка', category: 'middle', description: 'Кофта из флиса на молнии.', color: 'bg-purple-50 border-purple-200', emoji: '🧥', layerIndex: 2 });
      outer.push({ id: 'outer_demi_heavy', name: 'Утепленный демисезонный комбинезон (160-180г)', category: 'outer', description: 'Непродуваемый комбинезон.', color: 'bg-indigo-400 text-white border-indigo-500', emoji: '🧥', layerIndex: 3 });
      accessories.push({ id: 'acc_hat', name: 'Теплая шапка', category: 'accessory', description: 'Вязаная шапка на завязках или шлем.', color: 'bg-cyan-50 border-cyan-200', emoji: '👤', layerIndex: 3 });
      accessories.push({ id: 'acc_gloves', name: 'Варежки / плотные перчатки', category: 'accessory', description: 'Мягкие шерстяные варежки.', color: 'bg-teal-50 border-teal-100', emoji: '🧤', layerIndex: 3 });
      shoes.push({ id: 'shoes_demi_boots', name: 'Осенне-зимние ботинки', category: 'shoes', description: 'Ботинки на байке или мембране.', color: 'bg-slate-700 text-white border-slate-800', emoji: '👢', layerIndex: 3 });
    } else {
      base.push({ id: 'base_thermal_opt', name: 'Термобелье или лонгслив', category: 'base', description: 'Тонкое термобелье или плотная футболка с длинным рукавом.', color: 'bg-slate-50 border-slate-200', emoji: '👕', layerIndex: 1 });
      middle.push({ id: 'mid_sweater', name: 'Свитер или флисовая кофта', category: 'middle', description: 'Легкий джемпер или кофта из флиса.', color: 'bg-purple-50 border-purple-100', emoji: '🧶', layerIndex: 2 });
      outer.push({ id: 'outer_demi_jacket', name: 'Демисезонная куртка и теплые брюки (140-160г)', category: 'outer', description: 'Куртка из мембраны и штаны на флисовой подкладке.', color: gender === 'girl' ? 'bg-pink-400 text-white border-pink-500' : 'bg-blue-500 text-white border-blue-600', emoji: '🧥', layerIndex: 3 });
      shoes.push({ id: 'shoes_demi_boots', name: 'Осенние утепленные ботинки', category: 'shoes', description: 'Ботинки с подкладкой из байки или флиса.', color: 'bg-zinc-600 text-white border-zinc-700', emoji: '🥾', layerIndex: 3 });
      accessories.push({ id: 'acc_hat_scarf', name: 'Шапка + снуд', category: 'accessory', description: 'Вязаная шапка и трикотажный шарф.', color: 'bg-yellow-50 border-yellow-200', emoji: '🧣', layerIndex: 3 });
      accessories.push({ id: 'acc_gloves', name: 'Плотные перчатки', category: 'accessory', description: 'Трикотажные или шерстяные перчатки.', color: 'bg-teal-50 border-teal-200', emoji: '🧤', layerIndex: 3 });
    }
  }

  // 4. TRANSITION COLD: -5°C to 0°C
  else if (effTemp > -5 && effTemp <= 0) {
    base.push({ id: 'base_long_sleeve', name: 'Лонгслив + колготки / кальсоны', category: 'base', description: 'Хлопковая кофточка с длинным рукавом и мягкие колготы.', color: 'bg-slate-100 border-slate-200', emoji: '👕', layerIndex: 1 });
    middle.push({ id: 'mid_sweatshirt', name: 'Свитшот или плотный кардиган', category: 'middle', description: 'Трикотажный свитшот с начесом.', color: 'bg-orange-100 border-orange-200', emoji: '🧥', layerIndex: 2 });
    outer.push({ id: 'outer_demi_heavy', name: 'Демисезонный комбинезон / куртка (100-140г)', category: 'outer', description: 'Утепленная демисезонная одежда из мембраны.', color: gender === 'girl' ? 'bg-purple-400 text-white border-purple-500' : 'bg-blue-400 text-white border-blue-500', emoji: '🧥', layerIndex: 3 });
    shoes.push({ id: 'shoes_demi_heavy', name: 'Демисезонные ботинки / сноубутсы', category: 'shoes', description: 'Высокие ботинки с водоотталкивающей пропиткой.', color: 'bg-amber-700 text-white border-amber-800', emoji: '🥾', layerIndex: 3 });
    accessories.push({ id: 'acc_demi_hat', name: 'Вязаная шапка', category: 'accessory', description: 'Двухслойная трикотажная или полушерстяная шапочка.', color: 'bg-cyan-50 border-cyan-200', emoji: '👤', layerIndex: 3 });
    accessories.push({ id: 'acc_gloves_soft', name: 'Мягкие перчатки', category: 'accessory', description: 'Трикотажные перчатки для защиты рук от ветра.', color: 'bg-emerald-50 border-emerald-200', emoji: '🧤', layerIndex: 3 });
    if (isRainy || isSnowy) specialAdvice.push('При околонулевой температуре слякоть быстро промачивает обычную ткань — мембрана обязательна.');
  }

  // 5. COOL: 0°C to +5°C
  else if (effTemp > 0 && effTemp <= 5) {
    if (ageGroup === '0-3m' || ageGroup === '3-12m') {
      base.push({ id: 'base_cotton_slip', name: 'Хлопковый слип / боди', category: 'base', description: 'Слип или боди с длинным рукавом и штанишками.', color: 'bg-pink-50 border-pink-200', emoji: '👶', layerIndex: 1 });
      middle.push({ id: 'mid_fleece_suit', name: 'Флисовый комбинезон', category: 'middle', description: 'Мягкий флисовый костюмчик.', color: 'bg-purple-50 border-purple-200', emoji: '🧥', layerIndex: 2 });
      outer.push({ id: 'outer_demi_100g', name: 'Демисезонный комбинезон (80-100г)', category: 'outer', description: 'Легкий утепленный комбинезон.', color: 'bg-rose-400 text-white border-rose-500', emoji: '🧥', layerIndex: 3 });
      accessories.push({ id: 'acc_light_hat', name: 'Легкая шапочка', category: 'accessory', description: 'Плотная трикотажная шапочка.', color: 'bg-cyan-50 border-cyan-200', emoji: '👤', layerIndex: 3 });
      shoes.push({ id: 'shoes_booties', name: 'Пинетки / теплые носочки', category: 'shoes', description: 'Теплые пинетки от комбинезона.', color: 'bg-slate-500 text-white border-slate-600', emoji: '🧦', layerIndex: 3 });
      specialAdvice.push('В коляске держите наготове плед или легкое одеяло.');
    } else {
      base.push({ id: 'base_long_cotton', name: 'Хлопковый лонгслив и штанишки', category: 'base', description: 'Приятный к телу лонгслив и колготы или легкие брюки.', color: 'bg-slate-50 border-slate-200', emoji: '👕', layerIndex: 1 });
      middle.push({ id: 'mid_hoodie', name: 'Утепленный худи или кофта', category: 'middle', description: 'Плотный худи на молнии или флисовая кофточка.', color: 'bg-emerald-100 border-emerald-300', emoji: '👚', layerIndex: 2 });
      outer.push({ id: 'outer_demi_std', name: gender === 'girl' ? 'Демисезонное пальто / куртка (80-100г)' : 'Демисезонная куртка + плотные джинсы', category: 'outer', description: 'Куртка с легким утеплителем и непродуваемые штаны.', color: gender === 'girl' ? 'bg-rose-400 text-white border-rose-500' : 'bg-teal-500 text-white border-teal-600', emoji: '🧥', layerIndex: 3 });
      shoes.push({ id: 'shoes_demi_leather', name: 'Кожаные ботинки на байке', category: 'shoes', description: 'Ботинки из натуральной кожи или нубука с байковой подкладкой.', color: 'bg-amber-800 text-white border-amber-900', emoji: '🥾', layerIndex: 3 });
      accessories.push({ id: 'acc_beanie', name: 'Трикотажная шапка-бини', category: 'accessory', description: 'Плотная однослойная шапочка из трикотажа.', color: 'bg-indigo-50 border-indigo-200', emoji: '👤', layerIndex: 3 });
    }
  }

  // 6. MILD: +5°C to +15°C
  else if (effTemp > 5 && effTemp <= 15) {
    if (ageGroup === '0-3m' || ageGroup === '3-12m') {
      base.push({ id: 'base_body_long', name: 'Боди с длинным рукавом + ползунки', category: 'base', description: 'Хлопковое боди и мягкие ползунки или штанишки.', color: 'bg-blue-50 border-blue-100', emoji: '👶', layerIndex: 1 });
      middle.push({ id: 'mid_knit_suit', name: 'Вязаный или флисовый костюмчик', category: 'middle', description: 'Кофточка и штанишки из плотного трикотажа или тонкого флиса.', color: 'bg-purple-50 border-purple-200', emoji: '🧥', layerIndex: 2 });
      outer.push({ id: 'outer_light_suit', name: 'Легкий комбинезон / ветровка', category: 'outer', description: 'Комбинезон без утеплителя на флисовой или хлопковой подкладке.', color: 'bg-indigo-400 text-white border-indigo-500', emoji: '🧥', layerIndex: 3 });
      accessories.push({ id: 'acc_thin_hat', name: 'Тонкая шапочка', category: 'accessory', description: 'Хлопковая шапочка в один слой.', color: 'bg-cyan-50 border-cyan-100', emoji: '👤', layerIndex: 3 });
      shoes.push({ id: 'shoes_light_booties', name: 'Легкие пинетки / ботиночки', category: 'shoes', description: 'Текстильные или кожаные пинетки.', color: 'bg-slate-600 text-white border-slate-700', emoji: '👟', layerIndex: 3 });
    } else {
      base.push({ id: 'base_tshirt', name: 'Футболка / лонгслив', category: 'base', description: 'Хлопковая футболка или тонкая кофта с длинным рукавом.', color: 'bg-sky-50 border-sky-100', emoji: '👕', layerIndex: 1 });
      if (activity !== 'active' || effTemp < 12) {
        middle.push({ id: 'mid_sweatshirt_light', name: 'Толстовка или бомбер', category: 'middle', description: 'Трикотажный свитшот или стильный бомбер.', color: 'bg-amber-50 border-amber-200', emoji: '🧥', layerIndex: 2 });
      }
      outer.push({ id: 'outer_windbreaker', name: gender === 'girl' ? 'Ветровка / плащ / тренч' : 'Ветровка или легкая куртка Softshell', category: 'outer', description: 'Легкая куртка без утеплителя, защищающая от ветра. Низ: джинсы или плотные брюки.', color: gender === 'girl' ? 'bg-yellow-400 text-neutral-900 border-yellow-500' : 'bg-emerald-500 text-white border-emerald-600', emoji: '🧥', layerIndex: 3 });
      shoes.push({ id: 'shoes_sneakers', name: 'Кроссовки или кеды', category: 'shoes', description: 'Удобные кроссовки на плотной подошве или кожаные кеды.', color: 'bg-slate-300 border-slate-400', emoji: '👟', layerIndex: 3 });
      if (effTemp < 12 || isWindy) {
        accessories.push({ id: 'acc_headband', name: 'Тонкая шапочка или повязка', category: 'accessory', description: 'Легкая трикотажная шапочка или повязка на уши.', color: 'bg-pink-100 border-pink-200', emoji: '👤', layerIndex: 3 });
      }
    }
  }

  // 7. WARM: +15°C to +20°C
  else if (effTemp > 15 && effTemp <= 20) {
    if (ageGroup === '0-3m' || ageGroup === '3-12m') {
      base.push({ id: 'base_body_short', name: 'Боди с коротким рукавом + легкие штанишки', category: 'base', description: 'Хлопковое боди и тонкие ползунки.', color: 'bg-pink-50 border-pink-100', emoji: '👶', layerIndex: 1 });
      middle.push({ id: 'mid_cotton_suit', name: 'Хлопковый костюмчик', category: 'middle', description: 'Легкая кофточка на пуговицах.', color: 'bg-purple-50 border-purple-100', emoji: '🧥', layerIndex: 2 });
      accessories.push({ id: 'acc_panama_baby', name: 'Легкая панамка', category: 'accessory', description: 'Хлопковая панамка от солнца.', color: 'bg-amber-100 border-amber-200', emoji: '👒', layerIndex: 3 });
      shoes.push({ id: 'shoes_socks', name: 'Хлопковые носочки', category: 'shoes', description: 'Тонкие носочки.', color: 'bg-slate-200 border-slate-300', emoji: '🧦', layerIndex: 3 });
    } else {
      base.push({ id: 'base_summer_outfit', name: gender === 'girl' ? 'Легкое платье / футболка + леггинсы' : 'Футболка + хлопковые джинсы / брюки', category: 'base', description: gender === 'girl' ? 'Хлопковое платье с коротким рукавом или футболка с леггинсами.' : 'Футболка с принтом и тонкие джинсы или спортивные штаны.', color: gender === 'girl' ? 'bg-rose-100 border-rose-200' : 'bg-sky-100 border-sky-200', emoji: gender === 'girl' ? '👗' : '👕', layerIndex: 1 });
      middle.push({ id: 'mid_denim_jacket', name: gender === 'girl' ? 'Джинсовка или легкий кардиган' : 'Джинсовая куртка или легкая кофта', category: 'middle', description: 'Легкая джинсовая куртка или трикотажная кофта на случай тени или ветра.', color: 'bg-blue-50 border-blue-200', emoji: '🧥', layerIndex: 2, tips: 'Легко снять и повязать на пояс, если станет жарко.' });
      shoes.push({ id: 'shoes_light_sneakers', name: 'Легкие кроссовки / слипоны / кеды', category: 'shoes', description: 'Текстильная дышащая обувь.', color: 'bg-teal-100 border-teal-200', emoji: '👟', layerIndex: 3 });
      if (weather.weatherCode <= 3) {
        accessories.push({ id: 'acc_panama', name: 'Панама или кепка', category: 'accessory', description: 'Головной убор для защиты от солнца.', color: 'bg-amber-100 border-amber-200', emoji: '👒', layerIndex: 3 });
      }
    }
  }

  // 8. NICE (+20°C to +25°C) & HOT (+25°C to +30°C) & VERY HOT (> +30°C)
  else {
    base.push({ id: 'base_hot_summer', name: gender === 'girl' ? 'Легкий сарафан / топ с шортиками' : 'Майка / футболка + легкие шорты', category: 'base', description: gender === 'girl' ? 'Легкий сарафан из 100% хлопка или льна, ромпер или майка с шортиками.' : 'Легкая майка или футболка из тонкого хлопка и трикотажные шорты.', color: gender === 'girl' ? 'bg-yellow-50 border-yellow-200' : 'bg-orange-50 border-orange-200', emoji: gender === 'girl' ? '👗' : '🩳', layerIndex: 1, tips: 'Выбирайте одежду из натурального льна или 100% хлопка, чтобы кожа дышала.' });
    shoes.push({ id: isRainy ? 'shoes_water_sandals' : 'shoes_sandals', name: isRainy ? 'Резиновые сандалии / кроксы' : 'Открытые сандалии / босоножки', category: 'shoes', description: isRainy ? 'Легкая моющаяся обувь с нескользкой подошвой.' : 'Сандалии из натуральных материалов с регулируемыми застежками.', color: isRainy ? 'bg-yellow-100 border-yellow-300' : 'bg-amber-100 border-amber-200', emoji: isRainy ? '👟' : '👡', layerIndex: 3 });
    
    if (isRainy) {
      outer.push({ id: 'outer_light_rain_poncho', name: 'Легкий дождевик-пончо', category: 'outer', description: 'Тонкий непромокаемый дождевик поверх летнего комплекта.', color: 'bg-sky-100 border-sky-300', emoji: '🧥', layerIndex: 3, tips: 'После дождя сразу снимите дождевик, чтобы тело не запарилось.' });
      accessories.push({ id: 'acc_umbrella_hot', name: 'Зонт или капюшон дождевика', category: 'accessory', description: 'Защита головы от теплого дождя без лишнего утепления.', color: 'bg-sky-100 border-sky-300', emoji: '☂️', layerIndex: 3 });
    } else {
      accessories.push({ id: 'acc_sun_protection', name: 'Бейсболка/панама + солнечные очки', category: 'accessory', description: 'Обязательный головной убор для защиты от солнца. Детские темные очки с защитой UV400.', color: 'bg-amber-200 border-amber-300', emoji: '🕶️', layerIndex: 3 });
    }

    if (effTemp > 25) specialAdvice.push('Ищите тень и избегайте нахождения на открытом солнце в пик жары (12:00-16:00).');
    specialAdvice.push('Обязательно возьмите с собой бутылочку чистой воды и предлагайте пить каждые 15-20 минут.');
  }

  // --- GLOBAL RAIN OVERRIDES ---
  if (isRainy) {
    if (effTemp > -5 && effTemp <= 20) {
      shoes.length = 0;
      shoes.push({
        id: 'shoes_rubber_boots',
        name: 'Резиновые сапоги',
        category: 'shoes',
        description: effTemp < 5 ? 'Утепленные резиновые сапоги со вкладышем.' : 'Резиновые сапоги для защиты от луж.',
        color: 'bg-yellow-500 text-black border-yellow-600',
        emoji: '👢',
        layerIndex: 3,
        tips: 'Надевайте их на плотный носок, чтобы ножка не мерзла.'
      });
    }
    
    const hasRaincoat = accessories.some(a => a.id.includes('rain')) || outer.some(o => o.id.includes('rain')) || middle.some(m => m.id.includes('rain'));
    if (!hasRaincoat && effTemp > -5) {
      accessories.push({
        id: 'acc_raincoat',
        name: 'Дождевик',
        category: 'accessory',
        description: 'Непромокаемый плащ-дождевик поверх одежды.',
        color: 'bg-blue-100 border-blue-300',
        emoji: '🧥',
        layerIndex: 3,
        tips: 'Снимите дождевик в помещении, чтобы ребенок не перегрелся.'
      });
    }
  }

  // --- GENERATE PARENT TIPS (CATEGORIES A, B, C, D, E, F) ---
  const parentTips: ParentTip[] = [];

  // Category A: Safety Checks (Always active)
  parentTips.push({ id: 'tip_a1', category: 'safety', title: 'Проверка: Руки и ноги', text: 'Тёплые ли ручки? Не мёрзнут ли ножки? Индикатор: тёплые, розовые = хорошо.', priority: 'danger', icon: '🛡️' });
  parentTips.push({ id: 'tip_a2', category: 'safety', title: 'Проверка: Шея и спина', text: 'Проверьте тыльной стороной ладони. Горячая+мокрая = вспотел (снять слой!). Холодная = добавить слой.', priority: 'danger', icon: '🖐️' });
  parentTips.push({ id: 'tip_a3', category: 'safety', title: 'Проверка: Лицо и уши', text: 'Носик: не белый/синий (мороз), не красный (жара). Щёки розовые = норма. Уши плотно закрыты.', priority: 'warning', icon: '😊' });
  parentTips.push({ id: 'tip_a4', category: 'safety', title: 'Проверка: Обувь', text: 'Не тесная? Не мокрая? Тёплая ли стелька? Удобно ли застёгивается?', priority: 'warning', icon: '🥾' });

  // Category B: Time-Based
  if (selectedPeriod === 'morning') {
    parentTips.push({ id: 'tip_b_morning', category: 'time', title: 'Утренние часы (🌅)', text: 'Утром обычно холоднее дневной нормы (роса/иней). Наденьте куртку сразу, к обеду потеплеет — можно снять и нести в рюкзаке.', priority: 'info', icon: '🌅' });
  } else if (selectedPeriod === 'day') {
    if (effTemp > 22) {
      parentTips.push({ id: 'tip_b_day_hot', category: 'time', title: 'Дневной зной (☀️)', text: 'Сейчас пик жары и активности солнца. Ищите тень, ограничьте активный бег, предлагайте воду каждые 15 минут.', priority: 'warning', icon: '☀️' });
    } else {
      parentTips.push({ id: 'tip_b_day', category: 'time', title: 'Дневная прогулка (☀️)', text: 'Солнце активно. Если станет жарко — снимите верхний слой, если похолодает — наденьте обратно.', priority: 'info', icon: '☀️' });
    }
  } else if (selectedPeriod === 'evening') {
    parentTips.push({ id: 'tip_b_evening', category: 'time', title: 'Вечерняя прохлада (🌆)', text: 'Солнце садится — станет ощущаться холоднее. Начните утепляться заранее, приготовьте кофту или ветровку.', priority: 'info', icon: '🌆' });
  } else if (selectedPeriod === 'night') {
    parentTips.push({ id: 'tip_b_night', category: 'time', title: 'Поздний вечер / Ночь (🌙)', text: 'Темнее и прохладнее, чем кажется. Используйте светоотражающие элементы на одежде и коляске.', priority: 'info', icon: '🌙' });
  }

  // Category C: Essentials
  if (effTemp < 5) {
    parentTips.push({ id: 'tip_c_cold', category: 'essentials', title: 'С собой в холод (🎒)', text: 'Запасные варежки/перчатки (на случай мокрых), шарф, запасной слой одежды в рюкзаке, тёплый напиток в термосе.', priority: 'warning', icon: '🎒' });
  } else if (effTemp > 25) {
    parentTips.push({ id: 'tip_c_hot', category: 'essentials', title: 'С собой в жару (🎒)', text: 'Бутылка воды (500мл+), солнцезащитный крем SPF 30+, запасная панама, солнцезащитные очки.', priority: 'warning', icon: '💧' });
  } else {
    parentTips.push({ id: 'tip_c_mild', category: 'essentials', title: 'С собой в демисезон (🎒)', text: 'Лёгкая куртка или ветровка в рюкзаке, компактный зонт (погода весной и осенью очень переменчива).', priority: 'info', icon: '🎒' });
  }

  if (isRainy) {
    parentTips.push({ id: 'tip_c_rain', category: 'essentials', title: 'С собой в дождь (☂️)', text: 'Зонт или дождевик, сменная обувь в рюкзаке, запасные сухие носки и салфетки.', priority: 'warning', icon: '☂️' });
  }

  // Category D: Alerts
  if (effTemp > 28) {
    parentTips.push({ id: 'tip_d_hot_alert', category: 'alerts', title: '⚠️ ОПАСНОСТЬ ПЕРЕГРЕВА', text: 'Критическая жара! Признаки перегрева: горячая кожа, вялость, капризность. Срочно в тень или кондиционированное помещение, дать воды.', priority: 'danger', icon: '⚠️' });
  } else if (effTemp < -15) {
    parentTips.push({ id: 'tip_d_cold_alert', category: 'alerts', title: '❄️ ОПАСНОСТЬ ПЕРЕОХЛАЖДЕНИЯ', text: 'Сильный мороз! Признаки: бледность, холодные руки/ноги, дрожь. Срочно в тепло, согреть ладонями, дать тёплое питье.', priority: 'danger', icon: '❄️' });
  }
  if (isWindy) {
    parentTips.push({ id: 'tip_d_wind', category: 'alerts', title: '💨 ПРЕДУПРЕЖДЕНИЕ: Сильный ветер', text: 'Ветер выдувает тепло в разы быстрее. Найти укрытие (деревья, стены), защитить шею и лицо, надеть непродуваемую куртку.', priority: 'warning', icon: '💨' });
  }
  if (weather.humidity > 80 && effTemp < 10) {
    parentTips.push({ id: 'tip_d_hum', category: 'alerts', title: '🌫️ ПРЕДУПРЕЖДЕНИЕ: Сырость / Туман', text: 'Высокая влажность усиливает ощущение холода на 5-10 градусов. Повышен риск переохлаждения, держите ребёнка ближе.', priority: 'warning', icon: '🌫️' });
  }

  // Category E: Age-Specific
  if (ageGroup === '0-3m') {
    parentTips.push({ id: 'tip_e_newborn', category: 'age', title: 'Новорождённые (0-3 мес)', text: 'Терморегуляция незрелая — не могут эффективно сохранять тепло. Проверяйте шею каждые 15 минут. В коляске всегда на 1 слой больше.', priority: 'danger', icon: '👶' });
  } else if (ageGroup === '3-12m') {
    parentTips.push({ id: 'tip_e_infant', category: 'age', title: 'Младенцы (3-12 мес)', text: 'Малыш начинает ползать/сидеть — больше движений = больше тепла. При активности одевайте на 1 слой меньше взрослого.', priority: 'warning', icon: '🧸' });
  } else if (ageGroup === '1-3y') {
    parentTips.push({ id: 'tip_e_toddler', category: 'age', title: 'Ясельный возраст (1-3 года)', text: 'Бегает 90% времени. Не одевайте слишком тепло — вспотеет и мгновенно замёрзнет. Шапка-шлем и варежки-краги идеальны (не спадают).', priority: 'warning', icon: '🏃' });
  } else if (ageGroup === '3-7y') {
    parentTips.push({ id: 'tip_e_preschool', category: 'age', title: 'Дошкольники (3-7 лет)', text: 'Может сам снимать/надевать одежду. Объясняйте ЗАЧЕМ нужна шапка (не просто "надень"), давайте выбор. Хвалите за самостоятельность.', priority: 'info', icon: '🎒' });
  } else if (ageGroup === '7-12y') {
    parentTips.push({ id: 'tip_e_school', category: 'age', title: 'Школьники (7-12 лет)', text: 'Одевается сам — уважайте его выбор, но напоминайте о последствиях. Учитывайте, что тяжёлый рюкзак даёт дополнительную нагрузку и тепло.', priority: 'info', icon: '🏫' });
  }

  // Category F: Practical Tips
  parentTips.push({ id: 'tip_f_practical', category: 'practical', title: 'Практический совет (💡)', text: 'ОДЕЖДА: "Капустный" принцип (слоями) работает всегда! Мембрана дышит и защищает. ОБУВЬ: берите запас +1см к ноге для воздушной прослойки и кровообращения.', priority: 'info', icon: '💡' });

  // Sort parent tips by priority: danger > warning > info
  parentTips.sort((a, b) => {
    const pWeight = { danger: 1, warning: 2, info: 3 };
    return pWeight[a.priority] - pWeight[b.priority];
  });

  return {
    summary: `Для температуры ${weather.temp}°C (ощущается как ${effTemp}°C с учетом ветра, влажности и активности) рекомендуется ${
      effTemp < 10 ? 'многослойная теплая одежда' : 'легкая комфортная одежда'
    }.`,
    base,
    middle,
    outer,
    shoes,
    accessories,
    specialAdvice,
    parentTips
  };
}