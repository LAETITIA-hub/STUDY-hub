import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const maroon = '#800000';
const white = '#fff';

function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hovered, setHovered] = useState(null);
  const userId = localStorage.getItem('user_id');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      if (!userId) {
        setError('You must be logged in to view your courses.');
        setLoading(false);
        return;
      }
      try {
        const [enrollRes, courseRes] = await Promise.all([
          fetch(`/enrollments/${userId}`),
          fetch('/courses'),
        ]);
        const enrollData = await enrollRes.json();
        const courseData = await courseRes.json();
        if (enrollRes.ok && courseRes.ok) {
          setEnrollments(enrollData);
          setCourses(courseData);
        } else {
          setError('Failed to load enrollments or courses.');
        }
      } catch (err) {
        setError('Network error.');
      }
      setLoading(false);
    }
    fetchData();
  }, [userId]);

  function getCourseTitle(courseId) {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : `Course ID: ${courseId}`;
  }

  function handleCourseClick(courseId) {
    navigate(`/my-courses/${courseId}`);
  }

  return (
    <div>
      <h2 style={{ color: maroon, fontWeight: 700 }}>My Courses</h2>
      {loading && <p>Loading your courses...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {enrollments.length > 0 ? enrollments.map(e => (
            <li
              key={e.id}
              style={{
                border: `1.5px solid ${maroon}`,
                borderRadius: 8,
                margin: '1rem 0',
                padding: '1rem',
                cursor: 'pointer',
                background: hovered === e.id ? maroon : white,
                color: hovered === e.id ? white : maroon,
                boxShadow: hovered === e.id ? `0 2px 12px ${maroon}33` : 'none',
                transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
              }}
              onClick={() => handleCourseClick(e.course_id)}
              onMouseEnter={() => setHovered(e.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{ fontWeight: 600, fontSize: 20 }}>{getCourseTitle(e.course_id)}</div>
            </li>
          )) : <li>You are not enrolled in any courses yet.</li>}
        </ul>
      )}
    </div>
  );
}

export default MyCourses; 
