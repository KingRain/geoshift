// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from './pages/Home';
import SettingsScreen from './pages/Settings';
import SupportScreen from './pages/Support';
import LocationScreen from './pages/Location';
import SOS from './pages/SOSpage';

const Tab = createBottomTabNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }
            else if (route.name === 'SOS') {
              iconName = focused ? 'alert-circle' : 'alert-circle-outline';
            }
            else if (route.name === 'Location') {
              iconName = focused ? 'location' : 'location-outline';
            }
            else if (route.name === 'Support') {
              iconName = focused ? 'help-circle' : 'help-circle-outline';
            }

            // Return the appropriate icon component
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'red',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
        <Tab.Screen name="SOS" component={SOS} />
        <Tab.Screen name="Location" component={LocationScreen} />
        <Tab.Screen name="Support" component={SupportScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

