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
from sqlalchemy import text
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

# connection to station location table
locationsData = Base.classes.stationLocationData
# connecton to fare data table
fareData = Base.classes.fareData

turnStileData = Base.classes.turnStileData

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
                            locationsData.Division, locationsData.Stop_Name, locationsData.Line, locationsData.Structure, locationsData.Station_ID).all()
    return jsonify(locInfo)


@app.route("/fareData")
def fares():

      # list for of columns to query
    sel = [
        fareData.FF,
        fareData.SEN_DIS,
        fareData.SEVEN_D_AFAS_UNL,
        fareData.THIRTY_D_AFAS_RMF_UNL,
        fareData.JOINT_RR_TKT,
        fareData.SEVEN_D_UNL,
        fareData.THIRTY_D_UNL,
        fareData.FOURTEEN_D_RFM_UNL,
        fareData.ONE_D_UNL,
        fareData.FOURTEEN_D_UNL,
        fareData.SEVEND_XBUS_PASS,
        fareData.TCMC,
        fareData.RF_TWO_TRIP,
        fareData.RR_UNL_NO_TRADE,
        fareData.TCMC_ANNUAL_MC,
        fareData.MR_EZPAY_EXP,
        fareData.MR_EZPAY_UNL,
        fareData.PATH_TWO_T,
        fareData.AIRTRAIN_FF,
        fareData.AIRTRAIN_THIRTY_D,
        fareData.AIRTRAIN_TEN_T,
        fareData.AIRTRAIN_MTHLY,
        fareData.STUDENTS,
        fareData.NICE_TWO_T,
        fareData.CUNY_ONETWENTY,
        fareData.CUNY_SIXTY

    ]

    fareInformation = session.query(fareData.STATION).all()
    fareCountInformation = session.query(func.sum(fareData.FF),
                    func.sum(fareData.SEN_DIS),
                    func.sum(fareData.SEVEN_D_AFAS_UNL),
                    func.sum(fareData.THIRTY_D_AFAS_RMF_UNL),
                    func.sum(fareData.JOINT_RR_TKT),
                    func.sum(fareData.SEVEN_D_UNL),
                    func.sum(fareData.THIRTY_D_UNL),
                    func.sum(fareData.FOURTEEN_D_RFM_UNL),
                    func.sum(fareData.ONE_D_UNL),
                    func.sum(fareData.FOURTEEN_D_UNL),
                    func.sum(fareData.SEVEND_XBUS_PASS),
                    func.sum(fareData.TCMC),
                    func.sum(fareData.RF_TWO_TRIP),
                    func.sum(fareData.RR_UNL_NO_TRADE),
                    func.sum(fareData.TCMC_ANNUAL_MC),
                    func.sum(fareData.MR_EZPAY_EXP),
                    func.sum(fareData.MR_EZPAY_UNL),
                    func.sum(fareData.PATH_TWO_T),
                    func.sum(fareData.AIRTRAIN_FF),
                    func.sum(fareData.AIRTRAIN_THIRTY_D),
                    func.sum(fareData.AIRTRAIN_TEN_T),
                    func.sum(fareData.AIRTRAIN_MTHLY),
                    func.sum(fareData.STUDENTS),
                    func.sum(fareData.NICE_TWO_T),
                    func.sum(fareData.CUNY_ONETWENTY),
                    func.sum(fareData.CUNY_SIXTY)

                   ).all()

    return jsonify(fareInformation, fareCountInformation)


# route to distinct lines/structures/boroughs
@app.route("/locations/stopID/<stationid>")
def fareInfo(stationid):

    # list for of columns to query
    sel=[
        fareData.FF,
        fareData.SEN_DIS,
        fareData.SEVEN_D_AFAS_UNL,
        fareData.THIRTY_D_AFAS_RMF_UNL,
        fareData.JOINT_RR_TKT,
        fareData.SEVEN_D_UNL,
        fareData.THIRTY_D_UNL,
        fareData.FOURTEEN_D_RFM_UNL,
        fareData.ONE_D_UNL,
        fareData.FOURTEEN_D_UNL,
        fareData.SEVEND_XBUS_PASS,
        fareData.TCMC,
        fareData.RF_TWO_TRIP,
        fareData.RR_UNL_NO_TRADE,
        fareData.TCMC_ANNUAL_MC,
        fareData.MR_EZPAY_EXP,
        fareData.MR_EZPAY_UNL,
        fareData.PATH_TWO_T,
        fareData.AIRTRAIN_FF,
        fareData.AIRTRAIN_THIRTY_D,
        fareData.AIRTRAIN_TEN_T,
        fareData.AIRTRAIN_MTHLY,
        fareData.STUDENTS,
        fareData.NICE_TWO_T,
        fareData.CUNY_ONETWENTY,
        fareData.CUNY_SIXTY

    ]

    fareInformation = session.query(fareData.STATION).filter(
        fareData.Station_ID == stationid).all()
    fareCountInformation=(session.query(
        *sel).filter(fareData.Station_ID == stationid).all())
    return jsonify(fareInformation, fareCountInformation)


@app.route("/locations/turnstile/null")
def turnstile():

    data=session.query((turnStileData.DATE),
                         (turnStileData.TIME),
                         func.sum(turnStileData.ENTRIES_DIFF),
                         func.sum(turnStileData.EXITS_DIFF),
                         func.sum(turnStileData.TOTAL_ACTIVITY),

                         ).group_by(turnStileData.DATE, turnStileData.TIME).all()

    return jsonify(data)

@app.route("/locations/turnstile/<stopid>")
def turnstileByStopID(stopid):

    data=session.query((turnStileData.DATE),
                         (turnStileData.TIME),
                         func.sum(turnStileData.ENTRIES_DIFF),
                         func.sum(turnStileData.EXITS_DIFF),
                         func.sum(turnStileData.TOTAL_ACTIVITY),

                         ).group_by(turnStileData.DATE, turnStileData.TIME).filter(turnStileData.Station_ID == stopid).all()

    return jsonify(data)


  
if __name__ == "__main__":
    app.run(debug = True)
