import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Cross-slice imports for interconnected relationships
import { fetchClients } from '../../modules/Clients/services/clientsSlice';
import { fetchProjects } from '../../modules/Projects/services/projectsSlice';

// Backend-integrated invoice actions
export const createInvoiceWithRelationships = (invoiceData) => async (dispatch, getState) => {
  try {
    // Create invoice - backend automatically updates client balance
    const result = await dispatch(createInvoice(invoiceData)).unwrap();

    // Backend automatically:
    // - Updates client's outstanding_balance (+total for SENT/OVERDUE)
    // - Calculates total from subtotal + tax - discount
    // - Updates Invoice.total property

    // Sync frontend state with backend changes
    await Promise.all([
      dispatch(fetchClients()), // Refresh client balances and revenue
      dispatch(fetchProjects()) // Refresh project financial contexts
    ]);

    return result;
  } catch (error) {
    console.error('Failed to create invoice with relationships:', error);
    throw error;
  }
};

export const updateInvoiceWithRelationships = (invoiceId, updateData) => async (dispatch, getState) => {
  try {
    // Update invoice - backend handles balance adjustments
    const result = await dispatch(updateInvoice({ id: invoiceId, data: updateData })).unwrap();

    // Backend automatically:
    // - Adjusts client outstanding_balance based on status changes
    // - Updates client total_revenue when status becomes PAID
    // - Recalculates totals

    // Sync frontend state
    await Promise.all([
      dispatch(fetchClients()),
      dispatch(fetchProjects())
    ]);

    return result;
  } catch (error) {
    console.error('Failed to update invoice with relationships:', error);
    throw error;
  }
};

export const markInvoicePaidWithRelationships = (invoiceId, paidDate = null) => async (dispatch, getState) => {
  try {
    const updateData = {
      status: 'PAID',
      ...(paidDate && { paid_date: paidDate })
    };

    // Mark as paid - backend handles all financial updates
    const result = await dispatch(updateInvoice({ id: invoiceId, data: updateData })).unwrap();

    // Backend automatically:
    // - Subtracts from client outstanding_balance
    // - Adds to client total_revenue
    // - Updates Invoice.paid_date

    // Sync frontend state
    await Promise.all([
      dispatch(fetchClients()),
      dispatch(fetchProjects())
    ]);

    return result;
  } catch (error) {
    console.error('Failed to mark invoice paid with relationships:', error);
    throw error;
  }
};
import apiService from '../../services/api';

// Async thunks for invoice operations
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (params = {}) => {
    console.log('Fetching invoices with params:', params);

    // Use GraphQL instead of REST API
    const query = `
      query GetAllInvoices {
        allInvoices {
          id
          invoiceNumber
          client {
            id
            name
            contactEmail
          }
          project {
            id
            title
          }
          totalAmount
          status
          issueDate
          dueDate
          paidDate
          subtotal
          tax
          discount
          notes
          items
        }
      }
    `;

    const result = await apiService.request(query, {});

    // Transform GraphQL response to match frontend expectations
    const transformedInvoices = result.data.allInvoices.map(invoice => ({
      id: invoice.id,
      invoice_number: invoice.invoiceNumber,
      client_name: invoice.client?.name || invoice.clientName,
      client: invoice.client ? {
        id: invoice.client.id,
        name: invoice.client.name,
        email: invoice.client.contactEmail
      } : null,
      project: invoice.project ? {
        id: invoice.project.id,
        title: invoice.project.title
      } : null,
      total: invoice.totalAmount,
      amount: invoice.totalAmount,
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      discount: invoice.discount,
      status: invoice.status,
      issue_date: invoice.issueDate,
      due_date: invoice.dueDate,
      paid_date: invoice.paidDate,
      notes: invoice.notes,
      items: invoice.items || []
    }));

    return {
      results: transformedInvoices,
      count: transformedInvoices.length
    };
  }
);

