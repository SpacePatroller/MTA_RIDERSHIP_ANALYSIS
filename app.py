import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect,
    url_for)

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
import requests

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
print(inspector.get_table_names())

session = Session(engine)

app = Flask(__name__)

# route to main index.html template


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/locations")
def locations():
    # station lat lon and info
    locInfo = session.query(locationsData.GTFS_Latitude, locationsData.GTFS_Longitude,
                            locationsData.Division, locationsData.Stop_Name, locationsData.Line).all()
    return jsonify(locInfo)


# route to distinct lines/structures/boroughs
@app.route("/locations/test/<line>")
def test(line):


    if line == "":
        lines = session.query(locationsData.GTFS_Latitude).filter(locationsData.GTFS_Latitude == line).all()
        return jsonify(lines)
    else:
        lines = session.query(locationsData.GTFS_Latitude).all()
        return jsonify(lines)

@app.errorhandler(404)
def page_not_found(e):
    return ("O something went wrong")
    




    

if __name__ == "__main__":
    app.run(debug=True)

