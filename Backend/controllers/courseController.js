const Course = require('../models/courseModel');
const Teacher = require('../models/teacherModel');
const Enrolled = require('../models/enrolledModel'); // Add this line

const CreateCourse = async (req, res) => {
    const { Title, CourseDescription, Price } = req.body;

    // Check if the teacher exists
    const teacher = await Teacher.findByPk(req.userId);
    if (!teacher) {
        return res.status(400).json({ message: 'Teacher not found' });
    }

    // Validate the request body
    if (!Title || !CourseDescription || Price === undefined) {
        return res.status(400).json({ message: 'Please provide all the required fields' });
    }

    // Ensure the price is valid
    if (Price < 0) {
        return res.status(400).json({ message: 'Price must be a non-negative value' });
    }

    // Ensure there aren't two courses with the same title
    const course = await Course.findOne({ where: { Title } });
    if (course) {
        return res.status(400).json({ message: 'There should\'nt be two courses with the same title' });
    }

    // Ensure the course description is at least 50 characters long
    if (CourseDescription.length < 50) {
        return res.status(400).json({ message: 'Course description must be at least 50 characters long' });
    }

    // Create a new course
    const newCourse = await Course.create({
        Title,
        CourseDescription,
        CourseStatus: 'private',
        FKTeacherID: req.userId,
        Price, // Include the price
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
        // First, get all courses that are public
        const allCourses = await Course.findAll({ where: { CourseStatus: 'public' } });
        if (!allCourses || allCourses.length === 0) {
            return res.status(404).json({ message: 'No courses found' });
        }

        // Get the courses the student is already enrolled in
        const enrolledCourses = await Enrolled.findAll({ where: { FKStudentID: req.userId } });
        const enrolledCourseIds = enrolledCourses.map(enrolled => enrolled.FKCourseID);

        // Filter out courses the student is already enrolled in
        const availableCourses = allCourses.filter(course => !enrolledCourseIds.includes(course.CourseID));

        // If no courses are available
        if (availableCourses.length === 0) {
            return res.status(200).json({ message: 'No courses available for enrollment' });
        }

        // Fetch teacher details for each course
        const coursesForStudents = await Promise.all(
            availableCourses.map(async (course) => {
                const teacher = await Teacher.findByPk(course.FKTeacherID);
                return {
                    CourseID: course.CourseID,
                    Title: course.Title,
                    CourseDescription: course.CourseDescription,
                    TeacherName: teacher ? `${teacher.FirstName} ${teacher.LastName}` : 'Unknown',
                    Price: course.Price,
                };
            })
        );

        // Return the filtered courses with teacher details
        return res.status(200).json(coursesForStudents);
    } catch (error) {
        console.error('Error fetching courses for students:', error);
        return res.status(500).json({ message: 'An error occurred while fetching courses for students' });
    }
};


const updateCourse = async (req, res) => {
    try {
        // Get the course by ID
        const course = await Course.findByPk(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if the course belongs to the teacher
        if (course.FKTeacherID !== req.userId) {
            return res.status(403).json({ message: 'You do not have permission to update this course' });
        }

        // Validate the request body
        const { Title, CourseDescription, Price } = req.body;
        if (!Title || !CourseDescription || Price === undefined) {
            return res.status(400).json({ message: 'Please provide all the required fields' });
        }

        // Ensure the price is valid
        if (Price < 0) {
            return res.status(400).json({ message: 'Price must be a non-negative value' });
        }

        // Update the course
        const updatedCourse = await Course.update(
            { Title, CourseDescription, Price },
            { where: { CourseID: req.params.id } }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Return the updated course object
        return res.status(200).json({ message: 'Course updated successfully' });
    } catch (error) {
        console.error('Error updating course:', error);
        return res.status(500).json({ message: 'An error occurred while updating the course' });
    }
};

const deleteCourse = async (req, res) => {
    try {
        // Get the course by ID
        const course = await Course.findByPk(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if the course belongs to the teacher by comparing the FKTeacherID with the req.userId
        if (course.FKTeacherID !== req.userId) {
            return res.status(403).json({ message: 'You do not have permission to delete this course' });
        }

        // Delete the course
        const deletedCourse = await Course.destroy({ where: { CourseID: req.params.id } });
        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Return a success message
        return res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the course' });
    }
};

module.exports = {
    CreateCourse,
    GetTeacherCourse,
    GetTeacherCourses,
    PublishCourse,
    getCoursesforStudents,
    updateCourse,
    deleteCourse,
};