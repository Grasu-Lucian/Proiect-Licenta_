const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authMiddlewareTeacher, authMiddleware } = require('../middleware/authMiddleware');

router.post('/course', authMiddlewareTeacher, courseController.CreateCourse);
router.get('/courseforteacher/:id', authMiddlewareTeacher, courseController.GetTeacherCourse);
//get all courses for the teacher
router.get('/coursesforteacher', authMiddlewareTeacher, courseController.GetTeacherCourses);
// publish course
router.put('/course/:id', authMiddlewareTeacher, courseController.PublishCourse);
router.get('/coursesforstudents', authMiddleware, courseController.getCoursesforStudents);
module.exports = router;