from flask import Flask
from flask_restx import Api
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy

bcrypt = Bcrypt()
db = SQLAlchemy()

from app.api.v1.users import api as users_ns  # noqa: E402
from app.api.v1.amenities import api as amenities_ns  # noqa: E402
from app.api.v1.places import api as places_ns  # noqa: E402
from app.api.v1.reviews import api as reviews_ns  # noqa: E402
from app.api.v1.auth import api as auth_ns  # noqa: E402
from app.website import website # noqa: E402

jwt = JWTManager()


def create_app(config_class="config.DevelopmentConfig"):
    app = Flask(__name__)
    app.config.from_object(config_class)
    api = Api(
            app,
            version='1.0',
            title='HBnB API',
            description='HBnB Application API',
            doc='/api/v1/'
            )

    #Initialise SQLAlchemy
    db.init_app(app)

    # Register the users namespace
    api.add_namespace(users_ns, path='/api/v1/users')
    # Register the amenities namespace
    api.add_namespace(amenities_ns, path='/api/v1/amenities')
    # Register the places namespace
    api.add_namespace(places_ns, path='/api/v1/places')
    # Register the reviews namespace
    api.add_namespace(reviews_ns, path='/api/v1/reviews')
    # Register authentication namespace
    api.add_namespace(auth_ns, path='/api/v1/auth')
    # Initialise plugins
    bcrypt.init_app(app)
    jwt.init_app(app)

    # add website routes
    app.register_blueprint(website)

    return app
