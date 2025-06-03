import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from './Pages/Homepage';
import RegisterStudent from './Pages/RegisterStudent';
import LoginStudent from './Pages/LoginStudent';
import RegisterTeacher from './Pages/RegisterTeacher';
import LoginTeacher from './Pages/LoginTeacher';
import ProtectedTeacherRoute from './Components/ProtectedTeacherRoute';
import TeacherDashboard from './Pages/TeacherDashboard';
import NavbarTeacher from './Components/NavbarTeacher';
import CheckCourses from './Pages/CheckCourses';
import CreateCourses from './Pages/CreateCourses';
import CheckLessons from './Pages/CheckLessons';
import CreateLessons from './Pages/CreateLessons';
import LessonDetails from './Pages/LessonDetails';
import NavbarStudent from './Components/NavbarStudent';
import StudentDashboard from './Pages/StudentDashboard';
import CheckStudentCourses from './Pages/CheckStudentCourses';
import CheckStudentLessons from './Pages/CheckStudentLessons';
import CheckStudentLesson from './Pages/CheckStudentLesson';
import ProtectedStudentRoute from './Components/ProtectedStudentRoute';
import OpenTicket from './Pages/OpenTicket';
import StudentTickets from './Pages/StudentTickets';
import TeacherTickets from './Pages/TeacherTickets';
import EditLesson from './Pages/EditLesson';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/register/student" element={<RegisterStudent />} />
        <Route path="/login/student" element={<LoginStudent />} />
        <Route path="/register/teacher" element={<RegisterTeacher />} />
        <Route path="/login/teacher" element={<LoginTeacher />} />

        {/* Teacher Routes */}
        <Route path="/teacher-dashboard" element={<ProtectedTeacherRoute><NavbarTeacher/><TeacherDashboard /></ProtectedTeacherRoute>} />
        <Route path="/check-courses" element={<ProtectedTeacherRoute><NavbarTeacher/><CheckCourses/></ProtectedTeacherRoute>} />
        <Route path="/create-course" element={<ProtectedTeacherRoute><NavbarTeacher/><CreateCourses/></ProtectedTeacherRoute>} />
        <Route path="/check-lessons/:courseId" element={<ProtectedTeacherRoute><NavbarTeacher/><CheckLessons/></ProtectedTeacherRoute>} />
        <Route path="/create-lesson/:courseId" element={<ProtectedTeacherRoute><NavbarTeacher/><CreateLessons/></ProtectedTeacherRoute>} />
        <Route path="/lesson-details/:lessonId" element={<ProtectedTeacherRoute><NavbarTeacher/><LessonDetails/></ProtectedTeacherRoute>} />
        <Route path="/edit-lesson/:lessonId" element={<ProtectedTeacherRoute><NavbarTeacher/><EditLesson/></ProtectedTeacherRoute>} />
        <Route path="/teacher-tickets" element={<ProtectedTeacherRoute><NavbarTeacher/><TeacherTickets/></ProtectedTeacherRoute>} />
        
        {/* Student Routes */}
        <Route path="/student-dashboard" element={
          <ProtectedStudentRoute>
            <NavbarStudent/>
            <StudentDashboard />
          </ProtectedStudentRoute>
        } />
        <Route path="/enrolled-courses" element={
          <ProtectedStudentRoute>
            <NavbarStudent/>
            <CheckStudentCourses />
          </ProtectedStudentRoute>
        } />
        <Route path="/student/course/:courseId/lessons" element={
          <ProtectedStudentRoute>
            <NavbarStudent/>
            <CheckStudentLessons />
          </ProtectedStudentRoute>
        } />
        <Route path="/student/lesson/:lessonId" element={
          <ProtectedStudentRoute>
            <NavbarStudent/>
            <CheckStudentLesson />
          </ProtectedStudentRoute>
        } />
        <Route path="/student/course/:courseId/open-ticket" element={
          <ProtectedStudentRoute>
            <NavbarStudent/>
            <OpenTicket />
          </ProtectedStudentRoute>
        } />
        <Route path="/student-tickets" element={
          <ProtectedStudentRoute>
            <NavbarStudent/>
            <StudentTickets />
          </ProtectedStudentRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;