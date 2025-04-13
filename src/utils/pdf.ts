import { jsPDF } from "jspdf";
import { InvoiceForm } from "@/lib/types";
import { formatCurrency, formatDate } from "./formatters";

export const generatePDF = (
  invoice: InvoiceForm,
  subtotal: number,
  taxAmount: number,
  discountAmount: number,
  total: number
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Set font
  doc.setFont("helvetica");

  // Add logo placeholder
  doc.setFillColor(240, 240, 240);
  doc.rect(15, 15, 50, 15, "F");
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("Your Company Logo", 40, 22.5, { align: "center" });

  // Company info
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Your Company Name", 15, 40);
  doc.text("123 Business Street", 15, 45);
  doc.text("City, State 12345", 15, 50);
  doc.text("contact@yourcompany.com", 15, 55);

  // Invoice title and number
  doc.setFontSize(20);
  doc.setTextColor(50, 50, 50);
  doc.text("INVOICE", 195, 25, { align: "right" });
  doc.setFontSize(12);
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text(`#${invoice.details.invoiceNumber}`, 195, 32, { align: "right" });

  // Dates
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Date: ${formatDate(invoice.details.date)}`, 195, 40, { align: "right" });
  doc.text(`Due Date: ${formatDate(invoice.details.dueDate)}`, 195, 45, { align: "right" });

  // Client info
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("BILL TO", 15, 70);
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.text(invoice.client.name || "Client Name", 15, 77);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(invoice.client.email || "client@example.com", 15, 82);
  
  // Split address into multiple lines if needed
  const addressLines = invoice.client.address ? invoice.client.address.split('\n') : ["Client Address"];
  addressLines.forEach((line, index) => {
    doc.text(line, 15, 87 + (index * 5));
  });

  // Table header
  const tableTop = 105;
  doc.setFillColor(248, 250, 252); // Light gray background
  doc.rect(15, tableTop, 180, 10, "F");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Item Description", 20, tableTop + 6);
  doc.text("Qty", 130, tableTop + 6, { align: "right" });
  doc.text("Rate", 155, tableTop + 6, { align: "right" });
  doc.text("Amount", 190, tableTop + 6, { align: "right" });
  
  // Draw header line
  doc.setDrawColor(200, 200, 200);
  doc.line(15, tableTop + 10, 195, tableTop + 10);

  // Table content
  let y = tableTop + 15;
  invoice.lineItems.forEach((item) => {
    doc.setTextColor(50, 50, 50);
    doc.text(item.description || "Item Description", 20, y);
    doc.text(item.quantity.toString(), 130, y, { align: "right" });
    doc.text(formatCurrency(item.rate), 155, y, { align: "right" });
    doc.text(formatCurrency(item.quantity * item.rate), 190, y, { align: "right" });
    
    // Draw row line
    doc.setDrawColor(240, 240, 240);
    doc.line(15, y + 5, 195, y + 5);
    
    y += 15;
  });

  // Summary
  const summaryX = 135;
  let summaryY = y + 10;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Subtotal:", summaryX, summaryY);
  doc.text(formatCurrency(subtotal), 190, summaryY, { align: "right" });
  
  summaryY += 8;
  doc.text(`Tax (${invoice.details.taxRate}%):`, summaryX, summaryY);
  doc.text(formatCurrency(taxAmount), 190, summaryY, { align: "right" });
  
  summaryY += 8;
  doc.text("Discount:", summaryX, summaryY);
  doc.text(formatCurrency(discountAmount), 190, summaryY, { align: "right" });
  
  // Total
  summaryY += 8;
  doc.setDrawColor(200, 200, 200);
  doc.line(summaryX, summaryY, 195, summaryY);
  
  summaryY += 8;
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.text("Total:", summaryX, summaryY);
  doc.text(formatCurrency(total), 190, summaryY, { align: "right" });

  // Notes
  const notesY = summaryY + 20;
  doc.setDrawColor(200, 200, 200);
  doc.line(15, notesY, 195, notesY);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Notes", 15, notesY + 8);
  doc.setTextColor(80, 80, 80);
  doc.text(invoice.details.notes || "Thank you for your business!", 15, notesY + 15);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("This invoice was created using the Invoice Generator App", 105, 280, { align: "center" });

  // Save the PDF
  doc.save(`Invoice-${invoice.details.invoiceNumber}.pdf`);
};
