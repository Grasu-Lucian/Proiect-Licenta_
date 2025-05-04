import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NavbarTeacher = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Retrieve the user's first and last name from localStorage
    const firstName = localStorage.getItem('FirstName');
    const lastName = localStorage.getItem('LastName');
    if (firstName && lastName) {
      setUserName(`${firstName} ${lastName}`);
    }
  }, []);

  return (
    <nav className="bg-blue-500 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Home Button */}
        <span
          onClick={() => navigate('/teacher-dashboard')}
          className="text-white text-lg cursor-pointer transition-all duration-300 hover:[text-shadow:0_0_20px_rgba(255,255,255,1),0_0_30px_rgba(255,255,255,0.8)]"
        >
          Home
        </span>

        {/* Profile Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <span className="text-white text-lg cursor-pointer transition-all duration-300 hover:[text-shadow:0_0_20px_rgba(255,255,255,1),0_0_30px_rgba(255,255,255,0.8)]">
            Profile
          </span>
          {isDropdownOpen && (
            <div className="absolute right-0 bg-white rounded-md shadow-lg w-40 z-50">
              {/* Welcome Message */}
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 font-bold cursor-default"
                disabled
              >
                Welcome, {userName || 'Loading...'}
              </button>
              <hr className="border-gray-300" />
              {/* Create a Course Button */}
              <button
                onClick={() => navigate('/create-course')}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Create a Course
              </button>
              {/* Check Courses Button */}
              <button
                onClick={() => navigate('/check-courses')}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Check Courses
              </button>
              <hr className="border-gray-300" />
              {/* Settings Button */}
              <button
                onClick={() => navigate('/settings')}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Settings
              </button>
              {/* Logout Button */}
              <button
                onClick={() => navigate('/logout')}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarTeacher;