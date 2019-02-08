# Group_A_Project_2

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


