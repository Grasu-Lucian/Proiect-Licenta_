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

const GetTeacherCourse = async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
        return res.status(404).json({ message: 'Course not found' });
    }
    // Check if the course belongs to the teacher by comparing the FKTeachear with the req.userId
    if (course.FKTeacherID !== req.userId) {
        return res.status(403).json({ message: 'You do not have permission to access this course' });
    }
    // Return the course object
    return res.status(200).json(course);
};

const GetTeacherCourses = async (req, res) => { 
    // Get all courses for the teacher
    const courses = await Course.findAll({ where: { FKTeacherID: req.userId } });
    if (!courses) {
        return res.status(404).json({ message: 'No courses found' });
    }
    // Return the courses object
    return res.status(200).json(courses);
}
const PublishCourse = async (req, res) => {
// update the course status to public
const course = await Course.findByPk(req.params.id);
if (!course) {
    return res.status(404).json({ message: 'Course not found' });
}
// Check if the course belongs to the teacher by comparing the FKTeachear with the req.userId
if (course.FKTeacherID !== req.userId) {
    return res.status(403).json({ message: 'You do not have permission to access this course' });
}
// Update the course status to public
const updatedCourse = await Course.update(
    { CourseStatus: 'public' },
    { where: { CourseID: req.params.id } }
);
if (!updatedCourse) {
    return res.status(404).json({ message: 'Course not found' });
}
// Return the updated course object
return res.status(200).json({ message: 'Course published successfully' });
}


const getCoursesforStudents = async (req, res) => {
    try {
        // Get all courses that are public
        const courses = await Course.findAll({ where: { CourseStatus: 'public' } });
        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: 'No courses found' });
        }

        // Fetch teacher details for each course
        const coursesForStudents = await Promise.all(
            courses.map(async (course) => {
                const teacher = await Teacher.findByPk(course.FKTeacherID);
                return {
                    CourseID: course.CourseID,
                    Title: course.Title,
                    CourseDescription: course.CourseDescription,
                    TeacherName: teacher ? `${teacher.FirstName} ${teacher.LastName}` : 'Unknown',
                };
            })
        );

        // Return the courses with teacher details
        return res.status(200).json(coursesForStudents);
    } catch (error) {
        console.error('Error fetching courses for students:', error);
        return res.status(500).json({ message: 'An error occurred while fetching courses for students' });
    }
};

module.exports = {
    CreateCourse,
    GetTeacherCourse,
    GetTeacherCourses,
    PublishCourse,
    getCoursesforStudents,
};