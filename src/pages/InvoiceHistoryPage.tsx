import React from "react";
import InvoiceHistory from "@/components/InvoiceHistory";

const InvoiceHistoryPage: React.FC = () => {
  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Invoice History</h1>
          <p className="text-slate-600">View, manage, and export your past invoices</p>
        </header>

        <InvoiceHistory />
      </div>
    </div>
  );
};

export default InvoiceHistoryPage;