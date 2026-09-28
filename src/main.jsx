import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { initAnalytics, trackPageView, initScrollDepthTracking, initTimeOnPageTracking } from './utils/analytics'

// Initialize analytics
initAnalytics();

const AnalyticsWrapper = () => {
  useEffect(() => {
    const cleanupScroll = initScrollDepthTracking();
    const cleanupTime = initTimeOnPageTracking();
    return () => {
      cleanupScroll();
      cleanupTime();
    };
  }, []);

  return null;
};

const RouteTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    trackPageView(location.pathname, document.title);
  }, [location.pathname]);

  return null;
};

const RootApp = () => {
  return (
    <BrowserRouter>
      <RouteTracker />
      <App />
    </BrowserRouter>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AnalyticsWrapper />
      <RootApp />
    </ErrorBoundary>
  </StrictMode>,
)