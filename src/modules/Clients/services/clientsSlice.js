import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for client operations
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (params = {}) => {
    const query = `
      query GetClients {
        allClients {
          id
          name
          company
          contactEmail
          phone
          address
          status
          totalRevenue
          outstandingBalance
          notes
          createdAt
          updatedAt
        }
        clientAnalytics
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(query, {});
    return {
      clients: result.allClients || [],
      analytics: typeof result.clientAnalytics === 'string'
        ? JSON.parse(result.clientAnalytics)
        : result.clientAnalytics || {}
    };
  }
);

export const createClient = createAsyncThunk(
  'clients/createClient',
  async (clientData) => {
    const mutation = `
      mutation CreateClient($input: ClientInput!) {
        createClient(input: $input) {
          client {
            id
            name
            company
            contactEmail
            phone
            address
            status
            totalRevenue
            notes
            createdAt
            updatedAt
          }
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(mutation, { input: clientData });
    return result.createClient.client;
  }
);

export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({ id, data }) => {
    const mutation = `
      mutation UpdateClient($id: ID!, $input: ClientInput!) {
        updateClient(id: $id, input: $input) {
          client {
            id
            name
            company
            contactEmail
            phone
            address
            status
            totalRevenue
            notes
            createdAt
            updatedAt
          }
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(mutation, { id, input: data });
    return result.updateClient.client;
  }
);

export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (clientId) => {
    const mutation = `
      mutation DeleteClient($id: ID!) {
        deleteClient(id: $id) {
          success
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(mutation, { id: clientId });
    return clientId;
  }
);

// Client contact operations
export const fetchClientContacts = createAsyncThunk(
  'clients/fetchClientContacts',
  async (clientId) => {
    const query = `
      query GetClientContacts($clientId: ID!) {
        clientContacts(clientId: $clientId) {
          id
          name
          title
          email
          phone
          isPrimary
          createdAt
          updatedAt
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(query, { clientId });
    return result.clientContacts || [];
  }
);

export const createClientContact = createAsyncThunk(
  'clients/createClientContact',
  async ({ clientId, contactData }) => {
    const mutation = `
      mutation CreateClientContact($clientId: ID!, $input: ClientContactInput!) {
        createClientContact(clientId: $clientId, input: $input) {
          contact {
            id
            name
            title
            email
            phone
            isPrimary
            createdAt
            updatedAt
          }
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(mutation, { clientId, input: contactData });
    return result.createClientContact.contact;
  }
);

export const updateClientContact = createAsyncThunk(
  'clients/updateClientContact',
  async ({ id, data }) => {
    const mutation = `
      mutation UpdateClientContact($id: ID!, $input: ClientContactInput!) {
        updateClientContact(id: $id, input: $input) {
          contact {
            id
            name
            title
            email
            phone
            isPrimary
            createdAt
            updatedAt
          }
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(mutation, { id, input: data });
    return result.updateClientContact.contact;
  }
);

export const deleteClientContact = createAsyncThunk(
  'clients/deleteClientContact',
  async (contactId) => {
    const mutation = `
      mutation DeleteClientContact($id: ID!) {
        deleteClientContact(id: $id) {
          success
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(mutation, { id: contactId });
    return contactId;
  }
);

// Client note operations
export const fetchClientNotes = createAsyncThunk(
  'clients/fetchClientNotes',
  async (clientId) => {
    const query = `
      query GetClientNotes($clientId: ID!) {
        clientNotes(clientId: $clientId) {
          id
          noteType
          title
          content
          followUpRequired
          followUpDate
          followUpCompleted
          createdAt
          updatedAt
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(query, { clientId });
    return result.clientNotes || [];
  }
);

export const createClientNote = createAsyncThunk(
  'clients/createClientNote',
  async ({ clientId, noteData }) => {
    const mutation = `
      mutation CreateClientNote($clientId: ID!, $input: ClientNoteInput!) {
        createClientNote(clientId: $clientId, input: $input) {
          note {
            id
            noteType
            title
            content
            followUpRequired
            followUpDate
            followUpCompleted
            createdAt
            updatedAt
          }
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(mutation, { clientId, input: noteData });
    return result.createClientNote.note;
  }
);

export const updateClientNote = createAsyncThunk(
  'clients/updateClientNote',
  async ({ id, data }) => {
    const mutation = `
      mutation UpdateClientNote($id: ID!, $input: ClientNoteInput!) {
        updateClientNote(id: $id, input: $input) {
          note {
            id
            noteType
            title
            content
            followUpRequired
            followUpDate
            followUpCompleted
            createdAt
            updatedAt
          }
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(mutation, { id, input: data });
    return result.updateClientNote.note;
  }
);

export const deleteClientNote = createAsyncThunk(
  'clients/deleteClientNote',
  async (noteId) => {
    const mutation = `
      mutation DeleteClientNote($id: ID!) {
        deleteClientNote(id: $id) {
          success
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(mutation, { id: noteId });
    return noteId;
  }
);

const initialState = {
  clients: [],
  currentClient: null,
  clientContacts: [],
  clientNotes: [],
  loading: false,
  saving: false,
  error: null,
  filters: {
    status: '',
    search: '',
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
    totalClients: 0,
    activeClients: 0,
    totalRevenue: 0,
    outstandingBalance: 0,
  }
};

const clientsSlice = createSlice({
  name: 'clients',
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
    setCurrentClient: (state, action) => {
      state.currentClient = action.payload;
    },
    clearCurrentClient: (state) => {
      state.currentClient = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch clients
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload.clients || [];
        state.analytics = action.payload.analytics || initialState.analytics;
        state.pagination.total = action.payload.clients?.length || 0;
        state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.pageSize);
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create client
      .addCase(createClient.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.saving = false;
        state.clients.unshift(action.payload);
        // Refresh analytics after creating client
        state.analytics.totalClients = (state.analytics.totalClients || 0) + 1;
      })
      .addCase(createClient.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      })

      // Update client
      .addCase(updateClient.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.clients.findIndex(client => client.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      })

      // Delete client
      .addCase(deleteClient.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.saving = false;
        state.clients = state.clients.filter(client => client.id !== action.payload);
        // Refresh analytics after deleting client
        state.analytics.totalClients = Math.max(0, (state.analytics.totalClients || 0) - 1);
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      })

      // Client contacts
      .addCase(fetchClientContacts.fulfilled, (state, action) => {
        state.clientContacts = action.payload;
      })
      .addCase(createClientContact.fulfilled, (state, action) => {
        state.clientContacts.push(action.payload);
      })
      .addCase(updateClientContact.fulfilled, (state, action) => {
        const index = state.clientContacts.findIndex(contact => contact.id === action.payload.id);
        if (index !== -1) {
          state.clientContacts[index] = action.payload;
        }
      })
      .addCase(deleteClientContact.fulfilled, (state, action) => {
        state.clientContacts = state.clientContacts.filter(contact => contact.id !== action.payload);
      })

      // Client notes
      .addCase(fetchClientNotes.fulfilled, (state, action) => {
        state.clientNotes = action.payload;
      })
      .addCase(createClientNote.fulfilled, (state, action) => {
        state.clientNotes.push(action.payload);
      })
      .addCase(updateClientNote.fulfilled, (state, action) => {
        const index = state.clientNotes.findIndex(note => note.id === action.payload.id);
        if (index !== -1) {
          state.clientNotes[index] = action.payload;
        }
      })
      .addCase(deleteClientNote.fulfilled, (state, action) => {
        state.clientNotes = state.clientNotes.filter(note => note.id !== action.payload);
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setSorting,
  clearError,
  setPagination,
  setCurrentClient,
  clearCurrentClient,
} = clientsSlice.actions;

export default clientsSlice.reducer;