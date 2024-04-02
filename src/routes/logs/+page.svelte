<script lang="ts">
	import { CsvDataService } from '$lib/data';
	import type { FlightLog } from '$lib/structs';
	import { LogArray } from '$lib/stores';
	import { onMount } from 'svelte';
	import { init } from '$lib/load';

	onMount(() => init());

	/**
	 * @description
	 * Deletes the selected logs from both the flight log page and subsequently the connected database
	 */
	async function deleteSelectedLogs() {
		const confirmation = confirm(
			'Are you sure you want to delete these logs? They cannot be recovered.'
		);
		if (!confirmation) return;

		const flightLogsNext = [];
		const deletedIds = [];

		for (const log of $LogArray) {
			if (!log.v_props.selected) {
				flightLogsNext.push({
					...log,
					id: flightLogsNext.length
				});
			} else {
				deletedIds.push(log.id);
			}
		}

		await fetch('/api/logs', {
			method: 'DELETE',
			body: JSON.stringify(deletedIds),
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			}
		});

		$LogArray = [...flightLogsNext];
	}

	/**
	 * @description
	 *	Exports the selected logs in a CSV file
	 */
	function exportSelectedLogs() {
		const flightLogsExport = [];

		for (const log of $LogArray) {
			if (!log.v_props.selected) continue;
			const logEntry = {
				...log,
				id: flightLogsExport.length
			} as FlightLog;
			flightLogsExport.push(logEntry);
		}

		CsvDataService.exportToCsv('log_data.csv', flightLogsExport);
	}

	/**
	 * @description
	 * Expands a flight log to show the full flight information
	 */
	function toggleExpansion(id: number) {
		for (let i = 0; i < $LogArray.length; i++) {
			if ($LogArray[i].id === id) {
				$LogArray[i].v_props.expanded = !$LogArray[i].v_props.expanded;
				break;
			}
		}
	}

	function chronologicSort(logArray: FlightLog[]) {
		logArray.sort((flight_a, flight_b) => {
			const dateStringA = `${flight_a.flight_date}T${flight_a.start_time}`;
			const dateStringB = `${flight_b.flight_date}T${flight_b.start_time}`;
			return Date.parse(dateStringB) - Date.parse(dateStringA);
		});
		return logArray;
	}
</script>

<div id="logs-container">
	<h1>Flight Logs</h1>
	<div id="logs-action-container">
		<button
			on:click={deleteSelectedLogs}
			class="logs-action-button"
			id="delete"
		>
			<span>Delete Selected Logs</span>
		</button>
		<button
			on:click={exportSelectedLogs}
			class="logs-action-button"
			id="export"
		>
			<span>Export Selected Logs</span>
		</button>
	</div>
	<div id="logs-container">
		{#each chronologicSort($LogArray) as log (log.id)}
			<div id={`${log.id}`} class="flight-log">
				<div class="expand-details">
					<span>Date: {log.flight_date}</span>
					<span>Start Time: {log.start_time}</span>
					<span>Location: {log.location}</span>
					<button class="expand-button" on:click={() => toggleExpansion(log.id)}>
						{log.v_props.expanded ? 'Collapse' : 'Expand'}
					</button>
					<input class="select-checkbox" type="checkbox" bind:checked={log.v_props.selected} />
				</div>
				{#if log.v_props.expanded}
					<table id="log-info">
						<tr>
							<td>Temperature: {log.temp_f}°F</td>
							<td>Wind Speed: {log.wind_speed_mph} MPH</td>
							<td>Wind Direction: {log.wind_direction}</td>
							<td>Remote ID: {log.remote_id}</td>
							<td>Start Time: {log.start_time}</td>
						</tr>
						<tr>
							<td>Gust Speed: {log.gust_speed_mph} MPH</td>
							<td>Humidity: {log.humidity}%</td>
							<td>Pilot ID: {log.pilot_id}</td>
							<td>End Time: {log.stop_time}</td>
						</tr>
					</table>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	#logs-container {
		font-family: 'IBMPlexSans-Regular';
	}
	h1 {
		font-size: 40px;
		font-weight: bold;
		text-align: center;
	}
	#logs-container {
		align-items: center;
		display: flex;
		flex-direction: column;
	}
	.flight-log {
		border: 1px solid #000000;
		margin: 2em 0;
		padding: 1.5em;
		background-color: white;
		width: 65vw;
		text-align: center;
	}
	.expand-button {
		cursor: pointer;
		margin-left: 1ch;
	}
	.expand-details {
		font-weight: bold;
	}
	#log-info {
		display: flex;
		justify-content: center;
	}
	#log-info tr {
		display: flex;
		flex-direction: column;
		margin: auto;
	}
	#log-info td {
		margin: .5em;
	}
	.flight-log div {
		display: flex;
		flex-wrap: wrap;
	}
	.flight-log span {
		flex: 1;
	}
	.select-checkbox {
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
	.logs-action-button {
		border-radius: 10px;
		margin: 7px;
		width: 120px;
	}
	.logs-action-button span {
		color: white;
		font-weight: bolder;
	}
	.logs-action-button#delete {
		background-color: crimson;
		border-color: crimson;
	}
	.logs-action-button#export {
		background-color: cornflowerblue;
		border-color: cornflowerblue;
	}
</style>
