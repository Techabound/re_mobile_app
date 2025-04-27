import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { getWeatherData } from '@/services/weatherService';
import { useLocationContext } from './LocationContext';
import { Platform } from 'react-native';

const defaultTheme: WeatherTheme = {
  primaryColor: '#FF3B30', // Red
  secondaryColor: '#8E8E93', // Smokey gray
  backgroundColor: '#1C1C1E', // Dark background
  cardColor: '#2C2C2E', // Slightly lighter dark
  textColor: '#FFFFFF', // White
  inactiveColor: '#636366', // Inactive state
};

const weatherThemes: Record<string, WeatherTheme> = {
  sunny: {
    primaryColor: '#FF3B30',
    secondaryColor: '#8E8E93',
    backgroundColor: '#1C1C1E',
    cardColor: '#2C2C2E',
    textColor: '#FFFFFF',
    inactiveColor: '#636366',
  },
  cloudy: {
    primaryColor: '#FF3B30',
    secondaryColor: '#8E8E93',
    backgroundColor: '#1C1C1E',
    cardColor: '#2C2C2E',
    textColor: '#FFFFFF',
    inactiveColor: '#636366',
  },
  rainy: {
    primaryColor: '#FF3B30',
    secondaryColor: '#8E8E93',
    backgroundColor: '#1C1C1E',
    cardColor: '#2C2C2E',
    textColor: '#FFFFFF',
    inactiveColor: '#636366',
  },
  night: {
    primaryColor: '#FF3B30',
    secondaryColor: '#8E8E93',
    backgroundColor: '#1C1C1E',
    cardColor: '#2C2C2E',
    textColor: '#FFFFFF',
    inactiveColor: '#636366',
  },
};

const WeatherContext = createContext<WeatherContextType>({
  weatherData: null,
  weatherTheme: defaultTheme,
  error: null,
  loading: true,
  refreshWeather: async () => {},
});

export const useWeatherContext = () => useContext(WeatherContext);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { location, errorMsg: locationError } = useLocationContext();

  const weatherTheme = useMemo(() => {
    if (!weatherData) return defaultTheme;

    const condition = weatherData.current.condition.toLowerCase();
    const hour = new Date().getHours();
    const isNight = hour >= 19 || hour <= 5;
    
    let themeKey: string;
    if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('thunder')) {
      themeKey = 'rainy';
    } else if (condition.includes('cloud') || condition.includes('overcast') || condition.includes('fog') || condition.includes('mist')) {
      themeKey = 'cloudy';
    } else if (isNight) {
      themeKey = 'night';
    } else {
      themeKey = 'sunny';
    }
    
    return weatherThemes[themeKey];
  }, [weatherData]);

  const getMockData = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    
    return {
      location: {
        name: 'Ahmedabad',
        region: 'Gujarat',
        country: 'India',
        lat: 23.03,
        lon: 72.587,
        localtime: now.toISOString(),
      },
      current: {
        temperature: 32,
        tempF: 89.6,
        condition: 'Partly Sunny',
        conditionIcon: 'partly-cloudy-day',
        humidity: 45,
        windSpeed: 12,
        windDirection: 'NE',
        uvIndex: 7,
        precipitation: 0,
        feelsLike: 34,
        feelsLikeF: 93.2,
        pressure: 1013,
        visibility: 10,
        sunrise: '06:05 AM',
        sunset: '07:16 PM',
        lastUpdated: now.toISOString(),
      },
      hourly: Array(24).fill(null).map((_, i) => {
        const hourTime = new Date(now);
        hourTime.setHours(currentHour + i);
        return {
          time: hourTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          temperature: Math.round(28 + 8 * Math.sin((i / 24) * Math.PI * 2)),
          tempF: Math.round((28 + 8 * Math.sin((i / 24) * Math.PI * 2)) * 9/5 + 32),
          condition: i < 6 ? 'Sunny' : i < 12 ? 'Partly cloudy' : i < 18 ? 'Cloudy' : 'Clear',
          conditionIcon: i < 6 ? 'sun' : i < 12 ? 'cloud-sun' : i < 18 ? 'cloud' : 'moon',
          chanceOfRain: i > 15 && i < 20 ? 30 : 0,
        };
      }),
      daily: Array(7).fill(null).map((_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() + i);
        return {
          date: date.toISOString(),
          day: date.toLocaleDateString('en-US', { weekday: 'long' }),
          maxTemp: Math.round(30 + 5 * Math.sin((i / 7) * Math.PI)),
          maxTempF: Math.round((30 + 5 * Math.sin((i / 7) * Math.PI)) * 9/5 + 32),
          minTemp: Math.round(22 + 3 * Math.sin((i / 7) * Math.PI)),
          minTempF: Math.round((22 + 3 * Math.sin((i / 7) * Math.PI)) * 9/5 + 32),
          condition: i % 7 === 0 ? 'Sunny' : i % 7 === 1 ? 'Partly cloudy' : i % 7 === 2 ? 'Cloudy' : i % 7 === 3 ? 'Light rain' : i % 7 === 4 ? 'Moderate rain' : i % 7 === 5 ? 'Sunny' : 'Clear',
          conditionIcon: i % 7 === 0 ? 'sun' : i % 7 === 1 ? 'cloud-sun' : i % 7 === 2 ? 'cloud' : i % 7 === 3 ? 'cloud-drizzle' : i % 7 === 4 ? 'cloud-rain' : i % 7 === 5 ? 'sun' : 'moon',
          chanceOfRain: i % 7 === 3 ? 40 : i % 7 === 4 ? 80 : 0,
          humidity: 45 + i * 5,
          sunrise: '06:05 AM',
          sunset: '07:16 PM',
        };
      }),
    };
  }, []);

  const refreshWeather = useCallback(async () => {
    if (!location) {
      setError('Location not available. Please enable location services.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherData(
        location.coords.latitude,
        location.coords.longitude
      );
      setWeatherData(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch weather data. Please try again later.');
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    if (location) {
      refreshWeather();
    }
  }, [location, refreshWeather]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setWeatherData(getMockData);
      setLoading(false);
      return;
    }

    const intervalId = setInterval(() => {
      if (location) {
        refreshWeather();
      }
    }, 60000); // Refresh every minute

    return () => clearInterval(intervalId);
  }, [location, refreshWeather, getMockData]);

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        weatherTheme,
        error,
        loading,
        refreshWeather,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export { WeatherProvider }

export { useWeatherContext }