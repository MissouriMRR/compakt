<script lang="ts">
	import { FlightRecord, InfoVisible } from './stores.js'
	import type { FlightData, WeatherData } from "./structs";

	const DEFAULT_LOC = 'Rolla, MO';

	if(!$FlightRecord.initialized) {
		$FlightRecord = {
			initialized: true,
			location: DEFAULT_LOC,
			flightDate: extractDate(new Date())
		} as FlightData;
	}
	
	async function loadWeatherData() {
		try {
			const response = await fetch('/api/weather', {
				method: 'POST',
				body: JSON.stringify({ location })
			});
			
			const data = await response.json();

			if(data.error) {
				console.error("[Weather API] API Error:", data.error.message);
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
			console.error("[Weather API]", error);
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

	const toggleInfo = () => $InfoVisible = !$InfoVisible;
	const updateDate = (date: Date) => $FlightRecord.flightDate = extractDate(date);
	const updateStart = (time: Date) => $FlightRecord.flightStartTime = extractTime(time);
	const updateEnd = (time: Date) => $FlightRecord.flightStopTime = extractTime(time);
</script>


<div id="info-container">
	{#if $InfoVisible}
		<h2 class="info-text">IMPORTANT INFO! You must call these phone numbers to ask for permission to fly:</h2>
		<h3 class="info-text">S&T University Police - (573) 341-4300</h3>
		<h3 class="info-text">Phelps Health - (573) 458-8899</h3>
	{/if}
	<button id="info-close" on:click={toggleInfo}>{$InfoVisible ? "˄" : "˅"}</button>
</div>

<div id="form-container">
	<form id="flight-form">
		<h2>Flight Information</h2>
		<h3 id="required-text">* Required</h3>
	
		<div class="form-section">
			<label id="location-hint" for="location-field">Enter your location to auto-fill some fields</label>
			<div class="data-field">
				<input class="field-entree" type="text" bind:value={$FlightRecord.location} />
				<input type="button" value="Go" on:click={loadWeatherData}/>
			</div>
		</div>
	
		<div id="flightinfo">
			<h3>Time & Date</h3>
			<div class="form-section">
				<label for="date">Date</label>
				<div class="data-field">
					<input class="field-entree" type="date" value={$FlightRecord.flightDate} />
					<button on:click={() => updateDate(new Date())}>Today</button>
				</div>
			</div>
	
			<div class="form-section">
				<label for="t_start">Start Time</label>
				<div class="data-field">
					<input class="field-entree" type="time" id="t_start" value={$FlightRecord.flightStartTime || ''} step=1 />
					<button on:click={() => updateStart(new Date())}>Now</button>
				</div>
			</div>
	
			<div class="form-section">
				<label for="t_end">End Time</label>
				<div class="data-field">
					<input class="field-entree" type="time" id="t_end" value={$FlightRecord.flightStopTime || ''} step="1" />
					<button on:click={() => updateEnd(new Date())}>Now</button>
				</div>
			</div>
			
			{#if $FlightRecord.weather}
			<h3>Weather</h3>
			<div class="form-section">
				<p class = 'sectionTitle'>Location: {$FlightRecord.location}</p>
	
				<div class = 'temperatureContainer'>
					<p class = 'sectionTitle'>Temperature: {$FlightRecord.weather.temperatureF + '°F'}</p>
				</div>
				<div class = 'sectionRow'>
					<span class = 'sectionTitle'>Condition: {$FlightRecord.weather.condition}</span>
					<img
						class='weatherIcon'
						src={$FlightRecord.weather.icon}
						alt='Weather Icon'
					/>
				</div>
			</div>
			{/if}
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
		margin-bottom: 1em;
		padding-left: 25%;
		padding-right: 25%;
		position: relative;
		top: -32px;
		width: 50%;
	}
	.info-text {
		color: silver;
		font-size: 25px;
		white-space: normal;
	}
	button#info-close {
		background-color: transparent;
		border: none;
		color: silver;
		cursor: pointer;
		font-size: 25px;
		font-weight: bold;
		outline: none;
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
	#required-text {
		color: red;
		font-style: italic;
		text-align: center;
		-webkit-text-stroke: 0.5px black;
	}
	h2, h3 {
		text-align: center;
		white-space: nowrap;
	}
	.form-section {
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: 0 10;
	}
	#location-hint {
		white-space: nowrap;
	}
	.data-field {
		align-items: center;
		display: flex;
		justify-content: space-between;
		margin: 0.5em;
	}
	.field-entree {
		margin-right: 0.5em;
	}
	.sectionRow {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
  .sectionTitle {
    font-size: 16;
    font-weight: 'bold';
  }
  .temperatureContainer {
		margin-bottom: 10;
		margin-top: 10;
    flex-direction: 'row';
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
