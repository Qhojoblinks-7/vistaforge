import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Cross-slice imports for interconnected relationships
import { fetchClients } from '../../modules/Clients/services/clientsSlice';
import { fetchProjects } from '../../modules/Projects/services/projectsSlice';

// Backend-integrated inquiry conversion actions
export const convertInquiryToClient = (inquiryId) => async (dispatch, getState) => {
  try {
    // Convert inquiry to client - backend handles all relationships
    const result = await dispatch(convertToClient(inquiryId)).unwrap();

    // Backend automatically:
    // - Creates client from inquiry data
    // - Updates inquiry status to 'WON'
    // - Links client to user

    // Sync frontend state
    await dispatch(fetchClients()); // Refresh clients list
    await dispatch(fetchInquiries()); // Refresh inquiries with updated status

    return result;
  } catch (error) {
    console.error('Failed to convert inquiry to client:', error);
    throw error;
  }
};

export const convertInquiryToProject = (inquiryId, clientId = null) => async (dispatch, getState) => {
  try {
    // Convert inquiry to project - backend handles all relationships
    const result = await dispatch(convertToProject({ inquiryId, clientId })).unwrap();

    // Backend automatically:
    // - Creates client if not provided
    // - Creates project with estimated budget/hours
    // - Links project to client
    // - Updates inquiry status to 'WON'

    // Sync frontend state
    await Promise.all([
      dispatch(fetchClients()), // Refresh clients (new or updated)
      dispatch(fetchProjects()), // Refresh projects list
      dispatch(fetchInquiries()) // Refresh inquiries status
    ]);

    return result;
  } catch (error) {
    console.error('Failed to convert inquiry to project:', error);
    throw error;
  }
};

export const convertInquiryToClientAndProject = (inquiryId) => async (dispatch, getState) => {
  try {
    // Convert inquiry to both client and project in one action
    const result = await dispatch(convertToClientAndProject(inquiryId)).unwrap();

    // Backend automatically handles the entire conversion workflow

    // Sync all related frontend state
    await Promise.all([
      dispatch(fetchClients()),
      dispatch(fetchProjects()),
      dispatch(fetchInquiries())
    ]);

    return result;
  } catch (error) {
    console.error('Failed to convert inquiry to client and project:', error);
    throw error;
  }
};
import apiService from '../../services/api';

// These enum values match what's defined in the backend models.py SERVICE_CHOICES etc.
export const SERVICE_TYPES = {
  WEB_DEV: 'WEB_DEV',
  WEB_DESIGN: 'WEB_DESIGN',
  MOBILE_APP: 'MOBILE_APP',
  BRANDING: 'BRANDING',
  UI_UX: 'UI_UX',
  SEO: 'SEO',
  CONSULTING: 'CONSULTING',
  MAINTENANCE: 'MAINTENANCE',
  OTHER: 'OTHER',
};

export const BUDGET_RANGES = {
  V_UNDER_1K: 'V_UNDER_1K',
  V_SMALL_1K_5K: 'V_SMALL_1K_5K',
  V_MID_5K_10K: 'V_MID_5K_10K',
  V_MID_10K_25K: 'V_MID_10K_25K',
  V_LARGE_25K_50K: 'V_LARGE_25K_50K',
  V_OVER_50K: 'V_OVER_50K',
  V_DISCUSS: 'V_DISCUSS',
};

export const TIMELINE_OPTIONS = {
  ASAP: 'ASAP',
  WEEK_ONE: 'WEEK_ONE',
  WEEKS_TWO: 'WEEKS_TWO',
  MONTH_ONE: 'MONTH_ONE',
  MONTHS_THREE: 'MONTHS_THREE',
  FLEXIBLE: 'FLEXIBLE',
};

export const PRIORITIES = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
};

export const STATUSES = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED', 
  QUOTED: 'QUOTED',
  NEGOTIATING: 'NEGOTIATING',
  WON: 'WON',
  LOST: 'LOST',
  ON_HOLD: 'ON_HOLD',
};

export const SOURCES = {
  WEBSITE: 'WEBSITE',
  EMAIL: 'EMAIL',
  LINKEDIN: 'LINKEDIN',
  UPWORK: 'UPWORK',
  REFERRAL: 'REFERRAL',
  SOCIAL: 'SOCIAL',
  OTHER: 'OTHER',
};

// Helper to handle enum values in GraphQL inputs - use exact values from choices
const sanitizeInputEnums = (input = {}) => {
  const copy = { ...input };
  if (copy.serviceRequested) copy.serviceRequested = SERVICE_TYPES[copy.serviceRequested] || copy.serviceRequested;
  if (copy.budgetRange) copy.budgetRange = BUDGET_RANGES[copy.budgetRange] || copy.budgetRange;
  if (copy.timeline) copy.timeline = TIMELINE_OPTIONS[copy.timeline] || copy.timeline;
  if (copy.priority) copy.priority = PRIORITIES[copy.priority] || copy.priority;
  if (copy.status) copy.status = STATUSES[copy.status] || copy.status; 
  if (copy.source) copy.source = SOURCES[copy.source] || copy.source;
  return copy;
};

// Async thunks for inquiry operations
export const fetchInquiries = createAsyncThunk(
  'inquiries/fetchInquiries',
  async (params = {}) => {
    console.log('Fetching inquiries with params:', params);

    const query = `
      query GetInquiries {
        allInquiries {
          id
          clientName
          clientEmail
          clientPhone
          clientCompany
          message
          serviceRequested
          budgetRange
          timeline
          priority
          status
          notes
          followUpDate
          reminderSent
          tags
          leadScore
          source
          createdAt
          updatedAt
        }
      }
    `;

    const result = await apiService.request(query);
    console.log('Fetched inquiries:', result.allInquiries);
    // Filter out null values that might be returned by GraphQL
    return result.allInquiries ? result.allInquiries.filter(inquiry => inquiry !== null) : [];
  }
);

export const createInquiry = createAsyncThunk(
  'inquiries/createInquiry',
  async (inquiryData) => {
    console.log('Creating inquiry:', inquiryData);

    const mutation = `
      mutation CreateInquiry($input: CreateInquiryInput!) {
        createInquiry(input: $input) {
          inquiry {
            id
            clientName
            clientEmail
            clientPhone
            clientCompany
            message
            serviceRequested
            budgetRange
            timeline
            priority
            status
            notes
            followUpDate
            reminderSent
            tags
            leadScore
            source
            createdAt
            updatedAt
          }
        }
      }
    `;

    // Sanitize enum-like fields so they match the GraphQL enum member names
    const sanitized = { input: sanitizeInputEnums(inquiryData) };
    const result = await apiService.request(mutation, sanitized);
    return result.createInquiry.inquiry;
  }
);

export const updateInquiry = createAsyncThunk(
  'inquiries/updateInquiry',
  async ({ id, data }) => {
    console.log('Updating inquiry:', id, data);

    const mutation = `
      mutation UpdateInquiry($id: ID!, $clientName: String, $clientEmail: String, $clientPhone: String, $clientCompany: String, $message: String, $serviceRequested: String, $budgetRange: String, $timeline: String, $priority: String, $status: String, $notes: String, $followUpDate: Date, $source: String, $tags: [String]) {
        updateInquiry(
          id: $id,
          clientName: $clientName,
          clientEmail: $clientEmail,
          clientPhone: $clientPhone,
          clientCompany: $clientCompany,
          message: $message,
          serviceRequested: $serviceRequested,
          budgetRange: $budgetRange,
          timeline: $timeline,
          priority: $priority,
          status: $status,
          notes: $notes,
          followUpDate: $followUpDate,
          source: $source,
          tags: $tags
        ) {
          inquiry {
            id
            clientName
            clientEmail
            clientPhone
            clientCompany
            message
            serviceRequested
            budgetRange
            timeline
            priority
            status
            notes
            followUpDate
            reminderSent
            tags
            leadScore
            source
            createdAt
            updatedAt
          }
        }
      }
    `;

    const sanitizedData = sanitizeInputEnums(data);
    const result = await apiService.request(mutation, { id, ...sanitizedData });
    return result.updateInquiry.inquiry;
  }
);

