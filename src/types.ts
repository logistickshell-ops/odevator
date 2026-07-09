export type WeatherPeriodType = 'morning' | 'day' | 'evening' | 'night';

export interface WeatherData {
  temp: number;
  feelsLike: number;
  windSpeed: number; // in km/h or m/s
  humidity: number; // in %
  precipProb: number; // in %
  weatherCode: number; // WMO code
  description: string;
  icon: string;
  isRainy: boolean;
  isSnowy: boolean;
  isWindy: boolean;
}

export interface DayForecast {
  date: string; // YYYY-MM-DD
  formattedDate: string; // e.g., "Сегодня, 12 Октября"
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

export type ParentTipCategory = 'safety' | 'time' | 'essentials' | 'alerts' | 'age' | 'practical';
export type ParentTipPriority = 'danger' | 'warning' | 'info';

export interface ParentTip {
  id: string;
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
  layerIndex: number; // 1: base, 2: middle, 3: outer
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
