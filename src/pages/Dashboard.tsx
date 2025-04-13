import React from "react";
import InvoiceForm from "@/components/InvoiceForm";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";

const Dashboard: React.FC = () => {
  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Invoice Generator</h1>
            <p className="text-slate-600">Create professional invoices with automatic calculations</p>
          </div>
          <Link href="/history">
            <Button variant="outline" className="flex items-center">
              <ClipboardList className="h-4 w-4 mr-2" /> View Invoice History
            </Button>
          </Link>
        </header>

        <div className="max-w-4xl mx-auto">
          <InvoiceForm />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
