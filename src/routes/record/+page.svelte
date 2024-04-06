<script lang="ts">
	import { FlightRecord, LogArray, FlagInvalid, ReservedId } from '$lib/stores';
	import type { FlightData, WeatherData, FlightLog } from '$lib/structs';
	import { LogVisualProps } from '$lib/structs';
	import { dev } from '$app/environment';

	const DEFAULT_LOC = 'Rolla, MO';

	if (!$FlightRecord.initialized) {
		$FlightRecord = {
			initialized: true,
			location: DEFAULT_LOC,
			flight_date: extractDate(new Date())
		} as FlightData;
	}

	/**
	 * @description
	 * Creates a new log in the flight logs section and adds it to the database
	 * with all of the information pulled from the API and manually entered.
	*/
	async function addNewLog() {
		const newLog = {
			id: ++$ReservedId,
			location: $FlightRecord.location,
			flight_date: $FlightRecord.flight_date,
			start_time: $FlightRecord.start_time,
			stop_time: $FlightRecord.stop_time,
			temp_f: $FlightRecord.weather?.temp_f,
			wind_speed_mph: $FlightRecord.weather?.wind_speed,
			wind_direction: $FlightRecord.weather?.wind_direction,
			wind_degree: $FlightRecord.weather?.wind_degree,
			gust_speed_mph: $FlightRecord.weather?.gust_speed,
			humidity: $FlightRecord.weather?.humidity,
			pilot_id: $FlightRecord.pilot_id,
			remote_id: $FlightRecord.remote_id,
			v_props: { ...LogVisualProps }
		} as FlightLog;

		let invalid = false;
		for(const value of Object.values(newLog)) {
			if(value === undefined) {
				invalid = true;
			}
		}

		if(invalid) {
			$FlagInvalid = true;
			return;
		}

		if(!dev) {
			await fetch('/api/logs', {
				method: 'POST',
				body: JSON.stringify(newLog),
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			});
		}

		$LogArray = [...$LogArray, newLog];
		$FlagInvalid = false;
	}

	/**
	 * @description
	 * Fetches weather data from the API in JSON format
	*/
	async function loadWeatherData() {
		try {
			const response = await fetch('/api/weather', {
				method: 'POST',
				body: JSON.stringify({ location: $FlightRecord.location })
			});

			const data = await response.json();

			if (data.error) {
				console.error('[Weather API] API Error:', data.error.message);
				return;
			}

			$FlightRecord.weather = {
				condition: data.current.condition.text,
				icon: data.current.condition.icon,
				temp_f: data.current.temp_f,
				temp_c: data.current.temp_c,
				wind_speed: data.current.wind_mph,
				wind_direction: data.current.wind_dir,
				wind_degree: data.current.wind_degree,
				gust_speed: data.current.gust_mph,
				humidity: data.current.humidity
			} as WeatherData;
		} catch (error) {
			console.error('[Weather API]', error);
		}
	}

	/**
	 * @description
	 * Pads a number with a specified number of zeroes
	 * @param {number} num Number to pad
	 * @param {number} zeroes Number of zeroes to pad with
	*/
	function pad(num: number, zeroes: number) {
		return num.toString().padStart(zeroes, '0');
	}

	/**
	 * @description
	 * Extracts the date string from a date object in YYYY-MM-DD format
	 * @param {Date} date Date to extract string from
	*/
	function extractDate(date: Date) {
		return `${date.getFullYear()}-${pad(date.getMonth() + 1, 2)}-${pad(date.getDate(), 2)}`;
	}

	/**
	 * @description
	 * Extracts the time string from a date object in HH:MM:SS format
	 * @param {Date} date Date to extract string from
	*/
	function extractTime(date: Date) {
		return `${pad(date.getHours(), 2)}:${pad(date.getMinutes(), 2)}:${pad(date.getSeconds(), 2)}`;
	}

	const updateDate = (date: Date) => ($FlightRecord.flight_date = extractDate(date));
	const updateStart = (time: Date) => ($FlightRecord.start_time = extractTime(time));
	const updateEnd = (time: Date) => ($FlightRecord.stop_time = extractTime(time));
</script>

