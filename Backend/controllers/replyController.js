const Reply = require('../models/replyModel');
const Ticket = require('../models/ticketModel');
const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');

const createStudentReply = async (req, res) => {
  const { ReplyText } = req.body;
 const FKTicketID = req.params.id; // Assuming the ticket ID is passed in the URL
  const studentId = req.userId; // Assuming the user ID is stored in req.userId after authentication
 // search for the student in the database
  const student = await Student.findByPk(studentId);
  if (!student) {
    return res.status(400).json({ message: 'Student not found' });
  }
// Check if the ticket exists
  const ticket = await Ticket.findByPk(FKTicketID);
  if (!ticket) {
    return res.status(400).json({ message: 'Ticket not found' });
  }
  // create the ticket reply
  const newReply = await Reply.create({
    FKTicketID,
    Username: student.FirstName + ' ' + student.LastName,
    ReplyText,
  });
  return res.status(201).json(newReply);
};

const createTeacherReply = async (req, res) => {
  const { ReplyText } = req.body;
  const FKTicketID = req.params.id; // Assuming the ticket ID is passed in the URL
  const teacherId = req.userId; // Assuming the user ID is stored in req.userId after authentication
  // search for the teacher in the database
  const teacher = await Teacher.findByPk(teacherId);
  if (!teacher) {
    return res.status(400).json({ message: 'Teacher not found' });
  }
  // Check if the ticket exists
  const ticket = await Ticket.findByPk(FKTicketID);
  if (!ticket) {
    return res.status(400).json({ message: 'Ticket not found' });
  }
  // create the ticket reply
  const newReply = await Reply.create({
    FKTicketID,
    Username: teacher.FirstName + ' ' + teacher.LastName,
    ReplyText,
  });
  return res.status(201).json(newReply);
};


const getAllReplies = async (req, res) => {
    const FKTicketID = req.params.id;
    const replies = await Reply.findAll({ where: { FKTicketID } });
    return res.status(200).json(replies);
};  

module.exports = {
    createStudentReply,
    createTeacherReply,
    getAllReplies,
};




