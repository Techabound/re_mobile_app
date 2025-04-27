import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useWeatherContext } from '@/context/WeatherContext';
import { getWeatherIcon } from '@/utils/weatherIcons';

interface WeatherCardProps {
  compact?: boolean;
  showDetails?: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ 
  compact = false,
  showDetails = true
}) => {
  const { weatherData, weatherTheme, loading } = useWeatherContext();
  
  const icon = useMemo(() => {
    return weatherData ? getWeatherIcon(weatherData.current.condition) : null;
  }, [weatherData]);

  const formattedDate = useMemo(() => {
    if (!weatherData) return '';
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: '2-digit',
    }).toUpperCase();
  }, [weatherData]);

  const content = useMemo(() => {
    if (loading || !weatherData) {
      return (
        <Text style={[styles.loadingText, { color: weatherTheme.textColor }]}>
          Loading weather data...
        </Text>
      );
    }

    const { current, location } = weatherData;

    return (
      <>
        <View style={styles.headerContainer}>
          <View>
            <Text style={[styles.locationName, { color: weatherTheme.textColor }]}>
              {location.name}
            </Text>
            <Text style={[styles.locationCountry, { color: weatherTheme.secondaryColor }]}>
              {location.country}
            </Text>
          </View>
          {!compact && (
            <Text style={[styles.date, { color: weatherTheme.secondaryColor }]}>
              {formattedDate}
            </Text>
          )}
        </View>

        <View style={compact ? styles.compactMainInfo : styles.mainInfo}>
          <View style={styles.temperatureContainer}>
            <Text style={[
              styles.temperature, 
              { color: weatherTheme.primaryColor },
              compact ? styles.compactTemperature : {}
            ]}>
              {Math.round(current.temperature)}°
            </Text>
            {icon}
          </View>
          <Text style={[
            styles.condition, 
            { color: weatherTheme.textColor },
            compact ? styles.compactCondition : {}
          ]}>
            {current.condition}
          </Text>
        </View>

        {showDetails && !compact && (
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: weatherTheme.secondaryColor }]}>
                Humidity
              </Text>
              <Text style={[styles.detailValue, { color: weatherTheme.textColor }]}>
                {current.humidity}%
              </Text>
            </View>
            <View style={styles.detailSeparator} />
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: weatherTheme.secondaryColor }]}>
                Wind
              </Text>
              <Text style={[styles.detailValue, { color: weatherTheme.textColor }]}>
                {current.windSpeed} km/h
              </Text>
            </View>
            <View style={styles.detailSeparator} />
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: weatherTheme.secondaryColor }]}>
                Feels Like
              </Text>
              <Text style={[styles.detailValue, { color: weatherTheme.textColor }]}>
                {Math.round(current.feelsLike)}°
              </Text>
            </View>
          </View>
        )}
      </>
    );
  }, [weatherData, loading, compact, showDetails, weatherTheme, icon, formattedDate]);

  return (
    <View style={[
      styles.card, 
      { backgroundColor: weatherTheme.cardColor },
      compact ? styles.compactCard : {}
    ]}>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  compactCard: {
    padding: 10,
    marginVertical: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  locationName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  locationCountry: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  mainInfo: {
    marginBottom: 20,
  },
  compactMainInfo: {
    marginBottom: 8,
    alignItems: 'center',
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temperature: {
    fontSize: 72,
    fontFamily: 'Inter-Bold',
    marginRight: 12,
  },
  compactTemperature: {
    fontSize: 36,
  },
  condition: {
    fontSize: 20,
    fontFamily: 'Inter-Medium',
    marginTop: 6,
  },
  compactCondition: {
    fontSize: 14,
    marginTop: 2,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailSeparator: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 16,
  },
});

export default WeatherCard;