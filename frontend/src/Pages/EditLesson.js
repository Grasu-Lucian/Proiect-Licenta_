import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditLesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [lesson, setLesson] = useState({
    Title: '',
    Description: '',
  });

  // Fetch lesson details when component mounts
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const token = localStorage.getItem('teacher_token');
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await axios.get(`http://localhost:3307/api/lessonforteacher/${lessonId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLesson(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'An error occurred while fetching the lesson.');
      }
    };

    fetchLesson();
  }, [lessonId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('teacher_token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      await axios.put(`http://localhost:3307/api/lesson/${lessonId}`, lesson, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Navigate back to the lessons page
      navigate(-1);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred while updating the lesson.');
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLesson(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Lesson</h1>

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="Title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="Title"
            name="Title"
            value={lesson.Title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="Description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="Description"
            name="Description"
            value={lesson.Description}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>



        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Update Lesson
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLesson;
