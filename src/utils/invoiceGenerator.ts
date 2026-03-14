import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateInvoice = (order: any) => {
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
  doc.text(`${order.user.name}`, 80, 65);
  
  doc.text('Bill To:', 140, 60);
  doc.text(`${order.user.name}`, 140, 65);
  
  doc.line(20, 75, 190, 75);
  
  const tableData = order.items.map((item: any, index: number) => [
    index + 1,
    item.product.name,
    '4819',
    item.quantity,
    item.price.toFixed(2),
    (item.price * item.quantity).toFixed(2)
  ]);
  
  (doc as any).autoTable({
    startY: 80,
    head: [['Sr.', 'Product Description', 'HSN', 'Qty', 'Rate (₹)', 'Amount (₹)']],
    body: tableData,
  });
  
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.text(`Total Taxable: ₹${order.totalAmount.toFixed(2)}`, 140, finalY);
  doc.text(`Invoice Total: ₹${order.totalAmount.toFixed(2)}`, 140, finalY + 10);
  
  return doc.output('blob');
};
