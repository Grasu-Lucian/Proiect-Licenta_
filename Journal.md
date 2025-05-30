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

# 2025-04-23

## Seventh commit
- Changed the createStudent function to registerStudent.
- Made the registerStudent function  not show the password in the response.
- Added the loginStudent function to the studentController file.

## Eighth commit
- Added the authMiddleware to the middleware folder.
- Created a function to check if the token is valid.

## Ninth commit
- fixed the jsonwebtoken from returning an undefined id to returnin the actual id.
- fixed the authMiddleware to return the userId from the decoded token.
- added the getStudent function to return the student object without the password.

## Tenth commit
- added the getAllStudents function to the studentController to get all the students.
- removed the password from the getAllStudents function.

## Eleventh commit
- added the updateStudent function to the studentController to update the student username and email

## Twelfth commit
- added the PasswordChangeStudent function to the studentController to change the student password

## Thirteenth commit
- added the deleteStudent function to the studentController to delete the student

## Fourteenth commit
- added teacher model to the models folder

## Fifteenth commit
- added the getAllTeachers function to the teacherController to get all the teachers
- added the passwordChangeTeacher function to the teacherController to change the teacher password
- added the authMiddlewareTeacher to the middleware folder
- added the teacherRouter to the routes folder
- added the teacherRouter to the index.js file

# 2025-04-24

## Sixteenth commit
- created a new course model
- added a function that allows as to create a new course as a teacher 

## Seventeenth commit
- added to the teacherControler a function that returns the username of the teacher via id in the url
- added to the teacherControler a function that returns all the courses for the teacher
- added to the teacherControler a function that returns the courses for the students

# 2025-04-25
## Eighteenth commit
- added updateCourse function to the courseController

## Nineteenth commit
- added deleteCourse function to the courseController


## Twenty commit
- added the price field to the course model

## Twenty-first commit
- added the enrollStudent function to the enrolledController
- added the model for the enrolled model
- added the enroll router to the index.js file

## Twenty-second commit
- added the lesson model to the models folder
- added the createLesson function to the lessonController
- added the lesson router to the index.js file
- added the CreateLesson function to the lessonController

## Twenty-third commit
- added the getAllLessons function to the lessonController
- added the getLesson function to the lessonController

## Twenty-fourth commit
- added the get all lessons for both the teacher and student

## Twenty-fifth commit
-added all the ticket models and funcitonalities 

# 2025-05-02

## Twenty-sixth commit
- added the ticket model to the models folder
- added the ticket router to the routes folder
- added the ticket router to the index.js file
- added the ticket controller to the controllers folder
- added the createTicket function to the ticket controller
- added the getAllTickets function to the ticket controller
- added the getTicket function to the ticket controller
- added the deleteTicket function to the ticket controller
- added cors to the index.js file

## Twenty-seventh commit
added the front end and multiple routes 

# 2025-05-03
## Twenty-eighth commit
-added the login
added the homepage route to the frontend

# 2025-05-08

## Twenty-ninth commit
- Added Student Dashboard functionality
  - Created StudentDashboard component in frontend
  - Implemented course enrollment functionality
  - Added error handling for enrollment attempts
  - Removed "Your Courses" section to focus on available courses

## Thirtieth commit
- Updated backend course controller
  - Modified getCoursesforStudents function to filter out enrolled courses
  - Added logic to check student's enrolled courses before displaying available courses
  - Improved error handling and response messages

## Thirty-first commit
- Enhanced Student Dashboard UI/UX
  - Added proper error messages when no courses are found
  - Improved course display and enrollment button functionality
  - Added loading states and error handling in the frontend
  - Ensured courses array is always properly formatted

## Thirty-second commit
- Fixed frontend course display issues
  - Added proper handling for empty course arrays
  - Added clear messages when no courses are available for enrollment
  - Improved error message display for various scenarios
  - Added proper state management for courses and errors