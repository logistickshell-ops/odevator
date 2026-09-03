import { useState, useEffect, useCallback } from 'react';
import { 
  DayForecast, 
  WeatherPeriodType, 
  WeatherData, 
  CityData, 
  ActivityLevel, 
  ColdSensitivity, 
  ChildGender, 
  ClothingItem,
  AgeGroup,
  ChildProfile,
  LAYER_LABELS,
  OpenMeteoForecastResponse,
  OpenMeteoGeocodingResponse,
} from './types';
import { 
  interpretWeatherCode, 
  generateOutfit, 
  calculateWeatherFeel,
  calculateRecommendationTemp
} from './utils/weatherEngine';
import { WeatherSelector } from './components/WeatherSelector';
import { AvatarVisualizer } from './components/AvatarVisualizer';
import { CustomWeatherControls } from './components/CustomWeatherControls';
import { ParentTipsSection } from './components/ParentTipsSection';
import { FaqSection } from './components/FaqSection';
import { AnalysisSection } from './components/AnalysisSection';
import { WalkNotes } from './components/WalkNotes';
import { WalkChecklist } from './components/WalkChecklist';
import { ShareInvite } from './components/ShareInvite';
import { SharePlan } from './components/SharePlan';
import { WeeklyForecastPurchase } from './components/WeeklyForecastPurchase';
import { WeeklyForecast } from './components/WeeklyForecast';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { tr, useLanguage } from './i18n';
import { ChildProfileSettings } from './components/ChildProfileSettings';
import { formatClothingHeading } from './utils/childProfile';
import { 
  MapPin, 
  Search, 
  CloudSun, 
  Thermometer, 
  Wind, 
  Droplets, 
  Baby, 
  Settings
} from 'lucide-react';

// ============================================
// ХЕЛПЕРЫ ДЛЯ РАБОТЫ С LOCALSTORAGE
// ============================================
const STORAGE_KEYS = {
  CITY: 'meteo_saved_city',
  CHILDREN: 'meteo_child_profiles_v1',
  ACTIVE_CHILD: 'meteo_active_child_v1',
  // Старые ключи нужны только для мягкого переноса одного существующего профиля.
  GENDER: 'meteo_saved_gender',
  ACTIVITY: 'meteo_saved_activity',
  SENSITIVITY: 'meteo_saved_sensitivity',
  AGE: 'meteo_saved_age',
} as const;

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    if (typeof window === 'undefined') return fallback;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key: string, value: unknown) => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

// ============================================
// MOCK DATA GENERATOR
// ============================================
const generateMockForecast = (baseTemp: number): DayForecast[] => {
  const periods: WeatherPeriodType[] = ['morning', 'day', 'evening', 'night'];
  const periodOffsets = [-3, 4, -1, -6];
  const windOffsets = [0, 2, -1, 1];
  const humidityOffsets = [0, 7, 12, 5];
  const precipitationByPeriod = [5, 10, 5, 5];
  const monthNames = [
    tr("января"), tr("февраля"), tr("марта"), tr("апреля"), tr("мая"), tr("июня"),
    tr("июля"), tr("августа"), tr("сентября"), tr("октября"), tr("ноября"), tr("декабря")
  ];

  return [0, 1].map((dayOffset) => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    const formattedDate = dayOffset === 0
      ? `${tr('Сегодня,')} ${date.getDate()} ${monthNames[date.getMonth()]}`
      : `${tr('Завтра,')} ${date.getDate()} ${monthNames[date.getMonth()]}`;
    const periodData = {} as DayForecast['periods'];

    periods.forEach((period, periodIndex) => {
      const temp = Math.round((baseTemp + periodOffsets[periodIndex]) * 10) / 10;
      const windSpeed = Math.round((8 + windOffsets[periodIndex]) * 10) / 10;
      const humidity = 50 + humidityOffsets[periodIndex];
      const precipProb = precipitationByPeriod[periodIndex];
      const weatherCode = 0;
      const description = tr("Ясно");
      const icon = 'Sun';
      const feelsLike = Math.round((temp - (windSpeed > 10 ? (windSpeed - 10) * 0.3 : 0)) * 10) / 10;

      periodData[period] = {
        temp, feelsLike, windSpeed, humidity, precipProb, weatherCode,
        description, icon, isRainy: false, isSnowy: false, isWindy: windSpeed > 15,
      };
    });

    return {
      date: date.toISOString().split('T')[0],
      formattedDate,
      periods: periodData,
    };
  });
};

