const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Student = require('./studentModel');
const Teacher = require('./teacherModel');
const Course = require('./courseModel');

const Ticket = sequelize.define('Ticket', {
  TicketID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  TicketDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  FKStudentID: {
    type: DataTypes.INTEGER,
    allowNull: true, // Nullable if the ticket is created by a teacher
    references: {
      model: Student,
      key: 'StudentID',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  FKTeacherID: {
    type: DataTypes.INTEGER,
    allowNull: true, // Nullable if the ticket is created by a student
    references: {
      model: Teacher,
      key: 'TeacherID',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  FKCourseID: {
    type: DataTypes.INTEGER,
    allowNull: true, // Nullable if the ticket is not related to a course
    references: {
      model: Course,
      key: 'CourseID',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  FKTicketID: {
    type: DataTypes.INTEGER,
    allowNull: true, // Nullable for main tickets, set for replies
    references: {
      model: 'Tickets', // Self-referencing the Ticket table
      key: 'TicketID',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  Status: {
    type: DataTypes.ENUM('open', 'closed'), // Only two options: 'open' and 'closed'
    defaultValue: 'open', // Default value is 'open'
    allowNull: true,
  },
}, {
  tableName: 'Tickets',
  timestamps: true,
});

// Define relationships
Ticket.hasMany(Ticket, { as: 'Replies', foreignKey: 'FKTicketID' });
Ticket.belongsTo(Ticket, { as: 'Parent', foreignKey: 'FKTicketID' });

Student.hasMany(Ticket, { foreignKey: 'FKStudentID' });
Ticket.belongsTo(Student, { foreignKey: 'FKStudentID' });

Teacher.hasMany(Ticket, { foreignKey: 'FKTeacherID' });
Ticket.belongsTo(Teacher, { foreignKey: 'FKTeacherID' });

Course.hasMany(Ticket, { foreignKey: 'FKCourseID' });
Ticket.belongsTo(Course, { foreignKey: 'FKCourseID' });

module.exports = Ticket;