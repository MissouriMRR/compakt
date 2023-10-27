<script lang="ts">
	interface WeatherData {}

	let location = 'Rolla, MO';

	let resdata = '';

	let t_start = new Date().toISOString();
	let t_end = new Date().toISOString();
	let date = new Date().toDateString();

	async function loadwx() {
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

	function localtime() {
		const now = new Date();
		return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
	}
	function localdate() {
		const now = new Date();
		return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
	}
</script>

<div id="flightform">
	<h2 style="text-align: center">Flight Information</h2>
	<h4 style="text-align: center; color: red; font-style: italic;">* Required</h4>
	<form id="weatherautofill" style="text-align: center" on:submit={loadwx}>
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
					date = localdate();
				}}>Today</button
			>
		</h4>

		<h4 style="text-align: center;">
			<label for="t_start">Start Time</label>
			<input type="time" id="t_start" value={t_start} step="1" />
			<button
				on:click={() => {
					t_start = localtime();
				}}>Now</button
			>
		</h4>

		<h4 style="text-align: center;">
			<label for="t_end">End Time</label>
			<input type="time" id="t_end" value={t_end} step="1" />
			<button
				on:click={() => {
					t_end = localtime();
				}}>Now</button
			>
		</h4>
	</form>
</div>

<style>
	#flightform {
		max-width: 100ch;
		background-color: rgb(255, 255, 255);
		padding: 1em;
		border-radius: 1em;
		margin: auto;
		font-family: Proxima;
	}
</style>
