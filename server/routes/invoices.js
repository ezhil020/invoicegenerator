const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoices');

router.get('/', async (req, res) => {
  const invoices = await Invoice.find();
  res.json(invoices);
});

router.post('/', async (req, res) => {
  const latest = await Invoice.findOne().sort({ invoiceNumber: -1 });
  const newInvoice = new Invoice({
    ...req.body,
    invoiceNumber: latest ? latest.invoiceNumber + 1 : 1,
  });
  const saved = await newInvoice.save();
  res.json(saved);
});
// GET /api/invoices/search?client=John&from=2024-01-01&to=2025-01-01
router.get('/search', async (req, res) => {
  const { client, from, to } = req.query;
  const filter = {};

  if (client) {
    filter.clientName = { $regex: client, $options: 'i' }; // case-insensitive
  }

  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const results = await Invoice.find(filter).sort({ date: -1 });
  res.json(results);
});

module.exports = router;
