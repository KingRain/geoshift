import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';

const LocationScreen = () => {
  const [region, setRegion] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [isInside, setIsInside] = useState(false);

  const geofencedLocations = [
    { name: 'IIIT Kottayam', latitude: 9.755111, longitude: 76.650081, radius: 600 },
    { name: 'Extraction Site 2', latitude: 9.77594203175121, longitude: 76.67252873827437, radius: 800 },
    { name: 'Warehouse 3', latitude: 9.798624026502015, longitude: 76.66186876567662, radius: 800 },
  ];

  const startLocationTracking = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Allow location access in settings to use this feature.');
      return;
    }
  
    let { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== 'granted') {
      Alert.alert('Permission Denied', 'Background location access is needed for tracking.');
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
    const insideAnyGeofence = geofencedLocations.some((location) => {
      const distance = getDistance(coords, location);
      return distance < location.radius;
    });
    
    if (insideAnyGeofence && !isInside) {
      setIsInside(true);
    } else if (!insideAnyGeofence && isInside) {
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

  useFocusEffect(
    useCallback(() => {
      startLocationTracking();
      const intervalId = setInterval(() => {
        startLocationTracking();
      }, 60000); // Refresh every 60 seconds

      return () => {
        clearInterval(intervalId);
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
        zIndex={1} // Ensure user location icon is above everything
      >
        {geofencedLocations.map((location, index) => (
          <React.Fragment key={index}>
            <Circle
              center={{ latitude: location.latitude, longitude: location.longitude }}
              radius={location.radius}
              strokeColor="rgba(0, 0, 0, 0.15)"
              fillColor="rgba(0, 255, 39, 0.3)"
              zIndex={0} // Ensure geofences are below user location icon
            />
            <Marker
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title={location.name}
              description={`Radius: ${location.radius} meters`}
              zIndex={0} // Ensure markers are below user location icon
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