const addDaysToDateKey = (dateKey: string, days: number): string => {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
};

const getClosestHourlyIndex = (times: string[], dateKey: string, targetHour: number): number => {
  let bestIndex = -1;
  let bestDistance = Number.POSITIVE_INFINITY;
  times.forEach((timestamp, index) => {
    if (!timestamp.startsWith(dateKey)) return;
    const hour = Number(timestamp.slice(11, 13));
    const distance = Math.abs(hour - targetHour);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });
  return bestIndex;
};
const DEFAULT_CITY: CityData = {
  name: tr("Ярославль"),
  country: tr("Россия"),
  region: tr("Ярославская область"),
  lat: 57.6299,
  lon: 39.8737
};

const createChildId = () => window.crypto?.randomUUID?.() ?? `child-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const createDefaultChild = (): ChildProfile => ({
  id: createChildId(),
  name: tr("Ребёнок"),
  gender: loadFromStorage<ChildGender>(STORAGE_KEYS.GENDER, 'girl'),
  ageGroup: loadFromStorage<AgeGroup>(STORAGE_KEYS.AGE, '1-3y'),
  activityLevel: loadFromStorage<ActivityLevel>(STORAGE_KEYS.ACTIVITY, 'normal'),
  coldSensitivity: loadFromStorage<ColdSensitivity>(STORAGE_KEYS.SENSITIVITY, 'normal'),
});

const loadChildProfiles = (): ChildProfile[] => {
  const storedProfiles = loadFromStorage<ChildProfile[]>(STORAGE_KEYS.CHILDREN, []);
  return Array.isArray(storedProfiles) && storedProfiles.length > 0 ? storedProfiles : [createDefaultChild()];
};

const loadChildProfileState = () => {
  const profiles = loadChildProfiles();
  const storedActiveId = loadFromStorage<string>(STORAGE_KEYS.ACTIVE_CHILD, '');

  return {
    profiles,
    activeChildId: profiles.some((profile) => profile.id === storedActiveId)
      ? storedActiveId
      : profiles[0].id,
  };
};

export default function App() {
  useLanguage();
  // Telegram SDK инициализируется один раз в index.html до монтирования React.

  // ============================================
  // СОСТОЯНИЯ С ЗАГРУЗКОЙ ИЗ LOCALSTORAGE
  // ============================================
  const [selectedCity, setSelectedCity] = useState<CityData>(() => 
    loadFromStorage(STORAGE_KEYS.CITY, DEFAULT_CITY)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CityData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [todayForecast, setTodayForecast] = useState<DayForecast | null>(null);
  const [tomorrowForecast, setTomorrowForecast] = useState<DayForecast | null>(null);
  const [currentCityWeather, setCurrentCityWeather] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const [selectedDay, setSelectedDay] = useState<'today' | 'tomorrow'>('today');
  const [selectedPeriod, setSelectedPeriod] = useState<WeatherPeriodType>('day');
  
  const [{ profiles: initialChildren, activeChildId: initialActiveChildId }] = useState(loadChildProfileState);
  const [children, setChildren] = useState<ChildProfile[]>(initialChildren);
  const [activeChildId, setActiveChildId] = useState<string>(initialActiveChildId);
  const activeChild = children.find((profile) => profile.id === activeChildId) ?? children[0];
  const { gender, ageGroup, activityLevel, coldSensitivity } = activeChild;
  
  const [activeTab, setActiveTab] = useState<'clothing' | 'parameters' | 'tips' | 'notes' | 'premium'>('clothing');

  const [isManual, setIsManual] = useState(false);
  const [manualTemp, setManualTemp] = useState(12);
  const [manualWindSpeed, setManualWindSpeed] = useState(10);
  const [manualHumidity, setManualHumidity] = useState(60);
  const [manualCondition, setManualCondition] = useState<'sunny' | 'cloudy' | 'rainy' | 'snowy'>('sunny');

  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);

  // ============================================
  // АВТОСОХРАНЕНИЕ В LOCALSTORAGE
  // ============================================
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CITY, selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CHILDREN, children);
  }, [children]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ACTIVE_CHILD, activeChildId);
  }, [activeChildId]);

  const saveChildProfile = (profile: ChildProfile) => {
    setChildren((current) => current.map((item) => (item.id === profile.id ? profile : item)));
    setActiveChildId(profile.id);
  };

  const addChildProfile = () => {
    const profile: ChildProfile = {
      id: createChildId(),
      name: `${tr('Ребёнок')} ${children.length + 1}`,
      gender: 'girl',
      ageGroup: '1-3y',
      activityLevel: 'normal',
      coldSensitivity: 'normal',
    };
    setChildren((current) => [...current, profile]);
    setActiveChildId(profile.id);
  };

  const deleteChildProfile = (childId: string) => {
    if (children.length <= 1) return;

    const remainingProfiles = children.filter((profile) => profile.id !== childId);
    if (remainingProfiles.length === 0) return;

    setChildren(remainingProfiles);
    if (activeChildId === childId) {
      setActiveChildId(remainingProfiles[0].id);
    }
  };

  // ============================================
  // FETCH WEATHER
  // ============================================
  const fetchWeather = useCallback(async (city: CityData, signal?: AbortSignal) => {
    setIsLoadingWeather(true);
    setWeatherError(null);
    
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m&timezone=auto`;
      
      const response = await fetch(url, { signal });
      if (!response.ok) throw new Error(tr("Ошибка ответа сервера погоды."));
      
      const data = await response.json() as OpenMeteoForecastResponse;
      if (signal?.aborted) return;
      
      if (!data.hourly || !Array.isArray(data.hourly.time) || data.hourly.time.length === 0) {
        throw new Error(tr("Некорректный формат данных прогноза."));
      }

      const hourly = data.hourly;
      const firstHourlyDate = hourly.time[0]?.slice(0, 10);
      const currentDate = data.current?.time?.slice(0, 10) ?? firstHourlyDate;
      if (!currentDate) throw new Error(tr("В ответе Open-Meteo отсутствует локальная дата."));

      const monthNames = [
        tr("января"), tr("февраля"), tr("марта"), tr("апреля"), tr("мая"), tr("июня"),
        tr("июля"), tr("августа"), tr("сентября"), tr("октября"), tr("ноября"), tr("декабря")
      ];
      const formatDate = (dateKey: string, dayIndex: 0 | 1) => {
        const [, month, day] = dateKey.split('-').map(Number);
        return dayIndex === 0
          ? `${tr('Сегодня,')} ${day} ${monthNames[month - 1]}`
          : `${tr('Завтра,')} ${day} ${monthNames[month - 1]}`;
      };
      const valueAt = (values: Array<number | null> | undefined, index: number, fallback: number) => {
        const value = values?.[index];
        return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
      };

      const parseDay = (dayIndex: 0 | 1): DayForecast => {
        const dateKey = addDaysToDateKey(currentDate, dayIndex);
        const getPeriodData = (targetHour: number): WeatherData => {
          const idx = getClosestHourlyIndex(hourly.time, dateKey, targetHour);
          const temp = Math.round(valueAt(hourly.temperature_2m, idx, 10) * 10) / 10;
          const feelsLike = Math.round(valueAt(hourly.apparent_temperature, idx, temp) * 10) / 10;
          const windSpeed = Math.round(valueAt(hourly.wind_speed_10m, idx, 5) * 10) / 10;
          const humidity = Math.round(valueAt(hourly.relative_humidity_2m, idx, 50));
          const precipProb = Math.round(valueAt(hourly.precipitation_probability, idx, 10));
          const weatherCode = Math.round(valueAt(hourly.weather_code, idx, 0));
          const interp = interpretWeatherCode(weatherCode);
          return {
            temp, feelsLike, windSpeed, humidity, precipProb, weatherCode,
            description: interp.description, icon: interp.icon,
            isRainy: interp.isRain, isSnowy: interp.isSnow, isWindy: windSpeed > 15,
          };
        };
        return {
          date: dateKey,
          formattedDate: formatDate(dateKey, dayIndex),
          periods: {
            morning: getPeriodData(8), day: getPeriodData(14),
            evening: getPeriodData(18), night: getPeriodData(23),
          },
        };
      };

      const today = parseDay(0);
      const tomorrow = parseDay(1);
      const current = data.current;
      const currentFallback = today.periods.day;
      const currentWeatherCode = current?.weather_code ?? currentFallback.weatherCode;
      const currentInterpretation = interpretWeatherCode(currentWeatherCode);

      setCurrentCityWeather({
        temp: Math.round((typeof current?.temperature_2m === 'number' ? current.temperature_2m : currentFallback.temp) * 10) / 10,
        feelsLike: Math.round((typeof current?.apparent_temperature === 'number' ? current.apparent_temperature : currentFallback.feelsLike) * 10) / 10,
        windSpeed: Math.round((typeof current?.wind_speed_10m === 'number' ? current.wind_speed_10m : currentFallback.windSpeed) * 10) / 10,
        humidity: Math.round(typeof current?.relative_humidity_2m === 'number' ? current.relative_humidity_2m : currentFallback.humidity),
        precipProb: Math.round(typeof current?.precipitation_probability === 'number' ? current.precipitation_probability : currentFallback.precipProb),
        weatherCode: currentWeatherCode,
        description: currentInterpretation.description,
        icon: currentInterpretation.icon,
        isRainy: currentInterpretation.isRain,
        isSnowy: currentInterpretation.isSnow,
        isWindy: (current?.wind_speed_10m ?? currentFallback.windSpeed) > 15,
      });

      setTodayForecast(today);
      setTomorrowForecast(tomorrow);

      const activeVal = today.periods.day;
      setManualTemp(activeVal.temp);
      setManualWindSpeed(Math.round(activeVal.windSpeed));
      setManualHumidity(activeVal.humidity);
      setManualCondition(activeVal.isRainy ? 'rainy' : activeVal.isSnowy ? 'snowy' : activeVal.temp > 20 ? 'sunny' : 'cloudy');

    } catch (error) {
      if (signal?.aborted) return;
      console.error('Weather API Error. Using mock fallback:', error);
      setWeatherError(tr("Не удалось связаться с сервером Open-Meteo. Используются симулированные данные погоды."));
      const [mockToday, mockTomorrow] = generateMockForecast(10);
      setTodayForecast(mockToday);
      setTomorrowForecast(mockTomorrow);
      setCurrentCityWeather(mockToday.periods.day);
      
      const activeVal = mockToday.periods.day;
      setManualTemp(activeVal.temp);
      setManualWindSpeed(Math.round(activeVal.windSpeed));
      setManualHumidity(activeVal.humidity);
      setManualCondition(activeVal.isRainy ? 'rainy' : activeVal.isSnowy ? 'snowy' : 'cloudy');
    } finally {
      if (!signal?.aborted) setIsLoadingWeather(false);
    }
  }, []);

  const handleCitySearch = async (query: string, signal?: AbortSignal) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const searchUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=ru&format=json`;
      const response = await fetch(searchUrl, { signal });
      if (!response.ok) throw new Error('Geocoding error');
      
      const data = await response.json() as OpenMeteoGeocodingResponse;
      if (signal?.aborted) return;
      if (data.results && data.results.length > 0) {
        const parsedCities: CityData[] = data.results.map((item: any) => ({
          name: item.name,
          country: item.country || '',
          region: item.admin1 || '',
          lat: item.latitude,
          lon: item.longitude
        }));
        setSearchResults(parsedCities);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      if (signal?.aborted) return;
      console.error('Search error: ', error);
      setSearchResults([]);
    } finally {
      if (!signal?.aborted) setIsSearching(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchWeather(selectedCity, controller.signal);

    return () => controller.abort();
  }, [selectedCity, fetchWeather]);

  useEffect(() => {
    const controller = new AbortController();
    const delayDebounceFn = setTimeout(() => {
      handleCitySearch(searchQuery, controller.signal);
    }, 400);

    return () => {
      controller.abort();
      clearTimeout(delayDebounceFn);
    };
  }, [searchQuery]);

  const getActiveWeatherData = (): WeatherData => {
    if (isManual) {
      const codeMap = { sunny: 0, cloudy: 3, rainy: 61, snowy: 71 };
      const descMap = { sunny: tr("Ясно"), cloudy: tr("Облачно"), rainy: tr("Дождь"), snowy: tr("Снегопад") };
      const iconMap = { sunny: 'Sun', cloudy: 'Cloud', rainy: 'CloudRain', snowy: 'Snowflake' };

      return {
        temp: manualTemp,
        feelsLike: calculateWeatherFeel(manualTemp, manualWindSpeed, manualHumidity),
        windSpeed: manualWindSpeed,
        humidity: manualHumidity,
        precipProb: manualCondition === 'rainy' || manualCondition === 'snowy' ? 80 : 10,
        weatherCode: codeMap[manualCondition],
        description: descMap[manualCondition],
        icon: iconMap[manualCondition],
        isRainy: manualCondition === 'rainy',
        isSnowy: manualCondition === 'snowy',
        isWindy: manualWindSpeed > 15
      };
    }

    const activeDayForecast = selectedDay === 'today' ? todayForecast : tomorrowForecast;
    if (activeDayForecast) {
      return activeDayForecast.periods[selectedPeriod];
    }

    return {
      temp: 15,
      feelsLike: 15,
      windSpeed: 5,
      humidity: 50,
      precipProb: 0,
      weatherCode: 0,
      description: tr("Ясно"),
      icon: 'Sun',
      isRainy: false,
      isSnowy: false,
      isWindy: false
    };
  };

  const activeWeather = getActiveWeatherData();
  const activeOutfit = generateOutfit(gender, activeWeather, activityLevel, coldSensitivity, ageGroup, selectedPeriod);
  const computedFeelsLike = calculateRecommendationTemp(
    activeWeather,
    activityLevel,
    coldSensitivity,
    ageGroup,
  );
  const displayedCurrentWeather = currentCityWeather ?? {
    temp: 15,
    feelsLike: 15,
    windSpeed: 5,
    humidity: 50,
    precipProb: 0,
    weatherCode: 0,
    description: tr('Загружаем данные'),
    icon: 'Cloud',
    isRainy: false,
    isSnowy: false,
    isWindy: false,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/75 via-white to-rose-50/45 text-slate-700 pb-16 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-sky-100/45 to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-48 -left-24 w-96 h-96 bg-sky-200/20 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute top-[500px] -right-24 w-96 h-96 bg-rose-200/20 rounded-full filter blur-3xl pointer-events-none" />

      <header className="border-b border-sky-100/80 bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer shrink-0">
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-sky-200 to-rose-200 flex items-center justify-center text-sky-800 shadow-sm shadow-sky-100 hover:scale-105 transition duration-300">
              <span className="text-lg sm:text-2xl select-none font-extrabold">🌤️</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-sky-800 flex items-center gap-1">
                  <span className="truncate">{tr('МетеоОдевайка')}</span>
                  <span className="hidden xs:inline text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-extrabold border border-sky-100 whitespace-nowrap">
                    {tr('Умный гид')}
                  </span>
                </h1>
                <LanguageSwitcher />
              </div>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                {tr('одеваем детей идеально по погоде')}
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-64 lg:w-72 z-50">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" size={15} />
              <input
                type="text"
                placeholder={tr('Поиск города...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 bg-white/90 border-2 border-slate-100 rounded-2xl text-[11px] sm:text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-300 shadow-sm transition duration-300"
              />
              {isSearching ? (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-2 border-indigo-500 border-t-transparent" />
                </div>
              ) : (
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
              )}
            </div>

            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-lg z-50 overflow-hidden divide-y divide-slate-50 animate-fadeIn">
                {searchResults.map((city, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedCity(city);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-indigo-50/50 transition text-xs flex flex-col gap-0.5 active:bg-indigo-100/50"
                  >
                    <span className="font-black text-slate-800">{city.name}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {city.region ? `${city.region}, ` : ''}{city.country}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 border-t border-slate-100/70">
          <div className="grid grid-cols-5 gap-1 py-1 sm:flex sm:items-center sm:justify-start sm:gap-6">
            <button
              onClick={() => setActiveTab('clothing')}
              className={`py-2 px-1 font-extrabold text-[9px] xs:text-[11px] sm:text-sm border-b-2 transition flex flex-col xs:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-1.5 whitespace-nowrap ${
                activeTab === 'clothing' ? 'border-sky-400 text-sky-700' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>👕</span>
              <span>{tr('Одежда')}</span>
            </button>
            <button
              onClick={() => setActiveTab('parameters')}
              className={`py-2 px-1 font-extrabold text-[9px] xs:text-[11px] sm:text-sm border-b-2 transition flex flex-col xs:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-1.5 whitespace-nowrap ${
                activeTab === 'parameters' ? 'border-sky-400 text-sky-700' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Settings size={14} className="shrink-0" />
              <span>{tr('Параметры')}</span>
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`py-2 px-1 font-extrabold text-[9px] xs:text-[11px] sm:text-sm border-b-2 transition flex flex-col xs:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-1.5 whitespace-nowrap ${
                activeTab === 'tips' ? 'border-sky-400 text-sky-700' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>💡</span>
              <span>{tr('Подсказки')}</span>
            </button>
            <button
              onClick={() => setActiveTab('premium')}
              className={`py-2 px-1 font-extrabold text-[9px] xs:text-[11px] sm:text-sm border-b-2 transition flex flex-col xs:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-1.5 whitespace-nowrap ${
                activeTab === 'premium' ? 'border-violet-400 text-violet-700' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>⭐</span>
              <span>{tr('На неделю')}</span>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-2 px-1 font-extrabold text-[9px] xs:text-[11px] sm:text-sm border-b-2 transition flex flex-col xs:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-1.5 whitespace-nowrap ${
                activeTab === 'notes' ? 'border-sky-400 text-sky-700' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>📝</span>
              <span>{tr('Заметки')}</span>
            </button>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-4 sm:mt-8 space-y-5 sm:space-y-8">
        
        {activeTab === 'clothing' && (
          <>
        <div className="bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-indigo-100/60 p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-0">
            <div className="p-3 sm:p-4 bg-indigo-50 rounded-xl sm:rounded-2xl border border-indigo-100/30 shrink-0">
              <CloudSun className="text-indigo-600 animate-pulse" size={28} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-base sm:text-xl font-black text-slate-800 tracking-tight truncate">
                  {tr('Сейчас в г.')} {selectedCity.name}
                </h2>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 whitespace-nowrap">
                  ({selectedCity.region ? `${selectedCity.region}, ` : ''}{selectedCity.country})
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full shrink-0 bg-emerald-500" />
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                  {tr('Текущая погода · не зависит от времени прогулки')}
                </span>
              </div>

              {weatherError && (
                <div className="mt-2 p-2 sm:p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[10px] sm:text-xs text-amber-800 font-bold flex items-center justify-between gap-2 animate-fadeIn">
                  <span className="truncate">⚠️ {weatherError}</span>
                  <button onClick={() => setWeatherError(null)} className="text-amber-600 hover:text-amber-800 shrink-0">✕</button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 md:gap-6 mt-3 sm:mt-0 sm:justify-end">
            <div className="bg-slate-50/70 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 border border-slate-100/60 flex items-center gap-2 sm:gap-2.5">
              <Thermometer className="text-rose-500 shrink-0" size={16} />
              <div className="min-w-0">
                <span className="text-[8px] sm:text-[10px] text-slate-400 block font-bold uppercase">{tr('На улице')}</span>
                <span className="text-xs sm:text-sm font-black text-slate-800">
                  {displayedCurrentWeather.temp > 0 ? `+${displayedCurrentWeather.temp}` : displayedCurrentWeather.temp}°C
                </span>
              </div>
            </div>

            <div className="bg-indigo-50/60 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 border border-indigo-100/40 flex items-center gap-2 sm:gap-2.5">
              <Baby className="text-indigo-600 shrink-0" size={16} />
              <div className="min-w-0">
                <span className="text-[8px] sm:text-[10px] text-indigo-500 block font-bold uppercase">{tr('Ощущается')}</span>
                <span className="text-xs sm:text-sm font-black text-slate-800">
                  {displayedCurrentWeather.feelsLike > 0 ? `+${displayedCurrentWeather.feelsLike}` : displayedCurrentWeather.feelsLike}°C
                </span>
              </div>
            </div>

            <div className="bg-slate-50/70 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 border border-slate-100/60 flex items-center gap-2 sm:gap-2.5">
              <Wind className="text-slate-400 shrink-0" size={16} />
              <div className="min-w-0">
                <span className="text-[8px] sm:text-[10px] text-slate-400 block font-bold uppercase">{tr('Ветер')}</span>
                <span className="text-xs sm:text-sm font-black text-slate-800">{displayedCurrentWeather.windSpeed} {tr("км/ч")}</span>
              </div>
            </div>

            <div className="bg-slate-50/70 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 border border-slate-100/60 flex items-center gap-2 sm:gap-2.5">
              <Droplets className="text-blue-400 shrink-0" size={16} />
              <div className="min-w-0">
                <span className="text-[8px] sm:text-[10px] text-slate-400 block font-bold uppercase">{tr('Влажность')}</span>
                <span className="text-xs sm:text-sm font-black text-slate-800">{displayedCurrentWeather.humidity}%</span>
              </div>
            </div>
          </div>
        </div>

        {!isManual && (
          <div className="relative">
            {isLoadingWeather && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-3xl flex items-center justify-center z-10">
                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow border border-slate-100">
                  <div className="animate-spin rounded-full h-5 w-5 border-3 border-indigo-600 border-t-transparent" />
                  <span className="text-xs font-extrabold text-indigo-600">{tr("Синхронизация с метеостанцией...")}</span>
                </div>
              </div>
            )}
            <WeatherSelector
              todayForecast={todayForecast}
              tomorrowForecast={tomorrowForecast}
              selectedDay={selectedDay}
              selectedPeriod={selectedPeriod}
              onSelect={(day, period) => {
                setSelectedDay(day);
                setSelectedPeriod(period);
              }}
            />
          </div>
        )}

        {children.length > 1 && (
          <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-3 sm:p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[10px] font-black uppercase tracking-wider text-slate-500">{tr("Кому подбираем")}</span>
              {children.map((child) => (
                <button
                  type="button"
                  key={child.id}
                  onClick={() => setActiveChildId(child.id)}
                  className={`rounded-xl border px-3 py-2 text-[10px] sm:text-xs font-extrabold transition ${
                    child.id === activeChild.id
                      ? 'border-sky-200 bg-white text-sky-800 shadow-sm'
                      : 'border-transparent bg-white/60 text-slate-600 hover:bg-white'
                  }`}
                >
                  <span className="mr-1.5">{child.gender === 'girl' ? '👧' : '👦'}</span>
                  {child.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col gap-3">
            <div className="text-center sm:text-left">
              <h2 className="text-base sm:text-xl font-black text-slate-800 flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 flex-wrap">
                <span>{formatClothingHeading(activeChild.name, activeChild.gender)}</span>
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-indigo-50 text-indigo-600 font-extrabold text-[11px] sm:text-sm rounded-xl border border-indigo-100">
                  {isManual 
                    ? tr("Тестовые настройки") 
                    : `${selectedDay === 'today' ? tr("Сегодня") : tr("Завтра")} — ${
                        selectedPeriod === 'morning' ? tr("Утро") :
                        selectedPeriod === 'day' ? tr("День") :
                        selectedPeriod === 'evening' ? tr("Вечер") : tr("Ночь")
                      }`
                  }
                </span>
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5 hidden sm:block">
                {tr("Комплект учитывает погоду выбранного времени, возраст, активность и индивидуальную реакцию на прохладу.")}
              </p>
            </div>
          </div>

          <AvatarVisualizer
            gender={gender}
            outfit={activeOutfit}
            effectiveTemp={computedFeelsLike}
            isRainy={activeWeather.isRainy}
            isSnowy={activeWeather.isSnowy}
            isWindy={activeWeather.isWindy}
            onItemSelect={(item) => setSelectedItem(item)}
          />

          <SharePlan
            childName={activeChild.name}
            cityName={selectedCity.name}
            selectedDay={selectedDay}
            selectedPeriod={selectedPeriod}
            weather={activeWeather}
            outfit={activeOutfit}
          />
        </div>
          </>
        )}

        <div className="space-y-8">
          
          {activeTab === 'tips' && (
            <div className="space-y-6">
              <ParentTipsSection
                tips={activeOutfit.parentTips}
                weather={activeWeather}
                period={selectedPeriod}
                ageGroup={ageGroup}
                activity={activityLevel}
                sensitivity={coldSensitivity}
                childName={activeChild.name}
                outfit={activeOutfit}
              />
              <FaqSection
                weather={activeWeather}
                period={selectedPeriod}
                ageGroup={ageGroup}
                activity={activityLevel}
                sensitivity={coldSensitivity}
                childName={activeChild.name}
              />
              <AnalysisSection
                weather={activeWeather}
                period={selectedPeriod}
                ageGroup={ageGroup}
                activity={activityLevel}
                sensitivity={coldSensitivity}
                effectiveTemp={computedFeelsLike}
                outfit={activeOutfit}
                childName={activeChild.name}
              />
            </div>
          )}

          {activeTab === 'parameters' && (
            <div className="space-y-4">
              <ChildProfileSettings
                profiles={children}
                activeChildId={activeChild.id}
                onSelectChild={setActiveChildId}
                onSaveChild={saveChildProfile}
                onAddChild={addChildProfile}
                onDeleteChild={deleteChildProfile}
              />

              <div className="space-y-3 rounded-2xl sm:rounded-3xl border border-amber-100 bg-amber-50/55 p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-black text-slate-800">{tr("Проверить другую погоду")}</h3>
                <p className="text-[10px] sm:text-xs leading-relaxed text-slate-500">
                  {tr("Выберите вариант, если хотите посмотреть, как изменится комплект в другой ситуации.")}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { setIsManual(true); setManualTemp(-20); setManualWindSpeed(25); setManualCondition('snowy'); }}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-[10px] sm:text-xs font-bold active:bg-blue-200 transition">
                    {tr("❄️ Мороз -20°С")}
                  </button>
                  <button onClick={() => { setIsManual(true); setManualTemp(3); setManualWindSpeed(15); setManualCondition('rainy'); }}
                    className="px-3 py-1.5 bg-teal-100 text-teal-700 border border-teal-200 rounded-xl text-[10px] sm:text-xs font-bold active:bg-teal-200 transition">
                    {tr("🌧️ Слякоть +3°С")}
                  </button>
                  <button onClick={() => { setIsManual(true); setManualTemp(28); setManualWindSpeed(5); setManualCondition('sunny'); }}
                    className="px-3 py-1.5 bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-[10px] sm:text-xs font-bold active:bg-amber-200 transition">
                    {tr("☀️ Жара +28°С")}
                  </button>
                  <button onClick={() => { setIsManual(false); }}
                    className="px-3 py-1.5 bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-[10px] sm:text-xs font-bold active:bg-sky-200 transition">
                    {tr("🌐 Погода города")}
                  </button>
                </div>
              </div>
              
              <CustomWeatherControls
                isManual={isManual}
                setIsManual={setIsManual}
                temp={manualTemp}
                setTemp={setManualTemp}
                windSpeed={manualWindSpeed}
                setWindSpeed={setManualWindSpeed}
                humidity={manualHumidity}
                setHumidity={setManualHumidity}
                weatherCondition={manualCondition}
                setWeatherCondition={setManualCondition}
              />
              <ShareInvite />
            </div>
          )}

          {activeTab === 'premium' && (
            <div className="space-y-6">
              <WeeklyForecast city={selectedCity} child={activeChild} />
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-6">
              <div className="rounded-2xl sm:rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-100 via-white to-rose-100/70 p-5 sm:p-7 text-slate-800 shadow-sm">
                <h2 className="text-lg sm:text-2xl font-black">{tr("Заметки и чек-листы")}</h2>
                <p className="mt-1 text-[12px] sm:text-sm text-slate-500 leading-relaxed">{tr("Соберите важное к прогулке, сохраните личную заметку и отмечайте готовность по шагам. Всё хранится только на этом устройстве.")}</p>
              </div>
              <WalkNotes city={selectedCity} weather={activeWeather} period={selectedPeriod} />
              <WalkChecklist weather={activeWeather} period={selectedPeriod} ageGroup={ageGroup} activity={activityLevel} />
            </div>
          )}
        </div>

        {selectedItem && (
          <>
            <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-fadeIn sm:hidden" onClick={() => setSelectedItem(null)} />
            <div className="fixed bottom-0 sm:bottom-6 sm:right-6 z-50 w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl border-t-4 sm:border-4 border-indigo-100 shadow-2xl p-4 sm:p-5 transition-all animate-slideUp">
              <div className="sm:hidden w-10 h-1 bg-slate-200 rounded-full mx-auto -mt-1 mb-3" />
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <span className="text-3xl sm:text-4xl leading-none">{selectedItem.emoji}</span>
                  <div>
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100">
                      {selectedItem.category === 'outer'
                        ? tr("Слой 4. Ветро-влагозащита")
                        : selectedItem.category === 'upper'
                          ? tr("Слой 3. Термоизоляция")
                          : selectedItem.category === 'lower'
                            ? tr("Слой 2. Основной слой")
                            : selectedItem.category === 'underwear'
                              ? tr("Слой 1. Влагоотвод")
                              : tr(LAYER_LABELS[selectedItem.category])}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-800 mt-1.5">{selectedItem.name}</h3>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1.5 bg-slate-100 rounded-full w-7 h-7 flex items-center justify-center transition shrink-0"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed mt-3">
                {selectedItem.description}
              </p>
              {selectedItem.tips && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50 border border-amber-100/70 flex items-start gap-2 text-[10px] text-amber-800 leading-normal">
                  <span className="mt-0.5 shrink-0">💡</span>
                  <span>{selectedItem.tips}</span>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="mt-16 border-t border-indigo-50 pt-8 text-center space-y-3 max-w-7xl mx-auto px-4">
        <p className="text-xs text-slate-400">
          {tr("Created by Disa. Разработано с любовью и заботой о здоровье детей во всем мире ❤️")}
        </p>
        <p className="text-[10px] text-slate-300">
          {tr("Все данные о погоде предоставляются бесплатно в режиме реального времени через Open-Meteo API.")} {tr("Медицинские советы носят ознакомительный характер. При возникновении сомнений проконсультируйтесь с вашим педиатром.")}
        </p>
      </footer>
    </div>
  );
}
