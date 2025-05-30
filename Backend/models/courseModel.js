const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Teacher = require('./teacherModel');

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
    type: DataTypes.ENUM('public', 'private'),
    allowNull: false,
    defaultValue: 'private',
  },
  CourseDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  FKTeacherID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Teacher,
      key: 'TeacherID',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  Price: { // Add the Price field
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0, // Ensure the price is non-negative
    },
  },
}, {
  tableName: 'Courses',
  timestamps: true,
});

Teacher.hasMany(Course, { foreignKey: 'FKTeacherID' });
Course.belongsTo(Teacher, { foreignKey: 'FKTeacherID' });

module.exports = Course;