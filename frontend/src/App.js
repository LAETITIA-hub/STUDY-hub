import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CourseDetail from './pages/CourseDetail';
import MyCourses from './pages/MyCourses';
import AskQuestion from './pages/AskQuestion';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import MyCourseDetail from './pages/MyCourseDetail';
import ItemDiscussion from './pages/ItemDiscussion';

function AppRoutes() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  return (
    <>
      {isLoggedIn && !isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/ask" element={<AskQuestion />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/my-courses/:courseId" element={<MyCourseDetail />} />
        <Route path="/discussion/:type/:itemId" element={<ItemDiscussion />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
