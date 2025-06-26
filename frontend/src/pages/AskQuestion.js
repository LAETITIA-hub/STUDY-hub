import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const maroon = '#800000';
const white = '#fff';

const FeedbackSchema = Yup.object().shape({
  content: Yup.string().min(15, 'Feedback must be at least 15 characters').required('Required'),
});

function GiveFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    async function fetchFeedbacks() {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/discussions/1'); // Show all feedback for course 1 or general
        const data = await res.json();
        if (res.ok) {
          setFeedbacks(data);
        }
      } catch (err) {
        setFeedbacks([]);
      }
      setLoading(false);
    }
    fetchFeedbacks();
  }, []);

  const handleFeedbackSubmit = async (values, { setSubmitting, resetForm }) => {
    setFeedbackMsg(null);
    setFeedbackLoading(true);
    const token = localStorage.getItem('token');
    let headers = { 'Content-Type': 'application/json' };
    let body = { course_id: 1, content: values.content };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else {
      body.user_id = null; // Mark as anonymous
    }
    try {
      const res = await fetch('http://localhost:5000/discussions', {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg('Feedback posted!');
        resetForm();
        // Refresh feedbacks
        const res2 = await fetch('http://localhost:5000/discussions/1');
        const data2 = await res2.json();
        if (res2.ok) setFeedbacks(data2);
      } else {
        setFeedbackMsg(data.error || 'Failed to post feedback.');
      }
    } catch (err) {
      setFeedbackMsg('Network error.');
    }
    setSubmitting(false);
    setFeedbackLoading(false);
  };

  return (
    <div className="container py-5" style={{ maxWidth: 700 }}>
      <div className="card shadow" style={{ border: `2px solid ${maroon}`, background: white, borderRadius: 16 }}>
        <div className="card-body p-5">
          <h2 className="card-title mb-3" style={{ color: maroon, fontWeight: 700, fontSize: 32 }}>Give Feedback</h2>
          <div className="mb-4">
            <h4 style={{ color: maroon, fontWeight: 600 }}>Post Feedback</h4>
            <Formik
              initialValues={{ content: '' }}
              validationSchema={FeedbackSchema}
              onSubmit={handleFeedbackSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div style={{ marginBottom: 12 }}>
                    <Field name="content" as="textarea" rows={3} style={{ width: '100%', borderRadius: 6, border: `1px solid ${maroon}`, padding: 10 }} placeholder="Give your feedback..." />
                    <div style={{ color: 'red', fontSize: 12 }}><ErrorMessage name="content" /></div>
                  </div>
                  <button type="submit" disabled={isSubmitting || feedbackLoading} className="btn" style={{ background: maroon, color: white, fontWeight: 600, borderRadius: 6, padding: '0.5rem 1.5rem' }}>
                    {isSubmitting || feedbackLoading ? 'Posting...' : 'Post Feedback'}
                  </button>
                  {feedbackMsg && (
                    <div style={{ color: feedbackMsg.includes('posted') ? 'green' : 'red', marginTop: 12 }}>{feedbackMsg}</div>
                  )}
                </Form>
              )}
            </Formik>
          </div>
          <div className="mt-5">
            <h4 style={{ color: maroon, fontWeight: 600 }}>Feedback</h4>
            {loading ? (
              <p>Loading feedback...</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {feedbacks.length > 0 ? feedbacks.map(d => (
                  <li key={d.id} style={{ border: `1px solid ${maroon}22`, borderRadius: 8, margin: '0.5rem 0', padding: '0.75rem', background: '#f9f9f9' }}>
                    <div style={{ fontWeight: 500, color: maroon }}>User: {d.user_email ? d.user_email : 'Anonymous'}</div>
                    <div style={{ fontSize: 16 }}>{d.content}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{new Date(d.timestamp).toLocaleString()}</div>
                  </li>
                )) : <li>No feedback yet.</li>}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GiveFeedback; 