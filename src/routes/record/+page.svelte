<script lang="ts">
	const DEFAULT_LOC = 'Rolla, MO';

	interface WeatherData {
		condition: string,
		icon: string,
		temperatureF: Number,
		temperatureC: Number,
		windSpeedMPH: Number,
		windDirection: string,
		windDegree: Number,
		gustSpeedMPH: Number,
		humidity: Number
	};

	interface FlightData {
		location: string,
		flightDate: string,
		flightStartTime?: string,
		flightStopTime?: string,
		weather?: WeatherData,
		pilotID?: Number,
		remoteID?: string
	};

	const flightData = {
		location: DEFAULT_LOC,
		flightDate: extractDate(new Date())
	} as FlightData;

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
			
			flightData.weather = {
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
</script>

<div id="form-container">
	<form id="flight-form">
		<h2>Flight Information</h2>
		<h3 id="required-text">* Required</h3>
	
		<div class="form-section">
			<label id="location-hint" for="location-field">Enter your location to auto-fill some fields</label>
			<div class="data-field">
				<input class="field-entree" type="text" value={flightData.location}/>
				<input type="button" value="Go" on:click={loadWeatherData}/>
			</div>
		</div>
	
		<div id="flightinfo">
			<h3>Time & Date</h3>
			<div class="form-section">
				<label for="date">Date</label>
				<div class="data-field">
					<input class="field-entree" type="date" value={flightData.flightDate} />
					<button
						on:click={() => {
							flightData.flightDate = extractDate(new Date());
						}}>Today</button
					>
				</div>
			</div>
	
			<div class="form-section">
				<label for="t_start">Start Time</label>
				<div class="data-field">
					<input class="field-entree" type="time" id="t_start" value={flightData.flightStartTime || ''} step=1 />
					<button
						on:click={() => {
							flightData.flightStartTime = extractTime(new Date());
						}}>Now</button
					>
				</div>
			</div>
	
			<div class="form-section">
				<label for="t_end">End Time</label>
				<div class="data-field">
					<input class="field-entree" type="time" id="t_end" value={flightData.flightStopTime || ''} step="1" />
					<button
						on:click={() => {
							flightData.flightStopTime = extractTime(new Date());
						}}>Now</button
					>
				</div>
			</div>
			
			{#if flightData.weather}
			<h3>Weather</h3>
			<div class="form-section">
				<p class = 'sectionTitle'>Location: {flightData.location}</p>
	
				<div class = 'temperatureContainer'>
					<p class = 'sectionTitle'>Temperature: {flightData.weather.temperatureF + '°F'}</p>
				</div>
				<div class = 'sectionRow'>
					<span class = 'sectionTitle'>Condition: {flightData.weather.condition}</span>
					<img
						class='weatherIcon'
						src={flightData.weather.icon}
						alt='Weather Icon'
					/>
				</div>
			</div>
			{/if}
		</div>
	</form>
</div>

<style>
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
