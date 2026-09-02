import assert from 'node:assert/strict';
import { calculateRecommendationTemp, generateOutfit, zoneFromTemp } from '../src/utils/weatherEngine';
import { formatClothingHeading } from '../src/utils/childProfile';
import type { ActivityLevel, AgeGroup, ChildGender, ColdSensitivity, WeatherData, WeatherPeriodType } from '../src/types';

const weather = (overrides: Partial<WeatherData> = {}): WeatherData => ({
  temp: 10, feelsLike: 10, windSpeed: 5, humidity: 50, precipProb: 0,
  weatherCode: 0, description: 'Ясно', icon: 'Sun', isRainy: false, isSnowy: false, isWindy: false,
  ...overrides,
});

const outfit = (w: WeatherData, age: AgeGroup = '1-3y', activity: ActivityLevel = 'normal', sensitivity: ColdSensitivity = 'normal', period: WeatherPeriodType = 'day') =>
  generateOutfit('girl' as ChildGender, w, activity, sensitivity, age, period);

const zones: Array<[number, string, string]> = [
  [-20, 'Термобельё (лонгслив + штаны)', 'Зимний комбинезон'],
  [-10, 'Термобельё (лонгслив + штаны)', 'Пуховик'],
  [-2, 'Термобельё (лонгслив + штаны)', 'Пуховик'],
  [5, 'Хлопковая майка и трусики', 'Утеплённая куртка'],
  [10, 'Хлопковая майка и трусики', 'Ветровка'],
  [16, 'Хлопковая майка и трусики', ''],
  [22, 'Хлопковая майка и трусики', ''],
  [28, 'Хлопковая майка и трусики', ''],
];
for (const [temp, underwear, outer] of zones) {
  const result = outfit(weather({ temp, feelsLike: temp }), '3-7y');
  assert.equal(result.underwear[0].name, underwear, `underwear boundary at ${temp}`);
  if (outer) assert.equal(result.outer[0]?.name, outer, `outer boundary at ${temp}`);
}
assert.equal(outfit(weather({ temp: 16, feelsLike: 16 }), '3-7y').upper[0]?.name, 'Кардиган');

const rain = outfit(weather({ temp: 12, feelsLike: 12, isRainy: true, weatherCode: 61, description: 'Дождь', icon: 'CloudRain' }));
assert.equal(rain.outer[0]?.name, 'Мембранный дождевик');
assert.equal(rain.shoes[0]?.name, 'Резиновые сапоги');
assert.ok(rain.accessories.some((item) => item.name === 'Зонт'));

const snow = outfit(weather({ temp: -3, feelsLike: -3, isSnowy: true, weatherCode: 71, description: 'Снегопад', icon: 'Snowflake' }));
assert.ok(snow.accessories.some((item) => item.name === 'Варежки'));

const wind = outfit(weather({ temp: 16, feelsLike: 16, windSpeed: 18, isWindy: true }));
assert.ok(wind.accessories.some((item) => item.name === 'Шарф-труба'));
assert.ok(wind.parentTips.some((tip) => tip.id === 'tip-16'));

assert.equal(calculateRecommendationTemp(weather({ feelsLike: 10 }), 'active', 'resistant', '7-12y'), 14);
assert.equal(calculateRecommendationTemp(weather({ feelsLike: 10 }), 'quiet', 'sensitive', '0-3m'), 3);
assert.equal(calculateRecommendationTemp(weather({ feelsLike: 10 }), 'normal', 'normal', '12-16y'), 10);
assert.equal(zoneFromTemp(18), 'mild');
assert.equal(zoneFromTemp(19), 'warm');
assert.equal(outfit(weather({ temp: 19, feelsLike: 19 }), '1-3y').upper[0]?.id, 'up-cardigan');
assert.equal(outfit(weather({ temp: 15, feelsLike: 15 }), '3-7y', 'active').upper[0]?.id, 'up-vest');

for (const period of ['morning', 'day', 'evening', 'night'] as WeatherPeriodType[]) {
  assert.ok(outfit(weather({ temp: 10, feelsLike: 10 }), '12-16y', 'active', 'normal', period).specialAdvice.length >= 1);
}

const headingCases: Array<[string, ChildGender, string]> = [
  ['Маша', 'girl', 'Одежда для Маши'],
  ['  ', 'girl', 'Одежда для ребёнка'],
  ['Иван', 'boy', 'Одежда для Ивана'],
  ['  ', 'boy', 'Одежда для ребёнка'],
];
for (const [name, gender, expected] of headingCases) assert.equal(formatClothingHeading(name, gender), expected);

console.log(`Weather algorithm checks passed: ${zones.length} boundaries + rain/snow/wind + profile/period cases; name headings: ${headingCases.length}`);
