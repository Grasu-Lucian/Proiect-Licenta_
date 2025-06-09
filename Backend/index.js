const express = require('express');
require('dotenv').config();
const app = express();
const port = 3307;
const cors= require('cors');
const sequelize = require('./config/db');
app.use(cors({
  origin: ['http://localhost:3000','https://grasu-lucian-thesis.netlify.app/'], // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow cookies if needed
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', require('./routes/studentRouter'));
app.use('/api', require('./routes/teacherRouter'));
app.use('/api', require('./routes/courseRouter'));
app.use('/api', require('./routes/enrollRouter'));
app.use('/api', require('./routes/lessonRouter'));
app.use('/api', require('./routes/ticketRouter'));
app.use('/api', require('./routes/replyRouter'));
app.use('/api', require('./routes/seenRouter'));
app.use('/api', require('./routes/ratingRouter'));
sequelize.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to sync the database:', err);
  });