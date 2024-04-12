import { LogVisualProps } from '$lib/structs';
import type { FlightLog } from '$lib/structs';
import { LogArray } from '$lib/stores';

let initialized = false;

/**
 * @description
 * Initializes the flight logs array by pulling from the database
*/
export async function init() {
  if (initialized) return;
  initialized = true;

  const response = await fetch('/api/logs');
  const data = await response.json();

  if(data.results.length == 0) return;

  for (const row of data.results) {
    const newLog = {
      id: parseInt(row.id),
      location: row.location,
      flight_date: row.flight_date,
      start_time: row.start_time,
      stop_time: row.stop_time,
      temp_f: parseFloat(row.temp_f),
      wind_speed_mph: parseFloat(row.wind_speed),
      wind_direction: row.wind_direction,
      wind_degree: parseFloat(row.wind_degree),
      gust_speed_mph: parseFloat(row.gust_speed),
      humidity: parseFloat(row.humidity),
      pilot_id: row.pilot_id,
      remote_id: row.remote_id,
      max_altitude_ft: parseFloat(row.max_altitude_ft),
      ground_station_op: row.ground_station_op,
      visual_observer: row.visual_observer,
      terrain: row.terrain,
      bystanders: parseInt(row.bystanders) === 1,
      airspace_class: row.airspace_class,
      pilot_in_command: row.pilot_in_command,
      v_props: { ...LogVisualProps }
    } as FlightLog;

    LogArray.update(a => [...a, newLog]);
  }
}