import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  X, 
  Check, 
  Layers, 
  Image as ImageIcon,
  ShieldCheck
} from 'lucide-react';
import { useSurveyStore } from '../../store/useSurveyStore';
import { exportProjectPdf } from '../../utils/exportPdf';

export const ExportReportModal: React.FC = () => {
  const { project, setActiveModal } = useSurveyStore();
  const [includeBOM, setIncludeBOM] = useState(true);
  const [includeCables, setIncludeCables] = useState(true);
  const [includeSnapshot, setIncludeSnapshot] = useState(true);

  const handleGeneratePdf = () => {
    // Capture current canvas as snapshot image
    const canvas = document.querySelector('canvas');
    const snapshotUrl = includeSnapshot && canvas ? canvas.toDataURL('image/png') : undefined;
    exportProjectPdf(project, snapshotUrl);
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-sky-950 text-sky-400 border border-sky-800/50 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                Export Survey Report (PDF)
              </h2>
              <p className="text-xs text-slate-400">Generate executive physical security site survey document</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-300">Report Inclusions:</div>

          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
            <div className="flex items-center space-x-2.5">
              <ImageIcon className="w-4 h-4 text-sky-400" />
              <div>
                <div className="text-xs font-semibold text-slate-200">Floorplan Layout Snapshot</div>
                <div className="text-[11px] text-slate-400">High-resolution visual markup with FoV cones & devices</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeSnapshot}
              onChange={(e) => setIncludeSnapshot(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-sky-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
            <div className="flex items-center space-x-2.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs font-semibold text-slate-200">Itemized Bill of Materials (BOM)</div>
                <div className="text-[11px] text-slate-400">Full hardware schedule, models, tags, and cost breakdown</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeBOM}
              onChange={(e) => setIncludeBOM(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-sky-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-xs font-semibold text-slate-200">Cabling & Network Schedule</div>
                <div className="text-[11px] text-slate-400">Calculated cable run lengths, types, and port notes</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeCables}
              onChange={(e) => setIncludeCables(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-sky-500"
            />
          </label>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGeneratePdf}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow"
          >
            <Download className="w-4 h-4" />
            <span>Generate & Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
