import jsPDF from 'jspdf';

export const generateBudgetPDF = (budget: any, items: any[] = []) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235); // Blue-600
  doc.text('VIVERO CRM', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Presupuesto Comercial', 14, 28);
  
  // Budget Info
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(`Nº: ${budget.budget_code}`, pageWidth - 14, 22, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${new Date(budget.issue_date).toLocaleDateString('es-AR')}`, pageWidth - 14, 28, { align: 'right' });
  
  // Client Info
  doc.setDrawColor(220, 220, 220);
  doc.line(14, 35, pageWidth - 14, 35);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('CLIENTE:', 14, 45);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(budget.customer_name.toUpperCase(), 14, 52);
  doc.setFont('helvetica', 'normal');
  
  if (budget.customer_email) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Email: ${budget.customer_email}`, 14, 58);
  }
  
  // Manual Table Header
  let currentY = 75;
  doc.setFillColor(37, 99, 235);
  doc.rect(14, currentY, pageWidth - 28, 10, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('DESCRIPCIÓN', 20, currentY + 7);
  doc.text('CANT.', 120, currentY + 7, { align: 'center' });
  doc.text('P. UNITARIO', 150, currentY + 7, { align: 'right' });
  doc.text('SUBTOTAL', pageWidth - 20, currentY + 7, { align: 'right' });
  
  // Table Rows
  currentY += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  
  const displayItems = items.length > 0 ? items : [{
    product_name: 'Productos y Servicios Varios',
    quantity: 1,
    unit_price: budget.total_amount
  }];
  
  displayItems.forEach((item, index) => {
    const isEven = index % 2 === 0;
    if (!isEven) {
      doc.setFillColor(245, 245, 245);
      doc.rect(14, currentY, pageWidth - 28, 10, 'F');
    }
    
    doc.text(item.product_name || 'Producto', 20, currentY + 7);
    doc.text(item.quantity.toString(), 120, currentY + 7, { align: 'center' });
    doc.text(new Intl.NumberFormat('es-AR').format(item.unit_price), 150, currentY + 7, { align: 'right' });
    doc.text(new Intl.NumberFormat('es-AR').format(item.quantity * item.unit_price), pageWidth - 20, currentY + 7, { align: 'right' });
    
    currentY += 10;
  });
  
  // Totals Area
  currentY += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(pageWidth - 90, currentY, pageWidth - 14, currentY);
  
  currentY += 10;
  doc.setFontSize(10);
  doc.text('SUBTOTAL:', pageWidth - 90, currentY);
  doc.text(new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(budget.total_amount * 0.79), pageWidth - 14, currentY, { align: 'right' });
  
  currentY += 8;
  doc.text('IVA (21%):', pageWidth - 90, currentY);
  doc.text(new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(budget.total_amount * 0.21), pageWidth - 14, currentY, { align: 'right' });
  
  currentY += 12;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text('TOTAL FINAL:', pageWidth - 90, currentY);
  doc.text(new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(budget.total_amount), pageWidth - 14, currentY, { align: 'right' });
  
  // Footer
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(150, 150, 150);
  const footerText = 'Este presupuesto tiene una validez de 15 días. Sujeto a disponibilidad de stock.';
  doc.text(footerText, pageWidth / 2, 280, { align: 'center' });
  
  // Save
  doc.save(`${budget.budget_code}_${budget.customer_name.replace(/\s+/g, '_')}.pdf`);
};
