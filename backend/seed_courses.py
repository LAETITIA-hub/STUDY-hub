from app import app
from models import db, Course, Lab, Quiz, Exam

courses = [
    {"id": 1, "title": "Software Engineering", "description": "Master the art of building robust, scalable software systems."},
    {"id": 2, "title": "Data Science", "description": "Unlock insights from data and drive decision-making with analytics."},
    {"id": 3, "title": "DevOps", "description": "Streamline development and operations for faster, reliable delivery."},
    {"id": 4, "title": "Product Design", "description": "Design intuitive, user-centered products that delight."},
    {"id": 5, "title": "Cybersecurity", "description": "Protect systems and data from cyber threats and attacks."},
]

labs_examples = {
    1: [
        "Build a RESTful API with Flask",
        "Implement User Authentication",
        "Design a Relational Database Schema",
        "Write Unit and Integration Tests",
        "Deploy an App to Heroku"
    ],
    2: [
        "Data Cleaning and Preprocessing",
        "Exploratory Data Analysis with Pandas",
        "Regression Modeling in Scikit-Learn",
        "Classification with Decision Trees",
        "Data Visualization with Matplotlib"
    ],
    3: [
        "Linux Command Line Basics",
        "Automate Tasks with Bash Scripting",
        "Dockerize a Simple Application",
        "Set Up a CI/CD Pipeline with GitHub Actions",
        "Monitor Applications with Prometheus"
    ],
    4: [
        "Conduct User Interviews",
        "Create Wireframes for a Mobile App",
        "Build Interactive Prototypes in Figma",
        "Run Usability Testing Sessions",
        "Design a Responsive UI"
    ],
    5: [
        "Network Scanning with Nmap",
        "Vulnerability Assessment with OpenVAS",
        "Perform a Basic Penetration Test",
        "Implement Symmetric and Asymmetric Encryption",
        "Incident Response Tabletop Exercise"
    ],
}

quizzes_examples = {
    1: [
        "OOP Concepts & Data Structures",
        "SQL & Database Design",
        "Web Frameworks & REST APIs"
    ],
    2: [
        "Python & Numpy Basics",
        "Statistics & Probability",
        "Machine Learning Fundamentals"
    ],
    3: [
        "Linux & Shell Scripting",
        "Containers & Virtualization",
        "CI/CD Concepts"
    ],
    4: [
        "UX Principles & Heuristics",
        "Prototyping & User Flows",
        "UI Design Patterns"
    ],
    5: [
        "Network Security Basics",
        "Threats & Attack Vectors",
        "Security Tools & Best Practices"
    ],
}

exams_examples = {
    1: "Final Exam: Software Engineering",
    2: "Final Exam: Data Science",
    3: "Final Exam: DevOps",
    4: "Final Exam: Product Design",
    5: "Final Exam: Cybersecurity",
}

with app.app_context():
    for c in courses:
        course = Course.query.get(c["id"])
        if not course:
            course = Course(id=c["id"], title=c["title"], description=c["description"])
            db.session.add(course)
            db.session.commit()
        # Labs
        for i, lab_title in enumerate(labs_examples[c["id"]], 1):
            if not Lab.query.filter_by(course_id=course.id, title=lab_title).first():
                db.session.add(Lab(course_id=course.id, title=lab_title, description=f"Lab {i} for {course.title}: {lab_title}"))
        # Quizzes
        for i, quiz_title in enumerate(quizzes_examples[c["id"]], 1):
            if not Quiz.query.filter_by(course_id=course.id, title=quiz_title).first():
                db.session.add(Quiz(course_id=course.id, title=quiz_title, description=f"Quiz {i} for {course.title}: {quiz_title}"))
        # Exam
        exam_title = exams_examples[c["id"]]
        if not Exam.query.filter_by(course_id=course.id, title=exam_title).first():
            db.session.add(Exam(course_id=course.id, title=exam_title, description=f"Comprehensive final exam for {course.title}."))
    db.session.commit()
    print("Courses, labs, quizzes, and exams seeded!") 