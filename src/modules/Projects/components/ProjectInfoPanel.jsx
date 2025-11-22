import React, { useState } from 'react';
import { Edit, Trash2, FileText, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { useDispatch } from 'react-redux';
import StatusBadge from './StatusBadge';
import InvoiceGenerator from '../../Finance/components/InvoiceGenerator';
import { updateProject, deleteProject } from '../../../store/slices/adminPortfolioSlice';
import { useToast } from '../../../context/ToastContext';

const ProjectInfoPanel = ({ project, client, timeLogs, onProjectUpdate, onProjectDelete, onEditProject }) => {
  const dispatch = useDispatch();
  const { showError } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false);

  // Calculate metrics
  const totalLoggedHours = timeLogs?.reduce((sum, log) => sum + parseFloat(log.duration_hours || 0), 0) || 0;
  const unbilledHours = timeLogs?.filter(log => !log.is_billed).reduce((sum, log) => sum + parseFloat(log.duration_hours || 0), 0) || 0;
  const unbilledAmount = unbilledHours * parseFloat(project?.project_rate || 0);

  const budgetHours = parseFloat(project?.budget_hours || 0);
  const budgetBurnPercentage = budgetHours > 0 ? (totalLoggedHours / budgetHours) * 100 : 0;
  const isOverBudget = budgetBurnPercentage > 90;

  const handleStatusChange = async (newStatus) => {
    try {
      await dispatch(updateProject({ id: project.id, data: { status: newStatus } }));
      onProjectUpdate && onProjectUpdate();
    } catch (error) {
      showError('Failed to update project status. Please try again.', 5000);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteProject(project.id));
      onProjectDelete && onProjectDelete();
    } catch (error) {
      showError('Failed to delete project. Please try again.', 5000);
    }
    setShowDeleteConfirm(false);
  };

  const handleGenerateInvoice = () => {
    setShowInvoiceGenerator(true);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 space-y-6">
      {/* Project Status */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Project Status</label>
        <StatusBadge
          status={project.status}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Project Rate */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Project Rate</label>
        <div className="text-lg font-semibold text-gray-900">
          ${parseFloat(project.project_rate || 0).toFixed(2)}/hour
        </div>
      </div>

      {/* Unbilled Time */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Unbilled Time</label>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="text-lg font-semibold">{unbilledHours.toFixed(1)}h</span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-500" />
          <span className="text-lg font-semibold text-green-600">
            ${unbilledAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Budget Burn */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Budget Burn</label>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{totalLoggedHours.toFixed(1)}h used</span>
            <span>{budgetHours.toFixed(1)}h budget</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isOverBudget ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(budgetBurnPercentage, 100)}%` }}
            />
          </div>
          <div className={`text-xs font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
            {budgetBurnPercentage.toFixed(1)}% used
          </div>
        </div>
      </div>

      {/* Client Info */}
      {client && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Client</label>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">{client.client_name}</div>
            <div className="text-sm text-gray-600">{client.contact_email}</div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        {project.status === 'Completed' && (
          <button
            onClick={handleGenerateInvoice}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Invoice</span>
          </button>
        )}

        <div className="flex space-x-2">
          <button
            onClick={() => onEditProject && onEditProject()}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Delete Project</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{project.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Generator Modal */}
      {showInvoiceGenerator && (
        <InvoiceGenerator
          projectId={project.id}
          client={client}
          projectRate={project.project_rate}
          onClose={() => setShowInvoiceGenerator(false)}
          onSuccess={() => {
            setShowInvoiceGenerator(false);
            onProjectUpdate();
          }}
        />
      )}
    </div>
  );
};

export default ProjectInfoPanel;