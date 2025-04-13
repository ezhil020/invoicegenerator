import React from "react";
import { useInvoice } from "@/contexts/InvoiceContext";
import { formatCurrency } from "@/utils/formatters";
import { Building, Printer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const InvoicePreview: React.FC = () => {
  const { 
    currentInvoice, 
    invoiceSubtotal, 
    invoiceTaxAmount, 
    invoiceDiscountAmount, 
    invoiceTotal 
  } = useInvoice();

  const handlePrintPreview = () => {
    window.print();
  };

  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Invoice Preview</h2>
          <Button 
            variant="ghost"
            onClick={handlePrintPreview}
            className="text-slate-600 hover:text-slate-800 flex items-center text-sm"
          >
            <Printer className="h-4 w-4 mr-1" /> Print Preview
          </Button>
        </div>
        
        {/* Invoice Preview Paper */}
        <div className="bg-white border border-slate-200 rounded-md p-8 shadow-sm" id="invoice-preview">
          {/* Invoice Header */}
          <div className="flex justify-between mb-8">
            <div>
              <div className="h-12 w-48 bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                <Building className="h-5 w-5 mr-2" /> Your Company Logo
              </div>
              <div className="text-sm text-slate-600">
                <p>Your Company Name</p>
                <p>123 Business Street</p>
                <p>City, State 12345</p>
                <p>contact@yourcompany.com</p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-slate-800 mb-1">INVOICE</h1>
              <p className="text-blue-600 font-medium mb-4">{currentInvoice.details.invoiceNumber}</p>
              <div className="text-sm text-slate-600">
                <p><span className="font-medium">Date:</span> {currentInvoice.details.date}</p>
                <p><span className="font-medium">Due Date:</span> {currentInvoice.details.dueDate}</p>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-slate-500 uppercase mb-2">Bill To</h3>
            <div className="text-slate-800">
              <p className="font-medium text-lg">{currentInvoice.client.name || "Client Name"}</p>
              <p className="text-sm text-slate-600">{currentInvoice.client.email || "client@example.com"}</p>
              <p className="text-sm text-slate-600">{currentInvoice.client.address || "Client Address"}</p>
            </div>
          </div>

          {/* Invoice Items */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-slate-300 text-left text-slate-600">
                <th className="pb-2 font-medium">Item Description</th>
                <th className="pb-2 font-medium text-right">Qty</th>
                <th className="pb-2 font-medium text-right">Rate</th>
                <th className="pb-2 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {currentInvoice.lineItems.map((item) => (
                <tr key={item.id} className="border-b border-slate-200">
                  <td className="py-3">{item.description || "Item Description"}</td>
                  <td className="py-3 text-right">{item.quantity}</td>
                  <td className="py-3 text-right font-mono">{formatCurrency(item.rate)}</td>
                  <td className="py-3 text-right font-mono">{formatCurrency(item.quantity * item.rate)}</td>
                </tr>
              ))}
              {currentInvoice.lineItems.length === 0 && (
                <tr className="border-b border-slate-200">
                  <td colSpan={4} className="py-3 text-center text-slate-500">No items added yet</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Invoice Summary */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-mono">{formatCurrency(invoiceSubtotal)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Tax ({currentInvoice.details.taxRate}%):</span>
                <span className="font-mono">{formatCurrency(invoiceTaxAmount)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Discount:</span>
                <span className="font-mono">{formatCurrency(invoiceDiscountAmount)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between py-2 font-medium">
                <span>Total:</span>
                <span className="font-mono text-lg">{formatCurrency(invoiceTotal)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Notes</h3>
            <p className="text-sm text-slate-600">{currentInvoice.details.notes}</p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-slate-500">
            <p>This invoice was created using the Invoice Generator App</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoicePreview;
