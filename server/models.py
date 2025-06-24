from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    track = db.Column(db.String)
    is_instructor = db.Column(db.Boolean, default=False)

    enrollments = db.relationship('Enrollment', back_populates='user', cascade="all, delete-orphan")
    discussions = db.relationship('Discussion', back_populates='user', cascade="all, delete-orphan")

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)
    instructor_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    enrollments = db.relationship('Enrollment', back_populates='course', cascade="all, delete-orphan")
    discussions = db.relationship('Discussion', back_populates='course', cascade="all, delete-orphan")

class Enrollment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'))
    progress = db.Column(db.Integer, default=0)  # 0–100%

    user = db.relationship('User', back_populates='enrollments')
    course = db.relationship('Course', back_populates='enrollments')

class Discussion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'))

    user = db.relationship('User', back_populates='discussions')
    course = db.relationship('Course', back_populates='discussions')
