import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import FileSaver from 'file-saver';

const WeatherPanel = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [showRecordButton, setShowRecordButton] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timer, setTimer] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [stopTime, setStopTime] = useState(null);
  const [flightData, setFlightData] = useState({
    location: '',
    temperature: '',
    condition: '',
    elapsedTime: 0,
  });
  const apiKey = '7b99b611bf2e4ec3ab6205624231907';

  const CustomButton = ({ title, onPress, backgroundColor }) => (
    <TouchableOpacity style={[styles.button, { backgroundColor }]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

// Using https://www.weatherapi.com/ for the API

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`
      );
      const data = await response.json();
      setWeatherData(data);
      setShowRecordButton(true);
      setFlightData({
        location: data.location.name,
        temperatureC: data.current.temp_c,
        temperatureF: data.current.temp_f,
        condition: data.current.condition.text,
        elapsedTime: timer,
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const startTimer = () => {
    setStartTime(new Date().toLocaleTimeString());
    setTimer(0);
    setShowTimer(true);
    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);

    return () => clearInterval(interval);
  };

  const stopTimer = () => {
    setStopTime(new Date().toLocaleTimeString());
    setShowTimer(false);
    setFlightData(prevFlightData => ({
      ...prevFlightData,
      elapsedTime: timer,
    }));
  };

  useEffect(() => {
    // Auto-fetch weather data when the component mounts (you can adjust the timing)
    // Commented out to prevent initial fetch
    // fetchWeatherData();
  }, []);

  const generateCSVData = () => {
    const csvData = `
  Started at,Stopped at,Location,Region,Temperature (°F),Condition
  ${startTime || ''},${stopTime || ''},${weatherData?.location?.name || ''},${weatherData?.location?.region || ''},${weatherData?.current?.temp_f || ''},${weatherData?.current?.condition?.text || ''}
    `;
  
    return csvData;
  };
  
  const handleExport = async () => {
    try {
      const fileName = 'flight_data.csv';
  
      // Convert your flight data to a CSV string
      const csvData = generateCSVData(); // Use the correct function name
  
      if (Platform.OS === 'web') {
        // Create a Blob from the CSV data
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
  
        // Use FileSaver.js to save the Blob as a file
        FileSaver.saveAs(blob, fileName);
  
        console.log('CSV file saved:', fileName);
      } else {
        // For mobile platforms (iOS, Android), use Expo FileSystem (already provided in the previous code)
        // ...
      }
    } catch (error) {
      console.error('Error saving CSV file:', error);
      // Handle the error here, e.g., show an error message to the user
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather Panel</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter location"
        value={location}
        onChangeText={setLocation}
      />

      <CustomButton
          title="Get Weather" 
          backgroundColor="#007a33"
          onPress={fetchWeatherData} />
          {showRecordButton && !showTimer && (
        <CustomButton
        title="Record Flight" 
        backgroundColor="#2d312e"
        onPress={startTimer} />
      )}

      {showTimer && (
        <View>
          <CustomButton
            title="Stop Recording" 
            backgroundColor="#c10000"
            width='100%'
            onPress={stopTimer}
          />
          <Text style={styles.timer}>Elapsed Time: {timer} seconds</Text>
        </View>
      )}

      <View style={styles.graycoloredbox}>
      {startTime && <Text style={styles.timeText}>Started at: {startTime}</Text>}
      {stopTime && <Text style={styles.timeText}>Stopped at: {stopTime}</Text>}
      {weatherData && (
        <View>
          {/* Location and Region */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Location: {weatherData.location.name}</Text>
            <Text style={styles.sectionSubtitle}>Region: {weatherData.location.region}</Text>
          </View>

          {/* Temperature and Condition */}
          <View style={[styles.sectionContainer, styles.temperatureContainer]}>
            <Text style={styles.sectionTitle}>Temperature:</Text>
            <Text style={styles.sectionSubtitle}> {weatherData.current.temp_f}°F</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.sectionTitle}>Condition: </Text>
            <Text style={styles.sectionSubtitle}>{weatherData.current.condition.text}</Text>
            <Image
              source={{ uri: `https:${weatherData.current.condition.icon}` }}
              style={styles.weatherIcon}
            />
          </View>
        </View>
      )}
      </View>

      {/* This section is for displaying weather stats after
          the stop recording button has been pressed */}

    <View style={styles.greencoloredbox}>
      {stopTime && (
        <View>
          <Text style={styles.savedDataTitle}>Flight Data</Text>
          <Text>Location: {flightData.location}</Text>
          <Text>Temperature: {flightData.temperatureC} °C</Text>
          <Text>Temperature: {flightData.temperatureF} °F</Text>
          <Text style={styles.sectionSubtitle}>Wind Speed: {weatherData.current.wind_mph} MPH</Text>
          <Text style={styles.sectionSubtitle}>Wind Direction: "{weatherData.current.wind_dir}"</Text>
          <Text>Gust Speed: {weatherData.current.gust_mph} MPH</Text>
          <Text>Started at: {startTime}</Text>
          <Text>Stopped at: {stopTime}</Text>
          <Text style={styles.regularText}>Elapsed Time: {flightData.elapsedTime} seconds</Text>
          <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
            <Text style={styles.exportButtonText}>Export to CSV</Text>
          </TouchableOpacity>
        </View>
      )}
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  // Button: Width % is main control
  button: {
    width: '30vw',
    marginVertical: 15,
    paddingVertical: 5,
    backgroundColor: '#ccc',
    borderRadius: 10,
  },
  // marginVertical: # is main control
  buttonText: {
    fontSize: 25,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    marginVertical: 15,
    paddingHorizontal: 15,
  },
  // Mostly Useless
  buttonContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  // Keeps the assets in the center of the screen
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Coloring for the weather detail boxes
  greencoloredbox: {
    backgroundColor: '#90EE90',
    padding: 10,
    borderRadius: 10,
  },
  graycoloredbox: {
    backgroundColor: '#D3D3D3',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    marginBottom: 10,
    marginTop: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  timer: {
    fontSize: 18,
    marginTop: 10,
  },
  timeText: {
    fontSize: 16,
    marginTop: 5,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: 14,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
  regularText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  savedDataTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  exportButton: {
    backgroundColor: '#ffca28',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  exportButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WeatherPanel;