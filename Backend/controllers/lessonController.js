const Lesson = require('../models/lessonModel');
const Course = require('../models/courseModel');
//lesson number will be decided based on the number of lessons atached to the course
const CreateLesson = async (req, res) => {
    const { Title, Description, PdfContent} = req.body;
    // Check if the course exists
    const course = await Course.findByPk(req.params.id);
    if (!course) {
        return res.status(404).json({ message: 'Course not found' });
        }
    // Validate the request body
    if (!Title || !Description ) {
        return res.status(400).json({ message: 'Please provide all the required fields' });
    }
    // Check if the teachers is the owner of the course
    if (course.FKTeacherID !== req.userId) {
        return res.status(403).json({ message: 'You do not have permission to create a lesson for this course' });
    }
    // search how many lessons  does the course have
    const lessons = await Lesson.findAll({ where: { FKCourseID: req.params.id } });
   // lesson number is equal with the number of lessons+ 1
    const lessonNumber = lessons.length + 1;
    // Create a new lesson
    const newLesson = await Lesson.create({
        Title,
        Description,
        PdfContent,
        LessonNumber: lessonNumber,
        FKCourseID: req.params.id,
    });

    // Return the new lesson object
    return res.status(201).json(newLesson);
};


module.exports = {
    CreateLesson,
}
