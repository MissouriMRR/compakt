<script lang="ts">
	import { CsvDataService } from '$lib/data';
	import type { FlightLog } from '$lib/structs';
	import { LogArray, ReservedId } from '$lib/stores';
	import { dev } from '$app/environment';
	import { page } from '$app/stores';

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
				flightLogsNext.push(log);
			} else {
				deletedIds.push(log.id);
			}
		}

		if(!dev) {
			await fetch('/api/logs', {
				method: 'DELETE',
				body: JSON.stringify(deletedIds),
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			});
		}

		$LogArray = [...flightLogsNext];
		$ReservedId = Math.max(...flightLogsNext.map((log) => log.id))
	}

	/**
	 * @description
	 *	Exports the selected logs to a CSV file
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
	 * @param {number} id Id of the flight log to expand
	*/
	function toggleExpansion(id: number) {
		for (let i = 0; i < $LogArray.length; i++) {
			if ($LogArray[i].id === id) {
				$LogArray[i].v_props.expanded = !$LogArray[i].v_props.expanded;
				break;
			}
		}
	}

	/**
	 * @description
	 * Sorts a list of logs by their dates and start times
	 * @param {FlightLog[]} logArray Copy of log array to sort
	*/
	function chronologicSort(logArray: FlightLog[]) {
		logArray.sort((flight_a, flight_b) => {
			const dateStringA = `${flight_a.flight_date}T${flight_a.start_time}`;
			const dateStringB = `${flight_b.flight_date}T${flight_b.start_time}`;
			return Date.parse(dateStringB) - Date.parse(dateStringA);
		});
		return logArray;
	}

	function logBlobToImage(log_blob) {
	try {
      // Convert the data URL to a Blob
      const byteString = atob(log_blob.split(',')[1]);
      const mimeString = log_blob.split(',')[0].split(':')[1].split(';')[0];
      const ab = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        ab[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      
      // Creates The Blob URL
      const imageURL = URL.createObjectURL(blob);
	  return(imageURL)

    } catch (error) {
      alert("Error creating Blob URL");
	  return null;
    }
}

</script>

<div id="logs-container">
	<h1>Flight Logs</h1>
	<div class="logs-action-container">
		{#if dev}
		<button on:click={deleteSelectedLogs} id="delete">
			<img alt="Delete target data" src="/feather/trash-2.svg"/>
		</button>
		{/if}
		<button on:click={exportSelectedLogs} id="export">
		<img alt="Export target data" src="/feather/download.svg"/>
		</button>
	</div>
	<div>
		{#each chronologicSort($LogArray) as log (log.id)}
			<div id={`${log.id}`} class="flight-log">
				<div class="log-header">
					<input class="select-checkbox" type="checkbox" bind:checked={log.v_props.selected} />
					<span>{log.location}</span>
					<span>{log.flight_date}</span>
					<span>{log.start_time}</span>
				</div>
				<button class="expand-button" on:click={() => toggleExpansion(log.id)}>
					{#if log.v_props.expanded}
						<img alt="Collapse" src="/feather/chevron-up.svg"/>
					{:else}
						<img alt="Expand" src="/feather/chevron-down.svg"/>
					{/if}
				</button>
				{#if log.v_props.expanded}
					<table class="log-info">
						<tr><td class="key-col">Start Time</td><td>{log.start_time}</td></tr>
						<tr><td class="key-col">End Time</td><td>{log.stop_time}</td></tr>
						<tr><td class="key-col">Temperature</td><td>{log.temp_f}°F</td></tr>
						<tr><td class="key-col">Wind Speed</td><td>{log.wind_speed_mph} MPH</td></tr>
						<tr><td class="key-col">Wind Direction</td><td>{log.wind_direction}</td></tr>
						<tr><td class="key-col">Gust Speed</td><td>{log.gust_speed_mph} MPH</td></tr>
						<tr><td class="key-col">Humidity</td><td>{log.humidity}%</td></tr>
						<tr><td class="key-col">Pilot ID</td><td>{log.pilot_id}</td></tr>
						<tr><td class="key-col">Remote ID</td><td>{log.remote_id}</td></tr>
						<tr><td class="key-col">Max Altitude</td><td>{log.max_altitude_ft} FT</td></tr>
						<tr><td class="key-col">Ground Station Operator</td><td>{log.ground_station_op}</td></tr>
						<tr><td class="key-col">Visual Operator</td><td>{log.visual_observer}</td></tr>
						<tr><td class="key-col">Terrain</td><td>{log.terrain}</td></tr>
						<tr><td class="key-col">Bystanders Present</td><td>{log.bystanders}</td></tr>
						<tr><td class="key-col">Airspace Class</td><td>{log.airspace_class}</td></tr>
						<tr><td class="key-col">Pilot in Command</td><td>{log.pilot_in_command}</td></tr>
						<tr><td class="key-col">Officer Signature</td><td>
							<img alt="Signature" src={logBlobToImage(log.officer_signature)}/></td><tr></tr>
					</table>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	#logs-container {
		display: flex;
		flex-direction: column;
		font-family: 'IBMPlexSans-Regular';
		justify-content: left;
		height: 90vh;
		overflow-y: auto;
		overflow-x: hidden;
	}
	h1 {
		font-size: min(40px, 8vw);
		font-weight: bold;
		text-align: center;
	}
	.logs-action-container {
		display: flex;
		flex-direction: row;
	}
	.logs-action-container button {
		border-radius: .5em;
		flex: 1;
		margin: .5em;
	}
	.logs-action-container button#delete {
		background-color: crimson;
		border-color: crimson;
	}
	.logs-action-container button#export {
		background-color: cornflowerblue;
		border-color: cornflowerblue;
	}
	.flight-log {
		background-color: #ffffff;
		border: 1px solid #000000;
		margin-bottom: 0.25em;
		padding: 1.5em;
		padding-bottom: 0;
		text-align: center;
		width: calc(100vw - 3em);
	}
	.log-header {
		align-items: center;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		font-weight: bold;
		justify-content: space-between;
	}
	.select-checkbox {
		height: 2em;
		margin-left: 2ch;
		text-align: center;
		width: 2em;
	}
	#log-header span {
		flex: 1;
	}
	.expand-button {
		background: none;
		border: none;
		cursor: pointer;
		width: 100%;
	}
	.log-info {
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-bottom: 1.5em;
	}
	.log-info tr {
		border-bottom: 1px solid black;
		display: flex;
		flex-direction: row;
		width: 100%;
	}
	.log-info td {
		flex: 1;
		margin: .25em;
		text-align: right;
	}
	td.key-col {
		text-align: left;
	}
</style>
