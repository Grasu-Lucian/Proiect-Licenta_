const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js'); // Adjust the path to your database configuration file

const Teacher = sequelize.define('Teacher', {
  TeacherID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  FirstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  LastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Teachers', // Optional: specify the table name
  timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = Teacher;