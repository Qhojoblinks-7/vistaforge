import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Cross-slice imports for interconnected relationships
import { fetchClients } from '../../modules/Clients/services/clientsSlice';
import { fetchProjects } from '../../modules/Projects/services/projectsSlice';
import { fetchInvoices } from './invoicesSlice';

// Backend-integrated time logging actions
export const createTimeLogWithRelationships = (timeLogData) => async (dispatch, getState) => {
  try {
    // Create time log - backend automatically updates client balance
    const result = await dispatch(createTimeLog(timeLogData)).unwrap();

    // Backend automatically:
    // - Updates client's outstanding_balance if billable
    // - Calculates total_cost based on hourly_rate
    // - Updates TimeLog.total_cost property

    // Sync frontend state with backend changes
    await Promise.all([
      dispatch(fetchClients()), // Refresh client balances
      dispatch(fetchProjects()), // Refresh project financials
      dispatch(fetchInvoices()) // Refresh invoice contexts
    ]);

    return result;
  } catch (error) {
    console.error('Failed to create time log with relationships:', error);
    throw error;
  }
};

export const updateTimeLogWithRelationships = (timeLogId, updateData) => async (dispatch, getState) => {
  try {
    // Update time log - backend handles balance adjustments
    const result = await dispatch(updateTimeLog({ id: timeLogId, data: updateData })).unwrap();

    // Backend automatically recalculates balances and costs

    // Sync frontend state
    await Promise.all([
      dispatch(fetchClients()),
      dispatch(fetchProjects()),
      dispatch(fetchInvoices())
    ]);

    return result;
  } catch (error) {
    console.error('Failed to update time log with relationships:', error);
    throw error;
  }
};

// Async thunks for time logs operations
export const fetchTimeLogs = createAsyncThunk(
  'timeLogs/fetchTimeLogs',
  async (params = {}) => {
    const query = `
      query GetTimeLogs {
        allTimeLogs {
          id
          user {
            id
            username
            email
          }
          client {
            id
            name
            company
          }
          startTime
          endTime
          durationMinutes
          description
          taskName
          status
          isBillable
          hourlyRate
          createdAt
          updatedAt
          durationHours
          totalCost
        }
        timeLogAnalytics
      }
    `;

    const apiService = (await import('../../services/api')).default;
    const result = await apiService.request(query, {});
    return {
      timeLogs: result.allTimeLogs || [],
      analytics: result.timeLogAnalytics || {}
    };
  }
);

export const createTimeLog = createAsyncThunk(
  'timeLogs/createTimeLog',
  async (timeLogData) => {
    const mutation = `
      mutation CreateTimeLog($input: TimeLogInput!) {
        createTimeLog(input: $input) {
          timeLog {
            id
            user {
              id
              username
              email
            }
            client {
              id
              name
              company
            }
            startTime
            endTime
            durationMinutes
            description
            taskName
            status
            isBillable
            hourlyRate
            createdAt
            updatedAt
            durationHours
            totalCost
          }
        }
      }
    `;

    const apiService = (await import('../../services/api')).default;
    const result = await apiService.request(mutation, { input: timeLogData });
    return result.createTimeLog.timeLog;
  }
);

export const updateTimeLog = createAsyncThunk(
  'timeLogs/updateTimeLog',
  async ({ id, data }) => {
    const mutation = `
      mutation UpdateTimeLog($id: ID!, $input: TimeLogInput!) {
        updateTimeLog(id: $id, input: $input) {
          timeLog {
            id
            user {
              id
              username
              email
            }
            client {
              id
              name
              company
            }
            startTime
            endTime
            durationMinutes
            description
            taskName
            status
            isBillable
            hourlyRate
            createdAt
            updatedAt
            durationHours
            totalCost
          }
        }
      }
    `;

    const apiService = (await import('../../services/api')).default;
    const result = await apiService.request(mutation, { id, input: data });
    return result.updateTimeLog.timeLog;
  }
);

export const deleteTimeLog = createAsyncThunk(
  'timeLogs/deleteTimeLog',
  async (timeLogId) => {
    const mutation = `
      mutation DeleteTimeLog($id: ID!) {
        deleteTimeLog(id: $id) {
          success
        }
      }
    `;

    const apiService = (await import('../../services/api')).default;
    await apiService.request(mutation, { id: timeLogId });
    return timeLogId;
  }
);

// Fetch unbilled time logs for invoice generation
export const fetchUnbilledTimeLogs = createAsyncThunk(
  'timeLogs/fetchUnbilledTimeLogs',
  async (projectId) => {
    const query = `
      query GetUnbilledTimeLogs($projectId: ID!) {
        allTimeLogs(projectId: $projectId, isBilled: false, isBillable: true) {
          id
          user {
            id
            username
            email
          }
          client {
            id
            name
            company
          }
          startTime
          endTime
          durationMinutes
          description
          taskName
          status
          isBillable
          hourlyRate
          createdAt
          updatedAt
          durationHours
          totalCost
        }
      }
    `;

    const apiService = (await import('../../services/api')).default;
    const result = await apiService.request(query, { projectId });
    return result.allTimeLogs || [];
  }
);

