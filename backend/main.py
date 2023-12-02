from flask import Flask, render_template
from flask_cors import CORS
from flask_restx import Api
from backend.models import Winners
from backend.exts import db
from flask_jwt_extended import JWTManager
from backend.winners import winner_ns, Winner, WinnerById, WinnerByCode

from backend.config import DevConfig

def create_app(config=DevConfig):
    app = Flask(__name__,
            static_url_path='',
            static_folder='../frontend/dist',
            template_folder='../frontend/dist'
                )
    app.config.from_object(config)
    db.init_app(app)
    JWTManager(app)
    api = Api(app, doc="/docs")
    api.add_namespace(winner_ns)

    app.config['JWT_SECRET_KEY'] = 'secret_key_here'  # Change this to a secure secret key
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.config['JWT_ALGORITHM'] = 'HS256'

    CORS(app, resources=r'/*')

    @app.shell_context_processor
    def make_shell_context():
        return {"db": db, "Winners": Winners}

    @app.errorhandler(404)
    def not_found(e):
        return render_template("index.html")

    # @app.after_request
    # def after_request(response):
    #     # Commit the database session after each request
    #     db.session.commit()
    #     return response
    
    api.add_resource(Winner, '/api/winner/')
    api.add_resource(WinnerById, '/api/winner/<int:winid>/')
    api.add_resource(WinnerByCode, '/api/winner/code/<int:code>/')
    
    return app
