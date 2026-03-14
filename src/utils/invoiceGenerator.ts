import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoice = (order: any) => {
  // Use a standard font that supports only WinAnsiEncoding
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('PACK MY CAKE', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('TAX INVOICE', 105, 30, { align: 'center' });
  
  doc.text(`Invoice No: INV-${order.id}`, 20, 45);
  doc.text(`Order ID: ${order.id}`, 80, 45);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 140, 45);
  
  doc.line(20, 50, 190, 50);
  
  doc.text('Sold By:', 20, 60);
  doc.text('Pack My Cake', 20, 65);
  
  doc.text('Ship To:', 80, 60);
  doc.text(`${order.user?.name || 'Guest'}`, 80, 65);
  
  doc.text('Bill To:', 140, 60);
  doc.text(`${order.user?.name || 'Guest'}`, 140, 65);
  
  doc.line(20, 75, 190, 75);
  
  const tableData = (order.items || []).map((item: any, index: number) => [
    index + 1,
    item.product?.name || 'Product',
    '4819',
    item.quantity,
    (item.price || 0).toFixed(2),
    ((item.price || 0) * item.quantity).toFixed(2)
  ]);
  
  autoTable(doc, {
    startY: 80,
    head: [['Sr.', 'Product Description', 'HSN', 'Qty', 'Rate (INR)', 'Amount (INR)']],
    body: tableData,
    styles: { font: 'helvetica' }
  });
  
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.text(`Total Taxable: INR ${(order.totalAmount || 0).toFixed(2)}`, 140, finalY);
  doc.text(`Invoice Total: INR ${(order.totalAmount || 0).toFixed(2)}`, 140, finalY + 10);
  
  // Use arraybuffer for Node.js compatibility
  return doc.output('arraybuffer');
};
