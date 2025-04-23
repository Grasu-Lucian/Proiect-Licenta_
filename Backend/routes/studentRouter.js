const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/students', studentController.registerStudent);
router.post('/login', studentController.loginStudent);
module.exports = router;