export const createInvoice = createAsyncThunk(
  'invoices/createInvoice',
  async (invoiceData) => {
    console.log('Creating invoice (GraphQL):', invoiceData);

    const mutation = `
      mutation CreateInvoice($input: InvoiceInput!) {
        createInvoice(input: $input) {
          invoice {
            id
            invoiceNumber
            client { id name contactEmail }
            project { id title }
            total
            subtotal
            tax
            discount
            status
            issueDate
            dueDate
            paidDate
            notes
            items { id description quantity rate amount }
          }
        }
      }
    `;

    const result = await apiService.request(mutation, { input: invoiceData });

    const invoice = result.data.createInvoice.invoice;

    // Transform GraphQL invoice to frontend shape
    const transformed = {
      id: invoice.id,
      invoice_number: invoice.invoiceNumber,
      client: invoice.client ? { id: invoice.client.id, name: invoice.client.name, email: invoice.client.contactEmail } : null,
      project: invoice.project ? { id: invoice.project.id, title: invoice.project.title } : null,
      total: invoice.total,
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      discount: invoice.discount,
      status: invoice.status ? invoice.status.toLowerCase() : invoice.status,
      issue_date: invoice.issueDate,
      due_date: invoice.dueDate,
      paid_date: invoice.paidDate,
      notes: invoice.notes,
      items: invoice.items || []
    };

    return transformed;
  }
);

export const updateInvoice = createAsyncThunk(
  'invoices/updateInvoice',
  async ({ id, data }) => {
    console.log('Updating invoice (GraphQL):', id, data);
    const mutation = `
      mutation UpdateInvoice($id: ID!, $input: InvoiceInput!) {
        updateInvoice(id: $id, input: $input) {
          invoice {
            id
            invoiceNumber
            client { id name contactEmail }
            project { id title }
            total
            subtotal
            tax
            discount
            status
            issueDate
            dueDate
            paidDate
            notes
            items { id description quantity rate amount }
          }
        }
      }
    `;

    const result = await apiService.request(mutation, { id, input: data });

    const invoice = result.data.updateInvoice.invoice;
    return {
      id: invoice.id,
      invoice_number: invoice.invoiceNumber,
      client: invoice.client ? { id: invoice.client.id, name: invoice.client.name, email: invoice.client.contactEmail } : null,
      project: invoice.project ? { id: invoice.project.id, title: invoice.project.title } : null,
      total: invoice.total,
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      discount: invoice.discount,
      status: invoice.status ? invoice.status.toLowerCase() : invoice.status,
      issue_date: invoice.issueDate,
      due_date: invoice.dueDate,
      paid_date: invoice.paidDate,
      notes: invoice.notes,
      items: invoice.items || []
    };
  }
);

