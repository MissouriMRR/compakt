<script lang="ts">
	import { CsvDataService } from '$lib/data';
	import type { FlightLog } from '$lib/structs';
	import { LogArray } from '$lib/stores';
	import { onMount } from 'svelte';

	function deleteSelectedLogs() {
		const confirmation = confirm(
			'Are you sure you want to delete these logs? They cannot be recovered.'
		);
		if (!confirmation) return;

		const flightLogsNext = [];

		for (const log of $LogArray) {
			if (!log.vProps.selected) {
				flightLogsNext.push({
					...log,
					id: flightLogsNext.length
				});
			}
		}

		$LogArray = [...flightLogsNext];
	}

	function exportSelectedLogs() {
		const flightLogsExport = [];

		for (const log of $LogArray) {
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
		$LogArray[index].vProps.expanded = !$LogArray[index].vProps.expanded;
	}

	function chronologicSort(logs: FlightLog[]) {
		return logs.toReversed();
	}

	onMount(() => {
		console.log($LogArray);
	});
</script>

<div id="flightform">
	<h1 style="text-align: center; font-family: Proxima; font-weight: bolder;">Flight Logs</h1>
	<div id="logs-action-container">
		<button
			on:click={deleteSelectedLogs}
			id="logs-action-button"
			style="background-color: crimson; border-color: crimson;"
		>
			<span id="delete-logs-text">Delete Selected Logs</span>
		</button>
		<button
			on:click={exportSelectedLogs}
			id="logs-action-button"
			style="background-color: cornflowerblue; border-color: cornflowerblue;"
		>
			<span id="export-logs-text">Export Selected Logs</span>
		</button>
	</div>
	<div id="logs-container">
		{#each chronologicSort($LogArray) as log, i (log.id)}
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
						<input id="select-checkbox" type="checkbox" bind:checked={log.vProps.selected} />
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
		border-radius: 10px;
		margin: 7px;
		width: 120px;
	}
	#delete-logs-text {
		color: white;
		font-family: Proxima;
		font-weight: bolder;
	}
	#export-logs-text {
		color: white;
		font-family: Proxima;
		font-weight: bolder;
	}
</style>
