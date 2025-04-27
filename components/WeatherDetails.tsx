import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useWeatherContext } from '@/context/WeatherContext';
import { Wind, Droplets, Sun, Sunrise, Sunset, Eye, CloudRain } from 'lucide-react-native';

const WeatherDetails: React.FC = () => {
  const { weatherData, weatherTheme, loading } = useWeatherContext();

  if (loading || !weatherData) {
    return (
      <View style={styles.container}>
        <Text style={[styles.loadingText, { color: weatherTheme.textColor }]}>
          Loading weather details...
        </Text>
      </View>
    );
  }

  const { current } = weatherData;

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: weatherTheme.textColor }]}>
        Weather Details
      </Text>
      
      <View style={styles.detailsGrid}>
        <View style={[styles.detailCard, { backgroundColor: weatherTheme.cardColor }]}>
          <Wind size={24} color={weatherTheme.primaryColor} />
          <Text style={[styles.detailLabel, { color: weatherTheme.secondaryColor }]}>
            Wind Speed
          </Text>
          <Text style={[styles.detailValue, { color: weatherTheme.textColor }]}>
            {current.windSpeed} km/h
          </Text>
          <Text style={[styles.detailSubValue, { color: weatherTheme.secondaryColor }]}>
            {current.windDirection}
          </Text>
        </View>
        
        <View style={[styles.detailCard, { backgroundColor: weatherTheme.cardColor }]}>
          <Droplets size={24} color={weatherTheme.primaryColor} />
          <Text style={[styles.detailLabel, { color: weatherTheme.secondaryColor }]}>
            Humidity
          </Text>
          <Text style={[styles.detailValue, { color: weatherTheme.textColor }]}>
            {current.humidity}%
          </Text>
        </View>
        
        <View style={[styles.detailCard, { backgroundColor: weatherTheme.cardColor }]}>
          <Sun size={24} color={weatherTheme.primaryColor} />
          <Text style={[styles.detailLabel, { color: weatherTheme.secondaryColor }]}>
            UV Index
          </Text>
          <Text style={[styles.detailValue, { color: weatherTheme.textColor }]}>
            {current.uvIndex}
          </Text>
          <Text style={[styles.detailSubValue, { color: weatherTheme.secondaryColor }]}>
            {getUvIndexCategory(current.uvIndex)}
          </Text>
        </View>
        
        <View style={[styles.detailCard, { backgroundColor: weatherTheme.cardColor }]}>
          <CloudRain size={24} color={weatherTheme.primaryColor} />
          <Text style={[styles.detailLabel, { color: weatherTheme.secondaryColor }]}>
            Precipitation
          </Text>
          <Text style={[styles.detailValue, { color: weatherTheme.textColor }]}>
            {current.precipitation} mm
          </Text>
        </View>
        
        <View style={[styles.detailCard, { backgroundColor: weatherTheme.cardColor }]}>
          <Sunrise size={24} color={weatherTheme.primaryColor} />
          <Text style={[styles.detailLabel, { color: weatherTheme.secondaryColor }]}>
            Sunrise
          </Text>
          <Text style={[styles.detailValue, { color: weatherTheme.textColor }]}>
            {current.sunrise}
          </Text>
        </View>
        
        <View style={[styles.detailCard, { backgroundColor: weatherTheme.cardColor }]}>
          <Sunset size={24} color={weatherTheme.primaryColor} />
          <Text style={[styles.detailLabel, { color: weatherTheme.secondaryColor }]}>
            Sunset
          </Text>
          <Text style={[styles.detailValue, { color: weatherTheme.textColor }]}>
            {current.sunset}
          </Text>
        </View>
        
        <View style={[styles.detailCard, { backgroundColor: weatherTheme.cardColor }]}>
          <Eye size={24} color={weatherTheme.primaryColor} />
          <Text style={[styles.detailLabel, { color: weatherTheme.secondaryColor }]}>
            Visibility
          </Text>
          <Text style={[styles.detailValue, { color: weatherTheme.textColor }]}>
            {current.visibility} km
          </Text>
        </View>
      </View>
    </View>
  );
};

// Helper function to determine UV index category
const getUvIndexCategory = (uvIndex: number): string => {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  detailSubValue: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default WeatherDetails;