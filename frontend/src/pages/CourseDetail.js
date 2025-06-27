import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const courseDetails = {
  1: {
    duration: '12 months',
    summary: `Dive deep into algorithms, data structures, web development, databases, and software architecture. The Software Engineering course covers both front-end and back-end technologies, version control, testing, and deployment. You'll work on real-world projects and collaborate in teams to simulate industry experience.

Upon completion, you'll be prepared for roles such as Software Engineer, Full Stack Developer, Backend Developer, or Technical Project Manager. This course sets you on a path to build scalable applications and pursue a career in tech companies, startups, or as a freelance developer.`,
    mentor: {
      name: 'Lawrence Wambugu',
      email: 'lawrence.wambugu@moringa.com',
      whatsapp: '+254712345678',
      img: 'https://randomuser.me/api/portraits/men/32.jpg',
      message: `Welcome to Software Engineering! This course is your gateway to a world of innovation and problem-solving. Embrace every challenge, collaborate with your peers, and never stop learning. The tech industry is waiting for passionate minds like yours. Enroll today and start building your future!`,
    },
  },
  2: {
    duration: '10 months',
    summary: `Learn statistics, Python programming, data visualization, machine learning, and big data tools. The Data Science course guides you through data wrangling, exploratory analysis, predictive modeling, and deploying data-driven solutions.

Graduates can pursue careers as Data Scientists, Data Analysts, Machine Learning Engineers, or Business Intelligence Analysts in industries ranging from finance to healthcare and tech.`,
    mentor: {
      name: 'Laetitia Kamangu',
      email: 'laetitia.kamangu@moringa.com',
      whatsapp: '+254798765432',
      img: 'https://randomuser.me/api/portraits/women/44.jpg',
      message: `Data is the new oil! By joining this course, you're taking the first step toward unlocking insights that can change the world. Stay curious, ask questions, and dive deep into the data. I'm here to support you every step of the way. Enroll and let's explore the world of data together!`,
    },
  },
  3: {
    duration: '8 months',
    summary: `Master continuous integration, cloud infrastructure, containerization, and automation tools. The DevOps course covers Linux, scripting, CI/CD pipelines, monitoring, and security best practices for modern software delivery.

Career paths include DevOps Engineer, Site Reliability Engineer, Cloud Engineer, or Infrastructure Automation Specialist, supporting agile teams and scalable deployments.`,
    mentor: {
      name: 'George Mbugu',
      email: 'george.mbugu@moringa.com',
      whatsapp: '+254701234567',
      img: 'https://randomuser.me/api/portraits/men/45.jpg',
      message: `DevOps is the backbone of modern tech teams. By enrolling, you'll learn how to bridge the gap between development and operations, making you an invaluable asset. Stay proactive, keep automating, and always be ready to learn new tools. Join us and become a DevOps champion!`,
    },
  },
  4: {
    duration: '6 months',
    summary: `Explore user research, wireframing, prototyping, UI/UX design, and usability testing. The Product Design course teaches you to create intuitive, user-centered digital products and collaborate with developers and stakeholders.

After graduation, you can work as a Product Designer, UX/UI Designer, Interaction Designer, or Design Researcher in tech, agencies, or product teams.`,
    mentor: {
      name: 'Lee Thuku',
      email: 'lee.thuku@moringa.com',
      whatsapp: '+254799876543',
      img: 'https://randomuser.me/api/portraits/men/36.jpg',
      message: `Design is about empathy and creativity. In this course, you'll learn to put users first and craft experiences that matter. Don't be afraid to experiment and iterate. Your journey to becoming a world-class designer starts here. Enroll and let's design the future together!`,
    },
  },
  5: {
    duration: '9 months',
    summary: `Study network security, ethical hacking, cryptography, risk assessment, and incident response. The Cybersecurity course prepares you to defend systems, analyze threats, and implement security protocols in real-world scenarios.

Career opportunities include Cybersecurity Analyst, Security Engineer, Penetration Tester, or Information Security Consultant in organizations of all sizes.`,
    mentor: {
      name: 'Andrew Tobiko',
      email: 'andrew.tobiko@moringa.com',
      whatsapp: '+254700112233',
      img: 'https://randomuser.me/api/portraits/men/52.jpg',
      message: `Cybersecurity is more important than ever. By joining this course, you're stepping up to protect the digital world. Stay vigilant, keep learning, and never underestimate your impact. I'm excited to guide you on this journey. Enroll now and become a guardian of cyberspace!`,
    },
  },
};

const maroon = '#800000';
const white = '#fff';

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollMsg, setEnrollMsg] = useState(null);

  useEffect(() => {
    async function fetchCourse() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/courses/${id}`);
        const data = await res.json();
        if (res.ok) {
          setCourse(data);
        } else {
          setError('Failed to load course.');
        }
      } catch (err) {
        setError('Network error.');
      }
      setLoading(false);
    }
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    setEnrollMsg(null);
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    try {
      const res = await fetch('/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course_id: id }),
      });
      const data = await res.json();
      if (res.ok) {
        setEnrollMsg('Enrolled successfully!');
      } else {
        setEnrollMsg(data.error || 'Enrollment failed.');
      }
    } catch (err) {
      setEnrollMsg('Network error.');
    }
  };

  if (loading) return <p>Loading course...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!course) return null;

  const details = courseDetails[course.id];
  const mentor = details.mentor;

  return (
    <div className="container py-5" style={{ maxWidth: 700 }}>
      <div className="card shadow" style={{ border: `2px solid ${maroon}`, background: white, borderRadius: 16 }}>
        <div className="card-body p-5">
          <h2 className="card-title mb-3" style={{ color: maroon, fontWeight: 700, fontSize: 32 }}>{course.title}</h2>
          <p className="card-text" style={{ fontSize: 20, color: '#333', marginBottom: 24 }}>{course.description}</p>
          {details && (
            <>
              <p style={{ fontWeight: 600, color: maroon, fontSize: 18 }}>Duration: {details.duration}</p>
              <p style={{ fontSize: 17, whiteSpace: 'pre-line', color: '#222', marginBottom: 32 }}>{details.summary}</p>
            </>
          )}
          <div className="text-center mb-4">
            <button
              className="btn btn-lg"
              style={{ background: maroon, color: white, fontWeight: 600, border: 'none', borderRadius: 8, padding: '0.75rem 2.5rem', fontSize: 20 }}
              onClick={handleEnroll}
            >
              Enroll Now
            </button>
            {enrollMsg && (
              <div style={{ color: enrollMsg.includes('success') ? 'green' : 'red', marginTop: 16, fontWeight: 500, fontSize: 16 }}>{enrollMsg}</div>
            )}
          </div>
          <div className="mt-5 p-4" style={{ background: '#f8f8fa', borderRadius: 12, border: `1px solid ${maroon}33` }}>
            <h4 style={{ color: maroon, fontWeight: 700, marginBottom: 18 }}>A message from the technical mentor</h4>
            <div className="d-flex align-items-center mb-3">
              <img src={mentor.img} alt={mentor.name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', marginRight: 20, border: `2px solid ${maroon}` }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 18, color: maroon }}>{mentor.name}</div>
                <div style={{ fontSize: 15, color: '#333' }}>{mentor.email}</div>
                <div style={{ fontSize: 15, color: '#333', display: 'flex', alignItems: 'center', marginTop: 2 }}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: 20, height: 20, marginRight: 6 }} />
                  {mentor.whatsapp}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 16, color: '#222', marginTop: 8 }}>{mentor.message}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail; 
