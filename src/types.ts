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

// УНИВЕРСАЛЬНЫЙ TIP - совместим и с ParentTip, и с компонентом ParentTipsSection
export interface Tip {
  id: string;
  category: ParentTipCategory;
  title: string;
  text: string;
  priority?: ParentTipPriority;
  icon: string;
}

// ParentTip теперь расширяет Tip для полной совместимости
export interface ParentTip extends Tip {
  priority: ParentTipPriority;
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
  parentTips: Tip[]; // ИСПРАВЛЕНО: ParentTip[] -> Tip[]
}

// НОВЫЙ ТИП для ChildFigure
export interface LayerVisibility {
  showOuter: boolean;
  showMiddle: boolean;
}
