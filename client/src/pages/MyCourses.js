// src/pages/MyCourses.js
import React, { useEffect, useState } from "react";

function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    fetch("/enrollments")
      .then((res) => res.json())
      .then((data) => setEnrollments(data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Enrolled Courses</h2>
      <ul className="space-y-4">
        {enrollments.map((e) => (
          <li key={e.id} className="border p-4 rounded">
            <h3 className="text-xl font-semibold">{e.course?.title}</h3>
            <p>Progress: {e.progress}%</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyCourses;
