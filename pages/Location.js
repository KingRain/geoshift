import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useFocusEffect } from '@react-navigation/native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const LocationScreen = () => {
  const [region, setRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [isInside, setIsInside] = useState(false);

  const geofencedLocations = [
    { name: 'IIIT Kottayam', latitude: 9.755111, longitude: 76.650081, radius: 600 },
    { name: 'Extraction Site 2', latitude: 9.77594203175121, longitude: 76.67252873827437, radius: 800 },
    { name: 'Warehouse 3', latitude: 9.798624026502015, longitude: 76.66186876567662, radius: 800 },
  ];

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

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };

  useEffect(() => {
    getPermissionsAndToken();

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification Received:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification Response:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
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
    let insideAnyGeofence = false;

    geofencedLocations.forEach((location) => {
      const distance = getDistance(
        { latitude: coords.latitude, longitude: coords.longitude },
        { latitude: location.latitude, longitude: location.longitude }
      );

      if (distance < location.radius) {
        insideAnyGeofence = true;
        if (!isInside) {
          setIsInside(true);
          const message = `You entered ${location.name} at ${new Date().toLocaleTimeString()}`;
          sendNotification(`Entered ${location.name}`, message);
        }
      }
    });

    if (!insideAnyGeofence) {
      setIsInside(false);
    }
  };

  const getDistance = (point1, point2) => {
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
    if (expoPushToken) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
        },
        trigger: null, // Trigger immediately
      });
    }
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
              title={location.name}
              description={`Radius: ${location.radius} meters`}
            >
              <View style={styles.marker}>
                <Text style={styles.markerText}>{location.name}</Text>
              </View>
            </Marker>
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
  marker: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 5,
    borderRadius: 5,
  },
  markerText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default LocationScreen;
