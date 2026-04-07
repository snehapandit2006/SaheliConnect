import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Saheli Connect Pages
import NgoDashboard from './pages/NgoDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import CaseDetail from './pages/CaseDetail';
import ReportSubmission from './pages/ReportSubmission';
import NgoManagement from './pages/NgoManagement';
import WhatsAppChat from './pages/WhatsAppChat';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes without Sidebar */}
          <Route path="/login" element={<Login />} />
          
          {/* Routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/report" element={<ReportSubmission />} />
            <Route path="/simulator" element={<WhatsAppChat />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><NgoDashboard /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
            <Route path="/case/:id" element={<ProtectedRoute><CaseDetail /></ProtectedRoute>} />
            <Route path="/ngo-partners" element={<ProtectedRoute><NgoManagement /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
