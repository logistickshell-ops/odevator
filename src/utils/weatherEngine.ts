// src/utils/weatherEngine.ts
import {
  WeatherData, ActivityLevel, ColdSensitivity, RecommendedOutfit,
  ClothingItem, AgeGroup, ParentTip, WeatherPeriodType, ClothingLayer
} from '../types';

export function interpretWeatherCode(code: number): { description: string; icon: string; isRain: boolean; isSnow: boolean } {
  if (code === 0) return { description: 'Ясно', icon: 'Sun', isRain: false, isSnow: false };
  if (code >= 1 && code <= 3) return { description: 'Переменная облачность', icon: 'CloudSun', isRain: false, isSnow: false };
  if (code === 45 || code === 48) return { description: 'Туман', icon: 'CloudFog', isRain: false, isSnow: false };
  if (code >= 51 && code <= 55) return { description: 'Морось', icon: 'CloudDrizzle', isRain: true, isSnow: false };
  if (code >= 61 && code <= 65) return { description: 'Дождь', icon: 'CloudRain', isRain: true, isSnow: false };
  if (code >= 71 && code <= 75) return { description: 'Снегопад', icon: 'Snowflake', isRain: false, isSnow: true };
  if (code >= 80 && code <= 82) return { description: 'Ливень', icon: 'CloudLightning', isRain: true, isSnow: false };
  if (code >= 95 && code <= 99) return { description: 'Гроза', icon: 'CloudLightning', isRain: true, isSnow: false };
  return { description: 'Облачно', icon: 'Cloud', isRain: false, isSnow: false };
}

export function calculateEffectiveTemp(temp: number, windSpeed: number, humidity: number, activity: ActivityLevel, sensitivity: ColdSensitivity, ageGroup: AgeGroup): number {
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

export function generateOutfit(gender: 'boy' | 'girl', weather: WeatherData, activity: ActivityLevel, sensitivity: ColdSensitivity, ageGroup: AgeGroup, selectedPeriod: WeatherPeriodType = 'day'): RecommendedOutfit {
  const effTemp = calculateEffectiveTemp(weather.temp, weather.windSpeed, weather.humidity, activity, sensitivity, ageGroup);
  
  const items: Record<ClothingLayer, ClothingItem[]> = {
    outerwear: [], upper_layer: [], lower_layer: [], underwear: [],
    headwear: [], shoes: [], accessories: []
  };

  const specialAdvice: string[] = [];
  const isRainy = weather.isRainy || weather.precipProb > 40;
  const isSnowy = weather.isSnowy;
  const isWindy = weather.windSpeed > 15;

  // Генерация по температурным зонам (сокращенно для примера - полная версия выше)
  if (effTemp <= -20) {
    items.underwear.push({ id: 'base_thermal', name: 'Термобелье', layer: 'underwear', description: 'Шерсть мериноса', emoji: '👔' });
    items.upper_layer.push({ id: 'mid_fleece', name: 'Флисовый костюм', layer: 'upper_layer', description: 'Плотный флис', emoji: '' });
    items.outerwear.push({ id: 'outer_winter', name: 'Зимний комбинезон', layer: 'outerwear', description: '300г утеплителя', emoji: '🧥' });
    items.shoes.push({ id: 'shoes_valenki', name: 'Валенки или Kuoma', layer: 'shoes', description: 'На овчине', emoji: '🥾' });
    items.headwear.push({ id: 'acc_hat', name: 'Шапка-шлем', layer: 'headwear', description: 'Зимняя', emoji: '👤' });
    items.accessories.push({ id: 'acc_mittens', name: 'Варежки', layer: 'accessories', description: 'Непромокаемые', emoji: '🧤' });
  } else if (effTemp > 20) {
    items.underwear.push({ id: 'base_summer', name: gender === 'girl' ? 'Платье / топ' : 'Футболка', layer: 'underwear', description: '100% хлопок', emoji: '' });
    items.lower_layer.push({ id: 'lower_shorts', name: 'Шорты / юбка', layer: 'lower_layer', description: 'Легкий низ', emoji: '🩳' });
    items.shoes.push({ id: 'shoes_sandals', name: 'Сандалии', layer: 'shoes', description: 'Открытая обувь', emoji: '' });
    items.headwear.push({ id: 'acc_panama', name: 'Панама', layer: 'headwear', description: 'От солнца', emoji: '👒' });
    items.accessories.push({ id: 'acc_sunglasses', name: 'Очки', layer: 'accessories', description: 'UV400', emoji: '🕶️' });
  }

  // ... (остальные температурные зоны как в полной версии выше)

  if (isRainy && effTemp > -5 && effTemp <= 20) {
    items.shoes = [{ id: 'shoes_rubber', name: 'Резиновые сапоги', layer: 'shoes', description: 'От луж', emoji: '👢', tips: 'На плотный носок' }];
  }

  const parentTips: ParentTip[] = [];
  // ... (генерация советов)

  return {
    summary: `Для ${weather.temp}°C рекомендуется многослойная одежда`,
    base: items.underwear, middle: items.upper_layer, outer: items.outerwear,
    shoes: items.shoes, accessories: items.accessories,
    specialAdvice, parentTips,
    items: Object.values(items).flat(),
    layers: items
  };
}
