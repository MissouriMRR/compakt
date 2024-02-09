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
		const newLog = {
			id: $LogArray.length,
			date: $FlightRecord.flightDate,
			location: $FlightRecord.location,
			startTime: $FlightRecord.flightStartTime,
			stopTime: $FlightRecord.flightStopTime,
			tempF: $FlightRecord.weather?.temperatureF,
			tempC: $FlightRecord.weather?.temperatureC,
			windSpeed: $FlightRecord.weather?.windSpeedMPH,
			windDirection: $FlightRecord.weather?.windDirection,
			windDegree: $FlightRecord.weather?.windDegree,
			gustSpeed: $FlightRecord.weather?.gustSpeedMPH,
			humidity: $FlightRecord.weather?.humidity,
			pilotID: $FlightRecord.pilotID,
			remoteID: $FlightRecord.remoteID,
			vProps: { ...LogVisualProps }
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
				temperatureF: data.current.temp_f,
				temperatureC: data.current.temp_c,
				windSpeedMPH: data.current.wind_mph,
				windDirection: data.current.wind_dir,
				windDegree: data.current.wind_degree,
				gustSpeedMPH: data.current.gust_mph,
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
	const updateDate = (date: Date) => ($FlightRecord.flightDate = extractDate(date));
	const updateStart = (time: Date) => ($FlightRecord.flightStartTime = extractTime(time));
	const updateEnd = (time: Date) => ($FlightRecord.flightStopTime = extractTime(time));
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
					<p class="weather-label">Temperature: {$FlightRecord.weather.temperatureF + '°F'}</p>
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
					<input class="field-entree" id="date" type="date" value={$FlightRecord.flightDate} />
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
						value={$FlightRecord.flightStartTime || ''}
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
						value={$FlightRecord.flightStopTime || ''}
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
						bind:value={$FlightRecord.pilotID}
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
						bind:value={$FlightRecord.remoteID}
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
