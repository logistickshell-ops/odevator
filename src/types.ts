// src/types.ts

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

// --- НОВАЯ СИСТЕМА СЛОЕВ ---

export type ClothingLayer = 
  | 'outerwear'    // Верхняя одежда
  | 'upper_layer'  // Средний слой
  | 'lower_layer'  // Низ
  | 'underwear'    // Белье
  | 'headwear'     // Головной убор
  | 'shoes'        // Обувь
  | 'accessories'; // Аксессуары

export interface ClothingItem {
  id: string;
  name: string;
  layer: ClothingLayer;
  description: string;
  emoji: string;
  color?: string;
  tips?: string;
}

export interface RecommendedOutfit {
  summary: string;
  // Старые поля для совместимости (если где-то еще используются)
  base: ClothingItem[];
  middle: ClothingItem[];
  outer: ClothingItem[];
  shoes: ClothingItem[];
  accessories: ClothingItem[];
  
  specialAdvice: string[];
  parentTips: ParentTip[];
  
  // Новые поля для полной поддержки слоев
  items: ClothingItem[];
  layers: Record<ClothingLayer, ClothingItem[]>;
}

export interface LayerVisibility {
  underwear: boolean;
  lower: boolean;
  upper: boolean;
  outer: boolean;
  shoes: boolean;
  headwear: boolean;
  accessory: boolean;
}
