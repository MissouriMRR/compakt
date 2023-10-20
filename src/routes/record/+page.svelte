<script lang="ts">
	interface WeatherData {}

	let location = 'Rolla, MO';
	let resdata = '';
	let weatherData = null as any;

	let t_start = new Date().toISOString();
	let t_end = new Date().toISOString();
	let date = new Date().toDateString();

	async function loadWeatherData() {
		try {
			const response = await fetch('/api/weather', {
				method: 'POST',
				body: JSON.stringify({ location })
			});
			const data = await response.json();
			resdata = JSON.stringify(data, undefined, 4);
			console.log(resdata);
		} catch (error) {
			console.error('Error fetching weather data:', error);
		}
	}

	function getLocalTime() {
		const now = new Date();
		return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
	}

	function getLocalDate() {
		const now = new Date();
		return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
	}
</script>

<div id="flightform">
	<h2 style="text-align: center">Flight Information</h2>
	<h4 style="text-align: center; color: red; font-style: italic;">* Required</h4>

	<form id="weatherautofill" style="text-align: center" on:submit={loadWeatherData}>
		<label for="location">Enter your location to auto-fill some fields</label><br /><br />
		<input id="location" type="text" value={location} />
		<input type="submit" value="Go" />
	</form>

	<form id="flightinfo">
		<h3 style="text-align: center;">Time & Date</h3>
		<h4 style="text-align: center;">
			<label for="date">Date</label>
			<input type="date" id="date" value={date} />
			<button
				on:click={() => {
					date = getLocalDate();
				}}>Today</button
			>
		</h4>

		<h4 style="text-align: center;">
			<label for="t_start">Start Time</label>
			<input type="time" id="t_start" value={t_start} step="1" />
			<button
				on:click={() => {
					t_start = getLocalTime();
				}}>Now</button
			>
		</h4>

		<h4 style="text-align: center;">
			<label for="t_end">End Time</label>
			<input type="time" id="t_end" value={t_end} step="1" />
			<button
				on:click={() => {
					t_end = getLocalTime();
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
