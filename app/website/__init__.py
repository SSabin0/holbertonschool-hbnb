from flask import render_template, Blueprint

website = Blueprint('website', __name__, template_folder='./templates')

@website.route('/index')
def index():
    return render_template('index.html')

@website.route('/login')
def login():
    return render_template('login.html')

