import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [courseRatings, setCourseRatings] = useState({});
  const [error, setError] = useState(null);

  const fetchCourseRatings = async (courseId) => {
    try {
      const token = localStorage.getItem('student_token');
      const response = await axios.get(`http://localhost:3307/api/rating/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      console.error(`Failed to fetch ratings for course ${courseId}:`, err);
      return [];
    }
  };

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

        // Simply check if we have valid data
        if (response.data && Array.isArray(response.data)) {
          setCourses(response.data);
          
          // Fetch ratings for each course
          const ratingsPromises = response.data.map(course => fetchCourseRatings(course.CourseID));
          const allRatings = await Promise.all(ratingsPromises);
          
          // Create an object mapping courseId to ratings
          const ratingsMap = {};
          response.data.forEach((course, index) => {
            ratingsMap[course.CourseID] = allRatings[index];
          });
          setCourseRatings(ratingsMap);
        } else {
          setCourses([]);
          setCourseRatings({});
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch courses');
        setCourses([]);
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

      await axios.post(`https://proiect-licenta-1.onrender.com/api/enroll/${courseId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCourses(courses.filter((course) => course.CourseID !== courseId));
      alert('Successfully enrolled in the course!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enroll in course');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>
      
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4 w-full max-w-4xl">
          {error}
        </div>
      )}

      <div className="w-full max-w-4xl">
        {!courses || courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-xl text-gray-600">No courses are available for enrollment at this time.</p>
            <p className="text-gray-500 mt-2">Please check back later for new course offerings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {courses.map((course) => (
              <div key={course.CourseID} className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-2xl font-semibold mb-4">{course.Title}</h3>
                
                {/* Course Description */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3">Description</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{course.CourseDescription}</p>
                  </div>
                </div>

                {/* Course Ratings Section */}
                <div className="mb-4">
                  <h4 className="text-md font-semibold mb-2">Course Ratings</h4>
                  {courseRatings[course.CourseID]?.length > 0 ? (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {courseRatings[course.CourseID].map((rating, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{rating.Username}</span>
                            <span className="text-yellow-500">{"★".repeat(rating.Rating)}</span>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">{rating.RatingDescription}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No ratings yet</p>
                  )}
                </div>

                <button
                  onClick={() => handleEnroll(course.CourseID)}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Enroll
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;