<div id="about-container">
	<div id="title">
		<h1 style="font-size: 50px;">The Compakt Web App</h1>
		<h1 style="font-size: 35px;">By:</h1>
		<a id="multirotor-link" href="https://multirotor.mst.edu/" target="_blank">
			<div id="animated-logo-icon-wrapper">
				<img id="animated-logo-icon" src="/multirotorlogo_icon.png" alt="logo icon" height="auto" />
			</div>
			<img id="animated-logo-text" src="/multirotorlogo_text.png" alt="logo text" height="auto" />
		</a>
	</div>

	<div id="details">
		<h1 style="font-size: 35px; margin-top:4ch">How do I use Compakt?</h1>
		<h1 style="font-size: 20px; margin-top:-1ch">
			<div class="text-box-container">
				<div class="text-box-tutorial">
					There are two main pages to navigate between, the "Record" and the "Logs" pages. Record
					does exactly what the name suggests, that is where you will go to enter information and
					record your flight. <br /><br /> Once a flight has been recorded, the information will be
					used to create a record in our database where it can be viewed via the logs page. Within
					the logs page, you can manage any previously recorded flight log with various options.
					<br /><br /> The created logs are sorted by most recent to oldest by default and can be expanded
					to show more detailed weather data.
				</div>
			</div>
		</h1>
		<h1 style="font-size: 35px; margin-top:4ch">Key Information</h1>
		<h1 style="font-size: 20px; margin-top:-1ch">
			<div class="text-box-container">
				<div class="text-box-info">
					- Compakt is compatible with both mobile and desktop platforms that have a connection to
					the internet. <br /><br />
					- The weather API used to gather data is based on the general area of the city provided, not
					specifically the testing location <br /><br />
					- After a flight is recorded, Compakt will update in real time to display the data in the logs
					page <br /><br />
					- Flight logs can be exported as .CSV files from the logs page by selecting the logs you need
					and then clicking the download button <br /><br />
					- The proper authorities / personnel are required to be contacted and notified before the drone
					is flown <br /><br />
					- All entry fields must be filled out in the record page in order for a log to be created
				</div>
			</div>
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
	#multirotor-link {
		width: min(calc(1129px / 2), 80vw);
		height: min(calc(465px / 2), calc(465 / 1129 * 80vw));
		position: relative;
		display: block;
		margin: auto;
	}
	#animated-logo-icon-wrapper {
		width: calc(465 / 1129 * 100%);
		height: calc(464 / 465 * 100%);
		clip-path: polygon(
			0 0,
			100% 0,
			100% calc(66 / 464 * 200%),
			calc(179.5 / 465 * 200%) calc(66 / 464 * 200%),
			calc(179.5 / 465 * 200%) calc(149.5 / 464 * 200%),
			100% calc(149.5 / 464 * 200%),
			100% 100%,
			0 100%
		);
	}

	#animated-logo-icon {
		position: absolute;
		width: calc(465 / 1129 * 100%);
		height: calc(464 / 465 * 100%);
		left: calc(7 / 1129 * 100%);
		top: 0;
		animation-name: spin;
		animation-duration: 6000ms;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}
	#animated-logo-icon:hover {
		content: url('/multirotorlogo_icon_blurred.png');
		animation-name: spin;
		animation-duration: 600ms;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}
	#animated-logo-text {
		position: absolute;
		width: calc(756 / 1129 * 100%);
		left: calc(359 / 1129 * 100%);
		top: calc(132 / 465 * 100%);
	}
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	.text-box-tutorial {
		border: 2px solid #000000;
		margin-bottom: 0.25em;
		padding: 1.5em;
		padding-bottom: 0.25em;
		padding-top: 0.25em;
		text-align: center;
		width: 30rem;
	}
	.text-box-info {
		border: 2px solid #000000;
		margin-bottom: 0.25em;
		padding: 1.5em;
		padding-bottom: 0.25em;
		padding-top: 0.25em;
		text-align: left;
		width: 40rem;
	}
	.text-box-container {
		display: flex;
		justify-content: center;
	}
</style>
