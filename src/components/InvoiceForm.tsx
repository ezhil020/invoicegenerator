import React from "react";
import { useInvoice } from "@/contexts/InvoiceContext";
import { LineItem as LineItemType } from "@/lib/types";
import LineItem from "./LineItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/formatters";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { generatePDF } from "@/utils/pdf";
import { useLocation } from "wouter";
import { 
  File, 
  Plus, 
  RefreshCw, 
  Save
} from "lucide-react";

const InvoiceForm: React.FC = () => {
  const { 
    currentInvoice, 
    updateInvoice, 
    addLineItem, 
    updateLineItem, 
    removeLineItem, 
    resetInvoice, 
    saveInvoice,
    invoiceSubtotal,
    invoiceTaxAmount,
    invoiceTotal,
    invoiceDiscountAmount,
    isLoading
  } = useInvoice();
  
  const [, setLocation] = useLocation();

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateInvoice({
      client: {
        ...currentInvoice.client,
        [name]: value
      }
    });
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    // Convert numeric fields to numbers
    if (name === "taxRate" || name === "discount") {
      parsedValue = parseFloat(value) || 0;
    }
    
    updateInvoice({
      details: {
        ...currentInvoice.details,
        [name]: parsedValue
      }
    });
  };

  const handleUpdateLineItem = (id: string, field: keyof LineItemType, value: string | number) => {
    let parsedValue = value;
    
    // Ensure numerical fields are parsed as numbers
    if (field === "quantity") {
      parsedValue = parseInt(value as string, 10) || 0;
    } else if (field === "rate") {
      parsedValue = parseFloat(value as string) || 0;
    }
    
    updateLineItem(id, { [field]: parsedValue });
  };

  const handleExportPDF = () => {
    generatePDF(
      currentInvoice, 
      invoiceSubtotal, 
      invoiceTaxAmount, 
      invoiceDiscountAmount, 
      invoiceTotal
    );
  };
  
  const handleSaveInvoice = async () => {
    try {
      await saveInvoice();
      setLocation('/preview');
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };

  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Create New Invoice</h2>
        
        {/* Invoice Details Section */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceNumber" className="text-sm font-medium text-slate-700">
                Invoice #
              </Label>
              <div className="flex">
                <Input 
                  id="invoiceNumber" 
                  name="invoiceNumber"
                  value={currentInvoice.details.invoiceNumber} 
                  className="bg-slate-100 w-full" 
                  readOnly 
                />
                <span className="ml-2 text-slate-500 flex items-center text-sm">
                  (Auto-generated)
                </span>
              </div>
            </div>
            <div>
              <Label htmlFor="date" className="text-sm font-medium text-slate-700">
                Date
              </Label>
              <Input 
                type="date" 
                id="date" 
                name="date"
                value={currentInvoice.details.date} 
                onChange={handleDetailsChange}
                className="w-full" 
              />
            </div>
            <div>
              <Label htmlFor="dueDate" className="text-sm font-medium text-slate-700">
                Due Date
              </Label>
              <Input 
                type="date" 
                id="dueDate" 
                name="dueDate"
                value={currentInvoice.details.dueDate} 
                onChange={handleDetailsChange}
                className="w-full" 
              />
            </div>
          </div>
        </div>

        {/* Client Info Section */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-slate-700 mb-3">Client Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                Client Name
              </Label>
              <Input 
                type="text" 
                id="name" 
                name="name"
                placeholder="Enter client name" 
                value={currentInvoice.client.name}
                onChange={handleClientChange}
                className="w-full" 
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </Label>
              <Input 
                type="email" 
                id="email" 
                name="email"
                placeholder="client@example.com" 
                value={currentInvoice.client.email}
                onChange={handleClientChange}
                className="w-full" 
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address" className="text-sm font-medium text-slate-700">
                Address
              </Label>
              <Textarea 
                id="address" 
                name="address"
                placeholder="Enter client address" 
                rows={2} 
                value={currentInvoice.client.address}
                onChange={handleClientChange}
                className="w-full" 
              />
            </div>
          </div>
        </div>

        {/* Line Items Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-medium text-slate-700">Line Items</h3>
            <Button 
              onClick={addLineItem} 
              variant="ghost" 
              className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Item
            </Button>
          </div>
          
          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="p-2 text-sm font-medium text-slate-700 border-b">Item Description</th>
                  <th className="p-2 text-sm font-medium text-slate-700 border-b w-24">Quantity</th>
                  <th className="p-2 text-sm font-medium text-slate-700 border-b w-32">Rate</th>
                  <th className="p-2 text-sm font-medium text-slate-700 border-b w-32">Amount</th>
                  <th className="p-2 text-sm font-medium text-slate-700 border-b w-16"></th>
                </tr>
              </thead>
              <tbody>
                {currentInvoice.lineItems.length > 0 ? (
                  currentInvoice.lineItems.map((item) => (
                    <LineItem 
                      key={item.id}
                      item={item}
                      onUpdate={(field, value) => handleUpdateLineItem(item.id, field, value)}
                      onRemove={() => removeLineItem(item.id)}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-500">
                      No items added yet. Click "Add Item" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Calculations */}
        <div className="mb-6">
          <div className="flex flex-col space-y-2 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="taxRate" className="text-sm font-medium text-slate-700">
                  Tax Rate (%)
                </Label>
                <Input 
                  type="number" 
                  id="taxRate" 
                  name="taxRate"
                  value={currentInvoice.details.taxRate} 
                  onChange={handleDetailsChange}
                  min="0" 
                  max="100" 
                  step="0.1" 
                  className="w-full" 
                />
              </div>
              <div>
                <Label htmlFor="discount" className="text-sm font-medium text-slate-700">
                  Discount (₹)
                </Label>
                <Input 
                  type="number" 
                  id="discount" 
                  name="discount"
                  value={currentInvoice.details.discount} 
                  onChange={handleDetailsChange}
                  min="0" 
                  step="0.01" 
                  className="w-full" 
                />
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-slate-50 rounded-md">
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-mono">{formatCurrency(invoiceSubtotal)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Tax ({currentInvoice.details.taxRate}%):</span>
                <span className="font-mono">{formatCurrency(invoiceTaxAmount)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Discount:</span>
                <span className="font-mono">{formatCurrency(invoiceDiscountAmount)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between py-2 font-medium">
                <span className="text-slate-800">Total:</span>
                <span className="font-mono text-lg">{formatCurrency(invoiceTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="mb-6">
          <Label htmlFor="notes" className="text-sm font-medium text-slate-700">
            Notes
          </Label>
          <Textarea 
            id="notes" 
            name="notes"
            placeholder="Add any additional notes here..." 
            rows={2} 
            value={currentInvoice.details.notes}
            onChange={handleDetailsChange}
            className="w-full" 
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-end">
          <Button 
            variant="outline"
            onClick={resetInvoice}
            disabled={isLoading}
            className="bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Reset Form
          </Button>
          <Button 
            onClick={handleSaveInvoice}
            disabled={isLoading}
            className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4 mr-2" /> Save Invoice
          </Button>
          <Button 
            onClick={handleExportPDF}
            disabled={isLoading}
            className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <File className="h-4 w-4 mr-2" /> Export PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;
