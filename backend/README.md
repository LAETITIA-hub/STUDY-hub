# MoringaStudyHub Backend

## Setup

1. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up the database (SQLite by default, or configure PostgreSQL in config.py):
   ```bash
   flask db init
   flask db migrate -m "Initial migration."
   flask db upgrade
   ```
4. Run the server:
   ```bash
   flask run
   ```

## API Endpoints

- `POST /signup` — Register a new user
- `POST /login` — User login
- `GET /courses` — List all courses
- `GET /courses/<id>` — Get course detail
- `POST /enrollments` — Enroll user in course
- `GET /enrollments/<user_id>` — Get user's enrollments
- `POST /discussions` — Create new discussion
- `GET /discussions/<course_id>` — Get discussions for course
- `PUT /discussions/<id>` — Update discussion
- `DELETE /discussions/<id>` — Delete discussion

## Notes
- Uses JWT for authentication
- Uses Flask-Migrate for migrations
- Uses Flask-CORS for frontend-backend communication 