export const deleteInvoice = createAsyncThunk(
  'invoices/deleteInvoice',
  async (invoiceId) => {
    console.log('Deleting invoice:', invoiceId);
    const response = await fetch(`http://localhost:8000/api/invoices/${invoiceId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `JWT ${localStorage.getItem('adminToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete invoice');
    }

    return invoiceId;
  }
);

export const generateInvoice = createAsyncThunk(
  'invoices/generateInvoice',
  async (generationData) => {
    console.log('Generating invoice:', generationData);
    // Use GraphQL createInvoice for generation as well if possible
    const mutation = `
      mutation CreateInvoice($input: InvoiceInput!) {
        createInvoice(input: $input) {
          invoice { id invoiceNumber total subtotal status }
        }
      }
    `;

    const result = await apiService.request(mutation, { input: generationData });
    return result.data.createInvoice.invoice;
  }
);

export const sendInvoice = createAsyncThunk(
  'invoices/sendInvoice',
  async ({ id, emailData }) => {
    console.log('Sending invoice (GraphQL):', id, emailData);
    const mutation = `
      mutation SendInvoice($id: ID!, $emailData: JSONString) {
        sendInvoice(id: $id, emailData: $emailData) { success invoice { id status } }
      }
    `;

    const result = await apiService.request(mutation, { id, emailData: emailData || {} });
    return result.data.sendInvoice.invoice;
  }
);

export const markInvoicePaid = createAsyncThunk(
  'invoices/markInvoicePaid',
  async ({ id, paymentData }) => {
    console.log('Marking invoice as paid (GraphQL):', id, paymentData);
    const mutation = `
      mutation MarkInvoicePaid($id: ID!, $paymentData: JSONString) {
        markInvoicePaid(id: $id, paymentData: $paymentData) { success invoice { id status paidDate } }
      }
    `;

    const result = await apiService.request(mutation, { id, paymentData: paymentData || {} });
    return result.data.markInvoicePaid.invoice;
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
    client: '',
    dateRange: '',
    amountRange: ''
  },
  sortBy: 'created_at',
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
    invoiceCount: 0
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
    setCurrentInvoice: (state, action) => {
      state.currentInvoice = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    updateInvoiceStatus: (state, action) => {
      const { id, status } = action.payload;
      const invoice = state.invoices.find(inv => inv.id === id);
      if (invoice) {
        invoice.status = status;
      }
    }
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
        state.invoices = action.payload.results || action.payload;

        // Calculate analytics
        const invoices = action.payload.results || action.payload;
        state.analytics = {
          totalRevenue: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total || inv.amount), 0),
          pendingAmount: invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + (inv.total || inv.amount), 0),
          paidAmount: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total || inv.amount), 0),
          overdueAmount: invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + (inv.total || inv.amount), 0),
          invoiceCount: invoices.length
        };

        state.pagination.total = action.payload.count || invoices.length;
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
        state.pagination.total += 1;
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
        if (state.currentInvoice && state.currentInvoice.id === action.payload.id) {
          state.currentInvoice = action.payload;
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
        state.pagination.total -= 1;
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      })

      // Generate invoice
      .addCase(generateInvoice.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(generateInvoice.fulfilled, (state, action) => {
        state.saving = false;
        state.invoices.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(generateInvoice.rejected, (state, action) => {
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
        // Update invoice status to sent
        const invoice = state.invoices.find(inv => inv.id === action.meta.arg.id);
        if (invoice) {
          invoice.status = 'sent';
        }
        // Also update currentInvoice if it's the same invoice
        if (state.currentInvoice && state.currentInvoice.id === action.meta.arg.id) {
          state.currentInvoice.status = 'sent';
        }
        // Recalculate analytics after status change
        state.analytics = {
          totalRevenue: state.invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total || inv.amount), 0),
          pendingAmount: state.invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + (inv.total || inv.amount), 0),
          paidAmount: state.invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total || inv.amount), 0),
          overdueAmount: state.invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + (inv.total || inv.amount), 0),
          invoiceCount: state.invoices.length
        };
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
        const invoice = state.invoices.find(inv => inv.id === action.meta.arg.id);
        if (invoice) {
          invoice.status = 'paid';
          invoice.paid_date = action.payload.paid_date;
        }
        // Also update currentInvoice if it's the same invoice
        if (state.currentInvoice && state.currentInvoice.id === action.meta.arg.id) {
          state.currentInvoice.status = 'paid';
          state.currentInvoice.paid_date = action.payload.paid_date;
        }
        // Recalculate analytics after status change
        state.analytics = {
          totalRevenue: state.invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total || inv.amount), 0),
          pendingAmount: state.invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + (inv.total || inv.amount), 0),
          paidAmount: state.invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total || inv.amount), 0),
          overdueAmount: state.invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + (inv.total || inv.amount), 0),
          invoiceCount: state.invoices.length
        };
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
  setCurrentInvoice,
  clearError,
  setPagination,
  updateInvoiceStatus
} = invoicesSlice.actions;

export default invoicesSlice.reducer;