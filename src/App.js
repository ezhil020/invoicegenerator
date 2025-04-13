import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import InvoiceHistory from './components/InvoiceHistory';
import './output.css';
import './styles.css';

function App() {
  const [invoiceData, setInvoiceData] = useState(null);

  return (
    <Router>
      <div className="app bg-gray-100 min-h-screen">
        <header className="bg-blue-500 text-white py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Invoice Generator</h1>
            <nav>
              <Link to="/" className="mr-4 hover:underline">Generate Invoice</Link>
              <Link to="/invoice-history" className="hover:underline">Invoice History</Link>
            </nav>
          </div>
          <div className="bg-blue-500 text-white p-4 rounded-md">
  Tailwind CSS is working!
</div>
        </header>
        <main className="max-w-6xl mx-auto py-6">
          <Routes>
            <Route path="/" element={<InvoiceForm onSubmit={setInvoiceData} />} />
            <Route path="/invoice-preview" element={<InvoicePreview data={invoiceData} />} />
            <Route path="/invoice-history" element={<InvoiceHistory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;