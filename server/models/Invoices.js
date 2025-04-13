const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: Number,
  clientName: String,
  date: { type: Date, default: Date.now },
  items: [
    {
      name: String,
      quantity: Number,
      rate: Number,
      total: Number,
    },
  ],
  subtotal: Number,
  tax: Number,
  discount: Number,
  total: Number,
});

module.exports = mongoose.model('Invoice', InvoiceSchema);