# server/server.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

from config import Config

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)

    from models import User, Course, Enrollment, Discussion  # Import models

    @app.route('/')
    def home():
        return {"message": "MoringaStudyHub API is live"}

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
