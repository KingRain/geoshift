import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Home = () => {
  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        {/* Profile Picture */}
        <Image 
          source={{ uri: 'https://cdn.discordapp.com/avatars/546690021571297280/52433392d835f179384068db90cb8122.png?size=512' }} // Replace with your image URL
          style={styles.profilePic} 
        />
        {/* Greeting and Name */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Good Morning</Text>
          <Text style={styles.name}>Steve Jobs</Text>
        </View>
        {/* SOS Button */}
        <TouchableOpacity style={styles.sosButton}>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      </View>

      {/* Notification Bar */}
      <View style={styles.notificationBar}>
        <View style={styles.notificationTextContainer}>
          <Text style={styles.location}>Orange Gas Station</Text>
          <Text style={styles.notificationText}>
            Please be informed that your scheduled task for equipment inspection will...
          </Text>
        </View>
        <MaterialIcons name="notifications-none" size={24} color="gray" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  greetingContainer: {
    flex: 1,
    alignItems: 'center', // Center the text horizontally
  },
  greeting: {
    color: '#ccc',
    fontSize: 14,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sosButton: {
    backgroundColor: '#D50000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sosText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationBar: {
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 28, // Ensure this is applied correctly
  },
  notificationTextContainer: {
    flex: 1,
  },
  location: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notificationText: {
    color: '#ccc',
    fontSize: 14,
  },
});

export default Home;
