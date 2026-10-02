import React, { useState } from 'react';
import { FileText, Check, X, Sparkles, Loader2 } from 'lucide-react';
import { PdfPageInfo, renderPdfPageToDataUrl } from '../../utils/pdfLoader';
import { useSurveyStore } from '../../store/useSurveyStore';

interface PdfPageSelectorModalProps {
  pdfDoc: any;
  pages: PdfPageInfo[];
  fileName: string;
  onClose: () => void;
}

export const PdfPageSelectorModal: React.FC<PdfPageSelectorModalProps> = ({
  pdfDoc,
  pages,
  fileName,
  onClose,
}) => {
  const { setBackgroundImage, updateProjectInfo } = useSurveyStore();
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [renderQuality, setRenderQuality] = useState<number>(2.0); // 2x high resolution
  const [isRendering, setIsRendering] = useState<boolean>(false);

  const handleApplyPage = async () => {
    setIsRendering(true);
    try {
      const { dataUrl, width, height } = await renderPdfPageToDataUrl(pdfDoc, selectedPage, renderQuality);
      setBackgroundImage(dataUrl, width, height);
      updateProjectInfo({
        floorName: `Sheet ${selectedPage} (${fileName})`,
      });
      onClose();
    } catch (err) {
      console.error('Failed to render PDF page:', err);
      alert('Error rendering the selected PDF sheet.');
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-950 text-rose-400 border border-rose-800/50 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">PDF Architectural Blueprint Sheets</h2>
              <p className="text-xs text-slate-400">
                {fileName} &bull; {pages.length} sheet{pages.length > 1 ? 's' : ''} found
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quality selector bar */}
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <span className="text-xs text-slate-300 font-medium">
            Select the blueprint sheet to import as your floorplan:
          </span>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-400">Rendering Sharpness:</span>
            <select
              value={renderQuality}
              onChange={(e) => setRenderQuality(parseFloat(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="1.5">Standard (1.5x)</option>
              <option value="2.0">High-Res CAD (2.0x - Recommended)</option>
              <option value="3.0">Ultra-Sharp (3.0x - Large Blueprints)</option>
            </select>
          </div>
        </div>

        {/* Page Grid */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {pages.map((p) => {
            const isSelected = selectedPage === p.pageNumber;
            return (
              <div
                key={p.pageNumber}
                onClick={() => setSelectedPage(p.pageNumber)}
                className={`relative group rounded-xl border p-2 cursor-pointer transition flex flex-col items-center bg-slate-950 ${
                  isSelected
                    ? 'border-sky-500 ring-2 ring-sky-500/30 shadow-lg'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Thumbnail */}
                <div className="w-full h-44 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center border border-slate-800/80 mb-2">
                  <img
                    src={p.thumbnailUrl}
                    alt={`Page ${p.pageNumber}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Page Label */}
                <div className="flex items-center justify-between w-full px-1">
                  <span className="text-xs font-semibold text-slate-200">
                    Sheet / Page {p.pageNumber}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {Math.round(p.width)} &times; {Math.round(p.height)}
                  </span>
                </div>

                {/* Selection Checkmark */}
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-sky-600 text-white rounded-full p-1 shadow-md">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Selected: <span className="font-semibold text-slate-200">Sheet {selectedPage}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              disabled={isRendering}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg transition"
            >
              Cancel
            </button>

            <button
              onClick={handleApplyPage}
              disabled={isRendering}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow transition disabled:opacity-50"
            >
              {isRendering ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Converting PDF Sheet...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Load Blueprint to Canvas</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
