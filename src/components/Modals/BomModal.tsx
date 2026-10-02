import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  X, 
  Search, 
  DollarSign, 
  Layers, 
  Package, 
  GitBranch 
} from 'lucide-react';
import { useSurveyStore } from '../../store/useSurveyStore';
import { SYSTEM_NAMES } from '../../constants/deviceCatalog';
import { exportBomCsv } from '../../utils/exportCsv';
import { SystemType } from '../../types/survey';

export const BomModal: React.FC = () => {
  const { project, setActiveModal } = useSurveyStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [systemFilter, setSystemFilter] = useState<SystemType | 'all'>('all');

  // Aggregate devices
  const summaryMap: Record<string, {
    key: string;
    system: string;
    systemType: SystemType;
    manufacturer: string;
    model: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
    tags: string[];
  }> = {};

  let grandTotal = 0;
  let totalItems = 0;

  project.devices.forEach((dev) => {
    const key = `${dev.systemType}_${dev.manufacturer}_${dev.model}`;
    if (!summaryMap[key]) {
      summaryMap[key] = {
        key,
        system: SYSTEM_NAMES[dev.systemType] || dev.systemType,
        systemType: dev.systemType,
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
    grandTotal += dev.estimatedCost || 0;
    totalItems += 1;
  });

  // Cable stats
  const cableTotals: Record<string, { count: number; totalLengthFt: number }> = {};
  project.cables.forEach((c) => {
    if (!cableTotals[c.cableType]) {
      cableTotals[c.cableType] = { count: 0, totalLengthFt: 0 };
    }
    cableTotals[c.cableType].count += 1;
    cableTotals[c.cableType].totalLengthFt += Math.round(c.lengthFt);
  });

  const filteredItems = Object.values(summaryMap).filter((item) => {
    const matchSystem = systemFilter === 'all' || item.systemType === systemFilter;
    const matchSearch = item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSystem && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-950 text-emerald-400 border border-emerald-800/50 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Bill of Materials (BOM) & Equipment Schedule</h2>
              <p className="text-xs text-slate-400">{project.name} &bull; {project.floorName}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => exportBomCsv(project)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center space-x-3">
            <Package className="w-6 h-6 text-sky-400" />
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Total Hardware Items</div>
              <div className="text-xl font-bold text-slate-100">{totalItems} units</div>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center space-x-3">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Estimated Hardware Total</div>
              <div className="text-xl font-bold text-emerald-400">${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center space-x-3">
            <GitBranch className="w-6 h-6 text-purple-400" />
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Total Cable Runs</div>
              <div className="text-xl font-bold text-purple-400">{project.cables.length} routes</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/40 flex items-center space-x-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by model, manufacturer, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          <select
            value={systemFilter}
            onChange={(e) => setSystemFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="all">All Disciplines</option>
            <option value="cctv">Video Surveillance</option>
            <option value="access">Access Control</option>
            <option value="intrusion">Intrusion</option>
            <option value="fire">Fire & Safety</option>
            <option value="network">Network & Wi-Fi</option>
            <option value="audio">Audio / Intercom</option>
            <option value="infrastructure">Infrastructure</option>
          </select>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Hardware Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Hardware Schedule ({filteredItems.length} line items)
            </h3>
            <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-2.5">System Discipline</th>
                  <th className="p-2.5">Manufacturer</th>
                  <th className="p-2.5">Model / Part</th>
                  <th className="p-2.5 text-center">Qty</th>
                  <th className="p-2.5 text-right">Unit Price</th>
                  <th className="p-2.5 text-right">Subtotal</th>
                  <th className="p-2.5">Device Tags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredItems.map((item) => (
                  <tr key={item.key} className="hover:bg-slate-800/40">
                    <td className="p-2.5 font-medium text-slate-300">{item.system}</td>
                    <td className="p-2.5 text-slate-400">{item.manufacturer}</td>
                    <td className="p-2.5 text-slate-200 font-mono">{item.model}</td>
                    <td className="p-2.5 text-center font-bold text-sky-400">{item.quantity}</td>
                    <td className="p-2.5 text-right text-slate-300">${item.unitCost.toFixed(2)}</td>
                    <td className="p-2.5 text-right font-semibold text-emerald-400">${item.totalCost.toFixed(2)}</td>
                    <td className="p-2.5 text-[11px] text-slate-400 max-w-xs truncate">{item.tags.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cable Infrastructure Table */}
          {Object.keys(cableTotals).length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Cable Infrastructure Schedule
              </h3>
              <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Cable Type</th>
                    <th className="p-2.5 text-center">Run Count</th>
                    <th className="p-2.5 text-right">Total Length (Ft)</th>
                    <th className="p-2.5 text-right">Total Length (Meters)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {Object.entries(cableTotals).map(([type, data]) => (
                    <tr key={type} className="hover:bg-slate-800/40">
                      <td className="p-2.5 font-medium text-slate-200">{type}</td>
                      <td className="p-2.5 text-center font-bold text-purple-400">{data.count}</td>
                      <td className="p-2.5 text-right font-mono text-slate-300">{data.totalLengthFt} ft</td>
                      <td className="p-2.5 text-right font-mono text-slate-400">{(data.totalLengthFt * 0.3048).toFixed(1)} m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
