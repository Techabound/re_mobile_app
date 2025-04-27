import axios from 'axios';
import { WeatherData } from '@/context/WeatherContext';
import { Platform } from 'react-native';

// Mock data for development and web preview
const createMockWeatherData = (latitude: number, longitude: number): WeatherData => {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  
  return {
    location: {
      name: 'Ahmedabad',
      region: 'Gujarat',
      country: 'India',
      lat: latitude,
      lon: longitude,
      localtime: currentDate.toLocaleString(),
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
      lastUpdated: new Date().toLocaleTimeString(),
    },
    hourly: Array(24).fill(null).map((_, i) => {
      const hour = (currentHour + i) % 24;
      return {
        time: `${hour}:00`,
        temperature: Math.round(28 + 8 * Math.sin((i / 24) * Math.PI * 2)),
        tempF: Math.round((28 + 8 * Math.sin((i / 24) * Math.PI * 2)) * 9/5 + 32),
        condition: hour < 6 ? 'Clear' : hour < 12 ? 'Sunny' : hour < 18 ? 'Partly cloudy' : 'Clear',
        conditionIcon: hour < 6 ? 'moon' : hour < 12 ? 'sun' : hour < 18 ? 'cloud-sun' : 'moon',
        chanceOfRain: hour > 15 && hour < 20 ? 30 : 0,
      };
    }),
    daily: Array(7).fill(null).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return {
        date: date.toLocaleDateString(),
        day: days[date.getDay()],
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
};

export const getWeatherData = async (
  latitude: number,
  longitude: number
): Promise<WeatherData> => {
  try {
    // For development and web preview, return mock data
    if (Platform.OS === 'web' || !process.env.EXPO_PUBLIC_WEATHER_API_KEY) {
      return createMockWeatherData(latitude, longitude);
    }

    const response = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${process.env.EXPO_PUBLIC_WEATHER_API_KEY}&q=${latitude},${longitude}&days=7&aqi=yes&alerts=yes`
    );

    return transformWeatherData(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

const transformWeatherData = (apiData: any): WeatherData => {
  return {
    location: {
      name: apiData.location.name,
      region: apiData.location.region,
      country: apiData.location.country,
      lat: apiData.location.lat,
      lon: apiData.location.lon,
      localtime: apiData.location.localtime,
    },
    current: {
      temperature: apiData.current.temp_c,
      tempF: apiData.current.temp_f,
      condition: apiData.current.condition.text,
      conditionIcon: apiData.current.condition.icon,
      humidity: apiData.current.humidity,
      windSpeed: apiData.current.wind_kph,
      windDirection: apiData.current.wind_dir,
      uvIndex: apiData.current.uv,
      precipitation: apiData.current.precip_mm,
      feelsLike: apiData.current.feelslike_c,
      feelsLikeF: apiData.current.feelslike_f,
      pressure: apiData.current.pressure_mb,
      visibility: apiData.current.vis_km,
      sunrise: apiData.forecast.forecastday[0].astro.sunrise,
      sunset: apiData.forecast.forecastday[0].astro.sunset,
      lastUpdated: apiData.current.last_updated,
    },
    hourly: apiData.forecast.forecastday[0].hour.map((hour: any) => ({
      time: hour.time.split(' ')[1],
      temperature: hour.temp_c,
      tempF: hour.temp_f,
      condition: hour.condition.text,
      conditionIcon: hour.condition.icon,
      chanceOfRain: hour.chance_of_rain,
    })),
    daily: apiData.forecast.forecastday.map((day: any) => {
      const date = new Date(day.date);
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      return {
        date: day.date,
        day: weekdays[date.getDay()],
        maxTemp: day.day.maxtemp_c,
        maxTempF: day.day.maxtemp_f,
        minTemp: day.day.mintemp_c,
        minTempF: day.day.mintemp_f,
        condition: day.day.condition.text,
        conditionIcon: day.day.condition.icon,
        chanceOfRain: day.day.daily_chance_of_rain,
        humidity: day.day.avghumidity,
        sunrise: day.astro.sunrise,
        sunset: day.astro.sunset,
      };
    }),
  };
};