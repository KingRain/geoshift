import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CheckBox } from 'react-native-elements'; 


const Home = () => {
  const [tasks, setTasks] = useState([
    { id: '1', text: 'Morning Gas Delivery', completed: false },
    { id: '2', text: 'Tanker Refill', completed: false },
    { id: '3', text: 'Afternoon Distribution', completed: false },
    { id: '4', text: 'Evening Distribution', completed: false },
  ]);

  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskContainer}>
      <Text style={[styles.taskText, item.completed && styles.taskCompleted]}>{item.text}</Text>
      <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
        <MaterialIcons
          name={item.completed ? 'check-box' : 'check-box-outline-blank'}
          size={24}
          color={item.completed ? '#$fff' : '#ccc'}
        />
      </TouchableOpacity>
    </View>
  );



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

      {/* Daily task box and attendance box in same line */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
        {/* Daily Task Box */}
        <View style={{ backgroundColor: '#000', padding: 20, borderRadius: 20, flex: 1, marginRight: 10 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: -1 }}>Daily Task</Text>
          <Text style={{ color: '#959595', fontSize: 16, fontWeight: 'bold' }}>8/10</Text>
        </View>
        {/* Attendance Box */}
        <View style={{ backgroundColor: '#ff4d00', padding: 20, borderRadius: 20, flex: 1, marginLeft: 10 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: -1 }}>Attendance</Text>
          <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}>87%</Text>
        </View>
      </View>

      {/* Timeline bar which containes the recent dates in small boxes in the same line, like 5,6,7,8*/}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, alignContent: 'center' }}>
        <View style={{ backgroundColor: '#333', padding: 10, borderRadius: 10, flex: 1, marginRight: 10, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 32, fontFamily: 'Roboto', fontWeight: 'bold' }}>18</Text>
          <Text style={{ color: '#959595', fontSize: 14, fontFamily: 'Roboto', textAlign: 'center' }}>Mon</Text>
        </View>
        <View style={{ backgroundColor: '#ff4d00', padding: 10, borderRadius: 10, flex: 1, marginRight: 10, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 32, fontFamily: 'Roboto', fontWeight: 'bold' }}>19</Text>
          <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'Roboto', textAlign: 'center' }}>Tue</Text>
        </View>
        <View style={{ backgroundColor: '#333', padding: 10, borderRadius: 10, flex: 1, marginRight: 10, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 32, fontFamily: 'Roboto', fontWeight: 'bold' }}>20</Text>
          <Text style={{ color: '#959595', fontSize: 14, fontFamily: 'Roboto', textAlign: 'center' }}>Wed</Text>
        </View>
        <View style={{ backgroundColor: '#333', padding: 10, borderRadius: 10, flex: 1, marginRight: 10, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 32, fontFamily: 'Roboto', fontWeight: 'bold' }}>21</Text>
          <Text style={{ color: '#959595', fontSize: 14, fontFamily: 'Roboto', textAlign: 'center' }}>Thu</Text>
        </View>
        <View style={{ backgroundColor: '#333', padding: 10, borderRadius: 10, flex: 1, marginRight: 10, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 32, fontFamily: 'Roboto', fontWeight: 'bold' }}>22</Text>
          <Text style={{ color: '#959595', fontSize: 14, fontFamily: 'Roboto', textAlign: 'center' }}>Fri</Text>
        </View>
      </View>

      {/* Task List */}
      <View style={styles.taskListContainer}>
        <Text style={styles.taskListHeader}>Tasks</Text>
        <FlatList
          data={tasks}
          renderItem={renderTaskItem}
          keyExtractor={item => item.id}
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  taskListContainer: {
    marginTop: 20,
  },
  taskListHeader: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
  },
  taskText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#959595',
  },

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
