import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Saheli Connect Pages
import LandingPage from './pages/LandingPage';
import NgoDashboard from './pages/NgoDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import CaseDetail from './pages/CaseDetail';
import ReportSubmission from './pages/ReportSubmission';
import NgoManagement from './pages/NgoManagement';
import WhatsAppChat from './pages/WhatsAppChat';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes — no sidebar */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/report" element={<ReportSubmission />} />
            <Route path="/simulator" element={<WhatsAppChat />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><NgoDashboard /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
            <Route path="/case/:id" element={<ProtectedRoute><CaseDetail /></ProtectedRoute>} />
            <Route path="/ngo-partners" element={<ProtectedRoute><NgoManagement /></ProtectedRoute>} />

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
