import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function InvoicePreview({ data }) {
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Invoice #${data.invoiceNumber}`, 14, 22);
    doc.setFontSize(12);
    doc.text(`Client: ${data.clientName}`, 14, 32);
    autoTable(doc, {
      head: [['Item', 'Quantity', 'Rate', 'Total']],
      body: data.items.map(item => [item.name, item.quantity, item.rate, item.total]),
      startY: 40,
    });
    doc.text(`Subtotal: ${data.subtotal}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Tax: ${data.tax}`, 14, doc.lastAutoTable.finalY + 20);
    doc.text(`Discount: ${data.discount}`, 14, doc.lastAutoTable.finalY + 30);
    doc.text(`Total: ${data.total}`, 14, doc.lastAutoTable.finalY + 40);
    doc.save(`invoice-${data.invoiceNumber}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Invoice #{data.invoiceNumber}</h2>
      <p className="text-gray-700 mb-2"><strong>Client:</strong> {data.clientName}</p>
      <table className="w-full border-collapse border border-gray-300 mb-4">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Item</th>
            <th className="border border-gray-300 px-4 py-2">Quantity</th>
            <th className="border border-gray-300 px-4 py-2">Rate</th>
            <th className="border border-gray-300 px-4 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, i) => (
            <tr key={i}>
              <td className="border border-gray-300 px-4 py-2">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
              <td className="border border-gray-300 px-4 py-2">{item.rate}</td>
              <td className="border border-gray-300 px-4 py-2">{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-right">
        <p className="text-gray-700"><strong>Subtotal:</strong> ${data.subtotal.toFixed(2)}</p>
        <p className="text-gray-700"><strong>Tax:</strong> ${data.tax.toFixed(2)}</p>
        <p className="text-gray-700"><strong>Discount:</strong> ${data.discount.toFixed(2)}</p>
        <p className="text-gray-800 font-bold"><strong>Total:</strong> ${data.total.toFixed(2)}</p>
      </div>
      <button
  onClick={downloadPDF}
  className="mt-6 bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 font-semibold"
>
  Download PDF
</button>
    </div>
  );
}

export default InvoicePreview;