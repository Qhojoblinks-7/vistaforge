import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';

// Async thunk for contact form submission
export const submitContactForm = createAsyncThunk(
  'contact/submitContactForm',
  async (formData) => {
    const response = await apiService.submitContact(formData);
    return response;
  }
);

// Async thunk for fetching all contacts (admin only)
export const fetchAllContacts = createAsyncThunk(
  'contact/fetchAllContacts',
  async () => {
    const response = await apiService.getAllContacts();
    return response;
  }
);

// Async thunk for fetching unread contacts (admin only)
export const fetchUnreadContacts = createAsyncThunk(
  'contact/fetchUnreadContacts',
  async () => {
    const response = await apiService.getUnreadContacts();
    return response;
  }
);

const initialState = {
  submitting: false,
  submitted: false,
  error: null,
  lastSubmission: null,
  contacts: [],
  unreadContacts: [],
  loadingContacts: false,
  contactsError: null,
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    resetContactForm: (state) => {
      state.submitted = false;
      state.error = null;
      state.lastSubmission = null;
    },
    clearContactError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Contact form submission
      .addCase(submitContactForm.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitContactForm.fulfilled, (state, action) => {
        state.submitting = false;
        state.submitted = true;
        state.lastSubmission = action.payload;
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.error.message;
      })

      // Fetch all contacts (admin)
      .addCase(fetchAllContacts.pending, (state) => {
        state.loadingContacts = true;
        state.contactsError = null;
      })
      .addCase(fetchAllContacts.fulfilled, (state, action) => {
        state.loadingContacts = false;
        state.contacts = action.payload;
      })
      .addCase(fetchAllContacts.rejected, (state, action) => {
        state.loadingContacts = false;
        state.contactsError = action.error.message;
      })

      // Fetch unread contacts (admin)
      .addCase(fetchUnreadContacts.pending, (state) => {
        state.loadingContacts = true;
        state.contactsError = null;
      })
      .addCase(fetchUnreadContacts.fulfilled, (state, action) => {
        state.loadingContacts = false;
        state.unreadContacts = action.payload;
      })
      .addCase(fetchUnreadContacts.rejected, (state, action) => {
        state.loadingContacts = false;
        state.contactsError = action.error.message;
      });
  },
});

export const { resetContactForm, clearContactError } = contactSlice.actions;
export default contactSlice.reducer;