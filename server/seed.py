from server import app
from models import db, User, Course, Enrollment, Discussion
from datetime import datetime

with app.app_context():
    print("🧹 Clearing existing data...")
    Discussion.query.delete()
    Enrollment.query.delete()
    Course.query.delete()
    User.query.delete()

    print("👩‍🏫 Creating users...")
    u1 = User(name="Alice Kimani", email="alice@moringa.school", track="Software", is_instructor=True)
    u2 = User(name="Brian Otieno", email="brian@moringa.school", track="Data Science", is_instructor=False)
    u3 = User(name="Clara Wambui", email="clara@moringa.school", track="DevOps", is_instructor=False)

    print("📚 Creating courses...")
    c1 = Course(title="Intro to Flask", description="Learn how to build APIs using Flask.", instructor_id=1)
    c2 = Course(title="Advanced React", description="Dive deep into React features.", instructor_id=1)

    print("🧾 Creating enrollments...")
    e1 = Enrollment(user_id=2, course_id=1, progress=45)
    e2 = Enrollment(user_id=3, course_id=1, progress=80)
    e3 = Enrollment(user_id=2, course_id=2, progress=20)

    print("💬 Creating discussions...")
    d1 = Discussion(content="What is Flask-Migrate?", user_id=2, course_id=1, timestamp=datetime.utcnow())
    d2 = Discussion(content="Is useEffect similar to componentDidMount?", user_id=2, course_id=2, timestamp=datetime.utcnow())
    d3 = Discussion(content="Where can I host a Flask backend?", user_id=3, course_id=1, timestamp=datetime.utcnow())

    print("💾 Saving to database...")
    db.session.add_all([u1, u2, u3, c1, c2, e1, e2, e3, d1, d2, d3])
    db.session.commit()

    print("✅ Seed complete!")
