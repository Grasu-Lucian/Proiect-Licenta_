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

const createTicketStudentReply = async (req, res) => {
    const { TicketDescription} = req.body;
    // Validate the request body
    if (!TicketDescription) {
      return res.status(400).json({ message: 'Please provide all the required fields' });
    }
    FKStudentID = req.userId;
    const TicketID = req.params.id;
    //title will be the name of the student 
    const student = await Student.findByPk(FKStudentID);
    if (!student) {
        return res.status(400).json({ message: 'Student not found' });
    }
    // Create a new ticket
    const newTicket = await Ticket.create({
      Title: student.FirstName + ' ' + student.LastName,
      TicketDescription,
      FKStudentID,
      FKTicketID: TicketID,
    });
    return res.status(201).json(newTicket);

}

const createTicketTeacherReply = async (req, res) => {
    const { TicketDescription} = req.body;
    // Validate the request body
    if (!TicketDescription) {
      return res.status(400).json({ message: 'Please provide all the required fields' });
    }
    FKTeacherID = req.userId;
    const TicketID = req.params.id;
    //title will be the name of the teacher 
    const teacher = await Teacher.findByPk(FKTeacherID);
    if (!teacher) {
        return res.status(400).json({ message: 'Teacher not found' });
    }
    // Create a new ticket
    const newTicket = await Ticket.create({
      Title: teacher.FirstName + ' ' + teacher.LastName,
      TicketDescription,
      FKTeacherID,
      FKTicketID: TicketID,
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
const getAllTickets = async (req, res) => {
    // Get all tickets for the course
    const tickets = await Ticket.findAll({ where: { FKTicketID: req.params.id } });
    if (!tickets) {
        return res.status(404).json({ message: 'No tickets found' });
    }
    // Return the tickets object
    return res.status(200).json(tickets);
};

const getAllTicketsStudent = async (req, res) => {
    // Get all tickets where the student is the fk and the FKticket id is null
    const tickets = await Ticket.findAll({ where: { FKStudentID: req.userId, FKTicketID: null } });
    if (!tickets) {
        return res.status(404).json({ message: 'No tickets found' });
    }
    // Return the tickets object
    return res.status(200).json(tickets);
}
const getAllTicketsTeacher = async (req, res) => {
    // Get all tickets where the teacher is the fk and the FKticket id is null
    const tickets = await Ticket.findAll({ where: { FKTeacherID: req.userId, FKTicketID: null } });
    if (!tickets) {
        return res.status(404).json({ message: 'No tickets found' });
    }
    // Return the tickets object
    return res.status(200).json(tickets);
}


module.exports = {
    createTicket,
    createTicketStudentReply,
    createTicketTeacherReply,
    getTicket,
    getAllTickets,
    getAllTicketsStudent,
    getAllTicketsTeacher,
};