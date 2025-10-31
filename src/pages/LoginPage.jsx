import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { BsArrowRight, BsShieldLock, BsEye, BsEyeSlash } from 'react-icons/bs';
import apiService from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', formData.username);
      const result = await apiService.login(formData);
      console.log('Login result:', result);

      if (result.token) {
        // Store authentication state
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminLoginTime', Date.now().toString());

        console.log('Login successful, redirecting to project management');
        // Redirect to project management
        navigate('/admin/projects');
      } else {
        setError('Login failed - no token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white min-h-screen flex items-center justify-center px-4" id="main-content">
      <Helmet>
        <title>Admin Login - VistaForge</title>
        <meta name="description" content="Admin login for project management" />
      </Helmet>

      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0015AA] rounded-full mb-4">
            <BsShieldLock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#0015AA] mb-2">Admin Access</h1>
          <p className="text-gray-600">Enter your credentials to manage projects</p>
        </div>

        {/* Login Form */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-colors"
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <BsEyeSlash /> : <BsEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0015AA] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#003366] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <BsArrowRight className="ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Back to Portfolio Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/portfolio')}
              className="text-[#0015AA] hover:text-[#FBB03B] transition-colors text-sm"
            >
              ← Back to Portfolio
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            This area is restricted to authorized personnel only.
            <br />
            All access attempts are logged and monitored.
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;