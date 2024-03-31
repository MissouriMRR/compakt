import { LogVisualProps } from '$lib/structs';
import type { FlightLog } from '$lib/structs';
import { LogArray } from '$lib/stores';

let initialized = false;

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
      v_props: { ...LogVisualProps }
    } as FlightLog;

    LogArray.update(a => [...a, newLog]);
  }
}