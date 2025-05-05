import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from './Pages/Homepage';
import RegisterStudent from './Pages/RegisterStudent';
import StudentDashboard from './Pages/StudentDashboard';
import ProtectedStudentRoute from './Components/ProtectedStudentRoute';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register/student" element={<RegisterStudent />} />
        <Route path="/login/student" element={<LoginStudent />} />
        <Route
          path="/student-dashboard"
          element={
            <ProtectedStudentRoute>
              <NavbarStudent />
              <StudentDashboard />
            </ProtectedStudentRoute>
          }
        />
        <Route path="/register/teacher" element={<RegisterTeacher />} />
        <Route path="/login/teacher" element={<LoginTeacher />} />
        <Route path="/teacher-dashboard" element={<ProtectedTeacherRoute><NavbarTeacher/><TeacherDashboard /></ProtectedTeacherRoute>} />
        <Route path="/check-courses" element={<ProtectedTeacherRoute><NavbarTeacher/><CheckCourses/></ProtectedTeacherRoute>} />
        <Route path="/create-course" element={<ProtectedTeacherRoute><NavbarTeacher/><CreateCourses/></ProtectedTeacherRoute>} />
        <Route path="/check-lessons/:courseId" element={<ProtectedTeacherRoute><NavbarTeacher/><CheckLessons/></ProtectedTeacherRoute>} />
        <Route path="/create-lesson/:courseId" element={<ProtectedTeacherRoute><NavbarTeacher/><CreateLessons/></ProtectedTeacherRoute>} />
        <Route path="/lesson-details/:lessonId" element={<ProtectedTeacherRoute><NavbarTeacher/><LessonDetails/></ProtectedTeacherRoute>} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;