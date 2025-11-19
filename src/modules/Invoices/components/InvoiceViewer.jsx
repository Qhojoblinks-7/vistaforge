import React, { useState } from 'react';
import { BsX, BsDownload, BsPrinter, BsSend, BsCheckCircle, BsClock, BsExclamationTriangle } from 'react-icons/bs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const InvoiceViewer = ({ invoice, isOpen, onClose, onDownload, onSend, onMarkPaid }) => {
  const [isSending, setIsSending] = useState(false);

  if (!isOpen || !invoice) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <BsCheckCircle className="text-green-500" size={20} />;
      case 'sent':
        return <BsClock className="text-blue-500" size={20} />;
      case 'overdue':
        return <BsExclamationTriangle className="text-red-500" size={20} />;
      default:
        return <BsClock className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      await onSend(invoice.id);
    } finally {
      setIsSending(false);
    }
  };

  const handleDownload = async () => {
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

      console.log('Downloaded PDF invoice from viewer');
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

  const handlePrint = () => {
    // Create printable version
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

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
            background: white;
            padding: 20px;
          }

          .invoice-container {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: white;
          }

          .header {
            background: linear-gradient(135deg, #0015AA 0%, #003366 100%);
            color: white;
            padding: 40px 30px 30px;
            text-align: center;
          }

          .logo-section {
            position: relative;
            z-index: 2;
          }

          .company-name {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 6px;
            letter-spacing: -0.02em;
          }

          .company-tagline {
            font-size: 14px;
            opacity: 0.9;
            font-weight: 400;
          }

          .invoice-title {
            font-size: 36px;
            font-weight: 800;
            margin-top: 20px;
            letter-spacing: -0.03em;
          }

          .invoice-number {
            font-size: 20px;
            font-weight: 600;
            margin-top: 6px;
            opacity: 0.9;
          }

          .content {
            padding: 30px;
          }

          .invoice-meta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
          }

          .meta-section h3 {
            font-size: 12px;
            font-weight: 600;
            color: #0015AA;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 12px;
            position: relative;
          }

          .meta-section h3::after {
            content: '';
            position: absolute;
            bottom: -3px;
            left: 0;
            width: 20px;
            height: 2px;
            background: #FBB03B;
            border-radius: 1px;
          }

          .meta-item {
            margin-bottom: 6px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .meta-label {
            font-weight: 500;
            color: #64748b;
            font-size: 12px;
          }

          .meta-value {
            font-weight: 600;
            color: #1a202c;
            font-size: 12px;
          }

          .status-badge {
            display: inline-flex;
            align-items: center;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .status-paid { background: #dcfce7; color: #166534; }
          .status-sent { background: #dbeafe; color: #1e40af; }
          .status-overdue { background: #fef2f2; color: #dc2626; }
          .status-draft { background: #f3f4f6; color: #6b7280; }

          .items-section {
            margin-bottom: 30px;
          }

          .items-title {
            font-size: 16px;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 15px;
          }

          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 18px;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .items-table th {
            background: #f8fafc;
            color: #64748b;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
          }

          .items-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 12px;
          }

          .item-description {
            font-weight: 500;
            color: #1a202c;
          }

          .amount-cell {
            text-align: right;
            font-weight: 600;
            color: #1a202c;
          }

          .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 30px;
          }

          .totals-box {
            background: #f8fafc;
            border-radius: 8px;
            padding: 18px;
            min-width: 250px;
            border: 1px solid #e2e8f0;
          }

          .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-size: 12px;
          }

          .total-row.subtotal,
          .total-row.tax,
          .total-row.discount {
            color: #64748b;
          }

          .total-row.total {
            border-top: 2px solid #0015AA;
            padding-top: 12px;
            margin-top: 12px;
            font-size: 16px;
            font-weight: 700;
            color: #0015AA;
          }

          .notes-section {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border: 1px solid #0ea5e9;
            border-radius: 8px;
            padding: 18px;
            margin-bottom: 30px;
          }

          .notes-title {
            font-size: 14px;
            font-weight: 600;
            color: #0c4a6e;
            margin-bottom: 6px;
          }

          .notes-content {
            color: #374151;
            line-height: 1.5;
            font-size: 12px;
          }

          .footer {
            background: #f8fafc;
            padding: 18px 30px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
          }

          .footer-text {
            font-size: 10px;
            color: #64748b;
            margin-bottom: 6px;
          }

          .footer-link {
            color: #0015AA;
            text-decoration: none;
            font-weight: 500;
          }

          @media print {
            body {
              background: white;
              padding: 0;
            }
            .invoice-container {
              box-shadow: none;
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
                  <span class="meta-value">${new Date(invoice.issueDate).toLocaleDateString()}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Due Date:</span>
                  <span class="meta-value">${new Date(invoice.dueDate).toLocaleDateString()}</span>
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
                    : '<tr><td colspan="4" style="text-align: center; padding: 30px; color: #64748b;">No items found</td></tr>'
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

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0015AA] to-[#003366] text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-2xl font-bold">Invoice {invoice.invoiceNumber || invoice.id}</h2>
                <p className="text-blue-100 mt-1">Invoice details and payment information</p>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(invoice.status)}`}>
                {getStatusIcon(invoice.status)}
                <span className="text-sm font-semibold capitalize">{invoice.status}</span>
              </div>
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
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Invoice Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Invoice Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice Number:</span>
                    <span className="font-semibold">{invoice.invoiceNumber || invoice.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Issue Date:</span>
                    <span className="font-semibold">{new Date(invoice.issueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-semibold">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                  </div>
                  {invoice.paidDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid Date:</span>
                      <span className="font-semibold">{new Date(invoice.paidDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Client Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Client Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-semibold">{invoice.client?.name || 'N/A'}</span>
                    </div>
                    {invoice.client?.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-semibold">{invoice.client.email}</span>
                      </div>
                    )}
                    {invoice.client?.company && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Company:</span>
                        <span className="font-semibold">{invoice.client.company}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Information */}
              {invoice.project && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Project Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Project:</span>
                        <span className="font-semibold">{invoice.project.title}</span>
                      </div>
                      {invoice.project.description && (
                        <div>
                          <span className="text-gray-600">Description:</span>
                          <p className="text-sm text-gray-800 mt-1">{invoice.project.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Invoice Items */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Invoice Items</h3>
              <div className="space-y-4">
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.description}</h4>
                          <div className="text-sm text-gray-600 mt-1">
                            Quantity: {item.quantity} × ${item.rate?.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">${item.amount?.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-600">No items found for this invoice.</p>
                  </div>
                )}
              </div>

              {/* Invoice Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-6 border border-gray-200 mt-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Invoice Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">${(invoice.subtotal || invoice.total || 0).toFixed(2)}</span>
                  </div>

                  {invoice.tax && invoice.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-semibold">${invoice.tax.toFixed(2)}</span>
                    </div>
                  )}

                  {invoice.discount && invoice.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-semibold text-green-600">-${invoice.discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-[#0015AA]">${(invoice.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="text-sm font-bold text-blue-900 mb-2">Notes</h4>
                  <p className="text-sm text-blue-800">{invoice.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <button
                onClick={handlePrint}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200 flex items-center font-semibold"
              >
                <BsPrinter className="mr-2" size={16} />
                Print
              </button>

              <button
                onClick={() => onDownload(invoice.id)}
                className="bg-[#FBB03B] text-[#0015AA] px-4 py-2 rounded-lg hover:bg-[#E0A030] transition-all duration-200 flex items-center font-semibold"
              >
                <BsDownload className="mr-2" size={16} />
                Download PDF
              </button>
            </div>

            <div className="flex space-x-3">
              {invoice.status === 'draft' && (
                <button
                  onClick={handleSend}
                  disabled={isSending}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center font-semibold disabled:opacity-50"
                >
                  <BsSend className="mr-2" size={16} />
                  {isSending ? 'Sending...' : 'Send Invoice'}
                </button>
              )}

              {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                <button
                  onClick={() => onMarkPaid(invoice.id)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center font-semibold"
                >
                  <BsCheckCircle className="mr-2" size={16} />
                  Mark as Paid
                </button>
              )}

              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewer;