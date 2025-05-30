const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Course = require('./courseModel');

const Lesson = sequelize.define('Lesson', {
  LessonID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  PdfContent: {
    type: DataTypes.STRING, // Path or URL to the PDF file
    allowNull: true,
  },
  LessonNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  FKCourseID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Course,
      key: 'CourseID',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
}, {
  tableName: 'Lessons',
  timestamps: true,
});

// Define the relationship
Course.hasMany(Lesson, { foreignKey: 'FKCourseID' });
Lesson.belongsTo(Course, { foreignKey: 'FKCourseID' });

module.exports = Lesson;