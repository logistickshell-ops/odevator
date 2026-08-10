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

// --- НОВАЯ СИСТЕМА СЛОЕВ ---
export type ClothingLayer = 
  | 'outerwear'    // Верхняя одежда
  | 'upper_layer'  // Средний слой (худи, свитер)
  | 'lower_layer'  // Низ (штаны, юбка)
  | 'underwear'    // Белье (футболка, боди)
  | 'headwear'     // Головной убор
  | 'shoes'        // Обувь
  | 'accessories'; // Аксессуары

export interface ClothingItem {
  id: string;
  name: string;
  layer: ClothingLayer;
  description: string;
  emoji: string;
  tips?: string;
}

export interface RecommendedOutfit {
  summary: string;
  specialAdvice: string[];
  parentTips: ParentTip[];
  
  // ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ ДЛЯ UI
  layers: Record<ClothingLayer, ClothingItem[]>;
  
  // Устаревшие поля для совместимости (не использовать в новом коде!)
  base: ClothingItem[];
  middle: ClothingItem[];
  outer: ClothingItem[];
  shoes: ClothingItem[];
  accessories: ClothingItem[];
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
