export class FlightLog {
	id: number = -1;
	location: string = '';
	flight_date: string = '';
	start_time: string = '';
	stop_time: string = '';
	temp_f: number = -1;
	wind_speed_mph: number = -1;
	wind_direction: string = '';
	wind_degree: number = -1;
	gust_speed_mph: number = -1;
	humidity: number = -1;
	pilot_id: string = '';
	remote_id: string = '';
	max_altitude_ft: number = -1;
	ground_station_op: string = '';
	visual_observer: string = '';
	terrain: string = '';
	bystanders: boolean = false;
	airspace_class: string = '';
	pilot_in_command: string = '';
	v_props: VisualProperties = {expanded: false, selected: false};

	static get keys() {
		return Object.keys(ref_log);
	}
}

const ref_log = new FlightLog();

export type FlightLogKey = keyof FlightLog;

interface VisualProperties {
	expanded: boolean;
	selected: boolean;
}

export const LogVisualProps = {
	expanded: false,
	selected: false
} as VisualProperties;
