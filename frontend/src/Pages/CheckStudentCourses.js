import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CheckStudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [courseRatings, setCourseRatings] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCourseRatings = async (courseId) => {
    try {
      const token = localStorage.getItem('student_token');
      const response = await axios.get(`https://proiect-licenta-1.onrender.com/api/rating/${courseId}`, {
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
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem('student_token');
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await axios.get('https://proiect-licenta-1.onrender.com/api/enrolledcourses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
                  <h4 className="text-lg font-semibold mb-2">Course Ratings</h4>
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