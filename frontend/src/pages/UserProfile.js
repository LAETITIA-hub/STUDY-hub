import React from 'react';

const maroon = '#800000';
const white = '#fff';

function UserProfile() {
  const name = localStorage.getItem('user_name') || 'N/A';
  const email = localStorage.getItem('user_email') || 'N/A';

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card shadow-lg" style={{ border: `2px solid ${maroon}`, background: white, borderRadius: 20, maxWidth: 420, width: '100%' }}>
        <div className="card-body p-5 d-flex flex-column align-items-center">
          <div style={{
            width: 90,
            height: 90,
            borderRadius: '50%',
            background: maroon,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            boxShadow: '0 2px 12px rgba(128,0,0,0.08)'
          }}>
            <svg width="48" height="48" fill={white} viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>
          </div>
          <h2 className="card-title mb-3" style={{ color: maroon, fontWeight: 700, fontSize: 28, textAlign: 'center' }}>My Profile</h2>
          <div style={{ fontSize: 20, marginBottom: 18, color: '#222', textAlign: 'center' }}><strong>Name:</strong> {name}</div>
          <div style={{ fontSize: 20, marginBottom: 18, color: '#222', textAlign: 'center' }}><strong>Email:</strong> {email}</div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile; 