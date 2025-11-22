import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { BsPeople, BsPlus, BsEnvelope, BsPhone, BsBuilding, BsSearch, BsFilter, BsThreeDotsVertical, BsEye, BsPencil, BsTrash, BsFolderPlus, BsX } from 'react-icons/bs';
import { fetchClients, setFilters, clearFilters, deleteClient, createClient } from '../modules/Clients/services/clientsSlice';
import { toast } from 'react-toastify';

const ClientsPage = () => {
  const dispatch = useDispatch();
  const { clients, loading, error, filters, analytics } = useSelector(state => state.clients);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    budget: '',
    startDate: '',
    endDate: ''
  });
  const [clientForm, setClientForm] = useState({
    name: '',
    company: '',
    contactEmail: '',
    phone: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error('Failed to load clients: ' + error);
    }
  }, [error]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchClients());
  };

  const handleStatusFilter = (status) => {
    dispatch(setFilters({ status: status === filters.status ? '' : status }));
  };

  const handleDeleteClient = (client) => {
    setSelectedClient(client);
    setShowDeleteModal(true);
  };

  const confirmDeleteClient = async () => {
    try {
      await dispatch(deleteClient(selectedClient.id)).unwrap();
      toast.success('Client deleted successfully');
      setShowDeleteModal(false);
      setSelectedClient(null);
      // Refresh the client list to update analytics
      dispatch(fetchClients());
    } catch (error) {
      toast.error('Failed to delete client: ' + error.message);
    }
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createClient(clientForm)).unwrap();
      toast.success('Client created successfully');
      setShowCreateModal(false);
      // Clear the form
      setClientForm({
        name: '',
        company: '',
        contactEmail: '',
        phone: '',
        address: '',
        notes: ''
      });
      // Refresh the client list to update analytics
      dispatch(fetchClients());
    } catch (error) {
      toast.error('Failed to create client: ' + error.message);
    }
  };

  const handleFormChange = (field, value) => {
    setClientForm(prev => ({ ...prev, [field]: value }));
  };

  const handleViewDetails = (client) => {
    setSelectedClient(client);
    setShowDetailsModal(true);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setClientForm({
      name: client.name || '',
      company: client.company || '',
      contactEmail: client.contactEmail || '',
      phone: client.phone || '',
      address: client.address || '',
      notes: client.notes || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateClient({ id: selectedClient.id, data: clientForm })).unwrap();
      toast.success('Client updated successfully');
      setShowEditModal(false);
      setSelectedClient(null);
      setClientForm({
        name: '',
        company: '',
        contactEmail: '',
        phone: '',
        address: '',
        notes: ''
      });
      // Refresh the client list to update analytics
      dispatch(fetchClients());
    } catch (error) {
      toast.error('Failed to update client: ' + error.message);
    }
  };

  const handleNewProject = (client) => {
    setSelectedClient(client);
    setProjectForm({
      title: '',
      description: '',
      budget: '',
      startDate: '',
      endDate: ''
    });
    setShowProjectModal(true);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement project creation - this would need to be added to the projects slice
      // For now, just show a success message
      toast.success('Project creation functionality coming soon');
      setShowProjectModal(false);
      setSelectedClient(null);
      setProjectForm({
        title: '',
        description: '',
        budget: '',
        startDate: '',
        endDate: ''
      });
    } catch (error) {
      toast.error('Failed to create project: ' + error.message);
    }
  };

  const handleProjectFormChange = (field, value) => {
    setProjectForm(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <title>Clients - Freespec</title>
          <meta name="description" content="Manage your client relationships and contacts" />
        </Helmet>

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-[#0015AA]">{analytics.totalClients || 0}</p>
              </div>
              <BsPeople className="h-8 w-8 text-[#0015AA]" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold text-green-600">{analytics.activeClients || 0}</p>
              </div>
              <BsPeople className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-[#FBB03B]">{formatCurrency(analytics.totalRevenue || 0)}</p>
              </div>
              <BsBuilding className="h-8 w-8 text-[#FBB03B]" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(analytics.outstandingBalance || 0)}</p>
              </div>
              <BsEnvelope className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Header with CTA and Banner Background */}
        <div className="mb-8 relative">
          {/* Header Banner Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0015AA]/10 via-[#FBB03B]/5 to-[#0015AA]/10 rounded-xl"></div>
          <div className="absolute top-4 right-8 w-24 h-24 bg-[#FBB03B]/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-2 left-12 w-16 h-16 bg-[#0015AA]/15 rounded-full blur-lg"></div>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 px-4 sm:px-6 space-y-4 sm:space-y-0">
            <div>
              <p className="text-gray-700 font-medium text-sm sm:text-base">Manage your client relationships and contacts</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#0015AA] text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-[#003366] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center font-semibold hover:-translate-y-0.5 min-h-[44px] w-full sm:w-auto justify-center"
            >
              <BsPlus className="mr-2" size={18} />
              Add New Client
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-lg border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col space-y-4">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent min-h-[44px]"
                />
              </div>
            </form>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-lg border transition-all duration-200 flex items-center justify-center min-h-[44px] font-medium ${
                  showFilters ? 'bg-[#0015AA] text-white border-[#0015AA]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <BsFilter className="mr-2" />
                Filters
              </button>
              <button
                onClick={() => dispatch(clearFilters())}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 min-h-[44px] font-medium"
              >
                Clear
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {['ACTIVE', 'INACTIVE', 'ARCHIVED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusFilter(status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                      filters.status === status
                        ? 'bg-[#0015AA] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0015AA] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading clients...</p>
          </div>
        )}

        {/* Clients Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {clients.map((client) => (
              <div key={client.id} className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                {/* Card Background Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#0015AA]/5 to-transparent rounded-bl-3xl"></div>

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4 relative z-10 space-y-3 sm:space-y-0">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#0015AA] rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                      <BsPeople className="text-white" size={16} />
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-[#0015AA] truncate">{client.name}</h3>
                      <p className="text-sm text-gray-600 font-medium truncate">{client.company || 'Individual'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {/* Status Badge */}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                    {/* Three Dots Menu */}
                    <button
                      onClick={() => setSelectedClient(selectedClient === client.id ? null : client.id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors relative z-10 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <BsThreeDotsVertical className="text-gray-400" />
                    </button>
                    {selectedClient === client.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                        <button
                          onClick={() => {
                            setSelectedClient(null);
                            handleViewDetails(client);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <BsEye className="mr-2" />
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            setSelectedClient(null);
                            handleEditClient(client);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <BsPencil className="mr-2" />
                          Edit Client
                        </button>
                        <button
                          onClick={() => {
                            setSelectedClient(null);
                            handleNewProject(client);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <BsFolderPlus className="mr-2" />
                          New Project
                        </button>
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          onClick={() => {
                            setSelectedClient(null);
                            handleDeleteClient(client.id);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <BsTrash className="mr-2" />
                          Delete Client
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3 mb-4 bg-gray-50/50 rounded-lg p-3">
                  <div className="flex items-center text-sm text-gray-700">
                    <BsEnvelope className="mr-2 text-[#0015AA]" size={14} />
                    <span className="font-medium">{client.contactEmail}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center text-sm text-gray-700">
                      <BsPhone className="mr-2 text-[#0015AA]" size={14} />
                      <span className="font-medium">{client.phone}</span>
                    </div>
                  )}
                  {client.industry && (
                    <div className="flex items-center text-sm text-gray-700">
                      <BsBuilding className="mr-2 text-[#0015AA]" size={14} />
                      <span className="font-medium">{client.industry}</span>
                    </div>
                  )}
                </div>

                {/* Stats Section */}
                <div className="border-t border-gray-100 pt-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Projects</p>
                      <p className="text-lg font-bold text-gray-900">{client.totalProjects || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="text-lg font-bold text-[#FBB03B]">{formatCurrency(client.totalRevenue)}</p>
                    </div>
                  </div>
                  {client.outstandingBalance > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Outstanding</p>
                      <p className="text-lg font-bold text-red-600">{formatCurrency(client.outstandingBalance)}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => handleViewDetails(client)}
                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md min-h-[44px] justify-center flex items-center"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleNewProject(client)}
                    className="flex-1 bg-[#0015AA] text-white px-3 py-3 rounded-lg text-sm font-medium hover:bg-[#003366] transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 min-h-[44px] justify-center flex items-center"
                  >
                    New Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && clients.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
            <div className="w-20 h-20 bg-[#0015AA]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BsPeople className="h-10 w-10 text-[#0015AA]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No clients yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">Start building your client relationships by adding your first client.</p>
            <button className="bg-[#0015AA] text-white px-6 py-3 rounded-lg hover:bg-[#003366] shadow-lg hover:shadow-xl transition-all duration-300 font-semibold hover:-translate-y-0.5">
              Add Your First Client
            </button>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-[#0015AA]">Client Details</h2>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedClient(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <BsX className="text-gray-500" size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-[#0015AA] rounded-full flex items-center justify-center shadow-md">
                    <BsPeople className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#0015AA]">{selectedClient.name}</h3>
                    <p className="text-gray-600">{selectedClient.company || 'Individual'}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(selectedClient.status)}`}>
                      {selectedClient.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <BsEnvelope className="mr-3 text-[#0015AA]" size={16} />
                        <span>{selectedClient.contactEmail}</span>
                      </div>
                      {selectedClient.phone && (
                        <div className="flex items-center text-sm">
                          <BsPhone className="mr-3 text-[#0015AA]" size={16} />
                          <span>{selectedClient.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Projects</p>
                        <p className="text-xl font-bold text-gray-900">{selectedClient.totalProjects || 0}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="text-xl font-bold text-[#FBB03B]">{formatCurrency(selectedClient.totalRevenue)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedClient.address && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Address</h4>
                    <p className="text-gray-700">{selectedClient.address}</p>
                  </div>
                )}

                {selectedClient.notes && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Notes</h4>
                    <p className="text-gray-700">{selectedClient.notes}</p>
                  </div>
                )}

                <div className="text-sm text-gray-500">
                  Created: {new Date(selectedClient.createdAt).toLocaleDateString()}
                  {selectedClient.updatedAt !== selectedClient.createdAt && (
                    <span className="ml-4">
                      Updated: {new Date(selectedClient.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleEditClient(selectedClient);
                  }}
                  className="px-4 py-2 bg-[#0015AA] text-white rounded-lg hover:bg-[#003366] transition-colors font-semibold"
                >
                  Edit Client
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedClient(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Client Modal */}
        {showEditModal && selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-[#0015AA]">Edit Client</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedClient(null);
                    setClientForm({
                      name: '',
                      company: '',
                      contactEmail: '',
                      phone: '',
                      address: '',
                      notes: ''
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <BsX className="text-gray-500" size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateClient} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
                    <input
                      type="text"
                      required
                      value={clientForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent min-h-[44px]"
                      placeholder="Enter client name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      value={clientForm.company}
                      onChange={(e) => handleFormChange('company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="Enter company name"
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={clientForm.contactEmail}
                      onChange={(e) => handleFormChange('contactEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={clientForm.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      value={clientForm.address}
                      onChange={(e) => handleFormChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="Enter full address"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={clientForm.notes}
                      onChange={(e) => handleFormChange('notes', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="Enter notes about the client"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedClient(null);
                      setClientForm({
                        name: '',
                        company: '',
                        contactEmail: '',
                        phone: '',
                        address: '',
                        notes: ''
                      });
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#0015AA] text-white rounded-lg hover:bg-[#003366] transition-colors font-semibold"
                  >
                    Update Client
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                  <BsTrash className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Delete Client</h3>
                <p className="text-sm text-center text-gray-600 mb-4">
                  Are you sure you want to delete <span className="font-semibold text-gray-900">{selectedClient.name}</span>?
                  This action cannot be undone.
                </p>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-800">
                        This will permanently delete the client and all associated data including projects and invoices.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedClient(null);
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteClient}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Delete Client
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Project Modal */}
        {showProjectModal && selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-[#0015AA]">Create New Project</h2>
                <button
                  onClick={() => {
                    setShowProjectModal(false);
                    setSelectedClient(null);
                    setProjectForm({
                      title: '',
                      description: '',
                      budget: '',
                      startDate: '',
                      endDate: ''
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <BsX className="text-gray-500" size={24} />
                </button>
              </div>

              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#0015AA] rounded-full flex items-center justify-center shadow-md">
                    <BsPeople className="text-white" size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Creating project for</p>
                    <p className="font-semibold text-[#0015AA]">{selectedClient.name}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleCreateProject} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={projectForm.title}
                      onChange={(e) => handleProjectFormChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="Enter project title"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={projectForm.description}
                      onChange={(e) => handleProjectFormChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="Describe the project scope and objectives"
                    />
                  </div>

                  {/* Project Details */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                    <input
                      type="number"
                      step="0.01"
                      value={projectForm.budget}
                      onChange={(e) => handleProjectFormChange('budget', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={projectForm.startDate}
                      onChange={(e) => handleProjectFormChange('startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={projectForm.endDate}
                      onChange={(e) => handleProjectFormChange('endDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProjectModal(false);
                      setSelectedClient(null);
                      setProjectForm({
                        title: '',
                        description: '',
                        budget: '',
                        startDate: '',
                        endDate: ''
                      });
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#0015AA] text-white rounded-lg hover:bg-[#003366] transition-colors font-semibold"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Client Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4 sm:m-0">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-[#0015AA]">Add New Client</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <BsX className="text-gray-500" size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateClient} className="p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Basic Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
                    <input
                      type="text"
                      required
                      value={clientForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="Enter client name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      value={clientForm.company}
                      onChange={(e) => handleFormChange('company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="Enter company name"
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={clientForm.contactEmail}
                      onChange={(e) => handleFormChange('contactEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={clientForm.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      value={clientForm.address}
                      onChange={(e) => handleFormChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="Enter full address"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={clientForm.notes}
                      onChange={(e) => handleFormChange('notes', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="Enter notes about the client"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors min-h-[44px] font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#0015AA] text-white rounded-lg hover:bg-[#003366] transition-colors font-semibold min-h-[44px]"
                  >
                    Create Client
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsPage;