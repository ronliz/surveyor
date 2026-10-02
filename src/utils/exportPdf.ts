import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SurveyProject, SurveyDevice, CableRun } from '../types/survey';
import { SYSTEM_NAMES } from '../constants/deviceCatalog';

export function exportProjectPdf(project: SurveyProject, canvasSnapshotDataUrl?: string): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 60, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('SYSTEM SURVEYOR SITE DESIGN REPORT', 40, 36);

  // Sub-header / metadata
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pageWidth - 40, 36, { align: 'right' });

  // Project Info Card
  doc.setFillColor(241, 245, 249); // slate-100
  doc.roundedRect(40, 75, pageWidth - 80, 50, 4, 4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`Project: ${project.name}`, 55, 95);
  doc.text(`Client: ${project.clientName || 'N/A'}`, 55, 112);

  doc.text(`Location: ${project.siteAddress || 'N/A'}`, 320, 95);
  doc.text(`Floor/Zone: ${project.floorName || 'N/A'}`, 320, 112);

  doc.text(`Scale: 1 ft = ${Math.round(project.scale.pixelsPerUnit)} px`, 580, 95);
  doc.text(`Total Devices: ${project.devices.length}`, 580, 112);

  let currentY = 135;

  // Render Floorplan Snapshot if available
  if (canvasSnapshotDataUrl) {
    const imgWidth = pageWidth - 80;
    const imgHeight = 240;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('Floorplan & System Layout', 40, currentY + 12);
    currentY += 20;

    doc.setDrawColor(203, 213, 225);
    doc.rect(40, currentY, imgWidth, imgHeight, 'S');
    doc.addImage(canvasSnapshotDataUrl, 'PNG', 40, currentY, imgWidth, imgHeight, undefined, 'FAST');
    currentY += imgHeight + 20;
  }

  // --- New Page for BOM & Hardware Schedules ---
  doc.addPage('a4', 'portrait');
  const portWidth = doc.internal.pageSize.getWidth();

  // Page Header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, portWidth, 50, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(`Bill of Materials - ${project.name}`, 40, 32);

  // Aggregate Devices
  const summaryMap: Record<string, {
    system: string;
    manufacturer: string;
    model: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
    tags: string[];
  }> = {};

  let totalBOMCost = 0;

  project.devices.forEach((dev: SurveyDevice) => {
    const key = `${dev.systemType}_${dev.manufacturer}_${dev.model}`;
    if (!summaryMap[key]) {
      summaryMap[key] = {
        system: SYSTEM_NAMES[dev.systemType] || dev.systemType,
        manufacturer: dev.manufacturer || 'Generic',
        model: dev.model || 'Standard Device',
        quantity: 0,
        unitCost: dev.estimatedCost || 0,
        totalCost: 0,
        tags: [],
      };
    }
    summaryMap[key].quantity += 1;
    summaryMap[key].totalCost += dev.estimatedCost || 0;
    summaryMap[key].tags.push(dev.name);
    totalBOMCost += dev.estimatedCost || 0;
  });

  const tableBody = Object.values(summaryMap).map(item => [
    item.system,
    item.manufacturer,
    item.model,
    item.quantity.toString(),
    `$${item.unitCost.toFixed(2)}`,
    `$${item.totalCost.toFixed(2)}`,
    item.tags.join(', ')
  ]);

  autoTable(doc, {
    startY: 65,
    head: [['System Category', 'Manufacturer', 'Model / Part #', 'Qty', 'Unit Price', 'Total', 'Device Tags']],
    body: tableBody,
    foot: [['Total Estimated Hardware Cost', '', '', `${project.devices.length}`, '', `$${totalBOMCost.toFixed(2)}`, '']],
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' },
    footStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 4 },
  });

  // Cable Schedule Table
  const finalY = (doc as any).lastAutoTable.finalY + 20;

  const cableTotals: Record<string, { count: number; totalLengthFt: number }> = {};
  project.cables.forEach((cable: CableRun) => {
    if (!cableTotals[cable.cableType]) {
      cableTotals[cable.cableType] = { count: 0, totalLengthFt: 0 };
    }
    cableTotals[cable.cableType].count += 1;
    cableTotals[cable.cableType].totalLengthFt += Math.round(cable.lengthFt);
  });

  const cableBody = Object.entries(cableTotals).map(([type, data]) => [
    type,
    data.count.toString(),
    `${data.totalLengthFt} ft`,
    `${(data.totalLengthFt * 0.3048).toFixed(1)} m`
  ]);

  if (cableBody.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('Cabling Infrastructure Schedule', 40, finalY);

    autoTable(doc, {
      startY: finalY + 10,
      head: [['Cable Type', 'Run Count', 'Estimated Total Length (Ft)', 'Estimated Total Length (M)']],
      body: cableBody,
      theme: 'grid',
      headStyles: { fillColor: [71, 85, 105], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 4 },
    });
  }

  // Save the PDF
  doc.save(`${project.name.replace(/\s+/g, '_')}_Survey_Report.pdf`);
}