<div id="flight-form">
	<h1>Record Flight</h1>
	<h2>Location</h2>
	<div class="form-section">
		<div class="data-field">
			<label for="location">City</label>
			<div class="field-container">
				<input
					class:invalid-input={$FlagInvalid && !$FlightRecord.location}
					class="field-entree"
					id="location"
					type="text"
					bind:value={$FlightRecord.location}
				/>
				<input
					class:invalid-input={$FlagInvalid && !$FlightRecord.weather}
					class="field-button"
					type="button"
					value="Get Weather"
					on:click={loadWeatherData}
				/>
			</div>
			<h5>Enter your location to fetch weather data</h5>
		</div>
	</div>

	{#if $FlightRecord.weather}
		<div class="form-section">
			<h2>Weather</h2>
			<div class="weather-container">
				<label for="location">Location: {$FlightRecord.location}</label>
			</div>

			<div class="weather-container">
				<label for="temperature">Temperature: {$FlightRecord.weather.temp_f + '°F'}</label>
			</div>
			<div class="weather-container">
				<label for="condition">Condition: {$FlightRecord.weather.condition}</label>
			</div>
		</div>
	{/if}

	<div class="form-section">
		<h2>Time & Date</h2>
		<div class="data-field">
			<label for="date">Date</label>
			<div class="field-container">
				<input
					class:invalid-input={$FlagInvalid && !$FlightRecord.flight_date}
					class="field-entree"
					id="date"
					type="date"
					value={$FlightRecord.flight_date}
				/>
				<button class="field-button" on:click={() => updateDate(new Date())}>Today</button>
			</div>
		</div>

		<div class="data-field">
			<label for="time-start">Start Time</label>
			<div class="field-container">
				<input
					class:invalid-input={$FlagInvalid && !$FlightRecord.start_time}
					class="field-entree"
					type="time"
					id="time-start"
					value={$FlightRecord.start_time || ''}
					step="1"
				/>
				<button class="field-button" on:click={() => updateStart(new Date())}>Now</button>
			</div>
		</div>

		<div class="data-field">
			<label for="time-end">End Time</label>
			<div class="field-container">
				<input
					class:invalid-input={$FlagInvalid && !$FlightRecord.stop_time}
					class="field-entree"
					type="time"
					id="time-end"
					value={$FlightRecord.stop_time || ''}
					step="1"
				/>
				<button class="field-button" on:click={() => updateEnd(new Date())}>Now</button>
			</div>
		</div>
	</div>

	<div class="form-section">
		<h2>Flight IDs</h2>
		<div class="data-field">
			<label for="pilot-id">Pilot ID</label>
			<div class="field-container">
				<input
					class:invalid-input={$FlagInvalid && !$FlightRecord.pilot_id}
					class="field-entree"
					id="pilot-id"
					type="text"
					bind:value={$FlightRecord.pilot_id}
				/>
			</div>
		</div>
		<div class="data-field">
			<label for="remote-id">Remote ID</label>
			<div class="field-container">
				<input
					class:invalid-input={$FlagInvalid && !$FlightRecord.remote_id}
					class="field-entree"
					id="remote-id"
					type="text"
					bind:value={$FlightRecord.remote_id}
				/>
			</div>
		</div>
		<button on:click={addNewLog} id="add-log-button">Add New Log</button>
	</div>
</div>

<style>
	#flight-form {
		display: flex;
		flex-direction: column;
		font-family: 'IBMPlexSans-Regular';
		height: 90vh;
		justify-content: left;
		overflow: auto;
		padding: 10px;
	}
	.invalid-input {
		color: red;
		text-decoration-color: red;
		border-color: red;
	}
	#add-log-button {
		border-radius: 100px;
		font-weight: bold;
		font-size: 20px;
		height: 40px;
		margin-top: 2em;
		text-align: center;
		width: 150px;
	}
	label {
		font-size: 19px;
		margin-bottom:.5ch;
		margin-top: 1.5ch;
		text-decoration: underline;
		white-space: nowrap;
	}
	h1 {
		font-size: min(40px, 8vw);
		font-weight: bold;
		text-align: center;
	}
	h2 {
		margin-bottom: 1ch;
		text-align: center;
		font-family: 'IBMPlexSans-Bold';
		font-weight: 0.5px;
	}
	h5 {
		font-family: 'IBMPlexSans-BoldItalic';
		text-align: center;
		margin-bottom: 0.25ch;
	}
	.form-section {
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: 0 10;
		margin-bottom: 40px;
		-webkit-text-stroke-color: rgb(0, 0, 0);
		-webkit-text-stroke-width: 0.25px;
	}
	.data-field {
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.field-button {
		border-radius: 1em;
		font-weight: bold;
	}
	.field-container {
		display: flex;
		flex-direction: row;
		height: 2em;
	}
	.field-entree {
		margin-right: 0.5em;
		padding-left: 1ch;
		padding-right: 1ch;
	}
	.weather-container {
		margin-bottom: 15px;
		margin-top: 10px;
		flex-direction: row;
		align-items: 'center';
	}
</style>
