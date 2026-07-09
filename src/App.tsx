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
  AgeGroup
} from './types';
import { 
  interpretWeatherCode, 
  generateOutfit, 
  calculateEffectiveTemp 
} from './utils/weatherEngine';
import { WeatherSelector } from './components/WeatherSelector';
import { AvatarVisualizer } from './components/AvatarVisualizer';
import { CustomWeatherControls } from './components/CustomWeatherControls';
import { ParentTipsSection } from './components/ParentTipsSection';
import { 
  MapPin, 
  Search, 
  CloudSun, 
  Thermometer, 
  Wind, 
  Droplets, 
  Baby, 
  HelpCircle,
  RefreshCw
} from 'lucide-react';

// A robust mock data generator for instant offline/fallback usage
const generateMockForecast = (baseTemp: number): DayForecast[] => {
  const periods: WeatherPeriodType[] = ['morning', 'day', 'evening', 'night'];
  const dayOffsets = [0, 1];
  
  const monthNames = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];

  return dayOffsets.map(offset => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const formattedDate = offset === 0 
      ? `Сегодня, ${date.getDate()} ${monthNames[date.getMonth()]}`
      : `Завтра, ${date.getDate()} ${monthNames[date.getMonth()]}`;
    
    const periodData: any = {};

    periods.forEach((period) => {
      // Simulate temperature variation based on period
      let tempMod = 0;
      let weatherCode = 0; // clear
      let description = 'Ясно';
      let icon = 'Sun';

      if (period === 'morning') tempMod = -3;
      else if (period === 'day') tempMod = 4;
      else if (period === 'evening') tempMod = -1;
      else if (period === 'night') tempMod = -6;

      const temp = Math.round((baseTemp + tempMod) * 10) / 10;
      const windSpeed = Math.round((8 + Math.random() * 12) * 10) / 10;
      const humidity = Math.round(50 + Math.random() * 35);
      const precipProb = Math.random() > 0.7 ? Math.round(30 + Math.random() * 50) : 5;

      if (precipProb > 50) {
        if (temp <= 0) {
          weatherCode = 71; // Snowy
          description = 'Снегопад';
          icon = 'Snowflake';
        } else {
          weatherCode = 61; // Rainy
          description = 'Дождь';
          icon = 'CloudRain';
        }
      } else if (Math.random() > 0.5) {
        weatherCode = 3; // Partly cloudy
        description = 'Переменная облачность';
        icon = 'CloudSun';
      }

      const feelsLike = Math.round(
        (temp - (windSpeed > 10 ? (windSpeed - 10) * 0.3 : 0) + (humidity > 80 ? 1 : 0)) * 10
      ) / 10;

      periodData[period] = {
        temp,
        feelsLike,
        windSpeed,
        humidity,
        precipProb,
        weatherCode,
        description,
        icon,
        isRainy: icon === 'CloudRain' || icon === 'CloudLightning',
        isSnowy: icon === 'Snowflake',
        isWindy: windSpeed > 15
      };
    });

    return {
      date: date.toISOString().split('T')[0],
      formattedDate,
      periods: periodData as DayForecast['periods']
    };
  });
};

const DEFAULT_CITY: CityData = {
  name: 'Ярославль',
  country: 'Россия',
  region: 'Ярославская область',
  lat: 57.6299,
  lon: 39.8737
};

