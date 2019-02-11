import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect
from sqlalchemy import distinct
import json
import time

app = Flask(__name__)

# Connection to data base

# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@127.0.0.1:3306/sakila'
# db = SQLAlchemy(app)

engine = create_engine('mysql://root:@127.0.0.1:3306/mta')

Base = automap_base()
Base.prepare(engine, reflect=True)
session = Session(engine)
inspector = inspect(engine)

# Get table information
print(inspector.get_table_names())
# Get column information
print(inspector.get_columns('locations'))

stationLocations = Base.classes.locations

# route to main index.html template

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/locations")
def locations():
    # station lat lon and info
    stationInfo = session.query(stationLocations.GTFSLatitude, stationLocations.GTFSLongitude,
                                stationLocations.Division, stationLocations.Stop_Name, stationLocations.Line).all()
    return jsonify(stationInfo)

# route to distinct lines/structures/boroughs
@app.route("/locations/test")
def test():

    lines = session.query(distinct(stationLocations.Line)).all()
    return jsonify(lines)



if __name__ == "__main__":
    app.run(debug=True)
