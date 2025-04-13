const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const invoiceRoutes = require('./routes/invoices.js');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/invoices', invoiceRoutes);

mongoose.connect('mongodb://localhost:27017/invoices', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(5000, () => console.log('Server running on port 5000'));
