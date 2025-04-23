const Student = require('../models/studentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerStudent = async (req, res) => {
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

// Return the token and the new student object without the password
  return res.status(201).json({ token, FirstName: newStudent.FirstName, LastName: newStudent.LastName, Email: newStudent.Email });
};
const loginStudent = async (req, res) => {
    const { Email, Password } = req.body;
    // validate the request body
    if (!Email || !Password) {
      return res.status(400).json({ message: 'Please provide all the required fields' });
    }
    // Check if the student exists
    const existingStudent = await Student.findOne({ where: { Email } });
    if (!existingStudent) {
      return res.status(400).json({ message: 'Incorrect email or password' });
    }
    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(Password, existingStudent.Password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Incorrect email or password' });
    }
    // Generate a JWT token
    const token = jwt.sign(
      { userId: existingStudent.id }, // Payload
      process.env.JWT_SECRET, // Secret key
      {
        expiresIn: process.env.JWT_EXPIRATION,
        
      }
    );
    // Return the token and the existing student object
    return res.status(200).json({  message: 'Login successful',token});
  };
 
module.exports = {
    registerStudent,
    loginStudent,
    };