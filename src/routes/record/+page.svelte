<script lang="ts">
	interface WeatherData {}

	let location = 'Rolla, MO';

	let weatherdata: Promise<WeatherData | null>;

	async function loadwx() {/*
		try {
			const data = await response.json();
			setWeatherData(data);
			setShowRecordButton(true);
			setFlightData({
				location: data.location.name,
				temperatureC: data.current.temp_c,
				temperatureF: data.current.temp_f,
				condition: data.current.condition.text,
				elapsedTime: timer
			});
		} catch (error) {
			console.error('Error fetching weather data:', error);
		}*/
	}
</script>

<div id="weatherpanel" on:submit={loadwx}>
	<input type="text" id="location" placeholder="Location" value={location} />
	<input type="submit" value="Load Weather Data" />
</div>

<div id="weatherdisplay">
	{#await weatherdata}
		<p>loading...</p>
	{:then weather}
		{#if weather}
			<p>wx: {weather}</p>
		{:else}
			<p>Enter a city to load weather for your location</p>
		{/if}
	{:catch err}
		<p>error: {err}</p>
	{/await}
</div>

<style>
	#weatherpanel {
		display: flex;
		justify-content: center;
		gap: 1em;
	}
</style>
