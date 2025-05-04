import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CheckCourses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('teacher_token'); // Retrieve the token from localStorage
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await axios.get('http://localhost:3307/api/coursesforteacher', {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        });

        setCourses(response.data); // Set the courses data
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'An error occurred while fetching courses.');
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Courses</h1>
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          <p>{error}</p>
        </div>
      )}
      {!error && courses.length === 0 && (
        <div>
          <p>No courses found.</p>
          <button
            onClick={() => navigate('/create-course')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add a Course
          </button>
        </div>
      )}
      <ul className="space-y-4">
        {courses.map((course) => (
          <li key={course.id} className="p-4 border rounded-md shadow">
            <h2 className="text-lg font-bold">{course.name}</h2>
            <p>{course.description}</p>
          </li>
        ))}
      </ul>
      {courses.length > 0 && (
        <button
          onClick={() => navigate('/create-course')}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Another Course
        </button>
      )}
    </div>
  );
};

export default CheckCourses;