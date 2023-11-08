<script lang="ts">
  let flightLogs = [
    {
      index: 0,
      date: '2023-10-17',
      location: 'Rolla',
      startTime: '3:00 PM',
      stopTime: '5:00 PM',
      tempF: '70',
      tempC: '21.1',
      windSpeed: '35 MPH',
      windDirection: 'North',
      windDegree: '180',
      gustSpeed: '10 MPH',
      Humidity: '5%',
      expanded: false,
    },
  ];

  function addNewLog() {
    const newLog = {
      index: flightLogs.length,
      expanded: false,
      date: 'New Date',
      location: 'New Location',
      startTime: 'New Start Time',
      stopTime: 'New Stop Time',
      tempF: 'New Fahrenheit Temperature',
      tempC: 'New Celsius Temperature',
      windSpeed: 'New Wind Speed',
      windDirection: 'New Wind Direction',
      windDegree: 'New Wind Degree',
      gustSpeed: 'New Gust Speed',
      Humidity: 'New Humidity',
    };
    flightLogs = [...flightLogs, newLog];
  }

  function toggleExpansion(index: number) {
    flightLogs[index].expanded = !flightLogs[index].expanded;
  }
</script>

<div id="flightform">
  <h1 style="text-align: center; font-family: Proxima; font-weight: bolder;">Flight Logs</h1>
  <div id="logs-container">
    {#each flightLogs as log, i (log.index)}
      <div class="flight-log">
        <div class="expand-details">
          <span>Date: {log.date}</span>
          <span>Location: {log.location}</span>
          <span>Start Time: {log.startTime}</span>
          <span>End Time: {log.stopTime}</span>
          <button on:click={() => toggleExpansion(i)} class="expand-button">
            {log.expanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
        {#if log.expanded}
          <div class="log-info">
            <span><br>Temperature: {log.tempF}°F<br><br>Temperature: {log.tempC}°C<br><br>Wind Speed: {log.windSpeed}<br><br>Wind Direction: {log.windDirection}<br><br>Remote ID: </span>
            <span><br>Wind Degree: {log.windDegree}°<br><br>Gust Speed: {log.gustSpeed}<br><br>Humidity: {log.Humidity}<br><br>Pilot ID: </span>
            </div>
        {/if}
      </div>
    {/each}
  </div>
  <h4 style="text-align: center;">
  <button on:click={addNewLog}>Add New Log</button>
</div>

<style>
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
    max-width: 60%;
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
</style>
