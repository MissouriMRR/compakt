import { writable } from 'svelte/store';
import type { FlightLog } from '$lib/structs';

export const FlightRecord = writable({ location: 'Rolla, MO' } as FlightLog);
export const LogArray = writable([] as FlightLog[]);
export const FlagInvalid = writable(false);
export const ReservedId = writable(0);
