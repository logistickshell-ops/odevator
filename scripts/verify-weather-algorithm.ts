import assert from 'node:assert/strict';
import { calculateRecommendationTemp, generateOutfit } from '../src/utils/weatherEngine';
import { formatClothingHeading } from '../src/utils/childProfile';
import type {
  ActivityLevel,
  AgeGroup,
  ChildGender,
  ColdSensitivity,
  WeatherData,
  WeatherPeriodType,
} from '../src/types';

type Scenario = {
  name: string;
  weather: WeatherData;
  gender: ChildGender;
  activity: ActivityLevel;
  sensitivity: ColdSensitivity;
  age: AgeGroup;
  period: WeatherPeriodType;
  expectedRecommendationTemp: number;
  includes: string[];
  excludes?: string[];
};

const weather = (
  overrides: Pick<WeatherData, 'temp' | 'feelsLike'> & Partial<Omit<WeatherData, 'temp' | 'feelsLike'>>,
): WeatherData => {
  const { temp, feelsLike, ...rest } = overrides;

  return {
    temp,
    feelsLike,
    windSpeed: 5,
    humidity: 50,
    precipProb: 0,
    weatherCode: 0,
    description: 'Ясно',
    icon: 'Sun',
    isRainy: false,
    isSnowy: false,
    isWindy: false,
    ...rest,
  };
};

const scenarios: Scenario[] = [
  {
    name: 'Младенец в сильный мороз',
    weather: weather({ temp: -18, feelsLike: -19, windSpeed: 12, humidity: 75, isSnowy: true, description: 'Снегопад', icon: 'Snowflake', weatherCode: 71 }),
    gender: 'girl',
    activity: 'quiet',
    sensitivity: 'sensitive',
    age: '0-3m',
    period: 'morning',
    expectedRecommendationTemp: -26,
    includes: ['Термобельё (лонгслив + штаны)', 'Флисовая кофта', 'Зимний комбинезон', 'Утеплённые сапоги', 'Варежки', 'Шарф-труба'],
  },
  {
    name: 'Подросток в жару',
    weather: weather({ temp: 29, feelsLike: 30, windSpeed: 6, humidity: 45, description: 'Ясно', icon: 'Sun' }),
    gender: 'boy',
    activity: 'active',
    sensitivity: 'normal',
    age: '12-16y',
    period: 'day',
    expectedRecommendationTemp: 32,
    includes: ['Лёгкие шорты', 'Футболка с коротким рукавом', 'Панама', 'Сандалии', 'Солнечные очки'],
  },
  {
    name: 'Дошкольник в прохладный дождь',
    weather: weather({ temp: 9, feelsLike: 7, windSpeed: 14, humidity: 88, precipProb: 75, weatherCode: 61, description: 'Дождь', icon: 'CloudRain', isRainy: true, isWindy: true }),
    gender: 'girl',
    activity: 'normal',
    sensitivity: 'normal',
    age: '3-7y',
    period: 'evening',
    expectedRecommendationTemp: 7,
    includes: ['Мембранный дождевик', 'Резиновые сапоги', 'Тонкая шапка', 'Перчатки', 'Зонт'],
  },
  {
    name: 'Подросток в арктический мороз',
    weather: weather({ temp: -19, feelsLike: -20, windSpeed: 9, humidity: 60, isSnowy: true, weatherCode: 71, description: 'Снегопад', icon: 'Snowflake' }),
    gender: 'girl',
    activity: 'normal',
    sensitivity: 'normal',
    age: '12-16y',
    period: 'night',
    expectedRecommendationTemp: -20,
    includes: ['Тёплая зимняя куртка', 'Тёплая шапка-бини', 'Утеплённые перчатки', 'Шарф-труба'],
    excludes: ['Зимний комбинезон', 'Варежки'],
  },
];

for (const scenario of scenarios) {
  const recommendationTemp = calculateRecommendationTemp(
    scenario.weather,
    scenario.activity,
    scenario.sensitivity,
    scenario.age,
  );

  assert.equal(
    recommendationTemp,
    scenario.expectedRecommendationTemp,
    `${scenario.name}: изменилась расчётная температура профиля`,
  );

  const outfit = generateOutfit(
    scenario.gender,
    scenario.weather,
    scenario.activity,
    scenario.sensitivity,
    scenario.age,
    scenario.period,
  );
  const names = [
    ...outfit.underwear,
    ...outfit.lower,
    ...outfit.upper,
    ...outfit.outer,
    ...outfit.headwear,
    ...outfit.shoes,
    ...outfit.accessories,
  ].map((item) => item.name);

  for (const itemName of scenario.includes) {
    assert.ok(names.includes(itemName), `${scenario.name}: не найдена вещь «${itemName}»`);
  }

  for (const itemName of scenario.excludes ?? []) {
    assert.ok(!names.includes(itemName), `${scenario.name}: лишняя вещь «${itemName}»`);
  }

  assert.ok(outfit.parentTips.length > 0, `${scenario.name}: не сформированы подсказки`);
}

const headingCases = [
  { name: 'Маша', gender: 'girl' as const, expected: 'Одежда для Маши' },
  { name: 'Мария', gender: 'girl' as const, expected: 'Одежда для Марии' },
  { name: 'Илья', gender: 'boy' as const, expected: 'Одежда для Ильи' },
  { name: 'Алексей', gender: 'boy' as const, expected: 'Одежда для Алексея' },
];

for (const headingCase of headingCases) {
  assert.equal(
    formatClothingHeading(headingCase.name, headingCase.gender),
    headingCase.expected,
    `Неверное склонение имени «${headingCase.name}»`,
  );
}

console.log(`Weather algorithm checks passed: ${scenarios.length} scenarios; name headings: ${headingCases.length}`);
