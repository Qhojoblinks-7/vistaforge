import React from 'react';
import { BsFilter, BsX } from 'react-icons/bs';

const FilterPanel = ({
  isOpen,
  onToggle,
  filters,
  onFiltersChange,
  onClearFilters,
  children,
  title = "Filters",
  className = ""
}) => {
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className={`flex items-center px-4 py-3 rounded-lg font-semibold transition-all duration-200 hover:-translate-y-0.5 bg-gray-100 text-gray-700 hover:bg-gray-200 ${className}`}
      >
        <BsFilter className="mr-2" size={16} />
        {title}
      </button>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <BsFilter className="mr-2" size={18} />
          {title}
        </h3>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <BsX size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {children}
      </div>

      <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
        <button
          onClick={onClearFilters}
          className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 font-semibold transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Clear All
        </button>
        <button
          onClick={onToggle}
          className="px-4 py-2 bg-[#0015AA] text-white rounded-lg hover:bg-[#003366] font-semibold transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

// Filter Field component for consistent filter inputs
export const FilterField = ({
  label,
  children,
  className = ""
}) => (
  <div className={`space-y-2 ${className}`}>
    <label className="block text-sm font-semibold text-gray-800">
      {label}
    </label>
    {children}
  </div>
);

// Select Filter
export const SelectFilter = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = ""
}) => (
  <FilterField label={label} className={className}>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-colors"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </FilterField>
);

// Date Range Filter
export const DateRangeFilter = ({
  label,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className = ""
}) => (
  <FilterField label={label} className={className}>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs text-gray-600 mb-1">From</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">To</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
        />
      </div>
    </div>
  </FilterField>
);

// Text Filter
export const TextFilter = ({
  label,
  value,
  onChange,
  placeholder = "Enter text...",
  className = ""
}) => (
  <FilterField label={label} className={className}>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-colors"
    />
  </FilterField>
);

// Checkbox Filter
export const CheckboxFilter = ({
  label,
  checked,
  onChange,
  className = ""
}) => (
  <div className={`flex items-center space-x-3 ${className}`}>
    <input
      type="checkbox"
      id={`filter-${label.toLowerCase().replace(/\s+/g, '-')}`}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="form-checkbox h-4 w-4 text-[#0015AA] focus:ring-[#0015AA] border-gray-300 rounded"
    />
    <label
      htmlFor={`filter-${label.toLowerCase().replace(/\s+/g, '-')}`}
      className="text-sm font-medium text-gray-700 cursor-pointer"
    >
      {label}
    </label>
  </div>
);

export default FilterPanel;