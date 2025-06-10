import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
  const [userType, setUserType] = useState(null); // 'student' or 'teacher'
  const [userData, setUserData] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const determineUserTypeAndFetchData = async () => {
      const studentToken = localStorage.getItem('student_token');
      const teacherToken = localStorage.getItem('teacher_token');
      let token = null;
      let type = null;
      let fetchUrl = '';

      if (studentToken) {
        token = studentToken;
        type = 'student';
        // Replace with actual student profile fetch URL
        fetchUrl = 'http://localhost:3307/api/student'; 
      } else if (teacherToken) {
        token = teacherToken;
        type = 'teacher';
        // Replace with actual teacher profile fetch URL
        fetchUrl = 'http://localhost:3307/api/teacher'; 
      }

      if (!token) {
        setError('No user token found. Please log in.');
        setLoading(false);
        return;
      }

      setUserType(type);

      try {
        const response = await axios.get(fetchUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Assuming the API returns user data directly or within a 'user' or 'data' object
        const fetchedData = response.data.user || response.data; 
        setUserData({
          FirstName: fetchedData.FirstName || '',
          LastName: fetchedData.LastName || '',
          Email: fetchedData.Email || '',
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || `Failed to fetch user data for ${type}.`);
        setLoading(false);
      }
    };

    determineUserTypeAndFetchData();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');
    setLoading(true);

    const studentToken = localStorage.getItem('student_token');
    const teacherToken = localStorage.getItem('teacher_token');
    let token = null;
    let updateUrl = '';

    if (userType === 'student' && studentToken) {
      token = studentToken;
      // Replace with actual student profile update URL
      updateUrl = 'http://localhost:3307/api/student'; 
    } else if (userType === 'teacher' && teacherToken) {
      token = teacherToken;
      // Replace with actual teacher profile update URL
      updateUrl = 'http://localhost:3307/api/teacher'; 
    }

    if (!token || !updateUrl) {
      setError('Cannot update profile. User type or token is missing.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        FirstName: userData.FirstName,
        LastName: userData.LastName,
        Email: userData.Email,
      };
      await axios.put(updateUrl, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage('Profile updated successfully!');
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (!passwordData.currentPassword || !passwordData.newPassword) {
        setError('All password fields are required.');
        return;
    }

    setLoading(true);

    const studentToken = localStorage.getItem('student_token');
    const teacherToken = localStorage.getItem('teacher_token');
    let token = null;
    let passwordUpdateUrl = '';

    if (userType === 'student' && studentToken) {
      token = studentToken;
      passwordUpdateUrl = 'http://localhost:3307/api/student/password';
    } else if (userType === 'teacher' && teacherToken) {
      token = teacherToken;
      passwordUpdateUrl = 'http://localhost:3307/api/teacher/password';
    }

    if (!token || !passwordUpdateUrl) {
      setError('Cannot update password. User type or token is missing.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        OldPassword: passwordData.currentPassword,
        NewPassword: passwordData.newPassword,
      };
      await axios.put(passwordUpdateUrl, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); // Clear fields
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
      setLoading(false);
    }
  };

  if (loading && !userData.Email) { // Show loading only on initial load
    return <div className="flex justify-center items-center min-h-screen"><p className="text-xl">Loading settings...</p></div>;
  }

  if (error && !userData.Email) { // Show error if initial load failed
    return <div className="flex justify-center items-center min-h-screen"><p className="text-red-500">Error: {error}</p></div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          User Settings
        </h1>
        <p className="text-center text-gray-600 mb-8">Manage your profile details and password </p>

        {error && <p className="text-red-500 text-center mb-4 bg-red-100 p-3 rounded-md">Error: {error}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4 bg-green-100 p-3 rounded-md">{successMessage}</p>}

        {/* Profile Update Form */}
        <form onSubmit={handleProfileSubmit} className="space-y-6 mb-10 border-b pb-10">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Update Profile Information</h2>
          <div>
            <label htmlFor="FirstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="FirstName"
              id="FirstName"
              value={userData.FirstName}
              onChange={handleProfileChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="LastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="LastName"
              id="LastName"
              value={userData.LastName}
              onChange={handleProfileChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="Email"
              id="Email"
              value={userData.Email}
              onChange={handleProfileChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>

        {/* Password Change Form */}
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Change Password</h2>
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input 
              type="password" 
              name="currentPassword" 
              id="currentPassword" 
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required 
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input 
              type="password" 
              name="newPassword" 
              id="newPassword" 
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required 
            />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input 
              type="password" 
              name="confirmNewPassword" 
              id="confirmNewPassword" 
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required 
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
