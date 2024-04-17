<script lang="ts">
	import { FlightRecord, LogArray, FlagInvalid, ReservedId } from '$lib/stores';
	import { FlightLog } from '$lib/structs';
	import type { FlightLogKey } from '$lib/structs';
	import { LogVisualProps } from '$lib/structs';
	import { dev } from '$app/environment';

	let weatherRetrieved = false;

	/**
	 * @description
	 * Creates a new log in the flight logs section and adds it to the database
	 * with all of the information pulled from the API and manually entered.
	*/
	async function addNewLog() {
		const newLog = {
			...$FlightRecord,
			id: ++$ReservedId,
			v_props: { ...LogVisualProps }
		} as FlightLog;

		let invalid = false;

		console.log(FlightLog.keys)

		FlightLog.keys.forEach((key) => {
			const value = newLog[key as FlightLogKey];
			console.log(value);
			if(value === null || value === undefined) {
				invalid = true;
			}
		});

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

			$FlightRecord.temp_f = data.current.temp_f;
			$FlightRecord.wind_speed_mph = data.current.wind_mph;
			$FlightRecord.wind_direction = data.current.wind_dir;
			$FlightRecord.wind_degree = data.current.wind_degree;
			$FlightRecord.gust_speed_mph = data.current.gust_mph;
			$FlightRecord.humidity = data.current.humidity;

			weatherRetrieved = true;
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
					class:invalid-input={$FlagInvalid && $FlightRecord.location === undefined}
					class="field-entree"
					id="location"
					type="text"
					bind:value={$FlightRecord.location}
				/>
				<input
					class:invalid-input={$FlagInvalid && !weatherRetrieved}
					class="field-button"
					type="button"
					value="Get Weather"
					on:click={loadWeatherData}
				/>
			</div>
			<h5>Enter your location to fetch weather data</h5>
		</div>
	</div>

	{#if weatherRetrieved}
		<div class="form-section">
			<h2>Weather</h2>
			<table id="weather-table">
				<tr><td>Temperature</td><td class='right'>{$FlightRecord.temp_f + '°F'}</td></tr>
				<tr><td>Wind Speed</td><td class='right'>{$FlightRecord.wind_speed_mph + 'MPH'}</td></tr>
				<tr><td>Wind Direction</td><td class='right'>{$FlightRecord.wind_direction}</td></tr>
				<tr><td>Wind Degree</td><td class='right'>{$FlightRecord.wind_degree + '°'}</td></tr>
				<tr><td>Gust Speed</td><td class='right'>{$FlightRecord.gust_speed_mph + 'MPH'}</td></tr>
				<tr><td>Humidity</td><td class='right'>{$FlightRecord.humidity + '%'}</td></tr>
			</table>
		</div>
	{/if}

	<div class="form-section">
		<h2>Time & Date</h2>
		<div class="data-field">
			<label for="date">Date</label>
			<div class="field-container">
				<input
					class:invalid-input={$FlagInvalid && $FlightRecord.flight_date === undefined}
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
					class:invalid-input={$FlagInvalid && $FlightRecord.start_time === undefined}
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
					class:invalid-input={$FlagInvalid && $FlightRecord.stop_time === undefined}
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
		<h2>Flight Identifiers</h2>
		<div class="data-field">
			<label for="pilot-id">Pilot ID</label>
			<div class="field-container">
				<input
					class:invalid-input={$FlagInvalid && $FlightRecord.pilot_id === undefined}
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
					class:invalid-input={$FlagInvalid && $FlightRecord.remote_id === undefined}
					class="field-entree"
					id="remote-id"
					type="text"
					bind:value={$FlightRecord.remote_id}
				/>
			</div>
		</div>
		<div class="data-field">
			<label for="ground-station-op">Ground Station Operator</label>
			<div class="field-container">
				<input
					class:invalid-input={$FlagInvalid && $FlightRecord.ground_station_op === undefined}
					class="field-entree"
					id="ground-station-op"
					type="text"
					bind:value={$FlightRecord.ground_station_op}
				/>
			</div>
		</div>
		<div class="data-field">
			<label for="visual-observer">Visual Observer</label>
			<div class="field-container">
				<input
					class:invalid-input={$FlagInvalid && $FlightRecord.visual_observer === undefined}
					class="field-entree"
					id="visual-observer"
					type="text"
					bind:value={$FlightRecord.visual_observer}
				/>
			</div>
		</div>
		<div class="data-field">
			<label for="airspace-class">Airspace Class</label>
			<div class="field-container">
				<input
					class:invalid-input={$FlagInvalid && $FlightRecord.airspace_class === undefined}
					class="field-entree"
					id="airspace-class"
					type="text"
					bind:value={$FlightRecord.airspace_class}
				/>
			</div>
		</div>
		<div class="data-field">
			<label for="pilot-in-command">Pilot in Command</label>
			<div class="field-container">
				<input
					class:invalid-input={$FlagInvalid && $FlightRecord.pilot_in_command === undefined}
					class="field-entree"
					id="pilot-in-command"
					type="text"
					bind:value={$FlightRecord.pilot_in_command}
				/>
			</div>
		</div>
	</div>

	<div class="form-section">
		<h2>Surroundings</h2>
		<div class="data-field">
			<label for="max-altitude-ft">Max Altitude (FT)</label>
			<div class="field-container">
				<input
					class:invalid-input={$FlagInvalid && $FlightRecord.max_altitude_ft === undefined}
					class="field-entree"
					id="max-altitude-ft"
					type="number"
					bind:value={$FlightRecord.max_altitude_ft}
				/>
			</div>
		</div>
		<div class="data-field">
			<label for="terrain">Terrain</label>
			<div class="field-container">
				<input
					class:invalid-input={$FlagInvalid && $FlightRecord.terrain === undefined}
					class="field-entree"
					id="terrain"
					type="text"
					bind:value={$FlightRecord.terrain}
				/>
			</div>
		</div>
		<div class="data-field">
			<label for="bystanders">Bystanders Present</label>
			<div class="field-container">
				<input
					class="field-entree"
					id="bystanders"
					type="checkbox"
					bind:checked={$FlightRecord.bystanders}
				/>
			</div>
		</div>
	</div>

	<button
		class:invalid-input={$FlagInvalid}
		id="add-log-button"
		on:click={addNewLog}
	>Add New Log</button>
</div>

<style>
	#flight-form {
		align-items: center;
		display: flex;
		flex-direction: column;
		font-family: 'IBMPlexSans-Regular';
		height: calc(90vh - 2em);
		justify-content: left;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 1em;
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
		margin-bottom: 1em;
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
	#weather-table {
		border-top: 2px solid black;
		border-bottom: 2px solid black;
		width: 90vw;
	}
	#weather-table tr {
		display: flex;
		flex-direction: row;
	}
	#weather-table td {
		display: flex;
		flex: 1;
	}
	#weather-table td.right {
		justify-content: end;
	}
</style>
