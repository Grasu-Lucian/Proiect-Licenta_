# Daily Vlog Updates

# 2025-04-22

## First commit
- Set up the initial JSON configuration for initializing the backend.
- Added the bcrypt packages for password hashing. 
- Added the dotenv package for loading environment variables.
- Added the express-session package for managing sessions.
- Added the jsonwebtoken package for managing JWT tokens.
- Added the mysql2 package for connecting to the MySQL database.
- Added the sequelize package for interacting with the MySQL database.
( As i started the project i had to add the proper packages to the package.json file)

## Second commit
- Added connection to the DB using the Sequelize library.
( Now i decided to make sure there was a proper connection to the DB)

## Third commit
- Added the db dialect(variable) to the .env file.
- Added the path module for resolving the .env file.
( For protection i decided to add the DB dialect to the .env file)

## Fourth commit
- Added the port variable to the .env file.
- Added the sync function to the sequelize connection to the index.js file.
- Added the listen function to the index.js file.
(i created the index.js file to make sure the server was running)

## Fifth commit
- Added the student model to the models folder.

## Sixth commit
- Added the studentController to the controllers folder.
- Added the studentRouter to the routes folder.
- Added the createStudent function to the studentController file.
- Added the studentRouter to the index.js file.
( I created the createStudent function to create students)


