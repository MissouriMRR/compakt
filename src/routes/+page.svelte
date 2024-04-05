<script lang="ts">
	import { onMount } from 'svelte';
	import { init } from '$lib/load';
	onMount(() => init());
</script>

<div id="about-container">
	<div id="title">
		<h1 style="font-size: 50px;">The Compakt Web App</h1>
		<h1 style="font-size: 35px;">By:</h1>
		<a href="https://multirotor.mst.edu/" target="_blank">
			<img src="/multirotorlogo.png" alt="logo" width="50%" height="auto" />
		</a>
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
</div>

<style>
	#about-container {
		height: 90vh;
		overflow: auto;
	}
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
