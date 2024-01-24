export interface WeatherData {
	condition: string;
	icon: string;
	temperatureF: number;
	temperatureC: number;
	windSpeedMPH: number;
	windDirection: string;
	windDegree: number;
	gustSpeedMPH: number;
	humidity: number;
	indexNumber: number;
}

export interface FlightData {
	initialized: boolean;
	location?: string;
	flightDate?: string;
	flightStartTime?: string;
	flightStopTime?: string;
	weather?: WeatherData;
	pilotID?: number;
	remoteID?: string;
	indexNumber: number;
}

export interface FlightLog {
	index: number,
	date: string,
	location: string,
	startTime: string,
	stopTime: string,
	tempF: string,
	tempC: string,
	windSpeed: string,
	windDirection: string,
	windDegree: string,
	gustSpeed: string,
	humidity: string,
	indexNumber: number, // This index number refers to the number of flight logs that have been created and is display in the logs section //
	vProps: VisualProperties
}

export interface VisualProperties {
	expanded: boolean,
	selected: boolean,
}