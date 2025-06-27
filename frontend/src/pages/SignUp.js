import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const maroon = '#800000';
const white = '#fff';

const SignUpSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  student_id: Yup.string().required('Student ID is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

function SignUp() {
  const [serverMsg, setServerMsg] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 0 }}>
      <div style={{ background: white, border: `2px solid ${maroon}`, borderRadius: 18, boxShadow: '0 4px 24px #80000022', padding: 32 }}>
        <h2 style={{ color: maroon, fontWeight: 700, textAlign: 'center', marginBottom: 28 }}>Sign Up</h2>
        <Formik
          initialValues={{ name: '', email: '', student_id: '', password: '' }}
          validationSchema={SignUpSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setServerMsg(null);
            setIsSuccess(false);
            try {
              const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
              });
              const data = await res.json();
              if (res.ok) {
                setIsSuccess(true);
                setServerMsg('Sign up successful! Redirecting to login...');
                localStorage.setItem('user_email', values.email);
                localStorage.setItem('student_id', values.student_id);
                resetForm();
                setTimeout(() => navigate('/login'), 1500);
              } else {
                setServerMsg(data.error || 'Sign up failed.');
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
                <label style={{ color: maroon, fontWeight: 600 }}>Name</label>
                <Field name="name" className="form-input" style={{ width: '100%', padding: 12, borderRadius: 8, border: `1.5px solid ${maroon}77`, fontSize: 16, marginTop: 4 }} />
                <div style={{ color: 'red', fontSize: 12 }}><ErrorMessage name="name" /></div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ color: maroon, fontWeight: 600 }}>Email</label>
                <Field name="email" type="email" className="form-input" style={{ width: '100%', padding: 12, borderRadius: 8, border: `1.5px solid ${maroon}77`, fontSize: 16, marginTop: 4 }} />
                <div style={{ color: 'red', fontSize: 12 }}><ErrorMessage name="email" /></div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ color: maroon, fontWeight: 600 }}>Student ID</label>
                <Field name="student_id" className="form-input" style={{ width: '100%', padding: 12, borderRadius: 8, border: `1.5px solid ${maroon}77`, fontSize: 16, marginTop: 4 }} />
                <div style={{ color: 'red', fontSize: 12 }}><ErrorMessage name="student_id" /></div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ color: maroon, fontWeight: 600 }}>Password</label>
                <Field name="password" type="password" className="form-input" style={{ width: '100%', padding: 12, borderRadius: 8, border: `1.5px solid ${maroon}77`, fontSize: 16, marginTop: 4 }} />
                <div style={{ color: 'red', fontSize: 12 }}><ErrorMessage name="password" /></div>
              </div>
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
                  marginTop: 8,
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                {isSubmitting ? 'Signing up...' : 'Sign Up'}
              </button>
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

export default SignUp; 
