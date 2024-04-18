<div id="about-container">
	<div id="title">
		<h1 style="font-size: 50px;">The Compakt Web App</h1>
		<h1 style="font-size: 35px;">By:</h1>
		<a href="https://multirotor.mst.edu/" target="_blank">
			<img src="/multirotorlogo.png" alt="logo" width="50%" height="auto" />
		</a>
	</div>

	<div id="details">
		<h1 style="font-size: 35px; margin-top:4ch">How do I use Compakt?</h1>
		<h1 style="font-size: 20px; margin-top:-1ch">
			<div class="text-box-container">
				<div class="text-box-tutorial"> 
					There are two main pages to navigate between, the "Record" and the "Logs" pages.
					Record does exactly what the name suggests, that is where you will go to enter information
					and record your flight. <br><br> Once a flight has been recorded, the information will be used to create a record in our database
					where it can be viewed via the logs page. Within the logs page, you can manage any previously recorded
					flight log with options for exporting or deleting flight logs. <br><br> The created logs are sorted
					by most recent to oldest by default and can be expanded to show more detailed weather data.
				</div>
			</div>
		</h1>
		<h1 style="font-size: 35px; margin-top:4ch">Key Information</h1>
		<h1 style="font-size: 20px; margin-top:-1ch">
			<div class="text-box-container">
				<div class="text-box-info"> 
					- Compakt is compatible with both mobile and desktop platforms that have a connection to the internet. <br><br>
					- The weather API used to gather data is based on the general area of the city provided, not specifically the testing location <br><br>
					- After a flight is recorded, Compakt will update in real time to display the data in the logs page <br><br>
					- Flight logs can be exported as .CSV files from the logs page by selecting the logs you need and then clicking the download button <br><br>
					- The proper authorities / personnel are required to be contacted and notified before the drone is flown <br><br>
					- All entry fields must be filled out in the record page in order for a log to be created.
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
	.text-box-tutorial {
		border: 2px solid #000000;
		margin-bottom: 0.25em;
		padding: 1.5em;
		padding-bottom: 0.25em;
		padding-top: 0.25em;
		text-align: center;
		width: calc(81vw - 50em);
	}
	.text-box-info {
		border: 2px solid #000000;
		margin-bottom: 0.25em;
		padding: 1.5em;
		padding-bottom: 0.25em;
		padding-top: 0.25em;
		text-align: left;
		width: calc(85vw - 50em);
	}
	.text-box-container {
		display: flex;
		justify-content: center;
	}
</style>
