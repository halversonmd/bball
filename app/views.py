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
from flask_login import login_required, current_user, login_user, logout_user
from app.forms import LoginForm, RegistrationForm
from app.models import User
from werkzeug.urls import url_parse

Triangle(ap)

@ap.route('/login', methods=['GET', 'POST'])

def login_page():

    form = LoginForm()
    email = form.email.data
    pw = form.password.data

    if form.validate_on_submit():

        user = User(email=email)
        if user.validated(pw):
            login_user(user, remember=form.remember_me.data)
            next_page = request.args.get('next')
            if not next_page or url_parse(next_page).netloc != '':
                next_page = url_for('index')

            return redirect(next_page)
        else:
            flash('Invalid username or password')
            return redirect(url_for('login_page'))
    
    return render_template("login.html", form=form)

@ap.route('/register', methods=['GET', 'POST'])
def register():

    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(email=form.email.data)
        print form.password.data
        result, msg = user.insert_pw(form.password.data)
        if result:
            login_user(user)
            return redirect(url_for('index'))
        else:
            flash(msg)
        return redirect(url_for('register'))
    return render_template('register.html', title='Register', form=form)



@ap.route('/', methods=['GET', 'POST'])
@login_required
def index():
   

    return render_template('main.html')

@ap.route('/api/woba_data', methods=['GET', 'POST'])
def api_woba_data():

    today = dt.datetime.now()
    today = today - dt.timedelta(hours=4)
    today_str = today.strftime('%Y-%m-%d')
    if 'date' in request.args:
        today_str = request.args.get('date')

    #server
    file_path = '/home/ec2-user/baseball/data_files/matchup_data_{}.csv'.format(today_str)

    #local
    # file_path = '/Users/mhalverson/Desktop/baseball/data_files/matchup_data_{}.csv'.format(today_str)
    
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

@ap.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('login_page'))

@ap.route('/api/fant_data', methods=['GET', 'POST'])
def api_fant_data():

    today = dt.datetime.now()
    today = today - dt.timedelta(hours=4)
    today_str = today.strftime('%Y-%m-%d')
    if 'date' in request.args:
        today_str = request.args.get('date')

    #server
    file_path = '/home/ec2-user/baseball/data_files/WOBA-data-for-{}.csv'.format(today_str)

    #local
    # file_path = '/Users/mhalverson/Desktop/baseball/data_files/WOBA-data-for-{}.csv'.format(today_str)
    
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
            'batter_pos': csv_df.loc[i, 'batter_pos'],
            'batter_team': csv_df.loc[i, 'batter_team'],
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





