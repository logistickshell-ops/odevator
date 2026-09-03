import { tr } from '../i18n';
import {
  ActivityLevel, AgeGroup, ChildGender, ClothingItem, ColdSensitivity,
  ParentTip, RecommendedOutfit, WeatherData, WeatherPeriodType,
} from '../types';

export const interpretWeatherCode = (code: number) => {
  const r = { description: tr("Ясно"), icon: 'Sun', isRain: false, isSnow: false };
  if (code === 0) return r;
  if (code <= 2) return { ...r, description: tr("Переменная облачность"), icon: 'CloudSun' };
  if (code === 3) return { ...r, description: tr("Пасмурно"), icon: 'Cloud' };
  if (code === 45 || code === 48) return { ...r, description: tr("Туман"), icon: 'CloudFog' };
  if (code >= 51 && code <= 57) return { ...r, description: tr("Морось"), icon: 'CloudRain', isRain: true };
  if (code >= 61 && code <= 67) return { ...r, description: tr("Дождь"), icon: 'CloudRain', isRain: true };
  if (code >= 71 && code <= 77) return { ...r, description: tr("Снегопад"), icon: 'Snowflake', isSnow: true };
  if (code >= 80 && code <= 82) return { ...r, description: tr("Ливень"), icon: 'CloudRain', isRain: true };
  if (code === 85 || code === 86) return { ...r, description: tr("Снегопад"), icon: 'Snowflake', isSnow: true };
  if (code >= 95) return { ...r, description: tr("Гроза"), icon: 'CloudLightning', isRain: true };
  return r;
};

const profileTemperatureOffset = (
  activity: ActivityLevel,
  sensitivity: ColdSensitivity,
  age: AgeGroup,
) => {
  const activityOffset = activity === 'active' ? 2 : activity === 'quiet' ? -2 : 0;
  const sensitivityOffset = sensitivity === 'sensitive' ? -2 : sensitivity === 'resistant' ? 2 : 0;
  const ageOffset = age === '0-3m' ? -3 : age === '3-12m' ? -2 : age === '1-3y' ? -1 : 0;
  return activityOffset + sensitivityOffset + ageOffset;
};

// Расчёт только физических факторов. Используется для ручной погоды, когда API не даёт apparent temperature.
export const calculateWeatherFeel = (temp: number, wind: number, humidity: number): number => {
  const windChill = wind > 10 ? Math.min((wind - 10) * 0.3, 4) : 0;
  const dampCold = temp <= 10 && humidity > 80 ? 1.5 : 0;
  const muggy = temp >= 25 && humidity > 70 ? 2 : 0;
  return Math.round((temp - windChill - dampCold + muggy) * 10) / 10;
};

export const calculateEffectiveTemp = (
  temp: number, wind: number, humidity: number,
  activity: ActivityLevel, sensitivity: ColdSensitivity, age: AgeGroup,
): number => Math.round((calculateWeatherFeel(temp, wind, humidity) + profileTemperatureOffset(activity, sensitivity, age)) * 10) / 10;

// Реальный прогноз already включает влияние температуры, ветра и влажности.
// Здесь применяются только персональные параметры ребёнка — без двойного учёта погоды.
export const calculateRecommendationTemp = (
  weather: WeatherData,
  activity: ActivityLevel,
  sensitivity: ColdSensitivity,
  age: AgeGroup,
): number => {
  const baseline = Number.isFinite(weather.feelsLike) ? weather.feelsLike : weather.temp;
  return Math.round((baseline + profileTemperatureOffset(activity, sensitivity, age)) * 10) / 10;
};

type Zone = 'arctic' | 'winter' | 'freeze' | 'chilly' | 'cool' | 'mild' | 'warm' | 'hot';
export const zoneFromTemp = (t: number): Zone =>
  t <= -15 ? 'arctic' : t <= -5 ? 'winter' : t <= 0 ? 'freeze' : t <= 7 ? 'chilly' :
  t <= 13 ? 'cool' : t <= 18 ? 'mild' : t <= 24 ? 'warm' : 'hot';

