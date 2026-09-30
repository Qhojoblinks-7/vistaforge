import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TimerProvider } from './context/TimerContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/Header';
import DashboardLayout from './components/layouts/DashboardLayout';

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
import CaseStudyPage from './pages/CaseStudyPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import FAQPage from './pages/FAQPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin pages
import ProjectManagementPage from './pages/ProjectManagementPage';
import TimeLogsPage from './pages/TimeLogsPage';
import ClientsPage from './pages/ClientsPage';
import InvoicesPage from './modules/Invoices/screens/InvoicesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import InquiriesPage from './modules/Clients/screens/InquiriesPage';

const queryClient = new QueryClient();

const AuthLoadingScreen = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div
      role="status"
      aria-label="Restoring your session"
      className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#0015AA]"
    />
  </div>
);

// A token in localStorage is not proof of a valid session: it may have expired
// while the tab was closed. AuthContext rehydrates the user on mount, so hold
// the route until that settles instead of rendering the shell and then
// bouncing the admin back to the login screen.
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <AuthLoadingScreen />;
  return token ? children : <Navigate to="/admin/login" replace />;
};

// The public site and the admin area share nothing but the providers above.
// Header lives inside PublicLayout rather than being conditionally rendered
// against a route prefix list, so an admin page cannot accidentally inherit
// the marketing nav by forgetting to register its path somewhere.
const PublicLayout = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
  </>
);

const AdminLayout = () => (
  <ProtectedRoute>
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TimerProvider>
              <ToastProvider>
                <div className="min-h-screen bg-gray-50">
                  <Routes>
                    {/* Public Routes */}
                    <Route element={<PublicLayout />}>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/services" element={<ServicesPage />} />
                      <Route path="/portfolio" element={<PortfolioPage />} />
                      <Route path="/case-studies/:slug" element={<CaseStudyPage />} />
                      <Route path="/portfolio/:slug" element={<ProjectDetailPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/blog" element={<BlogPage />} />
                      <Route path="/blog/:slug" element={<BlogPostPage />} />
                      <Route path="/faq" element={<FAQPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Route>

                    {/* Auth Routes - intentionally outside both layouts: the login
                        screen is a focused full-page form with no site chrome. */}
                    <Route path="/admin/login" element={<LoginPage />} />
                    <Route path="/admin" element={<Navigate to="/admin/login" />} />

                    {/* Admin Routes */}
                    <Route element={<AdminLayout />}>
                      <Route path="/dashboard" element={<ProjectsListPage />} />
                      <Route path="/admin/projects" element={<ProjectManagementPage />} />
                      <Route path="/projects/:id" element={<ProjectDetailView />} />
                      <Route path="/timelogs" element={<TimeLogsPage />} />
                      <Route path="/clients" element={<ClientsPage />} />
                      <Route path="/inquiries" element={<InquiriesPage />} />
                      <Route path="/invoices" element={<InvoicesPage />} />
                      <Route path="/analytics" element={<AnalyticsPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                    </Route>
                  </Routes>
                </div>
              </ToastProvider>
            </TimerProvider>
          </AuthProvider>
        </QueryClientProvider>
      </Provider>
    </HelmetProvider>
  );
}

export default App;
