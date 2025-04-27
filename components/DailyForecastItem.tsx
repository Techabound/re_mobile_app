import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DailyForecast } from '@/context/WeatherContext';
import { useWeatherContext } from '@/context/WeatherContext';
import { getWeatherIcon } from '@/utils/weatherIcons';

interface DailyForecastItemProps {
  dayData: DailyForecast;
  isToday?: boolean;
}

const DailyForecastItem: React.FC<DailyForecastItemProps> = ({ 
  dayData, 
  isToday = false 
}) => {
  const { weatherTheme } = useWeatherContext();
  const icon = getWeatherIcon(dayData.condition);
  
  // Shortened day name (e.g., "Mon" instead of "Monday")
  const shortenedDay = isToday 
    ? 'Today' 
    : dayData.day.substring(0, 3);
  
  return (
    <View style={[
      styles.container,
      isToday && { 
        backgroundColor: `${weatherTheme.primaryColor}20`,
        borderColor: weatherTheme.primaryColor,
      }
    ]}>
      <Text style={[
        styles.day, 
        { color: isToday ? weatherTheme.primaryColor : weatherTheme.textColor }
      ]}>
        {shortenedDay}
      </Text>
      
      <View style={styles.iconContainer}>
        {icon}
      </View>
      
      {dayData.chanceOfRain > 0 && (
        <Text style={[styles.rainChance, { color: weatherTheme.secondaryColor }]}>
          {dayData.chanceOfRain}%
        </Text>
      )}
      
      <View style={styles.temperatureContainer}>
        <Text style={[styles.maxTemp, { color: weatherTheme.textColor }]}>
          {Math.round(dayData.maxTemp)}°
        </Text>
        <Text style={[styles.minTemp, { color: weatherTheme.secondaryColor }]}>
          {Math.round(dayData.minTemp)}°
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 8,
  },
  day: {
    width: 65,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rainChance: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginRight: 16,
  },
  temperatureContainer: {
    flexDirection: 'row',
    width: 80,
    justifyContent: 'flex-end',
  },
  maxTemp: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginRight: 12,
  },
  minTemp: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});

export default DailyForecastItem;