import React from 'react';
import { BsX } from 'react-icons/bs';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  className = ''
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden ${className}`}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && <h3 className="text-xl font-bold text-gray-900">{title}</h3>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <BsX size={24} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

// Form Modal - for create/edit forms
export const FormModal = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  loading = false,
  children,
  size = 'md'
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {children}
        </div>

        <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#0015AA] text-white px-6 py-3 rounded-lg hover:bg-[#003366] font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : submitLabel}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
          >
            {cancelLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Confirm Modal - for confirmations
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'danger',
  loading = false
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const confirmButtonClasses = {
    danger: 'bg-red-600 hover:bg-red-700',
    primary: 'bg-[#0015AA] hover:bg-[#003366]',
    secondary: 'bg-[#FBB03B] hover:bg-[#E0A030]'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center">
        <p className="text-gray-700 mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${confirmButtonClasses[confirmVariant]}`}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Modal;