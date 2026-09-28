// Analytics utility for GA4 and custom events
// Replace GA_MEASUREMENT_ID with your actual GA4 measurement ID (G-XXXXXXXXXX)

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN || 'vistaforge.com';

let isGAInitialized = false;
let isPlausibleInitialized = false;

// Initialize GA4
export const initGA = () => {
  if (typeof window === 'undefined' || isGAInitialized) return;
  
  // Check if already loaded
  if (window.gtag) {
    isGAInitialized = true;
    return;
  }

  // Add GA4 script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    send_page_view: true
  });

  isGAInitialized = true;
};

// Initialize Plausible
export const initPlausible = () => {
  if (typeof window === 'undefined' || isPlausibleInitialized) return;

  const script = document.createElement('script');
  script.defer = true;
  script.dataset.domain = PLAUSIBLE_DOMAIN;
  script.src = 'https://plausible.io/js/script.js';
  document.head.appendChild(script);

  isPlausibleInitialized = true;
};

// Initialize all analytics
export const initAnalytics = () => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
    initGA();
    initPlausible();
  }
};

// Track page view
export const trackPageView = (path, title) => {
  if (typeof window === 'undefined') return;
  
  if (window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title,
      send_page_view: true
    });
  }
  
  if (window.plausible) {
    window.plausible('pageview', { u: path });
  }
};

// Track custom events
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window === 'undefined') return;
  
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
  }
  
  if (window.plausible) {
    window.plausible(eventName, { props: parameters });
  }
};

// Conversion events
export const trackConversion = {
  // Wizard events
  wizardStarted: (service) => trackEvent('wizard_started', { service }),
  wizardStepCompleted: (step, value) => trackEvent('wizard_step_completed', { step, value }),
  wizardCompleted: (data) => trackEvent('wizard_completed', { 
    service: data.service, 
    budget: data.budget, 
    timeline: data.timeline 
  }),
  
  // Calendly events
  calendlyOpened: () => trackEvent('calendly_opened'),
  calendlyBookingStarted: () => trackEvent('calendly_booking_started'),
  calendlyBooked: (eventType) => trackEvent('calendly_booked', { event_type: eventType }),
  
  // Contact form
  contactFormSubmitted: (serviceType) => trackEvent('contact_form_submitted', { service_type: serviceType }),
  contactFormSuccess: () => trackEvent('contact_form_success'),
  
  // CTA clicks
  ctaClick: (location, label) => trackEvent('cta_click', { location, label }),
  
  // Case study views
  caseStudyViewed: (slug) => trackEvent('case_study_viewed', { slug }),
  
  // Portfolio interactions
  portfolioProjectClicked: (projectId, projectName) => trackEvent('portfolio_project_clicked', { project_id: projectId, project_name: projectName }),
  
  // Service interest
  serviceSelected: (service) => trackEvent('service_selected', { service }),
  
  // Navigation
  navItemClicked: (item) => trackEvent('nav_item_clicked', { item })
};

// Scroll depth tracking
export const initScrollDepthTracking = () => {
  if (typeof window === 'undefined') return;
  
  const milestones = [25, 50, 75, 100];
  const tracked = new Set();
  
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);
    
    milestones.forEach(milestone => {
      if (scrollPercent >= milestone && !tracked.has(milestone)) {
        tracked.add(milestone);
        trackEvent('scroll_depth', { percent: milestone });
      }
    });
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
};

// Form interaction tracking
export const trackFormInteraction = (formName, fieldName, action) => {
  trackEvent('form_interaction', { form_name: formName, field_name: fieldName, action });
};

// Time on page tracking
export const initTimeOnPageTracking = () => {
  if (typeof window === 'undefined') return;
  
  const startTime = Date.now();
  const intervals = [10, 30, 60, 120, 300]; // seconds
  const tracked = new Set();
  
  const checkTime = () => {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    intervals.forEach(interval => {
      if (elapsed >= interval && !tracked.has(interval)) {
        tracked.add(interval);
        trackEvent('time_on_page', { seconds: interval });
      }
    });
  };
  
  const interval = setInterval(checkTime, 5000);
  return () => clearInterval(interval);
};

// Export all
export default {
  initAnalytics,
  trackPageView,
  trackEvent,
  trackConversion,
  initScrollDepthTracking,
  trackFormInteraction,
  initTimeOnPageTracking
};