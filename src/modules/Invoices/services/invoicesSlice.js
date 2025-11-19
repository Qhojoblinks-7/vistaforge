import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for invoice operations
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (params = {}) => {
    const query = `
      query GetInvoices($status: String, $clientId: ID, $projectId: ID, $limit: Int, $offset: Int) {
        allInvoices(status: $status, clientId: $clientId, projectId: $projectId, limit: $limit, offset: $offset) {
          id
          invoiceNumber
          uuid
          client {
            id
            name
            contactEmail
            company
          }
          project {
            id
            title
            description
          }
          items {
            id
            description
            quantity
            rate
            amount
          }
          subtotal
          tax
          discount
          total
          status
          issueDate
          dueDate
          paidDate
          notes
          createdAt
          updatedAt
        }
        invoiceAnalytics
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(query, params);
    return {
      invoices: result.allInvoices || [],
      analytics: result.invoiceAnalytics || {}
    };
  }
);

export const createInvoice = createAsyncThunk(
  'invoices/createInvoice',
  async (invoiceData) => {
    const mutation = `
      mutation CreateInvoice($input: InvoiceInput!) {
        createInvoice(input: $input) {
          invoice {
            id
            invoiceNumber
            uuid
            client {
              id
              name
              contactEmail
              company
            }
            project {
              id
              title
              description
            }
            items {
              id
              description
              quantity
              rate
              amount
            }
            subtotal
            tax
            discount
            total
            status
            issueDate
            dueDate
            paidDate
            notes
            createdAt
            updatedAt
          }
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(mutation, { input: invoiceData });
    return result.createInvoice.invoice;
  }
);

export const updateInvoice = createAsyncThunk(
  'invoices/updateInvoice',
  async ({ id, data }) => {
    const mutation = `
      mutation UpdateInvoice($id: ID!, $input: InvoiceInput!) {
        updateInvoice(id: $id, input: $input) {
          invoice {
            id
            invoiceNumber
            uuid
            client {
              id
              name
              contactEmail
              company
            }
            project {
              id
              title
              description
            }
            items {
              id
              description
              quantity
              rate
              amount
            }
            subtotal
            tax
            discount
            total
            status
            issueDate
            dueDate
            paidDate
            notes
            createdAt
            updatedAt
          }
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(mutation, { id, input: data });
    return result.updateInvoice.invoice;
  }
);

export const deleteInvoice = createAsyncThunk(
  'invoices/deleteInvoice',
  async (invoiceId) => {
    const mutation = `
      mutation DeleteInvoice($id: ID!) {
        deleteInvoice(id: $id) {
          success
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(mutation, { id: invoiceId });
    return invoiceId;
  }
);

export const sendInvoice = createAsyncThunk(
  'invoices/sendInvoice',
  async ({ id, emailData }) => {
    const mutation = `
      mutation SendInvoice($id: ID!, $emailData: JSONString) {
        sendInvoice(id: $id, emailData: $emailData) {
          success
          invoice {
            id
            status
            updatedAt
          }
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(mutation, { id, emailData });
    return { id, result: result.sendInvoice };
  }
);

export const markInvoicePaid = createAsyncThunk(
  'invoices/markInvoicePaid',
  async ({ id, paymentData }) => {
    const mutation = `
      mutation MarkInvoicePaid($id: ID!, $paymentData: JSONString) {
        markInvoicePaid(id: $id, paymentData: $paymentData) {
          invoice {
            id
            status
            paidDate
            updatedAt
          }
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(mutation, { id, paymentData });
    return result.markInvoicePaid.invoice;
  }
);

const initialState = {
  invoices: [],
  currentInvoice: null,
  loading: false,
  saving: false,
  error: null,
  filters: {
    status: '',
    clientId: '',
    projectId: '',
    dateRange: '',
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
    totalRevenue: 0,
    pendingAmount: 0,
    paidAmount: 0,
    overdueAmount: 0,
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
  }
};

const invoicesSlice = createSlice({
  name: 'invoices',
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
    setCurrentInvoice: (state, action) => {
      state.currentInvoice = action.payload;
    },
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
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
        state.invoices = action.payload.invoices || [];
        state.analytics = action.payload.analytics || initialState.analytics;
        state.pagination.total = action.payload.invoices?.length || 0;
        state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.pageSize);
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create invoice
      .addCase(createInvoice.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.saving = false;
        state.invoices.unshift(action.payload);
        state.analytics.totalInvoices += 1;
        state.analytics.pendingInvoices += 1;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      })

      // Update invoice
      .addCase(updateInvoice.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.invoices.findIndex(inv => inv.id === action.payload.id);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      })

      // Delete invoice
      .addCase(deleteInvoice.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.saving = false;
        state.invoices = state.invoices.filter(inv => inv.id !== action.payload);
        state.analytics.totalInvoices -= 1;
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      })

      // Send invoice
      .addCase(sendInvoice.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(sendInvoice.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.invoices.findIndex(inv => inv.id === action.payload.id);
        if (index !== -1 && action.payload.result.success) {
          state.invoices[index].status = 'sent';
        }
      })
      .addCase(sendInvoice.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      })

      // Mark invoice paid
      .addCase(markInvoicePaid.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(markInvoicePaid.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.invoices.findIndex(inv => inv.id === action.payload.id);
        if (index !== -1) {
          state.invoices[index] = { ...state.invoices[index], ...action.payload };
          state.analytics.paidInvoices += 1;
          state.analytics.pendingInvoices -= 1;
          state.analytics.paidAmount += state.invoices[index].total;
          state.analytics.pendingAmount -= state.invoices[index].total;
        }
      })
      .addCase(markInvoicePaid.rejected, (state, action) => {
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
  setCurrentInvoice,
  clearCurrentInvoice,
} = invoicesSlice.actions;

export default invoicesSlice.reducer;