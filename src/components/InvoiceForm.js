import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function InvoiceForm({ onSubmit }) {
  const [clientName, setClientName] = useState('');
  const [items, setItems] = useState([{ name: '', quantity: 1, rate: 0 }]);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === 'quantity' || field === 'rate' ? +value : value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, rate: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const taxAmount = subtotal * (tax / 100);
    const total = subtotal + taxAmount - discount;
    const itemWithTotals = items.map(item => ({ ...item, total: item.quantity * item.rate }));
    const invoice = { clientName, items: itemWithTotals, subtotal, tax: taxAmount, discount, total };

    const res = await axios.post('http://localhost:5000/api/invoices', invoice);
    onSubmit(res.data);

    // Redirect to the invoice preview page
    navigate('/invoice-preview');
  };

  return (
    <div className="max-w-5xl mx-auto bg-card shadow-lg rounded-lg overflow-hidden">
      {/* Header Section */}
      <div className="bg-primary p-6 text-primary-foreground">
        <h2 className="text-2xl font-bold">Create New Invoice</h2>
        <p className="text-sm opacity-90">Fill in the details below to generate an invoice</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Client Details Section */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="floating-label-input">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Invoice Date
              </label>
              <input
                type="date"
                className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="floating-label-input">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Invoice Number
              </label>
              <input
                type="text"
                className="w-full p-3 bg-muted border border-input rounded-md"
                placeholder="Auto-generated"
                readOnly
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="floating-label-input">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Client Name
              </label>
              <input
                type="text"
                placeholder="Enter client name"
                className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
            <div className="floating-label-input">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Client Address
              </label>
              <textarea
                className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                rows="3"
                placeholder="Enter client address"
              />
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Invoice Items</h3>
          <div className="invoice-table">
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th className="w-5/12">Item Description</th>
                    <th className="w-2/12 text-center">Quantity</th>
                    <th className="w-2/12 text-center">Rate</th>
                    <th className="w-2/12 text-center">Amount</th>
                    <th className="w-1/12"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="p-3">
                        <input
                          type="text"
                          placeholder="Item name"
                          className="w-full p-2 border border-input rounded-md"
                          value={item.name}
                          onChange={(e) => handleItemChange(i, 'name', e.target.value)}
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          min="1"
                          className="w-full p-2 border border-input rounded-md text-center"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(i, 'quantity', e.target.value)}
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-full p-2 border border-input rounded-md text-center"
                          value={item.rate}
                          onChange={(e) => handleItemChange(i, 'rate', e.target.value)}
                        />
                      </td>
                      <td className="p-3 text-center">
                        ${(item.quantity * item.rate).toFixed(2)}
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          className="text-destructive hover:text-destructive/80 p-1 rounded-full"
                          onClick={() => setItems(items.filter((_, index) => index !== i))}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={addItem}
              className="mt-4 text-primary hover:text-primary/80 font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Item
            </button>
          </div>
        </div>

        {/* Summary Section */}
        <div className="flex justify-end mt-8">
          <div className="w-1/2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="floating-label-input">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-input rounded-md"
                  value={tax}
                  onChange={(e) => setTax(+e.target.value)}
                />
              </div>
              <div className="floating-label-input">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Discount Amount
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-input rounded-md"
                  value={discount}
                  onChange={(e) => setDiscount(+e.target.value)}
                />
              </div>
            </div>

            <div className="bg-muted/20 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">
                  ${items.reduce((sum, item) => sum + (item.quantity * item.rate), 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({tax}%):</span>
                <span className="font-medium">
                  ${(items.reduce((sum, item) => sum + (item.quantity * item.rate), 0) * (tax / 100)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount:</span>
                <span className="font-medium">-${discount}</span>
              </div>
              <div className="border-t border-border pt-2 mt-2 flex justify-between">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg">
                  ${(
                    items.reduce((sum, item) => sum + (item.quantity * item.rate), 0) * (1 + tax / 100) - discount
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-border">
          <button
            type="button"
            className="px-6 py-2.5 border border-border rounded-md text-muted-foreground hover:bg-muted transition-colors"
          >
            Save Draft
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Generate Invoice
          </button>
        </div>
      </form>
    </div>
  );
}

export default InvoiceForm;