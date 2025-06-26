import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const maroon = '#800000';
const white = '#fff';

function Navbar() {
  const userName = localStorage.getItem('user_name');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  const isHome = location.pathname === '/';

  return (
    <nav className="navbar navbar-expand-lg" style={{ background: maroon }}>
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/" style={{ color: white, fontWeight: 700, fontSize: 24, textDecoration: 'none' }}>
          <img src="/logo192.png" alt="logo" style={{ height: 40, width: 40, borderRadius: '50%', marginRight: 12, background: '#fff' }} />
          MoringaStudyHub
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/" style={{ color: white, fontWeight: 500 }}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/my-courses" style={{ color: white, fontWeight: 500 }}>My Courses</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ask" style={{ color: white, fontWeight: 500 }}>Give Feedback</Link>
            </li>
            {!userName && !isHome && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup" style={{ color: white, fontWeight: 500 }}>Sign Up</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" style={{ color: white, fontWeight: 500 }}>Login</Link>
                </li>
              </>
            )}
            {userName && (
              <li className="nav-item">
                <Link className="nav-link" to="/profile" style={{ color: white, fontWeight: 500 }}>Profile</Link>
              </li>
            )}
          </ul>
          {userName && (
            <div className="d-flex align-items-center">
              <span style={{ color: white, fontWeight: 500, marginRight: 16 }}>Welcome, {userName}!</span>
              <button className="btn btn-outline-light" onClick={handleLogout} style={{ fontWeight: 600, borderRadius: 6 }}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 