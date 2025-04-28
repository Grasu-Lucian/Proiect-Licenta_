const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Student = require('./studentModel');
const Lesson = require('./lessonModel');

const Seen = sequelize.define('Seen', {
  SeenID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  FKLessonID: {
    type: DataTypes.INTEGER,
    allowNull: false, // Mandatory foreign key
    references: {
      model: Lesson,
      key: 'LessonID',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
}, {
  tableName: 'Seen',
  timestamps: true,
});

// Define relationships
Student.hasMany(Seen, { foreignKey: 'FKStudentID' });
Seen.belongsTo(Student, { foreignKey: 'FKStudentID' });

Lesson.hasMany(Seen, { foreignKey: 'FKLessonID' });
Seen.belongsTo(Lesson, { foreignKey: 'FKLessonID' });

module.exports = Seen;