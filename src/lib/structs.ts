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
}
