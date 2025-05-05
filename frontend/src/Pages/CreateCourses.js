import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCourses = () => {
  const [formData, setFormData] = useState({
    Title: '',
    CourseDescription: '',
    Price: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('teacher_token'); // Retrieve the token from localStorage
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const response = await axios.post(
        'http://localhost:3307/api/course',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        }
      );

      setSuccess('Course created successfully!');
      setError(null);
      setFormData({ Title: '', CourseDescription: '', Price: '' }); // Reset the form
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred while creating the course.');
      setSuccess(null);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create a Course</h1>
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">
          <p>{success}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md">
        <div className="mb-4">
          <label htmlFor="Title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="Title"
            name="Title"
            value={formData.Title}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="CourseDescription" className="block text-sm font-medium text-gray-700">
            Course Description
          </label>
          <textarea
            id="CourseDescription"
            name="CourseDescription"
            value={formData.CourseDescription}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="Price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            id="Price"
            name="Price"
            value={formData.Price}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Create Course
        </button>
      </form>
      <button
        onClick={() => navigate('/check-courses')}
        className="mt-4 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
      >
        Back to Courses
      </button>
    </div>
  );
};

export default CreateCourses;