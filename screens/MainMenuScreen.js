import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CustomButton = ({ title, onPress, backgroundColor }) => (
  <TouchableOpacity style={[styles.button, { backgroundColor }]} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const MainMenuScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#2A764a', '#25973f']} // Replace with your desired gradient colors
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.headerText}>Multirotor Flight App</Text>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="FLIGHT RECORDER"
          onPress={() => navigation.navigate('FlightRecorder')}
          backgroundColor="#2d312e"
        />
        <CustomButton
          title="FLIGHT DATA"
          onPress={() => navigation.navigate('FlightData')}
          backgroundColor="#2d312e"
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Title Text
  headerText: {
    fontSize: 48,
    marginBottom: 10,
    marginTop: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 30,
  },
  button: {
    width: '40%',
    marginVertical: 25,
    paddingVertical: 20,
    backgroundColor: '#ccc',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 25,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
});

export default MainMenuScreen;