import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBookOpen, FaChartLine, FaFlask, FaComments, FaUsers } from 'react-icons/fa';

const courses = [
  {
    id: 1,
    title: 'Software Engineering',
    description: 'Master the art of building robust, scalable software systems.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'Data Science',
    description: 'Unlock insights from data and drive decision-making with analytics.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: 'DevOps',
    description: 'Streamline development and operations for faster, reliable delivery.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    title: 'Product Design',
    description: 'Design intuitive, user-centered products that delight.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    title: 'Cybersecurity',
    description: 'Protect systems and data from cyber threats and attacks.',
    image: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=600&q=80',
  },
];

const maroon = '#800000';
const white = '#fff';
const poppins = 'Poppins, Arial, sans-serif';

function Home() {
  const [enrollStatus, setEnrollStatus] = useState({});
  const navigate = useNavigate();

  const handleEnroll = async (courseId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { showSignup: true } });
      return;
    }
    setEnrollStatus((prev) => ({ ...prev, [courseId]: 'loading' }));
    try {
      const res = await fetch('/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course_id: courseId }),
      });
      const data = await res.json();
      if (res.ok) {
        setEnrollStatus((prev) => ({ ...prev, [courseId]: 'Enrolled successfully!' }));
      } else {
        setEnrollStatus((prev) => ({ ...prev, [courseId]: data.error || 'Enrollment failed.' }));
      }
    } catch (err) {
      setEnrollStatus((prev) => ({ ...prev, [courseId]: 'Network error.' }));
    }
  };

  const handleViewDetails = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="container py-5" style={{ background: maroon, minHeight: '100vh' }}>
      <div className="text-center mb-5" style={{ background: white, borderRadius: 18, boxShadow: '0 4px 24px #80000022', padding: '2.5rem 1rem 2rem', maxWidth: 800, margin: '0 auto 2.5rem', textAlign: 'left' }}>
        <h1 style={{
          color: maroon,
          fontWeight: 900,
          fontFamily: poppins,
          fontSize: 44,
          letterSpacing: 1,
          textShadow: '0 2px 8px #80000011',
          marginBottom: 10,
        }}>
          Welcome to MoringaStudyHub
        </h1>
        <div style={{ marginLeft: 2 }}>
          <div style={{
            color: maroon,
            fontSize: 20,
            fontFamily: poppins,
            fontWeight: 600,
            letterSpacing: 0.5,
            marginTop: 8,
            marginBottom: 0,
            textShadow: '0 1px 4px #80000011',
            opacity: 0.97,
          }}>
            Your portal to Moringa courses, discussions, and collaboration.
          </div>
          <div style={{
            color: maroon,
            fontSize: 20,
            fontFamily: poppins,
            fontWeight: 600,
            letterSpacing: 0.5,
            marginTop: 2,
            marginBottom: 0,
            textShadow: '0 1px 4px #80000011',
            opacity: 0.97,
          }}>
            Your Gateway to the Tech World &mdash; Explore, enroll, and start your journey today!
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        {courses.map(course => (
          <div className="col-md-6 col-lg-4 mb-4" key={course.id}>
            <div className="card shadow h-100" style={{ border: `2px solid ${maroon}` }}>
              <img src={course.image} className="card-img-top" alt={course.title} style={{ height: 200, objectFit: 'cover' }} />
              <div className="card-body d-flex flex-column" style={{ background: white }}>
                <h4 className="card-title" style={{ color: maroon, fontWeight: 700 }}>{course.title}</h4>
                <p className="card-text" style={{ color: '#333', flexGrow: 1 }}>{course.description}</p>
                <div className="d-flex flex-column flex-md-row gap-2 mt-3">
                  <button
                    className="btn btn-lg"
                    style={{ background: maroon, color: white, fontWeight: 600, border: 'none', borderRadius: 6 }}
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrollStatus[course.id] === 'loading'}
                  >
                    {enrollStatus[course.id] === 'loading' ? 'Enrolling...' : 'Enroll'}
                  </button>
                  <button
                    className="btn btn-outline-dark btn-lg"
                    style={{ borderColor: maroon, color: maroon, fontWeight: 600, borderRadius: 6 }}
                    onClick={() => handleViewDetails(course.id)}
                  >
                    View Details
                  </button>
                </div>
                {enrollStatus[course.id] && enrollStatus[course.id] !== 'loading' && localStorage.getItem('token') && (
                  <div style={{ color: enrollStatus[course.id].includes('success') ? 'green' : 'red', marginTop: 10, fontWeight: 500 }}>
                    {enrollStatus[course.id]}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: 32 }} />
      <div style={{
        maxWidth: 700,
        margin: '2rem auto 0',
        background: white,
        borderRadius: 18,
        boxShadow: '0 4px 24px #80000022',
        border: `2px solid ${maroon}`,
        padding: '2rem 2.5rem',
        color: maroon,
        textAlign: 'left',
      }}>
        <h4 style={{ color: maroon, fontWeight: 800, marginBottom: 18, letterSpacing: 1, textShadow: '0 2px 8px #80000011' }}>
          How to Enjoy MoringaStudyHub
        </h4>
        <ul style={{ fontSize: 18, marginBottom: 0, paddingLeft: 0, listStyle: 'none' }}>
          <li style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
            <FaBookOpen style={{ fontSize: 28, marginRight: 16, color: maroon, background: '#f8eaea', borderRadius: '50%', padding: 6 }} />
            <span><b>Browse & Enroll:</b> Explore our top courses and enroll with a single click.</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
            <FaChartLine style={{ fontSize: 28, marginRight: 16, color: maroon, background: '#f8eaea', borderRadius: '50%', padding: 6 }} />
            <span><b>Track Your Learning:</b> View your enrolled courses and see your progress as you complete labs, quizzes, and the final exam.</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
            <FaFlask style={{ fontSize: 28, marginRight: 16, color: maroon, background: '#f8eaea', borderRadius: '50%', padding: 6 }} />
            <span><b>Hands-On Practice:</b> Complete labs and quizzes to reinforce your skills. Mark each as complete as you go!</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
            <FaComments style={{ fontSize: 28, marginRight: 16, color: maroon, background: '#f8eaea', borderRadius: '50%', padding: 6 }} />
            <span><b>Join Discussions:</b> Post questions, share feedback, and collaborate with fellow students in course and lab/quiz/exam discussions.</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', marginBottom: 0 }}>
            <FaUsers style={{ fontSize: 28, marginRight: 16, color: maroon, background: '#f8eaea', borderRadius: '50%', padding: 6 }} />
            <span><b>Connect & Grow:</b> Learn from mentors, connect with peers, and make the most of your Moringa journey!</span>
          </li>
        </ul>
      </div>
      <div style={{
        background: white,
        color: maroon,
        textAlign: 'center',
        fontSize: 14,
        marginTop: 40,
        fontWeight: 600,
        opacity: 0.95,
        borderRadius: 10,
        boxShadow: '0 2px 8px #80000011',
        padding: '12px 0',
        maxWidth: 400,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        © 2025 MoringaStudyHub. All rights reserved.
      </div>
    </div>
  );
}

export default Home; 
