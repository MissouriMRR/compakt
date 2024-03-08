<script lang="ts">
	import { FlightRecord, InfoVisible, LogArray } from '$lib/stores';
	import type { FlightData, WeatherData, FlightLog } from '$lib/structs';
	import { LogVisualProps } from '$lib/structs';

	const DEFAULT_LOC = 'Rolla, MO';

	if (!$FlightRecord.initialized) {
		$FlightRecord = {
			initialized: true,
			location: DEFAULT_LOC,
			flight_date: extractDate(new Date())
		} as FlightData;
	}

	/**
	 *	@description
	 * Creates a new log in the flight logs section and adds it to the database
	 *	with all of the information pulled from the API and manually entered.
	 */
	async function addNewLog() {
		const newLog = {
			id: $LogArray.length,
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
		await fetch('/api/logs', {
			method: 'POST',
			body: JSON.stringify(newLog),
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			}
		});
		$LogArray = [...$LogArray, newLog]; // For svelte reactivity
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

	function pad(num: number) {
		return num.toString().padStart(2, '0');
	}

	function extractDate(date: Date) {
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
	}

	function extractTime(date: Date) {
		return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
	}

	const toggleInfo = () => ($InfoVisible = !$InfoVisible);
	const updateDate = (date: Date) => ($FlightRecord.flight_date = extractDate(date));
	const updateStart = (time: Date) => ($FlightRecord.start_time = extractTime(time));
	const updateEnd = (time: Date) => ($FlightRecord.stop_time = extractTime(time));
</script>

<div id="form-container">
	<div id="info-container">
		{#if $InfoVisible}
			<h2 class="info-text">
				IMPORTANT INFO! You must call these phone numbers to ask for permission to fly:
			</h2>
			<h3 class="info-text">S&T University Police - (573) 341-4300</h3>
			<h3 class="info-text">Phelps Health - (573) 458-8899</h3>
		{/if}
		<button id="info-close" on:click={toggleInfo}>{$InfoVisible ? '↑' : '↓'}</button>
	</div>

	<form id="flight-form">
		<h1>Flight Information</h1>
		<!-- <h3 id="required-text">* Required</h3> -->
		<h5>Enter your location to fetch weather data</h5>
		<h2>Location</h2>
		<div class="form-section">
			<div class="data-field">
				<label for="location">City</label>
				<div class="field-container">
					<input
						class="field-entree"
						id="location"
						type="text"
						bind:value={$FlightRecord.location}
					/>
					<input
						class="field-button"
						type="button"
						value="Get Weather"
						on:click={loadWeatherData}
					/>
				</div>
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
					<!-- <img class="weatherIcon" src={$FlightRecord.weather.icon} alt="Weather Icon" /> -->
				</div>
			</div>
		{/if}

		<div class="form-section">
			<h2>Time & Date</h2>
			<div class="data-field">
				<label for="date">Date</label>
				<div class="field-container">
					<input class="field-entree" id="date" type="date" value={$FlightRecord.flight_date} />
					<button class="field-button" on:click={() => updateDate(new Date())}>Today</button>
				</div>
			</div>

			<div class="data-field">
				<label for="time-start">Start Time</label>
				<div class="field-container">
					<input
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
			<h2 style="margin-bottom:20px">Flight IDs</h2>
			<div class="data-field">
				<label for="pilot-id">Pilot ID</label>
				<div class="field-container">
					<input
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
						class="field-entree"
						id="remote-id"
						type="text"
						bind:value={$FlightRecord.remote_id}
					/>
				</div>
			</div>
			<h1>
				<button on:click={addNewLog} id="add-log-button">Add New Log</button>
			</h1>
		</div>
	</form>
</div>

<style>
	#info-container {
		align-items: center;
		background-color: #2e2e2e;
		border-radius: 0px 0px 20px 20px;
		display: flex;
		flex-direction: column;
		position: fixed;
		top: max(4em, 10vh);
		width: 80vw;
	}
	.info-text {
		color: silver;
		font-family: "IBMPlexSans-Regular";
		font-size: 25px;
		padding-left: 5em;
		padding-right: 5em;
		white-space: normal;
	}
	#add-log-button {
		border-radius: 100px;
		font-family: "IBMPlexSans-Regular";
		font-weight: bold;
		font-size: 20px;
		height: 40px;
		text-align: center;
		width: 150px;
	}
	button#info-close {
		background-color: transparent;
		border: none;
		color: silver;
		cursor: pointer;
		font-family: "IBMPlexSans-Regular";
		font-size: 25px;
		font-weight: bold;
		outline: none;
		width: 100%;
	}
	#form-container {
		align-items: top;
		display: flex;
		justify-content: center;
		width: 100%;
	}
	#flight-form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 50%;
	}
	label {
		font-family: "IBMPlexSans-Regular";
		font-size: 19px;
		margin-bottom:.5ch;
		margin-top: 1.5ch;
		text-decoration: underline;
		white-space: nowrap;
	}
	h1 {
		font-size: 40px;
		font-weight: bold;
		text-align: center;
	}
	h2 {
		margin-bottom: 1ch;
		text-align: center;
		font-family: "IBMPlexSans-Bold";
		font-weight: .5px;

	}
	h3 {
		font-family: "IBMPlexSans-Regular";
		margin-bottom: 0.5ch;
	}
	h5 {
		font-family: "IBMPlexSans-BoldItalic";
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
		margin: 0.5em;
	}
	.field-button {
		border-radius: 1em;
		font-family: "IBMPlexSans-Regular";
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
