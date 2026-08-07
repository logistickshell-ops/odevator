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

/** 7 слоёв одеватора */
export type ClothingCategory =
  | 'underwear'
  | 'lower'
  | 'upper'
  | 'outer'
  | 'headwear'
  | 'shoes'
  | 'accessory';

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

export interface RecommendedOutfit {
  summary: string;
  underwear: ClothingItem[];
  lower: ClothingItem[];
  upper: ClothingItem[];
  outer: ClothingItem[];
  headwear: ClothingItem[];
  shoes: ClothingItem[];
  accessories: ClothingItem[];
  specialAdvice: string[];
  parentTips: ParentTip[];
}

export type LayerId = ClothingCategory;
export type LayerVisibility = Record<LayerId, boolean>;

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
