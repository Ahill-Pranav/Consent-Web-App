import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

import AdminDashboard from './pages/admin/AdminDashboard';
import MentorDashboard from './pages/mentor/MentorDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-forest animate-spin" />
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-forest animate-spin" />
    </div>
  );
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const DashboardRouter = () => {
  const { isAdmin, isMentor, isStudent } = useAuth();

  const getDashboard = () => {
    if (isAdmin) return <AdminDashboard />;
    if (isMentor) return <MentorDashboard />;
    if (isStudent) return <StudentDashboard />;
    return <Navigate to="/login" replace />;
  };

  return (
    <>
      <Navbar />
      {getDashboard()}
    </>
  );
};

function App() {
  return (
      <div className="app-container font-sans text-charcoal">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={
            <PublicRoute><Login /></PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute><Register /></PublicRoute>
          } />

          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          } />
          
        </Routes>
      </div>
  )
}

export default App;
