import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { BsArrowRight, BsArrowLeft, BsCheckCircle, BsCalendar3 } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { trackConversion } from '../utils/analytics';

// Calendly URL - replace with your actual Calendly link
const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL || 'https://calendly.com/vistaforge/30min';

const steps = [
  {
    id: 'service',
    title: 'What do you need?',
    subtitle: 'Select the service that best matches your goals',
    icon: 'ðŸŽ¯',
    options: [
      { value: 'BRANDING', label: 'Brand Identity & Logo', description: 'Logo, brand guidelines, visual identity system', price: 'â‚µ2,000â€“â‚µ5,000' },
      { value: 'WEB_DESIGN', label: 'Website Design', description: 'UI/UX design, responsive layouts, design system', price: 'â‚µ1,200â€“â‚µ4,500' },
      { value: 'WEB_DEV', label: 'Web Development', description: 'Custom development, CMS, e-commerce, web apps', price: 'â‚µ3,500â€“â‚µ15,000+' },
      { value: 'UI_UX', label: 'UI/UX Design', description: 'Product design, wireframes, prototypes, usability', price: 'â‚µ1,200â€“â‚µ4,500' },
      { value: 'MOBILE_APP', label: 'Mobile App', description: 'iOS/Android app design & development', price: 'â‚µ5,000â€“â‚µ25,000+' },
      { value: 'SEO', label: 'SEO & Digital Marketing', description: 'Search optimization, content strategy, ads', price: 'â‚µ800â€“â‚µ3,000/mo' },
    ]
  },
  {
    id: 'budget',
    title: 'What\'s your budget range?',
    subtitle: 'This helps us scope the right solution for you',
    icon: 'ðŸ’°',
    options: [
      { value: 'V_UNDER_1K', label: 'Under $1,000', description: 'Starter projects, simple deliverables' },
      { value: 'V_SMALL_1K_5K', label: '$1,000 â€“ $5,000', description: 'Small business branding, basic websites' },
      { value: 'V_MID_5K_10K', label: '$5,000 â€“ $10,000', description: 'Complete brand identity, custom websites' },
      { value: 'V_MID_10K_25K', label: '$10,000 â€“ $25,000', description: 'Full brand + digital product, e-commerce' },
      { value: 'V_LARGE_25K_50K', label: '$25,000 â€“ $50,000', description: 'Complex platforms, multi-channel campaigns' },
      { value: 'V_OVER_50K', label: 'Over $50,000', description: 'Enterprise solutions, ongoing partnerships' },
      { value: 'V_DISCUSS', label: 'Let\'s discuss', description: 'Not sure yet, need guidance on scope' },
    ]
  },
  {
    id: 'timeline',
    title: 'When do you need it?',
    subtitle: 'Timeline helps us plan resources and delivery',
    icon: 'ðŸ“…',
    options: [
      { value: 'ASAP', label: 'ASAP (1-2 weeks)', description: 'Urgent - rush delivery available' },
      { value: '1_MONTH', label: 'Within 1 month', description: 'Standard timeline for most projects' },
      { value: '2_3_MONTHS', label: '2-3 months', description: 'Comprehensive projects with research phase' },
      { value: '3_6_MONTHS', label: '3-6 months', description: 'Large scale, phased delivery' },
      { value: 'FLEXIBLE', label: 'Flexible / No rush', description: 'Open to your recommended timeline' },
    ]
  },
  {
    id: 'details',
    title: 'Tell us about your project',
    subtitle: 'The more context, the better we can prepare',
    icon: 'ðŸ“',
    isTextArea: true,
    placeholder: 'Describe your business, target audience, goals, inspiration, or any specific requirements...'
  }
];

