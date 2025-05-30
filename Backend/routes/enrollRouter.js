const express = require('express');
const router = express.Router();
const enrollController = require('../controllers/enrollController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/enroll/:id',authMiddleware, enrollController.EnrollStudent); // Enroll a student in a course
router.get('/enrolledcourses', authMiddleware, enrollController.GetEnrolledCourses); // Get all courses a student is enrolled in

module.exports = router;