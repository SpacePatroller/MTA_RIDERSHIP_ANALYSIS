# MTA Ridership Breakdown

![Alt text](http://artcards.cc/review/wp-content/uploads/2010/06/2010june_mtamap.gif "Metro Map")

The MTA (Metro Transit Authority) New York City Transit is the largest public transportation agency in North America and one of the largest in the world. The subway has a daily ridership of more than 5.6 million and an annual ridership in 2016 of roughly 1.757 billion in total. Thankfully the MTA open sources the daily data in frequently updated feeds for app development and trend analysis. With that in mind our team decided to look deeper into the story of the day-to-day life on the New York Subway. To gain a better understanding of who is riding the New York Subway and when.

# The Data

![Alt text](images/Fares_190209.png?raw=true "Fares Table")
URL: http://web.mta.info (http://web.mta.info/developers/developer-data-terms.html#data)
Extracted files:
fares_190209.csv




![Alt text](/relative/path/to/img.jpg?raw=true "Optional Title")

fares_190209.csv
![Alt text](images/Fares_190209.png?raw=true "Fares Table")
Breakdown of the types of riders using the station. 
26 different fare types.
516 different stations.
Updated weekly.


![Alt text](images/turnstyles_fares_stations2View.png?raw=true "Turnstyle Tables")

Turnstiles_190209.csv

Tracks total entries and exits from all turnstiles divided into individual stations.
Updated every three hours.


![Alt text](images/Stations_CSV.png?raw=true "Stations Table")

Station_ref.csv

In depth info on station names, lines, and booths.
Turnstiles_fares_stations2.csv
Cleaned version of the fare data to include a unique Station ID.





index.html	 Initial Layout has been set. 

•	This is just a base start to help visualize the dashboard. 
•	HTML contains at the moment CDN paths to script libraries needed. Unsure if we wanted to download libraries and host them in our path. 
•	CSS ID’s
o	    #mapid	main map 
o	    #mtaChart	mta d3 chart id
o	    #mtaTable	table data

app.py		Flask App is up and running. 

•	Basic modules have been imported.
•	Connection has been made to the sakila database for testing purposes. 
•	Main Page
o	    @app.route("/")
•	Page that test DB query results.
o	    @app.route("/test")

•	I was only able to connect to the DB using 
o	    engine = create_engine
o	        The below did not work for me but maybe if needed we can figure it out probably. 
o	               # app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@127.0.0.1:3306/sakila'
o	                 # db = SQLAlchemy(app)

app.js		Initial JavaScript file. 
•	Just testing to make sure communication between files. It works. 
o	    console.log("testing testing");


