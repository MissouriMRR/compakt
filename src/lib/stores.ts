import { writable } from 'svelte/store';
import type { FlightData, FlightLog } from '$lib/structs';

export const InfoVisible = writable(true);
export const FlightRecord = writable({ initialized: false } as FlightData);
export const LogList = writable([] as FlightLog[] );