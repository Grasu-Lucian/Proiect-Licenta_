const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { authMiddleware, authMiddlewareTeacher } = require('../middleware/authMiddleware');
// Create a new ticket
router.post('/ticket/:id', authMiddleware, ticketController.createTicket);
// Create a new ticket reply for student
router.post('/ticket/:id/reply', authMiddleware, ticketController.createTicketStudentReply);
// Create a new ticket reply for teacher
router.post('/ticket/:id/replyteacher', authMiddlewareTeacher, ticketController.createTicketTeacherReply);
router.get('/ticket/:id/student', authMiddleware, ticketController.getTicket);
router.get('/tickets/:id/student', authMiddleware, ticketController.getAllTickets);
router.get('/ticket/:id/teacher', authMiddlewareTeacher, ticketController.getTicket);
router.get('/tickets/:id/teacher', authMiddlewareTeacher, ticketController.getAllTickets);
router.get('/tickets/student', authMiddleware, ticketController.getAllTicketsStudent);
router.get('/tickets/teacher', authMiddlewareTeacher, ticketController.getAllTicketsTeacher);
module.exports = router;
