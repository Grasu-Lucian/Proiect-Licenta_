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
  // get the student id from the backend because we don't have the id in the newStudent object
  //search it in the database
  const student = await Student.findOne({ where: { Email } });


// Generate a JWT token
  const token = jwt.sign(
    { userId: student.StudentID }, // Payload
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
    // get the student id from the backend because we don't have the id in the newStudent object
    //search it in the database
    const student = await Student.findOne({ where: { Email } });
    
    // Generate a JWT token
    const token = jwt.sign(
      { userId: student.StudentID }, // Payload
      process.env.JWT_SECRET, // Secret key
      {
        expiresIn: process.env.JWT_EXPIRATION,
        
      }
    );
    // Return the token and the existing student object
    return res.status(200).json({  message: 'Login successful',token});
  };
const getStudent = async (req, res) => {
    // seach for the student with the given id
    const student = await Student.findByPk(req.userId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    // Return the student object without the password
    return res.status(200).json({ FirstName: student.FirstName, LastName: student.LastName, Email: student.Email });
  };

  const getAllStudents = async (req, res) => {
    // Search for all the students
    const students = await Student.findAll();
    if (!students) {
      return res.status(404).json({ message: 'No students found' });
    }
    // show students with the password
    // filter password from the students array
    const AllowedFields = ['StudentID', 'FirstName', 'LastName', 'Email'];
    const sanitizedStudents = students.map(student =>
      Object.fromEntries(
        Object.entries(student.toJSON()).filter(([key]) => AllowedFields.includes(key))
      )
    );
    

    // Return the students array
    return res.status(200).json(sanitizedStudents);
  };
//update student email, name, password
  const updateStudent = async (req, res) => {
    const { Email, FirstName, LastName} = req.body;
    //use authmiddleware id to search for the student
    const existingStudent = await Student.findByPk(req.userId);
    if (!existingStudent) {
      return res.status(400).json({ message: 'The student does not exist' });
    }
    // validate the request body
   if( !Email ) {return res.status(400).json({ message: 'Please provide an email' }); }
   // check if the existing user has the same email as the new one
   if (existingStudent.Email === Email) {
     return res.status(400).json({ message: 'you already have that email' });
   }
   //check if there is someone else besides you with the same email you want to change  but that is not you
   const otherStudent = await Student.findOne({ where: { Email } });
   if (otherStudent && otherStudent.StudentID !== req.userId) {
     return res.status(400).json({ message: 'there is someone else with that email' });
   }
   //check if someone elese is using the email or if you insertetd the same email as before
  if (!FirstName) { return res.status(400).json({ message: 'Please provide a first name' }); }
  if (!LastName) { return res.status(400).json({ message: 'Please provide a last name' }); }

  // Update the student
  const updatedStudent = await Student.update(
    { Email, FirstName, LastName },
    { where: { StudentID: req.userId } }
  );
  if (!updatedStudent) {
    return res.status(400).json({ message: 'There was an error updating the student' });
  }
  // Return the updated student object
  return res.status(200).json({ message: 'Student updated successfully' , Email, FirstName, LastName });
};

 const PasswordChangeStudent = async (req, res) => {
   const {  OldPassword, NewPassword } = req.body;
  // validate the request body
  if (!OldPassword || !NewPassword) {
    return res.status(400).json({ message: 'Please provide all the required fields' });
  }
  // use the req.id to search for the student
  const existingStudent = await Student.findByPk(req.userId);
  if (!existingStudent) {
    return res.status(400).json({ message: 'The student does not exist' });
  }
  // Check if the password is correct
  const isPasswordCorrect = await bcrypt.compare(OldPassword, existingStudent.Password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: 'Incorrect password' });
  }
  // Hash the new password
  const hashedPassword = await bcrypt.hash(NewPassword, 10);
  // Update the password
  const updatedStudent = await Student.update(
    { Password: hashedPassword },
    { where: { StudentID: req.userId } }
  );
  if (!updatedStudent) {
    return res.status(400).json({ message: 'There was an error updating the password' });
  }
  // Return the updated student object
  return res.status(200).json({ message: 'Password updated successfully' });
// validate the old passwrod then change it to the new password
  }
    
module.exports = {
    registerStudent,
    loginStudent,
    getStudent,
    getAllStudents,
    updateStudent,
    PasswordChangeStudent,
    };