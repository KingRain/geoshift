import React from 'react';
import { View, Text } from 'react-native';
import { useEffect } from 'react';
import { Alert } from 'react-native';


const SettingsScreen = () => {
  useEffect(() => {
    Alert.alert('Notification', 'You have opened the Settings page');
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings Screen</Text>
    </View>
  );
}

export default SettingsScreen;