const Seen = require('../models/seenModel');
const Student = require('../models/studentModel');
const Lesson = require('../models/lessonModel');
const Enrolled = require('../models/enrolledModel');

const createSeen = async (req, res) => {
   // get the student from the userId in the token
    const studentId = req.userId; // Assuming the user ID is stored in req.userId after authentication
    const lessonId = req.params.id; // Assuming the lesson ID is passed in the URL
    // search for the lesson and get the FKCourseID
    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) {
      return res.status(400).json({ message: 'Lesson not found' });
    }
    // search if the student is enrolled in the course
    const enrolledStudent = await Enrolled.findOne({ where: {  FKStudentID: studentId, FKCourseID: lesson.FKCourseID } });
    if (!enrolledStudent) {
      return res.status(400).json({ message: 'You are not enrolled in this course' });
    }
    // a course can only be seen once by a student  
    // check if the seen record already exists
    const existingSeen = await Seen.findOne({ where: { FKStudentID: studentId, FKLessonID: lessonId } });
    if (existingSeen) {
        return res.status(400).json({ message: 'You have already seen this lesson' });
        }
        
    // create the seen record
    const newSeen = await Seen.create({
      FKStudentID: studentId,
      FKLessonID: lessonId,
    });
    return res.status(201).json(newSeen);
};


const getAllSeen = async (req, res) => {
  const studentId = req.userId; // Assuming the user ID is stored in req.userId after authentication
  const courseId = req.params.id; // Assuming the course ID is passed in the URL
// search all the courses lessons
  const lessons = await Lesson.findAll({ where: { FKCourseID: courseId } });
  if (!lessons) {
    return res.status(404).json({ message: 'No lessons found' });
  }
  // search for all the seen records for the student for those lessons
  const seenRecords = await Seen.findAll({ where: { FKStudentID: studentId, FKLessonID: lessons.map(lesson => lesson.LessonID) } });
  if (!seenRecords) {
    return res.status(404).json({ message: 'No seen records found' });
  }
  // return the seen records
  return res.status(200).json(seenRecords);
};

module.exports = {
  createSeen,
  getAllSeen,
};