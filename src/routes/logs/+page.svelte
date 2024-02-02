<script lang="ts">
	import { CsvDataService } from '$lib/data';
	import { FlightRecord } from '$lib/stores';
	import type { FlightLog, VisualProperties } from '$lib/structs';
	import { onMount } from 'svelte';

	let logArray = [] as FlightLog[];
	const logVisualProps = {
		expanded: false,
		selected: false,
	} as VisualProperties;

	async function addNewLog() {
		const newLog = {
			id: logArray.length,
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
			vProps: {...logVisualProps},
		} as FlightLog;
		logArray = [...logArray, newLog]; // For svelte reactivity
	}

	async function init() {
		try {
			const response = await fetch('/api/database');
			const data = await response.json();
			for(const row of data) {
				logArray.push({
					...row,
					vProps: {...logVisualProps}
				})
			}
			logArray = logArray;
		} catch (error: any) {
			console.error('Error fetching data:', error.message);
		}
	}

	function deleteSelectedLogs() {
		const confirmation = confirm(
			'Are you sure you want to delete these logs? They cannot be recovered.'
		);
		if (!confirmation) return;

		const flightLogsNext = [];

		for (const log of logArray) {
			if (!log.vProps.selected) {
				flightLogsNext.push({
					...log,
					id: flightLogsNext.length
				});
			}
		}

		logArray = [...flightLogsNext];
	}

	function exportSelectedLogs() {
		const flightLogsExport = [];

		for (const log of logArray) {
			if (!log.vProps.selected) continue;
			const logEntry = {
				...log,
				id: flightLogsExport.length
			} as FlightLog;
			flightLogsExport.push(logEntry);
		}

		CsvDataService.exportToCsv('log_data.csv', flightLogsExport);
	}

	function toggleExpansion(index: number) {
		logArray[index].vProps.expanded = !logArray[index].vProps.expanded;
	}

	onMount(() => init());
</script>

<div id="flightform">
	<h1 style="text-align: center; font-family: Proxima; font-weight: bolder;">Flight Logs</h1>
	<div id="logs-action-container">
		<span id="logs-action-button">
			<button on:click={deleteSelectedLogs}>
				<span id="delete-logs-text">Delete Selected Logs</span>
			</button>
		</span>
		<span id="logs-action-button">
			<button on:click={exportSelectedLogs}>
				<span id="export-logs-text">Export Selected Logs</span>
			</button>
		</span>
	</div>
	<div id="logs-container">
		{#each logArray as log, i (log.id)}
			<div class="flight-log">
				<div class="expand-details">
					<span>Date: {log.date}</span>
					<span>Location: {log.location}</span>
					<span>Start Time: {log.startTime}</span>
					<span>End Time: {log.stopTime}</span>
					<div id="button">
						<button on:click={() => toggleExpansion(i)} class="expand-button">
							{log.vProps.expanded ? 'Collapse' : 'Expand'}
						</button>
						<input
							id="select-checkbox"
							type="checkbox"
							bind:checked={log.vProps.selected}
						/>
					</div>
				</div>
				{#if log.vProps.expanded}
					<div class="log-info">
						<span>
							<br />Temperature: {log.tempF}°F<br />
							<br />Temperature: {log.tempC}°C<br />
							<br />Wind Speed: {log.windSpeed}<br />
							<br />Wind Direction: {log.windDirection}<br />
							<br />Remote ID: {log.remoteID}<br />
						</span>
						<span>
							<br />Wind Degree: {log.windDegree}°<br />
							<br />Gust Speed: {log.gustSpeed}<br />
							<br />Humidity: {log.humidity}<br />
							<br />Pilot ID: {log.pilotID}<br />
						</span>
					</div>
				{/if}
			</div>
		{/each}
	</div>
	<h4 style="text-align: center;">
		<button on:click={addNewLog}>Add New Log</button>
	</h4>
</div>

<style>
	#logs-container {
		align-items: center;
		display: flex;
		flex-direction: column;
	}
	#button {
		margin-left: 1ch;
	}
	.flight-log {
		border: 1px solid #000000;
		margin: 2em 0;
		padding: 1.5em;
		background-color: white;
		width: 70vw;
		text-align: center;
	}
	.expand-button {
		cursor: pointer;
	}
	.expand-details {
		font-weight: bold;
	}
	.log-info {
		display: none;
	}
	.flight-log div {
		display: flex;
		flex-wrap: wrap;
	}
	.flight-log span {
		flex: 1;
	}
	#select-checkbox {
		height: 2em;
		margin-left: 2ch;
		text-align: center;
		width: 2em;
	}
	#logs-action-container {
		right: 30px;
		top: 15vh;
		align-self: right;
		display: flex;
		flex-direction: column;
		position: absolute;
	}
	#logs-action-button {
		margin: 5px;
		width: 100px;
	}
	#delete-logs-text {
		color: red;
		font-family: Proxima;
		font-weight: bold;
	}
	#export-logs-text {
		color: blue;
		font-family: Proxima;
		font-weight: bold;
	}
</style>
