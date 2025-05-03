import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from './Pages/Homepage';
import RegisterStudent from './Pages/RegisterStudent';
import StudentDashboard from './Pages/StudentDashboard';
import ProtectedStudentRoute from './Components/ProtectedStudentRoute';
import LoginStudent from './Pages/LoginStudent';
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
      </Routes>
    </Router>
  );
}

export default App;