<script lang="ts">
	import { LogVisualProps } from '$lib/structs';
	import type { FlightLog } from '$lib/structs';
	import { onMount } from 'svelte';
	import { LogArray, Init } from '$lib/stores';

	async function init() {
		if ($Init) return;
		$Init = true;

		try {
			const response = await fetch('/api/logs');
			const data = await response.json();

			if(data.results.length == 0) {
				return;
			}

			for (const row of data.results) {
				const newLog = {
					id: parseInt(row.id),
					location: row.location,
					flight_date: row.flight_date,
					start_time: row.start_time,
					stop_time: row.stop_time,
					temp_f: parseFloat(row.temp_f),
					wind_speed_mph: parseFloat(row.wind_speed),
					wind_direction: row.wind_direction,
					wind_degree: parseFloat(row.wind_degree),
					gust_speed_mph: parseFloat(row.gust_speed),
					humidity: parseFloat(row.humidity),
					pilot_id: row.pilot_id,
					remote_id: row.remote_id,
					v_props: { ...LogVisualProps }
				} as FlightLog;

				$LogArray.push(newLog);
			}
		} catch (error: any) {
			console.error('Error fetching data:', error.message);
		}
	}

	onMount(() => init());
</script>

<div id="title">
	<h1 style="font-size: 50px;">The Compakt Web App</h1>
	<h1 style="font-size: 35px;">By:</h1>
	<a href="https://multirotor.mst.edu/" target="_blank"
		><img src="/multirotorlogo.png" alt="logo" width="50%" height="auto" /></a
	>
</div>

<div id="details">
	<h1 style="font-size: 35px; margin-top:3ch;">What is this for?</h1>
	<h1 style="font-size: 20px; margin-top:-1ch">
		The Compakt app is a tool designed by the Multirotor Software Division <br />
		to assist with drone testing days by providing data logging and retrieval <br />
		capabilities for flight data, among other useful features.
	</h1>
	<h1 style="font-size: 35px; margin-top:5ch">How is it used?</h1>
	<h1 style="font-size: 20px; margin-top:-1ch">
		There are two main pages you will need to navigate between, the Flight Recorder and the Flight
		Logs. <br />
		The Flight Recorder does exactly what the name suggests, that is where you will go to enter information
		and record your flight.<br />
		Once a flight has been recorded, that information will be stored within the app, where it can be
		viewed in the Flight Logs. <br />
		From there, you can view, manage, and export any previously recorded flight logs. <br />
	</h1>
</div>

<style>
	#title {
		text-align: center;
		justify-content: center;
		font-family: 'IBMPlexSans-Bold';
		color: rgb(255, 255, 255);
	}
	#details {
		text-align: center;
		font-family: 'IBMPlexSans-Regular';
		color: rgb(255, 255, 255);
	}
</style>
