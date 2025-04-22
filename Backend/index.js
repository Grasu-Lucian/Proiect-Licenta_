const express = require('express');
require('dotenv').config();
const app = express();
const port = 3307;
const sequelize = require('./config/db');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/api', require('./routes/studentRouter'));

sequelize.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to sync the database:', err);
  });