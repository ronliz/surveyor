import { SurveyDevice, CableRun, SurveyProject } from '../types/survey';
import { SYSTEM_NAMES } from '../constants/deviceCatalog';

export function exportBomCsv(project: SurveyProject): void {
  // Aggregate devices by manufacturer, model, system
  const summaryMap: Record<string, {
    system: string;
    manufacturer: string;
    model: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
    tags: string[];
  }> = {};

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
  });

  // Calculate cable run totals
  const cableTotals: Record<string, { count: number; totalLengthFt: number }> = {};
  project.cables.forEach((cable: CableRun) => {
    if (!cableTotals[cable.cableType]) {
      cableTotals[cable.cableType] = { count: 0, totalLengthFt: 0 };
    }
    cableTotals[cable.cableType].count += 1;
    cableTotals[cable.cableType].totalLengthFt += Math.round(cable.lengthFt);
  });

  // Build CSV content
  const rows: string[][] = [
    ['SYSTEM SURVEYOR - BILL OF MATERIALS (BOM) REPORT'],
    [`Project: ${project.name}`, `Client: ${project.clientName}`, `Date: ${new Date().toLocaleDateString()}`],
    [`Location: ${project.siteAddress}`, `Floor: ${project.floorName}`],
    [],
    ['--- HARDWARE & DEVICE SCHEDULE ---'],
    ['System Category', 'Manufacturer', 'Model / Part Number', 'Quantity', 'Unit Cost ($)', 'Total Cost ($)', 'Device Tags / IDs'],
  ];

  let grandTotal = 0;
  let totalDeviceCount = 0;

  Object.values(summaryMap).forEach(item => {
    grandTotal += item.totalCost;
    totalDeviceCount += item.quantity;
    rows.push([
      `"${item.system}"`,
      `"${item.manufacturer}"`,
      `"${item.model}"`,
      `${item.quantity}`,
      `$${item.unitCost.toFixed(2)}`,
      `$${item.totalCost.toFixed(2)}`,
      `"${item.tags.join(', ')}"`
    ]);
  });

  rows.push([]);
  rows.push(['TOTAL HARDWARE ITEMS', '', '', `${totalDeviceCount}`, '', `$${grandTotal.toFixed(2)}`, '']);
  rows.push([]);

  // Cable schedule
  rows.push(['--- CABLE RUN SCHEDULE ---']);
  rows.push(['Cable Type', 'Number of Runs', 'Estimated Total Length (ft)', 'Estimated Total Length (m)']);
  Object.entries(cableTotals).forEach(([type, data]) => {
    const meters = (data.totalLengthFt * 0.3048).toFixed(1);
    rows.push([`"${type}"`, `${data.count}`, `${data.totalLengthFt} ft`, `${meters} m`]);
  });

  const csvContent = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${project.name.replace(/\s+/g, '_')}_BOM_Report.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
