import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { BsPlus, BsEye, BsFilter, BsTrash, BsPencil, BsTag, BsCalendar, BsCheckCircle, BsXCircle, BsClock, BsExclamationTriangle } from 'react-icons/bs';
import {
  fetchInquiries,
  createInquiry, // <-- Used in new handler
  updateInquiry,
  bulkUpdateInquiries,
  deleteInquiry,
  setFilters,
  clearFilters,
  setSorting,
} from '../store/slices/inquiriesSlice';

// Import components
import InquiryFilters from '../components/InquiryFilters';
// Assuming you've created this component from the previous suggestion
import CreateInquiryModal from '../components/CreateInquiryModal'; 

const InquiriesPage = () => {
  const dispatch = useDispatch();
  const {
    inquiries,
    loading,
    error,
    filters,
    sortBy,
    sortOrder,
    analytics
  } = useSelector((state) => state.inquiries);

  // Modal states
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false); // <-- NEW STATE
  const [selectedInquiries, setSelectedInquiries] = useState([]);

  // Load inquiries on component mount and when filters change
  useEffect(() => {
    dispatch(fetchInquiries());
  }, [dispatch, filters, sortBy, sortOrder]);

  // Handle inquiry creation (NEW HANDLER)
  const handleCreateInquiry = async (inquiryData) => {
    try {
      // The Redux thunk should be structured to accept the input object directly
      await dispatch(createInquiry({ input: inquiryData })).unwrap();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create inquiry:', error);
      // TODO: Implement user-facing error notification (toast/alert)
    }
  };

  // Handle inquiry viewing
  const handleViewInquiry = (inquiry) => {
    // For now, just log - detailed view would need additional modal
    console.log('View inquiry:', inquiry);
  };

  // Handle inquiry editing
  const handleEditInquiry = (inquiry) => {
    // For now, just log - editing would need additional modal
    console.log('Edit inquiry:', inquiry);
  };

  // Handle inquiry deletion
  const handleDeleteInquiry = async (inquiryId) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      try {
        await dispatch(deleteInquiry(inquiryId)).unwrap();
      } catch (error) {
        console.error('Failed to delete inquiry:', error);
      }
    }
  };

  // Handle bulk operations
  const handleBulkUpdate = async (updates) => {
    if (selectedInquiries.length === 0) return;

    try {
      await dispatch(bulkUpdateInquiries({
        inquiryIds: selectedInquiries,
        updates
      })).unwrap();
      setSelectedInquiries([]);
    } catch (error) {
      console.error('Failed to bulk update inquiries:', error);
    }
  };

  // Bulk delete selected inquiries
  const handleBulkDeleteSelected = async () => {
    if (selectedInquiries.length === 0) return;
    if (!window.confirm(`Delete ${selectedInquiries.length} selected inquiries? This cannot be undone.`)) return;

    try {
      // Dispatch delete for each selected inquiry
      await Promise.all(selectedInquiries.map(id => dispatch(deleteInquiry(id)).unwrap()));
      setSelectedInquiries([]);
    } catch (error) {
      console.error('Failed to delete selected inquiries:', error);
    }
  };

  // Export selected inquiries as CSV
  const handleExportSelected = () => {
    if (selectedInquiries.length === 0) return;
    const rows = [];
    const headers = ['id', 'name', 'email', 'message', 'status', 'priority', 'submittedAt'];
    rows.push(headers.join(','));

    const selected = inquiries.filter(i => selectedInquiries.includes(i.id));
    selected.forEach(i => {
      const vals = [i.id, `"${(i.name||'').replace(/"/g, '""')}"`, `"${(i.email||'').replace(/"/g, '""')}"`, `"${(i.message||'').replace(/"/g, '""')}"`, i.status || '', i.priority || '', i.submittedAt || ''];
      rows.push(vals.join(','));
    });

    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inquiries_export_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Handle sorting
  const handleSort = (column) => {
    const newOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setSorting({ sortBy: column, sortOrder: newOrder }));
  };

  // Handle filters
  const handleFiltersChange = (newFilters) => {
    dispatch(setFilters(newFilters));
    // Refetch inquiries when filters change
    dispatch(fetchInquiries());
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    // Refetch inquiries when filters are cleared
    dispatch(fetchInquiries());
  };

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedInquiries.length === inquiries.length) {
      setSelectedInquiries([]);
    } else {
      setSelectedInquiries(inquiries.map(inv => inv.id));
    }
  };

  const handleSelectInquiry = (inquiryId) => {
    if (selectedInquiries.includes(inquiryId)) {
      setSelectedInquiries(selectedInquiries.filter(id => id !== inquiryId));
    } else {
      setSelectedInquiries([...selectedInquiries, inquiryId]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'CONTACTED': return 'bg-yellow-100 text-yellow-800';
      case 'QUOTED': return 'bg-purple-100 text-purple-800';
      case 'NEGOTIATING': return 'bg-orange-100 text-orange-800';
      case 'WON': return 'bg-green-100 text-green-800';
      case 'LOST': return 'bg-red-100 text-red-800';
      case 'ON_HOLD': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'NEW': return <BsClock className="text-blue-500" size={16} />;
      case 'CONTACTED': return <BsCheckCircle className="text-yellow-500" size={16} />;
      case 'QUOTED': return <BsTag className="text-purple-500" size={16} />;
      case 'NEGOTIATING': return <BsExclamationTriangle className="text-orange-500" size={16} />;
      case 'WON': return <BsCheckCircle className="text-green-500" size={16} />;
      case 'LOST': return <BsXCircle className="text-red-500" size={16} />;
      case 'ON_HOLD': return <BsClock className="text-gray-500" size={16} />;
      default: return <BsClock className="text-gray-500" size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative overflow-hidden">
      {/* Background Banner */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0015AA]/5 via-transparent to-[#FBB03B]/5"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-[#FBB03B]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-32 left-16 w-48 h-48 bg-[#0015AA]/8 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-blue-400/6 rounded-full blur-xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Helmet>
          <title>Inquiries - VistaForge</title>
          <meta name="description" content="Manage client inquiries and leads" />
        </Helmet>

        {/* Analytics Dashboard (omitted for brevity) */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* ... analytics cards ... */}
        </div>

        {/* Header with CTA and Banner Background */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0015AA]/10 via-[#FBB03B]/5 to-[#0015AA]/10 rounded-xl"></div>
          <div className="absolute top-4 right-8 w-24 h-24 bg-[#FBB03B]/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-2 left-12 w-16 h-16 bg-[#0015AA]/15 rounded-full blur-lg"></div>

          <div className="relative z-10 flex items-center justify-between py-6 px-6">
            <div>
              <p className="text-gray-700 font-medium">Manage client inquiries and track your sales pipeline</p>
              <p className="text-sm text-gray-500 mt-1">{inquiries.length} total inquiries</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center font-semibold"
              >
                <BsFilter className="mr-2" size={16} />
                Filters
              </button>
              <button
                onClick={() => setShowCreateModal(true)} 
                className="bg-[#0015AA] text-white px-6 py-3 rounded-lg hover:bg-[#003366] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center font-semibold hover:-translate-y-0.5"
              >
                <BsPlus className="mr-2" size={18} />
                Add Inquiry
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedInquiries.length > 0 && (
          <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-sm font-medium">{selectedInquiries.length} selected</div>

              <button
                type="button"
                onClick={() => handleBulkUpdate({ status: 'CONTACTED' })}
                className="inline-flex items-center px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
              >
                <BsCheckCircle className="mr-2" />
                Mark Contacted
              </button>

              <div>
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v) handleBulkUpdate({ priority: v });
                    e.target.value = '';
                  }}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="">Set priority</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleExportSelected}
                className="inline-flex items-center px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Export
              </button>

              <button
                type="button"
                onClick={handleBulkDeleteSelected}
                className="inline-flex items-center px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
              >
                <BsTrash className="mr-2" />
                Delete
              </button>
            </div>

            <div>
              <button type="button" onClick={() => setSelectedInquiries([])} className="text-sm text-gray-600 hover:underline">Clear selection</button>
            </div>
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <InquiryFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        )}

        {/* Inquiries Table */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          {/* Table header + body */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    <input
                      type="checkbox"
                      aria-label="Select all inquiries"
                      checked={selectedInquiries.length === inquiries.length && inquiries.length > 0}
                      onChange={handleSelectAll}
                      className="form-checkbox h-4 w-4 text-[#0015AA]"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Message</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Priority</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Submitted</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading && (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-sm text-gray-500">
                      Loading inquiries...
                    </td>
                  </tr>
                )}

                {!loading && inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedInquiries.includes(inq.id)}
                        onChange={() => handleSelectInquiry(inq.id)}
                        className="form-checkbox h-4 w-4 text-[#0015AA]"
                        aria-label={`Select inquiry ${inq.id}`}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{inq.name || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{inq.email || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-xs">{inq.message || ''}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(inq.status)}`}>
                        {inq.status || 'NEW'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(inq.priority)}`}>
                        {inq.priority || 'MEDIUM'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{inq.submittedAt ? new Date(inq.submittedAt).toLocaleString() : '—'}</td>
                    <td className="px-4 py-3 text-right text-sm">
                      <div className="inline-flex items-center space-x-2">
                        <button onClick={() => handleViewInquiry(inq)} className="text-indigo-600 hover:text-indigo-800" title="View"><BsEye /></button>
                        <button onClick={() => handleEditInquiry(inq)} className="text-yellow-600 hover:text-yellow-800" title="Edit"><BsPencil /></button>
                        <button onClick={() => handleDeleteInquiry(inq.id)} className="text-red-600 hover:text-red-800" title="Delete"><BsTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {!loading && !error && inquiries.length === 0 && (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white">
              <div className="w-20 h-20 bg-[#0015AA]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BsTag className="h-10 w-10 text-[#0015AA]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No inquiries yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">Start capturing leads from your website contact forms or add them manually.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#0015AA] text-white px-6 py-3 rounded-lg hover:bg-[#003366] shadow-lg hover:shadow-xl transition-all duration-300 font-semibold hover:-translate-y-0.5"
              >
                Add Your First Inquiry
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* --- NEW MODAL INTEGRATION --- */}
      <CreateInquiryModal
        isVisible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateInquiry} // Passes the new submission handler
      />
      {/* ----------------------------- */}
    </div>
  );
};

export default InquiriesPage;