<script lang="ts">
	interface WeatherData {}

	let resdata = '';
	let weatherData = null as any;

	const currentData = {
		date: new Date().toDateString(),
		location: 'Rolla, MO',
		startTime: new Date().toISOString(),
		stopTime: new Date().toISOString(),
		tempF: '',
		tempC: '',
		windSpeed: '',
		windDirection: '',
		windDegree: '',
		gustSpeed: '',
		Humidity: '',
	};

	async function loadWeatherData() {
		try {
			const response = await fetch('/api/weather', {
				method: 'POST',
				body: JSON.stringify({ location })
			});
			const data = await response.json();
			resdata = JSON.stringify(data, undefined, 4);
		} catch (error) {
			console.error('Error fetching weather data:', error);
		}
	}

	const pad = (num: Number) => num.toString().padStart(2, '0');

	function getLocalTime() {
		const now = new Date();
		return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
	}

	function getLocalDate() {
		const now = new Date();
		return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
	}
</script>

<div id="flightform">
	<h2 style="text-align: center">Flight Information</h2>
	<h4 style="text-align: center; color: red; -webkit-text-stroke: 0.5px black; font-style: italic;">* Required</h4>

	<form id="weatherautofill" style="text-align: center" on:submit={loadWeatherData}>
		<label for="location">Enter your location to auto-fill some fields</label><br /><br />
		<input id="location" type="text" value={currentData.location} />
		<input type="submit" value="Go" />
	</form>

	<form id="flightinfo">
		<h3 style="text-align: center;">Time & Date</h3>
		<h4 style="text-align: center;">
			<label for="date">Date</label>
			<input type="date" id="date" value={currentData.date} />
			<button
				on:click={() => {
					currentData.date = getLocalDate();
				}}>Today</button
			>
		</h4>

		<h4 style="text-align: center;">
			<label for="t_start">Start Time</label>
			<input type="time" id="t_start" value={currentData.startTime} step="1" />
			<button
				on:click={() => {
					currentData.startTime = getLocalTime();
				}}>Now</button
			>
		</h4>

		<h4 style="text-align: center;">
			<label for="t_end">End Time</label>
			<input type="time" id="t_end" value={currentData.stopTime} step="1" />
			<button
				on:click={() => {
					currentData.stopTime = getLocalTime();
				}}>Now</button
			>
		</h4>
		
		<h3 style="text-align: center;">Weather</h3>
		<h4 style="text-align: center;">
			<div>
				<div class = 'sectionContainer'>
					<p class = 'sectionTitle'>Location: {weatherData ? weatherData.location.name : ''}</p>
					<p class = 'sectionTitle'>Region: {weatherData ? weatherData.location.region : ''}</p>
				</div>

				<div class = 'temperatureContainer'>
					<p class = 'sectionTitle'>Temperature: {weatherData ? weatherData.current.temp_f + '°F' : ''}</p>
				</div>
				<div class = 'sectionRow'>
					<p class = 'sectionTitle'>Condition: {weatherData ? weatherData.current.condition.text : ''}</p>
					<img
						class='weatherIcon'
						style='display: {weatherData ? "block" : "none"}'
						src='https:${weatherData ? weatherData.current.condition.icon : ''}'
						alt='Weather Icon'
					/>
				</div>
			</div>
		</h4>
	</form>
</div>

<style>
  .sectionContainer {
    margin-bottom: 10;
		margin-top: 10;
  }
	.sectionRow {
		flex-direction: row;
		align-items: center;
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
    width: 30;
    height: 30;
    margin-left: 10;
		margin-right: 10;
  }
</style>
