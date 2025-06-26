from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Initialize SQLAlchemy instance (to be initialized in app.py)
db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    student_id = db.Column(db.String(50), unique=True, nullable=False)
    track = db.Column(db.String(100))
    is_instructor = db.Column(db.Boolean, default=False)
    password_hash = db.Column(db.String(128))
    enrollments = db.relationship('Enrollment', back_populates='user', cascade='all, delete-orphan')
    discussions = db.relationship('Discussion', back_populates='user', cascade='all, delete-orphan')

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    instructor_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    instructor = db.relationship('User', foreign_keys=[instructor_id])
    enrollments = db.relationship('Enrollment', back_populates='course', cascade='all, delete-orphan')
    discussions = db.relationship('Discussion', back_populates='course', cascade='all, delete-orphan')

class Enrollment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'))
    progress = db.Column(db.Integer, default=0)
    date_enrolled = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', back_populates='enrollments')
    course = db.relationship('Course', back_populates='enrollments')

class Discussion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', back_populates='discussions')
    course = db.relationship('Course', back_populates='discussions')

class Lab(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'))
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    completions = db.relationship('LabCompletion', back_populates='lab', cascade='all, delete-orphan')
    discussions = db.relationship('LabDiscussion', back_populates='lab', cascade='all, delete-orphan')

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'))
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    completions = db.relationship('QuizCompletion', back_populates='quiz', cascade='all, delete-orphan')
    discussions = db.relationship('QuizDiscussion', back_populates='quiz', cascade='all, delete-orphan')

class Exam(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'))
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    completions = db.relationship('ExamCompletion', back_populates='exam', cascade='all, delete-orphan')
    discussions = db.relationship('ExamDiscussion', back_populates='exam', cascade='all, delete-orphan')

class LabCompletion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    lab_id = db.Column(db.Integer, db.ForeignKey('lab.id'))
    is_complete = db.Column(db.Boolean, default=False)
    user = db.relationship('User')
    lab = db.relationship('Lab', back_populates='completions')

class QuizCompletion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'))
    is_complete = db.Column(db.Boolean, default=False)
    user = db.relationship('User')
    quiz = db.relationship('Quiz', back_populates='completions')

class ExamCompletion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    exam_id = db.Column(db.Integer, db.ForeignKey('exam.id'))
    is_complete = db.Column(db.Boolean, default=False)
    user = db.relationship('User')
    exam = db.relationship('Exam', back_populates='completions')

class LabDiscussion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lab_id = db.Column(db.Integer, db.ForeignKey('lab.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    lab = db.relationship('Lab', back_populates='discussions')
    user = db.relationship('User')

class QuizDiscussion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    quiz = db.relationship('Quiz', back_populates='discussions')
    user = db.relationship('User')

class ExamDiscussion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    exam_id = db.Column(db.Integer, db.ForeignKey('exam.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    exam = db.relationship('Exam', back_populates='discussions')
    user = db.relationship('User') 