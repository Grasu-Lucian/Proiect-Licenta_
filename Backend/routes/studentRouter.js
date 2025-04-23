const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/students', studentController.registerStudent);
router.post('/login', studentController.loginStudent);
router.get('/student', authMiddleware, studentController.getStudent );
router.get('/students', authMiddleware, studentController.getAllStudents );
router.put('/student', authMiddleware, studentController.updateStudent );
router.put('/student/password', authMiddleware, studentController.PasswordChangeStudent );
module.exports = router;