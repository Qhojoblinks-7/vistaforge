import React from 'react';
import { BsEye, BsDownload, BsSend, BsCheckCircle, BsTrash, BsPencil } from 'react-icons/bs';

const InvoiceCard = ({
  invoice,
  onView,
  onEdit,
  onDelete,
  onDownload,
  onSend,
  onMarkPaid
}) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'sent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return <BsCheckCircle className="w-3 h-3" />;
      case 'sent': return <BsSend className="w-3 h-3" />;
      case 'overdue': return <BsExclamationTriangle className="w-3 h-3" />;
      default: return null;
    }
  };

  const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid';
  const isDueSoon = new Date(invoice.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && !isOverdue;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
            invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
            invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
            invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-700'
          }`}>
            {invoice.invoiceNumber?.slice(-1) || 'I'}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              #{invoice.invoiceNumber}
            </h3>
            <p className="text-sm text-gray-600">
              {invoice.client?.name || 'No Client'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
            {getStatusIcon(invoice.status)}
            <span className="ml-1 capitalize">{invoice.status || 'draft'}</span>
          </span>
        </div>
      </div>

      {/* Amount and Due Date */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Amount</p>
          <p className="text-xl font-bold text-gray-900">
            ${invoice.total?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Due Date</p>
          <p className={`text-sm font-medium ${
            isOverdue ? 'text-red-600' :
            isDueSoon ? 'text-orange-600' :
            'text-gray-900'
          }`}>
            {new Date(invoice.dueDate).toLocaleDateString()}
            {isOverdue && <span className="ml-1 text-xs">(Overdue)</span>}
            {isDueSoon && !isOverdue && <span className="ml-1 text-xs">(Due Soon)</span>}
          </p>
        </div>
      </div>

      {/* Project Info */}
      {invoice.project && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Project</p>
          <p className="text-sm font-medium text-gray-900">{invoice.project.title}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex space-x-2">
          <button
            onClick={() => onView(invoice)}
            className="p-2 text-gray-600 hover:text-[#0015AA] hover:bg-[#0015AA]/10 rounded-md transition-colors"
            title="View Invoice"
          >
            <BsEye size={16} />
          </button>

          <button
            onClick={() => onDownload(invoice.id)}
            className="p-2 text-gray-600 hover:text-[#FBB03B] hover:bg-[#FBB03B]/10 rounded-md transition-colors"
            title="Download Invoice"
          >
            <BsDownload size={16} />
          </button>

          {invoice.status === 'draft' && (
            <button
              onClick={() => onSend(invoice.id)}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-100 rounded-md transition-colors"
              title="Send Invoice"
            >
              <BsSend size={16} />
            </button>
          )}

          {(invoice.status === 'sent' || invoice.status === 'overdue') && (
            <>
              <button
                onClick={() => onSend(invoice.id)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                title="Resend Invoice"
              >
                <BsSend size={16} />
              </button>

              <button
                onClick={() => onMarkPaid(invoice.id)}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-100 rounded-md transition-colors"
                title="Mark as Paid"
              >
                <BsCheckCircle size={16} />
              </button>
            </>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(invoice)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
            title="Edit Invoice"
          >
            <BsPencil size={16} />
          </button>

          <button
            onClick={() => onDelete(invoice.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors"
            title="Delete Invoice"
          >
            <BsTrash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;