export default function App() {
  // Telegram Mini App init
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Telegram && (window as any).Telegram.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.ready();
      tg.expand();
    }
  }, []);

  // Active city and search variables
  const [selectedCity, setSelectedCity] = useState<CityData>(DEFAULT_CITY);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CityData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Weather state variables
  const [todayForecast, setTodayForecast] = useState<DayForecast | null>(null);
  const [tomorrowForecast, setTomorrowForecast] = useState<DayForecast | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // Selection variables
  const [selectedDay, setSelectedDay] = useState<'today' | 'tomorrow'>('today');
  const [selectedPeriod, setSelectedPeriod] = useState<WeatherPeriodType>('day');
  const [gender, setGender] = useState<ChildGender>('girl');
  const [activeTab, setActiveTab] = useState<'clothing' | 'tips' | 'parameters' | 'simulator' | 'faq'>('clothing');

  // Simulated / manual weather controls state
  const [isManual, setIsManual] = useState(false);
  const [manualTemp, setManualTemp] = useState(12);
  const [manualWindSpeed, setManualWindSpeed] = useState(10);
  const [manualHumidity, setManualHumidity] = useState(60);
  const [manualCondition, setManualCondition] = useState<'sunny' | 'cloudy' | 'rainy' | 'snowy'>('sunny');

  // Child factors
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('normal');
  const [coldSensitivity, setColdSensitivity] = useState<ColdSensitivity>('normal');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('1-3y');

  // Selected Item Tip
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);

  // Fetch weather forecast from Open-Meteo API with mock fallback
  const fetchWeather = useCallback(async (city: CityData) => {
    setIsLoadingWeather(true);
    setWeatherError(null);
    
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m&timezone=auto`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Ошибка ответа сервера погоды.');
      
      const data = await response.json();
      
      if (!data.hourly || !data.hourly.time) {
        throw new Error('Некорректный формат данных прогноза.');
      }

      // Parse hourly data to find morning (8:00), day (14:00), evening (18:00), and night (23:00)
      const hourly = data.hourly;
      
      // Helper to build DayForecast
      const parseDay = (dayIndex: 0 | 1): DayForecast => {
        const date = new Date();
        date.setDate(date.getDate() + dayIndex);
        
        const monthNames = [
          'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
          'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];

        const formattedDate = dayIndex === 0
          ? `Сегодня, ${date.getDate()} ${monthNames[date.getMonth()]}`
          : `Завтра, ${date.getDate()} ${monthNames[date.getMonth()]}`;

        const startOffset = dayIndex * 24;
        
        // Time slot indexes
        const morningIdx = startOffset + 8;
        const dayIdx = startOffset + 14;
        const eveningIdx = startOffset + 18;
        const nightIdx = startOffset + 23;

        const getPeriodData = (idx: number): WeatherData => {
          const temp = hourly.temperature_2m[idx] !== undefined ? Math.round(hourly.temperature_2m[idx] * 10) / 10 : 10;
          const feelsLike = hourly.apparent_temperature[idx] !== undefined ? Math.round(hourly.apparent_temperature[idx] * 10) / 10 : temp;
          const windSpeed = hourly.wind_speed_10m[idx] !== undefined ? Math.round(hourly.wind_speed_10m[idx] * 10) / 10 : 5;
          const humidity = hourly.relative_humidity_2m[idx] !== undefined ? Math.round(hourly.relative_humidity_2m[idx]) : 50;
          const precipProb = hourly.precipitation_probability[idx] !== undefined ? Math.round(hourly.precipitation_probability[idx]) : 10;
          const weatherCode = hourly.weather_code[idx] !== undefined ? hourly.weather_code[idx] : 0;

          const interp = interpretWeatherCode(weatherCode);

          return {
            temp,
            feelsLike,
            windSpeed,
            humidity,
            precipProb,
            weatherCode,
            description: interp.description,
            icon: interp.icon,
            isRainy: interp.isRain,
            isSnowy: interp.isSnow,
            isWindy: windSpeed > 15
          };
        };

        return {
          date: date.toISOString().split('T')[0],
          formattedDate,
          periods: {
            morning: getPeriodData(morningIdx),
            day: getPeriodData(dayIdx),
            evening: getPeriodData(eveningIdx),
            night: getPeriodData(nightIdx)
          }
        };
      };

      const today = parseDay(0);
      const tomorrow = parseDay(1);

      setTodayForecast(today);
      setTomorrowForecast(tomorrow);

      // Sync manual temperature slider to real value on initial fetch
      const activeVal = today.periods.day;
      setManualTemp(activeVal.temp);
      setManualWindSpeed(Math.round(activeVal.windSpeed));
      setManualHumidity(activeVal.humidity);
      setManualCondition(activeVal.isRainy ? 'rainy' : activeVal.isSnowy ? 'snowy' : activeVal.temp > 20 ? 'sunny' : 'cloudy');

    } catch (error) {
      console.error('Weather API Error. Using mock fallback:', error);
      setWeatherError('Не удалось связаться с сервером Open-Meteo. Используются симулированные данные погоды.');
      // Gracefully fallback to simulated mock data
      const mockToday = generateMockForecast(10)[0];
      const mockTomorrow = generateMockForecast(10)[1];
      setTodayForecast(mockToday);
      setTomorrowForecast(mockTomorrow);
      
      const activeVal = mockToday.periods.day;
      setManualTemp(activeVal.temp);
      setManualWindSpeed(Math.round(activeVal.windSpeed));
      setManualHumidity(activeVal.humidity);
      setManualCondition(activeVal.isRainy ? 'rainy' : activeVal.isSnowy ? 'snowy' : 'cloudy');
    } finally {
      setIsLoadingWeather(false);
    }
  }, []);

  // Handle Geocoding search for city name
  const handleCitySearch = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const searchUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=ru&format=json`;
      const response = await fetch(searchUrl);
      if (!response.ok) throw new Error('Geocoding error');
      
      const data = await response.json();
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
      console.error('Search error: ', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Trigger initial search & forecast loading
  useEffect(() => {
    fetchWeather(selectedCity);
  }, [selectedCity, fetchWeather]);

  // Trigger geocoding search debouncing or typing update
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleCitySearch(searchQuery);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Extract active weather metrics (manual or real forecast)
  const getActiveWeatherData = (): WeatherData => {
    if (isManual) {
      const codeMap = { sunny: 0, cloudy: 3, rainy: 61, snowy: 71 };
      const descMap = { sunny: 'Ясно', cloudy: 'Облачно', rainy: 'Дождь', snowy: 'Снегопад' };
      const iconMap = { sunny: 'Sun', cloudy: 'Cloud', rainy: 'CloudRain', snowy: 'Snowflake' };

      return {
        temp: manualTemp,
        feelsLike: calculateEffectiveTemp(manualTemp, manualWindSpeed, manualHumidity, activityLevel, coldSensitivity, ageGroup),
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

    // Real weather path
    const activeDayForecast = selectedDay === 'today' ? todayForecast : tomorrowForecast;
    if (activeDayForecast) {
      return activeDayForecast.periods[selectedPeriod];
    }

    // Safe fallback
    return {
      temp: 15,
      feelsLike: 15,
      windSpeed: 5,
      humidity: 50,
      precipProb: 0,
      weatherCode: 0,
      description: 'Ясно',
      icon: 'Sun',
      isRainy: false,
      isSnowy: false,
      isWindy: false
    };
  };

  const activeWeather = getActiveWeatherData();
  const activeOutfit = generateOutfit(gender, activeWeather, activityLevel, coldSensitivity, ageGroup, selectedPeriod);
  const computedFeelsLike = calculateEffectiveTemp(
    activeWeather.temp,
    activeWeather.windSpeed,
    activeWeather.humidity,
    activityLevel,
    coldSensitivity,
    ageGroup
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-sky-50/60 text-slate-700 pb-16 relative overflow-hidden">
      
      {/* BACKGROUND GRAPHICS */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-100/40 to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-48 -left-24 w-96 h-96 bg-indigo-200/20 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute top-[500px] -right-24 w-96 h-96 bg-sky-200/20 rounded-full filter blur-3xl pointer-events-none" />

      {/* HEADER */}
      <header className="border-b border-indigo-100/70 bg-white/75 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Logo / Title */}
          <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer shrink-0">
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-400 flex items-center justify-center text-white shadow-md shadow-indigo-100 hover:scale-105 transition duration-300">
              <span className="text-lg sm:text-2xl select-none font-extrabold">🌤️</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 flex items-center gap-1">
                <span className="truncate">МетеоОдевайка</span>
                <span className="hidden xs:inline text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-extrabold border border-indigo-100 whitespace-nowrap">
                  Умный гид
                </span>
              </h1>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                одеваем детей идеально по погоде
              </p>
            </div>
          </div>

          {/* GEOLOCATION & SEARCH ENGINE */}
          <div className="relative w-full sm:w-64 lg:w-72 z-50">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" size={15} />
              <input
                type="text"
                placeholder="Поиск города..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 bg-white/90 border-2 border-slate-100 rounded-2xl text-[11px] sm:text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500/80 shadow-sm transition duration-300"
              />
              {isSearching ? (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-2 border-indigo-500 border-t-transparent" />
                </div>
              ) : (
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
              )}
            </div>

            {/* Search results dropdown */}
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
                activeTab === 'clothing' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>👕</span>
              <span>Одежда</span>
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`py-2 px-1 font-extrabold text-[9px] xs:text-[11px] sm:text-sm border-b-2 transition flex flex-col xs:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-1.5 whitespace-nowrap ${
                activeTab === 'tips' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>💡</span>
              <span>Подсказки</span>
            </button>
            <button
              onClick={() => setActiveTab('parameters')}
              className={`py-2 px-1 font-extrabold text-[9px] xs:text-[11px] sm:text-sm border-b-2 transition flex flex-col xs:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-1.5 whitespace-nowrap ${
                activeTab === 'parameters' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Baby size={14} className="shrink-0" />
              <span>Параметры</span>
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`py-2 px-1 font-extrabold text-[9px] xs:text-[11px] sm:text-sm border-b-2 transition flex flex-col xs:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-1.5 whitespace-nowrap ${
                activeTab === 'simulator' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <RefreshCw size={14} className="shrink-0" />
              <span>Симулятор</span>
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`py-2 px-1 font-extrabold text-[9px] xs:text-[11px] sm:text-sm border-b-2 transition flex flex-col xs:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-1.5 whitespace-nowrap ${
                activeTab === 'faq' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <HelpCircle size={14} className="shrink-0" />
              <span>FAQ</span>
            </button>
          </div>
        </nav>
      </header>

      {/* MAIN SECTION */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-4 sm:mt-8 space-y-5 sm:space-y-8">
        
        {activeTab === 'clothing' && (
          <>
        {/* SELECTED CITY WEATHER CARD */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-indigo-100/60 p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-0">
            <div className="p-3 sm:p-4 bg-indigo-50 rounded-xl sm:rounded-2xl border border-indigo-100/30 shrink-0">
              <CloudSun className="text-indigo-600 animate-pulse" size={28} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-base sm:text-xl font-black text-slate-800 tracking-tight truncate">
                  Погода в г. {selectedCity.name}
                </h2>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 whitespace-nowrap">
                  ({selectedCity.region ? `${selectedCity.region}, ` : ''}{selectedCity.country})
                </span>
              </div>
              
              {/* Real / Manual Mode Indicator */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full shrink-0 ${isManual ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                  {isManual 
                    ? 'Ручной симулятор' 
                    : 'Прогноз реального времени'}
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

          {/* Active metrics summaries — 2×2 grid on mobile */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 md:gap-6 mt-3 sm:mt-0 sm:justify-end">
            <div className="bg-slate-50/70 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 border border-slate-100/60 flex items-center gap-2 sm:gap-2.5">
              <Thermometer className="text-rose-500 shrink-0" size={16} />
              <div className="min-w-0">
                <span className="text-[8px] sm:text-[10px] text-slate-400 block font-bold uppercase">На улице</span>
                <span className="text-xs sm:text-sm font-black text-slate-800">
                  {activeWeather.temp > 0 ? `+${activeWeather.temp}` : activeWeather.temp}°C
                </span>
              </div>
            </div>

            <div className="bg-indigo-50/60 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 border border-indigo-100/40 flex items-center gap-2 sm:gap-2.5">
              <Baby className="text-indigo-600 shrink-0" size={16} />
              <div className="min-w-0">
                <span className="text-[8px] sm:text-[10px] text-indigo-500 block font-bold uppercase">Ощущается</span>
                <span className="text-xs sm:text-sm font-black text-slate-800">
                  {computedFeelsLike > 0 ? `+${computedFeelsLike}` : computedFeelsLike}°C
                </span>
              </div>
            </div>

            <div className="bg-slate-50/70 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 border border-slate-100/60 flex items-center gap-2 sm:gap-2.5">
              <Wind className="text-slate-400 shrink-0" size={16} />
              <div className="min-w-0">
                <span className="text-[8px] sm:text-[10px] text-slate-400 block font-bold uppercase">Ветер</span>
                <span className="text-xs sm:text-sm font-black text-slate-800">{activeWeather.windSpeed} км/ч</span>
              </div>
            </div>

            <div className="bg-slate-50/70 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 border border-slate-100/60 flex items-center gap-2 sm:gap-2.5">
              <Droplets className="text-blue-400 shrink-0" size={16} />
              <div className="min-w-0">
                <span className="text-[8px] sm:text-[10px] text-slate-400 block font-bold uppercase">Влажность</span>
                <span className="text-xs sm:text-sm font-black text-slate-800">{activeWeather.humidity}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* WEATHER SELECTOR TABS */}
        {!isManual && (
          <div className="relative">
            {isLoadingWeather && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-3xl flex items-center justify-center z-10">
                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow border border-slate-100">
                  <div className="animate-spin rounded-full h-5 w-5 border-3 border-indigo-600 border-t-transparent" />
                  <span className="text-xs font-extrabold text-indigo-600">Синхронизация с метеостанцией...</span>
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

        {/* INTERACTIVE CHILD DRESS UP PANEL & CHECKLISTS */}
        <div className="space-y-4 sm:space-y-6">
          {/* Title / Controls bar */}
          <div className="flex flex-col gap-3">
            {/* Boy / Girl Switcher Tab — moved to top on mobile */}
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/60 shadow-xs self-center sm:self-auto w-full sm:w-auto">
              <button
                onClick={() => setGender('girl')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-3 sm:px-5 rounded-xl text-[11px] sm:text-xs font-extrabold transition ${
                  gender === 'girl'
                    ? 'bg-white text-pink-600 shadow-sm ring-2 ring-pink-50'
                    : 'text-slate-500 hover:text-pink-600 hover:bg-white/50'
                }`}
              >
                <span>👧</span>
                <span>Девочка</span>
              </button>
              <button
                onClick={() => setGender('boy')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-3 sm:px-5 rounded-xl text-[11px] sm:text-xs font-extrabold transition ${
                  gender === 'boy'
                    ? 'bg-white text-blue-600 shadow-sm ring-2 ring-blue-50'
                    : 'text-slate-500 hover:text-blue-600 hover:bg-white/50'
                }`}
              >
                <span>👦</span>
                <span>Мальчик</span>
              </button>
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-base sm:text-xl font-black text-slate-800 flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 flex-wrap">
                <span>Одежда на</span>
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-indigo-50 text-indigo-600 font-extrabold text-[11px] sm:text-sm rounded-xl border border-indigo-100">
                  {isManual 
                    ? 'Тестовые настройки' 
                    : `${selectedDay === 'today' ? 'Сегодня' : 'Завтра'} — ${
                        selectedPeriod === 'morning' ? 'Утро' :
                        selectedPeriod === 'day' ? 'День' :
                        selectedPeriod === 'evening' ? 'Вечер' : 'Ночь'
                      }`
                  }
                </span>
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5 hidden sm:block">
                Гардероб автоматически подстраивается под погодные риски текущего периода прогулки.
              </p>
            </div>
          </div>

          {/* AVATAR VISUALIZER AND DETAILED GARMENT CARDS */}
          <AvatarVisualizer
            gender={gender}
            outfit={activeOutfit}
            effectiveTemp={computedFeelsLike}
            isRainy={activeWeather.isRainy}
            isSnowy={activeWeather.isSnowy}
            isWindy={activeWeather.isWindy}
            onItemSelect={(item) => setSelectedItem(item)}
          />
        </div>
          </>
        )}

        {/* TAB CONTENTS */}
        <div className="space-y-8">
          
          {/* 2. Parent Tips Tab */}
          {activeTab === 'tips' && (
            <div className="space-y-4">
              <ParentTipsSection tips={activeOutfit.parentTips} />
            </div>
          )}

          {/* 3. Parameters Tab */}
          {activeTab === 'parameters' && (
            <div className="space-y-4">
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
                activity={activityLevel}
                setActivity={setActivityLevel}
                sensitivity={coldSensitivity}
                setSensitivity={setColdSensitivity}
                ageGroup={ageGroup}
                setAgeGroup={setAgeGroup}
              />
            </div>
          )}

          {/* 4. Manual Simulator Tab */}
          {activeTab === 'simulator' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/30 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-indigo-100/50 space-y-3 sm:space-y-4">
                <h3 className="text-sm sm:text-base font-black text-slate-800">Ручной генератор погодных сценариев</h3>
                <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed">
                  Проверьте, какую одежду порекомендует «МетеоОдевайка» в экстремальных условиях.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { setIsManual(true); setManualTemp(-20); setManualWindSpeed(25); setManualCondition('snowy'); }}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-[10px] sm:text-xs font-bold active:bg-blue-200 transition">
                    ❄️ Мороз -20°С
                  </button>
                  <button onClick={() => { setIsManual(true); setManualTemp(3); setManualWindSpeed(15); setManualCondition('rainy'); }}
                    className="px-3 py-1.5 bg-teal-100 text-teal-700 border border-teal-200 rounded-xl text-[10px] sm:text-xs font-bold active:bg-teal-200 transition">
                    🌧️ Слякоть +3°С
                  </button>
                  <button onClick={() => { setIsManual(true); setManualTemp(28); setManualWindSpeed(5); setManualCondition('sunny'); }}
                    className="px-3 py-1.5 bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-[10px] sm:text-xs font-bold active:bg-amber-200 transition">
                    ☀️ Жара +28°С
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
                activity={activityLevel}
                setActivity={setActivityLevel}
                sensitivity={coldSensitivity}
                setSensitivity={setColdSensitivity}
                ageGroup={ageGroup}
                setAgeGroup={setAgeGroup}
              />
            </div>
          )}

          {/* 5. FAQ & Scientific School for Parents */}
          {activeTab === 'faq' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
              
              {/* FAQ 1 */}
              <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-3xl border border-slate-100 shadow-xs space-y-1.5 sm:space-y-2">
                <h4 className="font-bold text-slate-800 text-[11px] sm:text-sm flex items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-lg">🧥</span>
                  <span>Как работает «правило многослойности»?</span>
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed">
                  Многослойная структура — золотой стандарт детского гардероба в холодное время. 3 обязательных элемента:
                </p>
                <ul className="text-[10px] sm:text-[11px] text-slate-500 space-y-1 list-disc list-inside pl-1 sm:pl-2">
                  <li><strong>Слой 1 (Белье):</strong> отводит влагу. Влажное тело остывает в 25 раз быстрее сухого!</li>
                  <li><strong>Слой 2 (Утеплитель):</strong> сохраняет воздух (флис или шерсть).</li>
                  <li><strong>Слой 3 (Внешний):</strong> блокирует ветер и воду (мембрана).</li>
                </ul>
              </div>

              {/* FAQ 2 */}
              <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-3xl border border-slate-100 shadow-xs space-y-1.5 sm:space-y-2">
                <h4 className="font-bold text-slate-800 text-[11px] sm:text-sm flex items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-lg">👶</span>
                  <span>Как проверить, жарко или холодно ребенку?</span>
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed">
                  Не ориентируйтесь на нос или ладошки: на ветру они остывают первыми. Проверьте <strong>заднюю сторону шеи (загривок)</strong>:
                </p>
                <ul className="text-[10px] sm:text-[11px] text-slate-500 space-y-1 list-disc list-inside pl-1 sm:pl-2">
                  <li>Шея горячая и влажная — перегрев, снимите слой.</li>
                  <li>Шея холодная — ребенок мерзнет, добавьте слой.</li>
                  <li>Шея теплая и сухая — температура идеальна!</li>
                </ul>
              </div>

              {/* FAQ 3 */}
              <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-3xl border border-slate-100 shadow-xs space-y-1.5 sm:space-y-2">
                <h4 className="font-bold text-slate-800 text-[11px] sm:text-sm flex items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-lg">🌬️</span>
                  <span>Как ветер меняет комфортную температуру?</span>
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed">
                  Сильный ветер уносит тепловую прослойку воздуха вокруг тела. При +2°С и ветре 10 м/с кожа теряет тепло как при -5°С! Наш сервис всегда рассчитывает <strong>«эффективную ощущаемую температуру»</strong>.
                </p>
              </div>

              {/* FAQ 4 */}
              <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-3xl border border-slate-100 shadow-xs space-y-1.5 sm:space-y-2">
                <h4 className="font-bold text-slate-800 text-[11px] sm:text-sm flex items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-lg">☔</span>
                  <span>Что делать в сырую погоду весной и осенью?</span>
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed">
                  В слякоть обычные джинсы быстро промокают. Отдавайте предпочтение мембранным полукомбинезонам. Обувь — на толстой подошве или Gore-Tex, чтобы изолировать ноги от холодной земли.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* FLOATING CLOTHING ITEM DETAIL CARD — full-width bottom sheet on mobile */}
        {selectedItem && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-fadeIn sm:hidden" onClick={() => setSelectedItem(null)} />
            <div className="fixed bottom-0 sm:bottom-6 sm:right-6 z-50 w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl border-t-4 sm:border-4 border-indigo-100 shadow-2xl p-4 sm:p-5 transition-all animate-slideUp">
              {/* Handle bar for mobile */}
              <div className="sm:hidden w-10 h-1 bg-slate-200 rounded-full mx-auto -mt-1 mb-3" />
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <span className="text-3xl sm:text-4xl leading-none">{selectedItem.emoji}</span>
                  <div>
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100">
                      {selectedItem.category === 'base' ? 'Слой 1. Влагоотвод' :
                       selectedItem.category === 'middle' ? 'Слой 2. Термоизоляция' :
                       selectedItem.category === 'outer' ? 'Слой 3. Ветро-влагозащита' :
                       selectedItem.category === 'shoes' ? 'Обувь' : 'Аксессуары'}
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

      {/* FOOTER */}
      <footer className="mt-16 border-t border-indigo-50 pt-8 text-center space-y-3 max-w-7xl mx-auto px-4">
        <p className="text-xs text-slate-400">
          Разработано с любовью и заботой о здоровье детей во всем мире ❤️
        </p>
        <p className="text-[10px] text-slate-300">
          Все данные о погоде предоставляются бесплатно в режиме реального времени через Open-Meteo API. 
          Медицинские советы носят ознакомительный характер. При возникновении сомнений проконсультируйтесь с вашим педиатром.
        </p>
      </footer>
    </div>
  );
}
