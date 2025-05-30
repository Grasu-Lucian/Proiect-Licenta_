import React, { useEffect } from 'react';
import Navbar from '../Components/Navbar';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Homepage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS with a 1-second animation duration

    // Disable scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <div className="w-full">
      <Navbar />

      {/* First Section */}
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 px-4 text-center">
        <h1
          className="text-5xl font-extrabold text-white mb-6 flex items-center space-x-3"
          data-aos="fade-up"
        >
          <span>Welcome to BrightPath</span>
        </h1>
        <p
          className="text-xl text-gray-100 mb-8 max-w-3xl"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          BrightPath is a platform designed to make learning a more pleasurable and engaging experience. 
          Our goal is to build a community dedicated to learning, where students and teachers 
          can connect, share knowledge, and grow together.
        </p>
      </div>

      {/* Second Section */}
      <div className="flex flex-col items-center justify-center h-screen bg-white text-black px-6 text-center">
        <h2
          className="text-4xl font-bold mb-6"
          data-aos="fade-right"
        >
          How Our Courses Work
        </h2>
        <p
          className="text-lg max-w-4xl mx-auto"
          data-aos="fade-right"
          data-aos-delay="200"
        >
          Our courses are designed to provide a structured and engaging learning experience. 
          Each course is divided into lessons. You can learn at your own pace, track your progress, 
          and achieve your goals. Whether you're a beginner or looking to advance your skills, 
          our courses are tailored to meet your needs.
        </p>
      </div>

      {/* Third Section */}
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-600 via-pink-500 to-red-400 px-4 text-center">
        <h2
          className="text-4xl font-bold text-white mb-6"
          data-aos="fade-left"
        >
          Join Our Community
        </h2>
        <p
          className="text-lg text-gray-100 mb-8 max-w-3xl"
          data-aos="fade-left"
          data-aos-delay="200"
        >
          Become a part of BrightPath today! Whether you're a student eager to learn or a teacher 
          passionate about sharing knowledge, we have a place for you. Join us and start your journey 
          toward a brighter future.
        </p>
        <div className="flex space-x-4">
          <button
            className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700"
            data-aos="fade-left"
            data-aos-delay="400"
          >
            Join as a Student
          </button>
          <button
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
            data-aos="fade-left"
            data-aos-delay="600"
          >
            Join as a Teacher
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;