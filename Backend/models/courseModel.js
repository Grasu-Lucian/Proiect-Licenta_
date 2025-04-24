const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust the path to your database configuration file
const Teacher = require('./teacherModel'); // Import the Teacher model for the foreign key relationship

const Course = sequelize.define('Course', {
  CourseID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CourseDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  CourseStatus: {
    type: DataTypes.ENUM('public', 'private'), // Allowed values for CourseStatus
    allowNull: false,
    defaultValue: 'private', // Default value
  },
  CourseDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  FKTeacherID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Teacher, // Reference the Teacher model
      key: 'TeacherID',
    },
    onDelete: 'CASCADE', // Delete courses if the teacher is deleted
    onUpdate: 'CASCADE',
  },
}, {
  tableName: 'Courses', // Optional: specify the table name
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Define the association between Teacher and Course
Teacher.hasMany(Course, { foreignKey: 'FKTeacherID' });
Course.belongsTo(Teacher, { foreignKey: 'FKTeacherID' });

module.exports = Course;