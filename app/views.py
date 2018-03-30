from app import app as ap
from flask import *
import requests, json, pandas as pd, numpy as np
from pandas.io.json import json_normalize
from datetime import datetime as dt, date, time as dttime
import csv, codecs
from sqlalchemy import *
from sqlalchemy.orm import sessionmaker
from flask_triangle import Triangle
import datetime as dt

Triangle(ap)

today = dt.datetime.now()
today = today - dt.timedelta(hours=4)
today_str = today.strftime('%Y-%m-%d')

@ap.route('/', methods=['GET', 'POST'])
def index():
   

    return render_template('main.html')

@ap.route('/api/woba_data', methods=['GET', 'POST'])
def api_woba_data():

    csv_df = pd.read_csv('~/baseball/data_files/matchup_data_{}.csv'.format(today_str))
    
    resp_json = []
    for i in csv_df.index:
        resp_json.append({'batter': csv_df.loc[i, 'batter'],
            'against': csv_df.loc[i, 'against'],
            'batter_avg_fant': csv_df.loc[i, 'batter_avg_fant'],
            'prob_fant_abov_avg': csv_df.loc[i, 'prob_fant_abov_avg']
            })
     

    return json.dumps(resp_json)

@ap.route('/api/fant_data', methods=['GET', 'POST'])
def api_fant_data():

    csv_df = pd.read_csv('~/baseball/data_files/WOBA-data-for-{}.csv'.format(today_str))
    
    resp_json = []
    for i in csv_df.index:
        resp_json.append({'batter': csv_df.loc[i, 'batter'],
            'b_tot_woba': csv_df.loc[i, 'b_tot_woba'],
            'b_hand': csv_df.loc[i, 'batter_handedness'],
            'batter_salary': csv_df.loc[i, 'batter_salary'],
            'bwaph': csv_df.loc[i, 'bwaph'],
            'p_tot_woba': csv_df.loc[i, 'p_tot_woba'],
            'pitcher': csv_df.loc[i, 'pitcher'],
            'p_hand': csv_df.loc[i, 'pitcher_handedness'],
            'pitcher_salary': csv_df.loc[i, 'pitcher_salary'],
            'pwabh': csv_df.loc[i, 'pwabh'],
            'total_woba': csv_df.loc[i, 'total_woba']
            })
     

    return json.dumps(resp_json)




