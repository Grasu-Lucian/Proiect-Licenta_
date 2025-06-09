import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CheckCourses = () => {
  const [courses, setCourses] = useState([]); // Stores the list of courses
  const [error, setError] = useState(null); // Stores any error messages
  const navigate = useNavigate();

  // Fetch courses when the component mounts
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
        console.log(response.data); // Log the response data for debugging
        setError(null); // Clear any previous errors
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'An error occurred while fetching courses.');
      }
    };

    fetchCourses();
  }, []);

  // Function to make a course public
  const makeCoursePublic = async (courseId) => {
    try {
      const token = localStorage.getItem('teacher_token'); // Retrieve the token from localStorage
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      await axios.put(`http://localhost:3307/api/course/${courseId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      });

      // Update the course status locally after making it public
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId ? { ...course, CourseStatus: 'public' } : course
        )
      );
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred while updating the course.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Courses</h1>

      {/* Display error message if any */}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Display message if no courses are found */}
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

      {/* Display the list of courses */}
      <ul className="space-y-4">
        {courses.map((course) => (
          <li key={course.id} className="p-4 border rounded-md shadow bg-white">
            <h2 className="text-lg font-bold mb-2">{course.Title}</h2>
            <p className="text-gray-700 mb-2">{course.CourseDescription}</p>
            <p className="text-gray-500 font-semibold">Price: ${course.Price}</p>
            <p className="text-gray-500 font-semibold">Status: {course.CourseStatus}</p>
            {course.CourseStatus === 'private' && (
              <button
                onClick={() => makeCoursePublic(course.CourseID)}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Make Public
              </button>
            )}
            {/* Check Lessons Button */}
            <button
              onClick={() => navigate(`/check-lessons/${course.CourseID}`)} // Navigate to the Check Lessons page with the course ID
              className="mt-2 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
            >
              Check Lessons
            </button>
            {/* Delete Course Button */}
            <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem('teacher_token'); // Retrieve the token from localStorage
                  if (!token) {
                    throw new Error('No token found. Please log in.');
                  }

                  // Send DELETE request to the API
                  await axios.delete(`https://proiect-licenta-1.onrender.com/api/course/${course.CourseID}`, {
                    headers: {
                      Authorization: `Bearer ${token}`, // Add the token to the Authorization header
                    },
                  });

                  // Remove the course from the local state
                  setCourses((prevCourses) => prevCourses.filter((c) => c.CourseID !== course.CourseID));
                  alert('Course deleted successfully!');
                } catch (err) {
                  alert(err.response?.data?.message || err.message || 'An error occurred while deleting the course.');
                }
              }}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Delete Course
            </button>
          </li>
        ))}
      </ul>

      {/* Button to add another course */}
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