# MTA Ridership Breakdown

![Alt text](http://artcards.cc/review/wp-content/uploads/2010/06/2010june_mtamap.gif "Metro Map")

The MTA (Metro Transit Authority) New York City Transit is the largest public transportation agency in North America and one of the largest in the world. The subway has a daily ridership of more than 5.6 million and an annual ridership in 2016 of roughly 1.757 billion in total. Thankfully the MTA open sources the daily data in frequently updated feeds for app development and trend analysis. With that in mind our team decided to look deeper into the story of the day-to-day life on the New York Subway. To gain a better understanding of who is riding the New York Subway and when.

## The Data

![Alt text](images/MTA_Data_Feed.png?raw=true "Data Feed")
URL: http://web.mta.info (http://web.mta.info/developers/developer-data-terms.html#data)




### Extracted files:



**fares_190209.csv**

![Alt text](images/Fares_190209.png?raw=true "Fares Table")
Breakdown of the types of riders using the station. 
26 different fare types.
516 different stations.
Updated weekly.


**Turnstiles_190209.csv**
![Alt text](images/turnstyles_fares_stations2View.png?raw=true "Turnstyle Tables")

Tracks total entries and exits from all turnstiles divided into individual stations.
Updated every three hours.


**Station_ref.csv**
![Alt text](images/Stations_CSV.png?raw=true "Stations Table")

In depth info on station names, lines, and booths.
Turnstiles_fares_stations2.csv
Cleaned version of the fare data to include a unique Station ID.



## Extraction/Transformation.

**Data cleaning**
![Alt text](images/turnstyles_fares_stations2View.png?raw=true "Stations Cross Reference")

The data we retrieved from MTA did not have any unique identifiers for us to link turnstile data or fare data to our station location reference.

In order to allow us to query all 3 tables at once we needed to create a cross reference table that matched the station locations to the rows of data in the turnstile and fare data.

Luckily for us, the turnstile data and the fare data could be joined together on a unique id assigned to each bank of turnstiles in a station (UNIT and REMOTE).

From there we utilized StubHub's FuzzyWuzzy python library to perform fuzzy matching of the station name strings. This allowed us to match about 75% of the station names accurately. The remaining 25% of the matching was performed manually.

Another transformation that we needed to perform on the data was calculating differences on the turnstile data. Since turnstiles function by constantly counting upwards, we needed to subtract turnstile counts from the previous count to measure activity.

**SQLite Database**
  - 
SQLite Database is comprised of three tables, Fared Data, Stop Location Data, and Turnstile Data. Each of these tables were loaded into the database employing Python’s SQL Alchemy library. Once loaded, SQLite DB Browser was utilized to rename the columns, removing white space and any characters that would hinder the time it would take to write queries. Within the SQLite DB Browser primary keys were also assigned to each of tables. 

**Flask Application**
 - 
 
 Connection to the DB is created through the Flask App using SQL Alchemy. Queries are based off the SQL Alchemy ORM documentation and reflect standard SQL statements. 

Flask APP Routes and Queries
1.	@app.route(“/”)
a.	Main route to render our index.html. 
2.	 @app.route(“/locations”)
a.	Dedicated route that queries each stops latitude and longitude. As well as: stop name, division, structure type, and station id. 
3.	@app.route(“/fareData”)
a.	One of two routes for the Fare Data table. Initial route queries all fares and totals them by fare type. 
i.	@app.route(/locations/stopID/<stationed>”)
1.	Second route that takes a variable that is the unique Station ID and filters the query based upon the entered Station ID. 
4.	@app.route(“/locations/turnstile/null”)
a.	One of two routes for the heat map. Initial route queries all entries, exits, and total activity for all the stations grouped by date and time. 
i.	@app.route(“/locations/turnstile/<stopid>”)
1.	Second route that performs the same query as above however queries the table by the entered Station ID. 


 

## Visualization

![Alt text](images/Map.png?raw=true "Mapbox Map")

![Alt text](images/CalHeatMap.png?raw=true "CalHeat Map")
- link to heatmap code
- data source link
- problems
- adjustments
- advancements moving forward?

![Alt text](images/Barchart_totals.png?raw=true "Barchart")
- data source: fares_190209.csv


## Heroku App
- png of dashboard in case it's not working

https://mta-subway-information.herokuapp.com/



## Future work
- What we would like to see done with the repo.

















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


