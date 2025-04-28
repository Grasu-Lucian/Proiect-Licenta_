const express = require('express');
const router = express.Router();
const seenController = require('../controllers/seenController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Create a new seen record
router.post('/seen/:id', authMiddleware, seenController.createSeen);

// Get all seen records for a specific course
router.get('/seen/:id', authMiddleware, seenController.getAllSeen);

module.exports = router;