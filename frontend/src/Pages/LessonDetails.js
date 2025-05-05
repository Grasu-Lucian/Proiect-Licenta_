import React , { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// axios request is http://localhost:3307/api/lessonforteacher/:LessonID

const LessonDetails = () => {
  const { lessonId } = useParams(); // Extract the lesson ID from the URL
  const [lesson, setLesson] = useState({}); // Stores the lesson details
  const [error, setError] = useState(null); // Stores any error messages
    const navigate = useNavigate();
    
    useEffect(() => {
      const fetchLesson = async () => {
        try {
          const token = localStorage.getItem('teacher_token'); // Retrieve the token from localStorage
          if (!token) {
            throw new Error('No token found. Please log in.');
          }

          const response = await axios.get(`http://localhost:3307/api/lessonforteacher/${lessonId}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the Authorization header
            },
          });

          setLesson(response.data); // Set the lesson data
          setError(null); // Clear any previous errors
        } catch (err) {
          setError(err.response?.data?.message || err.message || 'An error occurred while fetching the lesson.');
        }           
        }
        fetchLesson();
        }, [lessonId]);
        

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lesson Details</h1>

      {/* Display error message if any */}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          <p>{error}</p>
        </div>
      )}                

        {/* Display the lesson details */}
        {!error && lesson && (
            <div className="p-4 border rounded-md shadow bg-white">
            <h2 className="text-lg font-bold mb-2">{lesson.Title}</h2>
            <p className="mb-4">{lesson.Description}</p>
            <button
                onClick={() => navigate(-1)} // Navigate back to the previous page
                className="text-blue-500 hover:text-blue-700 focus:outline-none"
            >
                ← Back
            </button>
            </div>
        )}
    </div>
  );
};

export default LessonDetails;