export interface WeatherData {
	condition: string;
	icon: string;
	temp_f: number;
	temp_c: number;
	wind_speed: number;
	wind_direction: string;
	wind_degree: number;
	gust_speed: number;
	humidity: number;
}

export interface FlightData {
	initialized: boolean;
	location?: string;
	flight_date?: string;
	start_time?: string;
	stop_time?: string;
	weather?: WeatherData;
	pilot_id?: number;
	remote_id?: string;
}

export interface FlightLog {
	id: number;
	location: string;
	flight_date: string;
	start_time: string;
	stop_time: string;
	temp_f?: number;
	wind_speed_mph?: number;
	wind_direction?: string;
	wind_degree?: number;
	gust_speed_mph?: number;
	humidity?: number;
	pilot_id?: string;
	remote_id?: string;
	v_props: VisualProperties;
}

interface VisualProperties {
	expanded: boolean;
	selected: boolean;
}

export const LogVisualProps = {
	expanded: false,
	selected: false
} as VisualProperties;
