from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

from config import Config
from models import db, User, Course, Enrollment, Discussion

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Setup extensions
    CORS(app)
    db.init_app(app)
    Migrate(app, db)

    # Example route
    @app.route('/')
    def home():
        return {"message": "MoringaStudyHub API is live"}

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
