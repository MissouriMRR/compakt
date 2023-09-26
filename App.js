import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainMenuScreen from './screens/MainMenuScreen';
import FlightRecorder from './screens/FlightRecorder';
import FlightData from './screens/FlightData';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main Menu" component={MainMenuScreen} />
        <Stack.Screen name="FlightRecorder" component={FlightRecorder} />
        <Stack.Screen name="FlightData" component={FlightData} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;