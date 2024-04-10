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
			There are two main pages to navigate between, the "Record" and the "Logs" pages. <br>
			Record does exactly what the name suggests, that is where you will go to enter information <br>
			and record your flight. Once a flight has been recorded, the information will be used to create a record in our database <br> 
			where it can be viewed via the logs page. The created logs are sorted by most recent to oldest by default <br>
			and can be expanded to show more detailed weather data. You can also manage any previously recorded <br>
			flight log with options for exporting or deleting flight logs. <br>
		</h1>
		<h1 style="font-size: 35px; margin-top:4ch">Key Information</h1>
		<h1 style="font-size: 20px; margin-top:-1ch">
			- Compakt is compatible with both mobile and desktop platforms that have a connection to the internet. <br>
			- The weather API used to gather data is based on the general area of the city provided, not specifically the testing location <br>
			- The database is updated in real time when a flight is recorded and will display the flight in the logs page <br> 
			- Flight logs are exported as .CSV files from the logs page by selecting the logs you need and then clicking the download button <br>
			- The proper authorities / personnel are required to be contacted and notified before the drone is flown <br>
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
</style>
