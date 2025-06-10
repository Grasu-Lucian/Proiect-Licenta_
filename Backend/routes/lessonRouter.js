const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const { authMiddlewareTeacher, authMiddleware } = require('../middleware/authMiddleware');

router.post('/lesson/:id', authMiddlewareTeacher, lessonController.CreateLesson);
router.get('/lessonsforteacher/:id', authMiddlewareTeacher, lessonController.GetAllLessonsForTeacher); // Get all lessons for a specific teacher
router.get('/lessonsforstudent/:id', authMiddleware, lessonController.GetAllLessonsStudents); // Get all lessons for a specific student
router.get('/lessonforteacher/:id', authMiddlewareTeacher, lessonController.GetLessonForTeacher); // Get a specific lesson for a specific teacher
router.get('/lessonforstudent/:id', authMiddleware, lessonController.GetLessonForStudent); // Get a specific lesson for a specific student
router.delete('/lesson/:id', authMiddlewareTeacher, lessonController.DeleteLesson); // Delete a specific lesson
router.put('/lesson/:id', authMiddlewareTeacher, lessonController.UpdateLesson); // Update a specific lesson

module.exports = router;


