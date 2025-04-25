const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const { authMiddlewareTeacher, authMiddleware } = require('../middleware/authMiddleware');

router.post('/lesson/:id', authMiddlewareTeacher, lessonController.CreateLesson);

module.exports = router;