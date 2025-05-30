const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const {  authMiddleware } = require('../middleware/authMiddleware');


router.post('/rating/:id', authMiddleware, ratingController.createRating); // Create a rating for a course

router.get('/rating/:id', authMiddleware, ratingController.getAllRatings); // Get all ratings for a course

module.exports = router;