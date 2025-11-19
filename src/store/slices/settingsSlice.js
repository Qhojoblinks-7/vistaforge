import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for settings operations
export const loadSettings = createAsyncThunk(
  'settings/loadSettings',
  async (_, { rejectWithValue }) => {
    try {
      // First try to load from backend
      try {
        const apiService = (await import('../../services/api')).default;

        const query = `
          query GetAdminSettings {
            adminSettings {
              fullName
              email
              company
              phone
              defaultHourlyRate
              currency
              timezone
              language
              emailReminders
              projectUpdates
              invoiceDueReminders
              marketingEmails
              maintenanceMode
              debugMode
              backupFrequency
              theme
            }
          }
        `;

        const result = await apiService.request(query);

        if (result.adminSettings) {
          const backendSettings = {
            profile: {
              name: result.adminSettings.fullName || '',
              email: result.adminSettings.email || '',
              company: result.adminSettings.company || '',
              phone: result.adminSettings.phone || ''
            },
            preferences: {
              defaultRate: result.adminSettings.defaultHourlyRate?.toString() || '150',
              currency: result.adminSettings.currency || 'USD',
              timezone: result.adminSettings.timezone || 'Africa/Accra',
              language: result.adminSettings.language || 'en'
            },
            notifications: {
              emailReminders: result.adminSettings.emailReminders || true,
              projectUpdates: result.adminSettings.projectUpdates || true,
              invoiceDue: result.adminSettings.invoiceDueReminders || true,
              marketingEmails: result.adminSettings.marketingEmails || false
            },
            system: {
              maintenanceMode: result.adminSettings.maintenanceMode || false,
              debugMode: result.adminSettings.debugMode || false,
              backupFrequency: result.adminSettings.backupFrequency || 'daily',
              theme: result.adminSettings.theme || 'light'
            }
          };

          // Save to localStorage as backup
          localStorage.setItem('userSettings', JSON.stringify(backendSettings));
          return backendSettings;
        }
      } catch (backendError) {
        console.warn('Failed to load settings from backend, falling back to localStorage:', backendError);
      }

      // Fallback to localStorage
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }

      // Return default settings if none saved
      return {
        profile: {
          name: '',
          email: '',
          company: '',
          phone: ''
        },
        preferences: {
          defaultRate: '150',
          currency: 'USD',
          timezone: 'Africa/Accra',
          language: 'en'
        },
        notifications: {
          emailReminders: true,
          projectUpdates: true,
          invoiceDue: true,
          marketingEmails: false
        },
        system: {
          maintenanceMode: false,
          debugMode: false,
          backupFrequency: 'daily',
          theme: 'light'
        }
      };
    } catch (error) {
      return rejectWithValue('Failed to load settings');
    }
  }
);

export const saveSettings = createAsyncThunk(
  'settings/saveSettings',
  async (settings, { rejectWithValue }) => {
    try {
      // Validate settings before saving
      const errors = validateSettings(settings);
      if (errors.length > 0) {
        return rejectWithValue({ errors });
      }

      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));

      // Save to backend via GraphQL
      try {
        const apiService = (await import('../../services/api')).default;

        const mutation = `
          mutation UpdateAdminSettings($input: AdminSettingsInput!) {
            updateAdminSettings(input: $input) {
              adminSettings {
                fullName
                email
                company
                phone
                defaultHourlyRate
                currency
                timezone
                language
                emailReminders
                projectUpdates
                invoiceDueReminders
                marketingEmails
                maintenanceMode
                debugMode
                backupFrequency
                theme
              }
              success
              errors
            }
          }
        `;

        const variables = {
          input: {
            fullName: settings.profile.name,
            email: settings.profile.email,
            company: settings.profile.company,
            phone: settings.profile.phone,
            defaultHourlyRate: parseFloat(settings.preferences.defaultRate),
            currency: settings.preferences.currency,
            timezone: settings.preferences.timezone,
            language: settings.preferences.language,
            emailReminders: settings.notifications.emailReminders,
            projectUpdates: settings.notifications.projectUpdates,
            invoiceDueReminders: settings.notifications.invoiceDue,
            marketingEmails: settings.notifications.marketingEmails,
            maintenanceMode: settings.system.maintenanceMode,
            debugMode: settings.system.debugMode,
            backupFrequency: settings.system.backupFrequency,
            theme: settings.system.theme
          }
        };

        const result = await apiService.request(mutation, variables);

        if (!result.updateAdminSettings.success) {
          console.warn('Backend settings save failed:', result.updateAdminSettings.errors);
          // Don't fail the whole operation, just log the warning
        }
      } catch (backendError) {
        console.warn('Failed to save settings to backend:', backendError);
        // Don't fail the whole operation for backend issues
      }

      return settings;
    } catch (error) {
      return rejectWithValue('Failed to save settings');
    }
  }
);

// Validation helper function
const validateSettings = (settings) => {
  const errors = [];

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (settings.profile.email && !emailRegex.test(settings.profile.email)) {
    errors.push('Please enter a valid email address');
  }

  // Phone validation (basic)
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  if (settings.profile.phone && !phoneRegex.test(settings.profile.phone)) {
    errors.push('Please enter a valid phone number');
  }

  // Rate validation
  const rate = parseFloat(settings.preferences.defaultRate);
  if (isNaN(rate) || rate <= 0) {
    errors.push('Please enter a valid hourly rate');
  }

  return errors;
};

const initialState = {
  data: {
    profile: {
      name: '',
      email: '',
      company: '',
      phone: ''
    },
    preferences: {
      defaultRate: '150',
      currency: 'USD',
      timezone: 'Africa/Accra',
      language: 'en'
    },
    notifications: {
      emailReminders: true,
      projectUpdates: true,
      invoiceDue: true,
      marketingEmails: false
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      backupFrequency: 'daily',
      theme: 'light'
    }
  },
  originalData: null,
  loading: false,
  saving: false,
  error: null,
  hasChanges: false
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      state.data.profile = { ...state.data.profile, ...action.payload };
    },
    updatePreferences: (state, action) => {
      state.data.preferences = { ...state.data.preferences, ...action.payload };
    },
    updateNotifications: (state, action) => {
      state.data.notifications = { ...state.data.notifications, ...action.payload };
    },
    updateSystem: (state, action) => {
      state.data.system = { ...state.data.system, ...action.payload };
    },
    resetSettings: (state) => {
      if (state.originalData) {
        state.data = { ...state.originalData };
        state.hasChanges = false;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    checkForChanges: (state) => {
      if (state.originalData) {
        state.hasChanges = JSON.stringify(state.data) !== JSON.stringify(state.originalData);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Load settings
      .addCase(loadSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.originalData = action.payload;
        state.hasChanges = false;
      })
      .addCase(loadSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load settings';
      })

      // Save settings
      .addCase(saveSettings.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.saving = false;
        state.data = action.payload;
        state.originalData = action.payload;
        state.hasChanges = false;
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.saving = false;
        if (action.payload?.errors) {
          state.error = action.payload.errors;
        } else {
          state.error = action.payload || 'Failed to save settings';
        }
      });
  }
});

export const {
  updateProfile,
  updatePreferences,
  updateNotifications,
  updateSystem,
  resetSettings,
  clearError,
  checkForChanges
} = settingsSlice.actions;

export default settingsSlice.reducer;