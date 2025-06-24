import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CourseDetail from "./pages/CourseDetail";
import MyCourses from "./pages/MyCourses";
import AskQuestion from "./pages/AskQuestion";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/ask" element={<AskQuestion />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

