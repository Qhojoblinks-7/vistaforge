import React from 'react';
import { BsFilter, BsX, BsSearch, BsCalendar, BsPerson, BsCash } from 'react-icons/bs';

const InvoiceFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  clients = [],
  projects = []
}) => {
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters).some(value =>
    value !== '' && value !== null && value !== undefined
  );

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#0015AA]/10 rounded-lg">
            <BsFilter className="text-[#0015AA]" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Filter Invoices</h3>
            <p className="text-sm text-gray-600">Narrow down your invoice list</p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <BsX size={16} />
            <span className="text-sm font-medium">Clear Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Status Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800 uppercase tracking-wide">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all duration-200 hover:border-gray-300 appearance-none bg-white"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Client Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800 uppercase tracking-wide">
            Client
          </label>
          <div className="relative">
            <BsPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={filters.client || ''}
              onChange={(e) => handleFilterChange('client', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all duration-200 hover:border-gray-300 appearance-none bg-white"
            >
              <option value="">All Clients</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Project Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800 uppercase tracking-wide">
            Project
          </label>
          <select
            value={filters.project || ''}
            onChange={(e) => handleFilterChange('project', e.target.value)}
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all duration-200 hover:border-gray-300 appearance-none bg-white"
          >
            <option value="">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Range Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800 uppercase tracking-wide">
            Amount Range
          </label>
          <div className="relative">
            <BsCash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={filters.amountRange || ''}
              onChange={(e) => handleFilterChange('amountRange', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all duration-200 hover:border-gray-300 appearance-none bg-white"
            >
              <option value="">All Amounts</option>
              <option value="0-1000">$0 - $1,000</option>
              <option value="1000-5000">$1,000 - $5,000</option>
              <option value="5000-10000">$5,000 - $10,000</option>
              <option value="10000+">$10,000+</option>
            </select>
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800 uppercase tracking-wide">
              From Date
            </label>
            <div className="relative">
              <BsCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800 uppercase tracking-wide">
              To Date
            </label>
            <div className="relative">
              <BsCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800 uppercase tracking-wide">
            Search Invoices
          </label>
          <div className="relative">
            <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by invoice number, client name, or description..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            {filters.status && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#0015AA]/10 text-[#0015AA]">
                Status: {statusOptions.find(opt => opt.value === filters.status)?.label}
                <button
                  onClick={() => handleFilterChange('status', '')}
                  className="ml-2 hover:bg-[#0015AA]/20 rounded-full p-0.5"
                >
                  <BsX size={12} />
                </button>
              </span>
            )}
            {filters.client && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Client: {clients.find(c => c.id === filters.client)?.name}
                <button
                  onClick={() => handleFilterChange('client', '')}
                  className="ml-2 hover:bg-green-200 rounded-full p-0.5"
                >
                  <BsX size={12} />
                </button>
              </span>
            )}
            {filters.project && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Project: {projects.find(p => p.id === filters.project)?.title}
                <button
                  onClick={() => handleFilterChange('project', '')}
                  className="ml-2 hover:bg-purple-200 rounded-full p-0.5"
                >
                  <BsX size={12} />
                </button>
              </span>
            )}
            {filters.amountRange && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Amount: {filters.amountRange}
                <button
                  onClick={() => handleFilterChange('amountRange', '')}
                  className="ml-2 hover:bg-orange-200 rounded-full p-0.5"
                >
                  <BsX size={12} />
                </button>
              </span>
            )}
            {(filters.dateFrom || filters.dateTo) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Date: {filters.dateFrom || '...'} to {filters.dateTo || '...'}
                <button
                  onClick={() => {
                    handleFilterChange('dateFrom', '');
                    handleFilterChange('dateTo', '');
                  }}
                  className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                >
                  <BsX size={12} />
                </button>
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Search: "{filters.search}"
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-2 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <BsX size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceFilters;