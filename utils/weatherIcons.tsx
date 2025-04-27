import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Sun, Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning, Moon, CloudSun, CloudMoon } from 'lucide-react-native';
import { useWeatherContext } from '@/context/WeatherContext';

export function getWeatherIcon(condition: string) {
  const { weatherTheme } = useWeatherContext();
  const iconSize = 40;
  const iconColor = weatherTheme.primaryColor;

  // Determine if it's currently night time
  const currentHour = new Date().getHours();
  const isNight = currentHour >= 19 || currentHour <= 5;

  // Map condition to appropriate icon
  const conditionLower = condition.toLowerCase();
  
  if (isNight) {
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
      return <Moon size={iconSize} color={iconColor} />;
    }
    
    if (conditionLower.includes('partly cloudy')) {
      return <CloudMoon size={iconSize} color={iconColor} />;
    }
  } else {
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
      return <Sun size={iconSize} color={iconColor} />;
    }
    
    if (conditionLower.includes('partly cloudy')) {
      return <CloudSun size={iconSize} color={iconColor} />;
    }
  }
  
  if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
    return <Cloud size={iconSize} color={iconColor} />;
  }
  
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('shower')) {
    return <CloudRain size={iconSize} color={iconColor} />;
  }
  
  if (conditionLower.includes('snow') || conditionLower.includes('sleet') || conditionLower.includes('ice')) {
    return <CloudSnow size={iconSize} color={iconColor} />;
  }
  
  if (conditionLower.includes('fog') || conditionLower.includes('mist') || conditionLower.includes('haze')) {
    return <CloudFog size={iconSize} color={iconColor} />;
  }
  
  if (conditionLower.includes('thunder') || conditionLower.includes('lightning')) {
    return <CloudLightning size={iconSize} color={iconColor} />;
  }
  
  // Default to sun or moon based on time
  return isNight ? <Moon size={iconSize} color={iconColor} /> : <Sun size={iconSize} color={iconColor} />;
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});