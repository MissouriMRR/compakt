export const LOG_KEYS = [
	"location",
	"flight_date",
	"start_time",
	"stop_time",
	"temp_f",
	"wind_speed_mph",
	"wind_direction",
	"wind_degree",
	"gust_speed_mph",
	"humidity",
	"pilot_id",
	"remote_id",
	"max_altitude_ft",
	"ground_station_op",
	"visual_observer",
	"terrain",
	"bystanders",
	"airspace_class",
	"pilot_in_command",
];

export type FlightLog = {
	id: number;
	location?: string;
	flight_date?: string;
	start_time?: string;
	stop_time?: string;
	temp_f?: number;
	wind_speed_mph?: number;
	wind_direction?: string;
	wind_degree?: number;
	gust_speed_mph?: number;
	humidity?: number;
	pilot_id?: string;
	remote_id?: string;
	max_altitude_ft?: number;
	ground_station_op?: string;
	visual_observer?: string;
	terrain?: string;
	bystanders?: boolean;
	airspace_class?: string;
	pilot_in_command?: string;
	v_props: VisualProperties;
}

export type FlightLogKey = keyof FlightLog;

interface VisualProperties {
	expanded: boolean;
	selected: boolean;
}

export const LogVisualProps = {
	expanded: false,
	selected: false
} as VisualProperties;
