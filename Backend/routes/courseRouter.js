const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authMiddlewareTeacher } = require('../middleware/authMiddleware');

router.post('/course', authMiddlewareTeacher, courseController.CreateCourse);

module.exports = router;