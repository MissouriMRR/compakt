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
    const newLog = {...row, v_props: { ...LogVisualProps }} as FlightLog;
    LogArray.update(a => [...a, newLog]);
  }
}