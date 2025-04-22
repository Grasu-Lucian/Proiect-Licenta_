// Database connection configuration file
const Sequelize = require('sequelize');
// Import the Sequelize library
const sequelize = new Sequelize('Licenta', 'root', 'sixbones', {
  host: 'localhost',
  dialect: 'mysql'
});
// Create a new Sequelize instance
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
// Test the connection 
module.exports = sequelize;