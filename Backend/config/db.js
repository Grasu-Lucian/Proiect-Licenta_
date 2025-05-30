require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });


const Sequelize = require('sequelize');

// Use environment variables from .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);



module.exports = sequelize;
