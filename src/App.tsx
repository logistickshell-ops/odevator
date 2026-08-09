import React, { useState, useEffect } from 'react';

interface WeatherData {
  temp: number;
  feelsLike: number;
  windSpeed: number;
  humidity: number;
  description: string;
  icon: string;
  isRainy: boolean;
  isSnowy: boolean;
}

interface ClothingItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
  description: string;
}

interface Outfit {
  base: ClothingItem[];
  middle: ClothingItem[];
  outer: ClothingItem[];
  shoes: ClothingItem[];
  accessories: ClothingItem[];
  advice: string[];
}

function generateOutfit(temp: number, isRainy: boolean, isSnowy: boolean): Outfit {
  const outfit: Outfit = {
    base: [],
    middle: [],
    outer: [],
    shoes: [],
    accessories: [],
    advice: [],
  };

  if (temp <= -20) {
    outfit.base.push({ id: 'thermal_heavy', name: 'Термобелье шерстяное', emoji: '👔', category: 'base', description: 'Плотное шерстяное термобелье' });
    outfit.middle.push({ id: 'fleece_heavy', name: 'Флисовый костюм', emoji: '🧥', category: 'middle', description: 'Толстый флисовый поддев' });
    outfit.outer.push({ id: 'winter_heavy', name: 'Зимний пуховик', emoji: '🧥', category: 'outer', description: 'Пуховик на -30°C' });
    outfit.shoes.push({ id: 'valenki', name: 'Валенки', emoji: '👢', category: 'shoes', description: 'Теплые валенки с шерстью' });
    outfit.accessories.push({ id: 'hat_helmet', name: 'Шапка-шлем', emoji: '🎿', category: 'accessory', description: 'Теплая шапка-шлем' });
    outfit.accessories.push({ id: 'mittens', name: 'Варежки меховые', emoji: '🧤', category: 'accessory', description: 'Варежки на меху' });
    outfit.advice.push('При сильном морозе ограничьте прогулку 20-30 минутами');
  } else if (temp <= -10) {
    outfit.base.push({ id: 'thermal_medium', name: 'Термобелье', emoji: '👔', category: 'base', description: 'Термобелье из полиэстера' });
    outfit.middle.push({ id: 'fleece_medium', name: 'Флисовая кофта', emoji: '🧥', category: 'middle', description: 'Кофта из флиса' });
    outfit.outer.push({ id: 'winter_medium', name: 'Зимняя куртка', emoji: '🧥', category: 'outer', description: 'Утепленная зимняя куртка' });
    outfit.shoes.push({ id: 'winter_boots', name: 'Зимние ботинки', emoji: '👢', category: 'shoes', description: 'Ботинки с мехом' });
    outfit.accessories.push({ id: 'hat_warm', name: 'Теплая шапка', emoji: '🎿', category: 'accessory', description: 'Шерстяная шапка' });
    outfit.accessories.push({ id: 'gloves_warm', name: 'Перчатки теплые', emoji: '🧤', category: 'accessory', description: 'Шерстяные перчатки' });
  } else if (temp <= 0) {
    outfit.base.push({ id: 'base_layer', name: 'Термобелье легкое', emoji: '👕', category: 'base', description: 'Легкое термобелье' });
    outfit.middle.push({ id: 'sweater', name: 'Свитер', emoji: '🧶', category: 'middle', description: 'Шерстяной свитер' });
    outfit.outer.push({ id: 'jacket_demi', name: 'Демисезонная куртка', emoji: '🧥', category: 'outer', description: 'Утепленная куртка' });
    outfit.shoes.push({ id: 'boots_demi', name: 'Ботинки демисезонные', emoji: '👞', category: 'shoes', description: 'Утепленные ботинки' });
    outfit.accessories.push({ id: 'hat_light', name: 'Шапка легкая', emoji: '🧢', category: 'accessory', description: 'Трикотажная шапка' });
  } else if (temp <= 10) {
    outfit.base.push({ id: 'longsleeve', name: 'Лонгслив', emoji: '👕', category: 'base', description: 'Хлопковый лонгслив' });
    outfit.outer.push({ id: 'windbreaker', name: 'Ветровка', emoji: '🧥', category: 'outer', description: 'Легкая ветровка' });
    outfit.shoes.push({ id: 'sneakers', name: 'Кроссовки', emoji: '👟', category: 'shoes', description: 'Удобные кроссовки' });
    if (temp < 5) {
      outfit.accessories.push({ id: 'hat_thin', name: 'Тонкая шапка', emoji: '🧢', category: 'accessory', description: 'Тонкая шапочка' });
    }
  } else if (temp <= 20) {
    outfit.base.push({ id: 'tshirt', name: 'Футболка', emoji: '👕', category: 'base', description: 'Хлопковая футболка' });
    if (temp < 18) {
      outfit.middle.push({ id: 'hoodie', name: 'Худи', emoji: '🧥', category: 'middle', description: 'Легкое худи' });
    }
    outfit.shoes.push({ id: 'sneakers_light', name: 'Кеды', emoji: '👟', category: 'shoes', description: 'Легкие кеды' });
  } else if (temp <= 30) {
    outfit.base.push({ id: 'tshirt_summer', name: 'Футболка/майка', emoji: '👕', category: 'base', description: 'Легкая футболка' });
    outfit.shoes.push({ id: 'sandals', name: 'Сандалии', emoji: '👡', category: 'shoes', description: 'Открытые сандалии' });
    outfit.accessories.push({ id: 'cap', name: 'Кепка/панама', emoji: '👒', category: 'accessory', description: 'Головной убор от солнца' });
  } else {
    outfit.base.push({ id: 'tank_top', name: 'Майка/топ', emoji: '👕', category: 'base', description: 'Легкая майка' });
    outfit.shoes.push({ id: 'sandals_open', name: 'Босоножки', emoji: '👡', category: 'shoes', description: 'Открытые босоножки' });
    outfit.accessories.push({ id: 'cap_sun', name: 'Панама', emoji: '👒', category: 'accessory', description: 'Защита от солнца' });
    outfit.advice.push('Избегайте прогулок в пик жары (12:00-16:00)');
  }

  if (isRainy) {
    outfit.shoes = [{ id: 'rubber_boots', name: 'Резиновые сапоги', emoji: '👢', category: 'shoes', description: 'Непромокаемые сапоги' }];
    outfit.accessories.push({ id: 'raincoat', name: 'Дождевик', emoji: '☂️', category: 'accessory', description: 'Непромокаемый плащ' });
  }

  if (isSnowy && temp > -5) {
    outfit.shoes = [{ id: 'snow_boots', name: 'Снегоступы', emoji: '👢', category: 'shoes', description: 'Непромокаемая обувь' }];
  }

  return outfit;
}

