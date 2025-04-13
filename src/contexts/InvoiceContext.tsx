import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { nanoid } from "nanoid";
import { 
  Invoice, 
  InvoiceForm, 
  LineItem, 
  FilterOptions, 
  PaginationInfo 
} from "@/lib/types";
import { calculateSubtotal, calculateTaxAmount, calculateTotal } from "@/utils/calculations";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

interface InvoiceContextProps {
  currentInvoice: InvoiceForm;
  updateInvoice: (updates: Partial<InvoiceForm>) => void;
  addLineItem: () => void;
  updateLineItem: (id: string, updates: Partial<LineItem>) => void;
  removeLineItem: (id: string) => void;
  resetInvoice: () => void;
  saveInvoice: () => Promise<void>;
  invoiceSubtotal: number;
  invoiceTaxAmount: number;
  invoiceTotal: number;
  invoiceDiscountAmount: number;
  isLoading: boolean;
  generateNextInvoiceNumber: () => Promise<string>;
  invoices: Invoice[];
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
  paginationInfo: PaginationInfo;
  setPage: (page: number) => void;
  refreshInvoices: () => void;
}

const defaultLineItem: LineItem = {
  id: nanoid(),
  description: "",
  quantity: 1,
  rate: 0
};

const defaultInvoiceForm: InvoiceForm = {
  client: {
    name: "",
    email: "",
    address: ""
  },
  details: {
    invoiceNumber: "INV-0001",
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: "Thank you for your business!",
    taxRate: 7.5,
    discount: 0
  },
  lineItems: [{ ...defaultLineItem }]
};

const InvoiceContext = createContext<InvoiceContextProps | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceForm>(defaultInvoiceForm);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  
  const { toast } = useToast();

  const invoiceSubtotal = calculateSubtotal(currentInvoice.lineItems);
  const invoiceTaxAmount = calculateTaxAmount(invoiceSubtotal, currentInvoice.details.taxRate);
  const invoiceDiscountAmount = currentInvoice.details.discount;
  const invoiceTotal = calculateTotal(invoiceSubtotal, invoiceTaxAmount, invoiceDiscountAmount);

  // Fetch invoices with filtering and pagination
  const queryParams = new URLSearchParams();
  
  if (filterOptions.clientName) queryParams.append('clientName', filterOptions.clientName);
  if (filterOptions.startDate) queryParams.append('startDate', filterOptions.startDate);
  if (filterOptions.endDate) queryParams.append('endDate', filterOptions.endDate);
  if (filterOptions.status) queryParams.append('status', filterOptions.status);
  queryParams.append('page', String(paginationInfo.currentPage));
  queryParams.append('limit', String(paginationInfo.itemsPerPage));
  
  const { data, isLoading, refetch } = useQuery<{
    invoices: Invoice[],
    pagination: PaginationInfo
  }>({
    queryKey: [`/api/invoices?${queryParams.toString()}`],
  });

  const saveMutation = useMutation({
    mutationFn: async (invoiceData: any) => {
      const response = await apiRequest('POST', '/api/invoices', invoiceData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      toast({
        title: "Success",
        description: "Invoice saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save invoice: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update pagination info when data changes
  useEffect(() => {
    if (data?.pagination) {
      setPaginationInfo(data.pagination);
    }
  }, [data]);

  // Initialize invoice with next number
  useEffect(() => {
    generateNextInvoiceNumber().then(number => {
      setCurrentInvoice(prev => ({
        ...prev,
        details: {
          ...prev.details,
          invoiceNumber: number
        }
      }));
    });
  }, []);

  const updateInvoice = (updates: Partial<InvoiceForm>) => {
    setCurrentInvoice(prev => ({
      ...prev,
      ...updates,
      client: {
        ...prev.client,
        ...(updates.client || {})
      },
      details: {
        ...prev.details,
        ...(updates.details || {})
      }
    }));
  };

  const addLineItem = () => {
    setCurrentInvoice(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { ...defaultLineItem, id: nanoid() }]
    }));
  };

  const updateLineItem = (id: string, updates: Partial<LineItem>) => {
    setCurrentInvoice(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  };

  const removeLineItem = (id: string) => {
    setCurrentInvoice(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id)
    }));
  };

  const resetInvoice = async () => {
    const nextNumber = await generateNextInvoiceNumber();
    setCurrentInvoice({
      ...defaultInvoiceForm,
      details: {
        ...defaultInvoiceForm.details,
        invoiceNumber: nextNumber,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      lineItems: [{ ...defaultLineItem, id: nanoid() }]
    });
  };

  const saveInvoice = async () => {
    try {
      // Prepare complete invoice data with calculations
      const invoiceData = {
        ...currentInvoice,
        subtotal: invoiceSubtotal,
        taxAmount: invoiceTaxAmount,
        discountAmount: invoiceDiscountAmount,
        total: invoiceTotal,
        status: 'pending' as const
      };

      await saveMutation.mutateAsync(invoiceData);
      await resetInvoice();
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };

  const generateNextInvoiceNumber = async (): Promise<string> => {
    try {
      const response = await fetch('/api/invoices/next-number');
      const data = await response.json();
      return data.nextNumber;
    } catch (error) {
      console.error("Error generating next invoice number:", error);
      return "INV-0001";
    }
  };

  const setPage = (page: number) => {
    setPaginationInfo(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  const refreshInvoices = () => {
    refetch();
  };

  return (
    <InvoiceContext.Provider value={{
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
      isLoading: isLoading || saveMutation.isPending,
      generateNextInvoiceNumber,
      invoices: data?.invoices || [],
      filterOptions,
      setFilterOptions,
      paginationInfo,
      setPage,
      refreshInvoices
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error("useInvoice must be used within an InvoiceProvider");
  }
  return context;
};