const ProjectStarterWizard = ({ onComplete, isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCalendly, setShowCalendly] = useState(false);
  const [formData, setFormData] = useState({
    service: '',
    budget: '',
    timeline: '',
    details: '',
  });
  const [errors, setErrors] = useState({});

  const transition = useSpring({
    from: { opacity: 0, transform: 'translateX(30px)' },
    to: { opacity: 1, transform: 'translateX(0px)' },
    config: { tension: 200, friction: 20 },
    key: currentStep,
  });

  const progressSpring = useSpring({
    to: { width: `${((currentStep + 1) / steps.length) * 100}%` },
    config: { tension: 200, friction: 20 },
  });

  const getStepError = () => {
    const step = steps[currentStep];
    const value = formData[step.id];
    if (step.isTextArea) {
      if (!value || value.trim().length < 20) {
        return 'Please provide at least 20 characters';
      }
    } else if (!value) {
      return 'Please select an option';
    }
    return null;
  };

  const isStepValid = getStepError() === null;

  // Track wizard opened
  useEffect(() => {
    if (isOpen && currentStep === 0 && formData.service === '') {
      trackConversion.wizardStarted('unknown');
    }
  }, [isOpen, currentStep, formData.service]);

  const validateStep = () => {
    const error = getStepError();
    if (error) {
      setErrors({ [steps[currentStep].id]: error });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (currentStep < steps.length - 1) {
      const step = steps[currentStep];
      trackConversion.wizardStepCompleted(step.id, formData[step.id]);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOptionSelect = (value) => {
    const step = steps[currentStep];
    setFormData(prev => ({ ...prev, [step.id]: value }));
    setErrors(prev => ({ ...prev, [step.id]: undefined }));
    
    // Track analytics
    if (step.id === 'service') {
      trackConversion.serviceSelected(value);
      trackConversion.wizardStepCompleted('service', value);
    } else if (step.id === 'budget') {
      trackConversion.wizardStepCompleted('budget', value);
    } else if (step.id === 'timeline') {
      trackConversion.wizardStepCompleted('timeline', value);
    }
  };

  const handleTextChange = (e) => {
    const step = steps[currentStep];
    setFormData(prev => ({ ...prev, [step.id]: e.target.value }));
    setErrors(prev => ({ ...prev, [step.id]: undefined }));
  };

  const handleSubmit = () => {
    if (!validateStep()) return;
    // Store form data and show Calendly step
    localStorage.setItem('projectStarterData', JSON.stringify(formData));
    trackConversion.wizardCompleted(formData);
    trackConversion.calendlyOpened();
    setShowCalendly(true);
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  // Calendly embed handler
  useEffect(() => {
    if (showCalendly && window.Calendly) {
      window.Calendly.initInlineWidget({
        url: CALENDLY_URL,
        parentElement: document.getElementById('calendly-widget'),
        prefill: {
          name: '',
          email: '',
          customAnswers: {
            'Service Interest': formData.service,
            'Budget Range': formData.budget,
            'Timeline': formData.timeline,
            'Project Details': formData.details,
          }
        }
      });
    }
  }, [showCalendly, formData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <animated.div
          style={transition}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Progress Bar */}
          <div className="h-1 bg-gray-100">
            <animated.div style={progressSpring} className="h-full bg-[#FBB03B] rounded-full transition-all duration-500" />
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    index < currentStep
                      ? 'bg-[#FBB03B] text-white'
                      : index === currentStep && !showCalendly
                      ? 'bg-[#0015AA] text-white'
                      : showCalendly && index === steps.length - 1
                      ? 'bg-[#FBB03B] text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {index < currentStep ? <BsCheckCircle size={16} /> : showCalendly && index === steps.length ? <BsCalendar3 size={16} /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden md:block w-12 h-0.5 mx-2 transition-all duration-300 ${
                      index < currentStep ? 'bg-[#FBB03B]' : showCalendly && index === steps.length - 1 ? 'bg-[#FBB03B]' : 'bg-gray-100'
                    }`}
                  />
                )}
              </div>
            ))}
            {showCalendly && (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-[#FBB03B] text-white">
                  <BsCalendar3 size={16} />
                </div>
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            aria-label="Close wizard"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="p-6 md:p-8">
            {showCalendly ? (
              // Calendly Step
              <animated.div style={transition} className="min-h-[400px]">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#FBB03B]/10 rounded-full flex items-center justify-center text-3xl">
                    <BsCalendar3 className="text-[#FBB03B]" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#0015AA]">
                    Book Your Free Consultation
                  </h2>
                  <p className="mt-2 text-gray-600 max-w-lg mx-auto">
                    Pick a time that works for you. We'll review your project details beforehand and come prepared with ideas.
                  </p>
                </div>

                {/* Calendly Widget Container */}
                <div id="calendly-widget" className="w-full min-h-[500px] rounded-xl border border-gray-200 overflow-hidden">
                  {/* Calendly will be embedded here */}
                </div>

                {/* Fallback link if Calendly fails to load */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 mb-3">Having trouble with the calendar?</p>
                  <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#0015AA] hover:text-[#FBB03B] font-medium transition-colors"
                  >
                    Open Calendly in new tab <BsArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </div>

                {/* Summary of what they selected */}
                <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-4 text-center">Your Project Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Service</p>
                      <p className="font-medium text-gray-900">
                        {steps.find(s => s.id === 'service')?.options.find(o => o.value === formData.service)?.label || formData.service}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Budget</p>
                      <p className="font-medium text-gray-900">
                        {steps.find(s => s.id === 'budget')?.options.find(o => o.value === formData.budget)?.label || formData.budget}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Timeline</p>
                      <p className="font-medium text-gray-900">
                        {steps.find(s => s.id === 'timeline')?.options.find(o => o.value === formData.timeline)?.label || formData.timeline}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Details</p>
                      <p className="font-medium text-gray-900 max-h-12 overflow-hidden text-ellipsis whitespace-pre-wrap">
                        {formData.details}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-center space-x-4">
                  <button
                    onClick={() => {
                      trackConversion.calendlyBookingStarted();
                      setShowCalendly(false);
                      onComplete(formData);
                    }}
                    className="flex items-center bg-[#0015AA] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <BsCheckCircle className="mr-2" />
                    Done - Continue to Site
                  </button>
                </div>
              </animated.div>
            ) : (
              // Regular Steps
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#0015AA]/10 rounded-full flex items-center justify-center text-3xl">
                    {currentStepData.icon}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#0015AA]">
                    {currentStepData.title}
                  </h2>
                  <p className="mt-2 text-gray-600">{currentStepData.subtitle}</p>
                </div>

                {/* Step Content */}
                <animated.div style={transition} className="min-h-[200px]">
                  {currentStepData.isTextArea ? (
                    <div>
                      <textarea
                        value={formData.details}
                        onChange={handleTextChange}
                        placeholder={currentStepData.placeholder}
                        rows={6}
                        className={`w-full px-4 py-4 border-2 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FBB03B] transition-colors resize-none ${
                          errors.details ? 'border-red-400' : 'border-gray-200'
                        }`}
                        aria-describedby={errors.details ? 'details-error' : undefined}
                      />
                      {errors.details && (
                        <p id="details-error" className="mt-2 text-sm text-red-500">{errors.details}</p>
                      )}
                      <p className="mt-3 text-sm text-gray-500 text-right">
                        {formData.details.length}/500 characters
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentStepData.options.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleOptionSelect(option.value)}
                          className={`p-4 md:p-6 rounded-xl border-2 text-left transition-all duration-200 group ${
                            formData[currentStepData.id] === option.value
                              ? 'border-[#FBB03B] bg-[#FBB03B]/10 shadow-lg shadow-[#FBB03B]/10'
                              : 'border-gray-200 hover:border-[#0015AA]/30 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 group-hover:text-[#0015AA]">
                                {option.label}
                              </h3>
                              <p className="mt-1 text-sm text-gray-600">{option.description}</p>
                              {option.price && (
                                <p className="mt-2 text-sm font-medium text-[#FBB03B]">{option.price}</p>
                              )}
                            </div>
                            {formData[currentStepData.id] === option.value && (
                              <BsCheckCircle className="w-6 h-6 text-[#FBB03B] flex-shrink-0 ml-2" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </animated.div>

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-100">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="flex items-center text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <BsArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </button>

                  <div className="flex items-center space-x-3">
                    {currentStep === 0 && (
                      <button
                        onClick={onClose}
                        className="px-6 py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors"
                      >
                        Skip for now
                      </button>
                    )}
                    <button
                      onClick={isLastStep ? handleSubmit : handleNext}
                      disabled={!isStepValid}
                      className="flex items-center bg-[#FBB03B] text-[#0015AA] font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLastStep ? 'Get My Quote' : 'Next'}
                      <BsArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </animated.div>
      </div>
    </div>
  );
};

export default ProjectStarterWizard;