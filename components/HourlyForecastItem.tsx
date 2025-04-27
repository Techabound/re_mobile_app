import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HourlyForecast } from '@/context/WeatherContext';
import { useWeatherContext } from '@/context/WeatherContext';
import { getWeatherIcon } from '@/utils/weatherIcons';

interface HourlyForecastItemProps {
  hourData: HourlyForecast;
  isCurrentHour?: boolean;
}

const HourlyForecastItem: React.FC<HourlyForecastItemProps> = ({ 
  hourData, 
  isCurrentHour = false 
}) => {
  const { weatherTheme } = useWeatherContext();
  const icon = getWeatherIcon(hourData.condition);
  
  return (
    <View style={[
      styles.container,
      isCurrentHour && { 
        backgroundColor: `${weatherTheme.primaryColor}20`,
        borderColor: weatherTheme.primaryColor,
      }
    ]}>
      <Text style={[
        styles.time, 
        { color: isCurrentHour ? weatherTheme.primaryColor : weatherTheme.textColor }
      ]}>
        {hourData.time}
      </Text>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={[
        styles.temperature, 
        { color: isCurrentHour ? weatherTheme.primaryColor : weatherTheme.textColor }
      ]}>
        {Math.round(hourData.temperature)}°
      </Text>
      
      {hourData.chanceOfRain > 0 && (
        <View style={styles.rainChanceContainer}>
          <Text style={[
            styles.rainChance, 
            { color: weatherTheme.secondaryColor }
          ]}>
            {hourData.chanceOfRain}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    marginHorizontal: 6,
    width: 70,
  },
  time: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 6,
  },
  iconContainer: {
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  temperature: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  rainChanceContainer: {
    marginTop: 4,
  },
  rainChance: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  }
});

export default HourlyForecastItem;