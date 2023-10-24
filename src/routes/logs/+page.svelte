<script>
  let flightLogs = [
    {
      index: 0,
      date: '2023-10-17',
      location: 'Rolla',
      startTime: '3:00 PM',
      stopTime: '5:00 PM',
      condition: 'Sunny',
      windSpeed: '35 MPH',
      tempF: '70',
      tempC: '21.1',
      expanded: false,
    },
  ];

  function addNewLog() {
    const newLog = {
      index: flightLogs.length,
      date: 'New Date',
      location: 'New Location',
      startTime: 'New Start Time',
      stopTime: 'New Stop Time',
      condition: 'New Condition Info',
      windSpeed: 'New Wind Speed',
      tempF: 'New Farenheit Temperature',
      tempC: 'New Celsius Temperature',
      expanded: false,
    };
    flightLogs = [...flightLogs, newLog];
  }

  /** @param {number} index */
  function toggleExpansion(index) {
    flightLogs[index].expanded = !flightLogs[index].expanded;
  }
</script>

<div id="flightform">
  <h1 style="text-align: center; font-family: Proxima; font-weight: bolder;">Flight Logs</h1>
  <div id="logs-container">
    {#each flightLogs as log, i (log.index)}
      <div class="flight-log">
        <div>
          <span>Date: {log.date}</span>
          <span>Location: {log.location}</span>
          <span>Start Time: {log.startTime}</span>
          <span>End Time: {log.stopTime}</span>
          <span>Condition: {log.condition}</span>
          <button on:click={() => toggleExpansion(i)} class="expand-button">
            {log.expanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
        {#if log.expanded}
          <div class="log-info">
          <span>Wind Speed: {log.windSpeed}</span>
          <span>Temperature°F: {log.tempF}</span>
          <span>Temperature°C: {log.tempC}</span>
          </div>
        {/if}
      </div>
    {/each}
  </div>
  <button on:click={addNewLog}>Add New Log</button>
</div>

  
  <style>
    .flight-log {
      border: 1px solid #000000;
    margin: 1em 0;
    padding: 1em;
    background-color: white;
    }
    .expand-button {
    cursor: pointer;
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
