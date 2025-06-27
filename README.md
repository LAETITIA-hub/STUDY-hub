# MoringaStudyHub

## Project Team
- **Laetitia Kamangu** (Scrum Master)
- Lawrence Wambugu
- George Mbugua
- Andrew Tobiko
- Lee Thuku

---

## Technologies Used

### Frontend
- **React** (UI library)
- **React Router** (routing)
- **Bootstrap** (styling)
- **Formik** (form management)
- **Yup** (form validation)
- **React Icons** (icons)
- **Custom CSS** (styling)

### Backend
- **Flask** (web framework)
- **Flask-SQLAlchemy** (ORM)
- **Flask-Migrate** (database migrations)
- **Flask-JWT-Extended** (JWT authentication)
- **Flask-CORS** (CORS handling)
- **SQLAlchemy** (ORM)
- **Alembic** (migrations)
- **SQLite** (default dev database, PostgreSQL supported for production)

A full-stack e-learning portal for Moringa students, built with a Flask backend and React frontend.

---

## User Stories

**MVP:**
- As a user, I can sign up and log in securely.
- As a user, I can view a list of all available courses.
- As a user, I can enroll in courses.
- As a user, I can view details for each course, including labs, quizzes, and exams.
- As a user, I can mark labs, quizzes, and exams as complete/incomplete.
- As a user, I can participate in discussions for courses, labs, quizzes, and exams.
- As a user, I can see my enrolled courses in a dedicated section.
- As a user, I can track my progress in each course.

**Stretch:**
- As a user, I can give feedback on labs, quizzes, and exams.
- As a user, I can see other students' progress and collaborate.

---

## Entity Relationship Diagram (ERD)

See the diagram below for the main models and their relationships:

```
erDiagram
  USER ||--o{ ENROLLMENT : enrolls
  COURSE ||--o{ ENROLLMENT : has
  USER ||--o{ DISCUSSION : posts
  COURSE ||--o{ LAB : contains
  COURSE ||--o{ QUIZ : contains
  COURSE ||--o{ EXAM : contains
  LAB ||--o{ LABCOMPLETION : completed_by
  QUIZ ||--o{ QUIZCOMPLETION : completed_by
  EXAM ||--o{ EXAMCOMPLETION : completed_by
  LAB ||--o{ LABDISCUSSION : discussed_in
  QUIZ ||--o{ QUIZDISCUSSION : discussed_in
  EXAM ||--o{ EXAMDISCUSSION : discussed_in
  USER ||--o{ LABCOMPLETION : completes
  USER ||--o{ QUIZCOMPLETION : completes
  USER ||--o{ EXAMCOMPLETION : completes
  USER ||--o{ LABDISCUSSION : posts
  USER ||--o{ QUIZDISCUSSION : posts
  USER ||--o{ EXAMDISCUSSION : posts
```

---

## Wireframes (Text Description)

**Home Page:**
- Modern card with platform info at the top.
- List of courses, each with an image, title, and description.
- Enroll and View Details buttons for each course.
- Copyright notice at the bottom.

**Login/SignUp Pages:**
- Centered card with maroon/white theme.
- Large, rounded input fields and stylish buttons.

**MyCourses Page:**
- List of enrolled courses (names only), with maroon/white theme and hover effects.

**Course Detail Page:**
- Tabs for Labs, Quizzes, Exams.
- Each tab shows a summary (e.g., "Labs: 2 of 5 completed") and lists items with completion and discussion options.

**Discussion/Feedback:**
- Each item (lab, quiz, exam) has a discussion section showing posts with user email (or "Anonymous").
- Users can post new questions or feedback.

---

# Installation & Deployment Guide

## Prerequisites
- [Python 3.8+](https://www.python.org/downloads/)
- [Node.js 14+ and npm](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Render.com account](https://render.com/)

---

## Local Development

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd E-learning-hub
```

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt  # If requirements.txt is missing, install Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-JWT-Extended, Flask-CORS manually
export FLASK_APP=app.py
flask db upgrade  # Run migrations
flask run
```
- The backend will run on `http://localhost:5000` by default.

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```
- The frontend will run on `http://localhost:3000` by default.

---

## Deployment on Render

### 1. Deploy the Backend (Flask API)
- Go to [Render Dashboard](https://dashboard.render.com/)
- Click **New Web Service** > **Create a new Web Service**
- Connect your GitHub repo and select the backend folder as the root
- **Environment**: Python 3.8+
- **Build Command**: 
  ```bash
  pip install -r requirements.txt
  flask db upgrade
  ```
- **Start Command**: 
  ```bash
  gunicorn app:app
  ```
- **Environment Variables**:
  - `FLASK_APP=app.py`
  - `DATABASE_URL` (set to your production database URI, e.g., PostgreSQL)
  - `SECRET_KEY` and `JWT_SECRET_KEY` (set to secure values)
- **Instance Type**: Starter is fine for most cases
- Click **Create Web Service**

### 2. Deploy the Frontend (React)
- Go to [Render Dashboard](https://dashboard.render.com/)
- Click **New Web Service** > **Create a new Web Service**
- Connect your GitHub repo and select the frontend folder as the root
- **Environment**: Node 14+
- **Build Command**: 
  ```bash
  npm install && npm run build
  ```
- **Start Command**: 
  ```bash
  serve -s build
  ```
  (If `serve` is not installed, add it to your dependencies: `npm install serve`)
- **Environment Variables**:
  - If your frontend fetches from the backend, set `REACT_APP_API_URL` to your backend Render URL
- **Instance Type**: Starter is fine for most cases
- Click **Create Web Service**

### 3. Connect Frontend to Backend
- In your frontend code, update API URLs to use `process.env.REACT_APP_API_URL` or your Render backend URL.
- Make sure CORS is enabled on the backend (already set up with Flask-CORS).

---

## Notes
- For production, use PostgreSQL on Render (set `DATABASE_URL` accordingly).
- Set all secret keys and sensitive environment variables securely in Render.
- For database migrations, you can add a Render Job or run `flask db upgrade` manually in the shell.
- For any static files or images, use a cloud storage service if needed.

---

## Contact
For questions or support, contact the project maintainer. 
