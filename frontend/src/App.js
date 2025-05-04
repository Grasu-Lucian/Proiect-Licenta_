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
              <StudentDashboard />
            </ProtectedStudentRoute>
          }
        />
        <Route path="/register/teacher" element={<RegisterTeacher />} />
        <Route path="/login/teacher" element={<LoginTeacher />} />
        <Route path="/teacher-dashboard" element={<ProtectedTeacherRoute><NavbarTeacher/><TeacherDashboard /></ProtectedTeacherRoute>} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;