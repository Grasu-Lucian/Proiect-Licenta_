import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CheckLessons = () => {
  const { courseId } = useParams(); // Extract the course ID from the URL
  const [lessons, setLessons] = useState([]); // Stores the list of lessons
  const [error, setError] = useState(null); // Stores any error messages
  const [successMessage, setSuccessMessage] = useState(null); // Stores success messages
  const navigate = useNavigate();

  // Handle lesson deletion
  const handleDeleteLesson = async (lessonId) => {
    try {
      const token = localStorage.getItem('teacher_token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      await axios.delete(`http://localhost:3307/api/lesson/${lessonId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the deleted lesson from the state
      setLessons(lessons.filter(lesson => lesson.LessonID !== lessonId));
      setSuccessMessage('Lesson deleted successfully');
      setError(null);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred while deleting the lesson.');
      setSuccessMessage(null);
    }
  };

  // Fetch lessons when the component mounts
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const token = localStorage.getItem('teacher_token'); // Retrieve the token from localStorage
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await axios.get(`http://localhost:3307/api/lessonsforteacher/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        });

        setLessons(response.data); // Set the lessons data
        setError(null); // Clear any previous errors
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'An error occurred while fetching lessons.');
      }
    };

    fetchLessons();
  }, [courseId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lessons for Course ID: {courseId}</h1>

      {/* Display error message if any */}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Display success message if any */}
      {successMessage && (
        <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">
          <p>{successMessage}</p>
        </div>
      )}

      {/* Display message if no lessons are found */}
      {!error && lessons.length === 0 && (
        <div>
          <p>No lessons found for this course.</p>
        </div>
      )}

      {/* Display the list of lessons */}
      <ul className="space-y-4">
        {lessons.map((lesson) => (
          <li key={lesson.id} className="p-4 border rounded-md shadow bg-white">
            <h2 className="text-lg font-bold mb-2">{lesson.Title}</h2>
            <div className="flex space-x-2">
              {/* Button to view lesson details */}
              <button
                onClick={() => navigate(`/lesson-details/${lesson.LessonID}`)} // Navigate to lesson details page
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                View Lesson Details
              </button>
              {/* Button to edit lesson */}
              <button
                onClick={() => navigate(`/edit-lesson/${lesson.LessonID}`)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
              >
                Edit Lesson
              </button>
              {/* Button to delete lesson */}
              <button
                onClick={() => handleDeleteLesson(lesson.LessonID)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Delete Lesson
              </button>
            </div>
          </li>
        ))}
      </ul>
      {/* add a button to create a new lesson */}
      <button
        onClick={() => navigate(`/create-lesson/${courseId}`)} // Navigate to create lesson page
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Create New Lesson
      </button>
      {/* Button to go back to courses */}
      <button
        onClick={() => navigate('/check-courses')}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
      >
        Back to Courses
      </button>
    </div>
  );
};

export default CheckLessons;