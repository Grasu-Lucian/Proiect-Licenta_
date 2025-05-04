const Teacher = require('../models/teacherModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new teacher
const registerTeacher = async (req, res) => {
  const { FirstName, LastName, Email, Password } = req.body;

  // Validate the request body
  if (!FirstName || !LastName || !Email || !Password) {
    return res.status(400).json({ message: 'Please provide all the required fields' });
  }

  // Validate the Email
  if (!Email.includes('@')) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  // Check if the teacher already exists
  const existingTeacher = await Teacher.findOne({ where: { Email } });
  if (existingTeacher) {
    return res.status(400).json({ message: 'A teacher with that email already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(Password, 10);

  // Create a new teacher
  const newTeacher = await Teacher.create({
    FirstName,
    LastName,
    Email,
    Password: hashedPassword,
  });

  // Generate a JWT token
  const token = jwt.sign(
    { userId: newTeacher.TeacherID },
    process.env.JWT_SECRET_TEACHER,
    { expiresIn: process.env.JWT_EXPIRATION }
  );

  // Return the token and the new teacher object without the password
  return res.status(201).json({ token, FirstName: newTeacher.FirstName, LastName: newTeacher.LastName, Email: newTeacher.Email });
};

// Login a teacher
const loginTeacher = async (req, res) => {
  const { Email, Password } = req.body;

  // Validate the request body
  if (!Email || !Password) {
    return res.status(400).json({ message: 'Please provide all the required fields' });
  }

  // Check if the teacher exists
  const existingTeacher = await Teacher.findOne({ where: { Email } });
  if (!existingTeacher) {
    return res.status(400).json({ message: 'Incorrect email or password' });
  }

  // Check if the password is correct
  const isPasswordCorrect = await bcrypt.compare(Password, existingTeacher.Password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: 'Incorrect email or password' });
  }

  // Generate a JWT token
  const token = jwt.sign(
    { userId: existingTeacher.TeacherID },
    process.env.JWT_SECRET_TEACHER,
    { expiresIn: process.env.JWT_EXPIRATION }
  );

 // Return the token and the teacher object without the password
  return res.status(200).json({ token, FirstName: existingTeacher.FirstName, LastName: existingTeacher.LastName, Email: existingTeacher.Email });
};

// Get teacher profile
const getTeacher = async (req, res) => {
  const teacher = await Teacher.findByPk(req.userId);
  if (!teacher) {
    return res.status(404).json({ message: 'Teacher not found' });
  }

  // Return the teacher object without the password
  return res.status(200).json({ FirstName: teacher.FirstName, LastName: teacher.LastName, Email: teacher.Email });
};
// get teacher by id in the url
const getTeacherById = async (req, res) => {
  const teacher = await Teacher.findByPk(req.params.id);
  if (!teacher) {
    return res.status(404).json({ message: 'Teacher not found' });
  }

  // Return the teacher object with only the name 
  return res.status(200).json({ FirstName: teacher.FirstName, LastName: teacher.LastName });
  };

// get all teachers
const getAllTeachers = async (req, res) => {
    // Search for all the teachers
    const teachers = await Teacher.findAll();
    if (!teachers || teachers.length === 0) {
      return res.status(404).json({ message: 'No teachers found' });
    }
  
    // Filter out sensitive fields (e.g., Password) from the teachers array
    const AllowedFields = ['TeacherID', 'FirstName', 'LastName', 'Email'];
    const sanitizedTeachers = teachers.map(teacher =>
      Object.fromEntries(
        Object.entries(teacher.toJSON()).filter(([key]) => AllowedFields.includes(key))
      )
    );
  
    // Return the sanitized teachers array
    return res.status(200).json(sanitizedTeachers);
  };
// Update teacher profile
const updateTeacher = async (req, res) => {
    const { Email, FirstName, LastName } = req.body;
  
    // Use authMiddleware to get the teacher ID
    const existingTeacher = await Teacher.findByPk(req.userId);
    if (!existingTeacher) {
      return res.status(400).json({ message: 'The teacher does not exist' });
    }
  
    // Validate the request body
    if (!Email) {
      return res.status(400).json({ message: 'Please provide an email' });
    }
    if (!FirstName) {
      return res.status(400).json({ message: 'Please provide a first name' });
    }
    if (!LastName) {
      return res.status(400).json({ message: 'Please provide a last name' });
    }
  
    // Check if there is someone else with the same email
    const otherTeacher = await Teacher.findOne({ where: { Email } });
    if (otherTeacher && otherTeacher.TeacherID !== req.userId) {
      return res.status(400).json({ message: 'There is someone else with that email' });
    }
  
    // Update the teacher
    const updatedTeacher = await Teacher.update(
      { Email, FirstName, LastName },
      { where: { TeacherID: req.userId } }
    );
  
    if (!updatedTeacher) {
      return res.status(400).json({ message: 'There was an error updating the teacher' });
    }
  
    // Return the updated teacher object
    return res.status(200).json({ message: 'Teacher updated successfully', Email, FirstName, LastName });
  };

const passwordChangeTeacher = async (req, res) => {
    const { OldPassword, NewPassword } = req.body;
    // validate the request body
    if (!OldPassword || !NewPassword) {
      return res.status(400).json({ message: 'Please provide all the required fields' });
    }
    // use the req.id to search for the teacher
    const existingTeacher = await Teacher.findByPk(req.userId);
    if (!existingTeacher) {
      return res.status(400).json({ message: 'The teacher does not exist' });
    }
    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(OldPassword, existingTeacher.Password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Incorrect password' });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(NewPassword, 10);
    // Update the password
    const updatedTeacher = await Teacher.update(
      { Password: hashedPassword },
      { where: { TeacherID: req.userId } }
    );
    if (!updatedTeacher) {
      return res.status(400).json({ message: 'There was an error updating the password' });
    }
    // Return the updated teacher object
    return res.status(200).json({ message: 'Password updated successfully' });
  }
// Delete teacher
const deleteTeacher = async (req, res) => {
  const existingTeacher = await Teacher.findByPk(req.userId);
  if (!existingTeacher) {
    return res.status(400).json({ message: 'The teacher does not exist' });
  }

  // Delete the teacher
  const deletedTeacher = await Teacher.destroy({ where: { TeacherID: req.userId } });
  if (!deletedTeacher) {
    return res.status(400).json({ message: 'There was an error deleting the teacher' });
  }

  return res.status(200).json({ message: 'Teacher deleted successfully' });
};

module.exports = {
  registerTeacher,
  loginTeacher,
  getTeacher,
  getAllTeachers,
  updateTeacher,
  getTeacherById,
  passwordChangeTeacher,
  deleteTeacher,
};