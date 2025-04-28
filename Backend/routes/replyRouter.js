const express = require('express');
const router = express.Router();
const replyController = require('../controllers/replyController');
const { authMiddleware, authMiddlewareTeacher } = require('../middleware/authMiddleware');
// Create a new ticket
router.post('/reply/:id/student', authMiddleware, replyController.createStudentReply);
router.post('/reply/:id/teacher', authMiddlewareTeacher, replyController.createTeacherReply);

// Get all replies for a specific ticket
router.get('/reply/:id/student', authMiddleware, replyController.getAllReplies);
router.get('/reply/:id/teacher', authMiddlewareTeacher, replyController.getAllReplies);
module.exports = router;

