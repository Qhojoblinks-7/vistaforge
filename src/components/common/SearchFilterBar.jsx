import React from 'react';
import { BsSearch, BsFilter, BsX } from 'react-icons/bs';

const SearchFilterBar = ({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  showFilters,
  onToggleFilters,
  filterButtonText = 'Filters',
  placeholder = 'Search...',
  children // For additional filter controls
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 sm:p-6 mb-6">
      {/* Search and Filter Controls - Horizontal Layout */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        {/* Search Input */}
        <div className="flex-1 relative">
          <form onSubmit={onSearchSubmit} className="w-full">
            <div className="relative">
              <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent min-h-[44px] text-base"
              />
            </div>
          </form>
        </div>

        {/* Filter Button */}
        <button
          onClick={onToggleFilters}
          className={`px-4 py-3 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 font-medium min-h-[44px] min-w-[44px] ${
            showFilters
              ? 'bg-[#0015AA] text-white border-[#0015AA]'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <BsFilter className="w-4 h-4" />
          <span className="hidden sm:inline">{filterButtonText}</span>
        </button>

        {/* Additional Controls */}
        {children}
      </div>

      {/* Filter Content */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#0015AA]">Filters</h3>
            <button
              onClick={onToggleFilters}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <BsX className="w-5 h-5" />
            </button>
          </div>
          {/* Filter content will be passed as children */}
          <div className="space-y-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;