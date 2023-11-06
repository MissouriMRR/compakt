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
		location: 'Rolla',
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

<div id="flightform">
	<h2 style="text-align: center">Flight Information</h2>
	<h4 style="text-align: center; color: red; -webkit-text-stroke: 0.5px black; font-style: italic;">* Required</h4>

	<form id="weatherautofill" style="text-align: center" on:submit={loadWeatherData}>
		<label for="location">Enter your location to auto-fill some fields</label><br /><br />
		<input id="location" type="text" value={flightData.location}/>
		<input type="submit" value="Go" />
	</form>

	<form id="flightinfo">
		<h3 style="text-align: center;">Time & Date</h3>
		<h4 style="text-align: center;">
			<label for="date">Date</label>
			<input type="date" id="date" value={flightData.flightDate} />
			<button
				on:click={() => {
					flightData.flightDate = extractDate(new Date());
				}}>Today</button
			>
		</h4>

		<h4 style="text-align: center;">
			<label for="t_start">Start Time</label>
			<input type="time" id="t_start" value={flightData.flightStartTime || ''} step="1" />
			<button
				on:click={() => {
					flightData.flightStartTime = extractTime(new Date());
				}}>Now</button
			>
		</h4>

		<h4 style="text-align: center;">
			<label for="t_end">End Time</label>
			<input type="time" id="t_end" value={flightData.flightStopTime || ''} step="1" />
			<button
				on:click={() => {
					flightData.flightStopTime = extractTime(new Date());
				}}>Now</button
			>
		</h4>
		
		{#if flightData.weather}
		<h3 style="text-align: center;">Weather</h3>
		<h4 style="text-align: center;">
			<div>
				<div class = 'sectionContainer'>
					<p class = 'sectionTitle'>Location: {flightData.location}</p>
				</div>

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
		</h4>
		{/if}
	</form>
</div>

<style>
  .sectionContainer {
    margin-bottom: 10;
		margin-top: 10;
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
