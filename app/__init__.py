from flask import Flask
import flask_login, os, json

app = Flask(__name__)
login_manager = flask_login.LoginManager()
login_manager.init_app(app)

login_manager.login_view = 'login_page'

filename = os.path.join(app.instance_path, 'config.py')

with open(filename) as f:
    c = f.read()
    conf = json.loads(c)
app.config["SQLALCHEMY_DATABASE_URI"] = conf["SQLALCHEMY_DATABASE_URI"]
app.config["SECRET_KEY"] = conf["SECRET_KEY"]
app.config["DATA_PATH"] = conf["DATA_PATH"]
app.config["WTF_CSRF_ENABLED"] = True

from app import views


