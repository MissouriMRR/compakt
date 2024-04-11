import { writable } from 'svelte/store';
import type { FlightData, FlightLog } from '$lib/structs';

export const FlightRecord = writable({ initialized: false } as FlightData);
export const LogArray = writable([] as FlightLog[]);
export const FlagInvalid = writable(false);
export const ReservedId = writable(0);
