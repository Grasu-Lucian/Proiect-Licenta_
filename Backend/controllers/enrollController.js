const Enrolled = require('../models/enrolledModel');
const Course = require('../models/courseModel');
const Student = require('../models/studentModel');

const EnrollStudent = async (req, res) => {
    // take the course by param id
    const course = await Course.findByPk(req.params.id);
    if (!course) {
        return res.status(404).json({ message: 'Course not found' });
    }
    //course should have the CourseStatus as public
    if (course.CourseStatus !== 'public') {
        return res.status(403).json({ message: 'You do not have permission to access this course' });
    }
    
    // check if the student exists
    const student = await Student.findByPk(req.userId);
    if (!student) {
        return res.status(400).json({ message: 'Student not found' });
    }
    // check if the student is enrolled in the course
    const enrolled = await Enrolled.findOne({ where: { FKStudentID: req.userId, FKCourseID: req.params.id } });
    if (enrolled) {
        return res.status(400).json({ message: 'Student is already enrolled in this course' });
    }
    // enroll the student in the course
    const enrolledStudent = await Enrolled.create({
        FKStudentID: req.userId,
        FKCourseID: req.params.id,
    });
    if (!enrolledStudent) {
        return res.status(400).json({ message: 'There was an error enrolling the student' });
    }
    // return the enrolled student object
    return res.status(201).json(enrolledStudent);
};

const GetEnrolledCourses = async (req, res) => {
    const enrolledStudents = await Enrolled.findAll({ where: { FKStudentID: req.userId } });
    if (!enrolledStudents) {
        return res.status(404).json({ message: 'No enrolled courses found' });
    }
    // if they are found extract the course title from the course db and return it
    const courses = enrolledStudents.map(enrolled => enrolled.FKCourseID);
    const courseTitles = await Course.findAll({ where: { CourseID: courses } });
    return res.status(200).json(courseTitles);
};

module.exports = {
    EnrollStudent,
    GetEnrolledCourses,
};