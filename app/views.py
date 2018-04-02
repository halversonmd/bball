from app import app as ap
from flask import *
import requests, json, pandas as pd, numpy as np
from pandas.io.json import json_normalize
from datetime import datetime as dt, date, time as dttime
import csv, codecs, os
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

    file_path = '/home/ec2-user/baseball/data_files/matchup_data_{}.csv'.format(today_str)
    
    if not os.path.isfile(file_path):
        return "data_not_updated"
    csv_df = pd.read_csv(file_path)
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

    file_path = '/home/ec2-user/baseball/data_files/WOBA-data-for-{}.csv'.format(today_str)
    
    if not os.path.isfile(file_path):
        return "data_not_updated"
    csv_df = pd.read_csv(file_path)
    resp_json = []
    for i in csv_df.index:
        game_time = csv_df.loc[i, 'date_time']
        game_time = dt.datetime.strptime(game_time, '%Y-%m-%d %H:%M:%S')
        game_time = game_time.strftime('%Y-%m-%d %I:%M %p EST')
        resp_json.append({'batter': csv_df.loc[i, 'batter'],
            'b_tot_woba': csv_df.loc[i, 'b_tot_woba'],
            'b_hand': csv_df.loc[i, 'batter_handedness'],
            'batter_salary': csv_df.loc[i, 'batter_salary'],
            'batter_venue': csv_df.loc[i, 'batter_venue'],
            'date_time': game_time,
            'lineup_confirmed': csv_df.loc[i, 'lineup_confirmed'],
            'batter_venue_woba': csv_df.loc[i, 'batter_venue_woba'],
            'bwaph': csv_df.loc[i, 'bwaph'],
            'p_tot_woba': csv_df.loc[i, 'p_tot_woba'],
            'pitcher': csv_df.loc[i, 'pitcher'],
            'p_hand': csv_df.loc[i, 'pitcher_handedness'],
            'pitcher_salary': csv_df.loc[i, 'pitcher_salary'],
            'salary_over_k': csv_df.loc[i, 'salary_over_k'],
            'pwabh': csv_df.loc[i, 'pwabh'],
            'total_woba': csv_df.loc[i, 'total_woba']
            })
     

    return json.dumps(resp_json)

@ap.route('/api/last_update', methods=['GET', 'POST'])
def last_update():


    
    with open('/home/ec2-user/baseball/data_files/last_updated_prob.txt', 'r') as f:
        last_update_prob = f.read()

    with open('/home/ec2-user/baseball/data_files/last_updated_woba.txt', 'r') as f:
        last_update_woba = f.read()

    last_update_prob = dt.datetime.strptime(last_update_prob, '%Y-%m-%d %H:%M')
    last_update_prob = last_update_prob.strftime('%Y-%m-%d %I:%M %p EST')

    last_update_woba = dt.datetime.strptime(last_update_woba, '%Y-%m-%d %H:%M')
    last_update_woba = last_update_woba.strftime('%Y-%m-%d %I:%M %p EST')
    

    return json.dumps({'last_update_prob':last_update_prob, 'last_update_woba':last_update_woba})





