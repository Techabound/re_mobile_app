import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWeatherContext } from '@/context/WeatherContext';
import { useLocationContext } from '@/context/LocationContext';
import WeatherCard from '@/components/WeatherCard';
import HourlyForecastItem from '@/components/HourlyForecastItem';
import LocationInfo from '@/components/LocationInfo';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function TodayScreen() {
  const { weatherData, weatherTheme, loading, error, refreshWeather } = useWeatherContext();
  const { location, refreshLocation } = useLocationContext();
  const [refreshing, setRefreshing] = React.useState(false);
  const [mapReady, setMapReady] = React.useState(false);

  const currentHour = new Date().getHours();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshLocation();
    await refreshWeather();
    setRefreshing(false);
  }, [refreshLocation, refreshWeather]);

  const mapStyle = useMemo(() => [
    {
      "elementType": "geometry",
      "stylers": [{"color": "#1C1C1E"}]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#FFFFFF"}]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{"color": "#2C2C2E"}]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [{"color": "#FF3B30"}]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{"color": "#2C2C2E"}]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#8E8E93"}]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{"color": "#000000"}]
    }
  ], []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: weatherTheme.backgroundColor }]}>
      <StatusBar style="light" />
      
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
        <WeatherCard />
        
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: '#FF3B30' }]}>{error}</Text>
          </View>
        ) : (
          <>
            {location && Platform.OS !== 'web' && (
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  provider={PROVIDER_GOOGLE}
                  customMapStyle={mapStyle}
                  initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  onMapReady={() => setMapReady(true)}
                >
                  {mapReady && (
                    <Marker
                      coordinate={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                      }}
                      pinColor={weatherTheme.primaryColor}
                    />
                  )}
                </MapView>
              </View>
            )}

            <LocationInfo />

            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { color: weatherTheme.textColor }]}>
                Today's Forecast
              </Text>
              
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hourlyContainer}
              >
                {weatherData?.hourly.slice(0, 24).map((hour, index) => (
                  <HourlyForecastItem
                    key={`hour-${index}`}
                    hourData={hour}
                    isCurrentHour={hour.time.split(':')[0] === currentHour.toString()}
                  />
                ))}
              </ScrollView>
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
  mapContainer: {
    margin: 16,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  map: {
    flex: 1,
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
  hourlyContainer: {
    paddingHorizontal: 10,
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});