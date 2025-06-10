import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../Components/Modal';

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [courseRatings, setCourseRatings] = useState({});
  const [error, setError] = useState(null);
  const [selectedCourseForDescription, setSelectedCourseForDescription] = useState(null);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [selectedCourseForRatings, setSelectedCourseForRatings] = useState(null);
  const [isRatingsModalOpen, setIsRatingsModalOpen] = useState(false);

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';  
  };

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
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('student_token');
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await axios.get('https://proiect-licenta-1.onrender.com/api/coursesforstudents', {
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
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {truncateText(course.CourseDescription)}
                      {course.CourseDescription.length > 100 && (
                        <button
                          onClick={() => {
                            setSelectedCourseForDescription(course);
                            setIsDescriptionModalOpen(true);
                          }}
                          className="ml-2 text-blue-500 hover:text-blue-600 font-medium"
                        >
                          Read More
                        </button>
                      )}
                    </p>
                  </div>
                </div>

                {/* Course Ratings Section */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-md font-semibold">Course Ratings</h4>
                    {courseRatings[course.CourseID]?.length > 0 && (
                      <button
                        onClick={() => {
                          setSelectedCourseForRatings(course);
                          setIsRatingsModalOpen(true);
                        }}
                        className="text-blue-500 hover:text-blue-600 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        title="View all ratings"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9.75 9.75M20.25 20.25v-4.5m0 4.5h-4.5m4.5 0L14.25 14.25M3.75 20.25h4.5m-4.5 0v-4.5m0 4.5L9.75 14.25M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L14.25 9.75" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {courseRatings[course.CourseID]?.length > 0 ? (
                    <>
                      <div className="space-y-2 max-h-20 overflow-y-auto">
                        {courseRatings[course.CourseID].slice(0, 2).map((rating, index) => ( // Show first 2 ratings
                          <div key={index} className="bg-gray-50 p-3 rounded">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{rating.Username}</span>
                              <span className="text-yellow-500">{"★".repeat(rating.Rating)}</span>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{rating.RatingDescription}</p>
                          </div>
                        ))}
                      </div>

                    </>
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

      {/* Description Modal */}
      <Modal
        isOpen={isDescriptionModalOpen}
        onClose={() => {
          setIsDescriptionModalOpen(false);
          setSelectedCourseForDescription(null);
        }}
      >
        {selectedCourseForDescription && (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{selectedCourseForDescription.Title}</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selectedCourseForDescription.CourseDescription}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Ratings Modal */}
      <Modal
        isOpen={isRatingsModalOpen}
        onClose={() => {
          setIsRatingsModalOpen(false);
          setSelectedCourseForRatings(null);
        }}
      >
        {selectedCourseForRatings && (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Ratings for {selectedCourseForRatings.Title}</h2>
            {courseRatings[selectedCourseForRatings.CourseID]?.length > 0 ? (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {courseRatings[selectedCourseForRatings.CourseID].map((rating, index) => (
                  <div key={index} className="bg-gray-100 p-4 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-800">{rating.Username}</span>
                      <span className="text-yellow-500 text-lg">{"★".repeat(rating.Rating)}</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{rating.RatingDescription}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 italic">No ratings available for this course.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentDashboard;