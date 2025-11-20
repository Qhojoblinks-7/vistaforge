import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BsReceipt, BsPlus, BsDownload, BsEye, BsSend, BsFilter, BsTrash, BsPencil, BsCheckCircle, BsExclamationTriangle } from 'react-icons/bs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
} from '../store/slices/invoicesSlice';

// Use existing thunks to load clients and projects instead of manual fetch
import { fetchClients } from '../modules/Clients/services/clientsSlice';
import { fetchPublicProjects } from '../store/slices/publicPortfolioSlice';

// Import shared components
import PageLayout from '../components/common/PageLayout';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import MetricCard from '../components/common/MetricCard';
import FilterPanel, { SelectFilter, DateRangeFilter } from '../components/common/FilterPanel';
import { FormModal } from '../components/common/Modal';

// Import components
import InvoiceGenerator from '../components/InvoiceGenerator';
import InvoiceViewer from '../components/InvoiceViewer';

// Remove unused imports
// import InvoiceFilters from '../components/InvoiceFilters';

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
        <title>Invoice ${invoice.invoice_number} - VistaForge</title>
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
              <div class="invoice-number">#${invoice.invoice_number}</div>
            </div>
          </header>

          <div class="content">
            <div class="invoice-meta">
              <div class="meta-section">
                <h3>Bill To</h3>
                <div class="meta-item">
                  <span class="meta-value">${invoice.client_name || 'Client'}</span>
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
                  <span class="meta-value">${new Date(invoice.created_at || invoice.issue_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Due Date:</span>
                  <span class="meta-value">${new Date(invoice.due_date).toLocaleDateString('en-US', {
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
                  <span>$${(invoice.subtotal || invoice.amount || 0).toFixed(2)}</span>
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
                  <span>$${(invoice.total || invoice.amount || 0).toFixed(2)}</span>
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
      pdf.save(`Invoice-${invoice.invoice_number}.pdf`);

      console.log('Downloaded PDF invoice:', invoiceId);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to HTML download if PDF generation fails
      const blob = new Blob([invoiceHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${invoice.invoice_number}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      // Clean up temporary element
      document.body.removeChild(tempDiv);
    }
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <BsCheckCircle className="text-green-500" size={16} />;
      case 'sent': return <BsSend className="text-blue-500" size={16} />;
      case 'overdue': return <BsExclamationTriangle className="text-red-500" size={16} />;
      case 'draft': return <BsReceipt className="text-gray-500" size={16} />;
      default: return <BsReceipt className="text-gray-500" size={16} />;
    }
  };

  const tableColumns = [
    { key: 'invoice_number', header: 'Invoice #', sortable: true },
    { key: 'client', header: 'Client', sortable: true, render: (value) => value?.name || '—' },
    { key: 'total', header: 'Amount', sortable: true, render: (value) => `$${parseFloat(value || 0).toFixed(2)}` },
    { key: 'status', header: 'Status', render: (value) => (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
        {getStatusIcon(value)}
        <span className="ml-1 capitalize">{value || 'draft'}</span>
      </span>
    )},
    { key: 'due_date', header: 'Due Date', sortable: true, render: (value) => value ? new Date(value).toLocaleDateString() : '—' },
    { key: 'issue_date', header: 'Issue Date', sortable: true, render: (value) => value ? new Date(value).toLocaleDateString() : '—' }
  ];

  const tableActions = [
    { icon: <BsEye />, label: 'View', onClick: handleViewInvoice },
    { icon: <BsDownload />, label: 'Download', onClick: (invoice) => handleDownloadInvoice(invoice.id) },
    { icon: <BsSend />, label: 'Send', onClick: (invoice) => handleSendInvoice(invoice.id), variant: 'primary' },
    { icon: <BsCheckCircle />, label: 'Mark Paid', onClick: (invoice) => handleMarkPaid(invoice.id), variant: 'success' },
    { icon: <BsTrash />, label: 'Delete', onClick: (invoice) => handleDeleteInvoice(invoice.id), variant: 'danger' }
  ];

  return (
    <PageLayout
      title="Invoices"
      description="Manage and track your invoices"
      keywords="invoices, billing, payments, finance"
    >
      {/* Analytics Dashboard */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-6">
        <MetricCard
          title="Total Invoices"
          value={analytics?.totalInvoices || 0}
          icon={<BsReceipt size={24} />}
          color="primary"
        />
        <MetricCard
          title="Paid"
          value={`$${analytics?.totalPaid || 0}`}
          icon={<BsCheckCircle size={24} />}
          color="success"
        />
        <MetricCard
          title="Pending"
          value={`$${analytics?.totalPending || 0}`}
          icon={<BsSend size={24} />}
          color="warning"
        />
        <MetricCard
          title="Overdue"
          value={`$${analytics?.totalOverdue || 0}`}
          icon={<BsExclamationTriangle size={24} />}
          color="danger"
        />
        <MetricCard
          title="This Month"
          value={`$${analytics?.monthlyTotal || 0}`}
          icon={<BsBarChart size={24} />}
          color="secondary"
        />
      </div>

      <PageHeader
        title="Invoice Management"
        description="Manage your invoices and track payments"
        stats={[
          { label: 'total', value: invoices.length },
          { label: 'paid', value: invoices.filter(inv => inv.status === 'paid').length },
          { label: 'pending', value: invoices.filter(inv => inv.status === 'sent').length }
        ]}
        actions={[
          {
            label: 'Filters',
            icon: <BsFilter size={16} />,
            onClick: () => setShowFilters(!showFilters),
            variant: showFilters ? 'secondary' : 'default'
          },
          {
            label: 'Create Invoice',
            icon: <BsPlus size={18} />,
            onClick: () => setShowGenerator(true),
            variant: 'primary'
          }
        ]}
      />

      {/* Filters */}
      {showFilters && (
        <FilterPanel
          isOpen={showFilters}
          onToggle={() => setShowFilters(!showFilters)}
          onClearFilters={handleClearFilters}
        >
          <SelectFilter
            label="Status"
            value={filters.status || ''}
            onChange={(value) => handleFiltersChange({ ...filters, status: value })}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'sent', label: 'Sent' },
              { value: 'paid', label: 'Paid' },
              { value: 'overdue', label: 'Overdue' }
            ]}
          />
          <SelectFilter
            label="Client"
            value={filters.client_id || ''}
            onChange={(value) => handleFiltersChange({ ...filters, client_id: value })}
            options={clients.map(client => ({ value: client.id, label: client.name }))}
          />
          <DateRangeFilter
            label="Date Range"
            startDate={filters.start_date || ''}
            endDate={filters.end_date || ''}
            onStartDateChange={(value) => handleFiltersChange({ ...filters, start_date: value })}
            onEndDateChange={(value) => handleFiltersChange({ ...filters, end_date: value })}
          />
        </FilterPanel>
      )}

      {/* Invoices Table */}
      <DataTable
        title="All Invoices"
        subtitle={`${invoices.length} total invoices`}
        columns={tableColumns}
        data={invoices}
        loading={loading}
        error={error}
        emptyMessage="No invoices found. Create your first invoice to get started."
        emptyAction={{
          label: 'Create Invoice',
          onClick: () => setShowGenerator(true)
        }}
        actions={tableActions}
        headerActions={[
          {
            label: 'Export CSV',
            icon: <BsDownload size={16} />,
            onClick: () => {/* TODO: Implement CSV export */}
          }
        ]}
      />

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
    </PageLayout>
  );
};

export default InvoicesPage;