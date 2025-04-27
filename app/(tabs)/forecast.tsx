import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWeatherContext } from '@/context/WeatherContext';
import { useLocationContext } from '@/context/LocationContext';
import WeatherCard from '@/components/WeatherCard';
import DailyForecastItem from '@/components/DailyForecastItem';
import WeatherDetails from '@/components/WeatherDetails';

export default function ForecastScreen() {
  const { weatherData, weatherTheme, loading, error, refreshWeather } = useWeatherContext();
  const { refreshLocation } = useLocationContext();
  const [refreshing, setRefreshing] = React.useState(false);

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
                7-Day Forecast
              </Text>
              
              <View style={styles.dailyContainer}>
                {weatherData?.daily.map((day, index) => (
                  <DailyForecastItem
                    key={`day-${index}`}
                    dayData={day}
                    isToday={index === 0}
                  />
                ))}
              </View>
            </View>
            
            <WeatherDetails />
            
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
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  dailyContainer: {
    paddingHorizontal: 16,
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
    marginBottom: 16,
  },
  poweredByText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});