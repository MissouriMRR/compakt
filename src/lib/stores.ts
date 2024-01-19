import { writable } from 'svelte/store';
import type { FlightData } from '$lib/structs';

export const InfoVisible = writable(true);
export const FlightRecord = writable({ initialized: false } as FlightData);
