export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface Client {
  name: string;
  email: string;
  address: string;
}

export interface InvoiceDetails {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  notes: string;
  taxRate: number;
  discount: number;
}

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue';

export interface Invoice {
  id: string;
  client: Client;
  details: InvoiceDetails;
  lineItems: LineItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  status: InvoiceStatus;
  createdAt: string;
}

export interface InvoiceForm {
  client: Client;
  details: InvoiceDetails;
  lineItems: LineItem[];
}

// Filter options for invoice history
export interface FilterOptions {
  clientName?: string;
  startDate?: string;
  endDate?: string;
  status?: InvoiceStatus;
}

// For pagination
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
