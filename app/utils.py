import json, time, re, time
import pandas as pd
from sqlalchemy import *
from sqlalchemy.sql import select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.mysql import *
import MySQLdb
from flask_bcrypt import Bcrypt
from app import app 


class db_login:

    def __init__(self):
        db_uri = app.config['SQLALCHEMY_DATABASE_URI']
        self.flsk_bcrypt = Bcrypt(app)
        
        self.engine = create_engine(db_uri)
        self.conn = self.engine.connect()
        self.Session = sessionmaker(bind=self.engine)
        self.session = self.Session()


    def _close_conn(self):
        self.session.expire_all()
        self.conn.close()


    def validate(self, email, password):
        query = "SELECT hash_and_salt FROM bball_user WHERE email_address = :email"
        result = self.session.execute(query,{"email":email})
        user = result.fetchone()
        self._close_conn()
        if user is not None:
            return self.flsk_bcrypt.check_password_hash(user[0], password)

        return False


    def ins_cred(self, email, password=None):
        if self.user_exists(email):
            return False, "Email already taken"

        hashed_pw = self.flsk_bcrypt.generate_password_hash(password)
        query = 'INSERT INTO bball_user (email_address, hash_and_salt) VALUES (:email, :hashed_pw)'

        result = self.session.execute(query,{"email":email, "hashed_pw":hashed_pw})
        self.session.commit()
        self._close_conn()
        if result:
            return True, "Registration Successful"
        else:
            return False, "Registration failed, try again"


    def get_user_id(self, email):        
        result = self.session.execute("SELECT id, email_address FROM bball_user WHERE email_address = :email",{"email":email})
        user_id = result.fetchone()
        
        self._close_conn()
        if user_id:
            return [user_id[0], user_id[1]]
        return [None, None]


    def user_exists(self, email):
        user_df = pd.read_sql_query("SELECT email_address FROM bball_user WHERE email_address = '{email}'".format(email=email), self.conn)
        self._close_conn()

        return not user_df.empty