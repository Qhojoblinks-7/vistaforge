import React, { useState } from 'react';
import { BsChevronUp, BsChevronDown, BsThreeDotsVertical } from 'react-icons/bs';

const DataTable = ({
  title,
  subtitle,
  columns,
  data,
  loading = false,
  error = null,
  emptyMessage = "No data available",
  emptyAction,
  selectable = false,
  selectedItems = [],
  onSelectionChange,
  actions = [],
  className = "",
  headerActions = []
}) => {
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (columnKey) => {
    if (!columns.find(col => col.key === columnKey)?.sortable) return;

    const newOrder = sortBy === columnKey && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(columnKey);
    setSortOrder(newOrder);
  };

  const handleSelectAll = () => {
    if (selectedItems.length === data.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map(item => item.id));
    }
  };

  const handleSelectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      onSelectionChange(selectedItems.filter(id => id !== itemId));
    } else {
      onSelectionChange([...selectedItems, itemId]);
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortBy) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortBy, sortOrder]);

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 ${className}`}>
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-[#0015AA] to-[#003366]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            {subtitle && <p className="text-sm text-blue-100 mt-1">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            {headerActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  action.variant === 'primary'
                    ? 'bg-white text-[#0015AA] hover:bg-gray-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </button>
            ))}
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
              <BsThreeDotsVertical className="text-white" size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectable && selectedItems.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                {selectedItems.length} selected
              </span>
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => action.onClick(selectedItems)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    action.variant === 'danger'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : action.variant === 'primary'
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => onSelectionChange([])}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    className="form-checkbox h-4 w-4 text-[#0015AA] rounded"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable && sortBy === column.key && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? <BsChevronUp size={12} /> : <BsChevronDown size={12} />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0015AA]"></div>
                    <span className="ml-3 text-gray-600">Loading...</span>
                  </div>
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="text-red-600">{error}</div>
                </td>
              </tr>
            )}

            {!loading && !error && sortedData.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                {selectable && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="form-checkbox h-4 w-4 text-[#0015AA] rounded"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(item[column.key], item) : item[column.key]}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      {actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={() => action.onClick(item)}
                          className={`p-2 rounded-md transition-colors ${
                            action.variant === 'danger'
                              ? 'text-red-600 hover:bg-red-50'
                              : action.variant === 'warning'
                              ? 'text-yellow-600 hover:bg-yellow-50'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                          title={action.label}
                        >
                          {action.icon}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {!loading && !error && data.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="w-20 h-20 bg-[#0015AA]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <BsThreeDotsVertical className="h-10 w-10 text-[#0015AA]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No data available</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">{emptyMessage}</p>
          {emptyAction && (
            <button
              onClick={emptyAction.onClick}
              className="bg-[#0015AA] text-white px-6 py-3 rounded-lg hover:bg-[#003366] shadow-lg hover:shadow-xl transition-all duration-300 font-semibold hover:-translate-y-0.5"
            >
              {emptyAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DataTable;