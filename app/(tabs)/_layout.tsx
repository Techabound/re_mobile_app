import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Cloud, Droplets, Sun } from 'lucide-react-native';
import { useWeatherContext } from '@/context/WeatherContext';

export default function TabLayout() {
  const { weatherTheme } = useWeatherContext();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: weatherTheme.primaryColor,
        tabBarInactiveTintColor: weatherTheme.inactiveColor,
        tabBarStyle: [
          styles.tabBar,
          { backgroundColor: weatherTheme.backgroundColor },
        ],
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, size }) => <Sun size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="hourly"
        options={{
          title: 'Hourly',
          tabBarIcon: ({ color, size }) => <Cloud size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="forecast"
        options={{
          title: 'Forecast',
          tabBarIcon: ({ color, size }) => <Droplets size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0,
    elevation: 0,
    height: 60,
    paddingBottom: 8,
  },
});