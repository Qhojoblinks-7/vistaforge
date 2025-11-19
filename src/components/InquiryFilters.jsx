import React from 'react';
import { BsX } from 'react-icons/bs';

const InquiryFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'NEW', label: 'New' },
    { value: 'CONTACTED', label: 'Contacted' },
    { value: 'QUOTED', label: 'Quoted' },
    { value: 'NEGOTIATING', label: 'Negotiating' },
    { value: 'WON', label: 'Won' },
    { value: 'LOST', label: 'Lost' },
    { value: 'ON_HOLD', label: 'On Hold' },
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' },
  ];

  const serviceOptions = [
    { value: '', label: 'All Services' },
    { value: 'WEB_DEV', label: 'Web Development' },
    { value: 'WEB_DESIGN', label: 'Web Design' },
    { value: 'MOBILE_APP', label: 'Mobile App' },
    { value: 'BRANDING', label: 'Branding' },
    { value: 'UI_UX', label: 'UI/UX Design' },
    { value: 'SEO', label: 'SEO & Marketing' },
    { value: 'CONSULTING', label: 'Consulting' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'OTHER', label: 'Other' },
  ];

  const sourceOptions = [
    { value: '', label: 'All Sources' },
    { value: 'WEBSITE', label: 'Website' },
    { value: 'EMAIL', label: 'Direct Email' },
    { value: 'LINKEDIN', label: 'LinkedIn' },
    { value: 'UPWORK', label: 'Upwork' },
    { value: 'REFERRAL', label: 'Referral' },
    { value: 'SOCIAL', label: 'Social Media' },
    { value: 'OTHER', label: 'Other' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filter Inquiries</h3>
        <button
          onClick={onClearFilters}
          className="text-gray-500 hover:text-gray-700 flex items-center text-sm"
        >
          <BsX className="mr-1" size={16} />
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            value={filters.priority || ''}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Service Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service
          </label>
          <select
            value={filters.serviceRequested || ''}
            onChange={(e) => handleFilterChange('serviceRequested', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
          >
            {serviceOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Source Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-7 mb-1">
            Source
          </label>
          <select
            value={filters.source || ''}
            onChange={(e) => handleFilterChange('source', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
          >
            {sourceOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags Filter */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={filters.tags?.join(', ') || ''}
          onChange={(e) => handleFilterChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
          placeholder="e.g., hot-lead, web-dev, urgent"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default InquiryFilters;