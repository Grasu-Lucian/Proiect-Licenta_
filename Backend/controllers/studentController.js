const Student = require('../models/studentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createStudent = async (req, res) => {
  const { FirstName, LastName, Email, Password } = req.body;
// validate the request body
  if (!FirstName || !LastName || !Email || !Password) {
    return res.status(400).json({ message: 'Please provide all the required fields' });
  }
// Validate the Email
  if (!Email.includes('@')) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }
// Check if the student already exists
  const existingStudent = await Student.findOne({ where: { Email } });
  if (existingStudent) {
    return res.status(400).json({ message: 'A student with that email already exists' });
  }

// Hash the password
  const hashedPassword = await bcrypt.hash(Password, 10);
// Create a new student
  const newStudent = await Student.create({
    FirstName,
    LastName,
    Email,
    Password: hashedPassword,
  });
// Generate a JWT token
  const token = jwt.sign(
    { userId: newStudent.id }, // Payload
    process.env.JWT_SECRET, // Secret key
    {
      expiresIn: process.env.JWT_EXPIRATION,
      
    }
  );

// Return the token and the new student object
  return res.status(201).json({ token, newStudent });
};

module.exports = {
    createStudent,
    };