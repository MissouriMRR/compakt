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
	id: number,
	date: string,
	location: string,
	startTime: string,
	stopTime: string,
	tempF?: string,
	tempC?: string,
	windSpeed?: string,
	windDirection?: string,
	windDegree?: string,
	gustSpeed?: string,
	humidity?: string,
	pilotID?: string,
	remoteID?: string,
	vProps: VisualProperties
}

export interface VisualProperties {
	expanded: boolean,
	selected: boolean,
}