const it = (
  id: string, name: string, category: ClothingItem['category'], emoji: string,
  color: string, layerIndex: number, description: string, tips?: string,
): ClothingItem => ({ id, name, category, emoji, color, layerIndex, description, tips });

// ПУЛ ИЗ 51 ПОДСКАЗКИ ДЛЯ РОДИТЕЛЕЙ
const TIPS_POOL: ParentTip[] = [
  // БЕЗОПАСНОСТЬ (danger)
  { id: 'tip-01', category: 'safety', title: tr("Тест по загривку"), text: tr("Шея сзади тёплая и сухая — одето правильно. Влажная — перегрев, холодная — добавить слой."), priority: 'danger', icon: '💡' },
  { id: 'tip-02', category: 'safety', title: tr("Сильный холод"), text: tr("Следите за болью, онемением или белыми участками кожи. При таких признаках зайдите в тепло и согревайте ребёнка постепенно."), priority: 'danger', icon: '❄️' },
  { id: 'tip-03', category: 'safety', title: tr("Риск перегрева"), text: tr("Выберите лёгкую светлую одежду, головной убор, тень и регулярное питьё. Уменьшите время на солнце, если ребёнку жарко."), priority: 'danger', icon: '☀️' },
  { id: 'tip-04', category: 'safety', title: tr("Мокрая одежда"), text: tr("Мокрые носки, перчатки или брюки быстро снижают комфорт. Переоденьте ребёнка в сухое и сократите прогулку при необходимости."), priority: 'danger', icon: '💧' },
  { id: 'tip-05', category: 'safety', title: tr("Капюшон на ветру"), text: tr("При сильном ветре капюшон может закрыть обзор. Лучше шапка + шарф."), priority: 'danger', icon: '💨' },
  
  // ВРЕМЯ СУТОК (time)
  { id: 'tip-06', category: 'time', title: tr("Утренний запас"), text: tr("Утром часто прохладнее. Возьмите слой, который легко снять, если по прогнозу станет теплее."), priority: 'info', icon: '🌅' },
  { id: 'tip-07', category: 'time', title: tr("Вечерняя прохлада"), text: tr("К вечеру температура и видимость меняются. Положите в рюкзак дополнительный слой и светоотражатель."), priority: 'info', icon: '🌆' },
  { id: 'tip-08', category: 'time', title: tr("Жаркое время дня"), text: tr("В жару выбирайте тень, лёгкую одежду и предлагайте воду регулярно. Делайте паузы, если ребёнок устал или перегрелся."), priority: 'warning', icon: '🔥' },
  { id: 'tip-09', category: 'time', title: tr("Ночные прогулки"), text: tr("Темнее и прохладнее, чем кажется. Используйте светоотражающие элементы на одежде."), priority: 'info', icon: '🌙' },
  { id: 'tip-10', category: 'time', title: tr("После сна"), text: tr("Ребёнок только проснулся — тело ещё не разогрелось. Добавьте один слой сверх рекомендации."), priority: 'info', icon: '😴' },
  
  // ЧТО ВЗЯТЬ С СОБОЙ (essentials)
  { id: 'tip-11', category: 'essentials', title: tr("Запасные варежки"), text: tr("Дети теряют или мочат варежки. Всегда берите запасную пару в карман куртки."), priority: 'warning', icon: '🧤' },
  { id: 'tip-12', category: 'essentials', title: tr("Бутылка воды"), text: tr("Даже зимой ребёнок теряет влагу через дыхание. Предлагайте тёплый напиток из термоса."), priority: 'info', icon: '🍼' },
  { id: 'tip-13', category: 'essentials', title: tr("Солнцезащитный крем"), text: tr("SPF 30+ даже в пасмурную погоду. UV-лучи проходят сквозь облака."), priority: 'warning', icon: '🧴' },
  { id: 'tip-14', category: 'essentials', title: tr("Запасные носки"), text: tr("Один мокрый носок = холодные ноги на всю прогулку. Пакетик в рюкзак."), priority: 'info', icon: '🧦' },
  { id: 'tip-15', category: 'essentials', title: tr("Лёгкая куртка в рюкзак"), text: tr("Погода весной и осенью переменчива. Компактная ветровка спасёт при похолодании."), priority: 'info', icon: '🎒' },
  
  // ПРЕДУПРЕЖДЕНИЯ (alerts)
  { id: 'tip-16', category: 'alerts', title: tr("Сильный ветер"), text: tr("Ветровка важнее тёплой кофты: ветер выдувает воздушную прослойку."), priority: 'warning', icon: '💨' },
  { id: 'tip-17', category: 'alerts', title: tr("Сырость и прохлада"), text: tr("Влажная погода делает прохладу неприятнее. Оставьте возможность добавить сухой утепляющий слой и защиту от осадков."), priority: 'warning', icon: '💧' },
  { id: 'tip-18', category: 'alerts', title: tr("Гололёд"), text: tr("При околонулевой температуре асфальт скользкий. Обувь с нескользкой подошвой обязательна."), priority: 'warning', icon: '⚠️' },
  { id: 'tip-19', category: 'alerts', title: tr("Туман"), text: tr("Видимость снижена. Яркая одежда и светоотражатели помогут водителям заметить ребёнка."), priority: 'warning', icon: '🌫️' },
  { id: 'tip-20', category: 'alerts', title: tr("Похолодание"), text: tr("Если по прогнозу становится холоднее, заранее возьмите регулируемый верхний слой и не ждите, пока ребёнок замёрзнет."), priority: 'danger', icon: '📉' },
  
  // ВОЗРАСТНЫЕ ОСОБЕННОСТИ (age)
  { id: 'tip-21', category: 'age', title: tr("Новорождённый (0-3 мес)"), text: tr("Терморегуляция незрелая. Не может эффективно сохранять тепло. Проверяйте шею каждые 15 минут."), priority: 'danger', icon: '👶' },
  { id: 'tip-22', category: 'age', title: tr("Малыш в коляске"), text: tr("Неподвижный ребёнок мёрзнет: добавьте один слой сверх рекомендации."), priority: 'warning', icon: '🛒' },
  { id: 'tip-23', category: 'age', title: tr("Ползунок (3-12 мес)"), text: tr("Начинает ползать — больше движений = больше тепла. При активности одевайте на 1 слой меньше."), priority: 'info', icon: '🧸' },
  { id: 'tip-24', category: 'age', title: tr("Бегун (1-3 года)"), text: tr("Бегает 90% времени. Не одевайте слишком тепло — вспотеет и мгновенно замёрзнет."), priority: 'warning', icon: '🏃' },
  { id: 'tip-25', category: 'age', title: tr("Дошкольник (3-7 лет)"), text: tr("Может сам снимать/надевать одежду. Объясняйте ЗАЧЕМ нужна шапка, давайте выбор."), priority: 'info', icon: '🎒' },
  { id: 'tip-26', category: 'age', title: tr("Школьник (7-12 лет)"), text: tr("Ребёнок уже может сам выбирать слой. Договоритесь, что кофту или ветровку можно убрать в рюкзак, а не оставлять дома."), priority: 'info', icon: '🏫' },
  { id: 'tip-52', category: 'age', title: tr("Подросток (12-16 лет)"), text: tr("Подростку важны самостоятельность и комфорт. Согласуйте практичный комплект: регулируемые слои, защита от погоды и место для ветровки в рюкзаке."), priority: 'info', icon: '🎧' },
  { id: 'tip-27', category: 'age', title: tr("Коляска vs ходунки"), text: tr("Ребёнок в коляске неподвижен — ему нужно на 1 слой больше, чем бегающему сверстнику."), priority: 'warning', icon: '👶' },
  { id: 'tip-28', category: 'age', title: tr("Сон на улице"), text: tr("Спящий ребёнок не двигается — метаболизм замедляется. Добавьте плед или конверт."), priority: 'warning', icon: '💤' },
  
  // ПРАКТИЧЕСКИЕ СОВЕТЫ (practical)
  { id: 'tip-29', category: 'practical', title: tr("Правило трёх слоёв"), text: tr("Влагоотвод (термобельё) → Изоляция (флис/шерсть) → Защита (мембрана). Работает всегда."), priority: 'info', icon: '🧅' },
  { id: 'tip-30', category: 'practical', title: tr("Хлопок на морозе = опасно"), text: tr("Хлопок впитывает влагу и долго сохнет. На холоде только шерсть мериноса или синтетика."), priority: 'warning', icon: '⚠️' },
  { id: 'tip-31', category: 'practical', title: tr("Мембрана дышит"), text: tr("Обычный плащ создаст парник. Мембранная куртка отводит влагу наружу — ребёнок не вспотеет."), priority: 'info', icon: '💨' },
  { id: 'tip-32', category: 'practical', title: tr("Размер обуви с запасом"), text: tr("+1 см к длине стопы. Воздушная прослойка греет лучше любого утеплителя."), priority: 'info', icon: '👟' },
  { id: 'tip-33', category: 'practical', title: tr("Варежки теплее перчаток"), text: tr("Пальцы в варежке греют друг друга. Перчатки — только для старших детей."), priority: 'info', icon: '🧤' },
  { id: 'tip-34', category: 'practical', title: tr("Шапка-шлем идеальна"), text: tr("Не сползает, закрывает шею и лоб. Для активных детей — лучший выбор."), priority: 'info', icon: '🪖' },
  { id: 'tip-35', category: 'practical', title: tr("Снуд вместо шарфа"), text: tr("Не развязывается, не болтается, закрывает шею полностью. Безопаснее для малышей."), priority: 'info', icon: '🧣' },
  { id: 'tip-36', category: 'practical', title: tr("Резиновые сапоги с носком"), text: tr("Резина не греет. Надевайте сапоги на толстый шерстяной носок, иначе ноги замёрзнут."), priority: 'warning', icon: '🥾' },
  { id: 'tip-37', category: 'practical', title: tr("Светлая одежда в жару"), text: tr("Белый и пастельные тона отражают солнце. Чёрный нагревается на 10-15° сильнее."), priority: 'info', icon: '👕' },
  { id: 'tip-38', category: 'practical', title: tr("Панама с полями"), text: tr("Широкие поля защищают лицо, уши и шею от солнца. Кепка закрывает только лоб."), priority: 'info', icon: '👒' },
  { id: 'tip-39', category: 'practical', title: tr("Солнцезащитные очки"), text: tr("Детская сетчатка вдвое чувствительнее взрослой. Линзы с UV400 обязательны."), priority: 'warning', icon: '🕶️' },
  { id: 'tip-40', category: 'practical', title: tr("Проверка перед выходом"), text: tr("Присядьте на корточки и посмотрите на ребёнка снизу: не задралась ли куртка, не сползла ли шапка."), priority: 'info', icon: '🔍' },
  
  // АКТИВНОСТЬ (activity)
  { id: 'tip-41', category: 'practical', title: tr("Активная прогулка"), text: tr("Ребёнок будет бегать: снимите верхний слой до выхода со двора, чтобы не вспотел."), priority: 'info', icon: '⚽' },
  { id: 'tip-42', category: 'practical', title: tr("Спокойная прогулка"), text: tr("Тело греет меньше при низкой активности. Добавьте изоляции (флисовый слой)."), priority: 'info', icon: '📚' },
  { id: 'tip-43', category: 'practical', title: tr("Площадка vs коляска"), text: tr("На площадке ребёнок двигается — одевайте на 1 слой легче, чем в коляску."), priority: 'info', icon: '🛝' },
  { id: 'tip-44', category: 'practical', title: tr("Санки и снегокаты"), text: tr("Неподвижное катание = быстрое охлаждение. Добавьте windstopper-слой поверх одежды."), priority: 'warning', icon: '🛷' },
  { id: 'tip-45', category: 'practical', title: tr("Велосипед/самокат"), text: tr("Встречный ветер усиливает охлаждение. Непродуваемая куртка обязательна."), priority: 'warning', icon: '🚲' },
  
  // ДОПОЛНИТЕЛЬНЫЕ (bonus)
  { id: 'tip-46', category: 'practical', title: tr("Многослойность работает всегда"), text: tr("Лучше 3 тонких слоя, чем 1 толстый. Можно регулировать температуру, снимая/надевая."), priority: 'info', icon: '🧅' },
  { id: 'tip-47', category: 'practical', title: tr("Проверяйте руки и ноги"), text: tr("Тёплые, розовые = хорошо. Бледные, холодные = добавить слой. Горячие, влажные = снять слой."), priority: 'info', icon: '✋' },
  { id: 'tip-48', category: 'practical', title: tr("Лицо на морозе"), text: tr("Нос белый/синий — признак обморожения. Щёки розовые — норма. Уши плотно закрыты шапкой."), priority: 'warning', icon: '😊' },
  { id: 'tip-49', category: 'practical', title: tr("Обувь не тесная"), text: tr("Тесная обувь нарушает кровообращение — ноги мёрзнут быстрее. Палец должен проходить за пяткой."), priority: 'warning', icon: '👢' },
  { id: 'tip-50', category: 'practical', title: tr("Доверяйте ребёнку"), text: tr("Если ребёнок говорит \"мне жарко/холодно\" — прислушайтесь. Дети чувствуют температуру точнее взрослых."), priority: 'info', icon: '💬' },
  
  // НОВАЯ ПОДСКАЗКА ПРО БАХИЛЫ
  { id: 'tip-51', category: 'essentials', title: tr("Силиконовые бахилы"), text: tr("Лёгкие силиконовые бахилы спасут в дождь и слякоть. Надеваются поверх любой обуви, занимают мало места в кармане."), priority: 'info', icon: '🧦' },
];

