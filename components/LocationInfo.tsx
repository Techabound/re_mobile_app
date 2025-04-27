import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocationContext } from '@/context/LocationContext';
import { useWeatherContext } from '@/context/WeatherContext';
import { MapPin, Navigation, Building2, Globe as Globe2 } from 'lucide-react-native';

const LocationInfo: React.FC = () => {
  const { address, errorMsg, loading } = useLocationContext();
  const { weatherTheme } = useWeatherContext();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={[styles.loadingText, { color: weatherTheme.textColor }]}>
          Fetching location details...
        </Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={[styles.errorText, { color: '#f43f5e' }]}>
          {errorMsg}
        </Text>
      </View>
    );
  }

  if (!address) {
    return (
      <View style={styles.container}>
        <Text style={[styles.errorText, { color: weatherTheme.secondaryColor }]}>
          Unable to retrieve address information.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: weatherTheme.cardColor }]}>
        <View style={styles.detailRow}>
          <Navigation size={20} color={weatherTheme.primaryColor} />
          <Text style={[styles.detailText, { color: weatherTheme.textColor }]}>
            {address.name || address.street || 'Street not available'}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Building2 size={20} color={weatherTheme.primaryColor} />
          <Text style={[styles.detailText, { color: weatherTheme.textColor }]}>
            {address.city || address.subregion || address.district || 'City not available'}
            {address.postalCode ? `, ${address.postalCode}` : ''}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Globe2 size={20} color={weatherTheme.primaryColor} />
          <Text style={[styles.detailText, { color: weatherTheme.textColor }]}>
            {address.region || 'Region not available'}, {address.country || 'Country not available'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 12,
    flex: 1,
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default LocationInfo;