import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-[86%] sm:w-full h-16 px-6 py-2 bg-gradient-to-r from-teal-500 to-blue-600 shadow-lg z-50 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-white">
        <span className="text-cyan-300">BrightPath</span>
      </Link>
      <div className="flex space-x-6 relative">
        {/* Login Dropdown */}
        <div className="group relative">
          <div className="text-white hover:text-cyan-300 font-semibold transition duration-300 cursor-pointer">
            Login
          </div>
          <div className="absolute right-0 top-full hidden group-hover:flex flex-col bg-white text-black shadow-lg rounded-lg w-40 py-2 text-center">
            <Link to="/login/student" className="px-4 py-2 hover:bg-gray-100"> As Student</Link>
            <Link to="/login/teacher" className="px-4 py-2 hover:bg-gray-100"> As Teacher</Link>
          </div>
        </div>

        {/* Register Dropdown */}
        <div className="group relative">
          <div className="text-white hover:text-cyan-300 font-semibold transition duration-300 cursor-pointer">
            Register
          </div>
          <div className="absolute right-0 top-full hidden group-hover:flex flex-col bg-white text-black shadow-lg rounded-lg w-40 py-2 text-center">
            <Link to="/register/student" className="px-4 py-2 hover:bg-gray-100">As Student</Link>
            <Link to="/register/teacher" className="px-4 py-2 hover:bg-gray-100">As Teacher</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;