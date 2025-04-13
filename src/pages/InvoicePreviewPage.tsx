import React from "react";
import InvoicePreview from "@/components/InvoicePreview";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";

const InvoicePreviewPage: React.FC = () => {
  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-800">Invoice Preview</h1>
          <div className="space-x-4">
            <Link href="/">
              <Button variant="outline" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Form
              </Button>
            </Link>
            <Link href="/history">
              <Button variant="outline" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" /> View All Invoices
              </Button>
            </Link>
          </div>
        </header>
        <p className="text-slate-600 mb-8">Your invoice has been saved. You can now print or export it as PDF.</p>

        <InvoicePreview />
      </div>
    </div>
  );
};

export default InvoicePreviewPage;