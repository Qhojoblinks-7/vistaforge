import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for fetching financial data
export const fetchInvoices = createAsyncThunk(
  'financialMetrics/fetchInvoices',
  async () => {
    const apiService = (await import('../../services/api')).default;
    return await apiService.getInvoices();
  }
);

export const fetchTimeLogs = createAsyncThunk(
  'financialMetrics/fetchTimeLogs',
  async () => {
    const apiService = (await import('../../services/api')).default;
    return await apiService.getTimeLogs();
  }
);

const initialState = {
  invoices: [],
  timeLogs: [],
  loading: false,
  error: null,
};

const financialMetricsSlice = createSlice({
  name: 'financialMetrics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload || [];
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch time logs
      .addCase(fetchTimeLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.timeLogs = action.payload || [];
      })
      .addCase(fetchTimeLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = financialMetricsSlice.actions;

// Selectors for calculated metrics
export const selectUnbilledAmount = (state) => {
  const billableTimeLogs = state.financialMetrics.timeLogs.filter(log => log.isBillable);
  return billableTimeLogs.reduce((sum, log) => sum + parseFloat(log.durationMinutes / 60), 0) || 0;
};

export const selectTotalRevenue = (state) => {
  const paidInvoices = state.financialMetrics.invoices.filter(inv => inv.status === 'PAID');
  return paidInvoices.reduce((sum, inv) => sum + parseFloat(inv.total), 0) || 0;
};

export const selectOverdueInvoices = (state) => {
  const now = new Date();
  return state.financialMetrics.invoices.filter(inv =>
    inv.status === 'SENT' && new Date(inv.dueDate) < now
  ).length || 0;
};

export default financialMetricsSlice.reducer;