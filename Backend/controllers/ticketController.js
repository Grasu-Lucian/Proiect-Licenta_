const Ticket = require('../models/ticketModel');
const Course = require('../models/courseModel');
const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');
const Enrolled = require('../models/enrolledModel');


const createTicket = async (req, res) => {
  const { Title, TicketDescription} = req.body;
  // Validate the request body
  if (!Title || !TicketDescription) {
    return res.status(400).json({ message: 'Please provide all the required fields' });
  }
  // Check if the course exists
  const course = await Course.findByPk(req.params.id);
  if (!course) {
    return res.status(400).json({ message: 'Course not found' });
  }
  //extract from the course the FKTeacherID
  const FKTeacherID = course.FKTeacherID;
  // check if the student is enrolled in the course
  const FKStudentID = req.userId;
  const FKCourseID = req.params.id;
   // Assuming the user ID is stored in req.userId after authentication
  // Check if the student is enrolled in the course
  const enrolledStudent = await Enrolled.findOne({ where: {  FKStudentID, FKCourseID } });
  if (!enrolledStudent) {
    return res.status(400).json({ message: 'You are not enrolled in this course' });
  }

  // Create a new ticket   use the req.userID from the token to get the FKStudentID
  const newTicket = await Ticket.create({
    Title,
    TicketDescription,
    FKStudentID,
    FKTeacherID,
    FKCourseID,
  });
  return res.status(201).json(newTicket);
}



const getTicket = async (req, res) => {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
    }
    // Return the ticket object
    return res.status(200).json(ticket);
}

const getAllStudentTickets = async (req, res) => {
    const studentId = req.userId; // Assuming the user ID is stored in req.userId after authentication
    const tickets = await Ticket.findAll({ where: { FKStudentID: studentId } });
    return res.status(200).json(tickets);
}

const getAllTeacherTickets = async (req, res) => {
    const teacherId = req.userId; // Assuming the user ID is stored in req.userId after authentication
    const tickets = await Ticket.findAll({ where: { FKTeacherID: teacherId } });
    return res.status(200).json(tickets);
}

const updateTicketStatus = async (req, res) => {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
    }
    // update the ticket status to closed
    ticket.Status = 'closed';
    await ticket.save();
    return res.status(200).json(ticket);
}


module.exports = {
    createTicket,
    getTicket,
    getAllStudentTickets,
    getAllTeacherTickets,
    updateTicketStatus,
};