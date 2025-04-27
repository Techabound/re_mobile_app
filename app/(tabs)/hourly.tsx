import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Platform, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWeatherContext } from '@/context/WeatherContext';
import { useLocationContext } from '@/context/LocationContext';
import WeatherCard from '@/components/WeatherCard';
import HourlyForecastItem from '@/components/HourlyForecastItem';

export default function HourlyScreen() {
  const { weatherData, weatherTheme, loading, error, refreshWeather } = useWeatherContext();
  const { refreshLocation } = useLocationContext();
  const [refreshing, setRefreshing] = React.useState(false);
  
  const currentHour = new Date().getHours();
  const windowWidth = Dimensions.get('window').width;
  const itemsPerRow = Math.floor(windowWidth / 85); // Approximately how many items can fit in a row

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshLocation();
    await refreshWeather();
    setRefreshing(false);
  }, [refreshLocation, refreshWeather]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: weatherTheme.backgroundColor }]}>
      <StatusBar style={weatherTheme.backgroundColor === '#ffffff' ? 'dark' : 'light'} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={weatherTheme.primaryColor}
            colors={[weatherTheme.primaryColor]}
          />
        }
      >
        <WeatherCard compact showDetails={false} />
        
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: '#f43f5e' }]}>{error}</Text>
          </View>
        ) : (
          <>
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { color: weatherTheme.textColor }]}>
                24-Hour Forecast
              </Text>
              
              <View style={styles.hourlyGridContainer}>
                {weatherData?.hourly.map((hour, index) => (
                  <View key={`hour-${index}`} style={styles.hourlyGridItem}>
                    <HourlyForecastItem
                      hourData={hour}
                      isCurrentHour={hour.time.split(':')[0] === currentHour.toString()}
                    />
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.poweredByContainer}>
              <Text style={[styles.poweredByText, { color: weatherTheme.secondaryColor }]}>
                Powered by ABC Pvt Ltd
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  sectionContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  hourlyGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  hourlyGridItem: {
    marginBottom: 12,
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f43f5e',
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  poweredByContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  poweredByText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});