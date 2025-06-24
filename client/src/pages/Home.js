import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Available Courses</h2>
      <ul className="space-y-4">
        {courses.map((course) => (
          <li key={course.id} className="border p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{course.title}</h3>
            <p>{course.description}</p>
            <Link to={`/courses/${course.id}`} className="text-blue-600 underline mt-2 inline-block">
              View Details
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;


