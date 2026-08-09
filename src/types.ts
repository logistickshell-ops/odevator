export type WeatherPeriodType = 'morning' | 'day' | 'evening' | 'night';

export interface WeatherData {
  temp: number;
  feelsLike: number;
  windSpeed: number;
  humidity: number;
  precipProb: number;
  weatherCode: number;
  description: string;
  icon: string;
  isRainy: boolean;
  isSnowy: boolean;
  isWindy: boolean;
}

export interface DayForecast {
  date: string;
  formattedDate: string;
  periods: {
    morning: WeatherData;
    day: WeatherData;
    evening: WeatherData;
    night: WeatherData;
  };
}

export interface CityData {
  name: string;
  country: string;
  region?: string;
  lat: number;
  lon: number;
}

export type ActivityLevel = 'quiet' | 'normal' | 'active';
export type ColdSensitivity = 'sensitive' | 'normal' | 'resistant';
export type ChildGender = 'girl' | 'boy';
export type AgeGroup = '0-3m' | '3-12m' | '1-3y' | '3-7y' | '7-12y';

export type ParentTipCategory = 'safety' | 'time' | 'essentials' | 'alerts' | 'age' | 'practical' | 'health' | 'weather' | 'clothing' | 'general';
export type ParentTipPriority = 'danger' | 'warning' | 'info';

// ИСПРАВЛЕНО: id теперь string | number для совместимости с Tip из tips.ts
export interface ParentTip {
  id: string | number;
  category: ParentTipCategory;
  title: string;
  text: string;
  priority: ParentTipPriority;
  icon: string;
}

export interface ClothingItem {
  id: string;
  name: string;
  category: 'base' | 'middle' | 'outer' | 'shoes' | 'accessory';
  description: string;
  color: string;
  emoji: string;
  layerIndex: number;
  tips?: string;
}

export interface RecommendedOutfit {
  summary: string;
  base: ClothingItem[];
  middle: ClothingItem[];
  outer: ClothingItem[];
  shoes: ClothingItem[];
  accessories: ClothingItem[];
  specialAdvice: string[];
  parentTips: ParentTip[];
}

// НОВЫЙ ЭКСПОРТ: нужен для ChildFigure
export interface LayerVisibility {
  showOuter: boolean;
  showMiddle: boolean;
}
