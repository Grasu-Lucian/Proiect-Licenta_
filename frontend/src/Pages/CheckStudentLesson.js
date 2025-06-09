import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CheckStudentLesson = () => {
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingDescription, setRatingDescription] = useState('');
  const { lessonId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const token = localStorage.getItem('student_token');
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        // Get current lesson details
        const lessonResponse = await axios.get(`https://proiect-licenta-1.onrender.com/api/lessonforstudent/${lessonId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (lessonResponse.data) {
          setLesson(lessonResponse.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch lesson');
      }
    };

    fetchLesson();
  }, [lessonId]);

  const handleNext = async () => {
    try {
      const token = localStorage.getItem('student_token');
      if (!token) throw new Error('No token found');

      try {
        // 1. Try to mark current lesson as seen
        await axios.post(`https://proiect-licenta-1.onrender.com/api/seen/${lessonId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (seenError) {
        // If error is "already seen", silently continue
        if (seenError.response?.data?.message !== "You have already seen this lesson") {
          throw seenError;
        }
      }

      // 2. Get current lesson to get course ID
      const currentLessonResponse = await axios.get(`https://proiect-licenta-1.onrender.com/api/lessonforstudent/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!currentLessonResponse.data || !currentLessonResponse.data.FKCourseID) {
        throw new Error('Could not get course ID');
      }

      const courseId = currentLessonResponse.data.FKCourseID;

      // 3. Get all lessons for this course
      const courseLessonsResponse = await axios.get(`https://proiect-licenta-1.onrender.com/api/lessonsforstudent/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!courseLessonsResponse.data || !Array.isArray(courseLessonsResponse.data)) {
        throw new Error('Could not get course lessons');
      }

      // 4. Sort lessons by lesson number
      const lessons = courseLessonsResponse.data.sort((a, b) => a.LessonNumber - b.LessonNumber);

      // 5. Find current lesson's index
      const currentIndex = lessons.findIndex(l => l.LessonID.toString() === lessonId);

      if (currentIndex === -1) {
        throw new Error('Current lesson not found in course');
      }

      // 6. Check if there's a next lesson
      if (currentIndex < lessons.length - 1) {
        // Navigate to next lesson
        const nextLessonId = lessons[currentIndex + 1].LessonID;
        navigate(`/student/lesson/${nextLessonId}`);
      } else {
        // This is the last lesson, show rating modal
        setShowRatingModal(true);
      }

    } catch (err) {
      console.error('Navigation error:', err);
      setError(err.message || 'Failed to navigate to next lesson');
    }
  };

  const handleRatingSubmit = async () => {
    try {
      const token = localStorage.getItem('student_token');
      await axios.post(`https://proiect-licenta-1.onrender.com/api/rating/${lesson.FKCourseID}`, {
        Rating: rating,
        RatingDescription: ratingDescription
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate(`/student/course/${lesson.FKCourseID}/lessons`);
    } catch (err) {
      setError('Failed to submit rating');
    }
  };

  if (!lesson) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex-1 px-4 py-8">
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4 max-w-4xl mx-auto">
            {error}
          </div>
        )}

        <div className="max-w-4xl mx-auto w-full bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{lesson.Title}</h1>
            <p className="text-gray-600 text-lg mb-4">{lesson.Description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
              <div>
                <span className="font-semibold">Chapter:</span> {lesson.LessonNumber}
              </div>
              {lesson.PdfContent && (
                <div>
                  <span className="font-semibold">PDF Content:</span> Available
                </div>
              )}
            </div>
          </div>

          <div className="prose max-w-none mb-8 bg-gray-50 p-6 rounded-lg">
            <div dangerouslySetInnerHTML={{ __html: lesson.Content }} />
          </div>

          {lesson.PdfContent && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">PDF Content</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div dangerouslySetInnerHTML={{ __html: lesson.PdfContent }} />
              </div>
            </div>
          )}

          <div className="border-t pt-6 mt-8">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">Something not clear?</p>
              <button
                onClick={() => navigate(`/student/course/${lesson?.FKCourseID}/open-ticket`)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Open a Ticket
              </button>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Next Lesson
            </button>
          </div>
        </div>
      </div>

      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
            <p className="mb-6">You've completed the course! Would you like to rate it?</p>
            
            <div className="flex justify-center mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl mx-1 ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Share your thoughts about the course
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="This course was very informative and well-structured!"
                value={ratingDescription}
                onChange={(e) => setRatingDescription(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => navigate(`/student/course/${lesson.FKCourseID}/lessons`)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Skip
              </button>
              <button
                onClick={handleRatingSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                disabled={rating === 0}
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckStudentLesson;