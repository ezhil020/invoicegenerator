import React, { useState } from "react";
import { Link } from "wouter";
import { useInvoice } from "@/contexts/InvoiceContext";
import { formatCurrency } from "@/utils/formatters";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generatePDF } from "@/utils/pdf";
import { Filter, Eye, Edit, File } from "lucide-react";

const InvoiceHistory: React.FC = () => {
  const { 
    invoices, 
    filterOptions, 
    setFilterOptions, 
    paginationInfo, 
    setPage,
    isLoading 
  } = useInvoice();
  
  const [tempFilters, setTempFilters] = useState({
    clientName: filterOptions.clientName || "",
    startDate: filterOptions.startDate || "",
    endDate: filterOptions.endDate || ""
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    setFilterOptions({
      clientName: tempFilters.clientName,
      startDate: tempFilters.startDate,
      endDate: tempFilters.endDate
    });
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return "bg-green-100 text-green-800";
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'overdue':
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const handleExportPDF = (invoice: any) => {
    generatePDF(
      {
        client: invoice.client,
        details: invoice.details,
        lineItems: invoice.lineItems
      },
      invoice.subtotal,
      invoice.taxAmount,
      invoice.discountAmount,
      invoice.total
    );
  };

  return (
    <Card className="shadow-md mt-8">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-semibold text-slate-800">Invoice History</h2>
          <div className="flex space-x-2 flex-wrap gap-2">
            <Input 
              type="text" 
              placeholder="Search by client..." 
              name="clientName"
              value={tempFilters.clientName}
              onChange={handleFilterChange}
              className="w-auto min-w-[200px]"
            />
            <Input 
              type="date" 
              name="startDate"
              value={tempFilters.startDate}
              onChange={handleFilterChange}
              className="w-auto"
            />
            <Input 
              type="date" 
              name="endDate"
              value={tempFilters.endDate}
              onChange={handleFilterChange}
              className="w-auto"
            />
            <Button 
              onClick={applyFilters}
              className="bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors"
            >
              <Filter className="h-4 w-4 mr-1" /> Filter
            </Button>
          </div>
        </div>

        {/* Invoice List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="p-3 text-sm font-medium text-slate-700 border-b">Invoice #</th>
                <th className="p-3 text-sm font-medium text-slate-700 border-b">Date</th>
                <th className="p-3 text-sm font-medium text-slate-700 border-b">Client</th>
                <th className="p-3 text-sm font-medium text-slate-700 border-b">Amount</th>
                <th className="p-3 text-sm font-medium text-slate-700 border-b">Status</th>
                <th className="p-3 text-sm font-medium text-slate-700 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center">Loading invoices...</td>
                </tr>
              ) : invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-slate-50">
                    <td className="p-3 text-sm">{invoice.details.invoiceNumber}</td>
                    <td className="p-3 text-sm">{invoice.details.date}</td>
                    <td className="p-3 text-sm">{invoice.client.name}</td>
                    <td className="p-3 text-sm font-mono">{formatCurrency(invoice.total)}</td>
                    <td className="p-3 text-sm">
                      <Badge 
                        variant="outline" 
                        className={`${getStatusBadgeStyle(invoice.status)} text-xs px-2.5 py-0.5 rounded-full`}
                      >
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm">
                      <div className="flex space-x-2">
                        <Link href={`/invoice/${invoice.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-800">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/invoice/${invoice.id}/edit`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-800">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-blue-600 hover:text-blue-800"
                          onClick={() => handleExportPDF(invoice)}
                        >
                          <File className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-500">
                    No invoices found. Create your first invoice using the form above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {invoices.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-slate-600">
              Showing {((paginationInfo.currentPage - 1) * paginationInfo.itemsPerPage) + 1}-
              {Math.min(paginationInfo.currentPage * paginationInfo.itemsPerPage, paginationInfo.totalItems)} of {paginationInfo.totalItems} invoices
            </p>
            <div className="flex space-x-1">
              <Button 
                onClick={() => setPage(paginationInfo.currentPage - 1)}
                disabled={paginationInfo.currentPage === 1}
                variant="outline"
                size="sm"
                className="px-3 py-1"
              >
                Previous
              </Button>
              
              {[...Array(paginationInfo.totalPages)].map((_, index) => (
                <Button 
                  key={index}
                  onClick={() => setPage(index + 1)}
                  variant={paginationInfo.currentPage === index + 1 ? "default" : "outline"}
                  size="sm"
                  className={`px-3 py-1 ${paginationInfo.currentPage === index + 1 ? 'bg-blue-600 text-white' : ''}`}
                >
                  {index + 1}
                </Button>
              ))}
              
              <Button 
                onClick={() => setPage(paginationInfo.currentPage + 1)}
                disabled={paginationInfo.currentPage === paginationInfo.totalPages}
                variant="outline"
                size="sm"
                className="px-3 py-1"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceHistory;
