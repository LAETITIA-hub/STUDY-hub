import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const maroon = '#800000';
const white = '#fff';

const DiscussionSchema = Yup.object().shape({
  content: Yup.string().min(5, 'Comment must be at least 5 characters').required('Required'),
});

function ItemDiscussion() {
  const { type, itemId } = useParams(); // type: labs/quizzes/exams
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');

  const endpoint = `/api/${type}/${itemId}/discussions`;
  const updateEndpoint = type === 'labs' ? 'lab-discussions' : type === 'quizzes' ? 'quiz-discussions' : 'exam-discussions';

  useEffect(() => {
    async function fetchDiscussions() {
      setLoading(true);
      try {
        const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok) setDiscussions(data);
        else setDiscussions([]);
      } catch {
        setDiscussions([]);
      }
      setLoading(false);
    }
    fetchDiscussions();
  }, [endpoint, token]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setMsg(null);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: values.content }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Comment posted!');
        resetForm();
        // Refresh
        const res2 = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
        const data2 = await res2.json();
        if (res2.ok) setDiscussions(data2);
      } else {
        setMsg(data.error || 'Failed to post comment.');
      }
    } catch {
      setMsg('Network error.');
    }
    setSubmitting(false);
  };

  const handleEdit = (id, content) => {
    setEditId(id);
    setEditContent(content);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetch(`/api/${updateEndpoint}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: editContent }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Comment updated!');
        setEditId(null);
        setEditContent('');
        // Refresh
        const res2 = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
        const data2 = await res2.json();
        if (res2.ok) setDiscussions(data2);
      } else {
        setMsg(data.error || 'Failed to update comment.');
      }
    } catch {
      setMsg('Network error.');
    }
  };

  const handleDelete = async (id) => {
    setMsg(null);
    if (!window.confirm('Delete this comment?')) return;
    try {
      const res = await fetch(`/api/${updateEndpoint}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Comment deleted!');
        setDiscussions(discussions.filter(d => d.id !== id));
      } else {
        setMsg(data.error || 'Failed to delete comment.');
      }
    } catch {
      setMsg('Network error.');
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 700 }}>
      <div className="card shadow" style={{ border: `2px solid ${maroon}`, background: white, borderRadius: 16 }}>
        <div className="card-body p-5">
          <h2 className="card-title mb-3" style={{ color: maroon, fontWeight: 700, fontSize: 28 }}>Discussion</h2>
          <div className="mb-4">
            <h4 style={{ color: maroon, fontWeight: 600 }}>Post a Comment</h4>
            <Formik
              initialValues={{ content: '' }}
              validationSchema={DiscussionSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div style={{ marginBottom: 12 }}>
                    <Field name="content" as="textarea" rows={3} style={{ width: '100%', borderRadius: 6, border: `1px solid ${maroon}`, padding: 10 }} placeholder="Write your comment..." />
                    <div style={{ color: 'red', fontSize: 12 }}><ErrorMessage name="content" /></div>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn" style={{ background: maroon, color: white, fontWeight: 600, borderRadius: 6, padding: '0.5rem 1.5rem' }}>
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </button>
                  {msg && (
                    <div style={{ color: msg.includes('!') ? 'green' : 'red', marginTop: 12 }}>{msg}</div>
                  )}
                </Form>
              )}
            </Formik>
          </div>
          <div className="mt-5">
            <h4 style={{ color: maroon, fontWeight: 600 }}>Comments</h4>
            {loading ? (
              <p>Loading comments...</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {discussions.length > 0 ? discussions.map(d => (
                  <li key={d.id} style={{ border: `1px solid ${maroon}22`, borderRadius: 8, margin: '0.5rem 0', padding: '0.75rem', background: '#f9f9f9' }}>
                    <div style={{ fontWeight: 500, color: maroon }}>User: {d.user_email ? d.user_email : 'Anonymous'}</div>
                    {editId === d.id ? (
                      <form onSubmit={handleEditSubmit} style={{ marginTop: 8 }}>
                        <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={2} style={{ width: '100%', borderRadius: 6, border: `1px solid ${maroon}`, padding: 8 }} />
                        <button type="submit" className="btn btn-sm" style={{ background: maroon, color: white, fontWeight: 600, borderRadius: 6, marginRight: 8 }}>Save</button>
                        <button type="button" className="btn btn-sm" style={{ background: '#eee', color: maroon, fontWeight: 600, borderRadius: 6 }} onClick={() => setEditId(null)}>Cancel</button>
                      </form>
                    ) : (
                      <>
                        <div style={{ fontSize: 16 }}>{d.content}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{new Date(d.timestamp).toLocaleString()}</div>
                        {String(d.user_id) === String(userId) && (
                          <div style={{ marginTop: 6 }}>
                            <button className="btn btn-sm" style={{ background: maroon, color: white, fontWeight: 600, borderRadius: 6, marginRight: 8 }} onClick={() => handleEdit(d.id, d.content)}>Edit</button>
                            <button className="btn btn-sm" style={{ background: '#eee', color: maroon, fontWeight: 600, borderRadius: 6 }} onClick={() => handleDelete(d.id)}>Delete</button>
                          </div>
                        )}
                      </>
                    )}
                  </li>
                )) : <li>No comments yet.</li>}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDiscussion; 
