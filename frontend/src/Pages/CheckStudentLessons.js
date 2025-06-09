import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CheckStudentLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState(null);
  const { courseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessonsAndProgress = async () => {
      try {
        const token = localStorage.getItem('student_token');
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        // Fetch lessons with progress for the course
        const response = await axios.get(`https://proiect-licenta-1.onrender.com/api/lessonsforstudent/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          // Sort lessons by their order or ID
          const sortedLessons = response.data.sort((a, b) => 
            a.LessonOrder - b.LessonOrder || a.LessonID - b.LessonID
          );
          
          setLessons(sortedLessons);
        } else {
          setLessons([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch lessons');
        setLessons([]);
      }
    };

    fetchLessonsAndProgress();
  }, [courseId]);

  const startLesson = (lessonId) => {
    navigate(`/student/lesson/${lessonId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-6">Course Lessons</h1>
      
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4 w-full max-w-4xl">
          {error}
        </div>
      )}

      <div className="w-full max-w-4xl">
        {!lessons || lessons.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-xl text-gray-600">No lessons available for this course yet.</p>
            <p className="text-gray-500 mt-2">Please check back later for new lessons.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <div 
                key={lesson.LessonID} 
                className={`rounded-lg shadow-md p-6 ${lesson.seen ? 'bg-green-50' : 'bg-white'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{lesson.Title}</h3>
                    <p className="text-gray-600">{lesson.Description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {lesson.seen && (
                      <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => startLesson(lesson.LessonID)}
                    className={`w-full px-4 py-2 rounded-md transition-colors ${
                      lesson.seen
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {lesson.seen ? 'Review Lesson' : 'Start Lesson'}
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

export default CheckStudentLessons;
