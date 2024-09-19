import * as React from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Home from "./pages/Home";
import SettingsScreen from "./pages/Settings";
import SupportScreen from "./pages/Support";
import LocationScreen from "./pages/Location";
import SOS from "./pages/Sospage";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Settings") {
              iconName = focused ? "settings" : "settings-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            } else if (route.name === "SOS") {
              iconName = focused ? "alert-circle" : "alert-circle-outline";
            } else if (route.name === "Location") {
              iconName = focused ? "location" : "location-outline";
            } else if (route.name === "Support") {
              iconName = focused ? "help-circle" : "help-circle-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "orange",
          tabBarInactiveTintColor: "white",
          tabBarShowLabel: false, // Hides tab label
          tabBarStyle: styles.tabBarStyle, // Custom style
          headerStyle: {
            backgroundColor: "#000", // Background color of the header
          },
          headerTintColor: "#fff", // Text color of the header
          headerTitleAlign: "center", // Center the header title
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Support" component={SupportScreen} />
        <Tab.Screen name="Location" component={LocationScreen} />
        <Tab.Screen name="SOS" component={SOS} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Custom styles
const styles = StyleSheet.create({
  tabBarStyle: {
    position: "absolute",
    bottom: 20, // Floating effect
    left: 20,
    right: 20,
    height: 60, // Height of the tab bar
    backgroundColor: "#000", // Background color
    borderRadius: 30, // Rounded corners
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 10 }, // Shadow offset
    shadowOpacity: 0.25, // Shadow opacity
    shadowRadius: 3.5, // Shadow radius
    elevation: 5, // Elevation for Android shadow
    borderTopWidth: 0, // Remove default border
  },
  contentArea: {
    flex: 1,
    backgroundColor: "#000", // Background color
    color: "#fff", // Text color
  },
});
