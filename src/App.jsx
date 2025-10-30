import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { store } from './store';
const Header = lazy(() => import('./components/Header'));
const Footer = lazy(() => import('./components/Footer'));

// Use React.lazy() to dynamically import page components
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const ProjectManagementPage = lazy(() => import('./pages/ProjectManagementPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <Router>
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#0015AA] text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:ring-offset-2"
          >
            Skip to main content
          </a>

          {/* Conditionally render Header and Footer based on route */}
          {window.location.pathname.startsWith('/admin') ? null : <Header />}

          {/* Wrap your Routes in a Suspense component */}
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />
              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/admin/projects" element={<ProjectManagementPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </Suspense>

          {/* Conditionally render Footer based on route */}
          {window.location.pathname.startsWith('/admin') ? null : <Footer />}
        </Router>
      </HelmetProvider>
    </Provider>
  );
}

export default App;
