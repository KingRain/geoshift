import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

const LocationScreen = () => {
  const [region, setRegion] = useState(null); // State to hold the current region
  const [errorMsg, setErrorMsg] = useState(null);

  // Geofenced locations array with lat, lng, and radius
  const geofencedLocations = [
    { latitude: 37.78825, longitude: -122.4324, radius: 300 }, // Example geofence 1
    { latitude: 37.79457, longitude: -122.4218, radius: 400 }, // Example geofence 2
  ];

  // Request permission and get the user's location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync(); // Request location permission
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert('Permission Denied', 'Allow location access in settings to use this feature.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({}); // Get the current location
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  if (!region) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading Map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Display the map with the user's current location */}
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true} // Show the user's current location as a blue dot
        onRegionChangeComplete={(region) => setRegion(region)} // Update region when map moves
      >
        {/* Display geofenced areas as red markers */}
        {geofencedLocations.map((location, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title={`Geofence ${index + 1}`}
            description={`Radius: ${location.radius}m`}
            pinColor="red" // Red marker
          />
        ))}

        {/* Display geofenced areas as green circles */}
        {geofencedLocations.map((location, index) => (
          <Circle
            key={index}
            center={{ latitude: location.latitude, longitude: location.longitude }}
            radius={location.radius} // Radius in meters
            strokeColor="rgba(0, 255, 0, 0.5)" // Circle border color
            fillColor="rgba(0, 255, 0, 0.2)"  // Circle fill color (semi-transparent green)
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Make the map fill the screen
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LocationScreen;
