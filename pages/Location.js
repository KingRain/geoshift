import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useFocusEffect } from '@react-navigation/native';

const LocationScreen = () => {
  const [region, setRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState('');

  const geofencedLocations = [
    { latitude: 9.755111, longitude: 76.650081, radius: 300 },
    { latitude: 37.79457, longitude: -122.4218, radius: 400 },
  ];

  // Request notifications permissions and get push token
  const getPermissionsAndToken = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Permission Denied', 'Allow notifications in settings to use this feature.');
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    setExpoPushToken(token);
  };

  useEffect(() => {
    getPermissionsAndToken();
  }, []);

  const startLocationTracking = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      Alert.alert('Permission Denied', 'Allow location access in settings to use this feature.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (newLocation) => {
        setRegion({
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        // Check geofences and send notifications
        checkGeofences(newLocation.coords);
      }
    );

    setLocationSubscription(subscription);
  };

  const stopLocationTracking = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
  };

  const checkGeofences = (coords) => {
    geofencedLocations.forEach((location, index) => {
      const distance = getDistance(
        { latitude: coords.latitude, longitude: coords.longitude },
        { latitude: location.latitude, longitude: location.longitude }
      );

      if (distance < location.radius) {
        sendNotification(`Entered Geofence ${index + 1}`, `You entered Geofence ${index + 1} at ${new Date().toLocaleTimeString()}`);
      }
    });
  };

  const getDistance = (point1, point2) => {
    // Simple Haversine formula to calculate distance
    const R = 6371e3; // Earth radius in meters
    const φ1 = point1.latitude * Math.PI / 180;
    const φ2 = point2.latitude * Math.PI / 180;
    const Δφ = (point2.latitude - point1.latitude) * Math.PI / 180;
    const Δλ = (point2.longitude - point1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const sendNotification = async (title, body) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null, // Trigger immediately
    });
  };

  useFocusEffect(
    useCallback(() => {
      startLocationTracking();
      return () => {
        stopLocationTracking();
      };
    }, [])
  );

  if (!region) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading Map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        userLocationAnnotationTitle="You are here"
        showsMyLocationButton={true}
        onRegionChangeComplete={(region) => setRegion(region)}
      >
        {geofencedLocations.map((location, index) => (
          <React.Fragment key={index}>
            <Circle
              center={{ latitude: location.latitude, longitude: location.longitude }}
              radius={location.radius}
              strokeColor="rgba(0, 0, 0, 0.15)"
              fillColor="rgba(0, 255, 39, 0.3)"
            />
            <Marker
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title={`Geofence ${index + 1}`}
              description={`Radius: ${location.radius} meters`}
            />
          </React.Fragment>
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
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LocationScreen;
