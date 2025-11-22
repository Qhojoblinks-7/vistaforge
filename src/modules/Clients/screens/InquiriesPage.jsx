import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { BsEnvelope, BsClock, BsCheckCircle, BsArchive, BsArrowRight, BsPersonPlus, BsFolderPlus, BsFilter } from 'react-icons/bs';
import { MoreVertical } from 'lucide-react';
import { fetchInquiries, updateInquiryStatus, convertToClient, convertToProject, setSelectedInquiry, clearSelectedInquiry } from '../../../store/slices/inquiriesSlice';

const InquiriesPage = () => {
  const dispatch = useDispatch();
  const { inquiries, loading, error, selectedInquiry, newInquiryCount } = useSelector(state => state.inquiries);

  const [filter, setFilter] = useState('all'); // 'all', 'NEW', 'CONTACTED', 'WON', 'LOST', 'ON_HOLD'
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchInquiries());
  }, [dispatch]);

  const handleInquirySelect = (inquiry) => {
    dispatch(setSelectedInquiry(inquiry));
    setDropdownOpen(false); // Close dropdown when selecting different inquiry
  };

  const handleStatusUpdate = async (inquiryId, newStatus) => {
    try {
      await dispatch(updateInquiryStatus({ id: inquiryId, status: newStatus })).unwrap();
      // Refresh the list
      dispatch(fetchInquiries());
    } catch (error) {
      console.error('Failed to update inquiry status:', error);
    }
  };

  const handleConvertToClient = async (inquiry) => {
    try {
      await dispatch(convertToClient(inquiry.id)).unwrap();
      // Refresh the list
      dispatch(fetchInquiries());
    } catch (error) {
      console.error('Failed to convert to client:', error);
    }
  };

  const handleConvertToProject = async (inquiry) => {
    try {
      await dispatch(convertToProject(inquiry.id)).unwrap();
      // Refresh the list
      dispatch(fetchInquiries());
    } catch (error) {
      console.error('Failed to convert to project:', error);
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    if (filter === 'all') return true;
    return inquiry.status === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW': return 'bg-red-100 text-red-800 border-red-200';
      case 'CONTACTED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONVERTED': return 'bg-green-100 text-green-800 border-green-200';
      case 'WON': return 'bg-green-100 text-green-800 border-green-200';
      case 'LOST': return 'bg-red-100 text-red-800 border-red-200';
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'NEW': return <BsEnvelope className="w-3 h-3" />;
      case 'CONTACTED': return <BsCheckCircle className="w-3 h-3" />;
      case 'CONVERTED': return <BsCheckCircle className="w-3 h-3" />;
      case 'WON': return <BsCheckCircle className="w-3 h-3" />;
      case 'LOST': return <BsArchive className="w-3 h-3" />;
      case 'ON_HOLD': return <BsClock className="w-3 h-3" />;
      default: return <BsEnvelope className="w-3 h-3" />;
    }
  };

  return (
    <main className="bg-white min-h-screen" id="main-content">
      <Helmet>
        <title>Inquiries - VistaForge Dashboard</title>
        <meta name="description" content="Manage your business inquiries and leads from the VistaForge dashboard." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-white shadow-lg border-b border-gray-200 mb-6">
          <div className="bg-gradient-to-br from-[#0015AA]/5 via-[#003366]/5 to-[#0015AA]/10 rounded-2xl p-6 shadow-lg border border-[#0015AA]/10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#0015AA] mb-2">Inquiries</h1>
                <p className="text-gray-700 text-lg font-medium">Manage your business leads and convert them into clients</p>
              </div>
              <div className="flex items-center gap-4">
                {newInquiryCount > 0 && (
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {newInquiryCount} new
                  </div>
                )}

                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 text-gray-700 hover:text-[#0015AA] hover:bg-white hover:border-[#0015AA]/30 transition-all duration-200 shadow-md hover:shadow-lg md:px-4 md:py-3 md:gap-2 px-3 py-2 gap-1"
                >
                  <BsFilter className="w-5 h-5 md:w-5 md:h-5 w-4 h-4" />
                  <span className="font-medium capitalize hidden md:inline">
                    {filter === 'all' ? 'All' : filter.replace('_', ' ').toLowerCase()}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#0015AA] mb-2">Inquiries</h1>
              <p className="text-gray-700 text-lg font-medium">Manage your business leads and convert them into clients</p>
            </div>
            <div className="flex items-center gap-4">
              {newInquiryCount > 0 && (
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  {newInquiryCount} new
                </div>
              )}

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 text-gray-700 hover:text-[#0015AA] hover:bg-white hover:border-[#0015AA]/30 transition-all duration-200 shadow-md hover:shadow-lg md:px-4 md:py-3 md:gap-2 px-3 py-2 gap-1"
              >
                <BsFilter className="w-5 h-5 md:w-5 md:h-5 w-4 h-4" />
                <span className="font-medium capitalize hidden md:inline">
                  {filter === 'all' ? 'All' : filter.replace('_', ' ').toLowerCase()}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#0015AA]">Filter Inquiries</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { key: 'all', label: 'All', count: inquiries.length },
                { key: 'NEW', label: 'New', count: inquiries.filter(i => i.status === 'NEW').length },
                { key: 'CONTACTED', label: 'Contacted', count: inquiries.filter(i => i.status === 'CONTACTED').length },
                { key: 'WON', label: 'Won', count: inquiries.filter(i => i.status === 'WON').length },
                { key: 'LOST', label: 'Lost', count: inquiries.filter(i => i.status === 'LOST').length },
                { key: 'ON_HOLD', label: 'On Hold', count: inquiries.filter(i => i.status === 'ON_HOLD').length },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => {
                    setFilter(key);
                    setShowFilters(false);
                  }}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filter === key
                      ? 'bg-[#0015AA] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="font-semibold">{label}</div>
                  <div className="text-xs opacity-75">({count})</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile: Show only list or only details */}
        <div className="block lg:hidden">
          {!selectedInquiry ? (
            /* Mobile List View */
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#0015AA] to-[#003366] px-6 py-4">
                  <h2 className="text-xl font-bold text-white">Recent Inquiries</h2>
                </div>
                <div className="max-h-[70vh] overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
                  {loading ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#0015AA] border-t-transparent mx-auto shadow-lg"></div>
                      <p className="text-gray-600 mt-4 font-medium">Loading inquiries...</p>
                    </div>
                  ) : filteredInquiries.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                        <BsEnvelope className="w-8 h-8 opacity-50" />
                      </div>
                      <p className="font-medium">No inquiries found</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredInquiries.map((inquiry) => (
                        <div
                          key={inquiry.id}
                          onClick={() => handleInquirySelect(inquiry)}
                          className="p-5 cursor-pointer hover:bg-gradient-to-r hover:from-[#0015AA]/5 hover:to-[#003366]/5 transition-all duration-200 border-l-4 border-transparent hover:border-[#0015AA]/30"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-bold text-gray-900 truncate pr-2 text-lg">
                              {inquiry.clientName}
                            </h3>
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm backdrop-blur-sm ${getStatusColor(inquiry.status)}`}>
                              {getStatusIcon(inquiry.status)}
                              <span className="ml-1.5 capitalize">{inquiry.status}</span>
                            </span>
                          </div>
                          <p className="text-base text-gray-700 mb-2 truncate font-medium">
                            {inquiry.serviceRequested || 'Project Inquiry'}
                          </p>
                          <div className="flex items-center text-sm text-gray-600 font-medium">
                            <BsClock className="w-4 h-4 mr-2" />
                            {formatDate(inquiry.createdAt)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Mobile Detail View */
            <div className="bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-[#0015AA] to-[#003366] px-6 py-5">
                <div className="flex items-start justify-between">
                  <div className="text-white flex-1">
                    <button
                      onClick={() => handleInquirySelect(null)}
                      className="mb-3 p-2 text-white/80 hover:text-white hover:bg-white/15 rounded-lg transition-all duration-200"
                    >
                      ← Back to List
                    </button>
                    <h2 className="text-2xl font-bold">
                      {selectedInquiry.clientName}
                    </h2>
                    <p className="text-blue-100 mt-1 text-lg">{selectedInquiry.clientEmail}</p>
                    <div className="flex items-center mt-3 text-sm text-blue-200">
                      <BsClock className="w-5 h-5 mr-2" />
                      Received {formatDate(selectedInquiry.createdAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-sm bg-white/15 border-white/30 text-white shadow-lg`}>
                      {getStatusIcon(selectedInquiry.status)}
                      <span className="ml-2 capitalize font-medium">{selectedInquiry.status}</span>
                    </span>

                    {/* Dropdown Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="p-3 text-white/80 hover:text-white hover:bg-white/15 rounded-lg transition-all duration-200 backdrop-blur-sm shadow-lg"
                      >
                        <MoreVertical className="w-6 h-6" />
                      </button>

                      {dropdownOpen && (
                        <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl z-20 overflow-hidden">
                          <div className="py-2">
                            {selectedInquiry.status === 'NEW' && (
                              <div className="px-4">
                                <button
                                  onClick={() => {
                                    handleStatusUpdate(selectedInquiry.id, 'CONTACTED');
                                    setDropdownOpen(false);
                                  }}
                                  className="w-full text-left px-4 py-4 text-sm text-gray-700 hover:bg-[#FBB03B]/10 hover:text-[#0015AA] rounded-lg transition-all duration-200 flex items-center group shadow-sm hover:shadow-md"
                                >
                                  <BsCheckCircle className="w-5 h-5 mr-4 text-[#FBB03B] group-hover:scale-110 transition-transform duration-200" />
                                  <span className="font-semibold text-base">Mark as Contacted</span>
                                </button>
                              </div>
                            )}

                            {selectedInquiry.status === 'CONTACTED' && (
                              <>
                                <div className="border-t border-gray-100 my-2"></div>
                                <div className="px-5 py-3 bg-gradient-to-r from-[#0015AA]/5 to-[#003366]/5 border-b border-gray-100">
                                  <p className="text-sm font-bold text-[#0015AA] uppercase tracking-wider">Convert Lead</p>
                                </div>
                                <div className="px-4 py-2 space-y-1">
                                  <button
                                    onClick={() => {
                                      handleConvertToClient(selectedInquiry);
                                      setDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-4 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 rounded-lg transition-all duration-200 flex items-center group shadow-sm hover:shadow-md"
                                  >
                                    <BsPersonPlus className="w-5 h-5 mr-4 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
                                    <span className="font-semibold text-base">Convert to Client</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleConvertToProject(selectedInquiry);
                                      setDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-4 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 rounded-lg transition-all duration-200 flex items-center group shadow-sm hover:shadow-md"
                                  >
                                    <BsFolderPlus className="w-5 h-5 mr-4 text-green-500 group-hover:scale-110 transition-transform duration-200" />
                                    <span className="font-semibold text-base">Convert to Project</span>
                                  </button>
                                </div>

                                <div className="border-t border-gray-100 my-2"></div>
                                <div className="px-5 py-3 bg-gradient-to-r from-[#0015AA]/5 to-[#003366]/5 border-b border-gray-100">
                                  <p className="text-sm font-bold text-[#0015AA] uppercase tracking-wider">Update Status</p>
                                </div>
                                <div className="px-4 py-2 space-y-1">
                                  <button
                                    onClick={() => {
                                      handleStatusUpdate(selectedInquiry.id, 'WON');
                                      setDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-4 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 rounded-lg transition-all duration-200 flex items-center group shadow-sm hover:shadow-md"
                                  >
                                    <BsCheckCircle className="w-5 h-5 mr-4 text-green-500 group-hover:scale-110 transition-transform duration-200" />
                                    <span className="font-semibold text-base">Mark as Won</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleStatusUpdate(selectedInquiry.id, 'LOST');
                                      setDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-4 text-sm text-gray-700 hover:bg-red-50 hover:text-red-800 rounded-lg transition-all duration-200 flex items-center group shadow-sm hover:shadow-md"
                                  >
                                    <BsArchive className="w-5 h-5 mr-4 text-red-500 group-hover:scale-110 transition-transform duration-200" />
                                    <span className="font-semibold text-base">Mark as Lost</span>
                                  </button>
                                </div>
                              </>
                            )}

                            {selectedInquiry.status !== 'ON_HOLD' && (
                              <>
                                <div className="border-t border-gray-100 my-2"></div>
                                <div className="px-4">
                                  <button
                                    onClick={() => {
                                      handleStatusUpdate(selectedInquiry.id, 'ON_HOLD');
                                      setDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-4 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-800 rounded-lg transition-all duration-200 flex items-center group shadow-sm hover:shadow-md"
                                  >
                                    <BsClock className="w-5 h-5 mr-4 text-yellow-500 group-hover:scale-110 transition-transform duration-200" />
                                    <span className="font-semibold text-base">Put On Hold</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content with enhanced styling */}
              <div className="p-6">
                <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-[#0015AA] rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <BsEnvelope className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {selectedInquiry.serviceRequested || 'Project Inquiry'}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">Service Request</p>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-inner">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base">
                      {selectedInquiry.message}
                    </p>
                  </div>

                  {/* Additional details */}
                  <div className="mt-8 grid grid-cols-1 gap-4">
                    {selectedInquiry.clientPhone && (
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200">
                        <p className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2">Phone</p>
                        <p className="text-lg text-blue-900 font-semibold">{selectedInquiry.clientPhone}</p>
                      </div>
                    )}
                    {selectedInquiry.clientCompany && (
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200">
                        <p className="text-sm font-bold text-purple-800 uppercase tracking-wider mb-2">Company</p>
                        <p className="text-lg text-purple-900 font-semibold">{selectedInquiry.clientCompany}</p>
                      </div>
                    )}
                    {selectedInquiry.budgetRange && (
                      <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200">
                        <p className="text-sm font-bold text-green-800 uppercase tracking-wider mb-2">Budget</p>
                        <p className="text-lg text-green-900 font-semibold">{selectedInquiry.budgetRange}</p>
                      </div>
                    )}
                    {selectedInquiry.timeline && (
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200">
                        <p className="text-sm font-bold text-orange-800 uppercase tracking-wider mb-2">Timeline</p>
                        <p className="text-lg text-orange-900 font-semibold">{selectedInquiry.timeline}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop: Original side-by-side layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Inquiry List */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#0015AA] to-[#003366] px-6 py-4">
                <h2 className="text-lg font-bold text-white">Recent Inquiries</h2>
              </div>
              <div className="max-h-[600px] overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#0015AA] border-t-transparent mx-auto shadow-lg"></div>
                    <p className="text-gray-600 mt-4 font-medium">Loading inquiries...</p>
                  </div>
                ) : filteredInquiries.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                      <BsEnvelope className="w-8 h-8 opacity-50" />
                    </div>
                    <p className="font-medium">No inquiries found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredInquiries.map((inquiry) => (
                      <div
                        key={inquiry.id}
                        onClick={() => handleInquirySelect(inquiry)}
                        className={`p-5 cursor-pointer hover:bg-gradient-to-r hover:from-[#0015AA]/5 hover:to-[#003366]/5 transition-all duration-200 border-l-4 ${
                          selectedInquiry?.id === inquiry.id
                            ? 'bg-gradient-to-r from-[#0015AA]/10 to-[#003366]/10 border-[#0015AA] shadow-md'
                            : 'border-transparent hover:border-[#0015AA]/30'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-gray-900 truncate pr-2 text-base">
                            {inquiry.clientName}
                          </h3>
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm backdrop-blur-sm ${getStatusColor(inquiry.status)}`}>
                            {getStatusIcon(inquiry.status)}
                            <span className="ml-1.5 capitalize">{inquiry.status}</span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2 truncate font-medium">
                          {inquiry.serviceRequested || 'Project Inquiry'}
                        </p>
                        <div className="flex items-center text-xs text-gray-600 font-medium">
                          <BsClock className="w-3.5 h-3.5 mr-1.5" />
                          {formatDate(inquiry.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Inquiry Detail */}
          <div className="lg:col-span-2">
            {selectedInquiry ? (
              <div className="bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-[#0015AA] to-[#003366] px-6 py-5">
                  <div className="flex items-start justify-between">
                    <div className="text-white">
                      <h2 className="text-2xl font-bold">
                        {selectedInquiry.clientName}
                      </h2>
                      <p className="text-blue-100 mt-1 text-lg">{selectedInquiry.clientEmail}</p>
                      <div className="flex items-center mt-3 text-sm text-blue-200">
                        <BsClock className="w-5 h-5 mr-2" />
                        Received {formatDate(selectedInquiry.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-sm bg-white/15 border-white/30 text-white shadow-lg`}>
                        {getStatusIcon(selectedInquiry.status)}
                        <span className="ml-2 capitalize font-medium">{selectedInquiry.status}</span>
                      </span>

                      {/* Dropdown Menu */}
                      <div className="relative">
                        <button
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          className="p-3 text-white/80 hover:text-white hover:bg-white/15 rounded-lg transition-all duration-200 backdrop-blur-sm shadow-lg"
                        >
                          <MoreVertical className="w-6 h-6" />
                        </button>

                        {dropdownOpen && (
                          <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl z-20 overflow-hidden">
                            <div className="py-2">
                              {selectedInquiry.status === 'NEW' && (
                                <div className="px-4">
                                  <button
                                    onClick={() => {
                                      handleStatusUpdate(selectedInquiry.id, 'CONTACTED');
                                      setDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-4 text-sm text-gray-700 hover:bg-[#FBB03B]/10 hover:text-[#0015AA] rounded-lg transition-all duration-200 flex items-center group shadow-sm hover:shadow-md"
                                  >
                                    <BsCheckCircle className="w-5 h-5 mr-4 text-[#FBB03B] group-hover:scale-110 transition-transform duration-200" />
                                    <span className="font-semibold text-base">Mark as Contacted</span>
                                  </button>
                                </div>
                              )}

                              {selectedInquiry.status === 'CONTACTED' && (
                                <>
                                  <div className="border-t border-gray-100 my-2"></div>
                                  <div className="px-5 py-3 bg-gradient-to-r from-[#0015AA]/5 to-[#003366]/5 border-b border-gray-100">
                                    <p className="text-sm font-bold text-[#0015AA] uppercase tracking-wider">Convert Lead</p>
                                  </div>
                                  <div className="px-4 py-2 space-y-1">
                                    <button
                                      onClick={() => {
                                        handleConvertToClient(selectedInquiry);
                                        setDropdownOpen(false);
                                      }}
                                      className="w-full text-left px-4 py-4 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 rounded-lg transition-all duration-200 flex items-center group shadow-sm hover:shadow-md"
                                    >
                                      <BsPersonPlus className="w-5 h-5 mr-4 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
                                      <span className="font-semibold text-base">Convert to Client</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleConvertToProject(selectedInquiry);
                                        setDropdownOpen(false);
                                      }}
                                      className="w-full text-left px-4 py-4 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 rounded-lg transition-all duration-200 flex items-center group shadow-sm hover:shadow-md"
                                    >
                                      <BsFolderPlus className="w-5 h-5 mr-4 text-green-500 group-hover:scale-110 transition-transform duration-200" />
                                      <span className="font-semibold text-base">Convert to Project</span>
                                    </button>
                                  </div>

                                  <div className="border-t border-gray-100 my-2"></div>
                                  <div className="px-5 py-3 bg-gradient-to-r from-[#0015AA]/5 to-[#003366]/5 border-b border-gray-100">
                                    <p className="text-sm font-bold text-[#0015AA] uppercase tracking-wider">Update Status</p>
                                  </div>
                                  <div className="px-4 py-2 space-y-1">
                                    <button
                                      onClick={() => {
                                        handleStatusUpdate(selectedInquiry.id, 'WON');
                                        setDropdownOpen(false);
                                      }}
                                      className="w-full text-left px-4 py-4 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 rounded-lg transition-all duration-200 flex items-center group shadow-sm hover:shadow-md"
                                    >
                                      <BsCheckCircle className="w-5 h-5 mr-4 text-green-500 group-hover:scale-110 transition-transform duration-200" />
                                      <span className="font-semibold text-base">Mark as Won</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleStatusUpdate(selectedInquiry.id, 'LOST');
                                        setDropdownOpen(false);
                                      }}
                                      className="w-full text-left px-4 py-4 text-sm text-gray-700 hover:bg-red-50 hover:text-red-800 rounded-lg transition-all duration-200 flex items-center group shadow-sm hover:shadow-md"
                                    >
                                      <BsArchive className="w-5 h-5 mr-4 text-red-500 group-hover:scale-110 transition-transform duration-200" />
                                      <span className="font-semibold text-base">Mark as Lost</span>
                                    </button>
                                  </div>
                                </>
                              )}

                              {selectedInquiry.status !== 'ON_HOLD' && (
                                <>
                                  <div className="border-t border-gray-100 my-2"></div>
                                  <div className="px-4">
                                    <button
                                      onClick={() => {
                                        handleStatusUpdate(selectedInquiry.id, 'ON_HOLD');
                                        setDropdownOpen(false);
                                      }}
                                      className="w-full text-left px-4 py-4 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-800 rounded-lg transition-all duration-200 flex items-center group shadow-sm hover:shadow-md"
                                    >
                                      <BsClock className="w-5 h-5 mr-4 text-yellow-500 group-hover:scale-110 transition-transform duration-200" />
                                      <span className="font-semibold text-base">Put On Hold</span>
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content with enhanced styling */}
                <div className="p-8">
                  <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 border border-gray-200 rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-[#0015AA] rounded-xl flex items-center justify-center mr-4 shadow-lg">
                        <BsEnvelope className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {selectedInquiry.serviceRequested || 'Project Inquiry'}
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">Service Request</p>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-inner">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base">
                        {selectedInquiry.message}
                      </p>
                    </div>

                    {/* Additional details */}
                    <div className="mt-8 grid grid-cols-2 gap-6">
                      {selectedInquiry.clientPhone && (
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200">
                          <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Phone</p>
                          <p className="text-base text-blue-900 font-semibold">{selectedInquiry.clientPhone}</p>
                        </div>
                      )}
                      {selectedInquiry.clientCompany && (
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200">
                          <p className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-2">Company</p>
                          <p className="text-base text-purple-900 font-semibold">{selectedInquiry.clientCompany}</p>
                        </div>
                      )}
                      {selectedInquiry.budgetRange && (
                        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200">
                          <p className="text-xs font-bold text-green-800 uppercase tracking-wider mb-2">Budget</p>
                          <p className="text-base text-green-900 font-semibold">{selectedInquiry.budgetRange}</p>
                        </div>
                      )}
                      {selectedInquiry.timeline && (
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200">
                          <p className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-2">Timeline</p>
                          <p className="text-base text-orange-900 font-semibold">{selectedInquiry.timeline}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                <BsEnvelope className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an inquiry</h3>
                <p className="text-gray-600">Choose an inquiry from the list to view its details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default InquiriesPage;