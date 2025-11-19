import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { BsReceipt, BsPlus, BsDownload, BsEye, BsSend, BsFilter, BsBarChart, BsTrash, BsPencil, BsCheckCircle, BsExclamationTriangle } from 'react-icons/bs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Import module components
import InvoiceGenerator from '../components/InvoiceGenerator';
import InvoiceViewer from '../components/InvoiceViewer';
import InvoiceFilters from '../components/InvoiceFilters';
import InvoiceCard from '../components/InvoiceCard';
import InvoiceStatusBadge from '../components/InvoiceStatusBadge';

// Import module services
import {
  fetchInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  sendInvoice,
  markInvoicePaid,
  setFilters,
  clearFilters,
  setSorting,
  setCurrentInvoice
} from '../services/invoicesSlice';

// Use existing thunks to load clients and projects instead of manual fetch
import { fetchClients } from '../../Clients/services/clientsSlice';
import { fetchPublicProjects } from '../../../store/slices/publicPortfolioSlice';

const InvoicesPage = () => {
  const dispatch = useDispatch();
  const {
    invoices,
    loading,
    error,
    filters,
    sortBy,
    sortOrder,
    pagination,
    analytics
  } = useSelector((state) => state.invoices);

  // Clients and projects come from Redux slices now
  const clients = useSelector((state) => state.clients.clients || []);
  const projects = useSelector((state) => state.publicPortfolio.projects || []);

  // Modal states
  const [showGenerator, setShowGenerator] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Load invoices on component mount
  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  // Load clients and projects via existing thunks
  useEffect(() => {
    dispatch(fetchClients());
    dispatch(fetchPublicProjects());
  }, [dispatch]);

  // Handle invoice creation
  const handleCreateInvoice = async (invoiceData) => {
    try {
      await dispatch(createInvoice(invoiceData)).unwrap();
      // Refresh the list
      dispatch(fetchInvoices());
      setShowGenerator(false);
    } catch (error) {
      console.error('Failed to create invoice:', error);
    }
  };

  // Handle invoice viewing
  const handleViewInvoice = (invoice) => {
    dispatch(setCurrentInvoice(invoice));
    setShowViewer(true);
  };

  // Handle invoice editing
  const handleEditInvoice = (invoice) => {
    // For now, just view - editing would need additional modal
    handleViewInvoice(invoice);
  };

  // Handle invoice deletion
  const handleDeleteInvoice = async (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await dispatch(deleteInvoice(invoiceId)).unwrap();
      } catch (error) {
        console.error('Failed to delete invoice:', error);
      }
    }
  };

  // Handle invoice sending
  const handleSendInvoice = async (invoiceId, emailData = {}) => {
    try {
      await dispatch(sendInvoice({ id: invoiceId, emailData })).unwrap();
    } catch (error) {
      console.error('Failed to send invoice:', error);
    }
  };

  // Handle marking invoice as paid
  const handleMarkPaid = async (invoiceId) => {
    try {
      await dispatch(markInvoicePaid({ id: invoiceId, paymentData: {} })).unwrap();
    } catch (error) {
      console.error('Failed to mark invoice as paid:', error);
    }
  };

  // Handle invoice download
  const handleDownloadInvoice = async (invoiceId) => {
    // Find the invoice data
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) {
      console.error('Invoice not found:', invoiceId);
      return;
    }

    // Create a temporary HTML element with the invoice content
    const invoiceHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoice.invoiceNumber} - VistaForge</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1a202c;
            background: #f8fafc;
            padding: 40px 20px;
          }

          .invoice-container {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            overflow: hidden;
          }

          .header {
            background: linear-gradient(135deg, #0015AA 0%, #003366 100%);
            color: white;
            padding: 60px 40px 40px;
            text-align: center;
            position: relative;
          }

          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
          }

          .logo-section {
            position: relative;
            z-index: 2;
          }

          .company-name {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.02em;
          }

          .company-tagline {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 400;
          }

          .invoice-title {
            font-size: 48px;
            font-weight: 800;
            margin-top: 24px;
            letter-spacing: -0.03em;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .invoice-number {
            font-size: 24px;
            font-weight: 600;
            margin-top: 8px;
            opacity: 0.9;
          }

          .content {
            padding: 40px;
          }

          .invoice-meta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
          }

          .meta-section h3 {
            font-size: 14px;
            font-weight: 600;
            color: #0015AA;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 16px;
            position: relative;
          }

          .meta-section h3::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 24px;
            height: 2px;
            background: #FBB03B;
            border-radius: 1px;
          }

          .meta-item {
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .meta-label {
            font-weight: 500;
            color: #64748b;
            font-size: 14px;
          }

          .meta-value {
            font-weight: 600;
            color: #1a202c;
            font-size: 14px;
          }

          .status-badge {
            display: inline-flex;
            align-items: center;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .status-paid { background: #dcfce7; color: #166534; }
          .status-sent { background: #dbeafe; color: #1e40af; }
          .status-overdue { background: #fef2f2; color: #dc2626; }
          .status-draft { background: #f3f4f6; color: #6b7280; }

          .items-section {
            margin-bottom: 40px;
          }

          .items-title {
            font-size: 18px;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 20px;
          }

          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .items-table th {
            background: #f8fafc;
            color: #64748b;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 16px 20px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
          }

          .items-table td {
            padding: 16px 20px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 14px;
          }

          .items-table tbody tr:hover {
            background: #f8fafc;
          }

          .item-description {
            font-weight: 500;
            color: #1a202c;
          }

          .item-meta {
            font-size: 12px;
            color: #64748b;
            margin-top: 4px;
          }

          .amount-cell {
            text-align: right;
            font-weight: 600;
            color: #1a202c;
          }

          .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 40px;
          }

          .totals-box {
            background: #f8fafc;
            border-radius: 12px;
            padding: 24px;
            min-width: 300px;
            border: 1px solid #e2e8f0;
          }

          .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            font-size: 14px;
          }

          .total-row.subtotal,
          .total-row.tax,
          .total-row.discount {
            color: #64748b;
          }

          .total-row.total {
            border-top: 2px solid #0015AA;
            padding-top: 16px;
            margin-top: 16px;
            font-size: 18px;
            font-weight: 700;
            color: #0015AA;
          }

          .notes-section {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border: 1px solid #0ea5e9;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 40px;
          }

          .notes-title {
            font-size: 16px;
            font-weight: 600;
            color: #0c4a6e;
            margin-bottom: 8px;
          }

          .notes-content {
            color: #374151;
            line-height: 1.6;
          }

          .footer {
            background: #f8fafc;
            padding: 24px 40px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
          }

          .footer-text {
            font-size: 12px;
            color: #64748b;
            margin-bottom: 8px;
          }

          .footer-link {
            color: #0015AA;
            text-decoration: none;
            font-weight: 500;
          }

          .footer-link:hover {
            text-decoration: underline;
          }

          @media print {
            body {
              background: white;
              padding: 0;
            }
            .invoice-container {
              box-shadow: none;
              border-radius: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <header class="header">
            <div class="logo-section">
              <div class="company-name">VistaForge</div>
              <div class="company-tagline">Professional Design & Development</div>
              <div class="invoice-title">INVOICE</div>
              <div class="invoice-number">#${invoice.invoiceNumber}</div>
            </div>
          </header>

          <div class="content">
            <div class="invoice-meta">
              <div class="meta-section">
                <h3>Bill To</h3>
                <div class="meta-item">
                  <span class="meta-value">${invoice.client?.name || 'Client'}</span>
                </div>
                ${invoice.client?.company ? `
                  <div class="meta-item">
                    <span class="meta-value">${invoice.client.company}</span>
                  </div>
                ` : ''}
                ${invoice.client?.email ? `
                  <div class="meta-item">
                    <span class="meta-label">Email:</span>
                    <span class="meta-value">${invoice.client.email}</span>
                  </div>
                ` : ''}
              </div>

              <div class="meta-section">
                <h3>Invoice Details</h3>
                <div class="meta-item">
                  <span class="meta-label">Invoice Date:</span>
                  <span class="meta-value">${new Date(invoice.issueDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Due Date:</span>
                  <span class="meta-value">${new Date(invoice.dueDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Status:</span>
                  <span class="status-badge status-${invoice.status}">${invoice.status}</span>
                </div>
              </div>
            </div>

            <div class="items-section">
              <h3 class="items-title">Services & Items</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Rate</th>
                    <th style="text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.items && invoice.items.length > 0
                    ? invoice.items.map(item => `
                        <tr>
                          <td>
                            <div class="item-description">${item.description}</div>
                          </td>
                          <td style="text-align: center;">${item.quantity}</td>
                          <td style="text-align: right;">$${item.rate?.toFixed(2)}</td>
                          <td style="text-align: right;" class="amount-cell">$${item.amount?.toFixed(2)}</td>
                        </tr>
                      `).join('')
                    : '<tr><td colspan="4" style="text-align: center; padding: 40px; color: #64748b;">No items found</td></tr>'
                  }
                </tbody>
              </table>
            </div>

            <div class="totals-section">
              <div class="totals-box">
                <div class="total-row subtotal">
                  <span>Subtotal</span>
                  <span>$${(invoice.subtotal || invoice.total || 0).toFixed(2)}</span>
                </div>
                ${invoice.tax && invoice.tax > 0 ? `
                  <div class="total-row tax">
                    <span>Tax</span>
                    <span>$${invoice.tax.toFixed(2)}</span>
                  </div>
                ` : ''}
                ${invoice.discount && invoice.discount > 0 ? `
                  <div class="total-row discount">
                    <span>Discount</span>
                    <span>-$${invoice.discount.toFixed(2)}</span>
                  </div>
                ` : ''}
                <div class="total-row total">
                  <span>Total Amount</span>
                  <span>$${(invoice.total || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            ${invoice.notes ? `
              <div class="notes-section">
                <h4 class="notes-title">Additional Notes</h4>
                <div class="notes-content">${invoice.notes}</div>
              </div>
            ` : ''}

            ${invoice.project ? `
              <div class="notes-section" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-color: #f59e0b;">
                <h4 class="notes-title" style="color: #92400e;">Project Information</h4>
                <div class="notes-content">
                  <strong>${invoice.project.title}</strong><br>
                  ${invoice.project.description || ''}
                </div>
              </div>
            ` : ''}
          </div>

          <footer class="footer">
            <div class="footer-text">
              This invoice was generated on ${new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <div class="footer-text">
              Thank you for your business! | <a href="mailto:hello@vistaforge.com" class="footer-link">hello@vistaforge.com</a>
            </div>
          </footer>
        </div>
      </body>
      </html>
    `;

    // Create a temporary element to render the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = invoiceHTML;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '210mm';
    tempDiv.style.minHeight = '297mm';
    document.body.appendChild(tempDiv);

    try {
      // Use html2canvas to capture the invoice as an image
      const canvas = await html2canvas(tempDiv, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123 // A4 height in pixels at 96 DPI
      });

      // Create PDF from canvas
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Calculate dimensions to fit A4
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      pdf.save(`Invoice-${invoice.invoiceNumber}.pdf`);

      console.log('Downloaded PDF invoice:', invoiceId);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to HTML download if PDF generation fails
      const blob = new Blob([invoiceHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${invoice.invoiceNumber}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      // Clean up temporary element
      document.body.removeChild(tempDiv);
    }
  };

  // Handle sorting
  const handleSort = (column) => {
    const newOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setSorting({ sortBy: column, sortOrder: newOrder }));
    dispatch(fetchInvoices());
  };

  // Handle filters
  const handleFiltersChange = (newFilters) => {
    dispatch(setFilters(newFilters));
    dispatch(fetchInvoices());
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(fetchInvoices());
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative overflow-hidden">
      {/* Background Banner */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0015AA]/5 via-transparent to-[#FBB03B]/5"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-[#FBB03B]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-32 left-16 w-48 h-48 bg-[#0015AA]/8 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-blue-400/6 rounded-full blur-xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Helmet>
          <title>Invoices - VistaForge</title>
          <meta name="description" content="Generate, track, and manage your invoices" />
        </Helmet>

        {/* Analytics Dashboard */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-[#0015AA] to-[#003366] rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold">${analytics.totalRevenue?.toFixed(2) || '0.00'}</p>
              </div>
              <BsBarChart className="text-blue-200" size={24} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#FBB03B] to-[#E0A030] rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Pending Amount</p>
                <p className="text-2xl font-bold">${analytics.pendingAmount?.toFixed(2) || '0.00'}</p>
              </div>
              <BsReceipt className="text-orange-200" size={24} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Paid Amount</p>
                <p className="text-2xl font-bold">${analytics.paidAmount?.toFixed(2) || '0.00'}</p>
              </div>
              <BsCheckCircle className="text-green-200" size={24} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Overdue Amount</p>
                <p className="text-2xl font-bold">${analytics.overdueAmount?.toFixed(2) || '0.00'}</p>
              </div>
              <BsExclamationTriangle className="text-red-200" size={24} />
            </div>
          </div>
        </div>

        {/* Header with CTA and Banner Background */}
        <div className="mb-8 relative">
          {/* Header Banner Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0015AA]/10 via-[#FBB03B]/5 to-[#0015AA]/10 rounded-xl"></div>
          <div className="absolute top-4 right-8 w-24 h-24 bg-[#FBB03B]/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-2 left-12 w-16 h-16 bg-[#0015AA]/15 rounded-full blur-lg"></div>

          <div className="relative z-10 flex items-center justify-between py-6 px-6">
            <div>
              <p className="text-gray-700 font-medium">Generate, track, and manage your invoices</p>
              <p className="text-sm text-gray-500 mt-1">{invoices.length} total invoices</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center font-semibold"
              >
                <BsFilter className="mr-2" size={16} />
                Filters
              </button>
              <button
                onClick={() => setShowGenerator(true)}
                className="bg-[#0015AA] text-white px-6 py-3 rounded-lg hover:bg-[#003366] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center font-semibold hover:-translate-y-0.5"
              >
                <BsPlus className="mr-2" size={18} />
                Create Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <InvoiceFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            clients={clients}
            projects={projects}
          />
        )}

        {/* Invoices Grid/List View */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-[#0015AA] to-[#003366]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">All Invoices</h2>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <BsReceipt className="text-white" size={16} />
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0015AA]"></div>
              <span className="ml-3 text-gray-600">Loading invoices...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <BsExclamationTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading invoices</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Grid View */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {invoices.map((invoice) => (
                    <InvoiceCard
                      key={invoice.id}
                      invoice={invoice}
                      onView={handleViewInvoice}
                      onEdit={handleEditInvoice}
                      onDelete={handleDeleteInvoice}
                      onDownload={handleDownloadInvoice}
                      onSend={handleSendInvoice}
                      onMarkPaid={handleMarkPaid}
                    />
                  ))}
                </div>
              </div>

              {invoices.length === 0 && (
                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white">
                  <div className="w-20 h-20 bg-[#0015AA]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BsReceipt className="h-10 w-10 text-[#0015AA]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No invoices yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">Create your first invoice to start managing your billing and get paid faster.</p>
                  <button
                    onClick={() => setShowGenerator(true)}
                    className="bg-[#0015AA] text-white px-6 py-3 rounded-lg hover:bg-[#003366] shadow-lg hover:shadow-xl transition-all duration-300 font-semibold hover:-translate-y-0.5"
                  >
                    Create Your First Invoice
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <InvoiceGenerator
        isOpen={showGenerator}
        onClose={() => setShowGenerator(false)}
        onSave={handleCreateInvoice}
        clients={clients}
        projects={projects}
      />

      <InvoiceViewer
        invoice={useSelector((state) => state.invoices.currentInvoice)}
        isOpen={showViewer}
        onClose={() => setShowViewer(false)}
        onDownload={handleDownloadInvoice}
        onSend={handleSendInvoice}
        onMarkPaid={handleMarkPaid}
      />
    </div>
  );
};

export default InvoicesPage;