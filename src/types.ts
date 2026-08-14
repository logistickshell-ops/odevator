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
export type AgeGroup = '0-3m' | '3-12m' | '1-3y' | '3-7y' | '7-12y' | '12-16y';

export interface ChildProfile {
  id: string;
  name: string;
  gender: ChildGender;
  ageGroup: AgeGroup;
  activityLevel: ActivityLevel;
  coldSensitivity: ColdSensitivity;
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

/** 7 слоёв одеватора */
export type ClothingCategory =
  | 'underwear'
  | 'lower'
  | 'upper'
  | 'outer'
  | 'headwear'
  | 'shoes'
  | 'accessory';

// Алиас для совместимости с AvatarVisualizer
export type LayerId = ClothingCategory;
export type LayerVisibility = Record<LayerId, boolean>;

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  description: string;
  color: string;
  emoji: string;
  layerIndex: number;
  tips?: string;
}

// ИСПРАВЛЕННЫЙ ИНТЕРФЕЙС: поддерживает и старую структуру (для UI), и новую (для Engine)
export interface RecommendedOutfit {
  summary: string;
  
  // Прямые поля для AvatarVisualizer (восстановленная версия)
  underwear: ClothingItem[];
  lower: ClothingItem[];
  upper: ClothingItem[];
  outer: ClothingItem[];
  headwear: ClothingItem[];
  shoes: ClothingItem[];
  accessories: ClothingItem[]; // Обрати внимание: accessories (множественное число)
  
  specialAdvice: string[];
  parentTips: ParentTip[];
  
  // Опциональное поле layers для совместимости с weatherEngine
  layers?: {
    underwear: ClothingItem[];
    lower_layer: ClothingItem[];
    upper_layer: ClothingItem[];
    outerwear: ClothingItem[];
    headwear: ClothingItem[];
    shoes: ClothingItem[];
    accessories: ClothingItem[];
  };
}

export const LAYER_ORDER: LayerId[] = ['outer', 'upper', 'lower', 'underwear', 'headwear', 'shoes', 'accessory'];

export const LAYER_LABELS: Record<LayerId, string> = {
  underwear: 'Нательное бельё',
  lower: 'Нижний слой',
  upper: 'Верхний слой',
  outer: 'Верхняя одежда',
  headwear: 'Головной убор',
  shoes: 'Обувь',
  accessory: 'Аксессуары',
};