// Timer functionality
export const startTimer = createAsyncThunk(
  'timeLogs/startTimer',
  async (timerData) => {
    const mutation = `
      mutation StartTimeLog($taskName: String!, $clientId: ID, $description: String) {
        startTimeLog(taskName: $taskName, clientId: $clientId, description: $description) {
          timeLog {
            id
            user {
              id
              username
              email
            }
            client {
              id
              name
              company
            }
            startTime
            endTime
            durationMinutes
            description
            taskName
            status
            isBillable
            hourlyRate
            createdAt
            updatedAt
            durationHours
            totalCost
          }
        }
      }
    `;

    const apiService = (await import('../../services/api')).default;
    const result = await apiService.request(mutation, timerData);
    return result.startTimeLog.timeLog;
  }
);

export const stopTimer = createAsyncThunk(
  'timeLogs/stopTimer',
  async (timeLogId) => {
    const mutation = `
      mutation StopTimeLog($id: ID!) {
        stopTimeLog(id: $id) {
          timeLog {
            id
            user {
              id
              username
              email
            }
            client {
              id
              name
              company
            }
            startTime
            endTime
            durationMinutes
            description
            taskName
            status
            isBillable
            hourlyRate
            createdAt
            updatedAt
            durationHours
            totalCost
          }
        }
      }
    `;

    const apiService = (await import('../../services/api')).default;
    const result = await apiService.request(mutation, { id: timeLogId });
    return result.stopTimeLog.timeLog;
  }
);

const initialState = {
  timeLogs: [],
  unbilledLogs: [],
  currentTimer: null, // { projectId, taskId, startTime, isRunning, description }
  loading: false,
  saving: false,
  error: null,
  filters: {
    project: '',
    task: '',
    dateFrom: '',
    dateTo: '',
    billable: ''
  },
  sortBy: 'startTime',
  sortOrder: 'desc'
};

const timeLogsSlice = createSlice({
  name: 'timeLogs',
  initialState,
  reducers: {
    pauseTimer: (state) => {
      if (state.currentTimer && state.currentTimer.isRunning) {
        state.currentTimer.isRunning = false;
      }
    },
    resumeTimer: (state) => {
      if (state.currentTimer && !state.currentTimer.isRunning) {
        state.currentTimer.isRunning = true;
      }
    },
    resetTimer: (state) => {
      state.currentTimer = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSorting: (state, action) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateTimerDuration: (state) => {
      if (state.currentTimer && state.currentTimer.isRunning) {
        // This would be called by a timer interval to update elapsed time
        // For now, we'll calculate it when needed
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch time logs
      .addCase(fetchTimeLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.timeLogs = action.payload.timeLogs || [];
        // Store analytics if needed
      })
      .addCase(fetchTimeLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch time logs';
      })

      // Create time log
      .addCase(createTimeLog.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createTimeLog.fulfilled, (state, action) => {
        state.saving = false;
        state.timeLogs.unshift(action.payload); // Add to beginning of array
      })
      .addCase(createTimeLog.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || 'Failed to create time log';
      })

      // Update time log
      .addCase(updateTimeLog.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateTimeLog.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.timeLogs.findIndex(log => log.id === action.payload.id);
        if (index !== -1) {
          state.timeLogs[index] = action.payload;
        }
      })
      .addCase(updateTimeLog.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || 'Failed to update time log';
      })

      // Delete time log
      .addCase(deleteTimeLog.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteTimeLog.fulfilled, (state, action) => {
        state.saving = false;
        state.timeLogs = state.timeLogs.filter(log => log.id !== action.payload);
      })
      .addCase(deleteTimeLog.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || 'Failed to delete time log';
      })

      // Fetch unbilled time logs
      .addCase(fetchUnbilledTimeLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnbilledTimeLogs.fulfilled, (state, action) => {
        state.loading = false;
        // Store unbilled logs separately or use for invoice generation
        state.unbilledLogs = action.payload;
      })
      .addCase(fetchUnbilledTimeLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Timer operations
      .addCase(startTimer.fulfilled, (state, action) => {
        state.currentTimer = action.payload;
      })
      .addCase(stopTimer.fulfilled, (state, action) => {
        state.currentTimer = null;
        // The time log will be added via createTimeLog
      });
  }
});

export const {
  pauseTimer,
  resumeTimer,
  resetTimer,
  setFilters,
  setSorting,
  clearError,
  updateTimerDuration
} = timeLogsSlice.actions;

export default timeLogsSlice.reducer;