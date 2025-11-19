import React, { useState, useEffect } from 'react';
import { BsX, BsPlus, BsTrash, BsSave, BsCalculator } from 'react-icons/bs';

const InvoiceGenerator = ({ isOpen, onClose, onSave, clients = [], projects = [] }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    projectId: '',
    invoiceNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }]
  });

  const [calculations, setCalculations] = useState({
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0
  });

  // Calculate totals whenever items change
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const tax = subtotal * 0.1; // 10% tax
    const discount = 0; // Could be added later
    const total = subtotal + tax - discount;

    setCalculations({ subtotal, tax, discount, total });
  }, [formData.items]);

  // Auto-generate invoice number
  useEffect(() => {
    if (!formData.invoiceNumber) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setFormData(prev => ({
        ...prev,
        invoiceNumber: `INV-${year}${month}-${random}`
      }));
    }
  }, [formData.invoiceNumber]);

  // Set default due date (30 days from issue date)
  useEffect(() => {
    if (formData.issueDate && !formData.dueDate) {
      const dueDate = new Date(formData.issueDate);
      dueDate.setDate(dueDate.getDate() + 30);
      setFormData(prev => ({
        ...prev,
        dueDate: dueDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.issueDate, formData.dueDate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;

    // Auto-calculate amount
    if (field === 'quantity' || field === 'rate') {
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      const rate = parseFloat(updatedItems[index].rate) || 0;
      updatedItems[index].amount = quantity * rate;
    }

    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.clientId || !formData.invoiceNumber || !formData.issueDate || !formData.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.items.some(item => !item.description || item.quantity <= 0 || item.rate <= 0)) {
      alert('Please ensure all items have description, quantity, and rate');
      return;
    }

    // Prepare data for GraphQL mutation
    const invoiceData = {
      clientId: formData.clientId,
      projectId: formData.projectId || null,
      invoiceNumber: formData.invoiceNumber,
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      notes: formData.notes,
      items: formData.items.map(item => ({
        description: item.description,
        quantity: parseInt(item.quantity),
        rate: parseFloat(item.rate),
        amount: parseFloat(item.amount)
      })),
      subtotal: calculations.subtotal,
      tax: calculations.tax,
      discount: calculations.discount,
      total: calculations.total
    };

    onSave(invoiceData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0015AA] to-[#003366] text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Create New Invoice</h2>
              <p className="text-blue-100 mt-1">Generate a professional invoice for your client</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <BsX size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Invoice Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Invoice Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Invoice Number *
                    </label>
                    <input
                      type="text"
                      value={formData.invoiceNumber}
                      onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all"
                      placeholder="INV-2024-001"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Issue Date *
                      </label>
                      <input
                        type="date"
                        value={formData.issueDate}
                        onChange={(e) => handleInputChange('issueDate', e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Client & Project Selection */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Client & Project</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Client *
                    </label>
                    <select
                      value={formData.clientId}
                      onChange={(e) => handleInputChange('clientId', e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all appearance-none bg-white"
                      required
                    >
                      <option value="">Select a client</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.name} {client.company ? `(${client.company})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Project (Optional)
                    </label>
                    <select
                      value={formData.projectId}
                      onChange={(e) => handleInputChange('projectId', e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all appearance-none bg-white"
                    >
                      <option value="">Select a project</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all resize-none"
                  placeholder="Additional notes or payment terms..."
                />
              </div>
            </div>

            {/* Right Column - Items & Totals */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Invoice Items</h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="bg-[#0015AA] text-white px-3 py-2 rounded-lg hover:bg-[#003366] transition-colors flex items-center text-sm"
                  >
                    <BsPlus size={14} className="mr-1" />
                    Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="grid grid-cols-12 gap-3 mb-3">
                        <div className="col-span-5">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Description *
                          </label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0015AA] focus:border-[#0015AA]"
                            placeholder="Service description"
                            required
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Qty *
                          </label>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0015AA] focus:border-[#0015AA]"
                            required
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Rate *
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0015AA] focus:border-[#0015AA]"
                            placeholder="0.00"
                            required
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Amount
                          </label>
                          <input
                            type="number"
                            value={item.amount?.toFixed(2)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100"
                            readOnly
                          />
                        </div>

                        <div className="col-span-1 flex items-end">
                          {formData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-500 hover:text-red-700 p-2"
                              title="Remove item"
                            >
                              <BsTrash size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoice Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <BsCalculator className="mr-2" />
                  Invoice Summary
                </h4>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">${calculations.subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (10%):</span>
                    <span className="font-semibold">${calculations.tax.toFixed(2)}</span>
                  </div>

                  {calculations.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-semibold text-green-600">-${calculations.discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-[#0015AA]">${calculations.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-[#0015AA] text-white px-8 py-3 rounded-lg hover:bg-[#003366] shadow-lg hover:shadow-xl transition-all duration-300 font-semibold hover:-translate-y-0.5 flex items-center"
            >
              <BsSave className="mr-2" size={18} />
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceGenerator;