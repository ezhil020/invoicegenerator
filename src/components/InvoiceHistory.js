import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InvoiceHistory() {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  useEffect(() => {
    // Fetch invoice history from backend
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/invoices');
        setInvoices(response.data);
        setFilteredInvoices(response.data); // Initially display all invoices
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, []);

  useEffect(() => {
    // Filter invoices based on search term
    const filtered = invoices.filter((invoice) => {
      return (
        invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoiceNumber.toString().includes(searchTerm)
      );
    });
    setFilteredInvoices(filtered);
  }, [searchTerm, invoices]);

  return (
    <div className="invoice-history">
      <h2 className="text-2xl font-bold mb-4">Invoice History</h2>
      <input
        type="text"
        placeholder="Search by Client Name or Invoice Number"
        className="mb-4 p-2 border border-gray-300"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="invoice-list">
        {filteredInvoices.length > 0 ? (
          <ul>
            {filteredInvoices.map((invoice) => (
              <li key={invoice._id} className="border p-4 mb-2 rounded-md">
                <h3 className="font-bold">Invoice #{invoice.invoiceNumber}</h3>
                <p><strong>Client:</strong> {invoice.clientName}</p>
                <p><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</p>
                <p><strong>Total:</strong> ${invoice.total}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No invoices found.</p>
        )}
      </div>
    </div>
  );
}

export default InvoiceHistory;
