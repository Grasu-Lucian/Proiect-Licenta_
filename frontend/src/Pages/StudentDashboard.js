import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('student_token');
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await axios.get('http://localhost:3307/api/coursesforstudents', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Ensure we always have an array of courses
        const data = response.data;
        if (Array.isArray(data)) {
          setCourses(data);
        } else if (data && typeof data === 'object') {
          setCourses([data]); // Wrap single object in array
        } else {
          setCourses([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch courses');
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem('student_token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const response = await axios.post(`http://localhost:3307/api/enroll/${courseId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // After successful enrollment, remove the course from the list
      setCourses(courses.filter((course) => course.CourseID !== courseId));

      // Show success message
      alert('Successfully enrolled in the course!');
    } catch (err) {
      if (err.response?.data?.message === 'Student is already enrolled in this course') {
        alert('You are already enrolled in this course!');
      } else {
        setError(err.response?.data?.message || 'Failed to enroll in course');
        alert('Failed to enroll in the course. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Courses to Get Enrolled In</h2>
        
        {courses.length === 0 ? (
          <p className="text-gray-600">No courses are currently available for enrollment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.CourseID} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2">{course.Title}</h3>
                <p className="text-gray-600 mb-4">{course.Description}</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {new Date(course.CreatedAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleEnroll(course.CourseID)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Enroll
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;