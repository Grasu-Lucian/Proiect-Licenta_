const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/students', studentController.registerStudent);
router.post('/login', studentController.loginStudent);
router.get('/students', authMiddleware, studentController.getStudent );
module.exports = router;