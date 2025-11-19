import React from 'react';
import { BsCheckCircle, BsSend, BsExclamationTriangle, BsClock } from 'react-icons/bs';

const InvoiceStatusBadge = ({ status, size = 'sm', showIcon = true }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return {
          label: 'Paid',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          icon: BsCheckCircle,
          iconColor: 'text-green-600'
        };
      case 'sent':
        return {
          label: 'Sent',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          icon: BsSend,
          iconColor: 'text-blue-600'
        };
      case 'overdue':
        return {
          label: 'Overdue',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          icon: BsExclamationTriangle,
          iconColor: 'text-red-600'
        };
      case 'draft':
        return {
          label: 'Draft',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: BsClock,
          iconColor: 'text-gray-600'
        };
      case 'pending':
        return {
          label: 'Pending',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          icon: BsClock,
          iconColor: 'text-yellow-600'
        };
      default:
        return {
          label: status || 'Unknown',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: BsClock,
          iconColor: 'text-gray-600'
        };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses[size]}`}>
      {showIcon && IconComponent && (
        <IconComponent className={`mr-1 ${config.iconColor}`} size={size === 'xs' ? 10 : size === 'sm' ? 12 : 14} />
      )}
      {config.label}
    </span>
  );
};

export default InvoiceStatusBadge;