export const generateOutfit = (
  gender: ChildGender, w: WeatherData, activity: ActivityLevel,
  sensitivity: ColdSensitivity, age: AgeGroup,
  period: WeatherPeriodType = 'day',
): RecommendedOutfit => {
  const girl = gender === 'girl';
  const isTeen = age === '12-16y';
  const eff = calculateRecommendationTemp(w, activity, sensitivity, age);
  const zone = zoneFromTemp(eff);
  const cold = ['arctic', 'winter', 'freeze'].includes(zone);
  const coolish = cold || ['chilly', 'cool'].includes(zone);

  const underwear = [
    cold
      ? it('uw-thermo', tr("Термобельё (лонгслив + штаны)"), 'underwear', '🩱', '#E8E8F0', 1,
        tr("Отводит влагу и держит тепло. Влажное тело остывает в 25 раз быстрее сухого."),
        tr("Берите шерсть мериноса или синтетику — хлопок на морозе опасен."))
      : it('uw-cotton', tr("Хлопковая майка и трусики"), 'underwear', '🩱', '#FFFFFF', 1,
        tr("Дышащая база из хлопка — комфорт при любой активности.")),
  ];

  const lower: ClothingItem[] = [];
  if (zone === 'hot') {
    lower.push(isTeen
      ? it('lw-teen-shorts', tr("Лёгкие шорты"), 'lower', '🩳', '#7FB069', 2, tr("Свободный крой для жаркой и активной прогулки."))
      : girl
        ? it('lw-skirt', tr("Лёгкая юбка"), 'lower', '👗', '#B9A7E6', 2, tr("Свободный крой — тело дышит в жару."))
        : it('lw-shorts', tr("Шорты"), 'lower', '🩳', '#7FB069', 2, tr("Лёгкие шорты для жаркой прогулки.")));
    lower.push(it('lw-tee-s', tr("Футболка с коротким рукавом"), 'lower', '👕', girl ? '#FF8FB1' : '#4ECDC4', 2, tr("Светлая футболка из хлопка.")));
  } else if (zone === 'warm' || zone === 'mild') {
    lower.push(isTeen
      ? it('lw-teen-pants', tr("Лёгкие брюки"), 'lower', '👖', '#5A6B7F', 2, tr("Дышащие брюки, которые удобно сочетать с регулируемым верхним слоем."))
      : girl
        ? it('lw-skirt-m', tr("Юбка с легинсами"), 'lower', '👗', '#B9A7E6', 2, tr("Юбка + тонкие легинсы — красиво и тепло."))
        : it('lw-pants-m', tr("Лёгкие брюки"), 'lower', '👖', '#5A6B7F', 2, tr("Дышащие брюки на каждый день.")));
    lower.push(it('lw-tee', tr("Футболка"), 'lower', '👕', girl ? '#FF8FB1' : '#4ECDC4', 2, tr("Хлопковая футболка — базовый нижний слой.")));
  } else {
    lower.push(it('lw-pants-c', isTeen ? tr("Утеплённые брюки") : girl ? tr("Утеплённые легинсы") : tr("Тёплые брюки"), 'lower', '👖', '#5A6B7F', 2, tr("Плотный нижний слой на ноги.")));
    lower.push(it('lw-longsleeve', tr("Лонгслив"), 'lower', '👕', girl ? '#FF8FB1' : '#4ECDC4', 2, tr("Футболка с длинным рукавом — второй после белья слой.")));
  }

  const upper: ClothingItem[] = [];
  if (zone === 'arctic' || zone === 'winter') upper.push(it('up-fleece', tr("Флисовая кофта"), 'upper', '🧶', '#B79CED', 3, tr("Флис держит воздушную прослойку — главный утеплитель многослойности.")));
  else if (zone === 'freeze' || zone === 'chilly') upper.push(it('up-sweater', isTeen ? tr("Свитшот") : girl ? tr("Свитер") : tr("Худи"), 'upper', '🧥', '#B79CED', 3, tr("Регулируемый утепляющий слой для прохладной погоды.")));
  else if (zone === 'cool') upper.push(it('up-hoodie', tr("Толстовка"), 'upper', '🧥', '#B79CED', 3, tr("Лёгкий утепляющий слой для прохладной погоды. Манжеты удерживают тепло.")));
  else if (zone === 'mild' && activity === 'active') upper.push(it('up-vest', tr("Утеплённый жилет"), 'upper', '🦺', '#F4A261', 3, tr("Тёплый корпус и свободные руки для активной прогулки.")));
  else if (zone === 'mild') upper.push(it('up-cardigan', isTeen ? tr("Лёгкий свитшот") : girl ? tr("Кардиган") : tr("Лёгкое худи"), 'upper', '🧥', '#B79CED', 3, tr("На случай вечернего похолодания — легко снять. Мягкая окантовка и две пуговицы.")));

  const outer: ClothingItem[] = [];
  if (w.isRainy && !cold) outer.push(it('ot-rain', tr("Мембранный дождевик"), 'outer', '☔', '#FFD166', 4, tr("Не промокает и дышит. Обычный плащ создаст парник."), tr("Ищите проклеенные швы.")));
  else if (zone === 'arctic') outer.push(isTeen
    ? it('ot-teen-winter', tr("Тёплая зимняя куртка"), 'outer', '🧥', girl ? '#F472B6' : '#3E63DD', 4, tr("Тёплая куртка с непродуваемым верхом и регулируемыми слоями для подростка."))
    : it('ot-combi', tr("Зимний комбинезон"), 'outer', '🧥', girl ? '#F472B6' : '#3E63DD', 4, tr("Комбинезон не оставляет щелей на спине — для маленьких детей и сильных морозов.")));
  else if (zone === 'winter' || zone === 'freeze') outer.push(it('ot-puffer', tr("Пуховик"), 'outer', '🧥', girl ? '#F472B6' : '#3E63DD', 4, tr("Пух/синтетический утеплитель 200+ г/м² для стабильного минуса.")));
  else if (zone === 'chilly') outer.push(it('ot-jacket', tr("Утеплённая куртка"), 'outer', '🧥', girl ? '#F472B6' : '#3E63DD', 4, tr("Демисезонная куртка на лёгком утеплителе.")));
  else if (zone === 'cool') outer.push(it('ot-wind', tr("Ветровка"), 'outer', '🧥', girl ? '#F472B6' : '#3E63DD', 4, tr("Блокирует ветер — главный вор тепла при +10…+15.")));

  const headwear: ClothingItem[] = [];
  if (zone === 'hot') headwear.push(it('hw-panama', tr("Панама"), 'headwear', '👒', '#FFD166', 0, tr("Широкие поля защищают лицо и шею от солнца."), tr("Светлый цвет отражает солнце.")));
  else if (zone === 'warm') headwear.push(it('hw-cap', girl ? tr("Панамка") : tr("Кепка"), 'headwear', '🧢', girl ? '#FFD166' : '#2A9D8F', 0, tr("Лёгкий головной убор от солнца.")));
  else if (zone === 'mild') headwear.push(it('hw-bucket', tr("Панама bucket"), 'headwear', '🧢', '#E9C46A', 0, tr("Мягкие поля защищают от ветра и солнца.")));
  else if (zone === 'cool' || zone === 'chilly') headwear.push(it('hw-beanie-l', tr("Тонкая шапка"), 'headwear', '🧢', '#2A9D8F', 0, tr("Однослойная шапка: голова потеет меньше, но не мёрзнет.")));
  else if (age === '0-3m' || age === '3-12m') headwear.push(it('hw-helmet', tr("Шапка-шлем"), 'headwear', '🧸', '#F5B942', 0, tr("Закрывает уши и шею малыша без лишних завязок.")));
  else if (zone === 'arctic' || zone === 'winter') headwear.push(it('hw-earflap', tr("Шапка-ушанка"), 'headwear', '🧶', '#C084FC', 0, tr("Ушанка защищает уши и затылок от сильного холода.")));
  else headwear.push(it('hw-beanie-w', isTeen ? tr("Тёплая шапка-бини") : tr("Шапка с помпоном"), 'headwear', '🧶', girl ? '#F472B6' : '#2A9D8F', 0, isTeen ? tr("Тёплая двухслойная шапка, закрывающая уши.") : tr("Двухслойная шапка с подкладом для холодной погоды.")));

  const shoes: ClothingItem[] = [];
  if (w.isRainy && !cold) shoes.push(it('sh-rain', tr("Резиновые сапоги"), 'shoes', '🥾', '#FFD166', 0, tr("Толстая подошва изолирует от холодной земли и луж."), tr("Надевайте с тёплым носком.")));
  else if (zone === 'hot') shoes.push(it('sh-sandals', tr("Сандалии"), 'shoes', '👡', '#FFFFFF', 0, tr("Открытая обувь с жёстким задником.")));
  else if (zone === 'warm' || zone === 'mild') shoes.push(it('sh-sneak', tr("Кроссовки"), 'shoes', '👟', '#FFFFFF', 0, tr("Дышащие кроссовки для сухой погоды. Контрастная подошва и мягкая фиксация.")));
  else if (zone === 'cool' || zone === 'chilly') shoes.push(it('sh-boots', tr("Ботинки"), 'shoes', '🥾', '#8B5E3C', 0, tr("Закрытые ботинки на плотной подошве.")));
  else shoes.push(it('sh-winter', tr("Утеплённые сапоги"), 'shoes', '🥾', '#8B5E3C', 0, tr("Мембрана или шерсть внутри, размер с запасом под носок.")));

  const accessories: ClothingItem[] = [];
  if (cold) {
    accessories.push(it('ac-mitt', isTeen ? tr("Утеплённые перчатки") : tr("Варежки"), 'accessory', '🧤', girl ? '#FF6B6B' : '#5B8DEF', 0, isTeen ? tr("Утеплённые перчатки защищают руки и сохраняют свободу движений.") : tr("Варежки теплее перчаток: пальцы греют друг друга.")));
    accessories.push(it('ac-scarf', tr("Шарф-труба"), 'accessory', '🧣', '#4ECDC4', 0, tr("Закрывает шею и ворот, не развязывается на ветру.")));
  } else if (coolish) {
    accessories.push(it('ac-gloves', tr("Перчатки"), 'accessory', '🧤', '#5B8DEF', 0, tr("Лёгкие перчатки для околонулевой погоды.")));
  }
  if (w.isWindy && !cold) accessories.push(it('ac-scarf-w', tr("Шарф-труба"), 'accessory', '🧣', '#4ECDC4', 0, tr("При ветре шея теряет тепло первой.")));
  if (zone === 'hot') accessories.push(it('ac-sun', tr("Солнечные очки"), 'accessory', '🕶️', '#0F172A', 0, tr("Детские линзы с UV400 — сетчатка ребёнка вдвое чувствительнее.")));
  if (w.isRainy) accessories.push(it('ac-umb', tr("Зонт"), 'accessory', '☂️', '#EF4444', 0, tr("Яркий зонт: ребёнка видно издалека.")));

  // ДЕТЕРМИНИРОВАННЫЕ ПОДСКАЗКИ: одинаковые условия всегда дают одинаковый порядок карточек.
  // Порядок: риск → действие по погоде → время суток → возраст/активность → практический шаг.
  const tipIds: string[] = ['tip-01']; // Универсальная проверка комфорта: загривок.
  const addTip = (id: string) => {
    if (!tipIds.includes(id)) tipIds.push(id);
  };

  if (eff <= -10) addTip('tip-02');
  if (eff >= 27) addTip('tip-03');
  if (w.windSpeed >= 15) addTip('tip-16');
  if (w.humidity >= 80 && eff <= 10) addTip('tip-17');
  if (w.isRainy || w.precipProb >= 50) {
    addTip('tip-04');
    addTip('tip-51');
  }
  if (w.isSnowy) addTip('tip-11');
  if (eff >= -2 && eff <= 2) addTip('tip-18');
  if (w.weatherCode === 45 || w.weatherCode === 48) addTip('tip-19');

  const periodTip: Record<WeatherPeriodType, string> = {
    morning: 'tip-06',
    day: eff >= 20 ? 'tip-08' : 'tip-10',
    evening: 'tip-07',
    night: 'tip-09',
  };
  addTip(periodTip[period]);

  const ageTip: Record<AgeGroup, string> = {
    '0-3m': 'tip-21',
    '3-12m': 'tip-22',
    '1-3y': 'tip-24',
    '3-7y': 'tip-25',
    '7-12y': 'tip-26',
    '12-16y': 'tip-52',
  };
  addTip(ageTip[age]);

  if (activity === 'active') addTip(w.windSpeed >= 15 ? 'tip-45' : 'tip-41');
  if (activity === 'quiet') addTip('tip-42');

  if (w.isRainy) addTip('tip-36');
  else if (eff <= 0) addTip('tip-30');
  else if (eff >= 25) addTip('tip-37');
  else addTip('tip-40');

  const parentTips: ParentTip[] = tipIds
    .map((id) => TIPS_POOL.find((tip) => tip.id === id))
    .filter((tip): tip is ParentTip => Boolean(tip))
    .slice(0, 7);

  const specialAdvice: string[] = [];
  if (coolish) specialAdvice.push(tr("Правило трёх слоёв: влагоотвод → изоляция → защита."));
  if (activity === 'active') specialAdvice.push(tr("Ребёнок будет бегать: снимите верхний слой до выхода со двора, чтобы не вспотел."));
  if (activity === 'quiet') specialAdvice.push(tr("Спокойная прогулка: тело греет меньше, добавьте изоляции."));
  if (isTeen) specialAdvice.push(tr("Подростку удобнее регулировать комплект самому: оставьте место в рюкзаке для снятого слоя."));

  return {
    summary: `На улице ${w.temp > 0 ? '+' : ''}${w.temp}° (по прогнозу ощущается ${w.feelsLike > 0 ? '+' : ''}${w.feelsLike}°, с учётом профиля ${eff > 0 ? '+' : ''}${eff}°), ${w.description.toLowerCase()}. В основе комплекта: ${outer[0]?.name ?? upper[0]?.name ?? lower[0]?.name}, ${shoes[0]?.name}, ${headwear[0]?.name}.`,
    underwear, lower, upper, outer, headwear, shoes, accessories, specialAdvice, parentTips,
  };
};
