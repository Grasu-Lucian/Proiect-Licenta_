import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// structure of the lesson object is Title and Description axios route is http://localhost:3307/api/lesson/:CourseId

const CreateLessons = () => {
  const { courseId } = useParams(); // Extract the course ID from the URL
  const [lesson, setLesson] = useState({
    Title: '',
    Description: '',
  });
  const [error, setError] = useState(null); // Stores any error messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLesson({ ...lesson, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('teacher_token'); // Retrieve the token from localStorage
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const response = await axios.post(`https://proiect-licenta-1.onrender.com/api/lesson/${courseId}`, lesson, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      });

      setLesson(response.data); // Set the lesson data
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred while creating the lesson.');
    }
    // Redirect to the lessons page after successful creation
    navigate(`/check-lessons/${courseId}`); // Redirect to the lessons page for the course
  };

  return (      
    <div className="flex flex-col items-center justify-center h-screen">


        <div className="absolute top-4 left-4">
            <button
                onClick={() => navigate(-1)} // Navigate back to the previous page
                className="text-blue-500 hover:text-blue-700 focus:outline-none"
            >
                ← Back
            </button>
        </div>

        <h1 className="text-3xl font-bold mb-6">Create Lesson</h1>
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
        >
            <div className="mb-4">
                <label htmlFor="Title" className="block text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    type="text"
                    id="Title"
                    name="Title"
                    value={lesson.Title}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="Description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id="Description"
                    name="Description"
                    value={lesson.Description}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    required
                />
            </div>
            {error && (
                <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
                    <p>{error}</p>
                </div>
            )}
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
                Create Lesson
            </button>
        </form>
    </div>
  );
};

export default CreateLessons;