import React, { useState, useEffect } from 'react';
import { BsPlus, BsTrash, BsSave, BsX, BsCalculator } from 'react-icons/bs';

const InvoiceGenerator = ({ isOpen, onClose, onSave, clients = [], projects = [] }) => {
  const [invoiceData, setInvoiceData] = useState({
    client: '',
    project: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [
      {
        id: 1,
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0
      }
    ],
    notes: '',
    taxRate: 0,
    discount: 0
  });

  const [errors, setErrors] = useState({});

  // Calculate totals
  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() * invoiceData.taxRate) / 100;
  };

  const calculateDiscount = () => {
    return (calculateSubtotal() * invoiceData.discount) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - calculateDiscount();
  };

  // Update item amount when quantity or rate changes
  const updateItemAmount = (index) => {
    const items = [...invoiceData.items];
    items[index].amount = items[index].quantity * items[index].rate;
    setInvoiceData({ ...invoiceData, items });
  };

  // Add new item
  const addItem = () => {
    const newItem = {
      id: Date.now(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, newItem]
    });
  };

  // Remove item
  const removeItem = (index) => {
    if (invoiceData.items.length > 1) {
      const items = invoiceData.items.filter((_, i) => i !== index);
      setInvoiceData({ ...invoiceData, items });
    }
  };

  // Update item
  const updateItem = (index, field, value) => {
    const items = [...invoiceData.items];
    items[index][field] = value;
    setInvoiceData({ ...invoiceData, items });

    // Recalculate amount if quantity or rate changed
    if (field === 'quantity' || field === 'rate') {
      updateItemAmount(index);
    }
  };

  // Set due date based on issue date and terms
  const setDueDate = (terms) => {
    const issueDate = new Date(invoiceData.issueDate);
    let dueDate = new Date(issueDate);

    switch (terms) {
      case 'net15':
        dueDate.setDate(issueDate.getDate() + 15);
        break;
      case 'net30':
        dueDate.setDate(issueDate.getDate() + 30);
        break;
      case 'net45':
        dueDate.setDate(issueDate.getDate() + 45);
        break;
      case 'net60':
        dueDate.setDate(issueDate.getDate() + 60);
        break;
      default:
        return;
    }

    setInvoiceData({
      ...invoiceData,
      dueDate: dueDate.toISOString().split('T')[0]
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!invoiceData.client) {
      newErrors.client = 'Client is required';
    }

    if (!invoiceData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    const validItems = invoiceData.items.filter(item =>
      item.description.trim() && item.quantity > 0 && item.rate > 0
    );

    if (validItems.length === 0) {
      newErrors.items = 'At least one valid item is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = () => {
    if (validateForm()) {
      const invoiceToSave = {
        ...invoiceData,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        discount: calculateDiscount(),
        total: calculateTotal(),
        status: 'draft'
      };
      onSave(invoiceToSave);
      onClose();
    }
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

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Client and Project Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                  Client *
                </label>
                <select
                  value={invoiceData.client}
                  onChange={(e) => setInvoiceData({ ...invoiceData, client: e.target.value })}
                  className={`w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all duration-200 hover:border-gray-300 ${errors.client ? 'border-red-300' : ''}`}
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} - {client.company}
                    </option>
                  ))}
                </select>
                {errors.client && <p className="text-red-500 text-sm mt-1">{errors.client}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                  Project (Optional)
                </label>
                <select
                  value={invoiceData.project}
                  onChange={(e) => setInvoiceData({ ...invoiceData, project: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
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

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={invoiceData.issueDate}
                  onChange={(e) => setInvoiceData({ ...invoiceData, issueDate: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                  className={`w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all duration-200 hover:border-gray-300 ${errors.dueDate ? 'border-red-300' : ''}`}
                />
                {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                  Payment Terms
                </label>
                <select
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                >
                  <option value="">Select terms</option>
                  <option value="net15">Net 15 days</option>
                  <option value="net30">Net 30 days</option>
                  <option value="net45">Net 45 days</option>
                  <option value="net60">Net 60 days</option>
                </select>
              </div>
            </div>

            {/* Invoice Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Invoice Items</h3>
                <button
                  onClick={addItem}
                  className="bg-[#FBB03B] text-[#0015AA] px-4 py-2 rounded-lg hover:bg-[#E0A030] transition-all duration-200 flex items-center font-semibold hover:-translate-y-0.5"
                >
                  <BsPlus className="mr-2" size={16} />
                  Add Item
                </button>
              </div>

              {errors.items && <p className="text-red-500 text-sm mb-4">{errors.items}</p>}

              <div className="space-y-4">
                {invoiceData.items.map((item, index) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-12 md:col-span-5">
                        <label className="block text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide">
                          Description
                        </label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          placeholder="Item description"
                          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                        />
                      </div>

                      <div className="col-span-6 md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide">
                          Qty
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                        />
                      </div>

                      <div className="col-span-6 md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide">
                          Rate
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                        />
                      </div>

                      <div className="col-span-6 md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide">
                          Amount
                        </label>
                        <div className="w-full border-2 border-gray-100 bg-gray-100 rounded-lg px-3 py-2 text-gray-900 font-semibold">
                          ${item.amount.toFixed(2)}
                        </div>
                      </div>

                      <div className="col-span-6 md:col-span-1">
                        <button
                          onClick={() => removeItem(index)}
                          disabled={invoiceData.items.length === 1}
                          className="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Remove item"
                        >
                          <BsTrash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax and Discount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={invoiceData.taxRate}
                  onChange={(e) => setInvoiceData({ ...invoiceData, taxRate: parseFloat(e.target.value) || 0 })}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                  Discount (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={invoiceData.discount}
                  onChange={(e) => setInvoiceData({ ...invoiceData, discount: parseFloat(e.target.value) || 0 })}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                Notes (Optional)
              </label>
              <textarea
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                placeholder="Payment terms, additional notes, etc."
                rows="3"
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
              />
            </div>

            {/* Invoice Summary */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <BsCalculator className="mr-2" />
                Invoice Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
                </div>

                {invoiceData.taxRate > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax ({invoiceData.taxRate}%):</span>
                    <span className="font-semibold">${calculateTax().toFixed(2)}</span>
                  </div>
                )}

                {invoiceData.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount ({invoiceData.discount}%):</span>
                    <span className="font-semibold text-green-600">-${calculateDiscount().toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-[#0015AA]">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-[#0015AA] text-white px-8 py-3 rounded-lg hover:bg-[#003366] shadow-lg hover:shadow-xl transition-all duration-300 font-semibold hover:-translate-y-0.5 flex items-center"
            >
              <BsSave className="mr-2" size={18} />
              Create Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;