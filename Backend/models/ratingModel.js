const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Student = require('./studentModel');
const Course = require('./courseModel');

const Rating = sequelize.define('Rating', {
  RatingID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Rating: {
    type: DataTypes.INTEGER,
    allowNull: false, // Rating is required
    validate: {
      min: 1, // Minimum rating value
      max: 5, // Maximum rating value
    },
  },
  RatingDescription: {
    type: DataTypes.TEXT,
    allowNull: true, // Optional description for the rating
  },
  FKStudentID: {
    type: DataTypes.INTEGER,
    allowNull: false, // Mandatory foreign key
    references: {
      model: Student,
      key: 'StudentID',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  FKCourseID: {
    type: DataTypes.INTEGER,
    allowNull: false, // Mandatory foreign key
    references: {
      model: Course,
      key: 'CourseID',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
}, {
  tableName: 'Ratings',
  timestamps: true,
});

// Define relationships
Student.hasMany(Rating, { foreignKey: 'FKStudentID' }); // A student can have many reviews
Rating.belongsTo(Student, { foreignKey: 'FKStudentID' }); // A review belongs to one student

Course.hasMany(Rating, { foreignKey: 'FKCourseID' }); // A course can have many reviews
Rating.belongsTo(Course, { foreignKey: 'FKCourseID' }); // A review belongs to one course

module.exports = Rating;