export const updateInquiryStatus = createAsyncThunk(
  'inquiries/updateInquiryStatus',
  async ({ id, status }) => {
    console.log('Updating inquiry status:', id, status);

    const mutation = `
      mutation UpdateInquiryStatus($id: ID!, $input: UpdateInquiryInput!) {
        updateInquiry(id: $id, input: $input) {
          inquiry {
            id
            clientName
            clientEmail
            clientPhone
            clientCompany
            message
            serviceRequested
            budgetRange
            timeline
            priority
            status
            notes
            followUpDate
            reminderSent
            tags
            leadScore
            source
            createdAt
            updatedAt
          }
        }
      }
    `;

    const result = await apiService.request(mutation, { id, input: { status } });
    return result.updateInquiry.inquiry;
  }
);

export const bulkUpdateInquiries = createAsyncThunk(
  'inquiries/bulkUpdateInquiries',
  async ({ inquiryIds, updates }) => {
    console.log('Bulk updating inquiries:', inquiryIds, updates);

    const mutation = `
      mutation BulkUpdateInquiries($inquiryIds: [ID!]!, $status: String, $priority: String, $tags: [String]) {
        bulkUpdateInquiries(inquiryIds: $inquiryIds, status: $status, priority: $priority, tags: $tags) {
          success
          updatedCount
          inquiries {
            id
            clientName
            clientEmail
            clientPhone
            clientCompany
            message
            serviceRequested
            budgetRange
            timeline
            priority
            status
            notes
            followUpDate
            reminderSent
            tags
            leadScore
            source
            createdAt
            updatedAt
          }
        }
      }
    `;

    const sanitizedUpdates = sanitizeInputEnums(updates);
    const result = await apiService.request(mutation, { inquiryIds, ...sanitizedUpdates });
    return result.bulkUpdateInquiries;
  }
);

export const deleteInquiry = createAsyncThunk(
  'inquiries/deleteInquiry',
  async (inquiryId) => {
    console.log('Deleting inquiry:', inquiryId);

    const mutation = `
      mutation DeleteInquiry($id: ID!) {
        deleteInquiry(id: $id) {
          success
        }
      }
    `;

    const result = await apiService.request(mutation, { id: inquiryId });
    return inquiryId;
  }
);

export const submitPublicInquiry = createAsyncThunk(
  'inquiries/submitPublicInquiry',
  async (inquiryData) => {
    console.log('Submitting public inquiry:', inquiryData);

    const mutation = `
      mutation CreateInquiry($input: CreateInquiryInput!) {
        createInquiry(input: $input) {
          inquiry {
            id
            clientName
            clientEmail
            clientPhone
            clientCompany
            message
            serviceRequested
            budgetRange
            timeline
            priority
            status
            notes
            followUpDate
            reminderSent
            tags
            leadScore
            source
            createdAt
            updatedAt
          }
        }
      }
    `;

    // Map the contact form data to the inquiry format
      const apiData = {
      input: sanitizeInputEnums({
        client_name: inquiryData.clientName,
        client_email: inquiryData.clientEmail,
        client_company: inquiryData.clientCompany || '',
        message: inquiryData.message,
        service_requested: inquiryData.serviceRequested || 'OTHER',
        budget_range: inquiryData.budgetRange || null,
        timeline: inquiryData.timeline || null,
        priority: 'MEDIUM',
        source: 'WEBSITE'
      })
    };    const result = await apiService.request(mutation, apiData);
    return result.createInquiry.inquiry;
  }
);

export const convertToClient = createAsyncThunk(
  'inquiries/convertToClient',
  async (inquiryId) => {
    console.log('Converting inquiry to client:', inquiryId);

    const mutation = `
      mutation ConvertInquiryToClient($inquiryId: ID!) {
        convertInquiryToClient(inquiryId: $inquiryId) {
          success
          client {
            id
            name
            contactEmail
            status
            totalRevenue
          }
        }
      }
    `;

    const result = await apiService.request(mutation, { inquiryId });
    return result.convertInquiryToClient;
  }
);

export const convertToProject = createAsyncThunk(
  'inquiries/convertToProject',
  async (inquiryId) => {
    console.log('Converting inquiry to project:', inquiryId);

    const mutation = `
      mutation ConvertInquiryToProject($inquiryId: ID!) {
        convertInquiryToProject(inquiryId: $inquiryId) {
          success
          project {
            id
            title
            status
            projectRate
            dueDate
          }
        }
      }
    `;

    const result = await apiService.request(mutation, { inquiryId });
    return result.convertInquiryToProject;
  }
);

