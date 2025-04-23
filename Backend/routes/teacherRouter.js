const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const authMiddlewareTeacher = require('../middleware/authMiddleware');

// Routes for teacher operations
router.post('/teachers', teacherController.registerTeacher); // Register a new teacher
router.post('/teachers/login', teacherController.loginTeacher); // Login a teacher
router.get('/teachers/profile', authMiddlewareTeacher, teacherController.getTeacher); // Get teacher profile
router.put('/teachers/profile', authMiddlewareTeacher, teacherController.updateTeacher); // Update teacher profile
router.delete('/teachers/profile', authMiddlewareTeacher, teacherController.deleteTeacher); // Delete teacher account

module.exports = router;