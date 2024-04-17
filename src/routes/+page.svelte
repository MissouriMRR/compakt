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
				<div class="text-box"> 
					There are two main pages to navigate between, the "Record" and the "Logs" pages. <br>
					Record does exactly what the name suggests, that is where you will go to enter information <br>
					and record your flight. Once a flight has been recorded, the information will be used to create a record in our database <br> 
					where it can be viewed via the logs page. Within the logs page, you can manage any previously recorded <br>
					flight log with options for exporting or deleting flight logs. The created logs are sorted <br>
					by most recent to oldest by default and can be expanded to show more detailed weather data. <br>
				</div>
			</div>
		</h1>
		<h1 style="font-size: 35px; margin-top:4ch">Key Information</h1>
		<h1 style="font-size: 20px; margin-top:-1ch">
			<div class="text-box-container">
				<div class="text-box"> 
					- Compakt is compatible with both mobile and desktop platforms that have a connection to the internet. <br>
					- The weather API used to gather data is based on the general area of the city provided, not specifically the testing location <br>
					- After a flight is recorded, Compakt will update in real time to display the data in the logs page <br>
					- Flight logs can be exported as .CSV files from the logs page by selecting the logs you need and then clicking the download button <br>
					- The proper authorities / personnel are required to be contacted and notified before the drone is flown <br>
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
	.text-box {
		border: 1px solid #000000;
		margin-bottom: 0.25em;
		padding: 1.5em;
		padding-bottom: 0;
		padding-top: 0;
		text-align: center;
		width: calc(100vw - 50em);
	}
	.text-box-container {
		justify-content: center;
		display: flex;

	}
</style>
