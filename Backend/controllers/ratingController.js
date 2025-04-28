const Rating = require('../models/ratingModel');
const Student = require('../models/studentModel');
const Lesson = require('../models/lessonModel');
const Seen = require('../models/seenModel');

const createRating = async (req, res) => {
    const CourseID = req.params.id; // Correctly extract CourseID from req.params
    const studentId = req.userId; // Get student ID from the token

    // Validate that CourseID is provided
    if (!CourseID) {
        return res.status(400).json({ message: 'CourseID is required' });
    }

    // Search all the lessons in the course
    const lessons = await Lesson.findAll({ where: { FKCourseID: CourseID } }); // Ensure FKCourseID is used
    if (lessons.length === 0) {
        return res.status(400).json({ message: 'No lessons found for this course' });
    }

    // Search all the seen lessons by the student from the lessons
    const seenLessons = await Seen.findAll({
        where: {
            FKStudentID: studentId,
            FKLessonID: lessons.map(lesson => lesson.LessonID),
        },
    });

    // Compare the length of the lessons and seen lessons
    if (lessons.length !== seenLessons.length) {
        return res.status(400).json({ message: 'You must see all the lessons in the course to rate it' });
    }

    // Search for the student in the database
    const student = await Student.findByPk(studentId);
    if (!student) {
        return res.status(400).json({ message: 'Student not found' });
    }

    // Create the rating
    const newRating = await Rating.create({
        FKStudentID: studentId,
        FKCourseID: CourseID,
        Rating: req.body.Rating,
        RatingDescription: req.body.RatingDescription,
    });

    return res.status(201).json(newRating);
};
const getAllRatings = async (req, res) => {
    const CourseID = req.params.id;
    const ratings = await Rating.findAll({ where: { FKCourseID: CourseID } });
    // take all the fk  student from the ratings and display their usernames
    const students = await Student.findAll({ where: { StudentID: ratings.map(rating => rating.FKStudentID) } });
    const usernames = students.map(student => student.FirstName + ' ' + student.LastName);
    // create an object with the usernames and ratings and the rating description
    const ratingsWithUsernames = ratings.map((rating, index) => {
        return {
            Username: usernames[index],
            Rating: rating.Rating,
            RatingDescription: rating.RatingDescription,
        };
    });
    return res.status(200).json(ratingsWithUsernames);
};




module.exports = {
    createRating,
    getAllRatings,
};
