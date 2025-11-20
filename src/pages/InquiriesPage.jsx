import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BsPlus, BsEye, BsFilter, BsTrash, BsPencil, BsTag, BsCalendar, BsCheckCircle, BsXCircle, BsClock, BsExclamationTriangle, BsDownload } from 'react-icons/bs';
import {
  fetchInquiries,
  createInquiry,
  updateInquiry,
  bulkUpdateInquiries,
  deleteInquiry,
  setFilters,
  clearFilters,
  setSorting,
} from '../store/slices/inquiriesSlice';

// Import shared components
import PageLayout from '../components/common/PageLayout';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import MetricCard from '../components/common/MetricCard';
import FilterPanel, { SelectFilter, DateRangeFilter } from '../components/common/FilterPanel';
import { FormModal } from '../components/common/Modal';

// Import components
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

  const tableColumns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'message', header: 'Message', render: (value) => (
      <div className="truncate max-w-xs" title={value}>{value || '—'}</div>
    )},
    { key: 'status', header: 'Status', sortable: true, render: (value) => (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
        {getStatusIcon(value)}
        <span className="ml-1 capitalize">{value || 'NEW'}</span>
      </span>
    )},
    { key: 'priority', header: 'Priority', sortable: true, render: (value) => (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(value)}`}>
        {value || 'MEDIUM'}
      </span>
    )},
    { key: 'submittedAt', header: 'Submitted', sortable: true, render: (value) => (
      value ? new Date(value).toLocaleString() : '—'
    )}
  ];

  const tableActions = [
    { icon: <BsEye />, label: 'View', onClick: handleViewInquiry },
    { icon: <BsPencil />, label: 'Edit', onClick: handleEditInquiry },
    { icon: <BsTrash />, label: 'Delete', onClick: (inquiry) => handleDeleteInquiry(inquiry.id), variant: 'danger' }
  ];

  const bulkActions = [
    { label: 'Mark Contacted', onClick: () => handleBulkUpdate({ status: 'CONTACTED' }), variant: 'primary' },
    { label: 'Export CSV', onClick: handleExportSelected, variant: 'secondary' },
    { label: 'Delete Selected', onClick: handleBulkDeleteSelected, variant: 'danger' }
  ];

  return (
    <PageLayout
      title="Inquiries"
      description="Manage client inquiries and leads"
      keywords="inquiries, leads, sales, pipeline, crm"
    >
      {/* Analytics Dashboard */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-6">
        <MetricCard
          title="Total Inquiries"
          value={analytics?.totalInquiries || 0}
          icon={<BsTag size={24} />}
          color="primary"
        />
        <MetricCard
          title="New"
          value={analytics?.newInquiries || 0}
          icon={<BsClock size={24} />}
          color="info"
        />
        <MetricCard
          title="Contacted"
          value={analytics?.contactedInquiries || 0}
          icon={<BsCheckCircle size={24} />}
          color="success"
        />
        <MetricCard
          title="Won"
          value={analytics?.wonInquiries || 0}
          icon={<BsCheckCircle size={24} />}
          color="success"
        />
        <MetricCard
          title="Lost"
          value={analytics?.lostInquiries || 0}
          icon={<BsXCircle size={24} />}
          color="danger"
        />
      </div>

      <PageHeader
        title="Inquiry Management"
        description="Manage client inquiries and track your sales pipeline"
        stats={[
          { label: 'total', value: inquiries.length },
          { label: 'new', value: inquiries.filter(inq => inq.status === 'NEW').length },
          { label: 'contacted', value: inquiries.filter(inq => inq.status === 'CONTACTED').length }
        ]}
        actions={[
          {
            label: 'Filters',
            icon: <BsFilter size={16} />,
            onClick: () => setShowFilters(!showFilters),
            variant: showFilters ? 'secondary' : 'default'
          },
          {
            label: 'Add Inquiry',
            icon: <BsPlus size={18} />,
            onClick: () => setShowCreateModal(true),
            variant: 'primary'
          }
        ]}
      />

      {/* Filters */}
      {showFilters && (
        <FilterPanel
          isOpen={showFilters}
          onToggle={() => setShowFilters(!showFilters)}
          onClearFilters={handleClearFilters}
        >
          <SelectFilter
            label="Status"
            value={filters.status || ''}
            onChange={(value) => handleFiltersChange({ ...filters, status: value })}
            options={[
              { value: 'NEW', label: 'New' },
              { value: 'CONTACTED', label: 'Contacted' },
              { value: 'QUOTED', label: 'Quoted' },
              { value: 'NEGOTIATING', label: 'Negotiating' },
              { value: 'WON', label: 'Won' },
              { value: 'LOST', label: 'Lost' },
              { value: 'ON_HOLD', label: 'On Hold' }
            ]}
          />
          <SelectFilter
            label="Priority"
            value={filters.priority || ''}
            onChange={(value) => handleFiltersChange({ ...filters, priority: value })}
            options={[
              { value: 'HIGH', label: 'High' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'LOW', label: 'Low' }
            ]}
          />
          <DateRangeFilter
            label="Date Range"
            startDate={filters.start_date || ''}
            endDate={filters.end_date || ''}
            onStartDateChange={(value) => handleFiltersChange({ ...filters, start_date: value })}
            onEndDateChange={(value) => handleFiltersChange({ ...filters, end_date: value })}
          />
        </FilterPanel>
      )}

      {/* Inquiries Table */}
      <DataTable
        title="All Inquiries"
        subtitle={`${inquiries.length} total inquiries`}
        columns={tableColumns}
        data={inquiries}
        loading={loading}
        error={error}
        selectable={true}
        selectedItems={selectedInquiries}
        onSelectionChange={setSelectedInquiries}
        emptyMessage="No inquiries found. Start capturing leads from your website contact forms."
        emptyAction={{
          label: 'Add Inquiry',
          onClick: () => setShowCreateModal(true)
        }}
        actions={tableActions}
        headerActions={[
          {
            label: 'Export CSV',
            icon: <BsDownload size={16} />,
            onClick: handleExportSelected
          }
        ]}
      />

      {/* Modals */}
      <CreateInquiryModal
        isVisible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateInquiry}
      />
    </PageLayout>
  );
};

export default InquiriesPage;