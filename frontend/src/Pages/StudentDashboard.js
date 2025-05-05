import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// student dashboard should have the available courses to get available  from here http://localhost:3307/api/coursesforstudents  student_token required for the link and the student_token is in  the locakstorage

const StudentDashboard = () => {

    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('student_token');
                if (!token) {
                    throw new Error('No token found. Please log in.');
                }

                const response = await axios.get('http://localhost:3307/api/coursesforstudents', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCourses(response.data);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'An error occurred while fetching courses.');
            }
        };

        fetchCourses();
    }, []);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
            {error && (
                <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
                    <p>{error}</p>
                </div>
            )}
            <ul className="space-y-4">
                {courses.map((course) => (
                    <li key={course.id} className="p-4 border rounded-md shadow bg-white">
                        <h2 className="text-lg font-bold mb-2">{course.Title}</h2>
                        <p className="text-gray-700 mb-2">{course.CourseDescription}</p>
                        {/* the button will enroll you to the course by doing a post request to the http://localhost:3307/api/enroll/:courseId also add the bearer token of the student as well*/}
                        <button
                            onClick={async () => {
                                try {
                                    const token = localStorage.getItem('student_token');
                                    if (!token) {
                                        throw new Error('No token found. Please log in.');
                                    }

                                    const response = await axios.post(`http://localhost:3307/api/enroll/${course.CourseID}`, {}, {
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    });
                                    alert("Succesfully enrolled in the course"); // Show success message
                                } catch (err) {
                                    alert(err.response?.data?.message || err.message || 'An error occurred while enrolling in the course.');
                                }
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Enroll in the Course
                        </button>
                    </li>
                ))}
            </ul>

        </div>
    );
};




export default StudentDashboard;