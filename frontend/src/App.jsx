import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import CreateCourse from './pages/CreateCourse';
import ManageCourses from './pages/ManageCourses';
import ManageStudents from './pages/ManageStudents';
import StudentDashboard from './pages/StudentDashboard';
import EnrollmentRequests from './pages/EnrollmentRequests';
import authService from './services/authService';

const PrivateRoute = ({ children, role }) => {
  const user = authService.getCurrentUser();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-navy-900 text-gray-300">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/create-course"
            element={
              <PrivateRoute role="admin">
                <CreateCourse />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/manage-courses"
            element={
              <PrivateRoute role="admin">
                <ManageCourses />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/manage-students"
            element={
              <PrivateRoute role="admin">
                <ManageStudents />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/requests"
            element={
              <PrivateRoute role="admin">
                <EnrollmentRequests />
              </PrivateRoute>
            }
          />
          <Route
            path="/student"
            element={
              <PrivateRoute role="student">
                <StudentDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
