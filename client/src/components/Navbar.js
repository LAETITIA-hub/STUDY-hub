import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-800 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold">MoringaStudyHub</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/my-courses" className="hover:underline">My Courses</Link>
          <Link to="/ask" className="hover:underline">Ask a Question</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

