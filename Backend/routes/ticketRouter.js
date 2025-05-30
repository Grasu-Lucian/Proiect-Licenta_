const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { authMiddleware, authMiddlewareTeacher } = require('../middleware/authMiddleware');
// Create a new ticket
router.post('/ticket/:id', authMiddleware, ticketController.createTicket);
router.get('/ticket/:id/student', authMiddleware, ticketController.getTicket);
router.get('/ticket/:id/teacher', authMiddlewareTeacher, ticketController.getTicket);
router.put('/ticket/:id/status', authMiddleware, ticketController.updateTicketStatus);
// Get all tickets for a student
router.get('/tickets/student', authMiddleware, ticketController.getAllStudentTickets);
// Get all tickets for a teacher
router.get('/tickets/teacher', authMiddlewareTeacher, ticketController.getAllTeacherTickets);
module.exports = router;
