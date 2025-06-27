import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const maroon = '#800000';
const white = '#fff';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

function Login() {
  const [serverMsg, setServerMsg] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const showSignup = location.state && location.state.showSignup;

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 0 }}>
      <div style={{ background: white, border: `2px solid ${maroon}`, borderRadius: 18, boxShadow: '0 4px 24px #80000022', padding: 32 }}>
        <h2 style={{ color: maroon, fontWeight: 700, textAlign: 'center', marginBottom: 28 }}>Login</h2>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setServerMsg(null);
            setIsSuccess(false);
            try {
              const res = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
              });
              const data = await res.json();
              if (res.ok) {
                setIsSuccess(true);
                setServerMsg('Login successful! Redirecting to home...');
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user_id', data.user_id);
                localStorage.setItem('user_name', data.name);
                localStorage.setItem('user_email', values.email);
                if (data.student_id) {
                  localStorage.setItem('student_id', data.student_id);
                }
                resetForm();
                setTimeout(() => navigate('/'), 1200);
              } else {
                setServerMsg(data.error || 'Login failed.');
              }
            } catch (err) {
              setServerMsg('Network error. Please try again.');
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div style={{ marginBottom: 18 }}>
                <label style={{ color: maroon, fontWeight: 600 }}>Email</label>
                <Field name="email" type="email" className="form-input" style={{ width: '100%', padding: 12, borderRadius: 8, border: `1.5px solid ${maroon}77`, fontSize: 16, marginTop: 4 }} />
                <div style={{ color: 'red', fontSize: 12 }}><ErrorMessage name="email" /></div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ color: maroon, fontWeight: 600 }}>Password</label>
                <Field name="password" type="password" className="form-input" style={{ width: '100%', padding: 12, borderRadius: 8, border: `1.5px solid ${maroon}77`, fontSize: 16, marginTop: 4 }} />
                <div style={{ color: 'red', fontSize: 12 }}><ErrorMessage name="password" /></div>
              </div>
              <div className="d-flex align-items-center justify-content-between" style={{ marginTop: 18 }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '0.6rem 2.2rem',
                    background: hovered ? maroon : white,
                    color: hovered ? white : maroon,
                    border: `2px solid ${maroon}`,
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 17,
                    boxShadow: hovered ? `0 2px 12px ${maroon}33` : 'none',
                    transition: 'all 0.18s',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
                {showSignup && (
                  <Link
                    to="/signup"
                    className="btn btn-outline-primary"
                    style={{
                      marginLeft: 12,
                      color: linkHovered ? white : maroon,
                      background: linkHovered ? maroon : white,
                      border: `2px solid ${maroon}`,
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 16,
                      padding: '0.5rem 1.5rem',
                      transition: 'all 0.18s',
                      textDecoration: 'none',
                      boxShadow: linkHovered ? `0 2px 12px ${maroon}33` : 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={() => setLinkHovered(true)}
                    onMouseLeave={() => setLinkHovered(false)}
                  >
                    Sign Up
                  </Link>
                )}
              </div>
              {serverMsg && (
                <div style={{ color: isSuccess ? 'green' : 'red', marginTop: 20, fontWeight: 600, textAlign: 'center' }}>{serverMsg}</div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login; 
