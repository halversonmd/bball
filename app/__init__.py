from flask import Flask
import flask_login, os, json

app = Flask(__name__)
login_manager = flask_login.LoginManager()
login_manager.init_app(app)

# login = flask_login.LoginManager(app)
login_manager.login_view = 'login_page'

filename = os.path.join(app.instance_path, 'config.py')

with open(filename) as f:
    c = f.read()
    c = json.loads(c)
app.config["SQLALCHEMY_DATABASE_URI"] = c["SQLALCHEMY_DATABASE_URI"]
app.config["SECRET_KEY"] = "i\x02\x82w&QT\xdch}U\xa1]\x11\xf0\xfe\x08\xf2\x11e\x91\xbe\x0c\x04"
app.config["WTF_CSRF_ENABLED"] = True

from app import views


