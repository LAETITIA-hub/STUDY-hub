import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    fetch(`/courses/${id}`)
      .then((res) => res.json())
      .then((data) => setCourse(data));

    fetch(`/discussions/${id}`)
      .then((res) => res.json())
      .then((data) => setDiscussions(data));
  }, [id]);

  if (!course) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
      <p className="mb-4">{course.description}</p>

      <h3 className="text-xl font-semibold mt-6">Discussions</h3>
      <ul className="mt-2 space-y-2">
        {discussions.map((d) => (
          <li key={d.id} className="border p-2 rounded">
            <p><strong>{d.user?.name}:</strong> {d.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseDetail;