const initialState = {
  inquiries: [],
  selectedInquiry: null,
  loading: false,
  saving: false,
  error: null,
  filters: {
    status: '',
    priority: '',
    serviceRequested: '',
    source: '',
    tags: [],
  },
  sortBy: 'createdAt',
  sortOrder: 'desc',
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  },
  analytics: {
    totalInquiries: 0,
    newInquiries: 0,
    contactedInquiries: 0,
    wonProjects: 0,
    lostProjects: 0,
    conversionRate: 0,
  }
};

const inquiriesSlice = createSlice({
  name: 'inquiries',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSorting: (state, action) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setSelectedInquiry: (state, action) => {
      state.selectedInquiry = action.payload;
    },
    clearSelectedInquiry: (state) => {
      state.selectedInquiry = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch inquiries
      .addCase(fetchInquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.inquiries = action.payload || [];

        // Calculate analytics
        const inquiries = action.payload || [];
        state.analytics = {
          totalInquiries: inquiries.length,
          newInquiries: inquiries.filter(inv => inv.status === 'NEW').length,
          contactedInquiries: inquiries.filter(inv => ['CONTACTED', 'QUOTED', 'NEGOTIATING'].includes(inv.status)).length,
          wonProjects: inquiries.filter(inv => inv.status === 'WON').length,
          lostProjects: inquiries.filter(inv => inv.status === 'LOST').length,
          conversionRate: inquiries.length > 0 ? (inquiries.filter(inv => inv.status === 'WON').length / inquiries.length) * 100 : 0,
        };

        state.pagination.total = inquiries.length;
        state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.pageSize);
      })
      .addCase(fetchInquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create inquiry
      .addCase(createInquiry.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createInquiry.fulfilled, (state, action) => {
        state.saving = false;
        state.inquiries.unshift(action.payload);
        state.analytics.totalInquiries += 1;
        state.analytics.newInquiries += 1;
      })
      .addCase(createInquiry.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      })

      // Submit public inquiry (same as create but for public contact form)
      .addCase(submitPublicInquiry.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(submitPublicInquiry.fulfilled, (state, action) => {
        state.saving = false;
        // Public inquiries don't get added to the admin's inquiry list
        // They are stored in the database but only visible to the admin user
      })
      .addCase(submitPublicInquiry.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      })

      // Convert to client
      .addCase(convertToClient.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(convertToClient.fulfilled, (state, action) => {
        state.saving = false;
        // Update the inquiry status to converted
        const inquiry = state.inquiries.find(inv => inv.id === action.meta.arg);
        if (inquiry) {
          inquiry.status = 'CONVERTED';
        }
        // Recalculate analytics
        const inquiries = state.inquiries;
        state.analytics = {
          totalInquiries: inquiries.length,
          newInquiries: inquiries.filter(inv => inv.status === 'NEW').length,
          contactedInquiries: inquiries.filter(inv => ['CONTACTED', 'QUOTED', 'NEGOTIATING'].includes(inv.status)).length,
          wonProjects: inquiries.filter(inv => inv.status === 'WON').length,
          lostProjects: inquiries.filter(inv => inv.status === 'LOST').length,
          conversionRate: inquiries.length > 0 ? (inquiries.filter(inv => inv.status === 'WON').length / inquiries.length) * 100 : 0,
        };
      })
      .addCase(convertToClient.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      })

      // Convert to project
      .addCase(convertToProject.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(convertToProject.fulfilled, (state, action) => {
        state.saving = false;
        // Update the inquiry status to converted
        const inquiry = state.inquiries.find(inv => inv.id === action.meta.arg);
        if (inquiry) {
          inquiry.status = 'CONVERTED';
        }
        // Recalculate analytics
        const inquiries = state.inquiries;
        state.analytics = {
          totalInquiries: inquiries.length,
          newInquiries: inquiries.filter(inv => inv.status === 'NEW').length,
          contactedInquiries: inquiries.filter(inv => ['CONTACTED', 'QUOTED', 'NEGOTIATING'].includes(inv.status)).length,
          wonProjects: inquiries.filter(inv => inv.status === 'WON').length,
          lostProjects: inquiries.filter(inv => inv.status === 'LOST').length,
          conversionRate: inquiries.length > 0 ? (inquiries.filter(inv => inv.status === 'WON').length / inquiries.length) * 100 : 0,
        };
      })
      .addCase(convertToProject.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      })

      // Update inquiry
      .addCase(updateInquiry.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateInquiry.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.inquiries.findIndex(inv => inv.id === action.payload.id);
        if (index !== -1) {
          state.inquiries[index] = action.payload;
        }
        // Recalculate analytics
        const inquiries = state.inquiries;
        state.analytics = {
          totalInquiries: inquiries.length,
          newInquiries: inquiries.filter(inv => inv.status === 'NEW').length,
          contactedInquiries: inquiries.filter(inv => ['CONTACTED', 'QUOTED', 'NEGOTIATING'].includes(inv.status)).length,
          wonProjects: inquiries.filter(inv => inv.status === 'WON').length,
          lostProjects: inquiries.filter(inv => inv.status === 'LOST').length,
          conversionRate: inquiries.length > 0 ? (inquiries.filter(inv => inv.status === 'WON').length / inquiries.length) * 100 : 0,
        };
      })
      .addCase(updateInquiry.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      })

      // Update inquiry status
      .addCase(updateInquiryStatus.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateInquiryStatus.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.inquiries.findIndex(inv => inv.id === action.payload.id);
        if (index !== -1) {
          state.inquiries[index] = action.payload;
        }
        // Recalculate analytics
        const inquiries = state.inquiries;
        state.analytics = {
          totalInquiries: inquiries.length,
          newInquiries: inquiries.filter(inv => inv.status === 'NEW').length,
          contactedInquiries: inquiries.filter(inv => ['CONTACTED', 'QUOTED', 'NEGOTIATING'].includes(inv.status)).length,
          wonProjects: inquiries.filter(inv => inv.status === 'WON').length,
          lostProjects: inquiries.filter(inv => inv.status === 'LOST').length,
          conversionRate: inquiries.length > 0 ? (inquiries.filter(inv => inv.status === 'WON').length / inquiries.length) * 100 : 0,
        };
      })
      .addCase(updateInquiryStatus.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      })

      // Bulk update inquiries
      .addCase(bulkUpdateInquiries.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(bulkUpdateInquiries.fulfilled, (state, action) => {
        state.saving = false;
        // Update the inquiries in state
        action.payload.inquiries.forEach(updatedInquiry => {
          const index = state.inquiries.findIndex(inv => inv.id === updatedInquiry.id);
          if (index !== -1) {
            state.inquiries[index] = updatedInquiry;
          }
        });
        // Recalculate analytics
        const inquiries = state.inquiries;
        state.analytics = {
          totalInquiries: inquiries.length,
          newInquiries: inquiries.filter(inv => inv.status === 'NEW').length,
          contactedInquiries: inquiries.filter(inv => ['CONTACTED', 'QUOTED', 'NEGOTIATING'].includes(inv.status)).length,
          wonProjects: inquiries.filter(inv => inv.status === 'WON').length,
          lostProjects: inquiries.filter(inv => inv.status === 'LOST').length,
          conversionRate: inquiries.length > 0 ? (inquiries.filter(inv => inv.status === 'WON').length / inquiries.length) * 100 : 0,
        };
      })
      .addCase(bulkUpdateInquiries.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      })

      // Delete inquiry
      .addCase(deleteInquiry.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteInquiry.fulfilled, (state, action) => {
        state.saving = false;
        state.inquiries = state.inquiries.filter(inv => inv.id !== action.payload);
        state.analytics.totalInquiries -= 1;
        // Recalculate analytics
        const inquiries = state.inquiries;
        state.analytics.newInquiries = inquiries.filter(inv => inv.status === 'NEW').length;
        state.analytics.contactedInquiries = inquiries.filter(inv => ['CONTACTED', 'QUOTED', 'NEGOTIATING'].includes(inv.status)).length;
        state.analytics.wonProjects = inquiries.filter(inv => inv.status === 'WON').length;
        state.analytics.lostProjects = inquiries.filter(inv => inv.status === 'LOST').length;
        state.analytics.conversionRate = inquiries.length > 0 ? (inquiries.filter(inv => inv.status === 'WON').length / inquiries.length) * 100 : 0;
      })
      .addCase(deleteInquiry.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setSorting,
  clearError,
  setPagination,
  setSelectedInquiry,
  clearSelectedInquiry,
} = inquiriesSlice.actions;

export default inquiriesSlice.reducer;