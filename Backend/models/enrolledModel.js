const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Student = require('./studentModel');
const Course = require('./courseModel');

const Enrolled = sequelize.define('Enrolled', {
  EnrolledID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  FKStudentID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Student,
      key: 'StudentID',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
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
  tableName: 'Enrolled',
  timestamps: true,
});

Student.hasMany(Enrolled, { foreignKey: 'FKStudentID' });
Enrolled.belongsTo(Student, { foreignKey: 'FKStudentID' });

Course.hasMany(Enrolled, { foreignKey: 'FKCourseID' });
Enrolled.belongsTo(Course, { foreignKey: 'FKCourseID' });

module.exports = Enrolled;