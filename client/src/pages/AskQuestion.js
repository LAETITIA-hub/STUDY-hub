// src/pages/AskQuestion.js
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

function AskQuestion() {
  const formik = useFormik({
    initialValues: {
      course_id: "",
      user_id: "1", // Hardcoded for now
      content: "",
    },
    validationSchema: Yup.object({
      content: Yup.string().min(15, "Must be 15 characters or more").required("Required"),
    }),
    onSubmit: (values, { resetForm }) => {
      fetch("/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then(() => resetForm());
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Ask a Question</h2>
      <div className="mb-4">
        <label className="block mb-1">Course ID</label>
        <input
          name="course_id"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.course_id}
          className="border p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Your Question</label>
        <textarea
          name="content"
          onChange={formik.handleChange}
          value={formik.values.content}
          className="border p-2 w-full"
        />
        {formik.errors.content && <div className="text-red-600 text-sm">{formik.errors.content}</div>}
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}

export default AskQuestion;
