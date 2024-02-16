<script lang="ts">
	import { FlightRecord, InfoVisible, LogArray } from '$lib/stores';
	import type { FlightData, WeatherData, FlightLog } from '$lib/structs';
	import { LogVisualProps } from '$lib/structs';

	const DEFAULT_LOC = 'Rolla, MO';

	if (!$FlightRecord.initialized) {
		$FlightRecord = {
			initialized: true,
			location: DEFAULT_LOC,
			flightDate: extractDate(new Date())
		} as FlightData;
	}

	async function addNewLog() {
		/**
    		Creates a new log in the flight logs section and adds it to the database
			with all of the information pulled from the API and manually entered.

            Parameters:
					None

            Returns:
                    Completed Log
	 	* 
	 	*/
		const newLog = {
			id: $LogArray.length,
			flight_date: $FlightRecord.flight_date,
			location: $FlightRecord.location,
			start_time: $FlightRecord.start_time,
			stop_time: $FlightRecord.stop_time,
			tempF: $FlightRecord.weather?.temp_f,
			tempC: $FlightRecord.weather?.temp_c,
			windSpeed: $FlightRecord.weather?.wind_speed,
			windDirection: $FlightRecord.weather?.wind_direction,
			windDegree: $FlightRecord.weather?.wind_degree,
			gustSpeed: $FlightRecord.weather?.gust_speed,
			humidity: $FlightRecord.weather?.humidity,
			pilotID: $FlightRecord.pilot_id,
			remoteID: $FlightRecord.remote_id,
			v_props: { ...LogVisualProps }
		} as FlightLog;
		// await fetch('/api/database', {
		// 	method: "POST",
		// 	body: JSON.stringify(newLog)
		// });
		$LogArray = [...$LogArray, newLog]; // For svelte reactivity
	}

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
		<h2 style="font-size: 40px;">Flight Information</h2>
		<!-- <h3 id="required-text">* Required</h3> -->
		<h6>Enter your location to fetch weather data</h6>
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
			<h3>Weather</h3>
			<div class="form-section">
				<p class="weather-label">Location: {$FlightRecord.location}</p>

				<div class="temperature-container">
					<p class="weather-label">Temperature: {$FlightRecord.weather.temp_f + '°F'}</p>
				</div>
				<div class="section-container">
					<span class="weather-label">Condition: {$FlightRecord.weather.condition}</span>
					<img class="weatherIcon" src={$FlightRecord.weather.icon} alt="Weather Icon" />
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
				<button on:click={addNewLog} id="add-log-button"
					>Add New Log</button
				>
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
		font-size: 25px;
		padding-left: 5em;
		padding-right: 5em;
		white-space: normal;
	}
	#add-log-button {
		border-radius: 100px;
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
		margin-bottom: 1ch;
		text-decoration: underline;
		white-space: nowrap;
	}
	h2,
	h3,
	h6 {
		text-align: center;
		white-space: nowrap;
	}
	h2 {
		margin-bottom: 1ch;
	}
	h3 {
		margin-bottom: 0.5ch;
	}
	h6 {
		margin: 0;
	}
	.form-section {
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: 0 10;
		margin-top: 30px;
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
	.section-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.weather-label {
		font-size: 18px;
		font-weight: 'bold';
	}
	.temperature-container {
		margin-bottom: 10;
		margin-top: 10;
		flex-direction: row;
		align-items: 'center';
	}
	.weatherIcon {
		display: inline-block;
		width: 2em;
		height: 2em;
		margin-left: 10;
		margin-right: 10;
	}
</style>
