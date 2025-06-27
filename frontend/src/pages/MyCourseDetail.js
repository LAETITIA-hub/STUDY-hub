import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const maroon = '#800000';
const white = '#fff';

function MyCourseDetail() {
  const { courseId } = useParams();
  const [tab, setTab] = useState('labs');
  const [labs, setLabs] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [labsRes, quizzesRes, examsRes] = await Promise.all([
          fetch(`/courses/${courseId}/labs`, { headers }),
          fetch(`/courses/${courseId}/quizzes`, { headers }),
          fetch(`/courses/${courseId}/exams`, { headers }),
        ]);
        const labsData = await labsRes.json();
        const quizzesData = await quizzesRes.json();
        const examsData = await examsRes.json();
        if (labsRes.ok && quizzesRes.ok && examsRes.ok) {
          setLabs(labsData);
          setQuizzes(quizzesData);
          setExams(examsData);
        } else {
          setError('Failed to load course items.');
        }
      } catch (err) {
        setError('Network error.');
      }
      setLoading(false);
    }
    fetchAll();
  }, [courseId, token]);

  async function toggleCompletion(type, id, is_complete) {
    const url = `/${type}/${id}/completion`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_complete: !is_complete }),
      });
      if (res.ok) {
        // Refresh the data
        if (type === 'labs') {
          setLabs(labs => labs.map(l => l.id === id ? { ...l, is_complete: !is_complete } : l));
        } else if (type === 'quizzes') {
          setQuizzes(quizzes => quizzes.map(q => q.id === id ? { ...q, is_complete: !is_complete } : q));
        } else if (type === 'exams') {
          setExams(exams => exams.map(e => e.id === id ? { ...e, is_complete: !is_complete } : e));
        }
      }
    } catch {}
  }

  function handleDiscuss(type, id) {
    navigate(`/discussion/${type}/${id}`);
  }

  function renderSummary(items, type) {
    const completed = items.filter(i => i.is_complete).length;
    return (
      <div style={{ fontWeight: 600, color: maroon, marginBottom: 8 }}>
        {type.charAt(0).toUpperCase() + type.slice(1)}: {completed} of {items.length} completed
      </div>
    );
  }

  function renderItems(items, type) {
    return (
      <>
        {renderSummary(items, type)}
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.length > 0 ? items.map(item => (
            <li key={item.id} style={{ border: `1px solid ${maroon}22`, borderRadius: 8, margin: '0.5rem 0', padding: '1rem', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, color: maroon }}>{item.title}</div>
                <div style={{ fontSize: 15 }}>{item.description}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button className="btn btn-sm" style={{ background: item.is_complete ? '#4caf50' : '#eee', color: item.is_complete ? '#fff' : maroon, fontWeight: 600, borderRadius: 6 }} onClick={() => toggleCompletion(type, item.id, item.is_complete)}>
                  {item.is_complete ? 'Completed' : 'Mark Complete'}
                </button>
                <button className="btn btn-sm" style={{ background: maroon, color: white, fontWeight: 600, borderRadius: 6 }} onClick={() => handleDiscuss(type, item.id)}>
                  Discuss
                </button>
              </div>
            </li>
          )) : <li>No {type} yet.</li>}
        </ul>
      </>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: 800 }}>
      <div className="card shadow" style={{ border: `2px solid ${maroon}`, background: white, borderRadius: 16 }}>
        <div className="card-body p-5">
          <h2 className="card-title mb-3" style={{ color: maroon, fontWeight: 700, fontSize: 32 }}>Course Progress</h2>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            <button className="btn" style={{ background: tab === 'labs' ? maroon : '#eee', color: tab === 'labs' ? white : maroon, fontWeight: 600, borderRadius: 6 }} onClick={() => setTab('labs')}>Labs</button>
            <button className="btn" style={{ background: tab === 'quizzes' ? maroon : '#eee', color: tab === 'quizzes' ? white : maroon, fontWeight: 600, borderRadius: 6 }} onClick={() => setTab('quizzes')}>Quizzes</button>
            <button className="btn" style={{ background: tab === 'exams' ? maroon : '#eee', color: tab === 'exams' ? white : maroon, fontWeight: 600, borderRadius: 6 }} onClick={() => setTab('exams')}>Exams</button>
          </div>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && (
            <div>
              {tab === 'labs' && renderItems(labs, 'labs')}
              {tab === 'quizzes' && renderItems(quizzes, 'quizzes')}
              {tab === 'exams' && renderItems(exams, 'exams')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyCourseDetail; 
