import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import create_engine, func
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect
from sqlalchemy.engine import reflection
from sqlalchemy import distinct
from sqlalchemy.pool import StaticPool

import queue
import threading


import json
import time

# Connection to data base

Base = automap_base()

engine = create_engine("sqlite:///mta.db.sqlite",
    connect_args={'check_same_thread': False},
    poolclass=StaticPool, echo=True)

# reflect the tables
Base.prepare(engine, reflect=True)


locationsData = Base.classes.stationLocationData

inspector = inspect(engine)
print (inspector.get_table_names())

session = Session(engine)

app = Flask(__name__)

# route to main index.html template
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/locations")
def locations():
    # station lat lon and info
    locInfo = session.query(locationsData.GTFS_Latitude, locationsData.GTFS_Longitude, locationsData.Division, locationsData.Stop_Name, locationsData.Line).all()
    return jsonify(locInfo)
   

# route to distinct lines/structures/boroughs
@app.route("/locations/test")
def test():

    distinctLines = session.query(distinct(locationsData.Line)).all()
    return jsonify(distinctLines)


if __name__ == "__main__":
    app.run(debug=True)
