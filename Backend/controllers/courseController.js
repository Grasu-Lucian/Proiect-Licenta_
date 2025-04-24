const Course = require('../models/courseModel');
const Teacher = require('../models/teacherModel');

const CreateCourse = async (req, res) => {
    const { Title, CourseDescription } = req.body;
    // Check if the teacher exists
    const teacher = await Teacher.findByPk(req.userId);
    if (!teacher) {
        return res.status(400).json({ message: 'Teacher not found' });
    }
    // Validate the request body
    if (!Title || !CourseDescription) {
        return res.status(400).json({ message: 'Please provide all the required fields' });
    }
    //there should'nt be two courses with the same title
    const course = await Course.findOne({ where: { Title } });
    if (course) {
        return res.status(400).json({ message: 'There should\'nt be two courses with the same title' });
    }
    // the course description must be at least 50 characters long
    if (CourseDescription.length < 50) {
        return res.status(400).json({ message: 'Course description must be at least 50 characters long' });
    }
    // Create a new course
    const newCourse = await Course.create({
        Title,
        CourseDescription,
        CourseStatus: 'private',
        FKTeacherID: req.userId,
    });

    // Return the new course object
    return res.status(201).json(newCourse);
};


module.exports = {
    CreateCourse,
};