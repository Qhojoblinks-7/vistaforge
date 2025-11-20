import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching business analytics
export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const apiService = (await import('../../services/api')).default;
      const query = `
        query GetBusinessAnalytics {
          businessAnalytics
        }
      `;
      const result = await apiService.request(query);
      return JSON.parse(result.businessAnalytics);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
  lastFetched: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalytics: (state) => {
      state.data = null;
      state.error = null;
      state.lastFetched = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastFetched = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAnalytics, clearError } = analyticsSlice.actions;

// Selectors
export const selectAnalyticsData = (state) => state.analytics.data;
export const selectAnalyticsLoading = (state) => state.analytics.loading;
export const selectAnalyticsError = (state) => state.analytics.error;
export const selectAnalyticsLastFetched = (state) => state.analytics.lastFetched;

// Computed selectors for specific metrics
export const selectTotalRevenue = (state) => state.analytics.data?.totalRevenue || '$0';
export const selectTotalHours = (state) => state.analytics.data?.totalHours || '0.0';
export const selectAverageRate = (state) => state.analytics.data?.averageRate || '$0/hr';
export const selectMonthlyGrowth = (state) => state.analytics.data?.monthlyGrowth || '+0.0%';
export const selectMonthlyRevenue = (state) => state.analytics.data?.monthlyRevenue || [];
export const selectTopClients = (state) => state.analytics.data?.topClients || [];
export const selectProjectPerformance = (state) => state.analytics.data?.projectPerformance || {};
export const selectTimeTracking = (state) => state.analytics.data?.timeTracking || {};
export const selectGoals = (state) => state.analytics.data?.goals || {};

export default analyticsSlice.reducer;