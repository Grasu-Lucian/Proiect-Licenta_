import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CheckStudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem('student_token');
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await axios.get('http://localhost:3307/api/enrolledcourses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          setCourses(response.data);
        } else {
          setCourses([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch your enrolled courses');
        setCourses([]);
      }
    };

    fetchEnrolledCourses();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-6">My Enrolled Courses</h1>
      
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4 w-full max-w-4xl">
          {error}
        </div>
      )}

      <div className="w-full max-w-4xl">
        {!courses || courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-xl text-gray-600">You haven't enrolled in any courses yet.</p>
            <p className="text-gray-500 mt-2">
              Visit the <a href="/student-dashboard" className="text-blue-500 hover:text-blue-600">Available Courses</a> page to enroll in courses.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.CourseID} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2">{course.Title}</h3>
                <p className="text-gray-600 mb-4">{course.Description}</p>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate(`/student/course/${course.CourseID}/lessons`)}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    View Lessons
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

export default CheckStudentCourses;