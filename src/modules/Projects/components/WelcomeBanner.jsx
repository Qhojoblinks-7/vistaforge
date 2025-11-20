import React from 'react';
import { BsSun, BsCalendar, BsClock, BsCheckCircle, BsExclamationTriangle } from 'react-icons/bs';
import profileImage from '../../../assets/profile.png';
const WelcomeBanner = () => {
  const currentHour = new Date().getHours();
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getGreeting = () => {
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <section className="relative bg-[#0015AA] text-white py-8 px-4 sm:py-12 sm:px-6 lg:py-16 lg:px-8 overflow-hidden">
      {/* Modern Abstract Background */}
      <div className="absolute top-0 left-0 w-full h-full">
        {/* Flowing wave pattern */}
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 300 Q300 200 600 300 T1200 300 L1200 600 L0 600 Z" fill="#FBB03B" opacity="0.08" />
            <path d="M0 400 Q400 300 800 400 T1200 400 L1200 600 L0 600 Z" fill="#0015AA" opacity="0.15" />
          </svg>
        </div>

        {/* Striped squares and circles at the top */}
        <div className="absolute top-4 left-4 w-8 h-8 md:w-16 md:h-16 bg-gradient-to-br from-[#FBB03B] to-[#0015AA] opacity-20 transform rotate-12 animate-pulse-slow" style={{backgroundImage: 'repeating-linear-gradient(45deg, #FBB03B 0px, #FBB03B 2px, #0015AA 2px, #0015AA 4px)'}}></div>
        <div className="absolute top-8 right-8 w-6 h-6 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#0015AA] to-[#FBB03B] opacity-25 animate-bounce-slow" style={{backgroundImage: 'repeating-conic-gradient(from 0deg, #0015AA 0deg, #0015AA 10deg, #FBB03B 10deg, #FBB03B 20deg)'}}></div>
        <div className="absolute top-2 left-1/3 w-5 h-5 md:w-10 md:h-10 bg-gradient-to-br from-[#FBB03B] to-[#0015AA] opacity-30 transform rotate-45 animate-spin-slow" style={{backgroundImage: 'repeating-linear-gradient(-45deg, #FBB03B 0px, #FBB03B 2px, #0015AA 2px, #0015AA 4px)'}}></div>
        <div className="absolute top-12 left-2/3 w-7 h-7 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#0015AA] to-[#FBB03B] opacity-20 animate-ping" style={{backgroundImage: 'repeating-conic-gradient(from 45deg, #0015AA 0deg, #0015AA 15deg, #FBB03B 15deg, #FBB03B 30deg)'}}></div>

        {/* Floating geometric elements */}
        <div className="absolute top-20 right-4 md:right-20 w-16 h-16 md:w-32 md:h-32 border-2 border-[#FBB03B] opacity-30 rotate-45 animate-pulse-slow"></div>
        <div className="absolute bottom-32 left-4 md:left-16 w-12 h-12 md:w-24 md:h-24 bg-[#FBB03B] opacity-20 rounded-full animate-bounce-slow"></div>
        <div className="absolute top-1/2 left-1/4 w-8 h-8 md:w-16 md:h-16 bg-blue-400 opacity-25 transform rotate-12 animate-spin-slow"></div>
        <div className="absolute top-10 left-10 w-6 h-6 md:w-12 md:h-12 bg-purple-400 opacity-20 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-1/3 w-10 h-10 md:w-20 md:h-20 border border-[#FBB03B] opacity-25 transform rotate-30 animate-pulse-slow"></div>
        <div className="absolute top-3/4 right-10 w-4 h-4 md:w-8 md:h-8 bg-green-400 opacity-30 rounded-full animate-bounce-slow"></div>

        {/* Additional floating shapes */}
        <div className="absolute top-1/4 right-1/4 w-5 h-5 md:w-10 md:h-10 bg-pink-400 opacity-25 transform rotate-60 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/2 w-7 h-7 md:w-14 md:h-14 border-2 border-cyan-400 opacity-20 rounded-full animate-spin-slow"></div>
        <div className="absolute top-2/3 left-1/3 w-3 h-3 md:w-6 md:h-6 bg-indigo-400 opacity-30 transform rotate-45 animate-bounce-slow"></div>
        <div className="absolute bottom-10 right-1/4 w-9 h-9 md:w-18 md:h-18 bg-teal-400 opacity-20 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-2/3 w-4 h-4 md:w-8 md:h-8 border border-lime-400 opacity-25 transform rotate-30 animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 left-1/5 w-6 h-6 md:w-12 md:h-12 bg-orange-400 opacity-25 rounded-full animate-bounce-slow"></div>
        <div className="absolute top-1/6 left-3/4 w-5 h-5 md:w-10 md:h-10 border-2 border-violet-400 opacity-20 transform rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-2/3 right-1/5 w-3 h-3 md:w-6 md:h-6 bg-rose-400 opacity-30 rounded-full animate-ping"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #FBB03B 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      <div className="container mx-auto flex flex-col md:flex-row items-center relative z-10 md:pl-20">
        {/* Left Side: Text Content */}
        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          {/* Main greeting with icon */}
          <div className="flex items-center justify-center md:justify-start mb-6">
            <BsSun className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#FBB03B] mr-2 sm:mr-4 animate-pulse-slow" />
            <h1 className="text-xl sm:whitespace-nowrap sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
              {getGreeting()}, Blinks!
            </h1>
          </div>

          {/* Welcome message */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mb-6 text-white opacity-90 font-medium">
            Welcome to your project management dashboard. Here's an overview of your current projects and tasks.
          </p>

          {/* Date and time with icons */}
          <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-2 sm:gap-3 mb-6 sm:mb-8 text-white opacity-80">
            <div className="flex items-center space-x-2">
              <BsCalendar className="w-4 h-4 text-[#FBB03B]" />
              <span className="text-xs sm:text-sm md:text-base font-medium">{currentDate}</span>
            </div>
            <div className="hidden sm:block text-[#FBB03B]">•</div>
            <div className="flex items-center space-x-2">
              <BsClock className="w-4 h-4 text-[#FBB03B]" />
              <span className="text-xs sm:text-sm md:text-base font-medium">{currentTime}</span>
            </div>
          </div>

        </div>

        {/* Right Side: Profile Image */}
        <div className="md:w-1/2 flex justify-center md:justify-end relative md:pr-20">
          <div className="relative w-48 h-64 md:w-72 md:h-96 overflow-hidden rounded-t-lg -mt-8 md:-mt-12 ">
            {/* Profile Image */}
            <img
              src={profileImage}
              alt="Blinks - Profile Photo"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />

            {/* Fallback placeholder */}
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center" style={{ display: 'none' }}>
              <div className="text-gray-600 text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-400 rounded-full flex items-center justify-center">
                  <BsSun className="w-12 h-12 text-gray-500" />
                </div>
                <p className="text-sm font-medium">Profile Image</p>
                <p className="text-xs text-gray-500 mt-1">Replace with actual photo</p>
              </div>
            </div>

            {/* Gradient overlay at bottom for blending */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0015AA] to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeBanner;