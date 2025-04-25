const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const { authMiddlewareTeacher, authMiddleware } = require('../middleware/authMiddleware');

router.post('/lesson/:id', authMiddlewareTeacher, lessonController.CreateLesson);
router.get('/lessons/:id', authMiddlewareTeacher, lessonController.GetAllLessons);
router.get('/lesson/:lessonId', authMiddleware, lessonController.GetLesson); // Get a lesson by ID
module.exports = router;