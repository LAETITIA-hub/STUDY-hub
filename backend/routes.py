from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
from models import db, User, Course, Enrollment, Discussion, Lab, Quiz, Exam, LabCompletion, QuizCompletion, ExamCompletion, LabDiscussion, QuizDiscussion, ExamDiscussion
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from sqlalchemy.orm import joinedload

api_bp = Blueprint('api', __name__)

# User signup
@api_bp.route('/signup', methods=['POST'])
def signup():
    
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    student_id = data.get('student_id')
    track = data.get('track')
    password = data.get('password')
    if not (name and email and student_id and password):
        return jsonify({'error': 'Missing required fields'}), 400
    if User.query.filter((User.email == email) | (User.student_id == student_id)).first():
        return jsonify({'error': 'Email or student ID already exists'}), 400
    user = User(name=name, email=email, student_id=student_id, track=track)
    user.password_hash = generate_password_hash(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

# User login
@api_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(getattr(user, 'password_hash', ''), password):
        return jsonify({'error': 'Invalid credentials'}), 401
    access_token = create_access_token(identity=user.id)
    return jsonify({'access_token': access_token, 'user_id': user.id, 'name': user.name, 'student_id': user.student_id}), 200

# List all courses
@api_bp.route('/courses', methods=['GET'])
def get_courses():
    courses = Course.query.all()
    return jsonify([{'id': c.id, 'title': c.title, 'description': c.description, 'instructor_id': c.instructor_id} for c in courses])

# Get course detail
@api_bp.route('/courses/<int:course_id>', methods=['GET'])
def get_course(course_id):
    course = Course.query.get_or_404(course_id)
    enrolled_users = [e.user_id for e in course.enrollments]
    return jsonify({'id': course.id, 'title': course.title, 'description': course.description, 'instructor_id': course.instructor_id, 'enrolled_users': enrolled_users})

# Enroll user in course
@api_bp.route('/enrollments', methods=['POST'])
@jwt_required()
def enroll():
    data = request.get_json()
    user_id = get_jwt_identity()
    course_id = data.get('course_id')
    if not course_id:
        return jsonify({'error': 'Missing course_id'}), 400
    if Enrollment.query.filter_by(user_id=user_id, course_id=course_id).first():
        return jsonify({'error': 'Already enrolled'}), 400
    enrollment = Enrollment(user_id=user_id, course_id=course_id, progress=0)
    db.session.add(enrollment)
    db.session.commit()
    return jsonify({'message': 'Enrolled successfully'}), 201

# Get user enrollments
@api_bp.route('/enrollments/<int:user_id>', methods=['GET'])
def get_enrollments(user_id):
    enrollments = Enrollment.query.filter_by(user_id=user_id).all()
    return jsonify([
        {'id': e.id, 'course_id': e.course_id, 'progress': e.progress, 'date_enrolled': e.date_enrolled.isoformat() if e.date_enrolled else None} for e in enrollments
    ])

# Create new discussion in courses
@api_bp.route('/discussions', methods=['POST'])
@jwt_required()
def create_discussion():
    data = request.get_json()
    user_id = get_jwt_identity()
    course_id = data.get('course_id')
    content = data.get('content')
    if not (course_id and content and len(content) >= 15):
        return jsonify({'error': 'Invalid input'}), 400
    discussion = Discussion(content=content, user_id=user_id, course_id=course_id)
    db.session.add(discussion)
    db.session.commit()
    return jsonify({'message': 'Discussion created'}), 201

# Get discussions for a course
@api_bp.route('/discussions/<int:course_id>', methods=['GET'])
def get_discussions(course_id):
    discussions = Discussion.query.options(joinedload(Discussion.user)).filter_by(course_id=course_id).order_by(Discussion.timestamp.desc()).all()
    return jsonify([
        {'id': d.id, 'content': d.content, 'user_email': d.user.email if d.user else None, 'timestamp': d.timestamp.isoformat()} for d in discussions
    ])

# Update discussion
@api_bp.route('/discussions/<int:discussion_id>', methods=['PUT'])
@jwt_required()
def update_discussion(discussion_id):
    data = request.get_json()
    user_id = get_jwt_identity()
    discussion = Discussion.query.get_or_404(discussion_id)
    if discussion.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    content = data.get('content')
    if not content or len(content) < 15:
        return jsonify({'error': 'Content too short'}), 400
    discussion.content = content
    db.session.commit()
    return jsonify({'message': 'Discussion updated'})

# Delete discussion
@api_bp.route('/discussions/<int:discussion_id>', methods=['DELETE'])
@jwt_required()
def delete_discussion(discussion_id):
    user_id = get_jwt_identity()
    discussion = Discussion.query.get_or_404(discussion_id)
    if discussion.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    db.session.delete(discussion)
    db.session.commit()
    return jsonify({'message': 'Discussion deleted'})

# Fetch labs for a course (with completion status)
@api_bp.route('/courses/<int:course_id>/labs', methods=['GET'])
@jwt_required()
def get_labs(course_id):
    user_id = get_jwt_identity()
    labs = Lab.query.filter_by(course_id=course_id).all()
    completions = {c.lab_id: c.is_complete for c in LabCompletion.query.filter_by(user_id=user_id).all()}
    return jsonify([
        {
            'id': lab.id,
            'title': lab.title,
            'description': lab.description,
            'is_complete': completions.get(lab.id, False)
        } for lab in labs
    ])

# Fetch quizzes for a course (with completion status)
@api_bp.route('/courses/<int:course_id>/quizzes', methods=['GET'])
@jwt_required()
def get_quizzes(course_id):
    user_id = get_jwt_identity()
    quizzes = Quiz.query.filter_by(course_id=course_id).all()
    completions = {c.quiz_id: c.is_complete for c in QuizCompletion.query.filter_by(user_id=user_id).all()}
    return jsonify([
        {
            'id': quiz.id,
            'title': quiz.title,
            'description': quiz.description,
            'is_complete': completions.get(quiz.id, False)
        } for quiz in quizzes
    ])

# Fetch exams for a course (with completion status)
@api_bp.route('/courses/<int:course_id>/exams', methods=['GET'])
@jwt_required()
def get_exams(course_id):
    user_id = get_jwt_identity()
    exams = Exam.query.filter_by(course_id=course_id).all()
    completions = {c.exam_id: c.is_complete for c in ExamCompletion.query.filter_by(user_id=user_id).all()}
    return jsonify([
        {
            'id': exam.id,
            'title': exam.title,
            'description': exam.description,
            'is_complete': completions.get(exam.id, False)
        } for exam in exams
    ])

def recalculate_progress(user_id, course_id):
    total_labs = Lab.query.filter_by(course_id=course_id).count()
    total_quizzes = Quiz.query.filter_by(course_id=course_id).count()
    total_exams = Exam.query.filter_by(course_id=course_id).count()
    completed_labs = LabCompletion.query.join(Lab).filter(Lab.course_id==course_id, LabCompletion.user_id==user_id, LabCompletion.is_complete==True).count()
    completed_quizzes = QuizCompletion.query.join(Quiz).filter(Quiz.course_id==course_id, QuizCompletion.user_id==user_id, QuizCompletion.is_complete==True).count()
    completed_exams = ExamCompletion.query.join(Exam).filter(Exam.course_id==course_id, ExamCompletion.user_id==user_id, ExamCompletion.is_complete==True).count()
    total_items = total_labs + total_quizzes + total_exams
    completed_items = completed_labs + completed_quizzes + completed_exams
    progress = int((completed_items / total_items) * 100) if total_items > 0 else 0
    enrollment = Enrollment.query.filter_by(user_id=user_id, course_id=course_id).first()
    if enrollment:
        enrollment.progress = progress
        db.session.commit()

# Mark lab as complete/incomplete
@api_bp.route('/labs/<int:lab_id>/completion', methods=['POST'])
@jwt_required()
def set_lab_completion(lab_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    is_complete = data.get('is_complete', True)
    completion = LabCompletion.query.filter_by(user_id=user_id, lab_id=lab_id).first()
    if not completion:
        completion = LabCompletion(user_id=user_id, lab_id=lab_id, is_complete=is_complete)
        db.session.add(completion)
    else:
        completion.is_complete = is_complete
    db.session.commit()
    # Update progress
    lab = Lab.query.get(lab_id)
    if lab:
        recalculate_progress(user_id, lab.course_id)
    return jsonify({'message': 'Lab completion updated'})

# Mark quiz as complete/incomplete
@api_bp.route('/quizzes/<int:quiz_id>/completion', methods=['POST'])
@jwt_required()
def set_quiz_completion(quiz_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    is_complete = data.get('is_complete', True)
    completion = QuizCompletion.query.filter_by(user_id=user_id, quiz_id=quiz_id).first()
    if not completion:
        completion = QuizCompletion(user_id=user_id, quiz_id=quiz_id, is_complete=is_complete)
        db.session.add(completion)
    else:
        completion.is_complete = is_complete
    db.session.commit()
    # Update progress
    quiz = Quiz.query.get(quiz_id)
    if quiz:
        recalculate_progress(user_id, quiz.course_id)
    return jsonify({'message': 'Quiz completion updated'})

# Mark exam as complete/incomplete
@api_bp.route('/exams/<int:exam_id>/completion', methods=['POST'])
@jwt_required()
def set_exam_completion(exam_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    is_complete = data.get('is_complete', True)
    completion = ExamCompletion.query.filter_by(user_id=user_id, exam_id=exam_id).first()
    if not completion:
        completion = ExamCompletion(user_id=user_id, exam_id=exam_id, is_complete=is_complete)
        db.session.add(completion)
    else:
        completion.is_complete = is_complete
    db.session.commit()
    # Update progress
    exam = Exam.query.get(exam_id)
    if exam:
        recalculate_progress(user_id, exam.course_id)
    return jsonify({'message': 'Exam completion updated'})

def user_enrolled_in_course(user_id, course_id):
    from models import Enrollment
    return Enrollment.query.filter_by(user_id=user_id, course_id=course_id).first() is not None

# Update LabDiscussion GET/POST endpoints
def get_lab_course_id(lab_id):
    lab = Lab.query.get(lab_id)
    return lab.course_id if lab else None

@api_bp.route('/labs/<int:lab_id>/discussions', methods=['GET'])
@jwt_required()
def get_lab_discussions(lab_id):
    user_id = get_jwt_identity()
    course_id = get_lab_course_id(lab_id)
    if not user_enrolled_in_course(user_id, course_id):
        return jsonify({'error': 'Not enrolled in this course'}), 403
    discussions = LabDiscussion.query.options(joinedload(LabDiscussion.user)).filter_by(lab_id=lab_id).order_by(LabDiscussion.timestamp.desc()).all()
    return jsonify([
        {'id': d.id, 'content': d.content, 'user_email': d.user.email if d.user else None, 'timestamp': d.timestamp.isoformat()} for d in discussions
    ])

@api_bp.route('/labs/<int:lab_id>/discussions', methods=['POST'])
@jwt_required()
def create_lab_discussion(lab_id):
    user_id = get_jwt_identity()
    course_id = get_lab_course_id(lab_id)
    if not user_enrolled_in_course(user_id, course_id):
        return jsonify({'error': 'Not enrolled in this course'}), 403
    data = request.get_json()
    content = data.get('content')
    if not content or len(content) < 5:
        return jsonify({'error': 'Content too short'}), 400
    discussion = LabDiscussion(lab_id=lab_id, user_id=user_id, content=content)
    db.session.add(discussion)
    db.session.commit()
    return jsonify({'message': 'Lab discussion created'})

@api_bp.route('/lab-discussions/<int:discussion_id>', methods=['PUT'])
@jwt_required()
def update_lab_discussion(discussion_id):
    user_id = get_jwt_identity()
    discussion = LabDiscussion.query.get_or_404(discussion_id)
    if discussion.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    data = request.get_json()
    content = data.get('content')
    if not content or len(content) < 5:
        return jsonify({'error': 'Content too short'}), 400
    discussion.content = content
    db.session.commit()
    return jsonify({'message': 'Lab discussion updated'})

@api_bp.route('/lab-discussions/<int:discussion_id>', methods=['DELETE'])
@jwt_required()
def delete_lab_discussion(discussion_id):
    user_id = get_jwt_identity()
    discussion = LabDiscussion.query.get_or_404(discussion_id)
    if discussion.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    db.session.delete(discussion)
    db.session.commit()
    return jsonify({'message': 'Lab discussion deleted'})

# Update QuizDiscussion GET/POST endpoints
def get_quiz_course_id(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    return quiz.course_id if quiz else None

@api_bp.route('/quizzes/<int:quiz_id>/discussions', methods=['GET'])
@jwt_required()
def get_quiz_discussions(quiz_id):
    user_id = get_jwt_identity()
    course_id = get_quiz_course_id(quiz_id)
    if not user_enrolled_in_course(user_id, course_id):
        return jsonify({'error': 'Not enrolled in this course'}), 403
    discussions = QuizDiscussion.query.options(joinedload(QuizDiscussion.user)).filter_by(quiz_id=quiz_id).order_by(QuizDiscussion.timestamp.desc()).all()
    return jsonify([
        {'id': d.id, 'content': d.content, 'user_email': d.user.email if d.user else None, 'timestamp': d.timestamp.isoformat()} for d in discussions
    ])

@api_bp.route('/quizzes/<int:quiz_id>/discussions', methods=['POST'])
@jwt_required()
def create_quiz_discussion(quiz_id):
    user_id = get_jwt_identity()
    course_id = get_quiz_course_id(quiz_id)
    if not user_enrolled_in_course(user_id, course_id):
        return jsonify({'error': 'Not enrolled in this course'}), 403
    data = request.get_json()
    content = data.get('content')
    if not content or len(content) < 5:
        return jsonify({'error': 'Content too short'}), 400
    discussion = QuizDiscussion(quiz_id=quiz_id, user_id=user_id, content=content)
    db.session.add(discussion)
    db.session.commit()
    return jsonify({'message': 'Quiz discussion created'})

@api_bp.route('/quiz-discussions/<int:discussion_id>', methods=['PUT'])
@jwt_required()
def update_quiz_discussion(discussion_id):
    user_id = get_jwt_identity()
    discussion = QuizDiscussion.query.get_or_404(discussion_id)
    if discussion.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    data = request.get_json()
    content = data.get('content')
    if not content or len(content) < 5:
        return jsonify({'error': 'Content too short'}), 400
    discussion.content = content
    db.session.commit()
    return jsonify({'message': 'Quiz discussion updated'})

@api_bp.route('/quiz-discussions/<int:discussion_id>', methods=['DELETE'])
@jwt_required()
def delete_quiz_discussion(discussion_id):
    user_id = get_jwt_identity()
    discussion = QuizDiscussion.query.get_or_404(discussion_id)
    if discussion.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    db.session.delete(discussion)
    db.session.commit()
    return jsonify({'message': 'Quiz discussion deleted'})

# Update ExamDiscussion GET/POST endpoints
def get_exam_course_id(exam_id):
    exam = Exam.query.get(exam_id)
    return exam.course_id if exam else None

@api_bp.route('/exams/<int:exam_id>/discussions', methods=['GET'])
@jwt_required()
def get_exam_discussions(exam_id):
    user_id = get_jwt_identity()
    course_id = get_exam_course_id(exam_id)
    if not user_enrolled_in_course(user_id, course_id):
        return jsonify({'error': 'Not enrolled in this course'}), 403
    discussions = ExamDiscussion.query.options(joinedload(ExamDiscussion.user)).filter_by(exam_id=exam_id).order_by(ExamDiscussion.timestamp.desc()).all()
    return jsonify([
        {'id': d.id, 'content': d.content, 'user_email': d.user.email if d.user else None, 'timestamp': d.timestamp.isoformat()} for d in discussions
    ])

@api_bp.route('/exams/<int:exam_id>/discussions', methods=['POST'])
@jwt_required()
def create_exam_discussion(exam_id):
    user_id = get_jwt_identity()
    course_id = get_exam_course_id(exam_id)
    if not user_enrolled_in_course(user_id, course_id):
        return jsonify({'error': 'Not enrolled in this course'}), 403
    data = request.get_json()
    content = data.get('content')
    if not content or len(content) < 5:
        return jsonify({'error': 'Content too short'}), 400
    discussion = ExamDiscussion(exam_id=exam_id, user_id=user_id, content=content)
    db.session.add(discussion)
    db.session.commit()
    return jsonify({'message': 'Exam discussion created'})

@api_bp.route('/exam-discussions/<int:discussion_id>', methods=['PUT'])
@jwt_required()
def update_exam_discussion(discussion_id):
    user_id = get_jwt_identity()
    discussion = ExamDiscussion.query.get_or_404(discussion_id)
    if discussion.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    data = request.get_json()
    content = data.get('content')
    if not content or len(content) < 5:
        return jsonify({'error': 'Content too short'}), 400
    discussion.content = content
    db.session.commit()
    return jsonify({'message': 'Exam discussion updated'})

@api_bp.route('/exam-discussions/<int:discussion_id>', methods=['DELETE'])
@jwt_required()
def delete_exam_discussion(discussion_id):
    user_id = get_jwt_identity()
    discussion = ExamDiscussion.query.get_or_404(discussion_id)
    if discussion.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    db.session.delete(discussion)
    db.session.commit()
    return jsonify({'message': 'Exam discussion deleted'}) 
