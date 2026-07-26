from flask import render_template, Blueprint

website = Blueprint('website', __name__, template_folder='./templates')

@website.route('/')
@website.route('/index')
def index():
    return render_template('index.html')

@website.route('/login')
def login():
    return render_template('login.html')

@website.route('/place')
def place():
    return render_template('place.html')

@website.route('/review')
def review():
    return render_template('add_review.html')
