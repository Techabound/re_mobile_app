import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

interface LocationContextType {
  location: Location.LocationObject | null;
  address: Location.LocationGeocodedAddress | null;
  errorMsg: string | null;
  loading: boolean;
  requestLocationPermission: () => Promise<void>;
  refreshLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType>({
  location: null,
  address: null,
  errorMsg: null,
  loading: true,
  requestLocationPermission: async () => {},
  refreshLocation: async () => {},
});

export const useLocationContext = () => useContext(LocationContext);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<Location.LocationGeocodedAddress | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshLocation = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }
      
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setLocation(currentLocation);
      
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      
      if (addressResponse && addressResponse.length > 0) {
        setAddress(addressResponse[0]);
      }
      
      setLoading(false);
    } catch (error) {
      setErrorMsg('Failed to get location or address information');
      setLoading(false);
    }
  }, []);

  const requestLocationPermission = async () => {
    setLoading(true);
    setErrorMsg(null);
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }
      
      await refreshLocation();
    } catch (error) {
      setErrorMsg('Failed to get location information');
      setLoading(false);
    }
  };

  // Initial location request
  useEffect(() => {
    if (Platform.OS === 'web') {
      setErrorMsg('Location services are limited on web. For best experience, use a mobile device.');
      setLoading(false);
      return;
    }
    
    requestLocationPermission();
  }, []);

  // Set up periodic location refresh
  useEffect(() => {
    if (Platform.OS === 'web') return;

    const intervalId = setInterval(() => {
      refreshLocation();
    }, 60000); // Refresh every minute

    return () => clearInterval(intervalId);
  }, [refreshLocation]);

  return (
    <LocationContext.Provider
      value={{
        location,
        address,
        errorMsg,
        loading,
        requestLocationPermission,
        refreshLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};