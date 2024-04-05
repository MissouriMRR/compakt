<script>
  import { dev } from '$app/environment';
  import { onMount } from 'svelte';
	import { init } from '$lib/load';

  if(!dev) {
    onMount(() => init());
  }

  let checklistVisible = true;
  let checks = [false, false];
  
  function onConfirm() {
    if(checks.every(Boolean)) {
      checklistVisible = false;
    }
  }
</script>

{#if checklistVisible}
  <div class="checklist-container">
    <div class="checklist">
      <h1>Flight Checklist</h1>
      <div class="checklist-item">
        <input id="hospital-num-check" type="checkbox" bind:checked={checks[0]}/>
        <label for="hospital-num-check">Call Phelps Health<br>(573) 458-8899</label>
      </div>
      <div class="checklist-item">
        <input id="police-num-check" type="checkbox" bind:checked={checks[1]}/>
        <label for="police-num-check">Call S&T University Police<br>(573) 341-4300</label>
      </div>
      <button on:click={onConfirm}>
        Confirm
      </button>
    </div>
  </div>
{/if}

<div id="navbar">
  <div id="title">
    <a href="https://multirotor.mst.edu/" target="_blank"
      ><img src="/favicon.png" id="logo" alt="logo" style="margin-right: 1ch"
    /></a>
    <a class="tab-link" id="title-tab" href="/">Compakt</a>
  </div>
  <div id="tabs">
    <a class="tab-link" href="/record">Record</a>
    <a class="tab-link" href="/logs">Logs</a>
  </div>
</div>

<style>
  #logo {
    width: min(9vw, 9vh);
    height: auto;
  }
  .checklist-container {
    align-items: center;
    background-color: #00000077;
    display: flex;
    height: 100vh;
    justify-content: center;
    position: absolute;
    width: 100vw;
  }
  .checklist {
    align-items: center;
    background-color: white;
    border: 3px solid black;
    border-radius: 1em;
    display: flex;
    flex-direction: column;
    height: auto;
    padding: 1.5em;
    text-align: center;
    width: 40vh;
  }
  .checklist h1 {
    font-family: 'IBMPlexSans-Bold';
    margin-bottom: 0.5em;
  }
  .checklist h1 {
    text-decoration: underline;
  }
  .checklist label {
    font-family: 'IBMPlexSans-Bold';
    font-size: 19px;
    margin: 0.5em;
  }
  .checklist .checklist-item {
    display: flex;
    flex-direction: row;
  }
  .checklist-item input {
    height: auto;
    width: 2em;
  }
  .checklist button {
    border-radius: 100px;
    font-weight: bold;
    font-size: 20px;
    height: 40px;
    margin-top: 1em;
    text-align: center;
    width: 150px;
  }
  div#navbar {
    align-items: center;
    background-color: white;
    border-bottom: 3px solid black;
    display: flex;
    flex-direction: row;
    height: 10vh;
    width: 100%;
  }
  div#navbar div {
    align-items: center;
    display: flex;
    flex: 1;
    margin: 0.5em;
  }
  div#title {
    justify-content: left;
  }
  div#tabs {
    justify-content: right;
  }
  a.tab-link {
    border-radius: 0.5em;
    color: black;
    width: 14vw;
    font-family: 'IBMPlexSans-Bold';
    font-size: min(30px, 4vw);
    padding: 0.25em;
    text-align: center;
    text-decoration: none;
    white-space: nowrap;
  }
  a:hover.tab-link {
    background-color: rgba(0, 0, 0, 0.1);
  }
  a#title-tab {
    font-size: min(35px, 5vw);
    width: auto;
  }
</style>

<slot></slot>