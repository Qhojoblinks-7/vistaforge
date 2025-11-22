import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { X, FileText, DollarSign, Clock, Calendar, User, Mail } from 'lucide-react';
import { fetchUnbilledTimeLogs } from '../../../store/slices/timeLogsSlice';
import { generateInvoice } from '../../../store/slices/invoicesSlice';
import { useToast } from '../../../context/ToastContext';

const InvoiceGenerator = ({ projectId, client, projectRate, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  });

  const { unbilledLogs, loading } = useSelector(state => state.timeLogs);
  const { saving } = useSelector(state => state.invoices);

  useEffect(() => {
    dispatch(fetchUnbilledTimeLogs(projectId));
  }, [dispatch, projectId]);

  const handleGenerateInvoice = async () => {
    try {
      await dispatch(generateInvoice({
        project_id: projectId,
        due_date: dueDate
      })).unwrap();

      showSuccess('Invoice generated successfully!', 3000);
      navigate('/invoices');
    } catch (error) {
      showError('Invoice generation failed. Please try again.', 5000);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
          <div className="text-center">Loading invoice data...</div>
        </div>
      </div>
    );
  }

  const totalHours = unbilledLogs.reduce((sum, log) => sum + parseFloat(log.durationHours || 0), 0);
  const totalAmount = totalHours * parseFloat(projectRate || 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Generate Invoice</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Client Details Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Client Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Client Name</label>
                <p className="text-gray-900">{client?.client_name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </label>
                <p className="text-gray-900">{client?.contact_email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Line Items Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Line Items</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Hours</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Rate</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {unbilledLogs.map((log, index) => (
                    <tr key={log.id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        Time tracking: {log.task_description || 'Task work'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(log.start_time).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {parseFloat(log.duration_hours || 0).toFixed(2)}h
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        ${parseFloat(projectRate || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        ${(parseFloat(log.duration_hours || 0) * parseFloat(projectRate || 0)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rate and Totals Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Project Rate</h4>
              <div className="text-2xl font-bold text-blue-600">
                ${parseFloat(projectRate || 0).toFixed(2)}/hour
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Invoice Totals</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">Total Hours:</span>
                  <span className="font-medium">{totalHours.toFixed(2)}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">Total Amount:</span>
                  <span className="text-xl font-bold">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Due Date Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateInvoice}
              disabled={saving || unbilledLogs.length === 0}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>
                {saving ? 'Generating...' : 'Generate Invoice'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;