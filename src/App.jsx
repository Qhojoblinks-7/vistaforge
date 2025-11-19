import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TimerProvider } from './context/TimerContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Sidebar from './components/common/Sidebar';

// Auth screens
import LoginPage from './modules/Auth/screens/LoginPage';

// Project screens
import ProjectsListPage from './modules/Projects/screens/ProjectsListPage';
import ProjectDetailView from './modules/Projects/screens/ProjectDetailView';

// Public pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import PortfolioPage from './pages/PortfolioPage';
import ContactPage from './pages/ContactPage';
import ProjectDetailPage from './pages/ProjectDetailPage';

// Admin pages
import ProjectManagementPage from './pages/ProjectManagementPage';
import TimeLogsPage from './pages/TimeLogsPage';
import ClientsPage from './pages/ClientsPage';
import InvoicesPage from './modules/Invoices/screens/InvoicesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import InquiriesPage from './modules/Clients/screens/InquiriesPage';

const queryClient = new QueryClient();

// A simple wrapper to protect routes
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { token } = useAuth();
  const location = useLocation();
  const isAuthenticated = !!token;

  // Define which routes should show the sidebar (authenticated routes only)
  const authenticatedRoutes = ['/dashboard', '/projects', '/timelogs', '/clients', '/invoices', '/analytics', '/settings', '/admin', '/inquiries'];
  const shouldShowSidebar = isAuthenticated && authenticatedRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {shouldShowSidebar && <Sidebar />}
      <div className={`flex-1 ${shouldShowSidebar ? 'ml-60' : ''}`}>
        {!shouldShowSidebar && <Header />}
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio/:slug" element={<ProjectDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Auth Routes */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin" element={<Navigate to="/admin/login" />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><ProjectsListPage /></ProtectedRoute>} />
            <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetailView /></ProtectedRoute>} />
            <Route path="/timelogs" element={<ProtectedRoute><TimeLogsPage /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><ClientsPage /></ProtectedRoute>} />
            <Route path="/inquiries" element={<ProtectedRoute><InquiriesPage /></ProtectedRoute>} />
            <Route path="/invoices" element={<ProtectedRoute><InvoicesPage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/projects" element={<ProtectedRoute><ProjectManagementPage /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <AuthProvider>
                <TimerProvider>
                  <ToastProvider>
                    <AppContent />
                  </ToastProvider>
                </TimerProvider>
              </AuthProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </Provider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
