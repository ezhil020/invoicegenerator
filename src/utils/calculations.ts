import { LineItem } from "@/lib/types";

/**
 * Calculate the subtotal of all line items
 */
export const calculateSubtotal = (lineItems: LineItem[]): number => {
  return lineItems.reduce((total, item) => {
    return total + (item.quantity * item.rate);
  }, 0);
};

/**
 * Calculate the tax amount based on subtotal and tax rate
 */
export const calculateTaxAmount = (subtotal: number, taxRate: number): number => {
  return subtotal * (taxRate / 100);
};

/**
 * Calculate the final total after tax and discount
 */
export const calculateTotal = (
  subtotal: number, 
  taxAmount: number, 
  discountAmount: number
): number => {
  return subtotal + taxAmount - discountAmount;
};
