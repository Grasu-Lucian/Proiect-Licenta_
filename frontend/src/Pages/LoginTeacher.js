import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginTeacher = () => {
  const [formData, setFormData] = useState({
    Email: '',
    Password: '',
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3307/api/teacher/login', formData);

      // Store the token and other details in localStorage
      const teacher_token = res.data.token;
      localStorage.setItem('teacher_token', teacher_token);
      localStorage.setItem('FirstName', res.data.FirstName);
      localStorage.setItem('LastName', res.data.LastName);
      localStorage.setItem('Email', res.data.Email);

      // Redirect to the teacher dashboard
      navigate('/teacher-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate(-1)} // Navigate back to the previous page
          className="text-blue-500 hover:text-blue-700 focus:outline-none"
        >
          ← Back
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Teacher Login</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <div className="mb-4">
          <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="Email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="Password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="Password"
            name="Password"
            value={formData.Password}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
            <p>{error}</p>
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginTeacher;