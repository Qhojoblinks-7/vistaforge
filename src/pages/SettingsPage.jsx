import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { BsGear, BsPerson, BsBell, BsShield, BsCreditCard, BsSave, BsCheckCircle, BsExclamationTriangle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  loadSettings,
  saveSettings,
  updateProfile,
  updatePreferences,
  updateNotifications,
  updateSystem,
  resetSettings,
  checkForChanges,
  clearError
} from '../store/slices/settingsSlice';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { data: settings, loading, saving, error, hasChanges } = useSelector((state) => state.settings);

  // Load settings on component mount
  useEffect(() => {
    dispatch(loadSettings());
  }, [dispatch]);

  // Show error messages
  useEffect(() => {
    if (error) {
      if (Array.isArray(error)) {
        error.forEach(err => toast.error(err));
      } else {
        toast.error(error);
      }
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleProfileChange = (field, value) => {
    dispatch(updateProfile({ [field]: value }));
    dispatch(checkForChanges());
  };

  const handlePreferenceChange = (field, value) => {
    dispatch(updatePreferences({ [field]: value }));
    dispatch(checkForChanges());
  };

  const handleNotificationChange = (field, value) => {
    dispatch(updateNotifications({ [field]: value }));
    dispatch(checkForChanges());
  };

  const handleSystemChange = (field, value) => {
    dispatch(updateSystem({ [field]: value }));
    dispatch(checkForChanges());
  };

  const handleSave = async () => {
    try {
      const result = await dispatch(saveSettings(settings)).unwrap();
      toast.success('Settings saved successfully!', {
        icon: <BsCheckCircle className="text-green-500" />,
        duration: 3000,
      });
    } catch (error) {
      // Error handling is done in the slice and useEffect above
      console.error('Save failed:', error);
    }
  };

  const handleReset = () => {
    dispatch(resetSettings());
    toast.info('Settings reset to last saved state');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0015AA]"></div>
            <span className="ml-3 text-gray-600">Loading settings...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <Helmet>
          <title>Settings - Freespec</title>
          <meta name="description" content="Manage your account settings and preferences" />
        </Helmet>

        {/* Header */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl -mx-4 -mt-4"></div>
          <div className="relative px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Settings</h1>
            <p className="text-base text-gray-600">Manage your account settings and preferences</p>
            <div className="flex items-center space-x-2 mt-4">
              <div className="w-12 h-1 bg-gradient-to-r from-[#FBB03B] to-[#0015AA] rounded-full"></div>
              <div className="w-2 h-2 bg-[#0015AA] rounded-full"></div>
              <div className="w-1 h-1 bg-[#FBB03B] rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Profile Settings */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-8">
              <div className="p-3 bg-[#0015AA]/10 rounded-lg mr-4">
                <BsPerson className="text-[#0015AA]" size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Profile Information</h2>
                <p className="text-gray-600 text-xs">Update your personal details and contact information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Full Name</label>
                <input
                  type="text"
                  value={settings.profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Company</label>
                <input
                  type="text"
                  value={settings.profile.company}
                  onChange={(e) => handleProfileChange('company', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  placeholder="Your company name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Phone Number</label>
                <input
                  type="tel"
                  value={settings.profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-8">
              <div className="p-3 bg-[#FBB03B]/10 rounded-lg mr-4">
                <BsGear className="text-[#FBB03B]" size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">System Settings</h2>
                <p className="text-gray-600 text-xs">Configure system preferences and maintenance options</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Maintenance Mode</h3>
                  <p className="text-xs text-gray-600">Enable maintenance mode to temporarily disable the website</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-6">
                  <input
                    type="checkbox"
                    checked={settings.system.maintenanceMode}
                    onChange={(e) => handleSystemChange('maintenanceMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FBB03B]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#FBB03B] peer-checked:to-[#E0A030] shadow-sm"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Debug Mode</h3>
                  <p className="text-xs text-gray-600">Enable debug logging for troubleshooting</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-6">
                  <input
                    type="checkbox"
                    checked={settings.system.debugMode}
                    onChange={(e) => handleSystemChange('debugMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FBB03B]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#FBB03B] peer-checked:to-[#E0A030] shadow-sm"></div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Backup Frequency</label>
                <select
                  value={settings.system.backupFrequency}
                  onChange={(e) => handleSystemChange('backupFrequency', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:border-transparent transition-all duration-200 hover:border-gray-300 appearance-none bg-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Theme</label>
                <select
                  value={settings.system.theme}
                  onChange={(e) => handleSystemChange('theme', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:border-transparent transition-all duration-200 hover:border-gray-300 appearance-none bg-white"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-8">
              <div className="p-3 bg-[#FBB03B]/10 rounded-lg mr-4">
                <BsGear className="text-[#FBB03B]" size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">User Preferences</h2>
                <p className="text-gray-600 text-xs">Configure your default settings and regional preferences</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Default Hourly Rate</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <input
                    type="number"
                    value={settings.preferences.defaultRate}
                    onChange={(e) => handlePreferenceChange('defaultRate', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg pl-8 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                      placeholder="150"
                    />
                  </div>
                </div>
  
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Currency</label>
                  <select
                    value={settings.preferences.currency}
                    onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:border-transparent transition-all duration-200 hover:border-gray-300 appearance-none bg-white"
                  >
                    <option value="USD">USD - US Dollar ($)</option>
                    <option value="EUR">EUR - Euro (€)</option>
                    <option value="GBP">GBP - British Pound (£)</option>
                    <option value="GHS">GHS - Ghanaian Cedi (₵)</option>
                  </select>
                </div>
  
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Timezone</label>
                  <select
                    value={settings.preferences.timezone}
                    onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:border-transparent transition-all duration-200 hover:border-gray-300 appearance-none bg-white"
                  >
                    <option value="Africa/Accra">Africa/Accra (GMT+0)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                  </select>
                </div>
  
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Language</label>
                  <select
                    value={settings.preferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:border-transparent transition-all duration-200 hover:border-gray-300 appearance-none bg-white"
                  >
                    <option value="en">English</option>
                    <option value="es">Español - Spanish</option>
                    <option value="fr">Français - French</option>
                  </select>
                </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-8">
              <div className="p-3 bg-[#0015AA]/10 rounded-lg mr-4">
                <BsBell className="text-[#0015AA]" size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Notifications</h2>
                <p className="text-gray-600 text-xs">Choose what notifications you'd like to receive</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Email Reminders</h3>
                  <p className="text-xs text-gray-600">Receive reminders about upcoming deadlines and important dates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-6">
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailReminders}
                    onChange={(e) => handleNotificationChange('emailReminders', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0015AA]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#0015AA] peer-checked:to-[#0033AA] shadow-sm"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Project Updates</h3>
                  <p className="text-xs text-gray-600">Get notified about project status changes and milestones</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-6">
                  <input
                    type="checkbox"
                    checked={settings.notifications.projectUpdates}
                    onChange={(e) => handleNotificationChange('projectUpdates', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0015AA]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#0015AA] peer-checked:to-[#0033AA] shadow-sm"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Invoice Due Reminders</h3>
                  <p className="text-sm text-gray-600">Reminders for upcoming invoice due dates and payments</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-6">
                  <input
                    type="checkbox"
                    checked={settings.notifications.invoiceDue}
                    onChange={(e) => handleNotificationChange('invoiceDue', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0015AA]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#0015AA] peer-checked:to-[#0033AA] shadow-sm"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Marketing Emails</h3>
                  <p className="text-sm text-gray-600">Receive updates about new features, tips, and platform news</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-6">
                  <input
                    type="checkbox"
                    checked={settings.notifications.marketingEmails}
                    onChange={(e) => handleNotificationChange('marketingEmails', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0015AA]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#0015AA] peer-checked:to-[#0033AA] shadow-sm"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              {hasChanges && (
                <div className="flex items-center text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                  <BsExclamationTriangle className="mr-2" size={16} />
                  You have unsaved changes
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              {hasChanges && (
                <button
                  onClick={handleReset}
                  className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  disabled={saving}
                >
                  Reset
                </button>
              )}

              <button
                onClick={handleSave}
                disabled={saving || loading || !hasChanges}
                className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 flex items-center border-2 ${
                  saving || loading || !hasChanges
                    ? 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#0015AA] to-[#0033AA] text-white border-[#0015AA] hover:border-[#0033AA] hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <BsSave className="mr-3" size={20} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;