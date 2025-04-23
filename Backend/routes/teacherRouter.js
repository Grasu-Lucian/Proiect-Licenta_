const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { authMiddlewareTeacher } = require('../middleware/authMiddleware');

// Routes for teacher operations
router.post('/teachers', teacherController.registerTeacher); // Register a new teacher
router.post('/login', teacherController.loginTeacher); // Login a teacher
router.get('/teacher', authMiddlewareTeacher, teacherController.getTeacher); // Get teacher profile
router.get('/teachers', authMiddlewareTeacher, teacherController.getAllTeachers); // Get all teachers
router.put('/teacher', authMiddlewareTeacher, teacherController.updateTeacher); // Update teacher profile
router.put('/teacher/password', authMiddlewareTeacher, teacherController.passwordChangeTeacher); // Change teacher password
router.delete('/teachers/profile', authMiddlewareTeacher, teacherController.deleteTeacher); // Delete teacher account

module.exports = router;