import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const StatusBadge = ({ status, onStatusChange, editable = true }) => {
  const [isEditing, setIsEditing] = useState(false);

  const statusConfig = {
    'Planning': { color: 'bg-gray-100 text-gray-800 border-gray-300', bg: 'bg-gray-50' },
    'In Progress': { color: 'bg-blue-100 text-blue-800 border-blue-300', bg: 'bg-blue-50' },
    'On Hold': { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', bg: 'bg-yellow-50' },
    'Completed': { color: 'bg-green-100 text-green-800 border-green-300', bg: 'bg-green-50' },
    'Cancelled': { color: 'bg-red-100 text-red-800 border-red-300', bg: 'bg-red-50' }
  };

  const config = statusConfig[status] || statusConfig['Planning'];

  const statusOptions = ['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];

  const handleStatusSelect = (newStatus) => {
    onStatusChange(newStatus);
    setIsEditing(false);
  };

  if (!editable) {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
        {status}
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsEditing(!isEditing)}
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border cursor-pointer hover:opacity-80 transition-opacity ${config.color}`}
      >
        {status}
        <ChevronDown className="w-3 h-3 ml-1" />
      </button>

      {isEditing && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsEditing(false)}
          />
          <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20">
            {statusOptions.map(option => (
              <button
                key={option}
                onClick={() => handleStatusSelect(option)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                  option === status ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                {option}
                {option === status && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StatusBadge;