export default function App() {
  const [weather, setWeather] = useState<WeatherData>({
    temp: 12,
    feelsLike: 10,
    windSpeed: 10,
    humidity: 60,
    description: 'Переменная облачность',
    icon: '⛅',
    isRainy: false,
    isSnowy: false,
  });

  const [city, setCity] = useState('Ярославль');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [manualMode, setManualMode] = useState(false);
  const [manualTemp, setManualTemp] = useState(12);
  const [manualWind, setManualWind] = useState(10);
  const [manualHumidity, setManualHumidity] = useState(60);
  const [manualCondition, setManualCondition] = useState('sunny');

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError('');
    
    try {
      // Сначала получаем координаты
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=ru&format=json`);
      const geoData = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('Город не найден');
      }
      
      const { latitude, longitude, name, country } = geoData.results[0];
      setCity(name);
      
      // Получаем погоду
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`);
      const weatherData = await weatherRes.json();
      
      const current = weatherData.current;
      const temp = Math.round(current.temperature_2m);
      const feelsLike = Math.round(current.apparent_temperature);
      const windSpeed = Math.round(current.wind_speed_10m);
      const humidity = current.relative_humidity_2m;
      const code = current.weather_code;
      
      let description = 'Ясно';
      let icon = '☀️';
      let isRainy = false;
      let isSnowy = false;
      
      if (code === 0) { description = 'Ясно'; icon = '☀️'; }
      else if (code <= 3) { description = 'Облачно'; icon = '⛅'; }
      else if (code <= 48) { description = 'Туман'; icon = '🌫️'; }
      else if (code <= 55) { description = 'Морось'; icon = '🌧️'; isRainy = true; }
      else if (code <= 65) { description = 'Дождь'; icon = '🌧️'; isRainy = true; }
      else if (code <= 75) { description = 'Снег'; icon = '🌨️'; isSnowy = true; }
      else if (code <= 82) { description = 'Ливень'; icon = '⛈️'; isRainy = true; }
      else if (code <= 86) { description = 'Снегопад'; icon = '🌨️'; isSnowy = true; }
      else if (code <= 99) { description = 'Гроза'; icon = '⛈️'; isRainy = true; }
      
      setWeather({ temp, feelsLike, windSpeed, humidity, description, icon, isRainy, isSnowy });
    } catch (err: any) {
      setError(err.message || 'Ошибка получения погоды');
      // Используем мок-данные
      setWeather({
        temp: 10,
        feelsLike: 8,
        windSpeed: 15,
        humidity: 70,
        description: 'Пасмурно',
        icon: '☁️',
        isRainy: true,
        isSnowy: false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather('Ярославль');
  }, []);

  const handleCitySearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchCity = formData.get('city') as string;
    if (searchCity.trim()) {
      fetchWeather(searchCity.trim());
    }
  };

  const currentWeather = manualMode ? {
    temp: manualTemp,
    feelsLike: manualTemp - Math.round(manualWind * 0.3),
    windSpeed: manualWind,
    humidity: manualHumidity,
    description: manualCondition === 'sunny' ? 'Ясно' : manualCondition === 'cloudy' ? 'Облачно' : manualCondition === 'rainy' ? 'Дождь' : 'Снег',
    icon: manualCondition === 'sunny' ? '☀️' : manualCondition === 'cloudy' ? '☁️' : manualCondition === 'rainy' ? '🌧️' : '🌨️',
    isRainy: manualCondition === 'rainy',
    isSnowy: manualCondition === 'snowy',
  } : weather;

  const outfit = generateOutfit(currentWeather.temp, currentWeather.isRainy, currentWeather.isSnowy);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <div style={{ fontSize: '60px', marginBottom: '10px' }}>🌤️</div>
          <h1 style={{ color: 'white', fontSize: '32px', fontWeight: '900', margin: '0' }}>МетеоОдевайка</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '5px' }}>
            Одеваем детей по погоде
          </p>
        </div>

        {/* City Search */}
        <form onSubmit={handleCitySearch} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              name="city"
              type="text"
              placeholder="Введите город..."
              defaultValue={city}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '16px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                background: '#4F46E5',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              {loading ? '...' : '🔍'}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div style={{ 
            background: '#FEF3C7', 
            color: '#92400E', 
            padding: '12px', 
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '14px',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Weather Card */}
        <div style={{ 
          background: 'white', 
          borderRadius: '20px', 
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#6B7280', fontWeight: '600' }}>📍 {city}</div>
              <div style={{ fontSize: '48px', fontWeight: '900', color: '#1F2937', marginTop: '5px' }}>
                {currentWeather.temp}°C
              </div>
              <div style={{ fontSize: '16px', color: '#6B7280', marginTop: '5px' }}>
                {currentWeather.icon} {currentWeather.description}
              </div>
            </div>
            <div style={{ fontSize: '60px' }}>{currentWeather.icon}</div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div style={{ background: '#F3F4F6', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>Ощущается</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{currentWeather.feelsLike}°C</div>
            </div>
            <div style={{ background: '#F3F4F6', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>Ветер</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{currentWeather.windSpeed} км/ч</div>
            </div>
            <div style={{ background: '#F3F4F6', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>Влажность</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{currentWeather.humidity}%</div>
            </div>
          </div>
        </div>

        {/* Manual Mode Toggle */}
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <button
            onClick={() => setManualMode(!manualMode)}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              background: manualMode ? '#10B981' : '#6B7280',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {manualMode ? '✅ Ручной режим' : '🎛️ Включить ручной режим'}
          </button>
        </div>

        {/* Manual Controls */}
        {manualMode && (
          <div style={{ 
            background: 'white', 
            borderRadius: '20px', 
            padding: '20px',
            marginBottom: '20px',
          }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#374151' }}>
                Температура: {manualTemp}°C
              </label>
              <input
                type="range"
                min="-30"
                max="40"
                value={manualTemp}
                onChange={(e) => setManualTemp(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#374151' }}>
                Ветер: {manualWind} км/ч
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={manualWind}
                onChange={(e) => setManualWind(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#374151' }}>
                Влажность: {manualHumidity}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={manualHumidity}
                onChange={(e) => setManualHumidity(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#374151' }}>
                Погодные условия
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {(['sunny', 'cloudy', 'rainy', 'snowy'] as const).map((cond) => (
                  <button
                    key={cond}
                    onClick={() => setManualCondition(cond)}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border: '2px solid',
                      borderColor: manualCondition === cond ? '#4F46E5' : '#E5E7EB',
                      background: manualCondition === cond ? '#EEF2FF' : 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    {cond === 'sunny' ? '☀️ Ясно' : 
                     cond === 'cloudy' ? '☁️ Облачно' : 
                     cond === 'rainy' ? '🌧️ Дождь' : '🌨️ Снег'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Outfit Recommendation */}
        <div style={{ 
          background: 'white', 
          borderRadius: '20px', 
          padding: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1F2937', marginBottom: '20px', textAlign: 'center' }}>
            👕 Рекомендуемая одежда
          </h2>

          {outfit.base.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#4F46E5', marginBottom: '10px' }}>Базовый слой</h3>
              {outfit.base.map(item => (
                <div key={item.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  padding: '10px',
                  background: '#F9FAFB',
                  borderRadius: '10px',
                  marginBottom: '5px',
                }}>
                  <span style={{ fontSize: '30px' }}>{item.emoji}</span>
                  <div>
                    <div style={{ fontWeight: '700' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {outfit.middle.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#7C3AED', marginBottom: '10px' }}>Средний слой</h3>
              {outfit.middle.map(item => (
                <div key={item.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  padding: '10px',
                  background: '#F9FAFB',
                  borderRadius: '10px',
                  marginBottom: '5px',
                }}>
                  <span style={{ fontSize: '30px' }}>{item.emoji}</span>
                  <div>
                    <div style={{ fontWeight: '700' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {outfit.outer.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#DC2626', marginBottom: '10px' }}>Верхняя одежда</h3>
              {outfit.outer.map(item => (
                <div key={item.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  padding: '10px',
                  background: '#F9FAFB',
                  borderRadius: '10px',
                  marginBottom: '5px',
                }}>
                  <span style={{ fontSize: '30px' }}>{item.emoji}</span>
                  <div>
                    <div style={{ fontWeight: '700' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#059669', marginBottom: '10px' }}>Обувь</h3>
            {outfit.shoes.map(item => (
              <div key={item.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                padding: '10px',
                background: '#F9FAFB',
                borderRadius: '10px',
                marginBottom: '5px',
              }}>
                <span style={{ fontSize: '30px' }}>{item.emoji}</span>
                <div>
                  <div style={{ fontWeight: '700' }}>{item.name}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{item.description}</div>
                </div>
              </div>
            ))}
          </div>

          {outfit.accessories.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#D97706', marginBottom: '10px' }}>Аксессуары</h3>
              {outfit.accessories.map(item => (
                <div key={item.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  padding: '10px',
                  background: '#F9FAFB',
                  borderRadius: '10px',
                  marginBottom: '5px',
                }}>
                  <span style={{ fontSize: '30px' }}>{item.emoji}</span>
                  <div>
                    <div style={{ fontWeight: '700' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {outfit.advice.length > 0 && (
            <div style={{ 
              background: '#FEF3C7', 
              padding: '15px', 
              borderRadius: '10px',
              marginTop: '20px',
            }}>
              <div style={{ fontWeight: '700', color: '#92400E', marginBottom: '5px' }}>⚠️ Важные рекомендации:</div>
              {outfit.advice.map((adv, i) => (
                <div key={i} style={{ fontSize: '14px', color: '#92400E' }}>• {adv}</div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', padding: '30px 0', fontSize: '12px' }}>
          Создано с заботой о детях ❤️<br/>
          Данные погоды: Open-Meteo API
        </div>
      </div>
    </div>
  );
}
