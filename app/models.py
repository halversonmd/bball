from app import login_manager, app
from flask_login import UserMixin
from utils import db_login


class User(UserMixin):

    def __init__(self, username=None, email=None):
        self.email = email 
        self.username = self.get_un() or username

    def get_id(self):
        db_user = db_login()
        user_id, un = db_user.get_user_id(self.email)
        return user_id

    def get_un(self):
        db_user = db_login()
        user_id, un = db_user.get_user_id(self.email)
        return un

    def validated(self, pw):
        db_user = db_login()
        return db_user.validate(self.email, pw)

    def insert_pw(self, password):
        db_user = db_login()
        return db_user.ins_cred(self.email, password=password)
        


    def __repr__(self):
        return '<User {}>'.format(self.email)



@login_manager.user_loader
def load_user(id):
    return User(id)