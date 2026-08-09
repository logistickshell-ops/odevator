// src/types.ts

/**
 * Типы временных периодов для прогноза погоды
 */
export type WeatherPeriodType = 'morning' | 'day' | 'evening' | 'night';

/**
 * Структура данных о погоде в конкретный период
 */
export interface WeatherData {
  temp: number;           // Температура (°C)
  feelsLike: number;      // Ощущаемая температура (°C)
  windSpeed: number;      // Скорость ветра (км/ч)
  humidity: number;       // Влажность (%)
  precipProb: number;     // Вероятность осадков (%)
  weatherCode: number;    // Код погоды WMO
  description: string;    // Текстовое описание (например, "Ясно")
  icon: string;           // Имя иконки Lucide
  isRainy: boolean;       // Признак дождя
  isSnowy: boolean;       // Признак снега
  isWindy: boolean;       // Признак сильного ветра
}

/**
 * Прогноз на один день с разбивкой по периодам
 */
export interface DayForecast {
  date: string;           // YYYY-MM-DD
  formattedDate: string;  // Человекочитаемая дата
  periods: {
    morning: WeatherData;
    day: WeatherData;
    evening: WeatherData;
    night: WeatherData;
  };
}

/**
 * Данные города для геолокации
 */
export interface CityData {
  name: string;
  country: string;
  region?: string;
  lat: number;
  lon: number;
}

/**
 * Уровень физической активности ребенка
 */
export type ActivityLevel = 'quiet' | 'normal' | 'active';

/**
 * Индивидуальная чувствительность к холоду
 */
export type ColdSensitivity = 'sensitive' | 'normal' | 'resistant';

/**
 * Пол ребенка (для стилизации рекомендаций)
 */
export type ChildGender = 'girl' | 'boy';

/**
 * Возрастная группа (влияет на терморегуляцию и выбор одежды)
 */
export type AgeGroup = '0-3m' | '3-12m' | '1-3y' | '3-7y' | '7-12y';

/**
 * Категории родительских советов
 */
export type ParentTipCategory = 'safety' | 'time' | 'essentials' | 'alerts' | 'age' | 'practical';

/**
 * Приоритет совета (для сортировки)
 */
export type ParentTipPriority = 'danger' | 'warning' | 'info';

/**
 * Структура родительского совета
 */
export interface ParentTip {
  id: string;
  category: ParentTipCategory;
  title: string;
  text: string;
  priority: ParentTipPriority;
  icon: string;
}

/**
 * ТИПЫ СЛОЕВ ОДЕЖДЫ (Новая структура!)
 * Используется для точного управления видимостью в SVG и UI
 */
export type ClothingLayer = 
  | 'outerwear'    // Верхняя одежда (куртки, пуховики, комбинезоны)
  | 'upper_layer'  // Средний слой (свитера, худи, жилетки, флис)
  | 'lower_layer'  // Низ (штаны, юбки, шорты, леггинсы)
  | 'underwear'    // Базовый слой (боди, футболки, колготки, термобелье)
  | 'headwear'     // Головные уборы (шапки, панамы, кепки, шлемы)
  | 'shoes'        // Обувь (сапоги, ботинки, сандалии, кроссовки)
  | 'accessories'; // Аксессуары (варежки, шарфы, зонты, очки, рюкзаки)

/**
 * Элемент гардероба
 */
export interface ClothingItem {
  id: string;
  name: string;
  layer: ClothingLayer;   // Привязка к конкретному слою
  description: string;
  emoji: string;          // Эмодзи для визуализации в списке
  color?: string;         // Опциональный цвет для карточки
  isRecommended?: boolean;// Флаг рекомендации от движка
  tips?: string;          // Подсказка по использованию предмета
}

/**
 * Результат работы движка подбора одежды
 */
export interface RecommendedOutfit {
  summary: string;              // Краткое текстовое резюме
  base: ClothingItem[];         // [DEPRECATED] Устаревшее поле, используйте layer='underwear'
  middle: ClothingItem[];       // [DEPRECATED] Устаревшее поле, используйте layer='upper_layer'
  outer: ClothingItem[];        // [DEPRECATED] Устаревшее поле, используйте layer='outerwear'
  shoes: ClothingItem[];        // [DEPRECATED] Устаревшее поле, используйте layer='shoes'
  accessories: ClothingItem[];  // [DEPRECATED] Устаревшее поле, используйте layer='accessories'
  specialAdvice: string[];      // Особые предупреждения и советы
  parentTips: ParentTip[];      // Динамические советы для родителей
}

/**
 * Объект управления видимостью слоев для ChildFigure
 * Позволяет включать/выключать каждый слой независимо
 */
export interface LayerVisibility {
  underwear: boolean;   // Видимость базового слоя
  lower: boolean;       // Видимость низа
  upper: boolean;       // Видимость среднего слоя
  outer: boolean;       // Видимость верхней одежды
  shoes: boolean;       // Видимость обуви
  headwear: boolean;    // Видимость головного убора
  accessory: boolean;   // Видимость аксессуаров
}
