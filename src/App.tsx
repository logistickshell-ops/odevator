import { useState, useEffect } from 'react';
import { WeatherDisplay } from './components/WeatherDisplay';
import { ChildFigure } from './components/ChildFigure';
import { ParentTipsSection } from './components/ParentTipsSection';
import { ClothingRecommendations } from './components/ClothingRecommendations';
import { AccessoriesRecommendations } from './components/AccessoriesRecommendations';
import { Simulator } from './components/Simulator';
import { FAQ } from './components/FAQ';
import { Disclaimer } from './components/Disclaimer';
import { WeatherData } from './types';
import { Baby, RefreshCw, HelpCircle } from 'lucide-react';
import { tipsPool } from './tips';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState('Санкт-Петербург');
  const [inputCity, setInputCity] = useState('Санкт-Петербург');
  const [activeTab, setActiveTab] = useState('clothing');

  // Определяем время суток
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'day';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  const timeOfDay = getTimeOfDay();

  // Функция для получения погоды
  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric&lang=ru`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      const weatherData: WeatherData = {
        city: data.name,
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        pressure: data.main.pressure,
      };
      setWeather(weatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке погоды');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      setCity(inputCity.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Шапка с поиском */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">🌤️</span>
              ОДЕВАЕМ ДЕТЕЙ ИДЕАЛЬНО ПО ПОГОДЕ
            </h1>
          </div>
          <form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-2">
            <input
              type="text"
              value={inputCity}
              onChange={(e) => setInputCity(e.target.value)}
              placeholder="Введите город..."
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all text-sm whitespace-nowrap"
            >
              Найти
            </button>
          </form>
        </div>

        {/* Навигация */}
        <nav className="border-t border-slate-100/70">
          <div className="flex items-center justify-between gap-1 py-1 sm:justify-start sm:gap-6">
            <button
              onClick={() => setActiveTab('clothing')}
              className={`py-2 px-1 font-extrabold text-[9px] xs:text-[11px] sm:text-sm border-b-2 transition flex flex-col xs:flex-row items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap flex-1 sm:flex-none ${
                activeTab === 'clothing' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>👕</span>
              <span>Одежда</span>
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`py-2 px-1 font-extrabold text-[9px] xs:text-[11px] sm:text-sm border-b-2 transition flex flex-col xs:flex-row items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap flex-1 sm:flex-none ${
                activeTab === 'tips' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>💡</span>
              <span>Подсказки</span>
            </button>
            <button
              onClick={() => setActiveTab('parameters')}
              className={`py-2 px-1 font-extrabold text-[9px] xs:text-[11px] sm:text-sm border-b-2 transition flex flex-col xs:flex-row items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap flex-1 sm:flex-none ${
                activeTab === 'parameters' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Baby size={14} className="shrink-0" />
              <span>Параметры</span>
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`py-2 px-1 font-extrabold text-[9px] xs:text-[11px] sm:text-sm border-b-2 transition flex flex-col xs:flex-row items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap flex-1 sm:flex-none ${
                activeTab === 'simulator' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <RefreshCw size={14} className="shrink-0" />
              <span>Симулятор</span>
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`py-2 px-1 font-extrabold text-[9px] xs:text-[11px] sm:text-sm border-b-2 transition flex flex-col xs:flex-row items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap flex-1 sm:flex-none ${
                activeTab === 'faq' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <HelpCircle size={14} className="shrink-0" />
              <span>FAQ</span>
            </button>
          </div>
        </nav>

        {/* Контент */}
        <div className="mt-4 sm:mt-6">
          {activeTab === 'clothing' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <WeatherDisplay weather={weather} loading={loading} error={error} />
                <ClothingRecommendations weather={weather} timeOfDay={timeOfDay} />
              </div>
              <div className="space-y-4 sm:space-y-6">
                <ChildFigure weather={weather} timeOfDay={timeOfDay} />
                <AccessoriesRecommendations weather={weather} />
              </div>
            </div>
          )}
          
          {activeTab === 'tips' && (
            <div className="max-w-4xl mx-auto">
              <ParentTipsSection tips={tipsPool} /> {/* ← ИСПРАВЛЕНО! Передаем ВЕСЬ массив */}
            </div>
          )}
          
          {activeTab === 'parameters' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-4">Параметры ребенка</h2>
                <p className="text-slate-500">Здесь будут настройки параметров ребенка</p>
              </div>
            </div>
          )}
          
          {activeTab === 'simulator' && (
            <div className="max-w-4xl mx-auto">
              <Simulator />
            </div>
          )}
          
          {activeTab === 'faq' && (
            <div className="max-w-4xl mx-auto">
              <FAQ />
            </div>
          )}
        </div>
        
        {/* Disclaimer */}
        <Disclaimer />
      </div>
    </div>
  );
}

export default App;
